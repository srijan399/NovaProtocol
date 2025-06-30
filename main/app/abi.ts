export const agentContractAbi = [
    {
        inputs: [
            {
                internalType: "address",
                name: "_user",
                type: "address",
            },
            {
                internalType: "address",
                name: "_mainContract",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "_subscriptionRate",
                type: "uint256",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "user",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "timestamp",
                type: "uint256",
            },
        ],
        name: "EmergencyWithdrawal",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "funder",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "timestamp",
                type: "uint256",
            },
        ],
        name: "Funded",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "oldContract",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newContract",
                type: "address",
            },
        ],
        name: "MainContractUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "previousOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "account",
                type: "address",
            },
        ],
        name: "Paused",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "timestamp",
                type: "uint256",
            },
        ],
        name: "SubscriptionPaid",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "oldRate",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "newRate",
                type: "uint256",
            },
        ],
        name: "SubscriptionRateUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "account",
                type: "address",
            },
        ],
        name: "Unpaused",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "user",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "timestamp",
                type: "uint256",
            },
        ],
        name: "Withdrawn",
        type: "event",
    },
    {
        stateMutability: "payable",
        type: "fallback",
    },
    {
        inputs: [],
        name: "MIN_BALANCE_BUFFER",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "canPaySubscription",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "emergencyWithdraw",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "fund",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "getBalance",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getStats",
        outputs: [
            {
                internalType: "uint256",
                name: "balance",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "_totalFunded",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "_totalWithdrawn",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "_totalSubscriptionPaid",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "_lastPaymentTime",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "_subscriptionRate",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getWithdrawableBalance",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "paymentInterval",
                type: "uint256",
            },
        ],
        name: "isPaymentDue",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "lastPaymentTime",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "mainContract",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "pause",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "paused",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "paySubscription",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "subscriptionRate",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "totalFunded",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "totalSubscriptionPaid",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "totalWithdrawn",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "unpause",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_newMainContract",
                type: "address",
            },
        ],
        name: "updateMainContract",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_newRate",
                type: "uint256",
            },
        ],
        name: "updateSubscriptionRate",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "user",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
        ],
        name: "withdraw",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        stateMutability: "payable",
        type: "receive",
    },
];

