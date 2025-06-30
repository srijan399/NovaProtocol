# 🚀 Quick Start: Automated Premium Payments

## 📋 **1. Prerequisites**

-   Testnet with ETH/AVAX and LINK tokens
-   Hardhat environment set up
-   All contracts compiled

## ⚡ **2. Run Complete Test (5 minutes)**

```bash
# Navigate to web3 directory
cd /home/srijan399/Projects/Aegis/web3

# Run automated test script
npx hardhat run scripts/test-automation.js --network <your-testnet>
```

This will automatically:

-   ✅ Deploy all contracts
-   ✅ Create test policy
-   ✅ Setup agent automation
-   ✅ Test manual payments
-   ✅ Test automation logic
-   ✅ Run multiple payment cycles
-   ✅ Verify all flows work

## 🔗 **3. Setup Chainlink Automation**

After successful test, go to [automation.chain.link](https://automation.chain.link):

1. **Register New Upkeep**

    - Contract: `PremiumForwarder` address (from test output)
    - Name: "Premium Payment Automation"
    - Gas Limit: `500,000`
    - Starting Balance: Fund with LINK

2. **Monitor Live Automation**
    ```javascript
    // Listen for automation events
    premiumForwarder.on("AutomationExecuted", (count) => {
        console.log(`Automated ${count} premium payments!`);
    });
    ```

## 📊 **4. Expected Results**

✅ **Success Indicators:**

-   Manual payments work
-   `checkUpkeep()` returns true when due
-   Agent balance decreases every minute
-   YieldPool balance increases every minute
-   Events emitted successfully
-   Multiple cycles work automatically

✅ **Live Automation:**

-   Chainlink executes every ~1 minute
-   Premiums flow: Agent → PremiumForwarder → YieldPool
-   Fully hands-off operation

## 🎯 **5. Production Deployment**

```bash
# Deploy to mainnet
npx hardhat run scripts/test-automation.js --network mainnet

# Register with Chainlink Automation
# Fund with LINK tokens
# Monitor via events/dashboard
```

## 🚨 **6. Troubleshooting**

**Issue:** `checkUpkeep` returns false

```javascript
// Debug policy status
await premiumForwarder.debugPolicyStatus(policyId);
```

**Issue:** Agent withdrawal fails

```javascript
// Ensure main contract is set
await premiumForwarder.setAsMainContract(agentAddress);
```

**Issue:** YieldPool deposit fails

```javascript
// Check authorization
await yieldPool.setPremiumForwarder(premiumForwarder.address);
```

---

## 🏁 **You're Done!**

Your fully automated premium payment system is now:

-   ✅ Tested and verified
-   ✅ Ready for Chainlink Automation
-   ✅ Production-ready
-   ✅ Completely hands-off

**Next:** Register on Chainlink Automation and watch premiums flow automatically every minute! 🚀
