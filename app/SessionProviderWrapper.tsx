"use client"; // Mark this as a client component
import { SessionProvider } from "next-auth/react";

export default function SessionProviderWrapper({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any; // Pass the session from the server
}) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}