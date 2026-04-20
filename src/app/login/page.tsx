"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid credentials");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <main style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Welcome Back</h2>
        {error && <p style={{ color: 'red', marginBottom: '16px', textAlign: 'center' }}>{error}</p>}
        
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label>Email</label>
            <input type="email" name="email" required />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label>Password</label>
            <input type="password" name="password" required />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>Sign In</button>
        </form>
        <p style={{ marginTop: '16px', textAlign: 'center' }}>
          New here? <Link href="/register" style={{ color: 'var(--primary)' }}>Create an account</Link>
        </p>
      </div>
    </main>
  );
}
