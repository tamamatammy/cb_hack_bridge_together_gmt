
   
// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import {L1StandardBridge} from "@eth-optimism/contracts";

contract L1Contract {
    address public BridgeAddress;
    address public L1Contract;

    address[] addresses;
    uint256[] balances;
    uint256 total_balance;

    constructor(address _l1,address _bridge) internal{
        L1Contract = _l1;
        BridgeAddress = _bridge;
    }

    function deposit() public payable {
        addresses.push(msg.sender);
        balances.push(msg.value);
        total_balance +=msg.value;

        L1StandardBridge.depositETHTo {value: total_balance }(
        BridgeAddress, // ++ L2 contract here, ty
        200000,
        abi.encodeWithSignature(
                "depositFunds(address payable[] calldata, uint256[] calldata)",
                addresses,
                balances
            )
        );
        total_balance = 0;
        delete addresses;
        delete balances;
    }

}