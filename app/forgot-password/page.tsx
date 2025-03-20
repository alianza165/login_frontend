"use client"; // Mark this as a client component
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("email", email);

      const response = await axios.post("http://localhost:8000/accounts/password-reset/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",  // Use form data
        },
      });

      if (response.status === 200) {
        setMessage("Password reset link sent to your email");
      }
    } catch (error) {
      setError(error.response?.data?.error || "Password reset failed");
    }
  };

  return (
    <div>
      <h1>Forgot Password</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}
        <button type="submit">Send Reset Link</button>
      </form>
    </div>
  );
}