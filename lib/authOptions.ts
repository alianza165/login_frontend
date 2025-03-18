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
        username: { label: "Username", type: "text", placeholder: "Enter username" },
        password: { label: "Password", type: "password", placeholder: "Enter password" },
      },
      async authorize(credentials) {
        try {
          const response = await axios.post("http://localhost:8000/api/token/", {
            username: credentials?.username,
            password: credentials?.password,
          });

          if (response.status === 200) {
            const { access, refresh } = response.data;
            return {
              id: credentials.username, // Use a unique identifier
              username: credentials.username,
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
        token.username = user.username || user.name || user.email;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      // Ensure the username is available in the session
      session.user.username = token.username;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
  },
  secret: process.env.AUTH_SECRET, // Ensure the secret is set
  debug: true, // Enable debug mode for additional logs
};

export default authOptions;