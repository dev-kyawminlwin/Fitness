import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import NutritionLogger from "./NutritionLogger";
import { updateCalorieGoal } from "@/app/actions/nutrition-actions"; // We'll pass server function via prop if needed or use client fetch

export default async function NutritionDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) redirect("/login");

  // Fetch today's nutrition directly
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  let nutrition = await prisma.nutrition.findFirst({
    where: { userId: user.id, date: { gte: today, lt: tomorrow } }
  });

  if (!nutrition) {
    nutrition = { id: 'stub', userId: user.id, date: new Date(), dailyCalories: 2000, consumedCalories: 0, waterIntake: 0 };
  }

  const calPercentage = Math.min((nutrition.consumedCalories / nutrition.dailyCalories) * 100, 100);

  return (
    <main style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '2rem' }}>Nutrition Hub</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 1fr', gap: '24px' }}>
        
        {/* Diet Profile Summary */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Dietary Profile</h2>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Preferences & Allergies:</span>
            <p>{user.foodPreferences || "None specified"}</p>
          </div>
          <Link href="/profile" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.875rem' }}>
            Edit Preferences →
          </Link>
        </div>

        {/* Today's Tracker */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Today's Macros</h2>
          
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Calories Consumed</span>
              <span><strong>{nutrition.consumedCalories}</strong> / {nutrition.dailyCalories} kcal</span>
            </div>
            {/* Visual Progress Bar */}
            <div style={{ width: '100%', height: '12px', background: 'var(--surface-hover)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${calPercentage}%`, background: calPercentage > 100 ? '#ef4444' : 'var(--primary)', transition: 'width 0.5s ease-in-out' }} />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Water Intake</span>
              <span><strong>{nutrition.waterIntake.toFixed(2)}</strong> Liters</span>
            </div>
            <div style={{ width: '100%', height: '12px', background: 'var(--surface-hover)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min((nutrition.waterIntake / 3.0) * 100, 100)}%`, background: '#3b82f6', transition: 'width 0.5s ease-in-out' }} />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Goal: 3.0 Liters</p>
          </div>

          <NutritionLogger />
        </div>

      </div>
    </main>
  );
}
