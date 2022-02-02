// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {L1StandardBridge} from "@eth-optimism/contracts/L1/messaging/L1StandardBridge.sol";
import "hardhat/console.sol";

contract L1BridgeTogether {
    address public L2Distributor;
    L1StandardBridge public l1StandardBridge;

    address payable[] addresses;
    uint256[] balances;
    uint256 totalBalance;
    uint private maxCount = 3;

    constructor(address _l2Distributor, address payable standardBridge) {
        L2Distributor = _l2Distributor;
        l1StandardBridge = L1StandardBridge(standardBridge);
    }

    event L1BridgeTogetherFundsReceived(address adr, uint256 amount);
    event L1BridgeTogetherGoToBridge(address payable[] adr, uint256[] amount);

    fallback() external payable { revert(); }

    receive() external payable {}

    function deposit() public payable returns(uint) {
        emit L1BridgeTogetherFundsReceived(msg.sender, msg.value);
        require(msg.value > 0, "Value should be greated than 0");
        addresses.push(payable(msg.sender));
        balances.push(msg.value);
        totalBalance += msg.value;

        console.log("CONTRACT current_count:", addresses.length);
        if (addresses.length == maxCount){
            goToBridge();
            _reset();
        }
        return addresses.length;
    }

    function goToBridge() public payable {
        console.log("CONTRACT goToBridge totalBalance ", totalBalance);

        uint256 gas = 200000;
        uint256 remainingAmount = totalBalance - gas;
        uint256 gasShare = gas / maxCount;

        for (uint i = 0; i < addresses.length; i ++) {
            balances[i] = balances[i] - gasShare;
            totalBalance += balances[i];
        }
        
        emit L1BridgeTogetherGoToBridge(addresses, balances);

        l1StandardBridge.depositETHTo {value: remainingAmount} (
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

    function getL2Distributor() public view returns(address) {
        return L2Distributor;
    }
    
    function getContractBalance() public view returns(uint256 count) {
        return address(this).balance;
    }
}