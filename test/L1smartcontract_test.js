const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("L1_Contract", function () {
  it("should send the funds", async function () {
    const L1_Contract = await ethers.getContractFactory("L1_Contract");
    const a1 = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    const a2 = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
    //const user = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";
    const l1Contract = await L1_Contract.deploy(a1, a2);
    await l1Contract.deployed();

    // FIRST DEPOSIT
    console.log("----------FIRST DEPOSIT ")
    const initialBalance = await l1Contract.getSenderInitialBalance(a1)
    await l1Contract.deposit({value: 1000000000000000000});


    const addressesCount = await l1Contract.getCount();
    const totalBalance = await l1Contract.getTotalBalance();
    expect(addressesCount).to.equal(1);
    expect(totalBalance).to.equal(1);

    const finalBalance = await l1Contract.getSenderInitialBalance(a1);

    console.log("INITIAL BALANCE: ", initialBalance, " FINAL BAALNCE: ", finalBalance);

    // SECOND DEPOSIT
    console.log("----------SECOND DEPOSIT ")
    const initialBalance2 = await l1Contract.getSenderInitialBalance(a1)
    await l1Contract.deposit({value: 1000000000000000000});

    const addressesCount2 = await l1Contract.getCount();
    const totalBalance2 = await l1Contract.getTotalBalance();
    expect(addressesCount2).to.equal(2);
    expect(totalBalance2).to.equal(2);

    const finalBalance2 = await l1Contract.getSenderInitialBalance(a1)

    console.log("INITIAL BALANCE: ", initialBalance2, " FINAL BAALNCE: ", finalBalance2)

    const contractBalance = await l1Contract.getContractBalance()
    expect(contractBalance).to.equal(2);
    console.log("CONTRACT BALANCE: ", contractBalance)

    // THIRD DEPOSIT
    console.log("----------THIRD DEPOSIT ")
    const initialBalance3 = await l1Contract.getSenderInitialBalance(a1)
    await l1Contract.deposit({value: 1000000000000000000});

    const addressesCount3 = await l1Contract.getCount();
    const totalBalance3 = await l1Contract.getTotalBalance();
    expect(addressesCount3).to.equal(0);
    expect(totalBalance3).to.equal(0);

    const finalBalance3 = await l1Contract.getSenderInitialBalance(a1)
    console.log("INITIAL BALANCE: ", initialBalance3, " FINAL BAALNCE: ", finalBalance3)

    const contractBalance2 = await l1Contract.getContractBalance()
    expect(contractBalance2).to.equal(0);





    //expect(await l1Contract.greet()).to.equal("Hello, world!");

    //const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    //await setGreetingTx.wait();

    //expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});