"use client"; // Mark this as a client component
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage({ searchParams }: { searchParams: { email: string } }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/accounts/verify-email/", {
        email: searchParams.email,
        code,
      });

      if (response.status === 201) {
        // Redirect to the login page with a success message
        router.push("/login?toast=User+successfully+created");
      }
    } catch (error) {
      setError(error.response?.data?.error || "Verification failed");
    }
  };

  return (
    <div>
      <h1>Verify Email</h1>
      <p>Enter the verification code sent to {searchParams.email}</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Verification Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Verify</button>
      </form>
    </div>
  );
}