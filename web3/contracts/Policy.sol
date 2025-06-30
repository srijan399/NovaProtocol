// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// import "@chainlinkrc/v0.8/interfaces/AutomationCompatibleInterface.sol";
// import "@chainlink/contracts/src/v0.8/interfaces/FunctionsClient.sol";/contracts/s

// interface IVerification {
//     function verifyUserClaim(
//         uint256 policyId,
//         address claimant,
//         uint256 claimAmount,
//         bytes calldata claimData
//     ) external returns (bool);
// }

// // ==================== ENUMS AND STRUCTS ====================

// enum RiskLevel {
//     LOW,
//     MEDIUM,
//     HIGH
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

// struct Claim {
//     uint256 id;
//     uint256 policyId;
//     address claimant;
//     uint256 claimAmount;
//     ClaimStatus status;
//     uint256 submissionDate;
//     bytes claimData;
//     string evidenceUri;
// }

// // ==================== 1. POLICY MANAGER CONTRACT ====================

// contract PolicyManager {
//     uint256 private _policyIdCounter;
//     mapping(uint256 => Policy) public policies;
//     mapping(address => uint256[]) public userPolicies;

//     address public premiumForwarder;
//     address public claimManager;

//     event PolicyCreated(
//         uint256 indexed policyId,
//         address indexed owner,
//         PolicyType policyType,
//         uint256 coverageAmount,
//         uint256 premiumAmount
//     );

//     event PolicyExpired(uint256 indexed policyId);

//     modifier onlyAuthorized() {
//         require(
//             msg.sender == premiumForwarder || msg.sender == claimManager,
//             "Unauthorized"
//         );
//         _;
//     }

//     constructor() {
//         _policyIdCounter = 1;
//     }

//     function setPremiumForwarder(address _premiumForwarder) external {
//         premiumForwarder = _premiumForwarder;
//     }

//     function setClaimManager(address _claimManager) external {
//         claimManager = _claimManager;
//     }

//     function createPolicy(
//         PolicyType _policyType,
//         uint256 _coverageAmount,
//         uint256 _premiumAmount,
//         uint256 _duration,
//         string memory _metadataUri
//     ) external returns (uint256) {
//         RiskLevel riskLevel = _calculateRiskLevel(_policyType, _coverageAmount);

//         uint256 policyId = _policyIdCounter++;

//         policies[policyId] = Policy({
//             id: policyId,
//             owner: msg.sender,
//             policyType: _policyType,
//             coverageAmount: _coverageAmount,
//             premiumAmount: _premiumAmount,
//             riskLevel: riskLevel,
//             startDate: block.timestamp,
//             expiryDate: block.timestamp + _duration,
//             isActive: true,
//             metadataUri: _metadataUri
//         });

//         userPolicies[msg.sender].push(policyId);

//         emit PolicyCreated(
//             policyId,
//             msg.sender,
//             _policyType,
//             _coverageAmount,
//             _premiumAmount
//         );

//         return policyId;
//     }

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
//         )
//     {
//         Policy memory policy = policies[policyId];
//         return (
//             policy.owner,
//             policy.coverageAmount,
//             policy.premiumAmount,
//             uint8(policy.riskLevel),
//             policy.expiryDate,
//             policy.isActive
//         );
//     }

//     function getAllPolicies() external view returns (Policy[] memory) {
//         Policy[] memory allPolicies = new Policy[](_policyIdCounter - 1);
//         for (uint256 i = 1; i < _policyIdCounter; i++) {
//             allPolicies[i - 1] = policies[i];
//         }
//         return allPolicies;
//     }

//     function getUserPolicies(
//         address user
//     ) external view returns (uint256[] memory) {
//         return userPolicies[user];
//     }

//     function expirePolicy(uint256 policyId) external onlyAuthorized {
//         policies[policyId].isActive = false;
//         emit PolicyExpired(policyId);
//     }

