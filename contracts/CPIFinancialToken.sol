// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CPIFinancialToken is ERC20, ERC20Burnable, Ownable {
    address public usdcAddress; // Dirección del contrato USDC en Polygon
    uint256 public constant DECIMALS = 18;

    constructor(address _usdcAddress) ERC20("CPIFinancialToken", "CPI") {
        require(_usdcAddress != address(0), "USDC address cannot be zero");
        usdcAddress = _usdcAddress;
        _mint(msg.sender, 1_000_000 * (10 ** DECIMALS)); // 1 millón de tokens iniciales
    }

    function setUSDCAddress(address _usdcAddress) external onlyOwner {
        require(_usdcAddress != address(0), "USDC address cannot be zero");
        usdcAddress = _usdcAddress;
    }

    function payDividends(address recipient, uint256 amount) external onlyOwner {
        require(recipient != address(0), "Recipient cannot be zero address");
        require(
            IERC20(usdcAddress).balanceOf(address(this)) >= amount,
            "Not enough USDC balance"
        );

        bool success = IERC20(usdcAddress).transfer(recipient, amount);
        require(success, "USDC transfer failed");
    }
}
