import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyMobileAuth } from "@/lib/mobileAuth";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const auth = verifyMobileAuth(request);
  if (auth.error) return auth.error;

  try {
    const workoutId = params.id;
    const body = await request.json();
    const { exerciseId, reps, weight } = body;

    if (!exerciseId || reps === undefined || weight === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify workout belongs to user
    const workout = await prisma.workout.findUnique({ where: { id: workoutId } });
    if (!workout || workout.userId !== auth.user!.id) {
      return NextResponse.json({ error: "Workout not found" }, { status: 404 });
    }

    const currentSets = await prisma.workoutDetails.count({
      where: { workoutId, exerciseId }
    });

    const setDetail = await prisma.workoutDetails.create({
      data: {
        workoutId,
        exerciseId,
        sets: currentSets + 1,
        reps: parseInt(reps, 10),
        weight: parseFloat(weight),
      }
    });

    return NextResponse.json({ success: true, set: setDetail });
  } catch (error) {
    return NextResponse.json({ error: "Failed to log set" }, { status: 500 });
  }
}
