"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

export async function registerUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string || "USER";

  if (!email || !password) {
    return { error: "Email and password required" };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Email already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role
    }
  });

  return { success: true };
}
