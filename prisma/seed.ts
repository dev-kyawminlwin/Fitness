import { PrismaClient } from "@prisma/client";
import { createClient } from "@libsql/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const dbUrl = "file:./dev.db";
const adapter = new PrismaLibSql({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

const exercises = [
  { name: "Bench Press", targetMuscle: "Chest", description: "Standard barbell bench press for chest hypertrophy." },
  { name: "Squat", targetMuscle: "Legs", description: "Barbell back squat for lower body strength." },
  { name: "Deadlift", targetMuscle: "Back/Legs", description: "Conventional barbell deadlift for posterior chain." },
  { name: "Overhead Press", targetMuscle: "Shoulders", description: "Standing overhead press with barbell." },
  { name: "Pull-up", targetMuscle: "Back", description: "Bodyweight pull-ups for lat development." },
  { name: "Barbell Row", targetMuscle: "Back", description: "Bent-over rows for mid-back thickness." },
  { name: "Incline Dumbbell Press", targetMuscle: "Chest", description: "Upper chest focus with dumbbells." },
  { name: "Leg Press", targetMuscle: "Legs", description: "Machine leg press for quad isolation." },
  { name: "Lunges", targetMuscle: "Legs", description: "Walking or stationary lunges." },
  { name: "Romanian Deadlift", targetMuscle: "Hamstrings", description: "Hamstring focused hinge movement." },
  { name: "Bicep Curl", targetMuscle: "Arms", description: "Standard dumbbell or barbell curls." },
  { name: "Tricep Extension", targetMuscle: "Arms", description: "Overhead or cable tricep extensions." },
  { name: "Lateral Raise", targetMuscle: "Shoulders", description: "Dumbbell lateral raises for shoulder width." },
  { name: "Calf Raise", targetMuscle: "Legs", description: "Standing or seated calf raises." },
  { name: "Plank", targetMuscle: "Core", description: "Isometric core hold." },
];

async function main() {
  console.log(`Start seeding ${exercises.length} exercises...`);
  
  for (const ex of exercises) {
    const existing = await prisma.exercise.findFirst({
      where: { name: ex.name }
    });

    if (!existing) {
      await prisma.exercise.create({
        data: ex
      });
      console.log(`Created exercise: ${ex.name}`);
    } else {
      console.log(`Exercise already exists: ${ex.name}`);
    }
  }

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
