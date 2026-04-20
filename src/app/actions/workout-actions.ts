"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createWorkout(name: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return { error: "Not authenticated" };
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return { error: "User not found" };

  try {
    const workout = await prisma.workout.create({
      data: {
        userId: user.id,
        name,
        completed: false
      }
    });
    revalidatePath("/workouts");
    return { success: true, workoutId: workout.id };
  } catch (error) {
    console.error("Failed to create workout:", error);
    return { error: "Failed to create workout" };
  }
}

export async function logSet(workoutId: string, exerciseId: string, reps: number, weight: number) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) return { error: "Not authenticated" };

  try {
    // We will use the 'sets' column as an incremental set number counter for this exercise in this workout
    const currentSets = await prisma.workoutDetails.count({
      where: { workoutId, exerciseId }
    });

    await prisma.workoutDetails.create({
      data: {
        workoutId,
        exerciseId,
        sets: currentSets + 1, // Set number
        reps,
        weight
      }
    });

    revalidatePath(`/workouts/${workoutId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to log set:", error);
    return { error: "Failed to log set" };
  }
}

export async function finishWorkout(workoutId: string) {
  try {
    await prisma.workout.update({
      where: { id: workoutId },
      data: { completed: true }
    });
    revalidatePath("/workouts");
    revalidatePath(`/workouts/${workoutId}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to complete workout" };
  }
}
