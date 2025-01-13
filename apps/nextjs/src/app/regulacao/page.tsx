import { signOut } from "@acme/auth";
import { Button } from "@acme/ui/button";

import { Emergencies } from "./emergencies";
import { ProtocolControl } from "./protocol-control";
import { ProtocolProvider } from "./protocol-provider";
import { UpsertCallForm } from "./upsert-call-form";
import { UpsertEmergencyForm } from "./upsert-emergency-form";

export default function RegulacaoPage() {
  return (
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

        <div className="grid grid-cols-5 gap-2">
          <Emergencies />
          <div className="col-span-2">
            <UpsertCallForm />
          </div>
          <div className="col-span-2">
            <UpsertEmergencyForm />
          </div>
        </div>
        <ProtocolControl />
      </main>
    </ProtocolProvider>
  );
}
