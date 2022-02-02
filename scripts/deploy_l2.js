async function main() {
    // We get the contract to deploy
    const L2 = await ethers.getContractFactory("L2Distributor");
    const l2 = await L2.deploy();
  
    console.log("L2Distributor deployed to:", l2.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });