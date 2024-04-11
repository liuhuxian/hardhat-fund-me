// const { networks } = require("../hardhat.config");
const { network, ethers } = require("hardhat");
const { verify } = require("../utils/verify");
const {
    networkConfig,
    developmentChains,
} = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
    log(`chainid :${chainId}`);

    let ethUsdPriceFeedAddress;
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator");
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
    }

    const args = [ethUsdPriceFeedAddress];
    // when going for localhost or hardhat network we want to use a mock
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });
    //console.log(`ethUsdPriceFeedAddress ${ethUsdPriceFeedAddress}`);
    log("fundme deployed!!");

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERVERIFY_API_KEY
    ) {
        //VERIFY
        log("Start verifing");
        await verify(fundMe.address, args);
    }

    log("---------------------------------------------------------");
};

module.exports.tags = ["all", "fundme"];
