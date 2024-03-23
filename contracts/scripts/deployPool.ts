import { ethers } from "hardhat";

const TOKEN_A = "0x5a38bb9d84febf451c18282767bb11119b1cad19";
const TOKEN_B = "0xfcd57f579733a96c97608d6c7ff3a93151f4cf0e";
const POOL_FACTORY = "0x0227628f3F023bb0B980b67D528571c95c6DaC1c";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const poolFactory = new ethers.Contract(
    POOL_FACTORY,
    [
      "function createPool(address tokenA, address tokenB, uint24 fee) external returns (address pool)",
    ],
    deployer
  );

  const tx = await poolFactory.createPool(TOKEN_A, TOKEN_B, 3000);
  const receipt = await tx.wait();
  console.log("Transaction receipt:", receipt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
