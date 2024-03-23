import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useSimulateErc721SafeTransferFrom,
  useWriteErc721SafeTransferFrom,
} from "@/lib/generated";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
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

export function Index() {
  const { address, chainId } = useAccount();
  const [selectedNft, setSelectedNft] = useState<Nft>();
  const [fromAddress, setFromAddress] = useState<Address>();
  const [toAddress, setToAddress] = useState<Address>();
  const { data, isPending: nftsIsPending } = useQuery({
    queryKey: ["nfts", fromAddress],
    queryFn: () =>
      getUserNfts(
        fromAddress!,
        chainId === mainnet.id ? Network.ETH_MAINNET : Network.ETH_SEPOLIA
      ),
    enabled:
      fromAddress !== undefined && isAddress(fromAddress, { strict: false }),
  });
  const { data: transferFromData } = useSimulateErc721SafeTransferFrom({
    account: address,
    chainId: chainId as typeof mainnet.id | typeof sepolia.id,
    address: selectedNft?.contract.address as `0x${string}`,
    args: [
      fromAddress!,
      toAddress as Address,
      BigInt(selectedNft?.tokenId ?? 0),
    ],
    query: {
      enabled:
        fromAddress !== undefined &&
        isAddress(fromAddress, { strict: false }) &&
        selectedNft !== undefined &&
        toAddress !== undefined,
    },
  });
  const { writeContract, isPending: writeIsPending } =
    useWriteErc721SafeTransferFrom();

  useEffect(() => {
    setSelectedNft(undefined);
  }, [fromAddress]);

  return (
    <div className="px-12 my-auto">
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-2 mt-8">
          <Input
            placeholder="Enter a user's address"
            className="w-3/4 mb-6 mx-auto"
            value={fromAddress}
            defaultValue={fromAddress}
            onChange={(e) => setFromAddress(e.target.value as Address)}
          />
          <Select
            onValueChange={(index) => setSelectedNft(data?.ownedNfts[+index])}
            disabled={nftsIsPending}
          >
            <SelectTrigger className="w-3/4 mx-auto h-[52px]">
              <SelectValue
                placeholder={nftsIsPending ? "Loading..." : "Choose an NFT"}
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
                    <img
                      src={nft.image.cachedUrl}
                      className="w-[36px] h-[36px]"
                    />
                    <span>{nft.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedNft !== undefined && (
            <div className="text-center py-6">
              <p className="font-bold text-xl pb-4">{selectedNft.name}</p>
              <img
                className="object-cover mx-auto max-h-[400px]"
                src={selectedNft.image.cachedUrl}
                alt={selectedNft.contract.address}
              />
            </div>
          )}
        </div>
        <div className="col-span-3 mt-[30%] text-center">
          <Input
            type="text"
            placeholder="Target Address"
            className="mb-4 placeholder:text-lg py-8"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value as Address)}
          />
          <Button
            className="py-8 px-6 text-2xl"
            // @ts-expect-error different types for simulate
            onClick={() => writeContract(transferFromData!.request)}
            disabled={transferFromData === undefined || writeIsPending}
          >
            {writeIsPending ? "Sending..." : "Send Immediately"}
          </Button>
          <p className="text-xs mt-2 tracking-tight text-black/50">
            without approving the receipient :)
          </p>
        </div>
      </div>
    </div>
  );
}