export const agentContractBytecode = `0x608060405234801561001057600080fd5b506040516126e83803806126e883398181016040528101906100329190610391565b600160008190555061005661004b61022a60201b60201c565b61023260201b60201c565b6000600160146101000a81548160ff021916908315150217905550600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036100e0576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016100d790610441565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff160361014f576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610146906104ad565b60405180910390fd5b60008111610192576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101899061053f565b60405180910390fd5b82600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555081600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550806004819055504260058190555050505061055f565b600033905090565b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610328826102fd565b9050919050565b6103388161031d565b811461034357600080fd5b50565b6000815190506103558161032f565b92915050565b6000819050919050565b61036e8161035b565b811461037957600080fd5b50565b60008151905061038b81610365565b92915050565b6000806000606084860312156103aa576103a96102f8565b5b60006103b886828701610346565b93505060206103c986828701610346565b92505060406103da8682870161037c565b9150509250925092565b600082825260208201905092915050565b7f496e76616c696420757365722061646472657373000000000000000000000000600082015250565b600061042b6014836103e4565b9150610436826103f5565b602082019050919050565b6000602082019050818103600083015261045a8161041e565b9050919050565b7f496e76616c6964206d61696e20636f6e74726163742061646472657373000000600082015250565b6000610497601d836103e4565b91506104a282610461565b602082019050919050565b600060208201905081810360008301526104c68161048a565b9050919050565b7f537562736372697074696f6e2072617465206d7573742062652067726561746560008201527f72207468616e2030000000000000000000000000000000000000000000000000602082015250565b60006105296028836103e4565b9150610534826104cd565b604082019050919050565b600060208201905081810360008301526105588161051c565b9050919050565b61217a8061056e6000396000f3fe60806040526004361061016a5760003560e01c8063ad044f49116100d1578063d270e7ab1161008a578063dfe607f911610064578063dfe607f914610548578063e144c1e714610573578063e816e87f1461059c578063f2fde38b146105d9576101da565b8063d270e7ab146104dd578063db2e21bc14610508578063df8bbc591461051f576101da565b8063ad044f49146103f7578063b60d428814610422578063b91037cd1461042c578063be788e7014610457578063c59d484714610482578063ced0c0c2146104b2576101da565b8063715018a611610123578063715018a6146103315780638456cb591461034857806386f23e7a1461035f5780638da5cb5b1461038a57806397e18d6e146103b5578063980dd82d146103cc576101da565b806312065fe0146102455780632e1a7d4d146102705780633f4ba83a146102995780634b319713146102b05780634f8632ba146102db5780635c975abb14610306576101da565b366101da57346006600082825461018191906115c0565b925050819055503373ffffffffffffffffffffffffffffffffffffffff167fcd909ec339185c4598a4096e174308fbdf136d117f230960f873a2f2e81f63af34426040516101d0929190611603565b60405180910390a2005b34600660008282546101ec91906115c0565b925050819055503373ffffffffffffffffffffffffffffffffffffffff167fcd909ec339185c4598a4096e174308fbdf136d117f230960f873a2f2e81f63af344260405161023b929190611603565b60405180910390a2005b34801561025157600080fd5b5061025a610602565b604051610267919061162c565b60405180910390f35b34801561027c57600080fd5b5061029760048036038101906102929190611678565b61060a565b005b3480156102a557600080fd5b506102ae6108fd565b005b3480156102bc57600080fd5b506102c561090f565b6040516102d2919061162c565b60405180910390f35b3480156102e757600080fd5b506102f0610915565b6040516102fd91906116e6565b60405180910390f35b34801561031257600080fd5b5061031b61093b565b604051610328919061171c565b60405180910390f35b34801561033d57600080fd5b50610346610952565b005b34801561035457600080fd5b5061035d610966565b005b34801561036b57600080fd5b50610374610978565b604051610381919061162c565b60405180910390f35b34801561039657600080fd5b5061039f61097e565b6040516103ac91906116e6565b60405180910390f35b3480156103c157600080fd5b506103ca6109a8565b005b3480156103d857600080fd5b506103e1610bc5565b6040516103ee919061171c565b60405180910390f35b34801561040357600080fd5b5061040c610bd2565b604051610419919061162c565b60405180910390f35b61042a610bd8565b005b34801561043857600080fd5b50610441610c9e565b60405161044e919061162c565b60405180910390f35b34801561046357600080fd5b5061046c610ca9565b604051610479919061162c565b60405180910390f35b34801561048e57600080fd5b50610497610cee565b6040516104a996959493929190611737565b60405180910390f35b3480156104be57600080fd5b506104c7610d1b565b6040516104d4919061162c565b60405180910390f35b3480156104e957600080fd5b506104f2610d21565b6040516104ff91906116e6565b60405180910390f35b34801561051457600080fd5b5061051d610d47565b005b34801561052b57600080fd5b50610546600480360381019061054191906117c4565b610f8c565b005b34801561055457600080fd5b5061055d6110c9565b60405161056a919061162c565b60405180910390f35b34801561057f57600080fd5b5061059a60048036038101906105959190611678565b6110cf565b005b3480156105a857600080fd5b506105c360048036038101906105be9190611678565b6111ed565b6040516105d0919061171c565b60405180910390f35b3480156105e557600080fd5b5061060060048036038101906105fb91906117c4565b611207565b005b600047905090565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461069a576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106919061184e565b60405180910390fd5b6106a261128a565b6106aa6112d9565b600081116106ed576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106e4906118e0565b60405180910390fd5b80471015610730576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107279061194c565b60405180910390fd5b6000814761073e919061196c565b905066038d7ea4c6800060045461075591906115c0565b811015610797576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161078e90611a38565b60405180910390fd5b81600760008282546107a991906115c0565b925050819055506000600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16836040516107f890611a89565b60006040518083038185875af1925050503d8060008114610835576040519150601f19603f3d011682016040523d82523d6000602084013e61083a565b606091505b505090508061087e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161087590611aea565b60405180910390fd5b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f92ccf450a286a957af52509bc1c9939d1a6a481783e142e41e2499f0bb66ebc684426040516108e8929190611603565b60405180910390a250506108fa611323565b50565b61090561132d565b61090d6113ab565b565b60075481565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000600160149054906101000a900460ff16905090565b61095a61132d565b610964600061140e565b565b61096e61132d565b6109766114d4565b565b60085481565b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610a38576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a2f90611b7c565b60405180910390fd5b610a4061128a565b610a486112d9565b600454471015610a8d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a8490611c0e565b60405180910390fd5b60045460086000828254610aa191906115c0565b92505081905550426005819055506000600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16600454604051610af990611a89565b60006040518083038185875af1925050503d8060008114610b36576040519150601f19603f3d011682016040523d82523d6000602084013e610b3b565b606091505b5050905080610b7f576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b7690611c7a565b60405180910390fd5b7fe6645b93098f1292953af6d1ccd0f704fee55530419f28b5bf6017a1eb45a5d760045442604051610bb2929190611603565b60405180910390a150610bc3611323565b565b6000600454471015905090565b60065481565b610be061128a565b610be86112d9565b60003411610c2b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c2290611d0c565b60405180910390fd5b3460066000828254610c3d91906115c0565b925050819055503373ffffffffffffffffffffffffffffffffffffffff167fcd909ec339185c4598a4096e174308fbdf136d117f230960f873a2f2e81f63af3442604051610c8c929190611603565b60405180910390a2610c9c611323565b565b66038d7ea4c6800081565b600080479050600066038d7ea4c68000600454610cc691906115c0565b9050808211610cda57600092505050610ceb565b8082610ce6919061196c565b925050505b90565b60008060008060008047600654600754600854600554600454955095509550955095509550909192939495565b60045481565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610dd7576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610dce9061184e565b60405180910390fd5b610ddf61128a565b600047905060008111610e27576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610e1e90611d78565b60405180910390fd5b8060076000828254610e3991906115c0565b925050819055506000600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1682604051610e8890611a89565b60006040518083038185875af1925050503d8060008114610ec5576040519150601f19603f3d011682016040523d82523d6000602084013e610eca565b606091505b5050905080610f0e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f0590611de4565b60405180910390fd5b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f56da9a5ae0bcf6e7c3fdd78a10550e7d0458de1c39bfb7f6e96a3e92dd344a688342604051610f78929190611603565b60405180910390a25050610f8a611323565b565b610f9461132d565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603611003576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ffa90611e50565b60405180910390fd5b6000600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f3da164c7e18bde8b839b6f26436789b4603990fa33ad3dab28083ec095278a1e60405160405180910390a35050565b60055481565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461115f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161115690611b7c565b60405180910390fd5b600081116111a2576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161119990611ee2565b60405180910390fd5b60006004549050816004819055507f18ed5de05b261ae41835ed35d652b2cc2a19495d606fc2868048ce37e76f133d81836040516111e1929190611603565b60405180910390a15050565b6000816005546111fd91906115c0565b4210159050919050565b61120f61132d565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff160361127e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161127590611f74565b60405180910390fd5b6112878161140e565b50565b6002600054036112cf576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016112c690611fe0565b60405180910390fd5b6002600081905550565b6112e161093b565b15611321576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016113189061204c565b60405180910390fd5b565b6001600081905550565b611335611536565b73ffffffffffffffffffffffffffffffffffffffff1661135361097e565b73ffffffffffffffffffffffffffffffffffffffff16146113a9576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016113a0906120b8565b60405180910390fd5b565b6113b361153e565b6000600160146101000a81548160ff0219169083151502179055507f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa6113f7611536565b60405161140491906116e6565b60405180910390a1565b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b6114dc6112d9565b60018060146101000a81548160ff0219169083151502179055507f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a25861151f611536565b60405161152c91906116e6565b60405180910390a1565b600033905090565b61154661093b565b611585576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161157c90612124565b60405180910390fd5b565b6000819050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006115cb82611587565b91506115d683611587565b92508282019050808211156115ee576115ed611591565b5b92915050565b6115fd81611587565b82525050565b600060408201905061161860008301856115f4565b61162560208301846115f4565b9392505050565b600060208201905061164160008301846115f4565b92915050565b600080fd5b61165581611587565b811461166057600080fd5b50565b6000813590506116728161164c565b92915050565b60006020828403121561168e5761168d611647565b5b600061169c84828501611663565b91505092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006116d0826116a5565b9050919050565b6116e0816116c5565b82525050565b60006020820190506116fb60008301846116d7565b92915050565b60008115159050919050565b61171681611701565b82525050565b6000602082019050611731600083018461170d565b92915050565b600060c08201905061174c60008301896115f4565b61175960208301886115f4565b61176660408301876115f4565b61177360608301866115f4565b61178060808301856115f4565b61178d60a08301846115f4565b979650505050505050565b6117a1816116c5565b81146117ac57600080fd5b50565b6000813590506117be81611798565b92915050565b6000602082840312156117da576117d9611647565b5b60006117e8848285016117af565b91505092915050565b600082825260208201905092915050565b7f4f6e6c7920757365722063616e2063616c6c20746869732066756e6374696f6e600082015250565b60006118386020836117f1565b915061184382611802565b602082019050919050565b600060208201905081810360008301526118678161182b565b9050919050565b7f5769746864726177616c20616d6f756e74206d7573742062652067726561746560008201527f72207468616e2030000000000000000000000000000000000000000000000000602082015250565b60006118ca6028836117f1565b91506118d58261186e565b604082019050919050565b600060208201905081810360008301526118f9816118bd565b9050919050565b7f496e73756666696369656e742062616c616e6365000000000000000000000000600082015250565b60006119366014836117f1565b915061194182611900565b602082019050919050565b6000602082019050818103600083015261196581611929565b9050919050565b600061197782611587565b915061198283611587565b925082820390508181111561199a57611999611591565b5b92915050565b7f43616e6e6f742077697468647261773a20696e73756666696369656e7420626160008201527f6c616e636520666f72206e65787420737562736372697074696f6e207061796d60208201527f656e740000000000000000000000000000000000000000000000000000000000604082015250565b6000611a226043836117f1565b9150611a2d826119a0565b606082019050919050565b60006020820190508181036000830152611a5181611a15565b9050919050565b600081905092915050565b50565b6000611a73600083611a58565b9150611a7e82611a63565b600082019050919050565b6000611a9482611a66565b9150819050919050565b7f5769746864726177616c206661696c6564000000000000000000000000000000600082015250565b6000611ad46011836117f1565b9150611adf82611a9e565b602082019050919050565b60006020820190508181036000830152611b0381611ac7565b9050919050565b7f4f6e6c79206d61696e20636f6e74726163742063616e2063616c6c207468697360008201527f2066756e6374696f6e0000000000000000000000000000000000000000000000602082015250565b6000611b666029836117f1565b9150611b7182611b0a565b604082019050919050565b60006020820190508181036000830152611b9581611b59565b9050919050565b7f496e73756666696369656e742062616c616e636520666f72207375627363726960008201527f7074696f6e000000000000000000000000000000000000000000000000000000602082015250565b6000611bf86025836117f1565b9150611c0382611b9c565b604082019050919050565b60006020820190508181036000830152611c2781611beb565b9050919050565b7f537562736372697074696f6e207061796d656e74206661696c65640000000000600082015250565b6000611c64601b836117f1565b9150611c6f82611c2e565b602082019050919050565b60006020820190508181036000830152611c9381611c57565b9050919050565b7f46756e64696e6720616d6f756e74206d7573742062652067726561746572207460008201527f68616e2030000000000000000000000000000000000000000000000000000000602082015250565b6000611cf66025836117f1565b9150611d0182611c9a565b604082019050919050565b60006020820190508181036000830152611d2581611ce9565b9050919050565b7f4e6f2066756e647320746f207769746864726177000000000000000000000000600082015250565b6000611d626014836117f1565b9150611d6d82611d2c565b602082019050919050565b60006020820190508181036000830152611d9181611d55565b9050919050565b7f456d657267656e6379207769746864726177616c206661696c65640000000000600082015250565b6000611dce601b836117f1565b9150611dd982611d98565b602082019050919050565b60006020820190508181036000830152611dfd81611dc1565b9050919050565b7f496e76616c6964206d61696e20636f6e74726163742061646472657373000000600082015250565b6000611e3a601d836117f1565b9150611e4582611e04565b602082019050919050565b60006020820190508181036000830152611e6981611e2d565b9050919050565b7f537562736372697074696f6e2072617465206d7573742062652067726561746560008201527f72207468616e2030000000000000000000000000000000000000000000000000602082015250565b6000611ecc6028836117f1565b9150611ed782611e70565b604082019050919050565b60006020820190508181036000830152611efb81611ebf565b9050919050565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b6000611f5e6026836117f1565b9150611f6982611f02565b604082019050919050565b60006020820190508181036000830152611f8d81611f51565b9050919050565b7f5265656e7472616e637947756172643a207265656e7472616e742063616c6c00600082015250565b6000611fca601f836117f1565b9150611fd582611f94565b602082019050919050565b60006020820190508181036000830152611ff981611fbd565b9050919050565b7f5061757361626c653a2070617573656400000000000000000000000000000000600082015250565b60006120366010836117f1565b915061204182612000565b602082019050919050565b6000602082019050818103600083015261206581612029565b9050919050565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b60006120a26020836117f1565b91506120ad8261206c565b602082019050919050565b600060208201905081810360008301526120d181612095565b9050919050565b7f5061757361626c653a206e6f7420706175736564000000000000000000000000600082015250565b600061210e6014836117f1565b9150612119826120d8565b602082019050919050565b6000602082019050818103600083015261213d81612101565b905091905056fea2646970667358221220633f8d435a74d4af99284aa7c55348d28ddbdfa440de28e8514fdac5d8be266464736f6c634300081c0033`;

