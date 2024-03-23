import { Token } from "@uniswap/sdk-core";
import { Chain, mainnet, sepolia } from "viem/chains";

export const TOKENS: Record<Chain["id"], Record<string, Token>> = {
  [mainnet.id]: {
    WETH: new Token(
      mainnet.id,
      "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      18,
      "WETH",
      "Wrapped Ether"
    ),
    DAI: new Token(
      mainnet.id,
      "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      18,
      "DAI",
      "dai"
    ),
    USDC: new Token(
      mainnet.id,
      "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      6,
      "USDC",
      "USD Coin"
    ),
  },
  [sepolia.id]: {
    TOKEN1: new Token(
      sepolia.id,
      // "0x5a38bb9d84febf451c18282767bb11119b1cad19",
      "0x8Fe5263d0B1D14782Ef8204B26EE361e2C0BfCC6",
      18,
      "TT1",
      "TokenOne"
    ),
    TOKEN2: new Token(
      sepolia.id,
      // "0xfcd57f579733a96c97608d6c7ff3a93151f4cf0e",
      "0x68be2bD28C06BF074f17dCd6F629C301772AE234",
      18,
      "TT2",
      "TokenTwo"
    ),
  },
};

export const UNIVERSAL_ROUTER_ADDRESSES: Record<Chain["id"], `0x${string}`> = {
  [mainnet.id]: "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
  [sepolia.id]: "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
};
