"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function getTodayNutrition(userId: string) {
  // Normalize date to start of day for accurate grouping
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  let nutrition = await prisma.nutrition.findFirst({
    where: {
      userId,
      date: {
        gte: today,
        lt: tomorrow,
      }
    }
  });

  if (!nutrition) {
    nutrition = await prisma.nutrition.create({
      data: {
        userId,
        dailyCalories: 2000, // Defualt goal, could be pulled from profile later
        consumedCalories: 0,
        waterIntake: 0,
        date: new Date(), // Storing current datetime but retrieving via range
      }
    });
  }

  return nutrition;
}

export async function addWater(amountLiters: number) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) return { error: "Not authenticated" };

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return { error: "User not found" };

  try {
    const nutrition = await getTodayNutrition(user.id);
    await prisma.nutrition.update({
      where: { id: nutrition.id },
      data: { waterIntake: nutrition.waterIntake + amountLiters }
    });

    revalidatePath("/nutrition");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { error: "Failed to log water" };
  }
}

export async function addCalories(amount: number) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) return { error: "Not authenticated" };

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return { error: "User not found" };

  try {
    const nutrition = await getTodayNutrition(user.id);
    await prisma.nutrition.update({
      where: { id: nutrition.id },
      data: { consumedCalories: nutrition.consumedCalories + amount }
    });

    revalidatePath("/nutrition");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { error: "Failed to log calories" };
  }
}

export async function updateCalorieGoal(amount: number) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) return { error: "Not authenticated" };

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return { error: "User not found" };

  try {
    const nutrition = await getTodayNutrition(user.id);
    await prisma.nutrition.update({
      where: { id: nutrition.id },
      data: { dailyCalories: amount }
    });

    revalidatePath("/nutrition");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update target" };
  }
}
