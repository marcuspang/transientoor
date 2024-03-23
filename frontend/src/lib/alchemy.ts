import { Alchemy, Network } from "alchemy-sdk";

export async function getUserNfts(address: string, network: Network) {
  const settings = {
    apiKey: import.meta.env.VITE_ALCHEMY_API_KEY as string,
    network,
  };
  console.log("getting nfts for", address);

  const alchemy = new Alchemy(settings);

  return await alchemy.nft.getNftsForOwner(address);
}
