// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "./PriceConverter.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

//import "hardhat/console.sol";

/**
 * @title A contract for corwd funding
 * @author liuhuxian
 * @notice This contract is to demo a sample funding contract
 * @dev This implements price feed as our library
 */
contract FundMe {
    //Type declarations
    using PriceConverter for uint256;

    //State Variables
    address[] private funders;
    mapping(address => uint256) private addressToFunded;
    uint256 public constant MINIMUM_USD = 50 * 1e18;
    address private immutable i_owner;
    AggregatorV3Interface private priceFeed;

    modifier onlyowner() {
        require(msg.sender == i_owner, "sender is not i_owner");
        _;
    }

    constructor(address priceFeedAddress) {
        //console.log("[fundMe]owner:", msg.sender);
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    /**
     * @notice This function funds this contract
     * @dev This implements price feeds as out library
     */
    function fund() public payable {
        //require(msg.value.getConversionRate() > minimumUsd,"Didn't send enough");
        require(
            PriceConverter.getConversionRate(msg.value, priceFeed) >=
                MINIMUM_USD,
            "You need to spend more ETH!"
        );
        //console.log("[fundMe]value:", msg.value, "sender:", msg.sender);
        funders.push(msg.sender);
        addressToFunded[msg.sender] += msg.value;
    }

    function withdraw() public onlyowner {
        for (uint256 i; i < funders.length; i++) {
            address funder = funders[i];
            addressToFunded[funder] = 0;
        }

        funders = new address[](0);
        (bool callsuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callsuccess, "call failed");
    }

    function cheaperwithdraw() public onlyowner {
        address[] memory m_funders = funders;
        for (uint256 i; i < m_funders.length; i++) {
            address funder = m_funders[i];
            addressToFunded[funder] = 0;
        }

        funders = new address[](0);
        (bool callsuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callsuccess, "call failed");
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getFunder(uint256 index) public view returns (address) {
        return funders[index];
    }

    function getAddressToFunded(address funder) public view returns (uint256) {
        return addressToFunded[funder];
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return priceFeed;
    }
}
