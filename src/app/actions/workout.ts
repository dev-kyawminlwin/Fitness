"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createWorkout(name: string, date: Date) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Unauthorized" };

  const workout = await prisma.workout.create({
    data: {
      userId: (session.user as any).id,
      name,
      date,
    }
  });

  revalidatePath("/workouts");
  return { success: true, workout };
}

export async function addExerciseToWorkout(workoutId: string, exerciseId: string, sets: number, reps: number, weight: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Unauthorized" };

  const workout = await prisma.workout.findUnique({ where: { id: workoutId } });
  if (!workout || workout.userId !== (session.user as any).id) {
    return { error: "Not found or unauthorized" };
  }

  const details = await prisma.workoutDetails.create({
    data: {
      workoutId,
      exerciseId,
      sets,
      reps,
      weight
    }
  });

  revalidatePath(`/workouts/${workoutId}`);
  return { success: true, details };
}

export async function completeWorkout(workoutId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Unauthorized" };

  const workout = await prisma.workout.updateMany({
    where: { 
      id: workoutId,
      userId: (session.user as any).id 
    },
    data: {
      completed: true
    }
  });

  revalidatePath("/workouts");
  revalidatePath("/dashboard");
  return { success: true };
}
