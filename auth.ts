import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

// Define and export authOptions
export const authOptions = {
  providers: [
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
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.user.username = token.username;
      return session;
    },
  },
  secret: process.env.AUTH_SECRET, // Ensure the secret is set
  debug: true, // Enable debug mode for additional logs
};

// Create the NextAuth handler
const handler = NextAuth(authOptions);

// Export the handler as GET and POST
export { handler as GET, handler as POST };