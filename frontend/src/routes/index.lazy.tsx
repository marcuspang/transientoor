import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useReadTransientNftGetLendingDeals,
  useWriteTransientNftClaimBackNft,
  useWriteTransientNftLend,
} from "@/lib/generated";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Network, Nft } from "alchemy-sdk";
import { useEffect, useState } from "react";
import { Address, isAddress } from "viem";
import { mainnet, sepolia } from "viem/chains";
import { useAccount } from "wagmi";
import { getUserNfts } from "../lib/alchemy";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function getImageUrl(nft: Nft) {
  if (nft.image.cachedUrl) {
    return nft.image.cachedUrl;
  }
  const tokenUri = nft.raw.tokenUri;
  if (tokenUri?.startsWith("ipfs://")) {
    return `https://ipfs.io/ipfs/${tokenUri.slice(7)}`;
  }
  return tokenUri;
}

function getNftName(nft: Nft) {
  if (nft.name) {
    return nft.name;
  }
  return nft.contract.name ?? nft.contract.symbol ?? nft.contract.address;
}

export function Index() {
  const { address, chainId } = useAccount();
  const [selectedNft, setSelectedNft] = useState<Nft>();
  const [fromAddress, setFromAddress] = useState<Address>();
  const [toAddress, setToAddress] = useState<Address>();
  const [claimBackTokenId, setClaimBackTokenId] = useState<number>();
  const {
    data,
    isLoading: nftsIsPending,
    fetchStatus: nftsIsFetching,
  } = useQuery({
    queryKey: ["nfts", fromAddress],
    queryFn: () =>
      getUserNfts(
        fromAddress!,
        chainId === mainnet.id ? Network.ETH_MAINNET : Network.ETH_SEPOLIA
      ),
    enabled:
      fromAddress !== undefined && isAddress(fromAddress, { strict: false }),
  });
  const { data: lendingDeals } = useReadTransientNftGetLendingDeals({
    chainId: chainId as typeof mainnet.id | typeof sepolia.id,
    address: selectedNft?.contract.address as `0x${string}`,
    args: [fromAddress!],
    query: {
      enabled: fromAddress !== undefined && selectedNft !== undefined,
    },
  });
  const { writeContract: lend, isPending: lendIsPending } =
    useWriteTransientNftLend();
  const { writeContract: claimBack, isPending: claimBackIsPending } =
    useWriteTransientNftClaimBackNft();

  useEffect(() => {
    setSelectedNft(undefined);
  }, [fromAddress]);

  const pendingLendingDeals = lendingDeals?.[2]
    .map((value, index) => ({
      expiryDate: lendingDeals[0][index],
      tokenId: lendingDeals[1][index],
      hasBeenClaimed: value,
    }))
    .filter((deal) => !deal.hasBeenClaimed);

  return (
    <div className="px-12 my-auto">
      <div className="flex mt-4 space-x-4 mx-auto">
        <div className="flex items-center w-full">
          <Input
            placeholder="From Address"
            className="h-12 rounded-r-none"
            value={fromAddress}
            onChange={(e) => setFromAddress(e.target.value as Address)}
          />
          <Button
            onClick={() => setFromAddress(address)}
            className="h-12 rounded-l-none"
          >
            Current Address
          </Button>
        </div>
        <div className="flex items-center w-full">
          <Input
            placeholder="To Address"
            className="h-12 rounded-r-none"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value as Address)}
          />
          <Button
            onClick={() => setToAddress(address)}
            className="h-12 rounded-l-none"
          >
            Current Address
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mx-auto">
        <div className="mt-8">
          <Select
            onValueChange={(index) => setSelectedNft(data?.ownedNfts[+index])}
            disabled={nftsIsPending}
          >
            <SelectTrigger className="mx-auto h-[52px]">
              <SelectValue
                placeholder={
                  nftsIsPending && nftsIsFetching
                    ? "Loading..."
                    : "Choose an NFT"
                }
                className="py-2"
              />
            </SelectTrigger>
            <SelectContent>
              {data?.ownedNfts.map((nft, index) => (
                <SelectItem
                  key={`${nft.contract.address}:${nft.tokenId}`}
                  value={index.toString()}
                >
                  <div className="flex items-center py-2">
                    <img src={getImageUrl(nft)} className="w-[36px] h-[36px]" />
                    <span className="pl-2">
                      {getNftName(nft)} #{nft.tokenId}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedNft !== undefined && (
            <div className="text-center py-6">
              <p className="font-bold text-xl pb-4">
                {getNftName(selectedNft)} #{selectedNft.tokenId}
              </p>
              <img
                className="object-cover mx-auto"
                src={getImageUrl(selectedNft)}
                alt={selectedNft.contract.address}
              />
            </div>
          )}
        </div>
        <div className="text-center w-full mt-8">
          {pendingLendingDeals !== undefined && (
            <div className="mb-4">
              <h3>You have {pendingLendingDeals.length} of this NFT lent.</h3>
              <ul>
                {pendingLendingDeals.map((lendingDeal) => (
                  <li key={lendingDeal.tokenId}>
                    <p>
                      Expiry date:{" "}
                      {new Date(
                        +(lendingDeal.expiryDate * 1000n).toString()
                      ).toLocaleDateString()}
                    </p>
                    <p>Token ID: {lendingDeal.tokenId.toString()}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex flex-col">
            <Button
              onClick={() =>
                lend({
                  address: selectedNft?.contract.address as `0x${string}`,
                  chainId: chainId as typeof mainnet.id | typeof sepolia.id,
                  args: [
                    [toAddress!],
                    [BigInt(selectedNft?.tokenId ?? 0)],
                    [1n],
                  ],
                })
              }
              className="mb-3"
              disabled={
                selectedNft === undefined ||
                toAddress === undefined ||
                lendIsPending
              }
            >
              {lendIsPending
                ? "Lending..."
                : toAddress === undefined
                  ? "Add an address to lend to"
                  : selectedNft === undefined
                    ? "Select an NFT to lend"
                    : `Lend to ${toAddress.slice(0, 5)}... for 1 block`}
            </Button>
            <Input
              placeholder="Enter Token ID to claim back"
              className="mb-2"
              value={claimBackTokenId}
              onChange={(e) => setClaimBackTokenId(+e.target.value)}
            />
            <Button
              onClick={() =>
                claimBack({
                  address: selectedNft?.contract.address as `0x${string}`,
                  chainId: chainId as typeof mainnet.id | typeof sepolia.id,
                  args: [[BigInt(claimBackTokenId ?? 0)]],
                })
              }
              disabled={claimBackTokenId === undefined || claimBackIsPending}
            >
              {claimBackIsPending ? "Claiming..." : "Claim back NFTs"}
            </Button>
            <p className="text-xs mt-2 tracking-tight text-black/50">
              without needing an approval from borrower :)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
