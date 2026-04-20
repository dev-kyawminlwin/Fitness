"use client";

import { useState } from "react";
import { mutateUserProfile } from "../actions/profile-actions";
import { useRouter } from "next/navigation";

export default function ProfileForm({ user }: { user: any }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const res = await mutateUserProfile(formData);
    
    setLoading(false);
    if (res.success) {
      alert("Profile updated successfully!");
      router.refresh();
    } else {
      alert(res.error || "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Full Name</label>
          <input type="text" name="name" defaultValue={user.name || ""} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface)' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Age</label>
          <input type="number" name="age" defaultValue={user.age || ""} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface)' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Height (cm)</label>
          <input type="number" step="0.1" name="height" defaultValue={user.height || ""} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface)' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Weight (kg)</label>
          <input type="number" step="0.1" name="weight" defaultValue={user.weight || ""} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface)' }} />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Bio</label>
        <textarea name="bio" rows={3} defaultValue={user.bio || ""} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface)' }}></textarea>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Existing Health Issues / Illnesses</label>
        <textarea name="healthIssues" rows={2} defaultValue={user.healthIssues || ""} placeholder="E.g., Asthma, Knee injury from 2022" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface)' }}></textarea>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Food Preferences & Allergies</label>
        <textarea name="foodPreferences" rows={2} defaultValue={user.foodPreferences || ""} placeholder="E.g., Vegetarian, Nut allergy" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface)' }}></textarea>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Activity Level</label>
          <select name="activityLevel" defaultValue={user.activityLevel || ""} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface)', color: 'var(--text-primary)' }}>
            <option value="">Select Level</option>
            <option value="SEDENTARY">Sedentary</option>
            <option value="LIGHTLY_ACTIVE">Lightly Active</option>
            <option value="MODERATELY_ACTIVE">Moderately Active</option>
            <option value="VERY_ACTIVE">Very Active</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Work Profile</label>
          <input type="text" name="workProfile" defaultValue={user.workProfile || ""} placeholder="E.g., Desk job, Construction" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface)' }} />
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '16px' }}>
        {loading ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
}
