// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.25;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TransientNFT is ERC721 {
    uint256 LendingPeriod = 1; // 1 block

    struct LendDeal {
        uint256[] expiredDate;
        uint256[] tokenId;
        bool[] hasClaimed;
    }

    mapping(address owner => LendDeal lendDeal) LendingDeals;

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

    function _baseURI() internal view override returns (string memory) {
        return "ipfs://QmVUEyJpt6BjmV7dinm3wHxAaw8hXRZkxtRomsNV1b5xKj";
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireMinted(tokenId);

        string memory baseURI = _baseURI();
        return string(abi.encodePacked(baseURI));
    }

    function lend(address[] calldata borrower, uint256[] calldata tokenId, uint256[] calldata lendingDuration) public {
        require(borrower.length == tokenId.length, "mismatch array length!");

        for (uint256 i = 0; i < borrower.length; i++) {
            require(ownerOf(tokenId[i]) == msg.sender, "msg.sender is not owner of token");
            LendingDeals[msg.sender].expiredDate.push(block.timestamp + lendingDuration[i]);
            LendingDeals[msg.sender].tokenId.push(tokenId[i]);
            LendingDeals[msg.sender].hasClaimed.push(false);
            transferFrom(msg.sender, borrower[i], tokenId[i]);
        }
    }

    function claimBackNFT(uint256[] calldata tokenId) public {
        require(
            LendingDeals[msg.sender].tokenId.length != 0 && LendingDeals[msg.sender].tokenId.length >= tokenId.length,
            "no token to claim back from borrower"
        );
        for (uint256 i = 0; i < tokenId.length; i++) {
            for (uint256 j = 0; j < LendingDeals[msg.sender].tokenId.length; j++) {
                if (tokenId[i] == LendingDeals[msg.sender].tokenId[j]) {
                    // found matching tokenId, claim back NFT
                    require(block.timestamp >= LendingDeals[msg.sender].expiredDate[j], "have not reached expiry date");
                    transferFrom(ownerOf(tokenId[i]), msg.sender, tokenId[i]);
                    LendingDeals[msg.sender].expiredDate[j] = 0;
                    LendingDeals[msg.sender].hasClaimed[j] = true;
                }
            }
        }
    }

    function getLendingDeals(address lender) public view returns (uint256[] memory, uint256[] memory, bool[] memory) {
        LendDeal memory lenderDeal = LendingDeals[lender];
        return (lenderDeal.expiredDate, lenderDeal.tokenId, lenderDeal.hasClaimed);
    }
}
