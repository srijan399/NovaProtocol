// pragma solidity ^0.8.28;
// import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

// interface IPolicyManager {
//     function getPolicyDetails(
//         uint256 policyId
//     )
//         external
//         view
//         returns (
//             address owner,
//             uint256 coverageAmount,
//             uint256 premiumAmount,
//             uint8 riskLevel,
//             uint256 expiryDate,
//             bool isActive
//         );
// }

// enum RiskLevel {
//     LOW,
//     MEDIUM,
//     HIGH
// }

// enum PolicyType {
//     DEFI_PROTOCOL,
//     BRIDGE_SECURITY,
//     SMART_CONTRACT,
//     WALLET_HACK
// }

// enum ClaimStatus {
//     PENDING,
//     APPROVED,
//     REJECTED,
//     PAID
// }

// struct Policy {
//     uint256 id;
//     address owner;
//     PolicyType policyType;
//     uint256 coverageAmount;
//     uint256 premiumAmount;
//     RiskLevel riskLevel;
//     uint256 startDate;
//     uint256 expiryDate;
//     bool isActive;
//     string metadataUri;
// }

// interface IYieldPool {
//     function depositPremium(uint256 amount, uint8 riskLevel) external payable;

//     function processClaim(
//         uint256 amount,
//         uint8 riskLevel,
//         address recipient
//     ) external;

//     function getPoolBalance(uint8 riskLevel) external view returns (uint256);
// }

// // Interface for AI Agent Contract
// interface IAIAgentContract {
//     function paySubscription() external;

//     function canPaySubscription() external view returns (bool);

//     function isPaymentDue(uint256 paymentInterval) external view returns (bool);

//     function getBalance() external view returns (uint256);

//     function user() external view returns (address);

//     function subscriptionRate() external view returns (uint256);

//     function updateSubscriptionRate(uint256 _newRate) external;

//     function fund() external payable;
// }

// contract PremiumForwarder is AutomationCompatibleInterface {
//     IPolicyManager public policyManager;
//     IYieldPool public yieldPool;

//     mapping(uint256 => uint256) public lastPremiumPayment;
//     mapping(uint256 => bool) public autopayEnabled;

//     uint256 constant PAYMENT_INTERVAL = 1 minutes; // 1 minute for testing, adjust as needed

//     event PremiumPaid(
//         uint256 indexed policyId,
//         uint256 amount,
//         uint8 riskLevel
//     );
//     event AutoPayEnabled(uint256 indexed policyId);
//     event AutoPayDisabled(uint256 indexed policyId);
//     event AgentRegistered(address indexed agentContract, address indexed user);
//     event AgentRemoved(address indexed agentContract, address indexed user);
//     event SubscriptionCollected(
//         address indexed agentContract,
//         uint256 amount,
//         uint256 timestamp
//     );
//     event AgentFunded(
//         address indexed agentContract,
//         address indexed funder,
//         uint256 amount,
//         uint256 timestamp
//     );
//     event PaymentIntervalUpdated(uint256 oldInterval, uint256 newInterval);
//     event AutomationExecuted(uint256 agentsProcessed, uint256 totalCollected);
//     event FundsWithdrawn(address indexed owner, uint256 amount);

//     // State variables
//     address[] public agentContracts;
//     mapping(address => bool) public isRegisteredAgent;
//     mapping(address => uint256) public agentIndex;

//     uint256 public totalCollected;
//     uint256 public lastAutomationRun;

//     bool public automationEnabled = true;

//     constructor(address _policyManager, address _yieldPool) {
//         policyManager = IPolicyManager(_policyManager);
//         yieldPool = IYieldPool(_yieldPool);
//     }

//     /**
//      * @dev Register a new AI agent contract
//      * @param agentContract Address of the agent contract to register
//      */
//     function registerAgent(address agentContract) external {
//         require(agentContract != address(0), "Invalid agent contract address");
//         require(!isRegisteredAgent[agentContract], "Agent already registered");

