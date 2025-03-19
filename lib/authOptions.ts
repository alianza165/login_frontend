import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Enter email" },  // Use email
        password: { label: "Password", type: "password", placeholder: "Enter password" },
      },
      async authorize(credentials) {
        try {
          const response = await axios.post("http://localhost:8000/api/token/", {
            email: credentials?.email,  // Use email instead of username
            password: credentials?.password,
          });

          if (response.status === 200) {
            const { access, refresh } = response.data;
            return {
              id: credentials.email,  // Use email as the unique identifier
              email: credentials.email,
              accessToken: access,
              refreshToken: refresh,
            };
          }
          return null;
        } catch (error) {
          console.error("Authorization error:", error.response?.data || error.message);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // For Google login, set the username to the email (or name) if username is not provided
        token.email = user.email || user.name || user.email;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      // Ensure the email is available in the session
      session.user.email = token.email;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
  },
  secret: process.env.AUTH_SECRET, // Ensure the secret is set
  debug: true, // Enable debug mode for additional logs
};

export default authOptions;