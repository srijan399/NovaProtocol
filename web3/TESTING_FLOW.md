# Complete Testing Flow for Automated Premium Payments

## 🚀 **Overview**

This guide walks you through testing the complete flow:

1. Agent Contract → Fund Agent → PremiumForwarder → YieldPool
2. Chainlink Automation every 1 minute

---

## 📋 **Prerequisites**

### Required Contracts:

-   ✅ `PolicyManager.sol` - deployed
-   ✅ `YieldPool.sol` - deployed
-   ✅ `Agent.sol` - deployed
-   ✅ `PremiumForwarder.sol` - deployed

### Required Setup:

-   Testnet with LINK tokens for Chainlink Automation
-   Test accounts with native tokens (ETH/AVAX)
-   Chainlink Automation subscription

---

## 🏗️ **Step 1: Deploy & Configure Contracts**

### 1.1 Deploy Core Contracts

```javascript
// Deploy in this order:
const policyManager = await PolicyManager.deploy();
const yieldPool = await YieldPool.deploy();
const premiumForwarder = await PremiumForwarder.deploy(
    policyManager.address,
    yieldPool.address
);

// Set cross-contract references
await yieldPool.setPremiumForwarder(premiumForwarder.address);
await policyManager.setPremiumForwarder(premiumForwarder.address);
```

### 1.2 Deploy Agent Contract

```javascript
const agentContract = await AIAgentContract.deploy(
    userAddress, // Agent owner
    premiumForwarder.address, // Main contract
    yieldPool.address, // Yield contract (for future use)
    ethers.utils.parseEther("0.01") // Subscription rate
);
```

---

## 🔧 **Step 2: Create Test Policy**

```javascript
// Create a test policy
const tx = await policyManager.createPolicy(
    0, // PolicyType.DEFI_PROTOCOL
    ethers.utils.parseEther("10"), // 10 ETH coverage
    ethers.utils.parseEther("0.1"), // 0.1 ETH premium
    30 * 24 * 60 * 60, // 30 days duration
    "ipfs://test-metadata-uri", // Metadata URI
    1 // RiskLevel.MEDIUM
);

const receipt = await tx.wait();
const policyId = 1; // First policy created
```

---

## ⚙️ **Step 3: Setup Agent Automation**

### 3.1 Register Agent

```javascript
// Register the agent with PremiumForwarder
await premiumForwarder.registerAgent(agentContract.address);

// Set PremiumForwarder as main contract (gives withdrawal permissions)
await premiumForwarder.setAsMainContract(agentContract.address);
```

### 3.2 Fund Agent

```javascript
// Fund the agent with enough for multiple premium payments
const fundAmount = ethers.utils.parseEther("1"); // 1 ETH
await premiumForwarder.fundAgent(agentContract.address, {
    value: fundAmount,
});

// Verify agent balance
const agentBalance = await agentContract.getBalance();
console.log("Agent Balance:", ethers.utils.formatEther(agentBalance));
```

### 3.3 Setup Policy Automation (All-in-One)

```javascript
// This links policy to agent AND enables autopay
await premiumForwarder.setupAgentAutomation(agentContract.address, policyId);
```

---

## 🧪 **Step 4: Test Manual Payments First**

### 4.1 Test Manual Premium Payment

```javascript
// Test manual payment to ensure everything works
await premiumForwarder.payPremiumFromAgent(policyId);

// Check if payment was successful
const stats = await premiumForwarder.getStats();
console.log(
    "Total Premiums Paid:",
    ethers.utils.formatEther(stats._totalPremiumsPaid)
);
```

### 4.2 Check YieldPool Balance

```javascript
const poolBalance = await yieldPool.getPoolBalance(1); // Medium risk level
console.log("YieldPool Balance:", ethers.utils.formatEther(poolBalance));
```

---

## 🤖 **Step 5: Test Automation Logic**

### 5.1 Check Automation Status

