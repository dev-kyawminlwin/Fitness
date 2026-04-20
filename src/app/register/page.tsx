"use client";

import { useState } from "react";
import { registerUser } from "@/app/actions/auth-actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const [error, setError] = useState("");
  const router = useRouter();

  async function clientAction(formData: FormData) {
    const res = await registerUser(formData);
    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/login");
    }
  }

  return (
    <main style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Create Account</h2>
        {error && <p style={{ color: 'red', marginBottom: '16px', textAlign: 'center' }}>{error}</p>}
        
        <form action={clientAction}>
          <div style={{ marginBottom: '16px' }}>
            <label>Email</label>
            <input type="email" name="email" required />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label>Password</label>
            <input type="password" name="password" required />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>Register</button>
        </form>
        <p style={{ marginTop: '16px', textAlign: 'center' }}>
          Already have an account? <Link href="/login" style={{ color: 'var(--primary)' }}>Login here</Link>
        </p>
      </div>
    </main>
  );
}
