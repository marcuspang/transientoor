import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <div className="px-12 py-4">
      <p>
        Transientoor allows you to loan NFTs{" "}
        <strong>without the use of escrows</strong>.
      </p>

      <p className="pt-2">
        In our ERC721 standard, when you "lend" an NFT, a struct is created,
        which indicates which block you can retrieve the NFT back from the
        borrower.
      </p>

      <p className="pt-2">
        This is possible, as we can determine if an individual has lent an NFT,
        by storing the NFT's previous owner in some struct, without having to
        worry about who has "borrowed" or "sold" it away.
      </p>
    </div>
  );
}