```javascript
const automationStatus = await premiumForwarder.getAutomationStatus(policyId);
console.log("Automation Status:", {
    isSetupForAutomation: automationStatus.isSetupForAutomation,
    autopayEnabled: automationStatus.autopayEnabled_,
    linkedAgent: automationStatus.linkedAgent,
    nextPaymentDue: new Date(automationStatus.nextPaymentDue * 1000),
    timeUntilNextPayment: automationStatus.timeUntilNextPayment.toString(),
    agentHasSufficientFunds: automationStatus.agentHasSufficientFunds,
    agentBalance: ethers.utils.formatEther(automationStatus.agentBalance),
    premiumRequired: ethers.utils.formatEther(automationStatus.premiumRequired),
});
```

### 5.2 Test checkUpkeep

```javascript
const checkResult = await premiumForwarder.checkUpkeep("0x");
console.log("CheckUpkeep Result:", {
    upkeepNeeded: checkResult.upkeepNeeded,
    policiesCount: checkResult.performData
        ? ethers.utils.defaultAbiCoder.decode(
              ["uint256[]"],
              checkResult.performData
          )[0].length
        : 0,
});
```

### 5.3 Manual Trigger Automation

```javascript
// Simulate Chainlink automation
const tx = await premiumForwarder.manualTriggerAutomation();
const receipt = await tx.wait();

// Check debug events
const debugEvents = receipt.events.filter(
    (e) =>
        e.event === "DebugUpkeepCalled" ||
        e.event === "DebugPolicyProcessed" ||
        e.event === "DebugAgentBalance"
);

debugEvents.forEach((event) => {
    console.log(`${event.event}:`, event.args);
});
```

---

## ⏰ **Step 6: Wait & Test Time-Based Automation**

### 6.1 Wait for Next Payment Window

```javascript
// Wait for 1 minute + buffer (since PREMIUM_PAYMENT_INTERVAL = 1 minute)
console.log("Waiting 70 seconds for next payment window...");
await new Promise((resolve) => setTimeout(resolve, 70000));
```

### 6.2 Check if Policy is Due

```javascript
const debugStatus = await premiumForwarder.debugPolicyStatus(policyId);
console.log("Policy Debug Status:", {
    autopayEnabled: debugStatus.autopayEnabledStatus,
    linkedAgent: debugStatus.linkedAgent,
    lastPayment: new Date(debugStatus.lastPayment * 1000),
    nextPaymentDue: new Date(debugStatus.nextPaymentDue * 1000),
    isPolicyActive: debugStatus.isPolicyActive,
    agentBalance: ethers.utils.formatEther(debugStatus.agentBalance),
    premiumRequired: ethers.utils.formatEther(debugStatus.premiumRequired),
    isAgentRegistered: debugStatus.isAgentRegistered,
});
```

### 6.3 Test Automation Again

```javascript
const checkResult2 = await premiumForwarder.checkUpkeep("0x");
console.log("Second CheckUpkeep Result:", {
    upkeepNeeded: checkResult2.upkeepNeeded,
    policiesCount: checkResult2.performData
        ? ethers.utils.defaultAbiCoder.decode(
              ["uint256[]"],
              checkResult2.performData
          )[0].length
        : 0,
});

if (checkResult2.upkeepNeeded) {
    const tx = await premiumForwarder.manualTriggerAutomation();
    const receipt = await tx.wait();
    console.log("Second automation successful!");
}
```

---

## 🔗 **Step 7: Setup Chainlink Automation**

### 7.1 Register Upkeep

