import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import { erc20Abi, erc721Abi } from "viem";
import transientNftAbi from "./src/abi/TransientNFT";

export default defineConfig({
  out: "src/lib/generated.ts",
  contracts: [
    {
      name: "erc20",
      abi: erc20Abi,
    },
    {
      name: "erc721",
      abi: erc721Abi,
    },
    {
      name: "TransientNFT",
      abi: transientNftAbi,
    },
  ],
  plugins: [react()],
});
