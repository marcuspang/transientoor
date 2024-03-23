import { http } from "viem";
import { mainnet, sepolia } from "viem/chains";
import { createConfig } from "wagmi";

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
