// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getPrice(
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        //ABI
        //address 0x694AA1769357215DE4FAC081bf1f309aDC325306
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return uint256(price * 1e10);
    }

    function getConversionRate(
        uint256 ethAmount,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        uint256 ethprice = getPrice(priceFeed);
        uint256 ethAmountInUsd = (ethprice * ethAmount) / 1e18;
        return ethAmountInUsd;
    }
}
