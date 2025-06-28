export const mainContractAbi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "agentContract",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "AgentRegistered",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "agentContract",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "AgentRemoved",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "agentsProcessed",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "totalCollected",
                "type": "uint256"
            }
        ],
        "name": "AutomationExecuted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "FundsWithdrawn",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "oldInterval",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "newInterval",
                "type": "uint256"
            }
        ],
        "name": "PaymentIntervalUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "agentContract",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "SubscriptionCollected",
        "type": "event"
    },
    {
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "agentContracts",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "agentIndex",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "automationEnabled",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "checkUpkeep",
        "outputs": [
            {
                "internalType": "bool",
                "name": "upkeepNeeded",
                "type": "bool"
            },
            {
                "internalType": "bytes",
                "name": "performData",
                "type": "bytes"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "agentContract",
                "type": "address"
            }
        ],
        "name": "collectFromAgent",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "agentContract",
                "type": "address"
            }
        ],
        "name": "getAgentInfo",
        "outputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "balance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "subscriptionRate",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "canPay",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "paymentDue",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllAgents",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getStats",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "totalAgents",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "contractBalance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_totalCollected",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_paymentInterval",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_lastAutomationRun",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "_automationEnabled",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "isRegisteredAgent",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "lastAutomationRun",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "paymentInterval",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "performUpkeep",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "agentContract",
                "type": "address"
            }
        ],
        "name": "registerAgent",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "agentContract",
                "type": "address"
            }
        ],
        "name": "removeAgent",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "toggleAutomation",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalCollected",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "agentContract",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "newRate",
                "type": "uint256"
            }
        ],
        "name": "updateAgentSubscriptionRate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "newInterval",
                "type": "uint256"
            }
        ],
        "name": "updatePaymentInterval",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "withdrawFunds",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "stateMutability": "payable",
        "type": "receive"
    }
];

export const mainContractAddress = "0x97f827C875298B463951d182968335f9E6900A84";

export const agentContractAbi = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_user",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_mainContract",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_subscriptionRate",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "EmergencyWithdrawal",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "funder",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "Funded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "oldContract",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newContract",
                "type": "address"
            }
        ],
        "name": "MainContractUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "Paused",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "SubscriptionPaid",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "oldRate",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "newRate",
                "type": "uint256"
            }
        ],
        "name": "SubscriptionRateUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "Unpaused",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "Withdrawn",
        "type": "event"
    },
    {
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "inputs": [],
        "name": "MIN_BALANCE_BUFFER",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "canPaySubscription",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "emergencyWithdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "fund",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getStats",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "balance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_totalFunded",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_totalWithdrawn",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_totalSubscriptionPaid",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_lastPaymentTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_subscriptionRate",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getWithdrawableBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "paymentInterval",
                "type": "uint256"
            }
        ],
        "name": "isPaymentDue",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "lastPaymentTime",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "mainContract",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "pause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "paused",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "paySubscription",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "subscriptionRate",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalFunded",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSubscriptionPaid",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalWithdrawn",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "unpause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_newMainContract",
                "type": "address"
            }
        ],
        "name": "updateMainContract",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_newRate",
                "type": "uint256"
            }
        ],
        "name": "updateSubscriptionRate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "user",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "stateMutability": "payable",
        "type": "receive"
    }
];

