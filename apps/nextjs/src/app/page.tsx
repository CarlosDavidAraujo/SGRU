import { auth } from "@acme/auth";

import { HydrateClient } from "~/trpc/server";

export default async function HomePage() {
  const session = await auth();
  console.log({ session });
  return (
    <HydrateClient>
      <main className="container h-screen py-16"></main>
    </HydrateClient>
  );
}
