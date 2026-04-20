export type ActivityLevel = 'SEDENTARY' | 'LIGHTLY_ACTIVE' | 'MODERATELY_ACTIVE' | 'VERY_ACTIVE' | 'EXTRA_ACTIVE';

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  SEDENTARY: 1.2,
  LIGHTLY_ACTIVE: 1.375,
  MODERATELY_ACTIVE: 1.55,
  VERY_ACTIVE: 1.725,
  EXTRA_ACTIVE: 1.9
};

export interface CalorieData {
  gender: 'MALE' | 'FEMALE';
  weight: number; // in kg
  height: number; // in cm
  age: number; // years
  activityLevel: ActivityLevel;
}

export function calculateDailyCalories(data: CalorieData): number {
  let bmr = 0;

  // Mifflin-St Jeor Equation
  if (data.gender === 'MALE') {
    bmr = (10 * data.weight) + (6.25 * data.height) - (5 * data.age) + 5;
  } else {
    bmr = (10 * data.weight) + (6.25 * data.height) - (5 * data.age) - 161;
  }

  const multiplier = ACTIVITY_MULTIPLIERS[data.activityLevel] || 1.2;
  return Math.round(bmr * multiplier);
}
