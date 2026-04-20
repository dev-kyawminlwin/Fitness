"use client";

import { useState } from "react";
import { logSet, finishWorkout } from "@/app/actions/workout-actions";
import { useRouter } from "next/navigation";

export default function LiveWorkoutLogger({ workoutId, exercises }: { workoutId: string, exercises: any[] }) {
  const [exerciseId, setExerciseId] = useState(exercises.length > 0 ? exercises[0].id : "");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogSet(e: React.FormEvent) {
    e.preventDefault();
    if (!exerciseId || !weight || !reps) return;
    
    setLoading(true);
    const res = await logSet(workoutId, exerciseId, parseInt(reps, 10), parseFloat(weight));
    setLoading(false);
    
    if (res.success) {
      // Keep weight but reset reps optionally, or keep both for easy 3x10 logging.
      // We will just clear reps for safety.
      setReps("");
    } else {
      alert(res.error || "Failed to log set.");
    }
  }

  async function handleFinish() {
    if (confirm("Are you sure you want to finish this workout?")) {
      await finishWorkout(workoutId);
      router.push("/workouts");
    }
  }

  return (
    <div className="glass-panel" style={{ padding: '24px', border: '1px solid var(--primary)' }}>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', color: 'var(--primary)' }}>Log Next Set</h2>
      
      <form onSubmit={handleLogSet} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Exercise</label>
          <select 
            value={exerciseId} 
            onChange={(e) => setExerciseId(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface)', color: 'var(--text-primary)' }}
            required
          >
            {exercises.map((ex) => (
              <option key={ex.id} value={ex.id}>{ex.name}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Weight (kg)</label>
            <input 
              type="number" 
              step="0.5" 
              value={weight} 
              onChange={(e) => setWeight(e.target.value)} 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface)' }} 
              required 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Reps</label>
            <input 
              type="number" 
              value={reps} 
              onChange={(e) => setReps(e.target.value)} 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface)' }} 
              required 
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
          <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 1, padding: '12px' }}>
            {loading ? "Logging..." : "Log Set"}
          </button>
          <button type="button" onClick={handleFinish} style={{ padding: '12px', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            Finish Workout
          </button>
        </div>
      </form>
    </div>
  );
}
