import {
  CurrencyAmount,
  Percent,
  SWAP_ROUTER_02_ADDRESSES,
  TradeType,
} from "@uniswap/sdk-core";
import {
  SwapRouter,
  UNIVERSAL_ROUTER_ADDRESS,
  UniswapTrade,
} from "@uniswap/universal-router-sdk";
import { Route as RouteV3, Trade as V3Trade } from "@uniswap/v3-sdk";
import {
  EIP1193Provider,
  decodeFunctionData,
  encodeFunctionData,
  parseAbi,
} from "viem";
import { TOKENS, UNIVERSAL_ROUTER_ADDRESSES } from "./constants";
import { FEE_AMOUNT, buildTrade, getClient, getPool } from "./utils";

let isButtonDisplayed = false;

async function swapWithoutApproval() {
  const chainId = parseInt(
    (window.ethereum as unknown as { chainId: string }).chainId,
    16
  );
  const client = await getClient(chainId);
  const [address] = await client.requestAddresses();

  const universalRouterADdress = UNIVERSAL_ROUTER_ADDRESSES[
    chainId
  ] as `0x${string}`;
  console.log({ swapRouter02Address: universalRouterADdress });

  const tokens = TOKENS[chainId];
  const token1 = tokens["TOKEN1"];
  const token2 = tokens["TOKEN2"];
  const pool = await getPool(
    token1,
    token2,
    FEE_AMOUNT,
    "0x982F79068E607e4D68b0D0139327e81604Dd824f"
  );

  const trade = await V3Trade.fromRoute(
    new RouteV3([pool], token1, token2),
    CurrencyAmount.fromRawAmount(token1, 1),
    TradeType.EXACT_INPUT
  );
  const routerTrade = new UniswapTrade(buildTrade([trade]), {
    slippageTolerance: new Percent(5, 100),
    recipient: address,
  });
  const { calldata, value } = SwapRouter.swapCallParameters(routerTrade);

  const tx = await client.sendTransaction({
    account: address,
    data: calldata as `0x${string}`,
    value: BigInt(value),
    to: universalRouterADdress,
  });
  console.log("Sending transaction...", tx);
  alert(`Transaction hash can be found at: ${tx}`);
}

const targetButtonId = "confirm-swap-or-send";

function cloneAndAppendSwapButton() {
  const button = document.getElementById(targetButtonId);

  if (!isButtonDisplayed && button && button.firstChild) {
    const firstChild = button.firstChild as HTMLElement;
    // Check if the child's innerText includes "swap"
    if (firstChild.innerText.includes("swap")) {
      const cloneButton = button.cloneNode(true) as HTMLElement;

      cloneButton.style.marginTop = "10px";
      cloneButton.style.backgroundColor = "rgb(229 18 234)";
      if (cloneButton.firstChild) {
        (cloneButton.firstChild as HTMLElement).innerText =
          "Swap without approval";
      }

      cloneButton.onclick = swapWithoutApproval;

      // Add the cloned button to the parent
      button.parentNode?.appendChild(cloneButton);

      isButtonDisplayed = true;
    }
  }
}

// Create an observer instance linked to a callback function
const observer = new MutationObserver(function (mutationsList, observer) {
  // Check each mutation record
  let modified = false;
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      const button = document.getElementById(targetButtonId);

      if (button !== null) {
        cloneAndAppendSwapButton();
        modified = true;
      }
    }
  }
  if (!modified) {
    isButtonDisplayed = false;
  }
});

// Options for the observer (which parts of the DOM to monitor)
const config = { attributes: false, childList: true, subtree: true };

observer.observe(document.body, config);

declare global {
  interface Window {
    ethereum: EIP1193Provider;
  }
}
