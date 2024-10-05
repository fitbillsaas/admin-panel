import { User as UserMe } from "@/models/user";
import "next-auth";

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    name?: string | null;
    email?: string | null;
    picture?: string | null;
    sub?: string;
    user: User;
  }
}

declare module "next-auth" {
  export interface Token {
    accessToken: string;
    refreshToken: string;
    tokenExpiry: string;
  }

  export type SessionUserWithToken = Token &
    Pick<UserMe, "id" | "avatar" | "role" | "name" | "email">;

  export type SessionUser = SessionUserWithToken;
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  export interface Session {
    expires: ISODateString;
    user: SessionUser;
    error?: any;
  }
}
