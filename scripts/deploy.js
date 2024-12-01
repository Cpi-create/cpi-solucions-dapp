// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CPIFinancialToken is ERC20, Ownable {
    address public adminAddress; // Dirección del administrador
    address public usdcAddress;  // Dirección del contrato USDC en Polygon

    // Constructor
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _initialSupply,
        address _adminAddress,
        address _usdcAddress
    ) ERC20(_name, _symbol) {
        require(_adminAddress != address(0), "Dirección del administrador inválida");
        require(_usdcAddress != address(0), "Dirección de USDC inválida");

        adminAddress = _adminAddress;
        usdcAddress = _usdcAddress;

        // Mintea los tokens iniciales al administrador
        _mint(_adminAddress, _initialSupply);
    }

    // Función para transferir USDC a los holders en función de sus balances de tokens
    function distributeUSDC() external onlyOwner {
        uint256 totalSupply = totalSupply();
        require(totalSupply > 0, "No hay tokens en circulación");

        IERC20 usdcToken = IERC20(usdcAddress);
        uint256 usdcBalance = usdcToken.balanceOf(address(this));
        require(usdcBalance > 0, "No hay USDC disponible para distribución");

        // Reparte el USDC proporcionalmente a los holders de tokens
        address[] memory holders = getAllTokenHolders();
        for (uint256 i = 0; i < holders.length; i++) {
            address holder = holders[i];
            uint256 holderBalance = balanceOf(holder);
            uint256 amountToSend = (holderBalance * usdcBalance) / totalSupply;

            if (amountToSend > 0) {
                usdcToken.transfer(holder, amountToSend);
            }
        }
    }

    // Función para obtener todas las direcciones que poseen tokens
    // Nota: Esto requiere tener una lista de holders actualizada fuera del contrato
    function getAllTokenHolders() private view returns (address[] memory) {
        // Aquí debes implementar un mecanismo para rastrear a los holders
        // como un registro fuera del contrato
        revert("No implementado");
    }

    // Función para actualizar la dirección de USDC si cambia en el futuro
    function updateUSDCAddress(address _newUSDCAddress) external onlyOwner {
        require(_newUSDCAddress != address(0), "Dirección de USDC inválida");
        usdcAddress = _newUSDCAddress;
    }
}