//         // Verify it's a valid agent contract by checking if it has required functions
//         try IAIAgentContract(agentContract).user() returns (address agentUser) {
//             require(agentUser != address(0), "Invalid agent contract");
//         } catch {
//             revert("Invalid agent contract interface");
//         }

//         agentContracts.push(agentContract);
//         isRegisteredAgent[agentContract] = true;
//         agentIndex[agentContract] = agentContracts.length - 1;

//         address user = IAIAgentContract(agentContract).user();
//         emit AgentRegistered(agentContract, user);
//     }

//     /**
//      * @dev Remove an AI agent contract
//      * @param agentContract Address of the agent contract to remove
//      */
//     function removeAgent(address agentContract) external {
//         require(isRegisteredAgent[agentContract], "Agent not registered");

//         uint256 index = agentIndex[agentContract];
//         uint256 lastIndex = agentContracts.length - 1;

//         // Move last element to the index of element to remove
//         if (index != lastIndex) {
//             address lastAgent = agentContracts[lastIndex];
//             agentContracts[index] = lastAgent;
//             agentIndex[lastAgent] = index;
//         }

//         // Remove last element and update mappings
//         agentContracts.pop();
//         delete isRegisteredAgent[agentContract];
//         delete agentIndex[agentContract];

//         address user = IAIAgentContract(agentContract).user();
//         emit AgentRemoved(agentContract, user);
//     }

//     /**
//      * @dev Fund an AI agent contract
//      * @param agentContract Address of the agent contract to fund
//      */
//     function fundAgent(address agentContract) external payable {
//         require(isRegisteredAgent[agentContract], "Agent not registered");
//         require(msg.value > 0, "Funding amount must be greater than 0");

//         // Call the fund function on the agent contract, forwarding the AVAX
//         IAIAgentContract(agentContract).fund{value: msg.value}();

//         emit AgentFunded(agentContract, msg.sender, msg.value, block.timestamp);
//     }

//     function enableAutoPay(uint256 policyId) external {
//         (address owner, , , , , bool isActive) = policyManager.getPolicyDetails(
//             policyId
//         );
//         require(msg.sender == owner, "Not policy owner");
//         require(isActive, "Policy not active");

//         autopayEnabled[policyId] = true;
//         lastPremiumPayment[policyId] = block.timestamp;

//         emit AutoPayEnabled(policyId);
//     }

//     function disableAutoPay(uint256 policyId) external {
//         (address owner, , , , , ) = policyManager.getPolicyDetails(policyId);
//         require(msg.sender == owner, "Not policy owner");

//         autopayEnabled[policyId] = false;
//         emit AutoPayDisabled(policyId);
//     }

//     function checkUpkeep(
//         bytes calldata
//     )
//         external
//         view
//         override
//         returns (bool upkeepNeeded, bytes memory performData)
//     {
//         uint256[] memory duePayments = new uint256[](100);
//         uint256 count = 0;

//         for (uint256 i = 1; i <= 1000 && count < 100; i++) {
//             if (
//                 autopayEnabled[i] &&
//                 lastPremiumPayment[i] + PAYMENT_INTERVAL <= block.timestamp
//             ) {
//                 (, , , , uint256 expiryDate, bool isActive) = policyManager
//                     .getPolicyDetails(i);
//                 if (isActive && block.timestamp < expiryDate) {
//                     duePayments[count] = i;
//                     count++;
//                 }
//             }
//         }

//         if (count > 0) {
//             uint256[] memory actualDuePayments = new uint256[](count);
//             for (uint256 j = 0; j < count; j++) {
//                 actualDuePayments[j] = duePayments[j];
//             }
//             return (true, abi.encode(actualDuePayments));
//         }

//         return (false, "");
//     }

//     function performUpkeep(bytes calldata performData) external override {
//         uint256[] memory duePayments = abi.decode(performData, (uint256[]));

