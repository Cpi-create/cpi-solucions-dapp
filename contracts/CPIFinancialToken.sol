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

    event TokenTransferred(address indexed from, address indexed to, uint256 amount);
    event IncomeDeposited(address indexed from, uint256 amount);

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

    function setUsdcToken(address _usdcToken) external onlyOwner {
        usdcToken = _usdcToken;
    }

    function depositIncome(uint256 amount) external {
        IERC20(usdcToken).transferFrom(msg.sender, address(this), amount);
        dailyIncome = amount / 30;
        lastIncomeDistribution = block.timestamp;
        emit IncomeDeposited(msg.sender, amount);
    }

    function performUpkeep(bytes calldata) external override {
        require(block.timestamp > lastIncomeDistribution + 1 days, "Ya distribuido hoy");

        uint256 balance = IERC20(usdcToken).balanceOf(address(this));
        require(balance >= dailyIncome, "No hay suficiente USDC");

        uint256 totalSupplyTokens = totalSupply();
        require(totalSupplyTokens > 0, "No hay tokens en circulación");

        // Distribuir ingresos proporcionalmente
        for (uint256 i = 0; i < balanceOf(owner()); i++) {
            uint256 reward = (balanceOf(owner()) * dailyIncome) / totalSupply();
            IERC20(usdcToken).transfer(owner(), reward);
            rewards[owner()] += reward;
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

    // Se elimina la lógica de rastreo dinámico
    function getTokenHolders() external pure {
        revert("Funcionalidad movida fuera de la cadena (off-chain)");
    }
}
