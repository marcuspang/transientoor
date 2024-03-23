
# Transientoor
Transientoor is a token standard that incorporates the functionality of EIP1153 Transient Storage. With the Transientoor token standard, executing the transferFrom() function requires just a single transaction, encompassing the approval process within the same transaction. This project demonstrates how swapping tokens on Uniswap using the Transientoor token can be both gas-efficient and convenient.

## Understanding EIP 1153
EIP-1153 introduces transient storage to the Ethereum network, allowing storage to be utilized only for the duration of a transaction. Transient storage facilitates cleaner smart contract designs, significantly reduces gas costs, and simplifies the Ethereum Virtual Machine (EVM) design. It essentially introduces a new writable data location that persists only for the duration of a transaction. Since the blockchain doesn’t need to retain transient data post-transaction, resulting in nodes not needing to store this data on disk, it becomes much cheaper to use compared to regular storage.

## Gas Efficiency with Transientoor
Transientoor achieves gas efficiency through the use of tload and tstore operations, each consuming 100 gas, to update the allowance of owner and spender pairs. This is a significant improvement over the conventional sload and store opcodes, which cost 20,000 gas (for setting a storage slot from 0 to non-zero) and 2,900 gas (for updating a non-zero value), respectively.

# Development Overview
1. `/contracts`: Contains Transientoor contracts, deployment scripts, deployment addresses, and Uniswap tests.    
2. `/extension`: Houses the browser extension designed for selecting Transientoor functionality during token swaps.    
3. `/frontend`: Includes the Uniswap frontend interface.