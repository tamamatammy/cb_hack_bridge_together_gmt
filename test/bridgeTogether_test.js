const { expect } = require("chai")
const { ethers, waffle } = require("hardhat")
const { predeploys, getContractInterface } = require('@eth-optimism/contracts')

describe("L1BridgeTogether", function () {
  it("should send the funds", async function () {
    const l1Url = 'http://localhost:9545'
    const l2Url = 'http://localhost:8545'
    const l1RpcProvider = new ethers.providers.JsonRpcProvider(l1Url)
    const l2RpcProvider = new ethers.providers.JsonRpcProvider(l2Url)

    // setup standard bridge
    const l1StandardBridgeArtifact = require(`@eth-optimism/contracts/artifacts/contracts/L1/messaging/L1StandardBridge.sol/L1StandardBridge`)
    const l2StandardBridgeArtifact = require(`@eth-optimism/contracts/artifacts/contracts/L2/messaging/L2StandardBridge.sol/L2StandardBridge`)
    const factory__L1StandardBridge = new ethers.ContractFactory(l1StandardBridgeArtifact.abi, l1StandardBridgeArtifact.bytecode)
    const factory__L2StandardBridge = new ethers.ContractFactory(l2StandardBridgeArtifact.abi, l2StandardBridgeArtifact.bytecode)
    
    const keyStandardBridge = '0x689af8efa8c651a91ad287602527f3af2fe9f6501a7ac4b061667b5a93e037fd'
    const StandardBridgeL1Wallet = new ethers.Wallet(keyStandardBridge, l1RpcProvider)
    const StandardBridgeL2Wallet = new ethers.Wallet(keyStandardBridge, l2RpcProvider)
    
    const L2StandardBridge = factory__L2StandardBridge.connect(StandardBridgeL2Wallet).attach(predeploys.L2StandardBridge)
    const L1StandardBridgeAddress = await L2StandardBridge.l1TokenBridge()
    const L1StandardBridge = factory__L1StandardBridge.connect(StandardBridgeL1Wallet).attach(L1StandardBridgeAddress)
    
    // setup L1BridgeTogether contract
    const L1BridgeTogether_contract = await ethers.getContractFactory("L1BridgeTogether");
    const L2BridgeTogether_address = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

    const keyBridgeTogether = '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d'
    const BridgeTogetherL1Wallet = new ethers.Wallet(keyBridgeTogether, l1RpcProvider)
    //const BridgeTogetherL2Wallet = new ethers.Wallet(keyBridgeTogether, l2RpcProvider)

    const instance = await L1BridgeTogether_contract.connect(BridgeTogetherL1Wallet).deploy(L2BridgeTogether_address, L1StandardBridgeAddress)
    await instance.deployed();


    // setup user
    const userPrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
    const UserL1Wallet = new ethers.Wallet(userPrivateKey, l1RpcProvider)
    const UserL2Wallet = new ethers.Wallet(userPrivateKey, l2RpcProvider)

    // aux functions
    const getBalances = async () => {
      // var l1Eth = ethers.utils.formatEther(await l1RpcProvider.getBalance(l1Wallet.address))
      // var l2Eth = ethers.utils.formatEther(await l2RpcProvider.getBalance(l2Wallet.address))
      var L1User = ethers.utils.formatEther(await l1RpcProvider.getBalance(UserL1Wallet.address))
      var L1Us = ethers.utils.formatEther(await l1RpcProvider.getBalance(BridgeTogetherL1Wallet.address))
      var Instance = ethers.utils.formatEther(await l1RpcProvider.getBalance(instance.address))
      var L1Bridge = ethers.utils.formatEther(await l1RpcProvider.getBalance(StandardBridgeL1Wallet.address))
      var L2Bridge = ethers.utils.formatEther(await l2RpcProvider.getBalance(StandardBridgeL2Wallet.address))
      var instanceL2 = ethers.utils.formatEther(await l2RpcProvider.getBalance(L2BridgeTogether_address))
      var L2User = ethers.utils.formatEther(await l2RpcProvider.getBalance(UserL2Wallet.address))
      return [L1User, L1Us, Instance, L1Bridge, L2Bridge,instanceL2, L2User]
    }

    // console.log("bridge contract from bridge together", await instance.l1StandardBridge())
    // console.log("l2 standard bridge from bridge together", await L1StandardBridge.l2TokenBridge())
    console.log("user_address:", UserL1Wallet.address)
    console.log("userL2_address:", UserL2Wallet.address)
    console.log("BridgeTogetherL1_address:", BridgeTogetherL1Wallet.address)
    console.log("instance_address", instance.address)
    console.log("BridgeTogetherL2_address:", L2BridgeTogether_address)
    
    console.log("StandardBridgeL1_address_wallet:", UserL1Wallet.address)
    console.log("StandardBridgeL1_address:", L1StandardBridgeAddress)
    
    
    console.log("initial balances: ", await getBalances())

    // FIRST DEPOSIT≠≠
    console.log("----------FIRST DEPOSIT----------")
    await expect(instance.connect(UserL1Wallet).deposit({value: ethers.utils.parseEther("0.1")})).to.emit(
      instance, "L1BridgeTogetherFundsReceived"
    );
    //console.log("LENGTH ", l)
    addressesCount = await instance.getCount();
    totalBalance = await instance.getTotalBalance();
    expect(addressesCount).to.equal(1);
    expect(totalBalance).to.equal(ethers.utils.parseEther("0.1"));
    console.log("first balances: ", await getBalances())

    // SECOND DEPOSIT
    console.log("----------SECOND DEPOSIT----------")
    l = await instance.connect(UserL1Wallet).deposit({value: ethers.utils.parseEther("0.1")});
    //console.log("LENGTH ", l)
    addressesCount = await instance.getCount();
    totalBalance = await instance.getTotalBalance();
    expect(addressesCount).to.equal(2);
    expect(totalBalance).to.equal(ethers.utils.parseEther("0.2"));
    console.log("second balances: ", await getBalances())

    // THIRD DEPOSIT
    console.log("----------THIRD DEPOSIT----------")
    await expect(instance.connect(UserL1Wallet).deposit({value: ethers.utils.parseEther("0.1")})).to.emit(
      instance, "L1BridgeTogetherGoToBridge"
    );
    addressesCount = await instance.getCount();
    totalBalance = await instance.getTotalBalance();
    expect(addressesCount).to.equal(0);
    expect(totalBalance).to.equal(ethers.utils.parseEther("0.0"));
    console.log("final balances: ", await getBalances())

    console.log(await instance.connect(UserL1Wallet).getL2Distributor())


  });
});


