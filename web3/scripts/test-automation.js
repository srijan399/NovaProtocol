// Complete Test Script for Automated Premium Payments
// Run with: npx hardhat run scripts/test-automation.js --network <your-testnet>

const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Starting Automated Premium Payment Test...\n");

    // Get signers
    const [deployer, user] = await ethers.getSigners();
    console.log("Deployer address:", deployer.address);
    console.log("User address:", user.address);

    // ========================================================================
    // STEP 1: DEPLOY CONTRACTS
    // ========================================================================
    console.log("\n📋 Step 1: Deploying Contracts...");

    // Deploy PolicyManager
    const PolicyManager = await ethers.getContractFactory("PolicyManager");
    const policyManager = await PolicyManager.deploy();
    await policyManager.deployed();
    console.log("✅ PolicyManager deployed to:", policyManager.address);

    // Deploy YieldPool
    const YieldPool = await ethers.getContractFactory("YieldPool");
    const yieldPool = await YieldPool.deploy();
    await yieldPool.deployed();
    console.log("✅ YieldPool deployed to:", yieldPool.address);

    // Deploy PremiumForwarder
    const PremiumForwarder = await ethers.getContractFactory("PremiumForwarder");
    const premiumForwarder = await PremiumForwarder.deploy(
        policyManager.address,
        yieldPool.address
    );
    await premiumForwarder.deployed();
    console.log("✅ PremiumForwarder deployed to:", premiumForwarder.address);

    // Set cross-contract references
    await yieldPool.setPremiumForwarder(premiumForwarder.address);
    await policyManager.setPremiumForwarder(premiumForwarder.address);

    // Deploy Agent Contract
    const AIAgentContract = await ethers.getContractFactory("AIAgentContract");
    const agentContract = await AIAgentContract.deploy(
        user.address,                    // Agent owner
        premiumForwarder.address,        // Main contract
        yieldPool.address,              // Yield contract
        ethers.utils.parseEther("0.01") // Subscription rate
    );
    await agentContract.deployed();
    console.log("✅ Agent Contract deployed to:", agentContract.address);

    // ========================================================================
    // STEP 2: CREATE TEST POLICY
    // ========================================================================
    console.log("\n📋 Step 2: Creating Test Policy...");

    const createPolicyTx = await policyManager.connect(user).createPolicy(
        0,  // PolicyType.DEFI_PROTOCOL
        ethers.utils.parseEther("10"),    // 10 ETH coverage
        ethers.utils.parseEther("0.1"),   // 0.1 ETH premium
        30 * 24 * 60 * 60,               // 30 days duration
        "ipfs://test-metadata-uri",       // Metadata URI
        1   // RiskLevel.MEDIUM
    );
    await createPolicyTx.wait();

    const policyId = 1; // First policy created
    console.log("✅ Test policy created with ID:", policyId);

    // ========================================================================
    // STEP 3: SETUP AGENT AUTOMATION
    // ========================================================================
    console.log("\n📋 Step 3: Setting up Agent Automation...");

    // Register agent (can be done by anyone)
    await premiumForwarder.registerAgent(agentContract.address);
    console.log("✅ Agent registered");

    // Set PremiumForwarder as main contract (must be done by agent owner)
    await premiumForwarder.connect(user).setAsMainContract(agentContract.address);
    console.log("✅ PremiumForwarder set as main contract");

    // Fund agent
    const fundAmount = ethers.utils.parseEther("2"); // 2 ETH for multiple payments
    await premiumForwarder.fundAgent(agentContract.address, {
        value: fundAmount
    });
    console.log("✅ Agent funded with:", ethers.utils.formatEther(fundAmount), "ETH");

    // Setup automation (link policy + enable autopay)
    await premiumForwarder.connect(user).setupAgentAutomation(
        agentContract.address,
        policyId
    );
    console.log("✅ Automation setup complete");

    // ========================================================================
    // STEP 4: VERIFY SETUP
    // ========================================================================
    console.log("\n📋 Step 4: Verifying Setup...");

    const agentBalance = await agentContract.getBalance();
    const automationStatus = await premiumForwarder.getAutomationStatus(policyId);

    console.log("Agent Balance:", ethers.utils.formatEther(agentBalance), "ETH");
    console.log("Automation Status:", {
        isSetupForAutomation: automationStatus.isSetupForAutomation,
        autopayEnabled: automationStatus.autopayEnabled_,
        linkedAgent: automationStatus.linkedAgent,
        agentHasSufficientFunds: automationStatus.agentHasSufficientFunds,
        premiumRequired: ethers.utils.formatEther(automationStatus.premiumRequired)
    });

    if (!automationStatus.isSetupForAutomation) {
        throw new Error("❌ Automation setup failed!");
    }

    // ========================================================================
    // STEP 5: TEST MANUAL PAYMENT
    // ========================================================================
    console.log("\n📋 Step 5: Testing Manual Payment...");

    const initialYieldBalance = await yieldPool.getPoolBalance(1);
    console.log("Initial YieldPool Balance:", ethers.utils.formatEther(initialYieldBalance), "ETH");

    // Test manual payment
    const manualPaymentTx = await premiumForwarder.payPremiumFromAgent(policyId);
    const receipt = await manualPaymentTx.wait();

    // Check for success event
    const premiumPaidEvent = receipt.events.find(e => e.event === 'PremiumPaidFromAgent');
    if (premiumPaidEvent) {
        console.log("✅ Manual payment successful!");
        console.log("Premium Amount:", ethers.utils.formatEther(premiumPaidEvent.args.amount), "ETH");
    } else {
        throw new Error("❌ Manual payment failed!");
    }

    const afterYieldBalance = await yieldPool.getPoolBalance(1);
    console.log("YieldPool Balance After Payment:", ethers.utils.formatEther(afterYieldBalance), "ETH");

    // ========================================================================
    // STEP 6: TEST AUTOMATION LOGIC
    // ========================================================================
    console.log("\n📋 Step 6: Testing Automation Logic...");

    // Initially, should not be due (just paid)
    let checkResult = await premiumForwarder.checkUpkeep("0x");
    console.log("CheckUpkeep (just paid):", checkResult.upkeepNeeded);

    // Wait for next payment window (1 minute + buffer)
    console.log("⏰ Waiting 65 seconds for next payment window...");
    await new Promise(resolve => setTimeout(resolve, 65000));

    // Should now be due
    checkResult = await premiumForwarder.checkUpkeep("0x");
    console.log("CheckUpkeep (after wait):", checkResult.upkeepNeeded);

    if (checkResult.upkeepNeeded) {
        const policiesData = ethers.utils.defaultAbiCoder.decode(['uint256[]'], checkResult.performData);
        console.log("Due policies:", policiesData[0]);
    }

    // ========================================================================
    // STEP 7: TEST MANUAL AUTOMATION TRIGGER
    // ========================================================================
    console.log("\n📋 Step 7: Testing Manual Automation Trigger...");

    const beforeTriggerBalance = await yieldPool.getPoolBalance(1);
    const beforeAgentBalance = await agentContract.getBalance();

    const manualTriggerTx = await premiumForwarder.manualTriggerAutomation();
    const triggerReceipt = await manualTriggerTx.wait();

    // Check debug events
    const debugEvents = triggerReceipt.events.filter(e =>
        e.event === 'DebugUpkeepCalled' ||
        e.event === 'DebugPolicyProcessed' ||
        e.event === 'AutomationExecuted'
    );

    console.log("\n🔍 Debug Events:");
    debugEvents.forEach(event => {
        if (event.event === 'DebugUpkeepCalled') {
            console.log(`📞 DebugUpkeepCalled: ${event.args.policiesCount} policies found`);
        } else if (event.event === 'DebugPolicyProcessed') {
            console.log(`🔄 Policy ${event.args.policyId}: ${event.args.success ? '✅ SUCCESS' : '❌ FAILED'} - ${event.args.reason}`);
        } else if (event.event === 'AutomationExecuted') {
            console.log(`🤖 AutomationExecuted: ${event.args} premiums paid`);
        }
    });

    const afterTriggerBalance = await yieldPool.getPoolBalance(1);
    const afterAgentBalance = await agentContract.getBalance();

    console.log("\n💰 Balance Changes:");
    console.log("YieldPool:",
        ethers.utils.formatEther(beforeTriggerBalance), "→",
        ethers.utils.formatEther(afterTriggerBalance), "ETH"
    );
    console.log("Agent:",
        ethers.utils.formatEther(beforeAgentBalance), "→",
        ethers.utils.formatEther(afterAgentBalance), "ETH"
    );

    // ========================================================================
    // STEP 8: CONTINUOUS MONITORING
    // ========================================================================
    console.log("\n📋 Step 8: Testing Multiple Payment Cycles...");

    console.log("⏰ Testing 3 payment cycles (3+ minutes)...");

    for (let cycle = 1; cycle <= 3; cycle++) {
        console.log(`\n--- 🔄 Payment Cycle ${cycle} ---`);

        // Wait for next payment window
        console.log("Waiting 70 seconds for next payment...");
        await new Promise(resolve => setTimeout(resolve, 70000));

        // Check if payment is due
        const checkResult = await premiumForwarder.checkUpkeep("0x");
        console.log("Payment due:", checkResult.upkeepNeeded);

        if (checkResult.upkeepNeeded) {
            // Record balances before
            const beforeBalance = await yieldPool.getPoolBalance(1);
            const beforeAgent = await agentContract.getBalance();

            // Trigger automation
            const tx = await premiumForwarder.manualTriggerAutomation();
            await tx.wait();

            // Record balances after
            const afterBalance = await yieldPool.getPoolBalance(1);
            const afterAgent = await agentContract.getBalance();

            const transferred = afterBalance.sub(beforeBalance);
            console.log(`✅ Cycle ${cycle}: ${ethers.utils.formatEther(transferred)} ETH transferred`);
            console.log(`Agent balance: ${ethers.utils.formatEther(afterAgent)} ETH remaining`);
        } else {
            console.log(`❌ Cycle ${cycle}: No payment due (unexpected)`);
        }
    }

    // ========================================================================
    // FINAL RESULTS
    // ========================================================================
    console.log("\n🎉 FINAL RESULTS:");

    const finalStats = await premiumForwarder.getStats();
    const finalYieldBalance = await yieldPool.getPoolBalance(1);
    const finalAgentBalance = await agentContract.getBalance();

    console.log("📊 Final Statistics:");
    console.log("Total Premiums Paid:", ethers.utils.formatEther(finalStats._totalPremiumsPaid), "ETH");
    console.log("Total Collected from Agents:", ethers.utils.formatEther(finalStats._totalCollectedFromAgents), "ETH");
    console.log("YieldPool Final Balance:", ethers.utils.formatEther(finalYieldBalance), "ETH");
    console.log("Agent Final Balance:", ethers.utils.formatEther(finalAgentBalance), "ETH");

    console.log("\n✅ SUCCESS: Automated premium payment system is working!");
    console.log("\n📝 Next Steps:");
    console.log("1. Register this PremiumForwarder on Chainlink Automation:");
    console.log("   Contract Address:", premiumForwarder.address);
    console.log("   Gas Limit: 500,000");
    console.log("   Check Interval: Every ~15 seconds");
    console.log("2. Fund Chainlink upkeep with LINK tokens");
    console.log("3. Monitor automation events");

    console.log("\n🔗 Contract Addresses:");
    console.log("PolicyManager:", policyManager.address);
    console.log("YieldPool:", yieldPool.address);
    console.log("PremiumForwarder:", premiumForwarder.address);
    console.log("Agent Contract:", agentContract.address);
    console.log("Policy ID:", policyId);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Test failed:", error);
        process.exit(1);
    });