//     // function _calculateRiskLevel(
//     //     PolicyType _policyType,
//     //     uint256 _coverageAmount
//     // ) private pure returns (RiskLevel) {
//     //     if (
//     //         _coverageAmount > 1000000 ether ||
//     //         _policyType == PolicyType.BRIDGE_SECURITY
//     //     ) {
//     //         return RiskLevel.HIGH;
//     //     } else if (
//     //         _coverageAmount > 100000 ether ||
//     //         _policyType == PolicyType.DEFI_PROTOCOL
//     //     ) {
//     //         return RiskLevel.MEDIUM;
//     //     } else {
//     //         return RiskLevel.LOW;
//     //     }
//     // }
// }

// // ==================== 2. PREMIUM FORWARDER CONTRACT ====================

// contract PremiumForwarder is AutomationCompatibleInterface {
//     IPolicyManager public policyManager;
//     IYieldPool public yieldPool;

//     mapping(uint256 => uint256) public lastPremiumPayment;
//     mapping(uint256 => bool) public autopayEnabled;

//     uint256 constant PAYMENT_INTERVAL = 30 days;

//     event PremiumPaid(
//         uint256 indexed policyId,
//         uint256 amount,
//         uint8 riskLevel
//     );
//     event AutoPayEnabled(uint256 indexed policyId);
//     event AutoPayDisabled(uint256 indexed policyId);

//     constructor(address _policyManager, address _yieldPool) {
//         policyManager = IPolicyManager(_policyManager);
//         yieldPool = IYieldPool(_yieldPool);
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
//         uint256[] memory duePayments = new uint256[](100); // Max 100 payments per upkeep
//         uint256 count = 0;

//         // Check first 1000 policies for due payments (simplified)
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
//             // Resize array to actual count
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

//         yieldPool.depositPremium(premiumAmount, riskLevel);
//         lastPremiumPayment[policyId] = block.timestamp;

//         // Refund excess
//         if (msg.value > premiumAmount) {
//             payable(msg.sender).transfer(msg.value - premiumAmount);
//         }

//         emit PremiumPaid(policyId, premiumAmount, riskLevel);
//     }

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

//         // In a real implementation, this would deduct from user's approved balance
//         // For now, we'll assume the contract has sufficient funds
//         if (address(this).balance >= premiumAmount) {
//             yieldPool.depositPremium(premiumAmount, riskLevel);
//             lastPremiumPayment[policyId] = block.timestamp;

//             emit PremiumPaid(policyId, premiumAmount, riskLevel);
//         }
//     }

//     receive() external payable {}
// }

// // ==================== 3. VERIFICATION CONTRACTS ====================

// abstract contract BaseVerification is IVerification {
//     using Chainlink for Chainlink.Request;

//     address public claimManager;
//     mapping(uint256 => bool) public verificationResults;

//     modifier onlyClaimManager() {
//         require(msg.sender == claimManager, "Only ClaimManager");
//         _;
//     }

//     constructor(address _claimManager) {
//         claimManager = _claimManager;
//     }

//     function verifyUserClaim(
//         uint256 policyId,
//         address claimant,
//         uint256 claimAmount,
//         bytes calldata claimData
//     ) external virtual override returns (bool);
// }

// contract DeFiProtocolVerification is BaseVerification {
//     constructor(address _claimManager) BaseVerification(_claimManager) {}

//     function verifyUserClaim(
//         uint256 policyId,
//         address claimant,
//         uint256 claimAmount,
//         bytes calldata claimData
//     ) external override onlyClaimManager returns (bool) {
//         // Mock verification logic for DeFi protocol claims
//         // In reality, this would use Chainlink Functions to verify:
//         // - Protocol exploit transactions
//         // - TVL changes
//         // - External audit reports

//         // For demo: simple validation based on claim amount
//         if (claimAmount > 0 && claimAmount <= 500000 ether) {
//             verificationResults[policyId] = true;
//             return true;
//         }

//         verificationResults[policyId] = false;
//         return false;
//     }
// }

// contract BridgeSecurityVerification is BaseVerification {
//     constructor(address _claimManager) BaseVerification(_claimManager) {}

