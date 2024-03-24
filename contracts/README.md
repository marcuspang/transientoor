# Contracts
Built using Foundry. 
(PS: Uniswap tests are in `test/integration-tests/`, which uses Hardhat)

## Dev

### Setup
1. `forge install`
2. `forge build`

### Deploy
1. `forge script scripts/<DeployScriptPath>:<DeployContractName> --rpc-url <RPC_URL> --broadcast --verify --etherscan-api-key <API_KEY> -vvvv`

### Test
1. `forge test --match-path /test/<TestFile> `

### EVM & Solidity version
Transient token uses `tload` and `tstore` opcode, which is introduced after Dencun hardfork. Hence, EVM version need to set to "cancun" and Solidity version need to be 0.8.25.
Add `FOUNDRY_PROFILE=main` prefix before the forge cli command to compile in v0.8.25.

## Contracts
1. `/src`: TransientNFT.sol and TransientToken.sol.

## Scripts
1. `/scripts`: Includes Deploy script for Transient tokens, and DysonFinance script.

## Test 
1. `/DysonFinanceTest`: in Pair.t.sol, Unit test for transient token pair is provided. Please add `--fork-url <SEPOLIA_RPC_URL>` when running the test. The test need to be compiled in v0.8.17.
2. Other test is compiled in 0.8.25.


# Deployment

Check out [Deployment](./Deployment.md)