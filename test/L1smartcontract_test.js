const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");
const { predeploys, getContractInterface } = require('@eth-optimism/contracts')
const key = '0x689af8efa8c651a91ad287602527f3af2fe9f6501a7ac4b061667b5a93e037fd'
const l1Url = 'http://localhost:9545'
const l2Url = 'http://localhost:8545'
const l1RpcProvider = new ethers.providers.JsonRpcProvider(l1Url)
const l2RpcProvider = new ethers.providers.JsonRpcProvider(l2Url)




describe("L1BridgeTogether", function () {
  it("should send the funds", async function () {
    const l2Wallet = new ethers.Wallet(key, l2RpcProvider)

    console.log("reached here")
    const l2StandardBridgeArtifact = require(`../node_modules/@eth-optimism/contracts/artifacts/contracts/L2/messaging/L2StandardBridge.sol/L2StandardBridge.json`)
    const factory__L2StandardBridge = new ethers.ContractFactory(l2StandardBridgeArtifact.abi, l2StandardBridgeArtifact.bytecode)
    
    console.log(predeploys)
    const L2StandardBridge = factory__L2StandardBridge.connect(l2Wallet).attach(predeploys.L2StandardBridge)
    console.log("reached here")
    const L1StandardBridgeAddress = await L2StandardBridge.l1TokenBridge()
    console.log("reached here")

    const L1BridgeTogether_contract = await ethers.getContractFactory("L1BridgeTogether");
    const l2Address = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
    const userAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    
    console.log(L1StandardBridgeAddress)
    const instance = await L1BridgeTogether_contract.deploy(l2Address, L1StandardBridgeAddress);
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
