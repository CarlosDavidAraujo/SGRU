import { signOut } from "@acme/auth";
import { Button } from "@acme/ui/button";

import { api, HydrateClient } from "~/trpc/server";
import { Emergencies } from "./emergencies";
import { ProtocolProvider } from "./protocol-provider";
import { UpsertCallForm } from "./upsert-call-form";
import { UpsertEmergencyForm } from "./upsert-emergency-form";

export default async function RegulacaoPage() {
  await api.protocols.ofMine.prefetch();

  return (
    <HydrateClient>
      <ProtocolProvider>
        <main className="flex h-screen w-screen flex-col p-6">
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <Button type="submit">Sign Out</Button>
          </form>
          <Emergencies />
          <div className="grid grid-cols-2 gap-2">
            <UpsertCallForm />
            <UpsertEmergencyForm />
          </div>
        </main>
      </ProtocolProvider>
    </HydrateClient>
  );
}
