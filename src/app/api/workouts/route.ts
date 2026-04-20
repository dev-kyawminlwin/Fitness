import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyMobileAuth } from "@/lib/mobileAuth";

export async function GET(request: Request) {
  const auth = verifyMobileAuth(request);
  if (auth.error) return auth.error;

  try {
    const workouts = await prisma.workout.findMany({
      where: { userId: auth.user!.id },
      orderBy: { date: 'desc' },
      include: {
        details: {
          include: { exercise: true }
        }
      }
    });

    return NextResponse.json({ success: true, workouts });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch workouts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = verifyMobileAuth(request);
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const { name } = body;

    if (!name) return NextResponse.json({ error: "Workout name required" }, { status: 400 });

    const workout = await prisma.workout.create({
      data: {
        userId: auth.user!.id,
        name,
        completed: false,
      }
    });

    return NextResponse.json({ success: true, workoutId: workout.id, workout });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create workout" }, { status: 500 });
  }
}
