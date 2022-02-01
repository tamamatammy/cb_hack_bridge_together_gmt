// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract L2Distributor {
    function depositFunds(address payable[] calldata receipientAddresses, uint256[] calldata recepientValues) external payable {
        require(receipientAddresses.length == recepientValues.length, "Address values length mismatch");
        uint256 fundsToTransfer = 0;
        for (uint i = 0; i < recepientValues.length; i ++) {
            fundsToTransfer += recepientValues[i];
        }
        require(fundsToTransfer <= msg.value, "Funds being disbursed are more than funds transferred");
        for (uint i = 0; i < recepientValues.length; i ++) {
            receipientAddresses[i].transfer(recepientValues[i]);
        }
    }

}
