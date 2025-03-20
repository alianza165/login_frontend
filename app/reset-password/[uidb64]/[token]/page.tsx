"use client"; // Mark this as a client component
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const params = useParams();
  const { uidb64, token } = params;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("new_password", newPassword);

      const response = await axios.post(
        `http://localhost:8000/accounts/password-reset-confirm/${uidb64}/${token}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",  // Use form data
          },
        }
      );

      if (response.status === 200) {
        setMessage("Password reset successful");
        router.push("/login");
      }
    } catch (error) {
      setError(error.response?.data?.error || "Password reset failed");
    }
  };

  return (
    <div>
      <h1>Reset Password</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}