'use client'

export default function AuthErrorPage({ searchParams }) {
  const { error, email } = searchParams;

  console.log("Error:", error);
  console.log("Email:", email);

  if (error === "EmailAlreadyExists") {
    return (
      <div>
        <h1>Email Already Exists</h1>
        <p>
          The email <strong>{email}</strong> is already registered. Please log in using your credentials.
        </p>
        <button onClick={() => (window.location.href = "/login")}>Go to Login</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Authentication Error</h1>
      <p>An unexpected error occurred. Please try again.</p>
      <button onClick={() => (window.location.href = "/")}>Go to Home</button>
    </div>
  );
}