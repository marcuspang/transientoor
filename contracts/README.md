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

# Gas report
## Transient Token (ERC20)
1. Normal transferFrom(approve + transferFrom) = 109897 wei
2. Transient transferFrom (transferFrom) = 59626 wei
Reduce by 45.74%


| src/TransientToken.sol:TransientToken contract |                 |       |        |       |         |
|------------------------------------------------|-----------------|-------|--------|-------|---------|
| Deployment Cost                                | Deployment Size |       |        |       |         |
| 735274                                         | 3752            |       |        |       |         |
| Function Name                                  | min             | avg   | median | max   | # calls |
| allowance                                      | 2823            | 2823  | 2823   | 2823  | 2       |
| approve                                        | 46231           | 46231 | 46231  | 46231 | 1       |
| balanceOf                                      | 604             | 1604  | 1604   | 2604  | 2       |
| mint                                           | 68350           | 68350 | 68350  | 68350 | 3       |
| normalTransferFrom                             | 49761           | 49761 | 49761  | 49761 | 1       |
| transfer                                       | 46714           | 46714 | 46714  | 46714 | 1       |
| transferFrom                                   | 48102           | 48102 | 48102  | 48102 | 1       |



## Transient NFT (ERC721)
1. Normal transferFrom(approve + transferFrom) = 116337 wei
2. Transient transferFrom = 67318 wei
Reduce by 42.15% 
| src/TransientNFT.sol:TransientNFT contract |                 |        |        |        |         |
|--------------------------------------------|-----------------|--------|--------|--------|---------|
| Deployment Cost                            | Deployment Size |        |        |        |         |
| 1550613                                    | 7424            |        |        |        |         |
| Function Name                              | min             | avg    | median | max    | # calls |
| approve                                    | 48780           | 48780  | 48780  | 48780  | 1       |
| claimBackNFT                               | 31571           | 60877  | 60877  | 90184  | 2       |
| lend                                       | 172961          | 172967 | 172967 | 172973 | 2       |
| mint                                       | 68636           | 68636  | 68636  | 68636  | 5       |
| normalTransferFrom                         | 58285           | 58285  | 58285  | 58285  | 1       |
| ownerOf                                    | 599             | 599    | 599    | 599    | 5       |
| safeTransferFrom                           | 60997           | 60997  | 60997  | 60997  | 1       |
| transferFrom                               | 57643           | 57643  | 57643  | 57643  | 1       |