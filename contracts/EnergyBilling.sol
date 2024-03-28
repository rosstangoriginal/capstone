// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EnergyBilling {
    address public owner;
    struct Provider {
        uint256 peakRate;
        uint256 midPeakRate;
        uint256 offPeakRate;
        bool isActive;
    }
    struct UserConsumption {
        uint256 peakConsumption;
        uint256 midPeakConsumption;
        uint256 offPeakConsumption;
    }
    mapping(address => Provider) public providers;
    mapping(address => UserConsumption) public userConsumption;
    mapping(address => address) public userToProvider;

    event ProviderAdded(address indexed provider);
    event ProviderRemoved(address indexed provider);
    event ProviderSelected(address indexed user, address indexed provider);
    event ConsumptionReported(address indexed user, uint256 peak, uint256 midPeak, uint256 offPeak);
    event BillPaid(address indexed user, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function.");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addProvider(address provider, uint256 _peakRate, uint256 _midPeakRate, uint256 _offPeakRate) external onlyOwner {
        providers[provider] = Provider({
            peakRate: _peakRate,
            midPeakRate: _midPeakRate,
            offPeakRate: _offPeakRate,
            isActive: true
        });
        emit ProviderAdded(provider);
    }

    function selectProvider(address provider) external {
        require(providers[provider].isActive, "Provider is not active.");
        userToProvider[msg.sender] = provider;
        emit ProviderSelected(msg.sender, provider);
    }

    function reportConsumption(uint256 _peakConsumption, uint256 _midPeakConsumption, uint256 _offPeakConsumption) external {
        userConsumption[msg.sender] = UserConsumption({
            peakConsumption: _peakConsumption,
            midPeakConsumption: _midPeakConsumption,
            offPeakConsumption: _offPeakConsumption
        });
        emit ConsumptionReported(msg.sender, _peakConsumption, _midPeakConsumption, _offPeakConsumption);
    }

    function calculateBill(address user) public view returns (uint256) {
        address providerAddr = userToProvider[user];
        Provider memory providerRates = providers[providerAddr];
        UserConsumption memory consumption = userConsumption[user];

        uint256 peakRatePerWh = providerRates.peakRate / 1000;
        uint256 midPeakRatePerWh = providerRates.midPeakRate / 1000;
        uint256 offPeakRatePerWh = providerRates.offPeakRate / 1000;

        uint256 peakCharge = consumption.peakConsumption * peakRatePerWh; 
        uint256 midPeakCharge = consumption.midPeakConsumption * midPeakRatePerWh;
        uint256 offPeakCharge = consumption.offPeakConsumption * offPeakRatePerWh;

        uint256 totalCharge = peakCharge + midPeakCharge + offPeakCharge;

        return totalCharge;
    }

    function payBill() external payable {
        require(userToProvider[msg.sender] != address(0), "No provider selected.");
        uint256 billAmount = calculateBill(msg.sender);
        require(msg.value == billAmount, "Pay the exact bill amount.");

        address providerAddr = userToProvider[msg.sender];
        payable(providerAddr).transfer(msg.value);

        emit BillPaid(msg.sender, billAmount);
    }
}
