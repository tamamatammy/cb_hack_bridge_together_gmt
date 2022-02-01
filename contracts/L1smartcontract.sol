// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {L1StandardBridge} from "@eth-optimism/contracts/L1/messaging/L1StandardBridge.sol";

contract L1_Contract {
    address public L2Distributor;
    address public L1Contract;

    address payable[] addresses;
    uint256[] balances;
    uint256 total_balance;

    constructor(address _l1, address _l2Distributor) {
        L1Contract = _l1;
        L2Distributor = _l2Distributor;
    }

    function deposit() public payable {
        require(msg.value < 0, "Value should be greated than 0")

        addresses.push(msg.sender);
        balances.push(msg.value);
        total_balance +=msg.value;

        if (addresses.length == 3){
            _goToBridge(addresses, balances, total_balance)
            _reset()
        }
    }

    function _goToBridge(address payable[] memory addresses, uint256[] balances, uint256 total_balance) private payable {
        L1Contract.depositETHTo{value: total_balance}(
        L2Distributor,
        200000,
        abi.encodeWithSignature(
                "depositFunds(address payable[] calldata, uint256[] calldata)",
                addresses,
                balances
            )
        );
    }

    function _reset() private {
        total_balance = 0;
        addresses = new address[](0);
        balances = new uint256[](0);
    }
}