//     function verifyUserClaim(
//         uint256 policyId,
//         address claimant,
//         uint256 claimAmount,
//         bytes calldata claimData
//     ) external override onlyClaimManager returns (bool) {
//         // Mock verification for bridge security claims
//         // Would verify cross-chain transaction failures, bridge exploits, etc.

//         verificationResults[policyId] = true; // Mock approval
//         return true;
//     }
// }

// // ==================== 4. CLAIM MANAGER CONTRACT ====================

// contract ClaimManager {
//     uint256 private _claimIdCounter;
//     mapping(uint256 => Claim) public claims;
//     mapping(uint256 => uint256[]) public policyClaims; // policyId => claimIds

//     IPolicyManager public policyManager;
//     IYieldPool public yieldPool;

//     mapping(PolicyType => address) public verificationContracts;

//     event ClaimSubmitted(
//         uint256 indexed claimId,
//         uint256 indexed policyId,
//         address claimant
//     );
//     event ClaimApproved(uint256 indexed claimId, uint256 amount);
//     event ClaimRejected(uint256 indexed claimId);
//     event ClaimPaid(uint256 indexed claimId, uint256 amount);

//     constructor(address _policyManager, address _yieldPool) {
//         policyManager = IPolicyManager(_policyManager);
//         yieldPool = IYieldPool(_yieldPool);
//         _claimIdCounter = 1;
//     }

//     function setVerificationContract(
//         PolicyType policyType,
//         address verificationContract
//     ) external {
//         verificationContracts[policyType] = verificationContract;
//     }

//     function submitClaim(
//         uint256 policyId,
//         uint256 claimAmount,
//         bytes calldata claimData,
//         string memory evidenceUri
//     ) external returns (uint256) {
//         (
//             address owner,
//             uint256 coverageAmount,
//             ,
//             ,
//             uint256 expiryDate,
//             bool isActive
//         ) = policyManager.getPolicyDetails(policyId);

//         require(msg.sender == owner, "Not policy owner");
//         require(isActive, "Policy not active");
//         require(block.timestamp < expiryDate, "Policy expired");
//         require(claimAmount <= coverageAmount, "Claim exceeds coverage");

//         uint256 claimId = _claimIdCounter++;

//         claims[claimId] = Claim({
//             id: claimId,
//             policyId: policyId,
//             claimant: msg.sender,
//             claimAmount: claimAmount,
//             status: ClaimStatus.PENDING,
//             submissionDate: block.timestamp,
//             claimData: claimData,
//             evidenceUri: evidenceUri
//         });

//         policyClaims[policyId].push(claimId);

//         emit ClaimSubmitted(claimId, policyId, msg.sender);

//         // Automatically trigger verification
//         _processClaim(claimId);

//         return claimId;
//     }

//     function _processClaim(uint256 claimId) private {
//         Claim storage claim = claims[claimId];

//         // Get policy details to determine verification contract
//         (, , , , , bool isActive) = policyManager.getPolicyDetails(
//             claim.policyId
//         );
//         require(isActive, "Policy not active");

//         // For simplicity, we'll use DeFi verification for all claims in this mock
//         address verificationContract = verificationContracts[
//             PolicyType.DEFI_PROTOCOL
//         ];

//         if (verificationContract != address(0)) {
//             bool isVerified = IVerification(verificationContract)
//                 .verifyUserClaim(
//                     claim.policyId,
//                     claim.claimant,
//                     claim.claimAmount,
//                     claim.claimData
//                 );

//             if (isVerified) {
//                 _approveClaim(claimId);
//             } else {
//                 _rejectClaim(claimId);
//             }
//         }
//     }

//     function _approveClaim(uint256 claimId) private {
//         claims[claimId].status = ClaimStatus.APPROVED;
//         emit ClaimApproved(claimId, claims[claimId].claimAmount);

//         // Trigger payout
//         _payoutClaim(claimId);
//     }

//     function _rejectClaim(uint256 claimId) private {
//         claims[claimId].status = ClaimStatus.REJECTED;
//         emit ClaimRejected(claimId);
//     }

