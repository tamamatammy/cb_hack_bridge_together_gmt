const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");
const provider = waffle.provider;

describe("L1_Contract", function () {
  it("should send the funds", async function () {
 
    const L1_Contract = await ethers.getContractFactory("L1_Contract");
    const l2Address = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
    const userAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    //const user = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";

    const usersAccounts = await ethers.getSigners();
    const user1 = usersAccounts[0]
    console.log(user1.address)
    const user1Address = user1.getAddress()
    
    const instance = await L1_Contract.deploy(l2Address);
    await instance.deployed();

    initialContractBalance = await ethers.provider.getBalance(instance.address)
    console.log("contractBalanceBefore", initialContractBalance)


    // FIRST DEPOSIT
    console.log("----------FIRST DEPOSIT ")

    await instance.deposit({from: userAddress,  value: ethers.utils.parseEther("1.0")});
    await instance.deposit({from: userAddress,  value: ethers.utils.parseEther("1.0")});
    await instance.deposit({from: userAddress,  value: ethers.utils.parseEther("1.0")});
    const balance = await provider.getBalance(instance.address)
    console.log(balance)
    // console.log(num_deposit)
    // const user1Instance = instance.connect(user1Address)
    // const senderInitialBalance = await user1Instance.getSenderInitialBalance(userAddress)
    // senderInitialBalance = await ethers.provider.getBaance(user1Address)
    // console.log("senderInitialBalance", senderInitialBalance)
    // await user1Instance.signTransaction(deposit({value: "1000000000000000000"}));


    // const addressesCount = await user1Instance.getCount();
    // const totalBalance = await user1Instance.getTotalBalance();
    // expect(addressesCount).to.equal(1);
    // expect(totalBalance).to.equal("1000000000000000000");

    // const finalBalance = await user1Instance.getSenderInitialBalance(user1Address);

    // console.log("INITIAL BALANCE: ", initialBalance, " FINAL BAALNCE: ", finalBalance);

    // // SECOND DEPOSIT
    // console.log("----------SECOND DEPOSIT ")
    // const initialBalance2 = await l1Contract.getSenderInitialBalance(a1)
    // await a1.l1Contract.deposit({value: "1000000000000000000"});

    // const addressesCount2 = await l1Contract.getCount();
    // const totalBalance2 = await l1Contract.getTotalBalance();
    // expect(addressesCount2).to.equal(2);
    // expect(totalBalance2).to.equal("2000000000000000000");

    // const finalBalance2 = await l1Contract.getSenderInitialBalance(a1)

    // console.log("INITIAL BALANCE: ", initialBalance2, " FINAL BAALNCE: ", finalBalance2)

    // const contractBalance = await l1Contract.getContractBalance()
    // expect(contractBalance).to.equal("2000000000000000000");
    // console.log("CONTRACT BALANCE: ", contractBalance)

    // // THIRD DEPOSIT
    // console.log("----------THIRD DEPOSIT ")
    // const initialBalance3 = await l1Contract.getSenderInitialBalance(a1)
    // await a1.l1Contract.deposit({value: "1000000000000000000"});

    // const addressesCount3 = await l1Contract.getCount();
    // const totalBalance3 = await l1Contract.getTotalBalance();
    // expect(addressesCount3).to.equal(0);
    // expect(totalBalance3).to.equal(0);

    // const finalBalance3 = await l1Contract.getSenderInitialBalance(a1)
    // console.log("INITIAL BALANCE: ", initialBalance3, " FINAL BAALNCE: ", finalBalance3)

    // const contractBalance2 = await l1Contract.getContractBalance()
    // expect(contractBalance2).to.equal(0);





    //expect(await l1Contract.greet()).to.equal("Hello, world!");

    //const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    //await setGreetingTx.wait();

    //expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});