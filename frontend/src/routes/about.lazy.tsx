import { Link, createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <div className="px-12 py-4">
      <h1 className="font-bold tracking-tight text-2xl underline">
        Transientoor & Undersanding EIP-1153
      </h1>
      <p className="py-4">
        EIP-1153 introduces transient storage to the Ethereum network, allowing
        storage to be utilized only for the duration of a transaction. Transient
        storage facilitates cleaner smart contract designs and allows for more
        gas optimisation. It essentially introduces a new writable data location
        that persists only for the duration of a transaction. Since the
        blockchain doesn't need to retain transient data post-transaction, this
        means that nodes do not need to store this data on disk, which makes it
        much cheaper to use, as compared to regular storage.
      </p>

      <p className="pb-4">
        By leveraging this, we can achieve cool things with existing token
        standards.
      </p>

      <h2 className="font-bold tracking-tight text-xl underline pb-4">
        Loaning NFTs
      </h2>
      <p>
        Transientoor allows you to loan NFTs{" "}
        <strong>without the use of escrows</strong>.
      </p>

      <p className="pt-4">
        In our ERC721 standard, when you "lend" an NFT, we store the deadline on
        chain to indicate when you can retrieve the NFT back from the borrower.
        We also store your information as the original owner of the NFT.
      </p>

      <p className="py-4">
        Then, after the deadline, you can retrieve the NFT back immediately from
        whoever the current owner is, without having to worry about who has
        "borrowed" / "sold" it away.
      </p>

      <h2 className="font-bold tracking-tight text-xl underline pb-4">
        Swapping ERC20s
      </h2>

      <p>
        Transientoor also allows you to swap ERC20s{" "}
        <strong>without approval requests</strong> on DEXes.
      </p>

      <p className="py-4">
        Since we can temporarily grant users the ability to spend our ERC20s, we
        can abstract away the "approval" step when dealing with ERC20s,
        especially with DEXes.
      </p>

      <p className="pt-4">
        We have created a Chrome extension that modifies Uniswap's interface to
        swap tokens without the need for approval, which can be found{" "}
        <Link href="/swap" className="underline">
          here
        </Link>
        . Note that these tokens will need to support the transient opcode
        feature, an example can be found in our{" "}
        <a
          href="https://github.com/marcuspang/transientoor/tree/main/contracts"
          target="_blank"
          rel="noopener"
          className="underline"
        >
          contracts repo
        </a>
        .
      </p>
    </div>
  );
}
