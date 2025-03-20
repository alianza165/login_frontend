"use client"; // Mark this as a client component
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = searchParams.get("toast");

  useEffect(() => {
    if (toast) {
      alert(toast);
    }
    if (searchParams.get("error") === "EmailAlreadyExists") {
      setError("This email is already registered. Please log in with your existing account.");
    }
  }, [toast, searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/");
    }
  };

  const handleGoogleSignIn = async () => {
    const result = await signIn("google", { callbackUrl: "/" });
    if (result?.error) {
      setError(result.error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Login</button>
      </form>

      <div>
        <button onClick={handleGoogleSignIn}>Sign in with Google</button>
      </div>
    </div>
  );
}