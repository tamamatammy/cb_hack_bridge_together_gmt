const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");
const provider = waffle.provider;

describe("L1_Contract", function () {
  it("should send the funds", async function () {
 
    const L1_Contract = await ethers.getContractFactory("L1_Contract");
    const l2Address = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
    const userAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    
    const instance = await L1_Contract.deploy(l2Address);
    await instance.deployed();

    initialContractBalance = await ethers.provider.getBalance(instance.address)
    console.log("Initial Contract Balance: ", initialContractBalance)

    initialL2AddressBalance = await instance.getAccountBalance(l2Address)


    // FIRST DEPOSIT
    console.log("----------FIRST DEPOSIT----------")

    await instance.deposit({from: userAddress,  value: ethers.utils.parseEther("0.1")});

    addressesCount = await instance.getCount();
    totalBalance = await instance.getTotalBalance();
    expect(addressesCount).to.equal(1);
    expect(totalBalance).to.equal(ethers.utils.parseEther("0.1"));
    contractBalance = await ethers.provider.getBalance(instance.address)
    expect(contractBalance).to.equal(ethers.utils.parseEther("0.1"))

    // SECOND DEPOSIT
    console.log("----------SECOND DEPOSIT----------")

    await instance.deposit({from: userAddress,  value: ethers.utils.parseEther("0.1")});
    
    addressesCount = await instance.getCount();
    totalBalance = await instance.getTotalBalance();
    expect(addressesCount).to.equal(2);
    expect(totalBalance).to.equal(ethers.utils.parseEther("0.2"));
    contractBalance = await ethers.provider.getBalance(instance.address)
    expect(contractBalance).to.equal(ethers.utils.parseEther("0.2"))

    // THIRD DEPOSIT
    console.log("----------THIRD DEPOSIT----------")

    await instance.deposit({from: userAddress,  value: ethers.utils.parseEther("0.1")});
    
    addressesCount = await instance.getCount();
    totalBalance = await instance.getTotalBalance();
    expect(addressesCount).to.equal(0);
    expect(totalBalance).to.equal(ethers.utils.parseEther("0.0"));
    // contractBalance = await ethers.provider.getBalance(instance.address)
    // expect(contractBalance).to.equal(ethers.utils.parseEther("0.0"))
    l2ContractBalance = await instance.getAccountBalance(l2Address)
    console.log("initial l2:", initialL2AddressBalance, "final l2: ", l2ContractBalance)
  });
});