//     function _payoutClaim(uint256 claimId) private {
//         Claim storage claim = claims[claimId];
//         require(claim.status == ClaimStatus.APPROVED, "Claim not approved");

//         (, , , uint8 riskLevel, , ) = policyManager.getPolicyDetails(
//             claim.policyId
//         );

//         yieldPool.processClaim(claim.claimAmount, riskLevel, claim.claimant);
//         claim.status = ClaimStatus.PAID;

//         emit ClaimPaid(claimId, claim.claimAmount);
//     }

//     function getClaimDetails(
//         uint256 claimId
//     ) external view returns (Claim memory) {
//         return claims[claimId];
//     }

//     function getPolicyClaims(
//         uint256 policyId
//     ) external view returns (uint256[] memory) {
//         return policyClaims[policyId];
//     }
// }

// // ==================== 5. YIELD POOL CONTRACT ====================

// contract YieldPool is AutomationCompatibleInterface {
//     struct Pool {
//         uint256 totalDeposits;
//         uint256 totalPremiums;
//         uint256 totalClaims;
//         uint256 lastInterestDistribution;
//     }

//     struct LiquidityProvider {
//         uint256 depositAmount;
//         uint256 lastRewardClaim;
//         uint256 shares;
//     }

//     mapping(uint8 => Pool) public pools; // riskLevel => Pool
//     mapping(uint8 => mapping(address => LiquidityProvider))
//         public liquidityProviders;
//     mapping(uint8 => uint256) public totalShares;

//     address public premiumForwarder;
//     address public claimManager;

//     uint256 constant INTEREST_RATE = 500; // 5% APY
//     uint256 constant SECONDS_IN_YEAR = 365 days;
//     uint256 constant INTEREST_DISTRIBUTION_INTERVAL = 7 days;

//     event PremiumDeposited(uint256 amount, uint8 riskLevel);
//     event LiquidityDeposited(
//         address indexed provider,
//         uint256 amount,
//         uint8 riskLevel
//     );
//     event LiquidityWithdrawn(
//         address indexed provider,
//         uint256 amount,
//         uint8 riskLevel
//     );
//     event ClaimPayout(uint256 amount, uint8 riskLevel, address recipient);
//     event InterestDistributed(uint8 riskLevel, uint256 totalInterest);

//     modifier onlyAuthorized() {
//         require(
//             msg.sender == premiumForwarder || msg.sender == claimManager,
//             "Unauthorized"
//         );
//         _;
//     }

//     constructor() {
//         // Initialize pools
//         for (uint8 i = 0; i < 3; i++) {
//             pools[i].lastInterestDistribution = block.timestamp;
//         }
//     }

//     function setPremiumForwarder(address _premiumForwarder) external {
//         premiumForwarder = _premiumForwarder;
//     }

//     function setClaimManager(address _claimManager) external {
//         claimManager = _claimManager;
//     }

//     function depositPremium(
//         uint256 amount,
//         uint8 riskLevel
//     ) external onlyAuthorized {
//         require(riskLevel < 3, "Invalid risk level");

//         pools[riskLevel].totalPremiums += amount;
//         pools[riskLevel].totalDeposits += amount;

//         emit PremiumDeposited(amount, riskLevel);
//     }

//     function depositLiquidity(uint8 riskLevel) external payable {
//         require(riskLevel < 3, "Invalid risk level");
//         require(msg.value > 0, "Must deposit some ETH");

//         uint256 shares;
//         if (totalShares[riskLevel] == 0) {
//             shares = msg.value;
//         } else {
//             shares =
//                 (msg.value * totalShares[riskLevel]) /
//                 pools[riskLevel].totalDeposits;
//         }

//         liquidityProviders[riskLevel][msg.sender].depositAmount += msg.value;
//         liquidityProviders[riskLevel][msg.sender].shares += shares;
//         liquidityProviders[riskLevel][msg.sender].lastRewardClaim = block
//             .timestamp;

//         totalShares[riskLevel] += shares;
//         pools[riskLevel].totalDeposits += msg.value;

