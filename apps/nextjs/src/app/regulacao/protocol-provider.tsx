"use client";

import type { ReactNode } from "react";
import { createContext, useContext } from "react";

import type { RouterOutputs } from "@acme/api";

import { api } from "~/trpc/react";

interface ProtocolContextValue {
  protocol: RouterOutputs["protocols"]["ofMine"];
}

const ProtocolContext = createContext({} as ProtocolContextValue);

export const useProtocol = () => {
  const protocolContext = useContext(ProtocolContext);
  if (!protocolContext) {
    throw new Error("useProtocol should be used inside a ProtocolProvider");
  }
  return protocolContext;
};

export const ProtocolProvider = ({ children }: { children: ReactNode }) => {
  const [protocol] = api.protocols.ofMine.useSuspenseQuery();

  return (
    <ProtocolContext.Provider value={{ protocol }}>
      {children}
    </ProtocolContext.Provider>
  );
};
