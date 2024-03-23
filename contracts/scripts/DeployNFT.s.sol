// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.25;

import "forge-std/Script.sol";
import {TransientNFT} from "../src/TransientNFT.sol";

contract DeployTransientNFT is Script {
    event NewContract(address newContract);

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);
        TransientNFT token0 = new TransientNFT("NFTOne", "NFT1");
        emit NewContract(address(token0));
        TransientNFT token1 = new TransientNFT("NFTTwo", "NFT2");
        emit NewContract(address(token1));

        vm.stopBroadcast();
    }
}
