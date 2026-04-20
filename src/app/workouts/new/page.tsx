"use client";

import { useState } from "react";
import { createWorkout } from "@/app/actions/workout-actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewWorkout() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleStart(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    
    setLoading(true);
    const res = await createWorkout(name);
    if (res.success && res.workoutId) {
      router.push(`/workouts/${res.workoutId}`);
    } else {
      setLoading(false);
      alert(res.error || "Failed to start workout.");
    }
  }

  return (
    <main style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Link href="/workouts" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
        ← Back to History
      </Link>
      
      <div className="glass-panel" style={{ padding: '32px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '16px' }}>Start New Workout</h1>
        
        <form onSubmit={handleStart} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Workout Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g., Pull Day, Leg Day, Full Body" 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface)', fontSize: '1rem' }} 
              required 
            />
          </div>
          
          <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '12px', fontSize: '1rem' }}>
            {loading ? "Starting..." : "Create & Start Session"}
          </button>
        </form>
      </div>
    </main>
  );
}
