const l1Url = 'http://localhost:9545'
const l2Url = 'http://localhost:8545'
const key = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'


const ethers = require('ethers')
const { predeploys, getContractInterface } = require('@eth-optimism/contracts')


const l1StandardBridgeArtifact = require(`../node_modules/@eth-optimism/contracts/artifacts/contracts/L1/messaging/L1StandardBridge.sol/L1StandardBridge.json`)
const factory__L1StandardBridge = new ethers.ContractFactory(l1StandardBridgeArtifact.abi, l1StandardBridgeArtifact.bytecode)

const l2StandardBridgeArtifact = require(`../node_modules/@eth-optimism/contracts/artifacts/contracts/L2/messaging/L2StandardBridge.sol/L2StandardBridge.json`)
const factory__L2StandardBridge = new ethers.ContractFactory(l2StandardBridgeArtifact.abi, l2StandardBridgeArtifact.bytecode)

async function main() {
  // Set up our RPC provider connections.
  const l1RpcProvider = new ethers.providers.JsonRpcProvider(l1Url)
  const l2RpcProvider = new ethers.providers.JsonRpcProvider(l2Url)

  // We need two wallets objects, one for interacting with L1 and one for interacting with L2.
  // Both will use the same private key (and therefore have the same address)
  const l1Wallet = new ethers.Wallet(key, l1RpcProvider)
  const l2Wallet = new ethers.Wallet(key, l2RpcProvider)

  // Get balances. This function is definted inside of main() so it can access local variables
  const getBalances = async () => {
    var l1Eth = ethers.utils.formatEther(await l1RpcProvider.getBalance(l1Wallet.address))
    var l2Eth = ethers.utils.formatEther(await l2RpcProvider.getBalance(l2Wallet.address))

    return [l1Eth, l2Eth]
  }    // getBalances

  // L2StandardBridge is always at the same address. We can use that to get the address for
  // L1StandardBridge. On Kovan and mainnet we can also use the known deployment addresses,
  // but this logic also works for local development nodes
  const L2StandardBridge = factory__L2StandardBridge.connect(l2Wallet)
      .attach(predeploys.L2StandardBridge)
  const L1StandardBridgeAddress = await L2StandardBridge.l1TokenBridge()
  const L1StandardBridge = factory__L1StandardBridge.connect(l1Wallet).attach(L1StandardBridgeAddress)

  // Balances before the transaction
  const balancesB4 = await getBalances()

//   tx = await L1StandardBridge.depositETH(
//     200000,     // Gas for L2 transaction
//     [],         // Data to provide with the transaction
//     {     // Transaction parameters
//         value:    ethers.utils.parseEther("1"),
//         gasLimit: 150000
//     }
//   )

  tx = await L1StandardBridge.depositETHTo(
      '0x70997970c51812dc3a010c7d01b50e0d17dc79c8', // ++ L2 contract here, ty
      200000,
      []
      )

  let balancesNow = await getBalances()

  console.log(`Balances before the operation\tL1:${balancesB4[0]}\tL2:${balancesB4[1]}`)
  console.log(`Balances after the operation\tL1:${balancesNow[0]}\tL2:${balancesNow[1]}`)

  // Until the ETH gets deposited to L2
//   var seconds = 0
//   while (balancesNow[1] == balancesB4[1]) {
//     await new Promise(resolve => setTimeout(resolve, 1000))   // wait a second
//     seconds++
//     balancesNow = await getBalances()
//     console.log(`Balances after ${seconds} second${seconds-1 ? "s" : ""} \tL1:${balancesNow[0]}\tL2:${balancesNow[1]}`)
//   }
} // main()

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })