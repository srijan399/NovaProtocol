// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

interface IPolicyManager {
    function getPolicyDetails(
        uint256 policyId
    )
        external
        view
        returns (
            address owner,
            uint256 coverageAmount,
            uint256 premiumAmount,
            uint8 riskLevel,
            uint256 expiryDate,
            bool isActive
        );
}

enum RiskLevel {
    LOW,
    MEDIUM,
    HIGH
}

enum PolicyType {
    DEFI_PROTOCOL,
    BRIDGE_SECURITY,
    SMART_CONTRACT,
    WALLET_HACK
}

enum ClaimStatus {
    PENDING,
    APPROVED,
    REJECTED,
    PAID
}

struct Policy {
    uint256 id;
    address owner;
    PolicyType policyType;
    uint256 coverageAmount;
    uint256 premiumAmount;
    RiskLevel riskLevel;
    uint256 startDate;
    uint256 expiryDate;
    bool isActive;
    string metadataUri;
}

interface IYieldPool {
    function depositPremium(uint256 amount, uint8 riskLevel) external payable;

    function processClaim(
        uint256 amount,
        uint8 riskLevel,
        address recipient
    ) external;

    function getPoolBalance(uint8 riskLevel) external view returns (uint256);
}

contract PremiumForwarder is AutomationCompatibleInterface {
    IPolicyManager public policyManager;
    IYieldPool public yieldPool;

    mapping(uint256 => uint256) public lastPremiumPayment;
    mapping(uint256 => bool) public autopayEnabled;

    uint256 constant PAYMENT_INTERVAL = 1 minutes; // 1 minute for testing, adjust as needed

    event PremiumPaid(
        uint256 indexed policyId,
        uint256 amount,
        uint8 riskLevel
    );
    event AutoPayEnabled(uint256 indexed policyId);
    event AutoPayDisabled(uint256 indexed policyId);

    constructor(address _policyManager, address _yieldPool) {
        policyManager = IPolicyManager(_policyManager);
        yieldPool = IYieldPool(_yieldPool);
    }

    function enableAutoPay(uint256 policyId) external {
        (address owner, , , , , bool isActive) = policyManager.getPolicyDetails(
            policyId
        );
        require(msg.sender == owner, "Not policy owner");
        require(isActive, "Policy not active");

        autopayEnabled[policyId] = true;
        lastPremiumPayment[policyId] = block.timestamp;

        emit AutoPayEnabled(policyId);
    }

    function disableAutoPay(uint256 policyId) external {
        (address owner, , , , , ) = policyManager.getPolicyDetails(policyId);
        require(msg.sender == owner, "Not policy owner");

        autopayEnabled[policyId] = false;
        emit AutoPayDisabled(policyId);
    }

    function checkUpkeep(
        bytes calldata
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        uint256[] memory duePayments = new uint256[](100);
        uint256 count = 0;

        for (uint256 i = 1; i <= 1000 && count < 100; i++) {
            if (
                autopayEnabled[i] &&
                lastPremiumPayment[i] + PAYMENT_INTERVAL <= block.timestamp
            ) {
                (, , , , uint256 expiryDate, bool isActive) = policyManager
                    .getPolicyDetails(i);
                if (isActive && block.timestamp < expiryDate) {
                    duePayments[count] = i;
                    count++;
                }
            }
        }

        if (count > 0) {
            uint256[] memory actualDuePayments = new uint256[](count);
            for (uint256 j = 0; j < count; j++) {
                actualDuePayments[j] = duePayments[j];
            }
            return (true, abi.encode(actualDuePayments));
        }

        return (false, "");
    }

    function performUpkeep(bytes calldata performData) external override {
        uint256[] memory duePayments = abi.decode(performData, (uint256[]));

        for (uint256 i = 0; i < duePayments.length; i++) {
            _processPremiumPayment(duePayments[i]);
        }
    }

    function manualPremiumPayment(uint256 policyId) external payable {
        (
            address owner,
            ,
            uint256 premiumAmount,
            uint8 riskLevel,
            ,
            bool isActive
        ) = policyManager.getPolicyDetails(policyId);

        require(msg.sender == owner, "Not policy owner");
        require(isActive, "Policy not active");
        require(msg.value >= premiumAmount, "Insufficient premium");

        yieldPool.depositPremium{value: premiumAmount}(
            premiumAmount,
            riskLevel
        );
        lastPremiumPayment[policyId] = block.timestamp;

        // Refund excess
        if (msg.value > premiumAmount) {
            payable(msg.sender).transfer(msg.value - premiumAmount);
        }

        emit PremiumPaid(policyId, premiumAmount, riskLevel);
    }

    // TODO: Fix autopay logic
    function _processPremiumPayment(uint256 policyId) private {
        (
            address owner,
            ,
            uint256 premiumAmount,
            uint8 riskLevel,
            ,
            bool isActive
        ) = policyManager.getPolicyDetails(policyId);

        if (!isActive) return;

        yieldPool.depositPremium{value: premiumAmount}(
            premiumAmount,
            riskLevel
        );
        lastPremiumPayment[policyId] = block.timestamp;
        emit PremiumPaid(policyId, premiumAmount, riskLevel);
    }

    receive() external payable {}
}
