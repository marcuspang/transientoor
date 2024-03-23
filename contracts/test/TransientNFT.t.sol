// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.25;

import {Test, console} from "forge-std/Test.sol";
import {TransientNFT} from "../src/TransientNFT.sol";

contract TransientTokenTest is Test {
    TransientNFT transientNFT;
    address alice;
    address bob;
    address operator;

    function setUp() public {
        transientNFT = new TransientNFT("TransientNFT","TFT");
        alice = makeAddr("alice");
        bob = makeAddr("bob");
        operator = makeAddr("operator");
        transientNFT.mint(alice,1);
    }   

    function test_transferfrom() public {
        vm.prank(operator);
        transientNFT.transferFrom(alice,bob,1);

    }

    function test_safeTransferFrom() public {
        vm.prank(operator);
        transientNFT.safeTransferFrom(alice,bob,1,"");
    }

}