// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CPIFinancialToken is ERC20, ERC20Burnable, Ownable {
    address public admin; // Dirección del administrador
    mapping(address => uint256) public pendingUSDC; // USDC pendientes para cada tenedor
    address public usdcAddress; // Dirección del contrato USDC en Polygon

    event UtilityRegistered(address indexed from, uint256 amount);
    event USDCDistributed(uint256 totalAmount);

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address _admin,
        address _usdcAddress
    ) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply * 10 ** decimals());
        admin = _admin;
        usdcAddress = _usdcAddress;
    }

    // Función para registrar utilidades (solo admin)
    function registerUtility(uint256 amount) external onlyOwner {
        uint256 totalTokens = totalSupply();
        require(totalTokens > 0, "No tokens in circulation");

        uint256 perTokenShare = amount / totalTokens;

        for (uint256 i = 0; i < holders.length; i++) {
            address holder = holders[i];
            uint256 balance = balanceOf(holder);
            pendingUSDC[holder] += balance * perTokenShare;
        }

        emit UtilityRegistered(msg.sender, amount);
    }

    // Función para que los tenedores reclamen sus USDC
    function claimUSDC() external {
        uint256 amount = pendingUSDC[msg.sender];
        require(amount > 0, "No USDC to claim");

        pendingUSDC[msg.sender] = 0;
        IERC20(usdcAddress).transfer(msg.sender, amount);
    }

    // Solo admin: distribuir USDC automáticamente a los tenedores
    function distributeUSDC(uint256 amount) external onlyOwner {
        uint256 totalTokens = totalSupply();
        require(totalTokens > 0, "No tokens in circulation");
        uint256 perTokenShare = amount / totalTokens;

        for (uint256 i = 0; i < holders.length; i++) {
            address holder = holders[i];
            uint256 balance = balanceOf(holder);
            pendingUSDC[holder] += balance * perTokenShare;
        }

        emit USDCDistributed(amount);
    }
}
