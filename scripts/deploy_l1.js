async function main() {
    // We get the contract to deploy
    l2_address = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9'
    const L1Contract = await ethers.getContractFactory("L1Contract");
    const l1 = await L1Contract.deploy(l2_address);
  
    console.log("Greeter deployed to:", l1.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });