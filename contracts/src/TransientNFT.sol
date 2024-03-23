// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.25;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TransientNFT is ERC721 {
    // Mapping from token ID to approved address
    // mapping(uint256 => address) private _tokenApprovals; slot 4
    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

    function mint(address account, uint256 tokenId) external {
        _mint(account, tokenId);
    }

    function transferFrom(address from, address to, uint256 tokenId) public override {
        setSpender(from, to, tokenId);
        _transfer(from, to, tokenId);
    }

    // get the spender address for certain tokenId
    function getSpender(uint256 tokenId) public view returns (address) {
        bytes32 allowanceSlot = keccak256(abi.encodePacked(tokenId, uint256(4)));

        address spender;
        assembly {
            spender := tload(allowanceSlot)
        }
        return spender;
    }

    function setSpender(address owner, address spender, uint256 tokenId) public returns (bool) {
        require(ownerOf(tokenId) == owner, "invalid token owner");
        bytes32 allowanceSlot = keccak256(abi.encodePacked(tokenId, uint256(4)));

        assembly {
            tstore(allowanceSlot, spender)
        }

        return true;
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public override {
        setSpender(from, to, tokenId);
        _safeTransfer(from, to, tokenId, data);
    }
}
