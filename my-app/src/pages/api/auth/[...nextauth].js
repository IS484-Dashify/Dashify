import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "online",
          response_type: "code",
        },
      },
    }),
    // ...add more providers here
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // console.log("signin callback [user]", {user});
      // console.log("signin callback [account]", {account});
      // console.log("signin callback [profile]", {profile});
      // console.log("Verified: ", profile.email_verified);

      if (profile.email_verified) {
        try {
          // 1. Check if email exists in database
          // console.log("EMAIL", `/api/user-auth/${user.email}`);
          // console.log("Email profile", profile, "User", user);
          console.log("Email:", user.email);
          const response = await fetch(
            `https://dashify.vercel.app/api/user-auth/${user.email}`
            // `http://localhost:3000/api/user-auth/${user.email}`
          );
          const data = await response.json();
          // // 2. If email exists, return true
          if (response.status === 200) {
            console.log("user_exists:", data);
            return true;
          } else {
            // 3. If email does not exist, return false
            console.log("user_does_not_exist:", data);
            return false;
          }
        } catch (error) {
          console.error("Fetch error:", error);
          return false;
        }
      } else {
        // Return false to display a default error message
        return false;
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};

export default NextAuth(authOptions);
