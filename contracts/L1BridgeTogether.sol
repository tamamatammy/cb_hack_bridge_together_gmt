// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {L1StandardBridge} from "@eth-optimism/contracts/L1/messaging/L1StandardBridge.sol";
import "hardhat/console.sol";

contract L1BridgeTogether {
    address public L2Distributor;

    address payable[] addresses;
    uint256[] balances;
    uint256 totalBalance;

    constructor(address _l2Distributor) {
        L2Distributor = _l2Distributor;
    }

    fallback() external payable { revert(); }

    receive() external payable {}

    function deposit() public payable returns(uint) {
        require(msg.value > 0, "Value should be greated than 0");
        addresses.push(payable(msg.sender));
        balances.push(msg.value);
        totalBalance += msg.value;

        if (addresses.length == 3){
            goToBridge();
            _reset();
        }
        return addresses.length;
    }

    function goToBridge() public payable {
        console.log("CONTRACT goToBridge totalBalance ", totalBalance);

        uint256 remainingAmount = totalBalance - 200000;

        console.log("CONTRACT goToBridge ", remainingAmount);

        // L1StandardBridge(payable(address(this))).depositETHTo {value: remainingAmount} (
        //     L2Distributor,
        //     200000000,
        //     abi.encodeWithSignature(
        //         "depositFunds(address payable[] calldata, uint256[] calldata)",
        //         addresses,
        //         balances
        //     )
        // );
    }

    function _reset() private {
        totalBalance = 0;
        addresses = new address payable[](0);
        balances = new uint256[](0);
    }

    function getCount() public view returns(uint count) {
    return addresses.length;
    }

    function getTotalBalance() public view returns(uint256 count) {
    return totalBalance;
    }

    function getAccountBalance(address a) public view returns(uint256 count) {
        return a.balance;
    }
    
    function getContractBalance() public view returns(uint256 count) {
        return address(this).balance;
    }
}
