"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { calculateDailyCalories, ActivityLevel } from "@/lib/calorieCalculator";
import { revalidatePath } from "next/cache";

export async function recalculateUserCalories(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || !user.gender || !user.weight || !user.height || !user.age || !user.activityLevel) {
    throw new Error("Missing user data for calorie calculation");
  }

  const dailyCalories = calculateDailyCalories({
    gender: user.gender as 'MALE' | 'FEMALE',
    weight: user.weight,
    height: user.height,
    age: user.age,
    activityLevel: user.activityLevel as ActivityLevel
  });

  // Today's date (beginning of the day)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const existingLog = await prisma.nutrition.findFirst({
    where: {
      userId,
      date: {
        gte: today,
        lt: tomorrow
      }
    }
  });

  if (existingLog) {
    await prisma.nutrition.update({
      where: { id: existingLog.id },
      data: { dailyCalories }
    });
  } else {
    await prisma.nutrition.create({
      data: {
        userId,
        dailyCalories,
        date: today
      }
    });
  }
}

export async function logCalories(calories: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Unauthorized" };

  const userId = (session.user as any).id;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  let log = await prisma.nutrition.findFirst({
    where: {
      userId: userId,
      date: {
        gte: today,
        lt: tomorrow
      }
    }
  });

  if (log) {
    log = await prisma.nutrition.update({
      where: { id: log.id },
      data: {
        consumedCalories: log.consumedCalories + calories
      }
    });
  } else {
    // If no log exists for today, try recalculating first to set the goal
    // We can assume user exists
    let goal = 0;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user && user.gender && user.weight && user.height && user.age && user.activityLevel) {
      goal = calculateDailyCalories({
        gender: user.gender as 'MALE' | 'FEMALE',
        weight: user.weight,
        height: user.height,
        age: user.age,
        activityLevel: user.activityLevel as ActivityLevel
      });
    }

    log = await prisma.nutrition.create({
      data: {
        userId,
        date: today,
        dailyCalories: goal,
        consumedCalories: calories
      }
    });
  }

  revalidatePath("/nutrition");
  revalidatePath("/dashboard");
  return { success: true, log };
}
