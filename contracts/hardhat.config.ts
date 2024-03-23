import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-foundry";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.25",
        settings: {
          evmVersion: "cancun",
          viaIR: true,
        },
      },
      {
        version: "0.8.17",
        settings: {
          viaIR: true,
        },
      },
    ],
  },
};

export default config;
