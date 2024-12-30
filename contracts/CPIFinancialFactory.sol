// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

contract CPIFinancialToken is ERC20, Ownable, AutomationCompatibleInterface {
    address public usdcToken;
    uint256 public lastIncomeDistribution;
    uint256 public dailyIncome;

    mapping(address => uint256) public rewards;
    address[] private holders;

    constructor(
        string memory name,
        string memory symbol,
        address admin,
        address _usdcToken,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        transferOwnership(admin); // Transfiere la propiedad al administrador inicial
        usdcToken = _usdcToken;
        _mint(admin, initialSupply * 10 ** decimals());
        holders.push(admin); // Agregar el administrador como titular inicial
    }

    function setUsdcToken(address _usdcToken) external onlyOwner {
        usdcToken = _usdcToken;
    }

    function depositIncome(uint256 amount) external {
        IERC20(usdcToken).transferFrom(msg.sender, address(this), amount);
        dailyIncome = amount / 30;
        lastIncomeDistribution = block.timestamp;
    }

    function performUpkeep(bytes calldata) external override {
        require(block.timestamp > lastIncomeDistribution + 1 days, "Ya distribuido hoy");

        uint256 balance = IERC20(usdcToken).balanceOf(address(this));
        require(balance >= dailyIncome, "No hay suficiente USDC");

        for (uint256 i = 0; i < holders.length; i++) {
            uint256 reward = (balanceOf(holders[i]) * dailyIncome) / totalSupply();
            IERC20(usdcToken).transfer(holders[i], reward);
            rewards[holders[i]] += reward;
        }

        lastIncomeDistribution = block.timestamp;
    }

    function checkUpkeep(bytes calldata)
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        upkeepNeeded = block.timestamp > lastIncomeDistribution + 1 days &&
            IERC20(usdcToken).balanceOf(address(this)) >= dailyIncome;
        performData = "";
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        super.transfer(recipient, amount);
        _updateHolders(recipient);
        return true;
    }

    function _updateHolders(address account) internal {
        if (balanceOf(account) > 0 && !_isHolder(account)) {
            holders.push(account);
        } else if (balanceOf(account) == 0) {
            _removeHolder(account);
        }
    }

    function _isHolder(address account) internal view returns (bool) {
        for (uint256 i = 0; i < holders.length; i++) {
            if (holders[i] == account) {
                return true;
            }
        }
        return false;
    }

    function _removeHolder(address account) internal {
        for (uint256 i = 0; i < holders.length; i++) {
            if (holders[i] == account) {
                holders[i] = holders[holders.length - 1];
                holders.pop();
                break;
            }
        }
    }
}

contract CPIFinancialFactory {
    address[] public createdTokens;
    mapping(address => bool) public admins; // Mapeo para verificar administradores

    event TokenCreated(
        address indexed tokenAddress,
        string name,
        string symbol,
        address admin
    );

    constructor() {
        admins[msg.sender] = true; // El creador del contrato es el primer administrador
    }

    function createToken(
        string memory name,
        string memory symbol,
        address admin,
        address usdcToken,
        uint256 initialSupply
    ) external returns (address) {
        require(admins[msg.sender], "Solo un administrador puede crear tokens");

        CPIFinancialToken newToken = new CPIFinancialToken(
            name,
            symbol,
            admin,
            usdcToken,
            initialSupply
        );
        createdTokens.push(address(newToken));

        emit TokenCreated(address(newToken), name, symbol, admin);
        return address(newToken);
    }

    function getCreatedTokens() external view returns (address[] memory) {
        return createdTokens;
    }

    // Nueva función para verificar si un usuario es administrador
    function isAdmin(address user) external view returns (bool) {
        return admins[user];
    }

    // Agregar nuevos administradores
    function addAdmin(address newAdmin) external {
        require(admins[msg.sender], "Solo un administrador puede agregar otros administradores");
        admins[newAdmin] = true;
    }

    // Eliminar administradores
    function removeAdmin(address adminToRemove) external {
        require(admins[msg.sender], "Solo un administrador puede eliminar administradores");
        require(adminToRemove != msg.sender, "No puedes eliminarte a ti mismo");
        admins[adminToRemove] = false;
    }
}