export const agentContractBytecode = `608060405234801561000f575f5ffd5b5060405161259d38038061259d833981810160405281019061003191906103db565b8260015f819055505f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036100a9575f6040517f1e4fbdf70000000000000000000000000000000000000000000000000000000081526004016100a0919061043a565b60405180910390fd5b6100b88161028760201b60201c565b505f600160146101000a81548160ff0219169083151502179055505f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610141576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610138906104ad565b60405180910390fd5b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036101af576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101a690610515565b60405180910390fd5b5f81116101f1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101e8906105a3565b60405180910390fd5b8260025f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508160035f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600481905550426005819055505050506105c1565b5f60015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690508160015f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b5f5ffd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6103778261034e565b9050919050565b6103878161036d565b8114610391575f5ffd5b50565b5f815190506103a28161037e565b92915050565b5f819050919050565b6103ba816103a8565b81146103c4575f5ffd5b50565b5f815190506103d5816103b1565b92915050565b5f5f5f606084860312156103f2576103f161034a565b5b5f6103ff86828701610394565b935050602061041086828701610394565b9250506040610421868287016103c7565b9150509250925092565b6104348161036d565b82525050565b5f60208201905061044d5f83018461042b565b92915050565b5f82825260208201905092915050565b7f496e76616c6964207573657220616464726573730000000000000000000000005f82015250565b5f610497601483610453565b91506104a282610463565b602082019050919050565b5f6020820190508181035f8301526104c48161048b565b9050919050565b7f496e76616c6964206d61696e20636f6e747261637420616464726573730000005f82015250565b5f6104ff601d83610453565b915061050a826104cb565b602082019050919050565b5f6020820190508181035f83015261052c816104f3565b9050919050565b7f537562736372697074696f6e2072617465206d757374206265206772656174655f8201527f72207468616e2030000000000000000000000000000000000000000000000000602082015250565b5f61058d602883610453565b915061059882610533565b604082019050919050565b5f6020820190508181035f8301526105ba81610581565b9050919050565b611fcf806105ce5f395ff3fe608060405260043610610169575f3560e01c8063ad044f49116100d0578063d270e7ab11610089578063dfe607f911610063578063dfe607f914610531578063e144c1e71461055b578063e816e87f14610583578063f2fde38b146105bf576101d8565b8063d270e7ab146104c9578063db2e21bc146104f3578063df8bbc5914610509576101d8565b8063ad044f49146103e8578063b60d428814610412578063b91037cd1461041c578063be788e7014610446578063c59d484714610470578063ced0c0c21461049f576101d8565b8063715018a611610122578063715018a6146103285780638456cb591461033e57806386f23e7a146103545780638da5cb5b1461037e57806397e18d6e146103a8578063980dd82d146103be576101d8565b806312065fe0146102425780632e1a7d4d1461026c5780633f4ba83a146102945780634b319713146102aa5780634f8632ba146102d45780635c975abb146102fe576101d8565b366101d8573460065f82825461017f9190611571565b925050819055503373ffffffffffffffffffffffffffffffffffffffff167fcd909ec339185c4598a4096e174308fbdf136d117f230960f873a2f2e81f63af34426040516101ce9291906115b3565b60405180910390a2005b3460065f8282546101e99190611571565b925050819055503373ffffffffffffffffffffffffffffffffffffffff167fcd909ec339185c4598a4096e174308fbdf136d117f230960f873a2f2e81f63af34426040516102389291906115b3565b60405180910390a2005b34801561024d575f5ffd5b506102566105e7565b60405161026391906115da565b60405180910390f35b348015610277575f5ffd5b50610292600480360381019061028d9190611621565b6105ee565b005b34801561029f575f5ffd5b506102a86108d7565b005b3480156102b5575f5ffd5b506102be6108e9565b6040516102cb91906115da565b60405180910390f35b3480156102df575f5ffd5b506102e86108ef565b6040516102f5919061168b565b60405180910390f35b348015610309575f5ffd5b50610312610914565b60405161031f91906116be565b60405180910390f35b348015610333575f5ffd5b5061033c61092a565b005b348015610349575f5ffd5b5061035261093d565b005b34801561035f575f5ffd5b5061036861094f565b60405161037591906115da565b60405180910390f35b348015610389575f5ffd5b50610392610955565b60405161039f919061168b565b60405180910390f35b3480156103b3575f5ffd5b506103bc61097d565b005b3480156103c9575f5ffd5b506103d2610b93565b6040516103df91906116be565b60405180910390f35b3480156103f3575f5ffd5b506103fc610b9f565b60405161040991906115da565b60405180910390f35b61041a610ba5565b005b348015610427575f5ffd5b50610430610c69565b60405161043d91906115da565b60405180910390f35b348015610451575f5ffd5b5061045a610c74565b60405161046791906115da565b60405180910390f35b34801561047b575f5ffd5b50610484610cb6565b604051610496969594939291906116d7565b60405180910390f35b3480156104aa575f5ffd5b506104b3610ce0565b6040516104c091906115da565b60405180910390f35b3480156104d4575f5ffd5b506104dd610ce6565b6040516104ea919061168b565b60405180910390f35b3480156104fe575f5ffd5b50610507610d0b565b005b348015610514575f5ffd5b5061052f600480360381019061052a9190611760565b610f46565b005b34801561053c575f5ffd5b5061054561107f565b60405161055291906115da565b60405180910390f35b348015610566575f5ffd5b50610581600480360381019061057c9190611621565b611085565b005b34801561058e575f5ffd5b506105a960048036038101906105a49190611621565b6111a0565b6040516105b691906116be565b60405180910390f35b3480156105ca575f5ffd5b506105e560048036038101906105e09190611760565b6111b9565b005b5f47905090565b60025f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461067d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610674906117e5565b60405180910390fd5b61068561123d565b61068d61128a565b5f81116106cf576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106c690611873565b60405180910390fd5b80471015610712576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610709906118db565b60405180910390fd5b5f814761071f91906118f9565b905066038d7ea4c680006004546107369190611571565b811015610778576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161076f906119c2565b60405180910390fd5b8160075f8282546107899190611571565b925050819055505f60025f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16836040516107d690611a0d565b5f6040518083038185875af1925050503d805f8114610810576040519150601f19603f3d011682016040523d82523d5f602084013e610815565b606091505b5050905080610859576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161085090611a6b565b60405180910390fd5b60025f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f92ccf450a286a957af52509bc1c9939d1a6a481783e142e41e2499f0bb66ebc684426040516108c29291906115b3565b60405180910390a250506108d46112d4565b50565b6108df6112dd565b6108e7611364565b565b60075481565b60025f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b5f600160149054906101000a900460ff16905090565b6109326112dd565b61093b5f6113c6565b565b6109456112dd565b61094d611489565b565b60085481565b5f60015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60035f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610a0c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a0390611af9565b60405180910390fd5b610a1461123d565b610a1c61128a565b600454471015610a61576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a5890611b87565b60405180910390fd5b60045460085f828254610a749190611571565b92505081905550426005819055505f60035f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16600454604051610aca90611a0d565b5f6040518083038185875af1925050503d805f8114610b04576040519150601f19603f3d011682016040523d82523d5f602084013e610b09565b606091505b5050905080610b4d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b4490611bef565b60405180910390fd5b7fe6645b93098f1292953af6d1ccd0f704fee55530419f28b5bf6017a1eb45a5d760045442604051610b809291906115b3565b60405180910390a150610b916112d4565b565b5f600454471015905090565b60065481565b610bad61123d565b610bb561128a565b5f3411610bf7576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610bee90611c7d565b60405180910390fd5b3460065f828254610c089190611571565b925050819055503373ffffffffffffffffffffffffffffffffffffffff167fcd909ec339185c4598a4096e174308fbdf136d117f230960f873a2f2e81f63af3442604051610c579291906115b3565b60405180910390a2610c676112d4565b565b66038d7ea4c6800081565b5f5f4790505f66038d7ea4c68000600454610c8f9190611571565b9050808211610ca2575f92505050610cb3565b8082610cae91906118f9565b925050505b90565b5f5f5f5f5f5f47600654600754600854600554600454955095509550955095509550909192939495565b60045481565b60035f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60025f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610d9a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d91906117e5565b60405180910390fd5b610da261123d565b5f4790505f8111610de8576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ddf90611ce5565b60405180910390fd5b8060075f828254610df99190611571565b925050819055505f60025f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1682604051610e4690611a0d565b5f6040518083038185875af1925050503d805f8114610e80576040519150601f19603f3d011682016040523d82523d5f602084013e610e85565b606091505b5050905080610ec9576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ec090611d4d565b60405180910390fd5b60025f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f56da9a5ae0bcf6e7c3fdd78a10550e7d0458de1c39bfb7f6e96a3e92dd344a688342604051610f329291906115b3565b60405180910390a25050610f446112d4565b565b610f4e6112dd565b5f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610fbc576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610fb390611db5565b60405180910390fd5b5f60035f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690508160035f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f3da164c7e18bde8b839b6f26436789b4603990fa33ad3dab28083ec095278a1e60405160405180910390a35050565b60055481565b60035f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614611114576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161110b90611af9565b60405180910390fd5b5f8111611156576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161114d90611e43565b60405180910390fd5b5f6004549050816004819055507f18ed5de05b261ae41835ed35d652b2cc2a19495d606fc2868048ce37e76f133d81836040516111949291906115b3565b60405180910390a15050565b5f816005546111af9190611571565b4210159050919050565b6111c16112dd565b5f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603611231575f6040517f1e4fbdf7000000000000000000000000000000000000000000000000000000008152600401611228919061168b565b60405180910390fd5b61123a816113c6565b50565b60025f5403611281576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161127890611eab565b60405180910390fd5b60025f81905550565b611292610914565b156112d2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016112c990611f13565b60405180910390fd5b565b60015f81905550565b6112e56114eb565b73ffffffffffffffffffffffffffffffffffffffff16611303610955565b73ffffffffffffffffffffffffffffffffffffffff1614611362576113266114eb565b6040517f118cdaa7000000000000000000000000000000000000000000000000000000008152600401611359919061168b565b60405180910390fd5b565b61136c6114f2565b5f600160146101000a81548160ff0219169083151502179055507f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa6113af6114eb565b6040516113bc919061168b565b60405180910390a1565b5f60015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690508160015f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b61149161128a565b60018060146101000a81548160ff0219169083151502179055507f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a2586114d46114eb565b6040516114e1919061168b565b60405180910390a1565b5f33905090565b6114fa610914565b611539576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161153090611f7b565b60405180910390fd5b565b5f819050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f61157b8261153b565b91506115868361153b565b925082820190508082111561159e5761159d611544565b5b92915050565b6115ad8161153b565b82525050565b5f6040820190506115c65f8301856115a4565b6115d360208301846115a4565b9392505050565b5f6020820190506115ed5f8301846115a4565b92915050565b5f5ffd5b6116008161153b565b811461160a575f5ffd5b50565b5f8135905061161b816115f7565b92915050565b5f60208284031215611636576116356115f3565b5b5f6116438482850161160d565b91505092915050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6116758261164c565b9050919050565b6116858161166b565b82525050565b5f60208201905061169e5f83018461167c565b92915050565b5f8115159050919050565b6116b8816116a4565b82525050565b5f6020820190506116d15f8301846116af565b92915050565b5f60c0820190506116ea5f8301896115a4565b6116f760208301886115a4565b61170460408301876115a4565b61171160608301866115a4565b61171e60808301856115a4565b61172b60a08301846115a4565b979650505050505050565b61173f8161166b565b8114611749575f5ffd5b50565b5f8135905061175a81611736565b92915050565b5f60208284031215611775576117746115f3565b5b5f6117828482850161174c565b91505092915050565b5f82825260208201905092915050565b7f4f6e6c7920757365722063616e2063616c6c20746869732066756e6374696f6e5f82015250565b5f6117cf60208361178b565b91506117da8261179b565b602082019050919050565b5f6020820190508181035f8301526117fc816117c3565b9050919050565b7f5769746864726177616c20616d6f756e74206d757374206265206772656174655f8201527f72207468616e2030000000000000000000000000000000000000000000000000602082015250565b5f61185d60288361178b565b915061186882611803565b604082019050919050565b5f6020820190508181035f83015261188a81611851565b9050919050565b7f496e73756666696369656e742062616c616e63650000000000000000000000005f82015250565b5f6118c560148361178b565b91506118d082611891565b602082019050919050565b5f6020820190508181035f8301526118f2816118b9565b9050919050565b5f6119038261153b565b915061190e8361153b565b925082820390508181111561192657611925611544565b5b92915050565b7f43616e6e6f742077697468647261773a20696e73756666696369656e742062615f8201527f6c616e636520666f72206e65787420737562736372697074696f6e207061796d60208201527f656e740000000000000000000000000000000000000000000000000000000000604082015250565b5f6119ac60438361178b565b91506119b78261192c565b606082019050919050565b5f6020820190508181035f8301526119d9816119a0565b9050919050565b5f81905092915050565b50565b5f6119f85f836119e0565b9150611a03826119ea565b5f82019050919050565b5f611a17826119ed565b9150819050919050565b7f5769746864726177616c206661696c65640000000000000000000000000000005f82015250565b5f611a5560118361178b565b9150611a6082611a21565b602082019050919050565b5f6020820190508181035f830152611a8281611a49565b9050919050565b7f4f6e6c79206d61696e20636f6e74726163742063616e2063616c6c20746869735f8201527f2066756e6374696f6e0000000000000000000000000000000000000000000000602082015250565b5f611ae360298361178b565b9150611aee82611a89565b604082019050919050565b5f6020820190508181035f830152611b1081611ad7565b9050919050565b7f496e73756666696369656e742062616c616e636520666f7220737562736372695f8201527f7074696f6e000000000000000000000000000000000000000000000000000000602082015250565b5f611b7160258361178b565b9150611b7c82611b17565b604082019050919050565b5f6020820190508181035f830152611b9e81611b65565b9050919050565b7f537562736372697074696f6e207061796d656e74206661696c656400000000005f82015250565b5f611bd9601b8361178b565b9150611be482611ba5565b602082019050919050565b5f6020820190508181035f830152611c0681611bcd565b9050919050565b7f46756e64696e6720616d6f756e74206d757374206265206772656174657220745f8201527f68616e2030000000000000000000000000000000000000000000000000000000602082015250565b5f611c6760258361178b565b9150611c7282611c0d565b604082019050919050565b5f6020820190508181035f830152611c9481611c5b565b9050919050565b7f4e6f2066756e647320746f2077697468647261770000000000000000000000005f82015250565b5f611ccf60148361178b565b9150611cda82611c9b565b602082019050919050565b5f6020820190508181035f830152611cfc81611cc3565b9050919050565b7f456d657267656e6379207769746864726177616c206661696c656400000000005f82015250565b5f611d37601b8361178b565b9150611d4282611d03565b602082019050919050565b5f6020820190508181035f830152611d6481611d2b565b9050919050565b7f496e76616c6964206d61696e20636f6e747261637420616464726573730000005f82015250565b5f611d9f601d8361178b565b9150611daa82611d6b565b602082019050919050565b5f6020820190508181035f830152611dcc81611d93565b9050919050565b7f537562736372697074696f6e2072617465206d757374206265206772656174655f8201527f72207468616e2030000000000000000000000000000000000000000000000000602082015250565b5f611e2d60288361178b565b9150611e3882611dd3565b604082019050919050565b5f6020820190508181035f830152611e5a81611e21565b9050919050565b7f5265656e7472616e637947756172643a207265656e7472616e742063616c6c005f82015250565b5f611e95601f8361178b565b9150611ea082611e61565b602082019050919050565b5f6020820190508181035f830152611ec281611e89565b9050919050565b7f5061757361626c653a20706175736564000000000000000000000000000000005f82015250565b5f611efd60108361178b565b9150611f0882611ec9565b602082019050919050565b5f6020820190508181035f830152611f2a81611ef1565b9050919050565b7f5061757361626c653a206e6f74207061757365640000000000000000000000005f82015250565b5f611f6560148361178b565b9150611f7082611f31565b602082019050919050565b5f6020820190508181035f830152611f9281611f59565b905091905056fea26469706673582212201f8c9aec7a1b3125dad2db3c13cb95554ed42802dc8cc739b0f72b32b654ab5364736f6c634300081e0033`;