describe("L1BridgeTogether", function () {
  it("should distribute funds", async function () {
    const l2Url = 'http://localhost:8545'
    const l2RpcProvider = new ethers.providers.JsonRpcProvider(l2Url)
    const userPrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"

    const userWallet = new ethers.Wallet(userPrivateKey, l2RpcProvider)

    const L2BridgeTogether_contract = await ethers.getContractFactory("L2Distributor");
    const L2BridgeTogether_address = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

    const L2BridgeTogether = L2BridgeTogether_contract.attach(L2BridgeTogether_address);

    addresses = [userWallet.address]
    amount = [ethers.utils.parseEther("0.1")]

    console.log("user address", ethers.utils.formatEther(await l2RpcProvider.getBalance(userWallet.address)))
    let tx = {
      to: L2BridgeTogether_address,
      // Convert currency unit from ether to wei
      value: ethers.utils.parseEther("0.1")
    }

    await userWallet.sendTransaction(tx)

    console.log("user address", ethers.utils.formatEther(await l2RpcProvider.getBalance(userWallet.address)))
    console.log(ethers.utils.formatEther(await l2RpcProvider.getBalance(L2BridgeTogether_address)))
    console.log("user address", ethers.utils.formatEther(await l2RpcProvider.getBalance(userWallet.address)))

    await expect(L2BridgeTogether.emitSomeEvent()).to.emit(L2BridgeTogether, "L2DistributorFundsReceived")

    //await expect(L2BridgeTogether.depositFunds(addresses, amount)).to.emit(L2BridgeTogether, "L2DistributorFundsReceived")
 

    console.log("user address", ethers.utils.formatEther(await l2RpcProvider.getBalance(userWallet.address)))


  })
});
