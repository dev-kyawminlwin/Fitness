import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyMobileAuth } from "@/lib/mobileAuth";

export async function GET(request: Request) {
  const auth = verifyMobileAuth(request);
  if (auth.error) return auth.error;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  try {
    let nutrition = await prisma.nutrition.findFirst({
      where: { userId: auth.user!.id, date: { gte: today, lt: tomorrow } }
    });

    if (!nutrition) {
      nutrition = await prisma.nutrition.create({
        data: {
          userId: auth.user!.id,
          dailyCalories: 2000,
          consumedCalories: 0,
          waterIntake: 0,
          date: new Date(),
        }
      });
    }

    return NextResponse.json({ success: true, nutrition });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch nutrition" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = verifyMobileAuth(request);
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const { addCalories, addWater } = body; // Optional partial updates

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let nutrition = await prisma.nutrition.findFirst({
      where: { userId: auth.user!.id, date: { gte: today, lt: tomorrow } }
    });

    if (!nutrition) {
      return NextResponse.json({ error: "Nutrition record missing for today" }, { status: 404 });
    }

    const updateData: any = {};
    if (addCalories !== undefined) updateData.consumedCalories = nutrition.consumedCalories + addCalories;
    if (addWater !== undefined) updateData.waterIntake = nutrition.waterIntake + addWater;

    const updated = await prisma.nutrition.update({
      where: { id: nutrition.id },
      data: updateData
    });

    return NextResponse.json({ success: true, nutrition: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update nutrition" }, { status: 500 });
  }
}
