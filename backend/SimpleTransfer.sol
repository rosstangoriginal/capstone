// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

contract SimpleTransfer {
    //Hard coded address, will need to change once we can inject from metamask
    address public owner = 0x20FF550afD3bf73590FA8E5f26151b294A849192;

        
    
        

        modifier onlyOwner() {
            require(msg.sender == owner, "Not the owner");
            _;
        }

        function transferEth(address payable to, uint256 amount) external onlyOwner {
            require(to != address(0), "Invalid recipient address");
            require(amount > 0, "Invalid amount");

            // Transfer ETH from the contract to the specified address
            payable(to).transfer(amount);
        }
}