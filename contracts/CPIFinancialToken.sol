// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CPIFinancialToken is ERC20, Ownable {
    address public usdcToken;

    constructor(
        string memory name,
        string memory symbol,
        address admin,
        address _usdcToken
    ) ERC20(name, symbol) Ownable(admin) {
        require(admin != address(0), "Admin address cannot be zero");
        require(_usdcToken != address(0), "USDC token address cannot be zero");

        usdcToken = _usdcToken;   // Guarda la dirección del contrato USDC
        _mint(admin, 1_000_000 * 10 ** decimals()); // Crea tokens iniciales
    }
}

contract CPIFinancialFactory {
    address[] public createdTokens;

    event TokenCreated(
        address indexed tokenAddress,
        string name,
        string symbol,
        address admin
    );

    function createToken(
        string memory name,
        string memory symbol,
        address admin,
        address usdcToken
    ) external returns (address) {
        CPIFinancialToken newToken = new CPIFinancialToken(
            name,
            symbol,
            admin,
            usdcToken
        );
        createdTokens.push(address(newToken));

        emit TokenCreated(address(newToken), name, symbol, admin);
        return address(newToken);
    }

    function getCreatedTokens() external view returns (address[] memory) {
        return createdTokens;
    }
}
