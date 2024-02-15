// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

contract SimpleTransfer {
    address public owner;
    

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor(address initialOwner) public {
        require(initialOwner != address(0), "Invalid initial owner address");
        owner = initialOwner;
    }

    function transferEth(address payable _recipient, uint256 amount) external payable {
        require(_recipient != address(0), "Invalid recipient address");
        require(amount > 0, "Invalid amount");
        uint weiAmount = amount * 1e18;
        // Transfer ETH from the contract to the specified address
        _recipient.transfer(weiAmount);
    }
}