export const policyManagerAbi = [
    {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "uint256",
                name: "policyId",
                type: "uint256",
            },
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: false,
                internalType: "enum PolicyType",
                name: "policyType",
                type: "uint8",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "coverageAmount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "premiumAmount",
                type: "uint256",
            },
        ],
        name: "PolicyCreated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "uint256",
                name: "policyId",
                type: "uint256",
            },
        ],
        name: "PolicyExpired",
        type: "event",
    },
    {
        inputs: [],
        name: "claimManager",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "enum PolicyType",
                name: "_policyType",
                type: "uint8",
            },
            {
                internalType: "uint256",
                name: "_coverageAmount",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "_premiumAmount",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "_duration",
                type: "uint256",
            },
            {
                internalType: "string",
                name: "_metadataUri",
                type: "string",
            },
            {
                internalType: "enum RiskLevel",
                name: "_riskLevel",
                type: "uint8",
            },
        ],
        name: "createPolicy",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "policyId",
                type: "uint256",
            },
        ],
        name: "expirePolicy",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "user",
                type: "address",
            },
        ],
        name: "getActivePoliciesJson",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getAllPolicies",
        outputs: [
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "id",
                        type: "uint256",
                    },
                    {
                        internalType: "address",
                        name: "owner",
                        type: "address",
                    },
                    {
                        internalType: "enum PolicyType",
                        name: "policyType",
                        type: "uint8",
                    },
                    {
                        internalType: "uint256",
                        name: "coverageAmount",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "premiumAmount",
                        type: "uint256",
                    },
                    {
                        internalType: "enum RiskLevel",
                        name: "riskLevel",
                        type: "uint8",
                    },
                    {
                        internalType: "uint256",
                        name: "startDate",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "expiryDate",
                        type: "uint256",
                    },
                    {
                        internalType: "bool",
                        name: "isActive",
                        type: "bool",
                    },
                    {
                        internalType: "string",
                        name: "metadataUri",
                        type: "string",
                    },
                ],
                internalType: "struct Policy[]",
                name: "",
                type: "tuple[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getAllPoliciesJson",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "policyId",
                type: "uint256",
            },
        ],
        name: "getPolicyDetails",
        outputs: [
            {
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "coverageAmount",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "premiumAmount",
                type: "uint256",
            },
            {
                internalType: "uint8",
                name: "riskLevel",
                type: "uint8",
            },
            {
                internalType: "uint256",
                name: "expiryDate",
                type: "uint256",
            },
            {
                internalType: "bool",
                name: "isActive",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "policyId",
                type: "uint256",
            },
        ],
        name: "getPolicyDetailsJson",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "user",
                type: "address",
            },
        ],
        name: "getUserPolicies",
        outputs: [
            {
                internalType: "uint256[]",
                name: "",
                type: "uint256[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "user",
                type: "address",
            },
        ],
        name: "getUserPoliciesJson",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        name: "policies",
        outputs: [
            {
                internalType: "uint256",
                name: "id",
                type: "uint256",
            },
            {
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                internalType: "enum PolicyType",
                name: "policyType",
                type: "uint8",
            },
            {
                internalType: "uint256",
                name: "coverageAmount",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "premiumAmount",
                type: "uint256",
            },
            {
                internalType: "enum RiskLevel",
                name: "riskLevel",
                type: "uint8",
            },
            {
                internalType: "uint256",
                name: "startDate",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "expiryDate",
                type: "uint256",
            },
            {
                internalType: "bool",
                name: "isActive",
                type: "bool",
            },
            {
                internalType: "string",
                name: "metadataUri",
                type: "string",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "premiumForwarder",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_claimManager",
                type: "address",
            },
        ],
        name: "setClaimManager",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_premiumForwarder",
                type: "address",
            },
        ],
        name: "setPremiumForwarder",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        name: "userPolicies",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
];

