import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  if (session) {
    redirect("/dashboard");
  }

  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text' }}>FitSync</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
          Unify your workout tracking and nutrition planning in one seamless experience.
        </p>
        
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link href="/login">
            <button className="btn-primary">Sign In to Dashboard</button>
          </Link>
          <Link href="/register">
            <button className="btn-secondary">Create Account</button>
          </Link>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        width: '100%',
        maxWidth: '1000px',
        marginTop: '60px'
      }}>
        <div className="glass-panel">
          <h3>Workout Tracking</h3>
          <p>Plan routines and calculate absolute load via our easy-to-use interface.</p>
        </div>
        <div className="glass-panel">
          <h3>Nutrition Sync</h3>
          <p>Calculate your TDEE and map out your daily caloric goals.</p>
        </div>
        <div className="glass-panel">
          <h3>Progress Analytics</h3>
          <p>Watch your numbers go up mathematically over time.</p>
        </div>
      </div>
    </main>
  );
}