//         for (uint256 i = 0; i < duePayments.length; i++) {
//             _processPremiumPayment(duePayments[i]);
//         }
//     }

//     // TODO: Fix autopay logic
//     function _processPremiumPayment(uint256 policyId) private {
//         (
//             address owner,
//             ,
//             uint256 premiumAmount,
//             uint8 riskLevel,
//             ,
//             bool isActive
//         ) = policyManager.getPolicyDetails(policyId);

//         if (!isActive) return;

//         yieldPool.depositPremium{value: premiumAmount}(
//             premiumAmount,
//             riskLevel
//         );
//         lastPremiumPayment[policyId] = block.timestamp;
//         emit PremiumPaid(policyId, premiumAmount, riskLevel);
//     }

//     function manualPremiumPayment(uint256 policyId) external payable {
//         (
//             address owner,
//             ,
//             uint256 premiumAmount,
//             uint8 riskLevel,
//             ,
//             bool isActive
//         ) = policyManager.getPolicyDetails(policyId);

//         require(msg.sender == owner, "Not policy owner");
//         require(isActive, "Policy not active");
//         require(msg.value >= premiumAmount, "Insufficient premium");

//         yieldPool.depositPremium{value: premiumAmount}(
//             premiumAmount,
//             riskLevel
//         );
//         lastPremiumPayment[policyId] = block.timestamp;

//         // Refund excess
//         if (msg.value > premiumAmount) {
//             payable(msg.sender).transfer(msg.value - premiumAmount);
//         }

//         emit PremiumPaid(policyId, premiumAmount, riskLevel);
//     }

//     receive() external payable {}
// }

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

// Interface for AI Agent Contract
interface IAIAgentContract {
    function paySubscription() external;

    function canPaySubscription() external view returns (bool);

    function isPaymentDue(uint256 paymentInterval) external view returns (bool);

    function getBalance() external view returns (uint256);

    function user() external view returns (address);

    function subscriptionRate() external view returns (uint256);

    function updateSubscriptionRate(uint256 _newRate) external;

    function fund() external payable;
}

