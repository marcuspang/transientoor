import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/swap")({
  component: Swap,
});

export function Swap() {
  return (
    <div className="px-12 py-4">
      <h1 className="font-bold tracking-tight text-2xl underline">
        Swap ERC20s without needing approvals
      </h1>
      <p className="py-4">
        To try this out, we have created an extension that modifies Uniswap's
        frontend, where you can swap immediately without approval. However, due
        to how Uniswap's routing is designed, if PERMIT2 is not available, you
        will need to approve the token first. Hence, we still a gasless
        signature for PERMIT2.
      </p>

      <a href="/extension.zip" download className="underline">
        Download Extension Here
      </a>

      <p className="py-4">
        After unzipping the extension, enable developer settings in{" "}
        <a
          href="chrome://extensions"
          target="_blank"
          rel="noopener"
          className="underline"
        >
          chrome://extensions
        </a>{" "}
        and click on "Load Unpacked". Then select the unzipped folder location.
      </p>
    </div>
  );
}
