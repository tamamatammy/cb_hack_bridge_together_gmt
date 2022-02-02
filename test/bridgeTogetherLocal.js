const { expect } = require("chai")
const { ethers, waffle } = require("hardhat")
const { predeploys, getContractInterface } = require('@eth-optimism/contracts')

describe("L1BridgeTogether", function () {
  it("should send the funds", async function () {

    const l1StandardBridgeArtifact = require(`@eth-optimism/contracts/artifacts/contracts/L1/messaging/L1StandardBridge.sol/L1StandardBridge`)
    const l2StandardBridgeArtifact = require(`@eth-optimism/contracts/artifacts/contracts/L2/messaging/L2StandardBridge.sol/L2StandardBridge`)

    const l1Url = 'http://localhost:9545'
    const l2Url = 'http://localhost:8545'
    const keyStandardBridge = '0x689af8efa8c651a91ad287602527f3af2fe9f6501a7ac4b061667b5a93e037fd'
    const keyBridgeTogether = '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d'

    //const l2Address = '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318' // "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    //const userAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    const userPrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"

    const factory__L1StandardBridge = new ethers.ContractFactory(l1StandardBridgeArtifact.abi, l1StandardBridgeArtifact.bytecode)
    const factory__L2StandardBridge = new ethers.ContractFactory(l2StandardBridgeArtifact.abi, l2StandardBridgeArtifact.bytecode)

    console.log('1-----')
    // Set up our RPC provider connections.
    const l1RpcProvider = new ethers.providers.JsonRpcProvider(l1Url)
    const l2RpcProvider = new ethers.providers.JsonRpcProvider(l2Url)
    // We need two wallets objects, one for interacting with L1 and one for interacting with L2.
    // Both will use the same private key (and therefore have the same address)

    // StandardBridge wallets
    const StandardBridgeL1Wallet = new ethers.Wallet(keyStandardBridge, l1RpcProvider)
    const StandardBridgeL2Wallet = new ethers.Wallet(keyStandardBridge, l2RpcProvider)

    // BridgeTogether wallets
    const BridgeTogetherL1Wallet = new ethers.Wallet(keyBridgeTogether, l1RpcProvider)
    const BridgeTogetherL2Wallet = new ethers.Wallet(keyBridgeTogether, l2RpcProvider)

    // User wallet
    const UserL1Wallet = new ethers.Wallet(userPrivateKey, l1RpcProvider)
    const UserL2Wallet = new ethers.Wallet(userPrivateKey, l2RpcProvider)

    console.log('2-----')
    const getBalances = async () => {
      // var l1Eth = ethers.utils.formatEther(await l1RpcProvider.getBalance(l1Wallet.address))
      // var l2Eth = ethers.utils.formatEther(await l2RpcProvider.getBalance(l2Wallet.address))
      var L1User = ethers.utils.formatEther(await l1RpcProvider.getBalance(UserL1Wallet.address))
      var L1Us = ethers.utils.formatEther(await l1RpcProvider.getBalance(BridgeTogetherL1Wallet.address))
      var Instance = ethers.utils.formatEther(await l1RpcProvider.getBalance(instance.address))
      var L1Bridge = ethers.utils.formatEther(await l2RpcProvider.getBalance(StandardBridgeL1Wallet.address))
      var L2Bridge = ethers.utils.formatEther(await l2RpcProvider.getBalance(StandardBridgeL2Wallet.address))
      var L2Us = ethers.utils.formatEther(await l2RpcProvider.getBalance(BridgeTogetherL2Wallet.address))
      var instanceL2 = ethers.utils.formatEther(await l1RpcProvider.getBalance(L2BridgeTogether.address))
      var L2User = ethers.utils.formatEther(await l2RpcProvider.getBalance(UserL2Wallet.address))
      return [L1User, L1Us, Instance, L1Bridge, L2Bridge, L2Us,instanceL2, L2User]
    }    // getBalances

    // L2StandardBridge is always at the same address. We can use that to get the address for
    // L1StandardBridge. On Kovan and mainnet we can also use the known deployment addresses,
    // but this logic also works for local development nodes
    const L2StandardBridge = factory__L2StandardBridge.connect(StandardBridgeL2Wallet).attach(predeploys.L2StandardBridge)
    const L1StandardBridgeAddress = await L2StandardBridge.l1TokenBridge()
    const L1StandardBridge = factory__L1StandardBridge.connect(StandardBridgeL1Wallet).attach(L1StandardBridgeAddress)
    console.log('3-----')
    // Creative
    const L2BridgeTogether_contract = await ethers.getContractFactory("L2Distributor");
    console.log('4-----')
    const L2BridgeTogether = await L2BridgeTogether_contract.connect(BridgeTogetherL2Wallet).deploy();
    console.log('5-----')
    const L1BridgeTogether_contract = await ethers.getContractFactory("L1BridgeTogether");
    console.log('6-----')
    const instance = await L1BridgeTogether_contract.connect(BridgeTogetherL1Wallet).deploy(L2BridgeTogether.address, L1StandardBridgeAddress)
    console.log('7-----')
    // ------

    // const L1BridgeTogether_contract = await ethers.getContractFactory("L1BridgeTogether");
    // const instance = await L1BridgeTogether_contract.connect(BridgeTogetherL1Wallet).deploy(l2Address, L1StandardBridgeAddress);
    console.log('5-----')

    await instance.deployed();

    // console.log("bridge contract from bridge together", await instance.l1StandardBridge())
    // console.log("l2 standard bridge from bridge together", await L1StandardBridge.l2TokenBridge())
    console.log("user_address:", UserL1Wallet.address)
    console.log("BridgeTogetherL1_address:", BridgeTogetherL1Wallet.address)
    console.log("instance_address", instance.address)
    console.log("StandardBridgeL1_address:", UserL1Wallet.address)
    console.log("BridgeTogetherL2_address:", UserL1Wallet.address)
    console.log("userL2_address:", UserL2Wallet.address)
    console.log("initial balances: ", await getBalances())

    // FIRST DEPOSIT≠≠
    console.log("----------FIRST DEPOSIT----------")
    l = await instance.connect(UserL1Wallet).deposit({value: ethers.utils.parseEther("0.1")});
    console.log("LENGTH ", l)
    addressesCount = await instance.getCount();
    totalBalance = await instance.getTotalBalance();
    expect(addressesCount).to.equal(1);
    expect(totalBalance).to.equal(ethers.utils.parseEther("0.1"));
    console.log("final balances: ", await getBalances())

    // SECOND DEPOSIT
    console.log("----------SECOND DEPOSIT----------")
    l = await instance.connect(UserL1Wallet).deposit({value: ethers.utils.parseEther("0.1")});
    console.log("LENGTH ", l)
    addressesCount = await instance.getCount();
    totalBalance = await instance.getTotalBalance();
    expect(addressesCount).to.equal(2);
    expect(totalBalance).to.equal(ethers.utils.parseEther("0.2"));
    console.log("final balances: ", await getBalances())

    // THIRD DEPOSIT
    console.log("----------THIRD DEPOSIT----------")
    await instance.connect(UserL1Wallet).deposit({value: ethers.utils.parseEther("0.1"), gasLimit: "300000"});
    
    addressesCount = await instance.getCount();
    totalBalance = await instance.getTotalBalance();
    expect(addressesCount).to.equal(0);
    expect(totalBalance).to.equal(ethers.utils.parseEther("0.0"));
    console.log("final balances: ", await getBalances())
  });
});
