// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {L1StandardBridge} from "@eth-optimism/contracts/L1/messaging/L1StandardBridge.sol";
import "hardhat/console.sol";

contract L1BridgeTogether2 {
    address public L2Distributor;

    address payable[] private addresses;
    uint256[] private balances;
    uint256[] private timestamps;
    uint256 private pointer = 0;
    uint256 private totalBalance = 0;
    uint256 private currentCount = 0;
    uint private maxCount = 3;
    address payable[] addressesReady;
    uint256[] private balancesReady;

    constructor(address _l2Distributor) {
        L2Distributor = _l2Distributor;
    }

    fallback() external payable { revert(); }

    receive() external payable {}

    function trigger() public {
        // set timer from the Dapp
         console.log("CONTRACT before check readiness, totalBalance: ", totalBalance);
        _checkReadinessTimestamp(block.timestamp);
        console.log("CONTRACT after check readiness, totalBalance: ", totalBalance);
        if (totalBalance > 0) {
            goToBridge();
            _reset();
        }
    }

    function deposit() public payable returns(uint) {
        console.log("HERE!!!!!!");
        require(msg.value > 0, "Value should be greated than 0");
        addresses.push(payable(msg.sender));
        balances.push(msg.value);
        timestamps.push(block.timestamp);
        currentCount += 1;

        if (currentCount == maxCount){
            console.log("CONTRACT before check readiness, totalBalance: ", totalBalance);
            _checkReadiness();
            console.log("CONTRACT after check readiness, totalBalance: ", totalBalance);
            if (totalBalance > 0) {
                goToBridge();
                _reset();
                console.log("CONTRACT after reset, totalBalance: ", totalBalance);
            }
        }
        return addresses.length;
    }

    function goToBridge() public payable {
        uint256 remainingAmount = totalBalance - 200000;

        console.log("CONTRACT goToBridge ", remainingAmount);

        // L1StandardBridge(payable(address(this))).depositETHTo {value: remainingAmount} (
        //     L2Distributor,
        //     200000,
        //     abi.encodeWithSignature(
        //         "depositFunds(address payable[] calldata, uint256[] calldata)",
        //         addressesReady,
        //         balancesReady
        //     )
        // );
    }

    function _reset() private {
        totalBalance = 0;
        currentCount = 0;
        addressesReady = new address payable[](0);
        balancesReady = new uint256[](0);
    }

    function _checkReadiness() private {
        while (pointer <  addresses.length){
            _readyToBridge();
        }
    }

    function _checkReadinessTimestamp(uint256 currentTime) private {
        // allow stale values just for 24 h
        while (pointer < timestamps.length && (currentTime - timestamps[pointer]) >= 1 days ){
            _readyToBridge();
        }
    }

    function _readyToBridge() private {
        addressesReady.push(addresses[pointer]);
        balancesReady.push(balances[pointer]);
        totalBalance += balances[pointer];
        pointer += 1;
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
