import { createWeb3Modal } from "@web3modal/wagmi/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "./config";

const queryClient = new QueryClient();

const projectId = "0f0cafc0f0684780c705603c858b7a4d";

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  themeMode: "light",
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}

export function Web3Provider({ children }: { children?: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
