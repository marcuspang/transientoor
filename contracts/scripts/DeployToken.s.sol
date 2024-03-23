// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.25;

import "forge-std/Script.sol";
import {TransientToken} from "../src/TransientToken.sol";

contract DeployTransientToken is Script {
    event NewContract(address newContract);

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);
        TransientToken token0 = new TransientToken("TokenOne", "TT1");
        emit NewContract(address(token0));
        TransientToken token1 = new TransientToken("TokenTwo", "TT2");
        emit NewContract(address(token1));

        vm.stopBroadcast();
    }
}