1. Go to [automation.chain.link](https://automation.chain.link)
2. Connect wallet and select your testnet
3. Click "Register New Upkeep"
4. Fill in details:
    - **Contract Address**: `premiumForwarder.address`
    - **Upkeep Name**: "Premium Payment Automation"
    - **Gas Limit**: `500000`
    - **Starting Balance**: Fund with LINK tokens
    - **Check Data**: Leave empty

### 7.2 Monitor Automation

```javascript
// Setup event listeners to monitor automation
premiumForwarder.on("AutomationExecuted", (premiumsPaid) => {
    console.log(
        `Chainlink Automation executed! Premiums paid: ${premiumsPaid}`
    );
});

premiumForwarder.on(
    "PremiumPaidFromAgent",
    (policyId, agentContract, amount, riskLevel) => {
        console.log(
            `Premium paid: PolicyID ${policyId}, Amount: ${ethers.utils.formatEther(
                amount
            )}`
        );
    }
);

premiumForwarder.on("DebugPolicyProcessed", (policyId, success, reason) => {
    console.log(
        `Policy ${policyId}: ${success ? "SUCCESS" : "FAILED"} - ${reason}`
    );
});
```

---

## 📊 **Step 8: Continuous Monitoring**

### 8.1 Track Multiple Payment Cycles

```javascript
// Monitor for 10 minutes (10 payment cycles)
for (let i = 0; i < 10; i++) {
    console.log(`\n--- Payment Cycle ${i + 1} ---`);

    // Check current status
    const stats = await premiumForwarder.getStats();
    const poolBalance = await yieldPool.getPoolBalance(1);
    const agentBalance = await agentContract.getBalance();

    console.log({
        totalPremiumsPaid: ethers.utils.formatEther(stats._totalPremiumsPaid),
        yieldPoolBalance: ethers.utils.formatEther(poolBalance),
        agentBalance: ethers.utils.formatEther(agentBalance),
        timestamp: new Date().toISOString(),
    });

    // Wait 1 minute
    await new Promise((resolve) => setTimeout(resolve, 60000));
}
```

### 8.2 Verify Fund Flow

```javascript
// Final verification
const finalStats = await premiumForwarder.getStats();
const finalPoolBalance = await yieldPool.getPoolBalance(1);
const finalAgentBalance = await agentContract.getBalance();

console.log("\n🎉 FINAL RESULTS:");
console.log(
    "Total Premiums Paid:",
    ethers.utils.formatEther(finalStats._totalPremiumsPaid)
);
console.log("YieldPool Balance:", ethers.utils.formatEther(finalPoolBalance));
console.log(
    "Remaining Agent Balance:",
    ethers.utils.formatEther(finalAgentBalance)
);
console.log(
    "Expected: Agent Balance decreases, YieldPool Balance increases every minute"
);
```

---

## 🚨 **Troubleshooting Guide**

### Common Issues & Solutions:

1. **"Agent withdrawal failed"**

    - ✅ Ensure `setAsMainContract()` was called
    - ✅ Check agent has sufficient balance

2. **"Policy conditions not met"**

    - ✅ Verify autopay is enabled
    - ✅ Check policy is linked to agent
    - ✅ Confirm 1 minute has passed since last payment

3. **"YieldPool deposit failed"**

    - ✅ Check YieldPool's authorized addresses
    - ✅ Verify PremiumForwarder is set as authorized

4. **CheckUpkeep returns false**
    - ✅ Check automation is enabled: `toggleAutomation()`
    - ✅ Verify policy setup: `debugPolicyStatus(policyId)`

### Debug Commands:

```javascript
// Check detailed policy status
await premiumForwarder.debugPolicyStatus(policyId);

// Check automation setup
await premiumForwarder.getAutomationStatus(policyId);

// Manual trigger to see debug events
await premiumForwarder.manualTriggerAutomation();
```

---

## ✅ **Success Criteria**

Your automation is working correctly when:

1. ✅ Manual payments work (`payPremiumFromAgent`)
2. ✅ `checkUpkeep` returns `true` when payments are due
3. ✅ `manualTriggerAutomation` successfully processes payments
4. ✅ Agent balance decreases by premium amount
5. ✅ YieldPool balance increases by premium amount
6. ✅ Chainlink automation executes every ~1 minute
7. ✅ Events are emitted for successful payments
8. ✅ Multiple payment cycles work automatically

---

## 🎯 **Expected Flow Summary**

```
Every 1 minute:
1. Chainlink calls checkUpkeep() → finds due policies
2. Chainlink calls performUpkeep() → processes payments
3. Agent.withdrawForPremium() → sends ETH to PremiumForwarder
4. PremiumForwarder.depositPremium() → forwards ETH to YieldPool
5. Events emitted, timestamps updated
6. Repeat next minute
```

This creates a fully automated premium payment system! 🚀
