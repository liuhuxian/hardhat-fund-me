// const { getNamedAccounts, network, ethers, deployments } = require("hardhat");
// const { developmentChains } = require("../../helper-hardhat-config");
// const { namedAccounts } = require("../../hardhat.config");
// const { assert } = require("chai");

describe("[TEST]FundMe Contract", async () => {
    it("testing", async () => {
        console.log(`hello`);
    });

    console.log(`iamhere`);
});

// developmentChains.includes(network.name)
//     ? describe.skip
//     : describe("[TEST]FundMe Contract", async () => {
//           let fundMe;
//           const sendValue = ethers.parseUnits("1");
//           const provider = ethers.provider;
//           beforeEach(async function () {
//               const signer = await provider.getSigner();
//               const fundMe_d = await deployments.get("FundMe");
//               fundMe = await ethers.getContractAt(
//                   "FundMe",
//                   fundMe_d.address,
//                   signer,
//               );
//           });

//           it("testing", async () => {
//               console.log(`hello`);
//           });

//           console.log(`iamhere`);

//           it("allows people to fund and withdraw", async () => {
//               console.log({ fundMe });
//               const fundTxResponse = await fundMe.fund({ value: sendValue });
//               await fundTxResponse.wait(1);
//               const withdrawTxResponse = await fundMe.withdraw();
//               await withdrawTxResponse.wait(1);

//               const endingBalance = await provider.getBalance(fundMe.target);
//               console.log(`endingBalance ${endingBalance}`);
//               assert.equal(endingBalance.toString(), "0");
//               console.log(`endingBalance ${endingBalance}`);
//           });
//       });
