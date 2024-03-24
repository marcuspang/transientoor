// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.25;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TransientToken is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    function mint(address account, uint256 value) external {
        _mint(account, value);
    }

    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        address spender = msg.sender;
        address tokenOwner = from;
        bytes32 allowanceSlot = keccak256(
            abi.encodePacked(
                bytes32(uint256(uint160(spender))),
                keccak256(abi.encodePacked(bytes32(uint256(uint160(tokenOwner))), uint256(1)))
            )
        );
        setAllowance(from, to, amount);
        _transfer(from, to, amount);

        return true;
    }

    function getAllowance(address owner, address spender) public view returns (uint256) {
        bytes32 allowanceSlot = keccak256(
            abi.encodePacked(
                bytes32(uint256(uint160(spender))),
                keccak256(abi.encodePacked(bytes32(uint256(uint160(owner))), uint256(1)))
            )
        );
        uint256 allowance;
        assembly {
            allowance := tload(allowanceSlot)
        }
    }

    function setAllowance(address owner, address spender, uint256 amount) public returns (bool) {
        bytes32 allowanceSlot = keccak256(
            abi.encodePacked(
                bytes32(uint256(uint160(spender))),
                keccak256(abi.encodePacked(bytes32(uint256(uint160(owner))), uint256(1)))
            )
        );

        assembly {
            tstore(allowanceSlot, amount)
        }

        return true;
    }
    function normalTransferFrom(
        address from,
        address to,
        uint256 amount
    ) public  returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }
}
