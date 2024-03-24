import { http } from "viem";
import {
  mainnet,
  optimism,
  optimismSepolia,
  sepolia
} from "viem/chains";
import { createConfig } from "wagmi";

export const config = createConfig({
  chains: [sepolia, optimismSepolia, mainnet, optimism],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [optimism.id]: http(),
    [optimismSepolia.id]: http(),
  },
});
