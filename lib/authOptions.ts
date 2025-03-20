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
        email: { label: "Email", type: "email", placeholder: "Enter email" },
        password: { label: "Password", type: "password", placeholder: "Enter password" },
      },
      async authorize(credentials) {
        try {
          console.log("Credentials received:", credentials);

          const response = await axios.post("http://localhost:8000/accounts/token/", {
            email: credentials?.email,
            password: credentials?.password,
          });

          console.log("API Response:", response.data);

          if (response.status === 200) {
            const { access, refresh, username } = response.data;  // Include username
            return {
              id: credentials.email,  // Use email as the unique identifier
              email: credentials.email,
              username,  // Include username
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
        // Include username in the token
        token.email = user.email;
        token.username = user.username;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      // Include username in the session
      session.user.email = token.email;
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