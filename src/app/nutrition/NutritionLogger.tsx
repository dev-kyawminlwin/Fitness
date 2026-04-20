"use client";

import { useState } from "react";
import { addWater, addCalories, updateCalorieGoal } from "@/app/actions/nutrition-actions";

export default function NutritionLogger() {
  const [mealCals, setMealCals] = useState("");
  const [loading, setLoading] = useState(false);
  const [isUpdatingGoal, setIsUpdatingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState("");

  async function handleAddWater(amountLiters: number) {
    setLoading(true);
    const res = await addWater(amountLiters);
    if (!res.success) alert(res.error);
    setLoading(false);
  }

  async function handleAddMeal(e: React.FormEvent) {
    e.preventDefault();
    if (!mealCals) return;

    setLoading(true);
    const res = await addCalories(parseFloat(mealCals));
    if (res.success) {
      setMealCals("");
    } else {
      alert(res.error);
    }
    setLoading(false);
  }

  async function handleUpdateGoal(e: React.FormEvent) {
    e.preventDefault();
    if (!newGoal) return;

    setLoading(true);
    const res = await updateCalorieGoal(parseFloat(newGoal));
    if (res.success) {
      setIsUpdatingGoal(false);
      setNewGoal("");
    } else {
      alert(res.error);
    }
    setLoading(false);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
      
      {/* Quick Water Logging */}
      <div>
        <h3 style={{ fontSize: '1rem', marginBottom: '12px' }}>Quick Log Water</h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => handleAddWater(0.25)} disabled={loading} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid #3b82f6', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', flex: 1 }}>
            + 250ml
          </button>
          <button onClick={() => handleAddWater(0.5)} disabled={loading} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid #3b82f6', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', flex: 1 }}>
            + 500ml
          </button>
        </div>
      </div>

      {/* Manual Meal Logging */}
      <div>
        <h3 style={{ fontSize: '1rem', marginBottom: '12px' }}>Log Meal (Calories)</h3>
        <form onSubmit={handleAddMeal} style={{ display: 'flex', gap: '12px' }}>
          <input 
            type="number" 
            placeholder="e.g. 450" 
            value={mealCals}
            onChange={(e) => setMealCals(e.target.value)}
            style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface)' }}
            required
          />
          <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '0 24px' }}>
            Add
          </button>
        </form>
      </div>

      {/* Goal Update Toggle */}
      <div>
        {!isUpdatingGoal ? (
          <button onClick={() => setIsUpdatingGoal(true)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.875rem', textDecoration: 'underline' }}>
            Change Calorie Goal
          </button>
        ) : (
          <form onSubmit={handleUpdateGoal} style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <input 
              type="number" 
              placeholder="New Daily Goal" 
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface)' }}
              required
            />
            <button type="submit" disabled={loading} style={{ background: 'var(--text-primary)', color: 'var(--background)', border: 'none', padding: '0 16px', borderRadius: '8px', cursor: 'pointer' }}>
              Save
            </button>
            <button type="button" onClick={() => setIsUpdatingGoal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              Cancel
            </button>
          </form>
        )}
      </div>

    </div>
  );
}
