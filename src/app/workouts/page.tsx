import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function WorkoutsDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      workouts: {
        orderBy: { date: 'desc' },
        include: { details: true }
      }
    }
  });

  if (!user) redirect("/login");

  return (
    <main style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem' }}>Workout History</h1>
        <Link href="/workouts/new" className="btn-primary" style={{ textDecoration: 'none' }}>
          + Start Workout
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {user.workouts.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>You haven't logged any workouts yet. Time to hit the iron!</p>
        ) : (
          user.workouts.map((workout: any) => (
            <Link key={workout.id} href={`/workouts/${workout.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background 0.2s', cursor: 'pointer' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{workout.name}</h3>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {new Date(workout.date).toLocaleDateString()} • {workout.details.length} Sets Logged
                  </div>
                </div>
                <div>
                  {workout.completed ? (
                    <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 'bold' }}>
                      Completed
                    </span>
                  ) : (
                    <span style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 'bold' }}>
                      In Progress
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}
