// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.25;

import {ERC20} from "./ERC20.sol";
contract TransientToken is ERC20 {


    event Allowanc(uint256 data);
    constructor(string memory name, string memory symbol)ERC20(name, symbol){}
    
    
    // function transient() external {
    //     counttwo = 9;
    //     // bytes32 countSlot= bytes(0);
    //        uint256 value;
    //     uint256 countVal;
    //     assembly{
    //         value:=sload(1)
    //     }
     
    //     // assembly{
    //     //     tstore(countSlot,30)
    //     //     value:=tload(countSlot)
    //     // }
        
    //     emit Count(value);

    // }
    function allowances(address owner, address to) external {
        uint256 allowance;
        bytes32 allowanceSlot = keccak256(abi.encodePacked(bytes32(uint(uint160(to))),keccak256(abi.encodePacked(bytes32(uint(uint160(owner))),uint256(1)))));
        assembly{
            allowance:=sload(allowanceSlot)
        }
        emit Allowanc(allowance);
        assembly{
            tstore(allowanceSlot,200)
            allowance:=tload(allowanceSlot)
        }

     
        emit Allowanc(allowance);
    }

     function mint(address account, uint256 value) external {
        _mint(account,value);
     }
    function transferFrom(address from, address to, uint256 amount) public override returns(bool){
        
        address spender = msg.sender;
        address tokenOwner = from;
        bytes32 allowanceSlot =  keccak256(abi.encodePacked(bytes32(uint(uint160(spender))),keccak256(abi.encodePacked(bytes32(uint(uint160(tokenOwner))),uint256(1)))));
        assembly{
            tstore(allowanceSlot,amount)
        }
        _transfer(from,to,amount);

        return true;
    }
        
}