// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.25;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TransientToken is ERC20 {
    uint256 public count;

    event Count(uint256 count);

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    function transient() external {
        bytes32 countSlot = bytes32(0);
        assembly {
            tstore(countSlot, 30)
        }
        emit Count(count);
    }

    // function transferFrom(address from, address to, uint256 amount) external {
    //     bytes memory allowanceSlot = keccak256(abi.encodePacked(from,keccak256(abi.encodePacked(to,uint256(1)))));
    //     assembly{
    //         tstore(slot,value)
    //     }
    //     super.transferFrom(from, to, amount);
    //     assembly{
    //         tstore(slot,0)
    //     }
    // }
}
