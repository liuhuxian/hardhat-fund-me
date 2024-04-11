const { assert, expect } = require("chai");
const { network, deployments, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("[TEST]FundMe Contract", async function () {
          let fundMe;
          let deployer;
          let mockV3Aggregator;
          provider = ethers.provider;
          const sendValue = ethers.parseUnits("1");
          beforeEach(async function () {
              const signer = await provider.getSigner();
              deployer = (await getNamedAccounts()).deployer;
              await deployments.fixture("all");
              fundMe_d = await deployments.get("FundMe");

              fundMe = await ethers.getContractAt(
                  "FundMe",
                  fundMe_d.address,
                  signer,
              );
              mockV3Aggregator_d = await deployments.get("MockV3Aggregator");
              mockV3Aggregator = await ethers.getContractAt(
                  "MockV3Aggregator",
                  mockV3Aggregator_d.address,
                  signer,
              );
          });

          describe("[TEST]constructor()", async function () {
              it("sets the aggregator addresses correctly", async () => {
                  const response = await fundMe.getPriceFeed();
                  assert.equal(response, mockV3Aggregator.target);
              });
          });

          describe("[TEST]fund()", async () => {
              it("Fails if you don't send enough ETH", async () => {
                  await expect(fundMe.fund()).to.be.revertedWith(
                      "You need to spend more ETH!",
                  );
              });

              it("Updated the amount funded data structure", async () => {
                  await fundMe.fund({ value: sendValue });
                  const response = await fundMe.getAddressToFunded(deployer);
                  assert.equal(response, sendValue);
              });

              it("Adds funder to array of funders", async () => {
                  await fundMe.fund({ value: sendValue });
                  const funder = await fundMe.getFunder(0);
                  assert.equal(funder, deployer);
              });
          });

          describe("[TEST]withdraw()", async () => {
              beforeEach(async () => {
                  await fundMe.fund({ value: sendValue });
              });

              it("withdraw ETH from a single founder", async () => {
                  //arrange
                  const startingFundMeBalance = await provider.getBalance(
                      fundMe.target,
                  );
                  const startingdeployerBalance =
                      await provider.getBalance(deployer);

                  //act
                  const transactionResponse = await fundMe.withdraw();
                  const transactionReceipt = await transactionResponse.wait(1);
                  const gasCost =
                      transactionReceipt.gasPrice * transactionReceipt.gasUsed;

                  const endingFundMeBalance = await provider.getBalance(
                      fundMe.target,
                  );
                  const endingdeployerBalance =
                      await provider.getBalance(deployer);

                  //assert
                  assert.equal(endingFundMeBalance, 0);
                  assert.equal(
                      startingFundMeBalance + startingdeployerBalance,
                      endingdeployerBalance + gasCost,
                  );
              });

              it("allow us to withdraw with multiple funders", async () => {
                  const accounts = await ethers.getSigners();
                  for (let i = 1; i < 6; i++) {
                      const FundMeConnectedContract = await fundMe.connect(
                          accounts[i],
                      );
                      await FundMeConnectedContract.fund({ value: sendValue });
                  }

                  const startingFundMeBalance = await provider.getBalance(
                      fundMe.target,
                  );
                  const startingdeployerBalance =
                      await provider.getBalance(deployer);

                  const transactionResponse = await fundMe.withdraw();
                  const transactionReceipt = await transactionResponse.wait(1);
                  const gasCost =
                      transactionReceipt.gasPrice * transactionReceipt.gasUsed;

                  const endingFundMeBalance = await provider.getBalance(
                      fundMe.target,
                  );
                  const endingdeployerBalance =
                      await provider.getBalance(deployer);

                  for (let i = 1; i < 6; i++) {
                      assert.equal(
                          await fundMe.getAddressToFunded(accounts[i]),
                          0,
                      );
                  }
              });

              it("only allows the owner to withdraw ", async () => {
                  const accounts = await ethers.getSigners();
                  const attacter = accounts[1];
                  const attacterConnectedContract =
                      await fundMe.connect(attacter);
                  await expect(
                      attacterConnectedContract.withdraw(),
                  ).to.be.revertedWith("sender is not i_owner");
              });
          });

          describe("[TEST]cheaperwithdraw()", async () => {
              beforeEach(async () => {
                  await fundMe.fund({ value: sendValue });
              });

              it("withdraw ETH from a single founder", async () => {
                  //arrange
                  const startingFundMeBalance = await provider.getBalance(
                      fundMe.target,
                  );
                  const startingdeployerBalance =
                      await provider.getBalance(deployer);

                  //act
                  const transactionResponse = await fundMe.cheaperwithdraw();
                  const transactionReceipt = await transactionResponse.wait(1);
                  const gasCost =
                      transactionReceipt.gasPrice * transactionReceipt.gasUsed;

                  const endingFundMeBalance = await provider.getBalance(
                      fundMe.target,
                  );
                  const endingdeployerBalance =
                      await provider.getBalance(deployer);

                  //assert
                  assert.equal(endingFundMeBalance, 0);
                  assert.equal(
                      startingFundMeBalance + startingdeployerBalance,
                      endingdeployerBalance + gasCost,
                  );
              });

              it("allow us to withdraw with multiple funders", async () => {
                  const accounts = await ethers.getSigners();
                  for (let i = 1; i < 6; i++) {
                      const FundMeConnectedContract = await fundMe.connect(
                          accounts[i],
                      );
                      await FundMeConnectedContract.fund({ value: sendValue });
                  }

                  const startingFundMeBalance = await provider.getBalance(
                      fundMe.target,
                  );
                  const startingdeployerBalance =
                      await provider.getBalance(deployer);

                  const transactionResponse = await fundMe.cheaperwithdraw();
                  const transactionReceipt = await transactionResponse.wait(1);
                  const gasCost =
                      transactionReceipt.gasPrice * transactionReceipt.gasUsed;

                  const endingFundMeBalance = await provider.getBalance(
                      fundMe.target,
                  );
                  const endingdeployerBalance =
                      await provider.getBalance(deployer);

                  for (let i = 1; i < 6; i++) {
                      assert.equal(
                          await fundMe.getAddressToFunded(accounts[i]),
                          0,
                      );
                  }
              });

              it("only allows the owner to withdraw ", async () => {
                  const accounts = await ethers.getSigners();
                  const attacter = accounts[1];
                  const attacterConnectedContract =
                      await fundMe.connect(attacter);
                  await expect(
                      attacterConnectedContract.cheaperwithdraw(),
                  ).to.be.revertedWith("sender is not i_owner");
              });
          });
      });
