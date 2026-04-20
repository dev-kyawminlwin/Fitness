import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import DailySummaryWidget from "./DailySummaryWidget";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <main style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>
          Welcome back!
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Logged in as: <strong>{session.user?.email}</strong>
        </p>
        
        <div style={{ marginTop: '24px', display: 'flex', gap: '16px' }}>
          <Link href="/profile" className="btn-primary" style={{ textDecoration: 'none', textAlign: 'center' }}>
            Edit Profile
          </Link>
          <LogoutButton />
        </div>
      </div>

      <DailySummaryWidget />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '24px' }}>
        <div className="glass-panel">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>💪 Workout Tracking</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Log your gym sessions, track exercises, sets, and reps to monitor your progressive overload.
          </p>
          <Link href="/workouts" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ width: '100%' }}>Launch Workouts</button>
          </Link>
        </div>

        <div className="glass-panel">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>🥗 Nutrition Logs</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Track your daily caloric intake against your goals to ensure you are fueling your body correctly.
          </p>
          <Link href="/nutrition" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ width: '100%' }}>Launch Nutrition</button>
          </Link>
        </div>
      </div>
    </main>
  );
}
