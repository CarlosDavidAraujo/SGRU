"use client";

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
  const [emergencies] = api.emergencies.notFinished.useSuspenseQuery();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ocorrência</TableHead>
          <TableHead>Apelido</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {emergencies.map((emergency) => (
          <TableRow key={emergency.id}>
            <TableCell>{emergency.id}</TableCell>
            <TableCell>{emergency.title}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
