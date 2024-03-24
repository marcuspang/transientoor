import { Link, createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/dyson")({
  component: About,
});

function About() {
  return (
    <div className="px-12 py-4">
      <h1 className="font-bold tracking-tight text-2xl underline">
        Dyson Finance Pool
      </h1>
      <p className="py-4">
        Similar to <Link href="/swap">swapping ERC20s</Link>, we can also reduce
        the number of transactions required to interact with Dyson Finance
        pools.
      </p>

      <p>
        Pool address on Sepolia:
        <a
          href="https://sepolia.etherscan.io/address/0x98F32F52385a7C6d6e6CB9c35be3b66f78c48864#readContract"
          target="_blank"
        >
          0x98F32F52385a7C6d6e6CB9c35be3b66f78c48864
        </a>
      </p>
    </div>
  );
}
