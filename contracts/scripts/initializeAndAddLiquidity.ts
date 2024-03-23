import { ethers } from "hardhat";

const POOL_ADDRESS = "0x982F79068E607e4D68b0D0139327e81604Dd824f";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const pool = new ethers.Contract(
    POOL_ADDRESS,
    ["function initialize(uint160 sqrtPriceX96) external"],
    deployer
  );
  const tx = await pool.initialize(POOL_ADDRESS, 100);

  const receipt = await tx.wait();
  console.log("Transaction receipt:", receipt);


}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
