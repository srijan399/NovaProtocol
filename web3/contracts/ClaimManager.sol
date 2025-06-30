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

struct Claim {
    uint256 id;
    uint256 policyId;
    address claimant;
    uint256 claimAmount;
    ClaimStatus status;
    uint256 submissionDate;
    bytes claimData;
    string evidenceUri;
}

interface IVerification {
    function verifyUserClaim(
        uint256 policyId,
        address claimant,
        uint256 claimAmount,
        bytes calldata claimData
    ) external returns (bool);
}

interface IYieldPool {
    function depositPremium(uint256 amount, uint8 riskLevel) external;

    function processClaim(
        uint256 amount,
        uint8 riskLevel,
        address recipient
    ) external;

    function getPoolBalance(uint8 riskLevel) external view returns (uint256);
}

contract ClaimManager {
    uint256 private _claimIdCounter;
    mapping(uint256 => Claim) public claims;
    mapping(uint256 => uint256[]) public policyClaims; // policyId => claimIds

    IPolicyManager public policyManager;
    IYieldPool public yieldPool;

    mapping(PolicyType => address) public verificationContracts;

    event ClaimSubmitted(
        uint256 indexed claimId,
        uint256 indexed policyId,
        address claimant
    );
    event ClaimApproved(uint256 indexed claimId, uint256 amount);
    event ClaimRejected(uint256 indexed claimId);
    event ClaimPaid(uint256 indexed claimId, uint256 amount);

    constructor(address _policyManager, address _yieldPool) {
        policyManager = IPolicyManager(_policyManager);
        yieldPool = IYieldPool(_yieldPool);
        _claimIdCounter = 1;
    }

    function submitClaim(
        uint256 policyId,
        uint256 claimAmount,
        bytes calldata claimData,
        string memory evidenceUri
    ) external returns (uint256) {
        (
            address owner,
            uint256 coverageAmount,
            ,
            ,
            uint256 expiryDate,
            bool isActive
        ) = policyManager.getPolicyDetails(policyId);

        require(msg.sender == owner, "Not policy owner");
        require(isActive, "Policy not active");
        require(block.timestamp < expiryDate, "Policy expired");
        require(claimAmount <= coverageAmount, "Claim exceeds coverage");

        uint256 claimId = _claimIdCounter++;

        claims[claimId] = Claim({
            id: claimId,
            policyId: policyId,
            claimant: msg.sender,
            claimAmount: claimAmount,
            status: ClaimStatus.PENDING,
            submissionDate: block.timestamp,
            claimData: claimData,
            evidenceUri: evidenceUri
        });

        policyClaims[policyId].push(claimId);

        emit ClaimSubmitted(claimId, policyId, msg.sender);

        // Automatically trigger verification
        _processClaim(claimId);

        return claimId;
    }

    function _processClaim(uint256 claimId) private {
        Claim storage claim = claims[claimId];

        // Get policy details to determine verification contract
        (, , , , , bool isActive) = policyManager.getPolicyDetails(
            claim.policyId
        );
        require(isActive, "Policy not active");

        // For simplicity, we'll use DeFi verification for all claims in this mock
        address verificationContract = verificationContracts[
            PolicyType.DEFI_PROTOCOL
        ];

        if (verificationContract != address(0)) {
            bool isVerified = IVerification(verificationContract)
                .verifyUserClaim(
                    claim.policyId,
                    claim.claimant,
                    claim.claimAmount,
                    claim.claimData
                );

            if (isVerified) {
                _approveClaim(claimId);
            } else {
                _rejectClaim(claimId);
            }
        }
    }

    function _approveClaim(uint256 claimId) private {
        claims[claimId].status = ClaimStatus.APPROVED;
        emit ClaimApproved(claimId, claims[claimId].claimAmount);

        // Trigger payout
        _payoutClaim(claimId);
    }

    function _rejectClaim(uint256 claimId) private {
        claims[claimId].status = ClaimStatus.REJECTED;
        emit ClaimRejected(claimId);
    }

    function _payoutClaim(uint256 claimId) private {
        Claim storage claim = claims[claimId];
        require(claim.status == ClaimStatus.APPROVED, "Claim not approved");

        (, , , uint8 riskLevel, , ) = policyManager.getPolicyDetails(
            claim.policyId
        );

        yieldPool.processClaim(claim.claimAmount, riskLevel, claim.claimant);
        claim.status = ClaimStatus.PAID;

        emit ClaimPaid(claimId, claim.claimAmount);
    }

    function getClaimDetails(
        uint256 claimId
    ) external view returns (Claim memory) {
        return claims[claimId];
    }

    function getPolicyClaims(
        uint256 policyId
    ) external view returns (uint256[] memory) {
        return policyClaims[policyId];
    }
}
