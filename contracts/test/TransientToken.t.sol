// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.25;

import {Test, console} from "forge-std/Test.sol";
import {TransientToken} from "../src/TransientToken.sol";

contract TransientTokenTest is Test {

    TransientToken token;
    address alice;
    address bob;
    function setUp() public {
         token = new TransientToken("test","TT");
        alice = makeAddr("alice");
        bob = makeAddr("bob");
        token.mint(alice,10_000);
    }
    

    function test_transferfrom() public {
        vm.startPrank(address(this));
        token.transferFrom(alice,bob,10_000);
        vm.stopPrank();
    }

    // function test_allowance() public {
    //     vm.startPrank(alice);
    //     token.approve(bob,100);
    //     token.allowances(alice,bob);

    //     vm.stopPrank();
    // }
}