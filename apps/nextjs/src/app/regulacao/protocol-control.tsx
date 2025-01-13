"use client";

import { useState } from "react";

import { Button } from "@acme/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@acme/ui/card";
import { PaperPlaneIcon } from "@acme/ui/icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@acme/ui/select";

import { api } from "~/trpc/react";
import { useProtocol } from "./protocol-provider";

export function ProtocolControl() {
  const { protocol } = useProtocol();
  const { data: users } = api.users.all.useQuery();
  const [selectedUserId, setSelectedUserId] = useState("");

  const { mutate: close } = api.protocols.close.useMutation();
  const { mutate: sendTo } = api.protocols.send.useMutation();
  const { mutate: finish } = api.protocols.finish.useMutation();
  const { mutate: putOnQueue } = api.protocols.putOnQueue.useMutation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{protocol?.id}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3">
          <Button variant="destructive" onClick={() => finish()}>
            Encerrar
          </Button>
          <Button variant="secondary" onClick={() => close()}>
            Espera
          </Button>
          <Button variant="secondary" onClick={() => putOnQueue()}>
            Fila
          </Button>
          <Select value={selectedUserId} onValueChange={setSelectedUserId}>
            <SelectTrigger>
              <SelectValue placeholder="Enviar para" />
            </SelectTrigger>
            <SelectContent>
              {users?.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => sendTo({ recipientId: selectedUserId })}>
            <PaperPlaneIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
