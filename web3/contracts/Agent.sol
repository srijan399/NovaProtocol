// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title AIAgentContract
 * @dev Individual contract for each AI agent with funding, withdrawal, and subscription capabilities
 */
contract AIAgentContract is ReentrancyGuard, Ownable, Pausable {
    // Events
    event Funded(address indexed funder, uint256 amount, uint256 timestamp);
    event Withdrawn(address indexed user, uint256 amount, uint256 timestamp);
    event SubscriptionPaid(uint256 amount, uint256 timestamp);
    event EmergencyWithdrawal(
        address indexed user,
        uint256 amount,
        uint256 timestamp
    );
    event MainContractUpdated(
        address indexed oldContract,
        address indexed newContract
    );
    event SubscriptionRateUpdated(uint256 oldRate, uint256 newRate);

    // State variables
    address public user;
    address public mainContract;
    address public yieldContract; // Address of the yield contract for potential future use
    uint256 public subscriptionRate; // Amount per payment period
    uint256 public lastPaymentTime;
    uint256 public totalFunded;
    uint256 public totalWithdrawn;
    uint256 public totalSubscriptionPaid;

    // Minimum balance to keep for next subscription payment
    uint256 public constant MIN_BALANCE_BUFFER = 0.001 ether;

    modifier onlyUser() {
        require(msg.sender == user, "Only user can call this function");
        _;
    }

    modifier onlyMainContract() {
        require(
            msg.sender == mainContract,
            "Only main contract can call this function"
        );
        _;
    }

    modifier onlyUserOrMainContract() {
        require(
            msg.sender == user || msg.sender == mainContract,
            "Unauthorized"
        );
        _;
    }

    /**
     * @dev Constructor to initialize the agent contract
     * @param _user Address of the user who owns this agent
     * @param _mainContract Address of the main contract for automation
     * @param _subscriptionRate Subscription amount per payment period
     */
    constructor(
        address _user,
        address _mainContract,
        address _yieldContract,
        uint256 _subscriptionRate
    ) {
        require(_user != address(0), "Invalid user address");
        require(_mainContract != address(0), "Invalid main contract address");
        require(
            _subscriptionRate > 0,
            "Subscription rate must be greater than 0"
        );

        user = _user;
        mainContract = _mainContract;
        yieldContract = _yieldContract;
        subscriptionRate = _subscriptionRate;
        lastPaymentTime = block.timestamp;
    }

    /**
     * @dev Fund the agent contract
     */
    function fund() external payable onlyUser {
        require(msg.value > 0, "Funding amount must be greater than 0");

        totalFunded += msg.value;
        emit Funded(msg.sender, msg.value, block.timestamp);
    }

    /**
     * @dev User withdraws funds from the contract
     * @param amount Amount to withdraw
     */
    function withdraw(
        uint256 amount
    ) external onlyUser nonReentrant whenNotPaused {
        require(amount > 0, "Withdrawal amount must be greater than 0");
        require(address(this).balance >= amount, "Insufficient balance");

        // Ensure enough balance remains for next subscription payment
        uint256 remainingBalance = address(this).balance - amount;
        require(
            remainingBalance >= subscriptionRate + MIN_BALANCE_BUFFER,
            "Cannot withdraw: insufficient balance for next subscription payment"
        );

        totalWithdrawn += amount;

        (bool success, ) = payable(user).call{value: amount}("");
        require(success, "Withdrawal failed");

        emit Withdrawn(user, amount, block.timestamp);
    }

    /**
     * @dev Emergency withdrawal - user can withdraw all funds (called by user or in emergency)
     */
    function emergencyWithdraw() external onlyUser nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");

        totalWithdrawn += balance;

        (bool success, ) = payable(user).call{value: balance}("");
        require(success, "Emergency withdrawal failed");

        emit EmergencyWithdrawal(user, balance, block.timestamp);
    }

    /**
     * @dev Pay subscription (called by main contract via Chainlink automation)
     */
    function paySubscription()
        external
        onlyMainContract
        nonReentrant
        whenNotPaused
    {
        require(
            address(this).balance >= subscriptionRate,
            "Insufficient balance for subscription"
        );

        totalSubscriptionPaid += subscriptionRate;
        lastPaymentTime = block.timestamp;

        (bool success, ) = payable(yieldContract).call{value: subscriptionRate}(
            ""
        );
        require(success, "Subscription payment failed");

        emit SubscriptionPaid(subscriptionRate, block.timestamp);
    }

    /**
     * @dev Check if contract has sufficient balance for subscription payment
     */
    function canPaySubscription() external view returns (bool) {
        return address(this).balance >= subscriptionRate;
    }

    /**
     * @dev Get contract balance
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Get withdrawable balance (total balance minus subscription reserve)
     */
    function getWithdrawableBalance() external view returns (uint256) {
        uint256 balance = address(this).balance;
        uint256 reserve = subscriptionRate + MIN_BALANCE_BUFFER;

        if (balance <= reserve) {
            return 0;
        }

        return balance - reserve;
    }

    /**
     * @dev Get contract statistics
     */
    function getStats()
        external
        view
        returns (
            uint256 balance,
            uint256 _totalFunded,
            uint256 _totalWithdrawn,
            uint256 _totalSubscriptionPaid,
            uint256 _lastPaymentTime,
            uint256 _subscriptionRate
        )
    {
        return (
            address(this).balance,
            totalFunded,
            totalWithdrawn,
            totalSubscriptionPaid,
            lastPaymentTime,
            subscriptionRate
        );
    }

    /**
     * @dev Update main contract address (only owner)
     */
    function updateMainContract(address _newMainContract) external onlyOwner {
        require(
            _newMainContract != address(0),
            "Invalid main contract address"
        );

        address oldContract = mainContract;
        mainContract = _newMainContract;

        emit MainContractUpdated(oldContract, _newMainContract);
    }

    /**
     * @dev Update subscription rate (only main contract)
     */
    function updateSubscriptionRate(
        uint256 _newRate
    ) external onlyMainContract {
        require(_newRate > 0, "Subscription rate must be greater than 0");

        uint256 oldRate = subscriptionRate;
        subscriptionRate = _newRate;

        emit SubscriptionRateUpdated(oldRate, _newRate);
    }

    /**
     * @dev Pause contract (only owner)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause contract (only owner)
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Check if subscription payment is due
     * @param paymentInterval Time interval between payments (in seconds)
     */
    function isPaymentDue(
        uint256 paymentInterval
    ) external view returns (bool) {
        return block.timestamp >= lastPaymentTime + paymentInterval;
    }

    /**
     * @dev Fallback function to receive Ether
     */
    receive() external payable {
        totalFunded += msg.value;
        emit Funded(msg.sender, msg.value, block.timestamp);
    }

    /**
     * @dev Fallback function
     */
    fallback() external payable {
        totalFunded += msg.value;
        emit Funded(msg.sender, msg.value, block.timestamp);
    }
}