//         emit LiquidityDeposited(msg.sender, msg.value, riskLevel);
//     }

//     function withdrawLiquidity(uint8 riskLevel, uint256 shares) external {
//         require(riskLevel < 3, "Invalid risk level");
//         require(
//             liquidityProviders[riskLevel][msg.sender].shares >= shares,
//             "Insufficient shares"
//         );

//         uint256 withdrawAmount = (shares * pools[riskLevel].totalDeposits) /
//             totalShares[riskLevel];

//         liquidityProviders[riskLevel][msg.sender].shares -= shares;
//         liquidityProviders[riskLevel][msg.sender]
//             .depositAmount -= withdrawAmount;
//         totalShares[riskLevel] -= shares;
//         pools[riskLevel].totalDeposits -= withdrawAmount;

//         payable(msg.sender).transfer(withdrawAmount);

//         emit LiquidityWithdrawn(msg.sender, withdrawAmount, riskLevel);
//     }

//     function processClaim(
//         uint256 amount,
//         uint8 riskLevel,
//         address recipient
//     ) external onlyAuthorized {
//         require(riskLevel < 3, "Invalid risk level");
//         require(
//             pools[riskLevel].totalDeposits >= amount,
//             "Insufficient pool balance"
//         );

//         pools[riskLevel].totalClaims += amount;
//         pools[riskLevel].totalDeposits -= amount;

//         payable(recipient).transfer(amount);

//         emit ClaimPayout(amount, riskLevel, recipient);
//     }

//     function checkUpkeep(
//         bytes calldata
//     )
//         external
//         view
//         override
//         returns (bool upkeepNeeded, bytes memory performData)
//     {
//         uint8[] memory poolsToUpdate = new uint8[](3);
//         uint8 count = 0;

//         for (uint8 i = 0; i < 3; i++) {
//             if (
//                 pools[i].lastInterestDistribution +
//                     INTEREST_DISTRIBUTION_INTERVAL <=
//                 block.timestamp
//             ) {
//                 poolsToUpdate[count] = i;
//                 count++;
//             }
//         }

//         if (count > 0) {
//             uint8[] memory actualPools = new uint8[](count);
//             for (uint8 j = 0; j < count; j++) {
//                 actualPools[j] = poolsToUpdate[j];
//             }
//             return (true, abi.encode(actualPools));
//         }

//         return (false, "");
//     }

//     function performUpkeep(bytes calldata performData) external override {
//         uint8[] memory poolsToUpdate = abi.decode(performData, (uint8[]));

//         for (uint256 i = 0; i < poolsToUpdate.length; i++) {
//             _distributeInterest(poolsToUpdate[i]);
//         }
//     }

//     function _distributeInterest(uint8 riskLevel) private {
//         Pool storage pool = pools[riskLevel];

//         if (pool.totalDeposits == 0) return;

//         uint256 timeElapsed = block.timestamp - pool.lastInterestDistribution;
//         uint256 interestAmount = (pool.totalDeposits *
//             INTEREST_RATE *
//             timeElapsed) / (10000 * SECONDS_IN_YEAR);

//         // Add interest to pool (in a real implementation, this would come from yield strategies)
//         pool.totalDeposits += interestAmount;
//         pool.lastInterestDistribution = block.timestamp;

//         emit InterestDistributed(riskLevel, interestAmount);
//     }

//     function getPoolBalance(uint8 riskLevel) external view returns (uint256) {
//         return pools[riskLevel].totalDeposits;
//     }

//     function getUserLiquidity(
//         address user,
//         uint8 riskLevel
//     )
//         external
//         view
//         returns (uint256 depositAmount, uint256 shares, uint256 currentValue)
//     {
//         LiquidityProvider memory lp = liquidityProviders[riskLevel][user];
//         uint256 currentValue_ = totalShares[riskLevel] > 0
//             ? (lp.shares * pools[riskLevel].totalDeposits) /
//                 totalShares[riskLevel]
//             : 0;

//         return (lp.depositAmount, lp.shares, currentValue_);
//     }

//     receive() external payable {}
// }
