// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/Strings.sol";

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

contract PolicyManager {
    uint256 private _policyIdCounter;
    mapping(uint256 => Policy) public policies;
    mapping(address => uint256[]) public userPolicies;

    address public premiumForwarder;
    address public claimManager;

    event PolicyCreated(
        uint256 indexed policyId,
        address indexed owner,
        PolicyType policyType,
        uint256 coverageAmount,
        uint256 premiumAmount
    );

    event PolicyExpired(uint256 indexed policyId);

    modifier onlyAuthorized() {
        require(
            msg.sender == premiumForwarder || msg.sender == claimManager,
            "Unauthorized"
        );
        _;
    }

    constructor() {
        _policyIdCounter = 1;
    }

    function setPremiumForwarder(address _premiumForwarder) external {
        premiumForwarder = _premiumForwarder;
    }

    function setClaimManager(address _claimManager) external {
        claimManager = _claimManager;
    }

    function createPolicy(
        PolicyType _policyType,
        uint256 _coverageAmount,
        uint256 _premiumAmount,
        uint256 _duration,
        string memory _metadataUri,
        RiskLevel _riskLevel
    ) external returns (uint256) {
        uint256 policyId = _policyIdCounter++;

        policies[policyId] = Policy({
            id: policyId,
            owner: msg.sender,
            policyType: _policyType,
            coverageAmount: _coverageAmount,
            premiumAmount: _premiumAmount,
            riskLevel: _riskLevel,
            startDate: block.timestamp,
            expiryDate: block.timestamp + _duration,
            isActive: true,
            metadataUri: _metadataUri
        });

        userPolicies[msg.sender].push(policyId);

        emit PolicyCreated(
            policyId,
            msg.sender,
            _policyType,
            _coverageAmount,
            _premiumAmount
        );

        return policyId;
    }

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
        )
    {
        Policy memory policy = policies[policyId];
        return (
            policy.owner,
            policy.coverageAmount,
            policy.premiumAmount,
            uint8(policy.riskLevel),
            policy.expiryDate,
            policy.isActive
        );
    }

    function getAllPolicies() external view returns (Policy[] memory) {
        Policy[] memory allPolicies = new Policy[](_policyIdCounter - 1);
        for (uint256 i = 1; i < _policyIdCounter; i++) {
            allPolicies[i - 1] = policies[i];
        }
        return allPolicies;
    }

    function getUserPolicies(
        address user
    ) external view returns (uint256[] memory) {
        return userPolicies[user];
    }

    function expirePolicy(uint256 policyId) external onlyAuthorized {
        policies[policyId].isActive = false;
        emit PolicyExpired(policyId);
    }

    // JSON RETURN FUNCTIONS FOR FRONTEND

    function getPolicyDetailsJson(
        uint256 policyId
    ) external view returns (string memory) {
        Policy memory policy = policies[policyId];

        string memory json = string(
            abi.encodePacked(
                "{",
                '"id":',
                Strings.toString(policy.id),
                ",",
                '"owner":"',
                Strings.toHexString(policy.owner),
                '",',
                '"policyType":',
                Strings.toString(uint8(policy.policyType)),
                ",",
                '"policyTypeName":"',
                _getPolicyTypeName(policy.policyType),
                '",',
                '"coverageAmount":',
                Strings.toString(policy.coverageAmount),
                ",",
                '"premiumAmount":',
                Strings.toString(policy.premiumAmount),
                ",",
                '"riskLevel":',
                Strings.toString(uint8(policy.riskLevel)),
                ",",
                '"riskLevelName":"',
                _getRiskLevelName(policy.riskLevel),
                '",',
                '"startDate":',
                Strings.toString(policy.startDate),
                ",",
                '"expiryDate":',
                Strings.toString(policy.expiryDate),
                ",",
                '"isActive":',
                policy.isActive ? "true" : "false",
                ",",
                '"metadataUri":"',
                policy.metadataUri,
                '"',
                "}"
            )
        );

        return json;
    }

    function getAllPoliciesJson() external view returns (string memory) {
        string memory json = "[";
        uint256 activeCount = 0;

        for (uint256 i = 1; i < _policyIdCounter; i++) {
            Policy memory policy = policies[i];

            if (activeCount > 0) {
                json = string(abi.encodePacked(json, ","));
            }

            string memory policyJson = string(
                abi.encodePacked(
                    "{",
                    '"id":',
                    Strings.toString(policy.id),
                    ",",
                    '"owner":"',
                    Strings.toHexString(policy.owner),
                    '",',
                    '"policyType":',
                    Strings.toString(uint8(policy.policyType)),
                    ",",
                    '"policyTypeName":"',
                    _getPolicyTypeName(policy.policyType),
                    '",',
                    '"coverageAmount":',
                    Strings.toString(policy.coverageAmount),
                    ",",
                    '"premiumAmount":',
                    Strings.toString(policy.premiumAmount),
                    ",",
                    '"riskLevel":',
                    Strings.toString(uint8(policy.riskLevel)),
                    ",",
                    '"riskLevelName":"',
                    _getRiskLevelName(policy.riskLevel),
                    '",',
                    '"startDate":',
                    Strings.toString(policy.startDate),
                    ",",
                    '"expiryDate":',
                    Strings.toString(policy.expiryDate),
                    ",",
                    '"isActive":',
                    policy.isActive ? "true" : "false",
                    ",",
                    '"metadataUri":"',
                    policy.metadataUri,
                    '"',
                    "}"
                )
            );

            json = string(abi.encodePacked(json, policyJson));
            activeCount++;
        }

        json = string(abi.encodePacked(json, "]"));
        return json;
    }

    function getUserPoliciesJson(
        address user
    ) external view returns (string memory) {
        uint256[] memory userPolicyIds = userPolicies[user];
        string memory json = "[";
        uint256 activeCount = 0;

        for (uint256 i = 0; i < userPolicyIds.length; i++) {
            Policy memory policy = policies[userPolicyIds[i]];

            if (activeCount > 0) {
                json = string(abi.encodePacked(json, ","));
            }

            string memory policyJson = string(
                abi.encodePacked(
                    "{",
                    '"id":',
                    Strings.toString(policy.id),
                    ",",
                    '"owner":"',
                    Strings.toHexString(policy.owner),
                    '",',
                    '"policyType":',
                    Strings.toString(uint8(policy.policyType)),
                    ",",
                    '"policyTypeName":"',
                    _getPolicyTypeName(policy.policyType),
                    '",',
                    '"coverageAmount":',
                    Strings.toString(policy.coverageAmount),
                    ",",
                    '"premiumAmount":',
                    Strings.toString(policy.premiumAmount),
                    ",",
                    '"riskLevel":',
                    Strings.toString(uint8(policy.riskLevel)),
                    ",",
                    '"riskLevelName":"',
                    _getRiskLevelName(policy.riskLevel),
                    '",',
                    '"startDate":',
                    Strings.toString(policy.startDate),
                    ",",
                    '"expiryDate":',
                    Strings.toString(policy.expiryDate),
                    ",",
                    '"isActive":',
                    policy.isActive ? "true" : "false",
                    ",",
                    '"metadataUri":"',
                    policy.metadataUri,
                    '"',
                    "}"
                )
            );

            json = string(abi.encodePacked(json, policyJson));
            activeCount++;
        }

        json = string(abi.encodePacked(json, "]"));
        return json;
    }

    function getActivePoliciesJson(
        address user
    ) external view returns (string memory) {
        uint256[] memory userPolicyIds = userPolicies[user];
        string memory json = "[";
        uint256 activeCount = 0;

        for (uint256 i = 0; i < userPolicyIds.length; i++) {
            Policy memory policy = policies[userPolicyIds[i]];

            // Only include active policies that haven't expired
            if (policy.isActive && policy.expiryDate > block.timestamp) {
                if (activeCount > 0) {
                    json = string(abi.encodePacked(json, ","));
                }

                string memory policyJson = string(
                    abi.encodePacked(
                        "{",
                        '"id":',
                        Strings.toString(policy.id),
                        ",",
                        '"owner":"',
                        Strings.toHexString(policy.owner),
                        '",',
                        '"policyType":',
                        Strings.toString(uint8(policy.policyType)),
                        ",",
                        '"policyTypeName":"',
                        _getPolicyTypeName(policy.policyType),
                        '",',
                        '"coverageAmount":',
                        Strings.toString(policy.coverageAmount),
                        ",",
                        '"premiumAmount":',
                        Strings.toString(policy.premiumAmount),
                        ",",
                        '"riskLevel":',
                        Strings.toString(uint8(policy.riskLevel)),
                        ",",
                        '"riskLevelName":"',
                        _getRiskLevelName(policy.riskLevel),
                        '",',
                        '"startDate":',
                        Strings.toString(policy.startDate),
                        ",",
                        '"expiryDate":',
                        Strings.toString(policy.expiryDate),
                        ",",
                        '"isActive":',
                        policy.isActive ? "true" : "false",
                        ",",
                        '"metadataUri":"',
                        policy.metadataUri,
                        '"',
                        "}"
                    )
                );

                json = string(abi.encodePacked(json, policyJson));
                activeCount++;
            }
        }

        json = string(abi.encodePacked(json, "]"));
        return json;
    }

    // Helper functions for enum to string conversion
    function _getPolicyTypeName(
        PolicyType policyType
    ) internal pure returns (string memory) {
        if (policyType == PolicyType.DEFI_PROTOCOL) return "DEFI_PROTOCOL";
        if (policyType == PolicyType.BRIDGE_SECURITY) return "BRIDGE_SECURITY";
        if (policyType == PolicyType.SMART_CONTRACT) return "SMART_CONTRACT";
        if (policyType == PolicyType.WALLET_HACK) return "WALLET_HACK";
        return "UNKNOWN";
    }

    function _getRiskLevelName(
        RiskLevel riskLevel
    ) internal pure returns (string memory) {
        if (riskLevel == RiskLevel.LOW) return "LOW";
        if (riskLevel == RiskLevel.MEDIUM) return "MEDIUM";
        if (riskLevel == RiskLevel.HIGH) return "HIGH";
        return "UNKNOWN";
    }
}
