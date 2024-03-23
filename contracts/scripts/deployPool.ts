import { ethers } from "hardhat";

// const TOKEN_A = "0x5a38bb9d84febf451c18282767bb11119b1cad19";
const TOKEN_A = "0x8Fe5263d0B1D14782Ef8204B26EE361e2C0BfCC6";
// const TOKEN_B = "0xfcd57f579733a96c97608d6c7ff3a93151f4cf0e";
const TOKEN_B = "0x68be2bD28C06BF074f17dCd6F629C301772AE234";
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

  const tokenA = new ethers.Contract(
    TOKEN_A,
    ["function mint(address account, uint256 amount) external"],
    deployer
  );
  const tokenB = new ethers.Contract(
    TOKEN_B,
    ["function mint(address account, uint256 amount) external"],
    deployer
  );

  await tokenA.mint(deployer, ethers.parseEther("10000000"));
  await tokenB.mint(deployer, ethers.parseEther("10000000"));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
