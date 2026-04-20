import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import LiveWorkoutLogger from "./LiveWorkoutLogger";

export default async function LiveWorkoutSession({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) redirect("/login");

  const workout = await prisma.workout.findUnique({
    where: { id: params.id },
    include: {
      details: {
        include: { exercise: true },
        orderBy: { id: 'asc' }
      }
    }
  });

  if (!workout) redirect("/workouts");

  const allExercises = await prisma.exercise.findMany({
    orderBy: { name: 'asc' }
  });

  // Group details by exercise for the summary view
  const groupedDetails = workout.details.reduce((acc: any, detail: any) => {
    if (!acc[detail.exercise.id]) {
      acc[detail.exercise.id] = {
        name: detail.exercise.name,
        sets: []
      };
    }
    acc[detail.exercise.id].sets.push(detail);
    return acc;
  }, {});

  return (
    <main style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Link href="/workouts" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'block', marginBottom: '8px' }}>
            ← Back to History
          </Link>
          <h1 style={{ fontSize: '2rem' }}>{workout.name}</h1>
          <p style={{ color: workout.completed ? '#10b981' : '#ef4444' }}>
            {workout.completed ? "Completed Session" : "Live Session - In Progress"}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        {/* Logged Sets View */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Workout Summary</h2>
          
          {Object.values(groupedDetails).length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No sets logged yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {Object.values(groupedDetails).map((group: any) => (
                <div key={group.name}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>{group.name}</h3>
                  <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        <th style={{ padding: '8px' }}>Set</th>
                        <th style={{ padding: '8px' }}>Weight (kg)</th>
                        <th style={{ padding: '8px' }}>Reps</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.sets.map((set: any, idx: number) => (
                        <tr key={set.id} style={{ borderTop: '1px solid var(--border-color)', background: idx % 2 === 0 ? 'var(--surface)' : 'transparent' }}>
                          <td style={{ padding: '8px' }}>{idx + 1}</td>
                          <td style={{ padding: '8px' }}>{set.weight} kg</td>
                          <td style={{ padding: '8px' }}>{set.reps}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Logger Component */}
        {!workout.completed && (
          <LiveWorkoutLogger workoutId={workout.id} exercises={allExercises} />
        )}
      </div>
    </main>
  );
}
