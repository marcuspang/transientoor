# ![Logo](./frontend/public/icon.svg) Transientoor

[Taikai Link](https://taikai.network/ethtaipei/hackathons/hackathon-2024/projects/clu2qlohy0i89y501lw00th07/idea)

[Project Video](https://www.loom.com/share/1752952cc20a4a42b8eb8726be4ee9d0?sid=b8887a4d-ccdd-4d9d-86b3-06367ec30911)

## Understanding EIP-1153

EIP-1153 introduced a transient storage mechanism to Ethereum, allowing storage to be utilized only for the duration of a transaction. This EIP facilitates cleaner smart contract designs and allows for more gas optimisations. Essentially, it introduces a new writable location for data that persists only for the duration of a transaction. Since the blockchain has no need to retain transient data post-transaction, nodes will not need to store this data on disk as well, making it much cheaper as compared to regular storage.

## Gas Efficiency with Transientoor

Transientoor achieves gas efficiency through the use of tload and tstore operations, each consuming 100 gas, to update the allowance of owner and spender pairs. This is a significant improvement over the conventional sload and store opcodes, which cost 2,100 gas (for setting a storage slot from 0 to non-zero) and 100 gas (for updating a non-zero value), respectively.

## Swapping ERC20s without approvals

Since we can temporarily grant users the ability to spend our ERC20s, we can abstract away the "approval" step when dealing with ERC20s, especially with DEXes. We have created a Chrome extension that modifies Uniswap's interface to swap tokens without the need for approval, which can be found at https://transientoor.vercel.app/about. Note that these tokens will need to support the transient opcode feature, an example can be found in our contracts repo.

## Loaning ERC721s without escrows

In our ERC721 standard, when you "lend" an NFT, we store the deadline on chain to indicate when you can retrieve the NFT back from the borrower. We also store your information as the original owner of the NFT for retrieval purposes.

Then, after the deadline, you can retrieve the NFT back immediately from whoever the current owner is, without having to worry about who has "borrowed" / "sold" it away.

This is currently available on our main site at https://transientoor.vercel.app/.

## DeFi with Dyson Finace

Dyson Finance provies Dual Investment which provide investor with more predictable returns, and Dynamic AMM which protects traders from MEV attacks and optimize protocol fee income.By leveraging transient token on Dyson Finance, gas efficiency and investor experience for transactions can be improved significantly. You can simply create pool and swap on Dyson Finance with ONE transaction.
We've deployed a [transient token pool](https://sepolia.etherscan.io/address/0x98F32F52385a7C6d6e6CB9c35be3b66f78c48864) on Sepolia, try it now!

# Development Overview

1. `/contracts`: Contains Transientoor contracts, deployment scripts, deployment addresses, and Uniswap tests.
2. `/extension`: Browser extension designed for selecting Transientoor functionality during token swaps.
3. `/frontend`: Includes the Swap, and Loan frontend interface.

## Contract addresses 
- [x] Sepolia    
- [x] Optimism-Sepolia
Check out all the deployments [here](./contracts//Deployment.md)

## Gas report
### Transient Token (ERC20)
1. Normal transferFrom(approve + transferFrom) = 109897 wei
2. Transient transferFrom (transferFrom) = 59626 wei
Reduce by 45.74%


### Transient NFT (ERC721)
1. Normal transferFrom(approve + transferFrom) = 116337 wei
2. Transient transferFrom = 67318 wei
Reduce by 42.15% 

Check out more details in [here](./contracts/README.md)