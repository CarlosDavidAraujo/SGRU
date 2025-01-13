import type { Awaitable } from "@auth/core/types";
import type {
  DefaultSession,
  NextAuthConfig,
  Session as NextAuthSession,
} from "next-auth";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { skipCSRFCheck } from "@auth/core";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { decode, encode } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { v4 as uuid } from "uuid";

import { db } from "@acme/db/client";
import { sessions, users, verificationTokens } from "@acme/db/schema";

import { env } from "../env";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

/* const adapter = DrizzleAdapter(db, {
  usersTable: users,
  sessionsTable: sessions,
  verificationTokensTable: verificationTokens,
});
 */
export const isSecureContext = env.NODE_ENV !== "development";

export const authConfig: NextAuthConfig = {
  // adapter,
  // In development, we need to skip checks to allow Expo to work
  ...(!isSecureContext
    ? {
        skipCSRFCheck: skipCSRFCheck,
        trustHost: true,
      }
    : {}),
  secret: env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          type: "text",
          label: "Email",
        },
        password: {
          type: "password",
          label: "Senha",
        },
      },
      async authorize(credentials) {
        if (!credentials.email || !credentials.password) return null;

        /*  const user = await db.query.users.findFirst({
          where: ({ email }, { eq }) => eq(email, credentials.email as string),
        });

        console.log("USUAAAAARIIOOOOO", user); */
        //if (!user) return null;

        return {
          id: "1b29b4b8-d638-459f-bc3f-0c15ba344d0d",
          email: credentials.email as string,
          name: "David",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
        },
      };
    },
    jwt: ({ token, user, trigger }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
};

/* export const validateToken = async (
  token: string,
): Promise<NextAuthSession | null> => {
  const sessionToken = token.slice("Bearer ".length);
  const session = await adapter.getSessionAndUser?.(sessionToken);
  return session
    ? {
        user: {
          ...session.user,
        },
        expires: session.session.expires.toISOString(),
      }
    : null;
};

export const invalidateSessionToken = async (token: string) => {
  const sessionToken = token.slice("Bearer ".length);
  await adapter.deleteSession?.(sessionToken);
};
 */
