// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

contract YieldPool is AutomationCompatibleInterface {
    struct Pool {
        uint256 totalDeposits;
        uint256 totalPremiums;
        uint256 totalClaims;
        uint256 lastInterestDistribution;
    }

    struct LiquidityProvider {
        uint256 depositAmount;
        uint256 lastRewardClaim;
        uint256 shares;
    }

    mapping(uint8 => Pool) public pools;
    mapping(uint8 => mapping(address => LiquidityProvider))
        public liquidityProviders;
    mapping(uint8 => uint256) public totalShares;

    address public premiumForwarder;
    address public claimManager;

    uint256 constant INTEREST_RATE = 500;
    uint256 constant SECONDS_IN_YEAR = 365 days;
    uint256 constant INTEREST_DISTRIBUTION_INTERVAL = 7 days;

    event PremiumDeposited(uint256 amount, uint8 riskLevel);
    event LiquidityDeposited(
        address indexed provider,
        uint256 amount,
        uint8 riskLevel
    );
    event LiquidityWithdrawn(
        address indexed provider,
        uint256 amount,
        uint8 riskLevel
    );
    event ClaimPayout(uint256 amount, uint8 riskLevel, address recipient);
    event InterestDistributed(uint8 riskLevel, uint256 totalInterest);

    modifier onlyAuthorized() {
        require(
            msg.sender == premiumForwarder || msg.sender == claimManager,
            "Unauthorized"
        );
        _;
    }

    constructor() {
        // Initialize pools
        for (uint8 i = 0; i < 3; i++) {
            pools[i].lastInterestDistribution = block.timestamp;
        }
    }

    function setPremiumForwarder(address _premiumForwarder) external {
        premiumForwarder = _premiumForwarder;
    }

    function setClaimManager(address _claimManager) external {
        claimManager = _claimManager;
    }

    function depositPremium(
        uint256 amount,
        uint8 riskLevel
    ) external payable onlyAuthorized {
        require(riskLevel < 3, "Invalid risk level");
        require(amount > 0, "Amount must be greater than 0");
        require(msg.value >= amount, "Insufficient ETH sent");

        pools[riskLevel].totalPremiums += amount;
        pools[riskLevel].totalDeposits += amount;

        // Refund excess ETH if any
        if (msg.value > amount) {
            uint256 excess = msg.value - amount;
            payable(msg.sender).transfer(excess);
        }

        emit PremiumDeposited(amount, riskLevel);
    }

    function depositLiquidity(uint8 riskLevel) external payable {
        require(riskLevel < 3, "Invalid risk level");
        require(msg.value > 0, "Must deposit some ETH");

        uint256 shares;
        if (totalShares[riskLevel] == 0) {
            shares = msg.value;
        } else {
            shares =
                (msg.value * totalShares[riskLevel]) /
                pools[riskLevel].totalDeposits;
        }

        liquidityProviders[riskLevel][msg.sender].depositAmount += msg.value;
        liquidityProviders[riskLevel][msg.sender].shares += shares;
        liquidityProviders[riskLevel][msg.sender].lastRewardClaim = block
            .timestamp;

        totalShares[riskLevel] += shares;
        pools[riskLevel].totalDeposits += msg.value;

        emit LiquidityDeposited(msg.sender, msg.value, riskLevel);
    }

    function withdrawLiquidity(uint8 riskLevel, uint256 shares) external {
        require(riskLevel < 3, "Invalid risk level");
        require(
            liquidityProviders[riskLevel][msg.sender].shares >= shares,
            "Insufficient shares"
        );

        uint256 withdrawAmount = (shares * pools[riskLevel].totalDeposits) /
            totalShares[riskLevel];

        liquidityProviders[riskLevel][msg.sender].shares -= shares;
        liquidityProviders[riskLevel][msg.sender]
            .depositAmount -= withdrawAmount;
        totalShares[riskLevel] -= shares;
        pools[riskLevel].totalDeposits -= withdrawAmount;

        payable(msg.sender).transfer(withdrawAmount);

        emit LiquidityWithdrawn(msg.sender, withdrawAmount, riskLevel);
    }

    function processClaim(
        uint256 amount,
        uint8 riskLevel,
        address recipient
    ) external onlyAuthorized {
        require(riskLevel < 3, "Invalid risk level");
        require(
            pools[riskLevel].totalDeposits >= amount,
            "Insufficient pool balance"
        );

        pools[riskLevel].totalClaims += amount;
        pools[riskLevel].totalDeposits -= amount;

        payable(recipient).transfer(amount);

        emit ClaimPayout(amount, riskLevel, recipient);
    }

    function checkUpkeep(
        bytes calldata
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        uint8[] memory poolsToUpdate = new uint8[](3);
        uint8 count = 0;

        for (uint8 i = 0; i < 3; i++) {
            if (
                pools[i].lastInterestDistribution +
                    INTEREST_DISTRIBUTION_INTERVAL <=
                block.timestamp
            ) {
                poolsToUpdate[count] = i;
                count++;
            }
        }

        if (count > 0) {
            uint8[] memory actualPools = new uint8[](count);
            for (uint8 j = 0; j < count; j++) {
                actualPools[j] = poolsToUpdate[j];
            }
            return (true, abi.encode(actualPools));
        }

        return (false, "");
    }

    function performUpkeep(bytes calldata performData) external override {
        uint8[] memory poolsToUpdate = abi.decode(performData, (uint8[]));

        for (uint256 i = 0; i < poolsToUpdate.length; i++) {
            _distributeInterest(poolsToUpdate[i]);
        }
    }

    function _distributeInterest(uint8 riskLevel) private {
        Pool storage pool = pools[riskLevel];

        if (pool.totalDeposits == 0) return;

        uint256 timeElapsed = block.timestamp - pool.lastInterestDistribution;
        uint256 interestAmount = (pool.totalDeposits *
            INTEREST_RATE *
            timeElapsed) / (10000 * SECONDS_IN_YEAR);

        // Add interest to pool (in a real implementation, this would come from yield strategies)
        pool.totalDeposits += interestAmount;
        pool.lastInterestDistribution = block.timestamp;

        emit InterestDistributed(riskLevel, interestAmount);
    }

    function getPoolBalance(uint8 riskLevel) external view returns (uint256) {
        return pools[riskLevel].totalDeposits;
    }

    function getUserLiquidity(
        address user,
        uint8 riskLevel
    )
        external
        view
        returns (uint256 depositAmount, uint256 shares, uint256 currentValue)
    {
        LiquidityProvider memory lp = liquidityProviders[riskLevel][user];
        uint256 currentValue_ = totalShares[riskLevel] > 0
            ? (lp.shares * pools[riskLevel].totalDeposits) /
                totalShares[riskLevel]
            : 0;

        return (lp.depositAmount, lp.shares, currentValue_);
    }

    receive() external payable {}
}
