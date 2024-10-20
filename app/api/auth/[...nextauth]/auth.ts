// import { API } from "@/lib/fetch";
import { NextAuthOptions } from "next-auth";
// import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

export const getSessionProps = (user: any) => {
  return {
    id: user,
  };
};

/**
 *
 * @param {JWT} token
 */
// const refreshAccessToken = async (token: JWT) => {
//   try {
//     const { data, error } = await API.Post(
//       "auth/token",
//       {
//         token: token.user.accessToken,
//         refresh_token: token.user.refreshToken,
//       },
//       undefined,
//       { auth: false },
//     );
//     if (error || !data) {
//       throw new Error("Something went wrong!");
//     }
//     return {
//       ...token,
//       user: {
//         ...getSessionProps(token.user),
//         accessToken: data.token,
//         refreshToken: data.refresh_token,
//         tokenExpiry: data.token_expiry,
//       },
//     };
//   } catch (e) {
//     return {
//       ...token,
//       error: "RefreshAccessTokenError",
//     };
//   }
// };

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Username",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize() {
        // console.log(...credentials);

        // const { data, error, message } = await API.Login({
        //   ...credentials,
        //   info: {},
        // });
        // if (!!error) {
        //   throw new Error(message || error);
        // }

        return {
          ...getSessionProps("S"),
          accessToken: "data.token",
          refreshToken: "data.refresh_token",
          tokenExpiry: "sajer",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 30,
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/signout",
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        // session.user = getSessionProps("s");
        session.error = token.error;
      }
      return session;
    },
    async jwt(params) {
      const { token, user, account, session, trigger } = params;

      if (trigger === "update") {
        if (session.accessToken) {
          return {
            ...token,
            user: getSessionProps(session),
          };
        } else {
          return {
            ...token,
            user: getSessionProps({
              ...token.user,
              ...session,
            }),
          };
        }
      }

      if (account && user) {
        return {
          ...token,
          user: getSessionProps(user),
        };
      } // check the token validity

      if (new Date() < new Date(token.user.tokenExpiry)) {
        return token;
      }

      return token; // get new token using refresh token
      // return refreshAccessToken(token);
    },
  },
  debug: process.env.NEXT_AUTH_DEBUG === "Y",
};
