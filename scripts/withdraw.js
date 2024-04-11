const { ethers, deployments } = require("hardhat");

async function main() {
    const signer = await ethers.provider.getSigner();
    fundMe_d = await deployments.get("FundMe");
    fundMe = await ethers.getContractAt("FundMe", fundMe_d.address, signer);

    console.log(`Got contract FundMe at ${fundMe.target}`);
    console.log("Funding contract...");
    const transactionResponse = await fundMe.withdraw();
    await transactionResponse.wait();
    console.log("Got it back!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
