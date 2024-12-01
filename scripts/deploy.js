// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CPIFinancialToken is ERC20 {
    address public admin;
    address public usdcToken;

    constructor(address adminAddress, address usdcAddress) ERC20("CPIFinancialToken", "CPI") {
        admin = adminAddress;
        usdcToken = usdcAddress;
        _mint(adminAddress, 1000000 * (10 ** decimals()));
    }

    // Función para actualizar el contrato USDC
    function updateUsdcAddress(address newAddress) external {
        require(msg.sender == admin, "Solo el administrador puede actualizar el contrato USDC.");
        usdcToken = newAddress;
    }
}
