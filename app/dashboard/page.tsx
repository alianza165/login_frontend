"use client"; // Mark this as a client component
import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" }); // Redirect to login page after sign-out
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {session?.user?.username}!</p>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}