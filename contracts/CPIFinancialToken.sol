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
        address _usdcToken,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        transferOwnership(admin);
        usdcToken = _usdcToken;
        _mint(admin, initialSupply * 10 ** decimals());
    }
}

contract CPIFinancialFactory {
    address[] public createdTokens;

    event TokenCreated(
        address indexed tokenAddress,
        string name,
        string symbol,
        address admin,
        uint256 initialSupply
    );

    function createToken(
        string memory name,
        string memory symbol,
        address admin,
        address usdcToken,
        uint256 initialSupply
    ) external returns (address) {
        CPIFinancialToken newToken = new CPIFinancialToken(
            name,
            symbol,
            admin,
            usdcToken,
            initialSupply
        );
        createdTokens.push(address(newToken));

        emit TokenCreated(address(newToken), name, symbol, admin, initialSupply);
        return address(newToken);
    }

    function getCreatedTokens() external view returns (address[] memory) {
        return createdTokens;
    }
}