contract PremiumForwarder is AutomationCompatibleInterface {
    IPolicyManager public policyManager;
    IYieldPool public yieldPool;

    // Policy-related mappings
    mapping(uint256 => uint256) public lastPremiumPayment;
    mapping(uint256 => bool) public autopayEnabled;

    // Agent-related state variables
    address[] public agentContracts;
    mapping(address => bool) public isRegisteredAgent;
    mapping(address => uint256) public agentIndex;

    // Configuration
    uint256 constant POLICY_PAYMENT_INTERVAL = 1 minutes; // 1 minute for testing, adjust as needed
    uint256 public agentPaymentInterval = 1 minutes; // Default 30 days for agent subscriptions, 1 minute for testing
    uint256 public totalAgentCollected;
    uint256 public lastAgentAutomationRun;

    // Control flags
    bool public policyAutomationEnabled = true;
    bool public agentAutomationEnabled = true;

    // Events
    event PremiumPaid(
        uint256 indexed policyId,
        uint256 amount,
        uint8 riskLevel
    );
    event AutoPayEnabled(uint256 indexed policyId);
    event AutoPayDisabled(uint256 indexed policyId);

    // Agent-related events
    event AgentRegistered(address indexed agentContract, address indexed user);
    event AgentRemoved(address indexed agentContract, address indexed user);
    event AgentSubscriptionCollected(
        address indexed agentContract,
        uint256 amount,
        uint256 timestamp
    );
    event AgentFunded(
        address indexed agentContract,
        address indexed funder,
        uint256 amount,
        uint256 timestamp
    );
    event AgentPaymentIntervalUpdated(uint256 oldInterval, uint256 newInterval);
    event AgentAutomationExecuted(
        uint256 agentsProcessed,
        uint256 totalCollected
    );

    // General events
    event AutomationExecuted(
        uint256 policiesProcessed,
        uint256 agentsProcessed
    );
    event FundsWithdrawn(address indexed owner, uint256 amount);

    constructor(address _policyManager, address _yieldPool) {
        policyManager = IPolicyManager(_policyManager);
        yieldPool = IYieldPool(_yieldPool);
        lastAgentAutomationRun = block.timestamp;
    }

    // =============================================================================
    // AGENT MANAGEMENT FUNCTIONS
    // =============================================================================

    /**
     * @dev Register a new AI agent contract
     * @param agentContract Address of the agent contract to register
     */
    function registerAgent(address agentContract) external {
        require(agentContract != address(0), "Invalid agent contract address");
        require(!isRegisteredAgent[agentContract], "Agent already registered");

        // Verify it's a valid agent contract by checking if it has required functions
        try IAIAgentContract(agentContract).user() returns (address agentUser) {
            require(agentUser != address(0), "Invalid agent contract");
        } catch {
            revert("Invalid agent contract interface");
        }

        agentContracts.push(agentContract);
        isRegisteredAgent[agentContract] = true;
        agentIndex[agentContract] = agentContracts.length - 1;

        address user = IAIAgentContract(agentContract).user();
        emit AgentRegistered(agentContract, user);
    }

    /**
     * @dev Remove an AI agent contract
     * @param agentContract Address of the agent contract to remove
     */
    function removeAgent(address agentContract) external {
        require(isRegisteredAgent[agentContract], "Agent not registered");

        // Only allow agent owner or contract owner to remove
        address agentUser = IAIAgentContract(agentContract).user();
        require(msg.sender == agentUser, "Only agent owner can remove");

        uint256 index = agentIndex[agentContract];
        uint256 lastIndex = agentContracts.length - 1;

        // Move last element to the index of element to remove
        if (index != lastIndex) {
            address lastAgent = agentContracts[lastIndex];
            agentContracts[index] = lastAgent;
            agentIndex[lastAgent] = index;
        }

        // Remove last element and update mappings
        agentContracts.pop();
        delete isRegisteredAgent[agentContract];
        delete agentIndex[agentContract];

        emit AgentRemoved(agentContract, agentUser);
    }

    /**
     * @dev Fund an AI agent contract
     * @param agentContract Address of the agent contract to fund
     */
    function fundAgent(address agentContract) external payable {
        require(isRegisteredAgent[agentContract], "Agent not registered");
        require(msg.value > 0, "Funding amount must be greater than 0");

        // Call the fund function on the agent contract, forwarding the AVAX
        IAIAgentContract(agentContract).fund{value: msg.value}();

        emit AgentFunded(agentContract, msg.sender, msg.value, block.timestamp);
    }

    /**
     * @dev Collect subscription from all due agents (automated)
     */
    function performAgentUpkeep() public {
        require(agentAutomationEnabled, "Agent automation is disabled");

        uint256 agentsProcessed = 0;
        uint256 totalCollectedThisRun = 0;

        for (uint256 i = 0; i < agentContracts.length; i++) {
            address agentContract = agentContracts[i];

            try
                IAIAgentContract(agentContract).isPaymentDue(
                    agentPaymentInterval
                )
            returns (bool isDue) {
                if (isDue) {
                    try
                        IAIAgentContract(agentContract).canPaySubscription()
                    returns (bool canPay) {
                        if (canPay) {
                            uint256 subscriptionRate = IAIAgentContract(
                                agentContract
                            ).subscriptionRate();

                            try
                                IAIAgentContract(agentContract)
                                    .paySubscription()
                            {
                                totalAgentCollected += subscriptionRate;
                                totalCollectedThisRun += subscriptionRate;
                                agentsProcessed++;

                                emit AgentSubscriptionCollected(
                                    agentContract,
                                    subscriptionRate,
                                    block.timestamp
                                );
                            } catch {
                                // Payment failed, continue with next agent
                                continue;
                            }
                        }
                    } catch {
                        // Can't pay subscription, continue with next agent
                        continue;
                    }
                }
            } catch {
                // Error checking payment due, continue with next agent
                continue;
            }
        }

        lastAgentAutomationRun = block.timestamp;
        emit AgentAutomationExecuted(agentsProcessed, totalCollectedThisRun);
    }

    /**
     * @dev Manual function to collect subscription from a specific agent
     * @param agentContract Address of the agent contract
     */
    function collectFromAgent(address agentContract) external {
        require(isRegisteredAgent[agentContract], "Agent not registered");
        require(
            IAIAgentContract(agentContract).canPaySubscription(),
            "Agent cannot pay subscription"
        );

        uint256 subscriptionRate = IAIAgentContract(agentContract)
            .subscriptionRate();
        IAIAgentContract(agentContract).paySubscription();

        totalAgentCollected += subscriptionRate;
        emit AgentSubscriptionCollected(
            agentContract,
            subscriptionRate,
            block.timestamp
        );
    }

    /**
     * @dev Update subscription rate for a specific agent
     * @param agentContract Address of the agent contract
     * @param newRate New subscription rate
     */
    function updateAgentSubscriptionRate(
        address agentContract,
        uint256 newRate
    ) external {
        require(isRegisteredAgent[agentContract], "Agent not registered");
        require(newRate > 0, "Rate must be greater than 0");

        // Only allow agent owner to update their rate
        address agentUser = IAIAgentContract(agentContract).user();
        require(msg.sender == agentUser, "Only agent owner can update rate");

        IAIAgentContract(agentContract).updateSubscriptionRate(newRate);
    }

    /**
     * @dev Update agent payment interval
     * @param newInterval New payment interval in seconds
     */
    function updateAgentPaymentInterval(uint256 newInterval) external {
        require(newInterval > 0, "Payment interval must be greater than 0");
        // Add access control if needed

        uint256 oldInterval = agentPaymentInterval;
        agentPaymentInterval = newInterval;

        emit AgentPaymentIntervalUpdated(oldInterval, newInterval);
    }

    // =============================================================================
    // POLICY MANAGEMENT FUNCTIONS (EXISTING FUNCTIONALITY)
    // =============================================================================

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

    // =============================================================================
    // CHAINLINK AUTOMATION FUNCTIONS
    // =============================================================================

    function checkUpkeep(
        bytes calldata
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        bool policyUpkeepNeeded = false;
        bool agentUpkeepNeeded = false;

        // Check for policy payments
        if (policyAutomationEnabled) {
            for (uint256 i = 1; i <= 1000; i++) {
                if (
                    autopayEnabled[i] &&
                    lastPremiumPayment[i] + POLICY_PAYMENT_INTERVAL <=
                    block.timestamp
                ) {
                    (, , , , uint256 expiryDate, bool isActive) = policyManager
                        .getPolicyDetails(i);
                    if (isActive && block.timestamp < expiryDate) {
                        policyUpkeepNeeded = true;
                        break;
                    }
                }
            }
        }

        // Check for agent payments
        if (agentAutomationEnabled) {
            for (uint256 i = 0; i < agentContracts.length; i++) {
                address agentContract = agentContracts[i];

                try
                    IAIAgentContract(agentContract).isPaymentDue(
                        agentPaymentInterval
                    )
                returns (bool isDue) {
                    if (isDue) {
                        try
                            IAIAgentContract(agentContract).canPaySubscription()
                        returns (bool canPay) {
                            if (canPay) {
                                agentUpkeepNeeded = true;
                                break;
                            }
                        } catch {
                            continue;
                        }
                    }
                } catch {
                    continue;
                }
            }
        }

        upkeepNeeded = policyUpkeepNeeded || agentUpkeepNeeded;
        performData = abi.encode(policyUpkeepNeeded, agentUpkeepNeeded);
    }

    function performUpkeep(bytes calldata performData) external override {
        (bool policyUpkeepNeeded, bool agentUpkeepNeeded) = abi.decode(
            performData,
            (bool, bool)
        );

        uint256 policiesProcessed = 0;
        uint256 agentsProcessed = 0;

        // Process policy payments
        if (policyUpkeepNeeded && policyAutomationEnabled) {
            policiesProcessed = _processPolicyPayments();
        }

        // Process agent payments
        if (agentUpkeepNeeded && agentAutomationEnabled) {
            uint256 agentsProcessedBefore = totalAgentCollected;
            performAgentUpkeep();
            // This is a simplification - in reality you'd track the actual count
            agentsProcessed = agentContracts.length;
        }

        emit AutomationExecuted(policiesProcessed, agentsProcessed);
    }

    function _processPolicyPayments() private returns (uint256) {
        uint256 processed = 0;

        for (uint256 i = 1; i <= 1000 && processed < 100; i++) {
            if (
                autopayEnabled[i] &&
                lastPremiumPayment[i] + POLICY_PAYMENT_INTERVAL <=
                block.timestamp
            ) {
                (, , , , uint256 expiryDate, bool isActive) = policyManager
                    .getPolicyDetails(i);
                if (isActive && block.timestamp < expiryDate) {
                    _processPremiumPayment(i);
                    processed++;
                }
            }
        }

        return processed;
    }

    // TODO: Fix autopay logic - needs funding mechanism
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

        // NOTE: This still needs a funding mechanism for autopay
        // For now, this would require the contract to have sufficient balance
        if (address(this).balance >= premiumAmount) {
            yieldPool.depositPremium{value: premiumAmount}(
                premiumAmount,
                riskLevel
            );
            lastPremiumPayment[policyId] = block.timestamp;
            emit PremiumPaid(policyId, premiumAmount, riskLevel);
        }
    }

    // =============================================================================
    // VIEW FUNCTIONS
    // =============================================================================

    /**
     * @dev Get all registered agent contracts
     */
    function getAllAgents() external view returns (address[] memory) {
        return agentContracts;
    }

    /**
     * @dev Get agent contract info
     * @param agentContract Address of the agent contract
     */
    function getAgentInfo(
        address agentContract
    )
        external
        view
        returns (
            address user,
            uint256 balance,
            uint256 subscriptionRate,
            bool canPay,
            bool paymentDue
        )
    {
        require(isRegisteredAgent[agentContract], "Agent not registered");

        user = IAIAgentContract(agentContract).user();
        balance = IAIAgentContract(agentContract).getBalance();
        subscriptionRate = IAIAgentContract(agentContract).subscriptionRate();
        canPay = IAIAgentContract(agentContract).canPaySubscription();
        paymentDue = IAIAgentContract(agentContract).isPaymentDue(
            agentPaymentInterval
        );
    }

    /**
     * @dev Get contract statistics
     */
    function getStats()
        external
        view
        returns (
            uint256 totalAgents,
            uint256 contractBalance,
            uint256 _totalAgentCollected,
            uint256 _agentPaymentInterval,
            uint256 _lastAgentAutomationRun,
            bool _policyAutomationEnabled,
            bool _agentAutomationEnabled
        )
    {
        return (
            agentContracts.length,
            address(this).balance,
            totalAgentCollected,
            agentPaymentInterval,
            lastAgentAutomationRun,
            policyAutomationEnabled,
            agentAutomationEnabled
        );
    }

    // =============================================================================
    // ADMIN FUNCTIONS
    // =============================================================================

    /**
     * @dev Toggle policy automation on/off
     */
    function togglePolicyAutomation() external {
        policyAutomationEnabled = !policyAutomationEnabled;
    }

    /**
     * @dev Toggle agent automation on/off
     */
    function toggleAgentAutomation() external {
        agentAutomationEnabled = !agentAutomationEnabled;
    }

    receive() external payable {}
}