export const policyManagerAddress =
    "0x39720DB637934546aD9084525044C3050D0710c5";

export const premiumForwarderAbi = [
    {
        inputs: [
            {
                internalType: "address",
                name: "_policyManager",
                type: "address",
            },
            {
                internalType: "address",
                name: "_yieldPool",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "agentsProcessed",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "totalCollected",
                type: "uint256",
            },
        ],
        name: "AgentAutomationExecuted",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "agentContract",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "funder",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "timestamp",
                type: "uint256",
            },
        ],
        name: "AgentFunded",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "oldInterval",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "newInterval",
                type: "uint256",
            },
        ],
        name: "AgentPaymentIntervalUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "agentContract",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "user",
                type: "address",
            },
        ],
        name: "AgentRegistered",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "agentContract",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "user",
                type: "address",
            },
        ],
        name: "AgentRemoved",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "agentContract",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "timestamp",
                type: "uint256",
            },
        ],
        name: "AgentSubscriptionCollected",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "uint256",
                name: "policyId",
                type: "uint256",
            },
        ],
        name: "AutoPayDisabled",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "uint256",
                name: "policyId",
                type: "uint256",
            },
        ],
        name: "AutoPayEnabled",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "policiesProcessed",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "agentsProcessed",
                type: "uint256",
            },
        ],
        name: "AutomationExecuted",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
        ],
        name: "FundsWithdrawn",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "uint256",
                name: "policyId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint8",
                name: "riskLevel",
                type: "uint8",
            },
        ],
        name: "PremiumPaid",
        type: "event",
    },
    {
        inputs: [],
        name: "agentAutomationEnabled",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        name: "agentContracts",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        name: "agentIndex",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "agentPaymentInterval",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        name: "autopayEnabled",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes",
                name: "",
                type: "bytes",
            },
        ],
        name: "checkUpkeep",
        outputs: [
            {
                internalType: "bool",
                name: "upkeepNeeded",
                type: "bool",
            },
            {
                internalType: "bytes",
                name: "performData",
                type: "bytes",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "agentContract",
                type: "address",
            },
        ],
        name: "collectFromAgent",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "policyId",
                type: "uint256",
            },
        ],
        name: "disableAutoPay",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "policyId",
                type: "uint256",
            },
        ],
        name: "enableAutoPay",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "agentContract",
                type: "address",
            },
        ],
        name: "fundAgent",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "agentContract",
                type: "address",
            },
        ],
        name: "getAgentInfo",
        outputs: [
            {
                internalType: "address",
                name: "user",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "balance",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "subscriptionRate",
                type: "uint256",
            },
            {
                internalType: "bool",
                name: "canPay",
                type: "bool",
            },
            {
                internalType: "bool",
                name: "paymentDue",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getAllAgents",
        outputs: [
            {
                internalType: "address[]",
                name: "",
                type: "address[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getStats",
        outputs: [
            {
                internalType: "uint256",
                name: "totalAgents",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "contractBalance",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "_totalAgentCollected",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "_agentPaymentInterval",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "_lastAgentAutomationRun",
                type: "uint256",
            },
            {
                internalType: "bool",
                name: "_policyAutomationEnabled",
                type: "bool",
            },
            {
                internalType: "bool",
                name: "_agentAutomationEnabled",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        name: "isRegisteredAgent",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "lastAgentAutomationRun",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        name: "lastPremiumPayment",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "policyId",
                type: "uint256",
            },
        ],
        name: "manualPremiumPayment",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "performAgentUpkeep",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes",
                name: "performData",
                type: "bytes",
            },
        ],
        name: "performUpkeep",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "policyAutomationEnabled",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "policyManager",
        outputs: [
            {
                internalType: "contract IPolicyManager",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "agentContract",
                type: "address",
            },
        ],
        name: "registerAgent",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "agentContract",
                type: "address",
            },
        ],
        name: "removeAgent",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "toggleAgentAutomation",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "togglePolicyAutomation",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "totalAgentCollected",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "newInterval",
                type: "uint256",
            },
        ],
        name: "updateAgentPaymentInterval",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "agentContract",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "newRate",
                type: "uint256",
            },
        ],
        name: "updateAgentSubscriptionRate",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "yieldPool",
        outputs: [
            {
                internalType: "contract IYieldPool",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        stateMutability: "payable",
        type: "receive",
    },
];

