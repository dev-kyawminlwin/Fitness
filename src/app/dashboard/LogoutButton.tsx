"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/login' })} 
      className="btn-primary" 
      style={{ backgroundColor: 'var(--surface-hover)', color: 'var(--text-primary)' }}
    >
      Sign Out
    </button>
  );
}
