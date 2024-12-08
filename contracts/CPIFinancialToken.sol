// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

contract CPIFinancialToken is ERC20, Ownable, AutomationCompatibleInterface {
    address public usdcToken; // Dirección del contrato USDC
    uint256 public lastIncomeDistribution;
    uint256 public dailyIncome;

    mapping(address => uint256) public rewards; // Recompensas acumuladas para cada dirección
    mapping(address => bool) private holdersMap; // Mapa para rastrear titulares de tokens
    address[] private holdersList; // Lista dinámica de titulares de tokens

    // Eventos
    event IncomeDeposited(address indexed from, uint256 amount);
    event RewardsDistributed(uint256 totalAmount, uint256 timestamp);
    event TokensPurchased(address indexed buyer, uint256 amount);

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
    }

    function setUsdcToken(address _usdcToken) external onlyOwner {
        usdcToken = _usdcToken;
    }

    function depositIncome(uint256 amount) external {
        IERC20(usdcToken).transferFrom(msg.sender, address(this), amount);
        dailyIncome = amount / 30; // Divide el monto depositado para 30 días
        lastIncomeDistribution = block.timestamp;

        emit IncomeDeposited(msg.sender, amount);
    }

    function performUpkeep(bytes calldata) external override {
        require(block.timestamp > lastIncomeDistribution + 1 days, "Ya distribuido hoy");

        uint256 balance = IERC20(usdcToken).balanceOf(address(this));
        require(balance >= dailyIncome, "No hay suficiente USDC");

        for (uint256 i = 0; i < holdersList.length; i++) {
            address holder = holdersList[i];
            uint256 reward = (balanceOf(holder) * dailyIncome) / totalSupply();
            if (reward > 0) {
                IERC20(usdcToken).transfer(holder, reward);
                rewards[holder] += reward;
            }
        }

        lastIncomeDistribution = block.timestamp;
        emit RewardsDistributed(dailyIncome, block.timestamp);
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

    // Función para comprar tokens
    function buyTokens(uint256 amount) external {
        uint256 usdcAmount = amount * 1e6; // Suponemos relación 1:1 entre USDC y tokens
        IERC20(usdcToken).transferFrom(msg.sender, address(this), usdcAmount);
        _mint(msg.sender, amount);
        _updateHolders(msg.sender);

        emit TokensPurchased(msg.sender, amount);
    }

    // Función para actualizar titulares al transferir tokens
    function transfer(address recipient, uint256 amount) public override returns (bool) {
        bool success = super.transfer(recipient, amount);
        if (success) {
            _updateHolders(msg.sender);
            _updateHolders(recipient);
        }
        return success;
    }

    // Función para actualizar titulares al realizar transferencias internas
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public override returns (bool) {
        bool success = super.transferFrom(sender, recipient, amount);
        if (success) {
            _updateHolders(sender);
            _updateHolders(recipient);
        }
        return success;
    }

    // Actualiza la lista de titulares
    function _updateHolders(address holder) private {
        if (balanceOf(holder) > 0 && !holdersMap[holder]) {
            holdersMap[holder] = true;
            holdersList.push(holder);
        } else if (balanceOf(holder) == 0 && holdersMap[holder]) {
            holdersMap[holder] = false;
            for (uint256 i = 0; i < holdersList.length; i++) {
                if (holdersList[i] == holder) {
                    holdersList[i] = holdersList[holdersList.length - 1];
                    holdersList.pop();
                    break;
                }
            }
        }
    }

    // Retorna la lista de titulares actuales
    function getTokenHolders() external view returns (address[] memory) {
        return holdersList;
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

        emit TokenCreated(address(newToken), name, symbol, admin);
        return address(newToken);
    }

    function getCreatedTokens() external view returns (address[] memory) {
        return createdTokens;
    }
}