export const premiumForwarderAddress =
    "0xf6AC4648782C3351268D02DC7036eCedeA697c14";

export const yieldPoolAbi = [
    {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint8",
                name: "riskLevel",
                type: "uint8",
            },
            {
                indexed: false,
                internalType: "address",
                name: "recipient",
                type: "address",
            },
        ],
        name: "ClaimPayout",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint8",
                name: "riskLevel",
                type: "uint8",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "totalInterest",
                type: "uint256",
            },
        ],
        name: "InterestDistributed",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "provider",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint8",
                name: "riskLevel",
                type: "uint8",
            },
        ],
        name: "LiquidityDeposited",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "provider",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint8",
                name: "riskLevel",
                type: "uint8",
            },
        ],
        name: "LiquidityWithdrawn",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint8",
                name: "riskLevel",
                type: "uint8",
            },
        ],
        name: "PremiumDeposited",
        type: "event",
    },
    {
        inputs: [
            {
                internalType: "bytes",
                name: "",
                type: "bytes",
            },
        ],
        name: "checkUpkeep",
        outputs: [
            {
                internalType: "bool",
                name: "upkeepNeeded",
                type: "bool",
            },
            {
                internalType: "bytes",
                name: "performData",
                type: "bytes",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "claimManager",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint8",
                name: "riskLevel",
                type: "uint8",
            },
        ],
        name: "depositLiquidity",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
            {
                internalType: "uint8",
                name: "riskLevel",
                type: "uint8",
            },
        ],
        name: "depositPremium",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint8",
                name: "riskLevel",
                type: "uint8",
            },
        ],
        name: "getPoolBalance",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "user",
                type: "address",
            },
            {
                internalType: "uint8",
                name: "riskLevel",
                type: "uint8",
            },
        ],
        name: "getUserLiquidity",
        outputs: [
            {
                internalType: "uint256",
                name: "depositAmount",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "shares",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "currentValue",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint8",
                name: "",
                type: "uint8",
            },
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        name: "liquidityProviders",
        outputs: [
            {
                internalType: "uint256",
                name: "depositAmount",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "lastRewardClaim",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "shares",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes",
                name: "performData",
                type: "bytes",
            },
        ],
        name: "performUpkeep",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint8",
                name: "",
                type: "uint8",
            },
        ],
        name: "pools",
        outputs: [
            {
                internalType: "uint256",
                name: "totalDeposits",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "totalPremiums",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "totalClaims",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "lastInterestDistribution",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "premiumForwarder",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
            {
                internalType: "uint8",
                name: "riskLevel",
                type: "uint8",
            },
            {
                internalType: "address",
                name: "recipient",
                type: "address",
            },
        ],
        name: "processClaim",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_claimManager",
                type: "address",
            },
        ],
        name: "setClaimManager",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_premiumForwarder",
                type: "address",
            },
        ],
        name: "setPremiumForwarder",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint8",
                name: "",
                type: "uint8",
            },
        ],
        name: "totalShares",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint8",
                name: "riskLevel",
                type: "uint8",
            },
            {
                internalType: "uint256",
                name: "shares",
                type: "uint256",
            },
        ],
        name: "withdrawLiquidity",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        stateMutability: "payable",
        type: "receive",
    },
];

