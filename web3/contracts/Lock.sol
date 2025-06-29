// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// Interface for AI Agent Contract
interface IAIAgentContract {
    function paySubscription() external;

    function canPaySubscription() external view returns (bool);

    function isPaymentDue(uint256 paymentInterval) external view returns (bool);

    function getBalance() external view returns (uint256);

    function user() external view returns (address);

    function subscriptionRate() external view returns (uint256);

    function updateSubscriptionRate(uint256 _newRate) external;
}

/**
 * @title MockMainContract
 * @dev Simple mock contract to test AI Agent contracts functionality
 * Simulates Chainlink automation and manages multiple agent contracts
 */
contract MockMainContract is Ownable, ReentrancyGuard {
    // Events
    event AgentRegistered(address indexed agentContract, address indexed user);
    event AgentRemoved(address indexed agentContract, address indexed user);
    event SubscriptionCollected(
        address indexed agentContract,
        uint256 amount,
        uint256 timestamp
    );
    event PaymentIntervalUpdated(uint256 oldInterval, uint256 newInterval);
    event AutomationExecuted(uint256 agentsProcessed, uint256 totalCollected);
    event FundsWithdrawn(address indexed owner, uint256 amount);

    // State variables
    address[] public agentContracts;
    mapping(address => bool) public isRegisteredAgent;
    mapping(address => uint256) public agentIndex;

    uint256 public paymentInterval = 30 days; // Default 30 days
    uint256 public totalCollected;
    uint256 public lastAutomationRun;

    // Mock automation control
    bool public automationEnabled = true;

    constructor() {
        lastAutomationRun = block.timestamp;
    }

    /**
     * @dev Register a new AI agent contract
     * @param agentContract Address of the agent contract to register
     */
    function registerAgent(address agentContract) external onlyOwner {
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
    function removeAgent(address agentContract) external onlyOwner {
        require(isRegisteredAgent[agentContract], "Agent not registered");

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

        address user = IAIAgentContract(agentContract).user();
        emit AgentRemoved(agentContract, user);
    }

    /**
     * @dev Mock Chainlink automation function - collect subscriptions from all agents
     * This simulates what Chainlink Keepers would do automatically
     */
    function performUpkeep() external {
        require(automationEnabled, "Automation is disabled");

        uint256 agentsProcessed = 0;
        uint256 totalCollectedThisRun = 0;

        for (uint256 i = 0; i < agentContracts.length; i++) {
            address agentContract = agentContracts[i];

            try
                IAIAgentContract(agentContract).isPaymentDue(paymentInterval)
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
                                totalCollected += subscriptionRate;
                                totalCollectedThisRun += subscriptionRate;
                                agentsProcessed++;

                                emit SubscriptionCollected(
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

        lastAutomationRun = block.timestamp;
        emit AutomationExecuted(agentsProcessed, totalCollectedThisRun);
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

        totalCollected += subscriptionRate;
        emit SubscriptionCollected(
            agentContract,
            subscriptionRate,
            block.timestamp
        );
    }

    /**
     * @dev Check if upkeep is needed (mock Chainlink checkUpkeep)
     */
    function checkUpkeep()
        external
        view
        returns (bool upkeepNeeded, bytes memory performData)
    {
        upkeepNeeded = false;

        if (!automationEnabled) {
            return (false, "");
        }

        // Check if any agents need payment
        for (uint256 i = 0; i < agentContracts.length; i++) {
            address agentContract = agentContracts[i];

            try
                IAIAgentContract(agentContract).isPaymentDue(paymentInterval)
            returns (bool isDue) {
                if (isDue) {
                    try
                        IAIAgentContract(agentContract).canPaySubscription()
                    returns (bool canPay) {
                        if (canPay) {
                            upkeepNeeded = true;
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

        performData = "";
    }

    /**
     * @dev Update payment interval
     * @param newInterval New payment interval in seconds
     */
    function updatePaymentInterval(uint256 newInterval) external onlyOwner {
        require(newInterval > 0, "Payment interval must be greater than 0");

        uint256 oldInterval = paymentInterval;
        paymentInterval = newInterval;

        emit PaymentIntervalUpdated(oldInterval, newInterval);
    }

    /**
     * @dev Update subscription rate for a specific agent
     * @param agentContract Address of the agent contract
     * @param newRate New subscription rate
     */
    function updateAgentSubscriptionRate(
        address agentContract,
        uint256 newRate
    ) external onlyOwner {
        require(isRegisteredAgent[agentContract], "Agent not registered");
        require(newRate > 0, "Rate must be greater than 0");

        IAIAgentContract(agentContract).updateSubscriptionRate(newRate);
    }

    /**
     * @dev Toggle automation on/off
     */
    function toggleAutomation() external onlyOwner {
        automationEnabled = !automationEnabled;
    }

    /**
     * @dev Withdraw collected funds
     * @param amount Amount to withdraw
     */
    function withdrawFunds(uint256 amount) external onlyOwner nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(address(this).balance >= amount, "Insufficient balance");

        (bool success, ) = payable(owner()).call{value: amount}("");
        require(success, "Withdrawal failed");

        emit FundsWithdrawn(owner(), amount);
    }

    /**
     * @dev Receive function to accept ETH from agent contracts
     */
    receive() external payable {
        // Accept payments from agent contracts
    }

    /**
     * @dev Fallback function
     */
    fallback() external payable {
        // Accept payments
    }
}
