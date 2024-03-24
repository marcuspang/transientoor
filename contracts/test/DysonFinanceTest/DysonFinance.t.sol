// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.25;

import {Test, console} from "forge-std/Test.sol";
import {TransientToken} from "../src/TransientToken.sol";
import {IFactory} from "../scripts/interface/IFactory.sol";

contract TransientTokenTest is Test {
    address depositor;
    IFactory sepolia_Factory = IFactory(0xb56b317345Be4757FeccaA08DbF82A82850Ff978);
    TransientToken token0 = TransientToken(0x5a38BB9D84fEBf451c18282767BB11119B1CAD19);
    TransientToken token1 = TransientToken(0xfcD57f579733a96C97608D6c7FF3a93151f4Cf0E);
    address tokenPair;
    function setUp() public {
        vm.startPrank(depositor);
        token0.mint(depositor, 200_000_000);
        token1.mint(depositor, 200_000_000);
        token0.transfer(address(sepolia_Factory),100_000_000);
        token1.transfer(address(sepolia_Factory),100_000_000);
        vm.stopPrank();
        vm.prank(sepolia_Factory.controller());
        tokenPair = sepolia_Factory.createPair(address(token0),address(1));
        
    }

    function test_swap() public {
        // Check Pair.t.sol
    }
}


