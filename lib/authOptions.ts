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
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Check if the email is already registered
          const response = await axios.post("http://localhost:8000/accounts/google-login/", {
            email: user.email,
            name: user.name,
          }, {
            headers: {
              "Content-Type": "application/json",
            },
            validateStatus: (status) => status === 200 || status === 400,
          });

          if (response.status === 200) {
            const { access, refresh, username } = response.data;
            user.accessToken = access;
            user.refreshToken = refresh;
            user.username = username;
            return true;
          } else if (response.status === 400) {
            // Email already exists
            return `/auth/error?error=EmailAlreadyExists&email=${encodeURIComponent(user.email)}`;
          }
        } catch (error) {
          console.error("Google login error:", error.response?.data || error.message);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.username = user.username;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.email = token.email;
      session.user.username = token.username;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
  },
  pages: {
    error: "/auth/error", // Custom error page
  },
  secret: process.env.AUTH_SECRET,
  debug: true,
};

export default authOptions;