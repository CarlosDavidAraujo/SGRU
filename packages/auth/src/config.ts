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
import Resend from "next-auth/providers/resend";
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

const adapter = DrizzleAdapter(db, {
  usersTable: users,
  sessionsTable: sessions,
  verificationTokensTable: verificationTokens,
});

export const isSecureContext = env.NODE_ENV !== "development";

export const authConfig = (
  req: NextRequest | undefined,
): Awaitable<NextAuthConfig> => ({
  adapter,
  // In development, we need to skip checks to allow Expo to work
  ...(!isSecureContext
    ? {
        skipCSRFCheck: skipCSRFCheck,
        trustHost: true,
      }
    : {}),
  secret: env.AUTH_SECRET,
  providers: [
    /* Resend({
      from: "onboarding@resend.dev",
      apiKey: env.AUTH_RESEND_KEY,
    }), */
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

        const user = await db.query.users.findFirst({
          where: ({ email }, { eq }) => eq(email, credentials.email as string),
        });

        if (!user) return null;

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    //verifyRequest: "/verify-request",
  },
  callbacks: {
    session: async (opts) => {
      const sessionToken = cookies().get("authjs.session-token");
      console.log(sessionToken?.value);
      const session = await adapter.getSessionAndUser?.(sessionToken?.value);

      return {
        user: {
          email: session?.user.email!,
          id: session?.user.id!,
          name: session?.user.name!,
        },
        expires: session?.session.expires,
      };
    },
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async signIn({ user }) {
      if (req?.method === "POST") {
        if (user) {
          const sessionToken = uuid();
          const sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

          await adapter.createSession?.({
            sessionToken: sessionToken,
            userId: user.id!,
            expires: sessionExpiry,
          });

          cookies().set("authjs.session-token", sessionToken, {
            expires: sessionExpiry,
          });
        }
      }

      return true;
    },
    /*   async signIn(params) {
      const user = await db.query.users.findFirst({
        where: ({ email }, { eq }) => eq(email, params.user.email!),
      });

      if (!user) return false;
      return true;
    }, */
  },
  jwt: {
    encode: async (params) => {
      if (
        //req.query.nextauth.includes("callback") &&
        //req.query.nextauth.includes("credentials") &&
        req?.method === "POST"
      ) {
        const cookie = cookies().get("authjs.session-token");

        if (cookie) return cookie.value;
        else return "";
      }
      // Revert to default behaviour when not in the credentials provider callback flow
      return encode(params);
    },
    decode: async (params) => {
      if (
        // req.query.nextauth.includes("callback") &&
        // req.query.nextauth.includes("credentials") &&
        req?.method === "POST"
      ) {
        return null;
      }

      // Revert to default behaviour when not in the credentials provider callback flow
      return decode(params);
    },
  },
});

export const validateToken = async (
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
