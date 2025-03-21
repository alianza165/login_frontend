'use client';

import { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function VerifyEmail({ params }: { params: { uidb64: string; token: string } }) {
  const router = useRouter();
  const { uidb64, token } = params;

  useEffect(() => {
    if (uidb64 && token) {
      // Send a request to the backend to verify the email
      axios
        .get(`http://localhost:8000/accounts/verify-email/${uidb64}/${token}/`)
        .then((response) => {
          alert(response.data.message);
          router.push("/login"); // Redirect to login page after successful verification
        })
        .catch((error) => {
          alert(error.response?.data?.error || "Verification failed");
          router.push("/register"); // Redirect to registration page if verification fails
        });
    }
  }, [uidb64, token, router]);

  return <div>Verifying your email...</div>;
}