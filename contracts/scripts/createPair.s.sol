// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.25;

import "forge-std/Script.sol";
import {TransientToken} from "../src/TransientToken.sol";
import {IFactory} from "./interface/IFactory.sol";
contract DeployTransientToken is Script {

    function run() public {
        // addresses on Sepolia

        TransientToken token0= TransientToken(0x5a38BB9D84fEBf451c18282767BB11119B1CAD19);
        TransientToken token1= TransientToken(0xfcD57f579733a96C97608D6c7FF3a93151f4Cf0E);

        IFactory sepoliaDysonFactory = IFactory(0xb56b317345Be4757FeccaA08DbF82A82850Ff978);
        
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);
        token0.transfer(address(sepoliaDysonFactory),10_000);
        token1.transfer(address(sepoliaDysonFactory),10_000);
        
        sepoliaDysonFactory.createPair(address(token0),address(token1));

        vm.stopBroadcast();
        
    }

}