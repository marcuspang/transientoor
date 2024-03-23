// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.25;

import {Test, console} from "forge-std/Test.sol";
import {TransientToken} from "../src/TransientToken.sol";

contract TransientTokenTest is Test {
    TransientToken token;
    address alice;
    address bob;

    function setUp() public {
        token = new TransientToken("test token", "TT");
        alice = makeAddr("alice");
        bob = makeAddr("bob");
        token.mint(alice, 10_000);
    }

    function test_transferfrom() public {
        vm.startPrank(address(this));

        (bool result) = token.transferFrom(alice, bob, 10_000);

        assertEq(result, true);
        assertEq(token.allowance(alice, bob), 0);
        vm.stopPrank();
    }
}
