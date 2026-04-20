import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <main style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ padding: '32px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Your Profile</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
          Personalize your fitness journey by providing more details about your goals and lifestyle.
        </p>

        <ProfileForm user={user} />
      </div>
    </main>
  );
}