export const yieldPoolAddress = "0x9c994b9dD1411c038d00C693714988ee6C843Fa1";

export const rugPullAbi = [
    {
        inputs: [],
        name: "acceptOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [],
        name: "EmptySource",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "requestId",
                type: "bytes32",
            },
            {
                internalType: "bytes",
                name: "response",
                type: "bytes",
            },
            {
                internalType: "bytes",
                name: "err",
                type: "bytes",
            },
        ],
        name: "handleOracleFulfillment",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "NoInlineSecrets",
        type: "error",
    },
    {
        inputs: [],
        name: "OnlyRouterCanFulfill",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "requestId",
                type: "bytes32",
            },
        ],
        name: "UnexpectedRequestID",
        type: "error",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "from",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "to",
                type: "address",
            },
        ],
        name: "OwnershipTransferRequested",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "from",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "to",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "bytes32",
                name: "id",
                type: "bytes32",
            },
        ],
        name: "RequestFulfilled",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "bytes32",
                name: "id",
                type: "bytes32",
            },
        ],
        name: "RequestSent",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "bytes32",
                name: "requestId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "bool",
                name: "rugPull",
                type: "bool",
            },
            {
                indexed: false,
                internalType: "bytes",
                name: "response",
                type: "bytes",
            },
            {
                indexed: false,
                internalType: "bytes",
                name: "err",
                type: "bytes",
            },
        ],
        name: "RugPullCheckResponse",
        type: "event",
    },
    {
        inputs: [
            {
                internalType: "uint64",
                name: "subscriptionId",
                type: "uint64",
            },
        ],
        name: "sendRugPullCheckRequest",
        outputs: [
            {
                internalType: "bytes32",
                name: "requestId",
                type: "bytes32",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "to",
                type: "address",
            },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "isRugPull",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "s_lastError",
        outputs: [
            {
                internalType: "bytes",
                name: "",
                type: "bytes",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "s_lastRequestId",
        outputs: [
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "s_lastResponse",
        outputs: [
            {
                internalType: "bytes",
                name: "",
                type: "bytes",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
];

export const rugPullAddress = "0xbcD0a7843e6510EBD445c83d273ae0745E72c7f6";
