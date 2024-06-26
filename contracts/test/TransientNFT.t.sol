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
        transientNFT = new TransientNFT("TransientNFT", "TFT");
        alice = makeAddr("alice");
        bob = makeAddr("bob");
        operator = makeAddr("operator");
        transientNFT.mint(alice, 1);
    }

    function test_transferfrom() public {
        vm.prank(operator);
        transientNFT.transferFrom(alice, bob, 1);
    }

    function test_safeTransferFrom() public {
        vm.prank(operator);
        transientNFT.safeTransferFrom(alice, bob, 1, "");
    }

    function test_normalTransferFrom() public {
        vm.prank(alice);
        transientNFT.approve(operator,1);
        assertEq(transientNFT.ownerOf(1),alice);
        
        vm.prank(operator);
        transientNFT.normalTransferFrom(alice,bob,1);
        assertEq(transientNFT.ownerOf(1),bob);
    }


    function test_lend() public {
        address[] memory borrower = new address[](1);
        borrower[0] = bob;
        uint256[] memory tokenId = new uint256[](1);
        tokenId[0] = 1;
        uint256[] memory expiredDate = new uint256[](1);
        vm.prank(alice);
        transientNFT.lend(borrower, tokenId, expiredDate);

        assertEq(transientNFT.ownerOf(1), bob);
    }

    function test_claimbackNFT() public {
        address[] memory borrower = new address[](1);
        borrower[0] = bob;
        uint256[] memory tokenId = new uint256[](1);
        tokenId[0] = 1;
        uint256[] memory expiredDate = new uint256[](1);
        expiredDate[0] = 1;
        vm.prank(alice);
        transientNFT.lend(borrower, tokenId, expiredDate);
        assertEq(transientNFT.ownerOf(1), bob);

        vm.warp(block.timestamp);
        vm.expectRevert();

        vm.prank(alice);
        transientNFT.claimBackNFT(tokenId);

        vm.warp(block.timestamp + 1);
        vm.prank(alice);
        transientNFT.claimBackNFT(tokenId);

        assertEq(transientNFT.ownerOf(1), alice);
    }
}
