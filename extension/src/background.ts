import { CurrencyAmount, Percent, TradeType } from "@uniswap/sdk-core";
import {
  CommandType,
  PERMIT2_ADDRESS,
  RoutePlanner,
  SwapRouter,
  UniswapTrade,
} from "@uniswap/universal-router-sdk";
import { Route as RouteV3, Trade as V3Trade } from "@uniswap/v3-sdk";
import { BigNumber, ethers } from "ethers";
import {
  Hash,
  decodeAbiParameters,
  decodeFunctionData,
  encodeFunctionData,
  parseAbi,
  parseAbiParameters,
  parseEther,
} from "viem";
import { sepolia } from "viem/chains";
import { TOKENS, UNIVERSAL_ROUTER_ADDRESSES } from "./constants";
import {
  FEE_AMOUNT,
  buildTrade,
  fromReadableAmount,
  getPermitSignature,
  getPool,
} from "./utils";

// const account = privateKeyToAccount(
//   "0x52dfe62be2d40ecb3d063eeae5a2bb41be0e19a76e4249cad525f4e92d3180df"
// );
const provider = new ethers.providers.InfuraProvider(
  sepolia.id,
  "71b56d4c42e24a859ed97faf317b3e24"
);
const client = new ethers.Wallet(
  "0x52dfe62be2d40ecb3d063eeae5a2bb41be0e19a76e4249cad525f4e92d3180df",
  provider
);
// const client = createWalletClient({
//   account,
//   chain: sepolia,
//   transport: http(),
// });
const chainId = sepolia.id;
const address = client.address as `0x${string}`;

async function swapWithoutApproval() {
  //   const chainId = parseInt(
  //     (window.ethereum as unknown as { chainId: string }).chainId,
  //     16
  //   );
  //   const client = await getClient(chainId);
  //   const [address] = await client.requestAddresses();

  const universalRouterAddress = UNIVERSAL_ROUTER_ADDRESSES[
    chainId
  ] as `0x${string}`;

  const tokens = TOKENS[chainId];
  const token1 = tokens["TOKEN1"];
  const token2 = tokens["TOKEN2"];
  const pool = await getPool(
    token1,
    token2,
    FEE_AMOUNT,
    client,
    "0xE836E7BE96912ed5215b1eb5eEf49269a43E7015"
  );

  const trade = await V3Trade.fromRoute(
    new RouteV3([pool], token1, token2),
    CurrencyAmount.fromRawAmount(token1, fromReadableAmount(1, 18)),
    TradeType.EXACT_INPUT
  );
  const routerTrade = new UniswapTrade(buildTrade([trade]), {
    slippageTolerance: new Percent(5, 100),
    recipient: address,
  });
  const deadline = BigInt((new Date().getTime() / 1000 + 1000).toFixed(0));
  const { calldata, value } = SwapRouter.swapCallParameters(routerTrade, {
    deadline,
  });
  const { args } = decodeFunctionData({
    abi: parseAbi(["function execute(bytes,bytes[],uint256)"]),
    data: calldata as `0x${string}`,
  });

  const planner = new RoutePlanner();
  const amount = parseEther("0.0001");
  const permit = {
    details: {
      token: token1.address.toLowerCase() as `0x${string}`,
      amount: +amount.toString(),
      expiration: +deadline.toString(), // expiration of 0 is block.timestamp
      nonce: 1,
    },
    spender: universalRouterAddress,
    sigDeadline: +deadline.toString(),
  };
  const sig = await getPermitSignature(
    permit,
    address.toLowerCase() as `0x${string}`,
    client,
    PERMIT2_ADDRESS,
    chainId
  );
  planner.addCommand(CommandType.PERMIT2_PERMIT, [permit, sig]);
  //   const inputsig = encodeAbiParameters(
  //     parseAbiParameters(
  //       "address, address, uint256, uint256, address, uint256, bytes"
  //     ),
  //     [
  //       permit.details.token,
  //       "0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF",
  //       BigInt("1713803244"), // permit.details.amount,
  //       permit.details.expiration,
  //       permit.spender,
  //       BigInt("1713803244"), //permit.sigDeadline
  //       sig as Hash,
  //     ]
  //   );
  console.log("permit details");
  console.log(planner.commands, planner.inputs.length, planner.inputs[0]);
  const swapParams = decodeAbiParameters(
    parseAbiParameters(["address, uint256, uint256, bytes, bool"]),
    args[1][0] as `0x${string}`
  );
  //   const asd = encodeAbiParameters(
  //     parseAbiParameters(["uint256, uint256, uint256, bytes, bool"]),
  //     [
  //       BigInt(1),
  //       BigInt("489105896698289490"),
  //       BigInt("187809580817311"),
  //       swapParams[3],
  //       swapParams[4],
  //     ]
  //   );
  planner.addCommand(parseInt(args[0], 16), [
    swapParams[0],
    BigNumber.from(swapParams[1].toString()),
    BigNumber.from(swapParams[2].toString()),
    swapParams[3],
    swapParams[4],
  ]);
  console.log("swap details");
  console.log(
    planner.commands,
    planner.inputs.length,
    planner.inputs[0],
    planner.inputs[1]
  );

  const tx = await client.sendTransaction({
    data: encodeFunctionData({
      abi: parseAbi(["function execute(bytes,bytes[],uint256)"]),
      args: [
        "0x0a00",
        planner.inputs as Hash[],
        BigInt((new Date().getTime() / 1000 + 1000).toFixed(0)),
      ],
    }),
    // data: calldata as Hash,
    value: BigInt(value),
    to: universalRouterAddress,
  });
  console.log("Sending transaction...", tx);
  alert(`Transaction hash can be found at: ${tx}`);
}

swapWithoutApproval().catch(console.error);
