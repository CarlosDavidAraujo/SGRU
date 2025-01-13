"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@acme/ui/card";
import { ScrollArea } from "@acme/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@acme/ui/table";

import { api } from "~/trpc/react";

export function Emergencies() {
  const { data: emergencies } = api.emergencies.notFinished.useQuery();
  const { data: session } = api.auth.getSession.useQuery();

  const myEmergencies = emergencies?.filter(
    (e) => e.protocol.ownerId === session?.user.id,
  );

  const emergenciesOnQueue = emergencies?.filter(
    (e) => !myEmergencies?.includes(e),
  );

  const utils = api.useUtils();

  const { mutate: openEmergency } = api.protocols.open.useMutation({
    onSuccess: () => utils.protocols.ofMine.invalidate(),
  });

  return (
    <div className="flex flex-col">
      <Card className="flex flex-1 flex-col">
        <CardHeader>
          <CardTitle className="my-4 text-center">Minhas ocorrências</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col">
          <ScrollArea className="relative h-10 flex-grow">
            <Table>
              <TableHeader className="sticky top-0">
                <TableRow>
                  <TableHead>Ocorrência</TableHead>
                  <TableHead>Apelido</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {myEmergencies?.map((emergency) => (
                  <TableRow
                    key={emergency.id}
                    role="button"
                    onClick={() =>
                      openEmergency({ protocolId: emergency.protocolId })
                    }
                  >
                    <TableCell>{emergency.protocolId}</TableCell>
                    <TableCell>{emergency.title}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
      <Card className="flex flex-1 flex-col">
        <CardHeader>
          <CardTitle className="my-4 text-center">
            Ocorrências em fila
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col">
          <ScrollArea className="relative h-10 flex-grow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ocorrência</TableHead>
                  <TableHead>Apelido</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emergenciesOnQueue?.map((emergency) => (
                  <TableRow
                    key={emergency.id}
                    role="button"
                    onClick={() =>
                      openEmergency({ protocolId: emergency.protocolId })
                    }
                  >
                    <TableCell>{emergency.protocolId}</TableCell>
                    <TableCell>{emergency.title}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
