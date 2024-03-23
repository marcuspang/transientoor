import {
  MixedRouteSDK,
  MixedRouteTrade,
  Trade as RouterTrade,
} from "@uniswap/router-sdk";
import {
  Currency,
  CurrencyAmount,
  Ether,
  Token,
  TradeType,
} from "@uniswap/sdk-core";
// import {
//   AlphaRouter,
//   SwapOptionsSwapRouter02,
//   SwapRoute,
//   SwapType,
// } from "@uniswap/smart-order-router";
import {
  Pair,
  Route as RouteV2,
  Trade as V2Trade,
  computePairAddress,
} from "@uniswap/v2-sdk";
import {
  FeeAmount,
  Pool,
  Route as RouteV3,
  TICK_SPACINGS,
  TickMath,
  Trade as V3Trade,
  nearestUsableTick,
} from "@uniswap/v3-sdk";
import { BigNumber, Signer, ethers, providers } from "ethers";
import JSBI from "jsbi";
import {
  Account,
  Chain,
  Client,
  Transport,
  WalletClient,
  createWalletClient,
  custom,
  getContract,
} from "viem";
import { mainnet, optimism, sepolia } from "viem/chains";

const V2_FACTORY = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
const V2_ABI = [
  {
    constant: true,
    inputs: [],
    name: "getReserves",
    outputs: [
      {
        internalType: "uint112",
        name: "reserve0",
        type: "uint112",
      },
      {
        internalType: "uint112",
        name: "reserve1",
        type: "uint112",
      },
      {
        internalType: "uint32",
        name: "blockTimestampLast",
        type: "uint32",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
] as const;

// const FORK_BLOCK = 16075500;

export const ETHER = Ether.onChain(1);
export const FEE_AMOUNT = FeeAmount.MEDIUM;

// export async function getUniswapPools(
//   forkBlock?: number
// ): Promise<UniswapPools> {
//   const fork = forkBlock ?? FORK_BLOCK;
//   const WETH_USDC_V2 = await getPair(WETH, USDC, fork);
//   const USDC_DAI_V2 = await getPair(USDC, DAI, fork);

//   const WETH_USDC_V3 = await getPool(WETH, USDC, FEE_AMOUNT, fork);
//   const WETH_USDC_V3_LOW_FEE = await getPool(WETH, USDC, FeeAmount.LOW, fork);
//   const USDC_DAI_V3 = await getPool(USDC, DAI, FeeAmount.LOW, fork);

//   return {
//     WETH_USDC_V2,
//     USDC_DAI_V2,
//     WETH_USDC_V3,
//     WETH_USDC_V3_LOW_FEE,
//     USDC_DAI_V3,
//   };
// }

let client: WalletClient<Transport, Chain, Account>;

function countDecimals(x: number) {
  if (Math.floor(x) === x) {
    return 0;
  }
  return x.toString().split(".")[1].length || 0;
}

export function fromReadableAmount(amount: number, decimals: number): JSBI {
  const extraDigits = Math.pow(10, countDecimals(amount));
  const adjustedAmount = amount * extraDigits;
  return JSBI.divide(
    JSBI.multiply(
      JSBI.BigInt(adjustedAmount),
      JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals))
    ),
    JSBI.BigInt(extraDigits)
  );
}

// export async function generateRoute(
//   address: string,
//   inputToken: Token,
//   inputAmount: number,
//   outputToken: Token,
//   chainId: number
// ): Promise<SwapRoute | null> {
//   const router = new AlphaRouter({
//     chainId,
//     provider: client as unknown as BaseProvider,
//   });

//   const options: SwapOptionsSwapRouter02 = {
//     recipient: address,
//     slippageTolerance: new Percent(50, 10_000),
//     deadline: Math.floor(Date.now() / 1000 + 1800),
//     type: SwapType.SWAP_ROUTER_02,
//   };

//   const route = await router.route(
//     CurrencyAmount.fromRawAmount(
//       inputToken,
//       fromReadableAmount(inputAmount, inputToken.decimals).toString()
//     ),
//     outputToken,
//     TradeType.EXACT_INPUT,
//     options
//   );

//   return route;
// }

// export async function executeRoute(
//   route: SwapRoute,
//   swapRouter02Address: `0x${string}`,
//   walletAddress: `0x${string}`
// ) {
//   const res = await client.sendTransaction({
//     data: route.methodParameters?.calldata as `0x${string}`,
//     to: swapRouter02Address,
//     value: route?.methodParameters?.value
//       ? BigInt(route.methodParameters.value)
//       : undefined,
//     from: walletAddress,
//   });

//   return res;
// }

const supportedChains: Record<number, Chain> = {
  [sepolia.id]: sepolia,
  [mainnet.id]: mainnet,
  [optimism.id]: optimism,
};

export const getClient = async (chainId: number) => {
  const chain = supportedChains[chainId];
  if (!chain) {
    throw new Error(`Chain with ID ${chainId} is not supported.`);
  }
  return new Promise<WalletClient<Transport, Chain, Account>>(
    async (resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 10;
      const intervalId = setInterval(async () => {
        attempts++;
        console.log(`[Attempt #${attempts}] Checking for window.ethereum...`);
        if (window.ethereum) {
          clearInterval(intervalId);
          const [account] = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          client = createWalletClient({
            account,
            chain,
            transport: custom(window.ethereum!),
          });
          resolve(client);
        } else if (attempts >= maxAttempts) {
          clearInterval(intervalId);
          reject(new Error("window.ethereum is not defined after 10 attempts"));
        }
      }, 1000); // Check every second
    }
  );
};

// function getProvider(): ethers.providers.Provider {
//   return window.ethereum as unknown as ethers.providers.Provider;
//   return new ethers.providers.JsonRpcProvider(process.env["FORK_URL"]);
// }

export async function getPair(tokenA: Token, tokenB: Token): Promise<Pair> {
  const pairAddress = computePairAddress({
    factoryAddress: V2_FACTORY,
    tokenA,
    tokenB,
  });
  const contract = getContract({
    address: pairAddress as `0x${string}`,
    abi: V2_ABI,
    client,
  });
  const [reserve0, reserve1] = await contract.read.getReserves();
  const [token0, token1] = tokenA.sortsBefore(tokenB)
    ? [tokenA, tokenB]
    : [tokenB, tokenA]; // does safety checks
  return new Pair(
    CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
    CurrencyAmount.fromRawAmount(token1, reserve1.toString())
  );
}

export async function getPool(
  tokenA: Token,
  tokenB: Token,
  feeAmount: FeeAmount,
  // client: WalletClient<Transport, Chain, Account>,
  signer: Signer,
  poolAddress?: `0x${string}`
): Promise<Pool> {
  let tokenPoolAddress = poolAddress;
  const [token0, token1] = tokenA.sortsBefore(tokenB)
    ? [tokenA, tokenB]
    : [tokenB, tokenA]; // does safety checks
  if (!tokenPoolAddress) {
    tokenPoolAddress = Pool.getAddress(
      token0,
      token1,
      feeAmount
    ) as `0x${string}`;
  }
  const contract = new ethers.Contract(
    tokenPoolAddress,
    [
      {
        name: "slot0",
        type: "function",
        stateMutability: "view",
        inputs: [],
        outputs: [
          {
            type: "uint160",
            name: "sqrtPriceX96",
          },
          {
            type: "int24",
            name: "tick",
          },
          {
            type: "uint16",
            name: "observationIndex",
          },
          {
            type: "uint16",
            name: "observationCardinality",
          },
          {
            type: "uint16",
            name: "observationCardinalityNext",
          },
          {
            type: "uint8",
            name: "feeProtocol",
          },
          {
            type: "bool",
            name: "unlocked",
          },
        ],
      },
      {
        name: "liquidity",
        type: "function",
        stateMutability: "view",
        inputs: [],
        outputs: [
          {
            type: "uint128",
          },
        ],
      },
    ],
    signer
  );
  let sqrtPriceX96: bigint | JSBI;
  let tick: number;
  let liquidity: bigint | JSBI = await contract.liquidity();
  [sqrtPriceX96, tick] = await contract.slot0();
  liquidity = JSBI.BigInt(liquidity.toString());
  sqrtPriceX96 = JSBI.BigInt(sqrtPriceX96.toString());
  return new Pool(token0, token1, feeAmount, sqrtPriceX96, liquidity, tick, [
    {
      index: nearestUsableTick(TickMath.MIN_TICK, TICK_SPACINGS[feeAmount]),
      liquidityNet: liquidity,
      liquidityGross: liquidity,
    },
    {
      index: nearestUsableTick(TickMath.MAX_TICK, TICK_SPACINGS[feeAmount]),
      liquidityNet: JSBI.multiply(liquidity, JSBI.BigInt("-1")),
      liquidityGross: liquidity,
    },
  ]);
}

// alternative constructor to create from protocol-specific sdks
export function buildTrade(
  trades: (
    | V2Trade<Currency, Currency, TradeType>
    | V3Trade<Currency, Currency, TradeType>
    | MixedRouteTrade<Currency, Currency, TradeType>
  )[]
): RouterTrade<Currency, Currency, TradeType> {
  return new RouterTrade({
    v2Routes: trades
      .filter((trade) => trade instanceof V2Trade)
      .map((trade) => ({
        routev2: trade.route as RouteV2<Currency, Currency>,
        inputAmount: trade.inputAmount,
        outputAmount: trade.outputAmount,
      })),
    v3Routes: trades
      .filter((trade) => trade instanceof V3Trade)
      .map((trade) => ({
        routev3: trade.route as RouteV3<Currency, Currency>,
        inputAmount: trade.inputAmount,
        outputAmount: trade.outputAmount,
      })),
    mixedRoutes: trades
      .filter((trade) => trade instanceof MixedRouteTrade)
      .map((trade) => ({
        mixedRoute: trade.route as MixedRouteSDK<Currency, Currency>,
        inputAmount: trade.inputAmount,
        outputAmount: trade.outputAmount,
      })),
    tradeType: trades[0].tradeType,
  });
}

export async function getPermitSignature(
  permit: PermitSingle,
  address: `0x${string}`,
  signer: Signer,
  permit2Address: `0x${string}`,
  chainId: number
): Promise<string> {
  const permit2 = new ethers.Contract(
    permit2Address,
    [
      {
        inputs: [
          { internalType: "address", name: "", type: "address" },
          { internalType: "address", name: "", type: "address" },
          { internalType: "address", name: "", type: "address" },
        ],
        name: "allowance",
        outputs: [
          { internalType: "uint160", name: "amount", type: "uint160" },
          { internalType: "uint48", name: "expiration", type: "uint48" },
          { internalType: "uint48", name: "nonce", type: "uint48" },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    signer
  );
  const [, , nextNonce] = await permit2.allowance(
    address,
    permit.details.token,
    permit.spender
  );
  permit.details.nonce = nextNonce;
  return await signPermit(permit, signer, permit2Address, chainId);
}

export function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);
  return signer;
}

export async function signPermit(
  permit: PermitSingle,
  signer: Signer,
  verifyingContract: `0x${string}`,
  chainId: number
): Promise<string> {
  const eip712Domain = getEip712Domain(chainId, verifyingContract);
  // const signature = await signer.signTypedData({
  //   domain: eip712Domain,
  //   types: PERMIT2_PERMIT_TYPE,
  //   message: {
  //     details: {
  //       token: permit.details.token,
  //       amount: permit.details.amount,
  //       expiration: permit.details.expiration,
  //       nonce: permit.details.nonce,
  //     },
  //     spender: permit.spender,
  //     sigDeadline: permit.sigDeadline,
  //   },
  //   primaryType: "PermitSingle",
  // });

  // const ethersSigner = clientToSigner(signer);
  const signature = await signer._signTypedData(
    eip712Domain,
    PERMIT2_PERMIT_TYPE,
    permit
  );

  return signature;
}

export type PermitDetails = {
  token: `0x${string}`;
  amount: number | BigNumber;
  expiration: number | BigNumber;
  nonce: number | BigNumber;
};

export type PermitSingle = {
  details: PermitDetails;
  spender: `0x${string}`;
  sigDeadline: number | BigNumber;
};

export type PermitBatch = {
  details: PermitDetails[];
  spender: `0x${string}`;
  sigDeadline: number | BigNumber;
};

export type TransferDetail = {
  from: `0x${string}`;
  to: `0x${string}`;
  amount: number | BigNumber;
  token: `0x${string}`;
};

export function getEip712Domain(
  chainId: number,
  verifyingContract: `0x${string}`
) {
  return {
    name: "Permit2",
    chainId: chainId,
    verifyingContract,
  };
}
export const PERMIT2_PERMIT_TYPE = {
  PermitDetails: [
    { name: "token", type: "address" },
    { name: "amount", type: "uint160" },
    { name: "expiration", type: "uint48" },
    { name: "nonce", type: "uint48" },
  ],
  PermitSingle: [
    { name: "details", type: "PermitDetails" },
    { name: "spender", type: "address" },
    { name: "sigDeadline", type: "uint256" },
  ],
};
