import React, { createContext, useContext, useState } from "react";
import { trpc } from "@/lib/trpc";

interface AdsClientContextType {
  selectedClientId: number;
  setSelectedClientId: (id: number) => void;
}

const AdsClientContext = createContext<AdsClientContextType>({
  selectedClientId: 1,
  setSelectedClientId: () => {},
});

export function AdsClientProvider({ children }: { children: React.ReactNode }) {
  const [selectedClientId, setSelectedClientId] = useState(1);
  return (
    <AdsClientContext.Provider value={{ selectedClientId, setSelectedClientId }}>
      {children}
    </AdsClientContext.Provider>
  );
}

export function useAdsClient() {
  return useContext(AdsClientContext);
}

export function ClientSelector() {
  const { selectedClientId, setSelectedClientId } = useAdsClient();
  const { data: clients } = trpc.ads.getClients.useQuery();

  if (!clients || clients.length === 0) return null;

  return (
    <select
      value={selectedClientId}
      onChange={(e) => setSelectedClientId(Number(e.target.value))}
      className="text-xs bg-[#0d1117] border border-cyan-900/40 text-cyan-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-cyan-500"
    >
      {clients.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </select>
  );
}
