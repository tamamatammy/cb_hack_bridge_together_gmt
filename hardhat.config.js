require("@nomiclabs/hardhat-waffle");
require('@nomiclabs/hardhat-ethers');
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 module.exports = {
  networks: {
    localhost: { // or "hardhat"
      chainId: 31337,
      url: "http://127.0.0.1:8545"
    },
    hardhat: {
      accounts: {
        mnemonic: 'test test test test test test test test test test test junk'
      }
    },
    optimism: {
      url: 'http://127.0.0.1:9545',
      accounts: {
        mnemonic: 'test test test test test test test test test test test junk'
      },
      gasPrice: 0
    },
    // optimism_kovan: {
    //   url: 'https://opt-kovan.g.alchemy.com/v2/{project_key}',
    //   accounts: [private_key],
    //   gasPrice: 0
    // },
    // ethereum_kovan: {
    //   url: 'https://eth-kovan.alchemyapi.io/v2/{project_key}',
    //   accounts: [private_key],
    //   gasPrice: 0
    // }
  },
  solidity: '0.8.9'
};