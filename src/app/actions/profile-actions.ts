"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function mutateUserProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.email) {
    return { error: "Not authenticated" };
  }

  const name = formData.get("name") as string;
  const gender = formData.get("gender") as string;
  const bio = formData.get("bio") as string;
  const healthIssues = formData.get("healthIssues") as string;
  const foodPreferences = formData.get("foodPreferences") as string;
  const dailyRoutine = formData.get("dailyRoutine") as string;
  const workProfile = formData.get("workProfile") as string;
  
  const height = formData.get("height") ? parseFloat(formData.get("height") as string) : undefined;
  const weight = formData.get("weight") ? parseFloat(formData.get("weight") as string) : undefined;
  const age = formData.get("age") ? parseInt(formData.get("age") as string, 10) : undefined;
  const activityLevel = formData.get("activityLevel") as string;

  try {
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: name || undefined,
        gender: gender || undefined,
        bio: bio || undefined,
        healthIssues: healthIssues || undefined,
        foodPreferences: foodPreferences || undefined,
        dailyRoutine: dailyRoutine || undefined,
        workProfile: workProfile || undefined,
        height,
        weight,
        age,
        activityLevel: activityLevel || undefined,
      }
    });

    revalidatePath("/profile");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update profile:", error);
    return { error: "Failed to update profile" };
  }
}
