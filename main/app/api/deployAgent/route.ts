import { ethers } from "ethers";
import { NextResponse } from "next/server";
import {
    mainContractAbi,
    mainContractAddress,
    agentContractAbi,
    agentContractBytecode,
} from "@/app/abi";
import "dotenv/config";

const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const RPC_URL = process.env.RPC_URL!;

async function postHandler(req: Request, res: NextResponse) {
    try {
        const body = await req.json();
        const { userAddress, subscriptionRate } = body;
        console.log("Subscription Rate:", subscriptionRate);

        // Validate input parameters
        if (!userAddress || !ethers.isAddress(userAddress)) {
            return NextResponse.json(
                {
                    error: "Invalid user address provided",
                },
                { status: 400 }
            );
        }

        // Enhanced validation for subscription rate to handle decimals
        if (
            !subscriptionRate ||
            isNaN(Number(subscriptionRate)) ||
            Number(subscriptionRate) <= 0
        ) {
            return NextResponse.json(
                {
                    error: "Invalid subscription rate provided. Must be a positive number (can include decimals)",
                },
                { status: 400 }
            );
        }

        if (!PRIVATE_KEY || !RPC_URL) {
            console.error("Missing environment variables:", {
                PRIVATE_KEY: !!PRIVATE_KEY,
                RPC_URL: !!RPC_URL,
            });
            return NextResponse.json(
                {
                    error: "Server configuration error",
                },
                { status: 500 }
            );
        }

        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

        // Check deployer balance
        const balance = await provider.getBalance(wallet.address);
        if (balance === BigInt(0)) {
            throw new Error("Deployer wallet has no balance");
        }

        // Convert subscription rate to Wei - handles both integers and decimals
        let subscriptionRateWei: bigint;
        try {
            // Use parseEther to properly handle decimal ETH values
            subscriptionRateWei = ethers.parseEther(
                subscriptionRate.toString()
            );
            console.log(
                `Converted ${subscriptionRate} ETH to ${subscriptionRateWei.toString()} Wei`
            );
        } catch (parseError) {
            console.error("Error parsing subscription rate:", parseError);
            return NextResponse.json(
                {
                    error: "Invalid subscription rate format. Please provide a valid ETH amount (e.g., 0.1, 1.5, 2)",
                },
                { status: 400 }
            );
        }

        // Validate constructor parameters
        if (
            !ethers.isAddress(userAddress) ||
            !ethers.isAddress(mainContractAddress) ||
            subscriptionRateWei <= 0
        ) {
            throw new Error("Invalid constructor parameters");
        }

        const factory = new ethers.ContractFactory(
            agentContractAbi,
            agentContractBytecode,
            wallet
        );

        // Verify main contract exists
        const mainContractCode = await provider.getCode(mainContractAddress);
        if (mainContractCode === "0x") {
            throw new Error("Main contract not found at the specified address");
        }

        // Deploy contract with gas estimation
        let estimatedGas;
        try {
            const deployTx = await factory.getDeployTransaction(
                userAddress,
                mainContractAddress,
                subscriptionRateWei
            );
            estimatedGas = await provider.estimateGas(deployTx);
        } catch (gasError) {
            estimatedGas = BigInt(3000000); // Fallback gas limit
        }

        const contract = await factory.deploy(
            userAddress,
            mainContractAddress,
            subscriptionRateWei,
            {
                gasLimit: estimatedGas + BigInt(100000),
            }
        );

        await contract.waitForDeployment();
        const agentContractAddress = await contract.getAddress();

        // Handle potential address mismatch and check for deployment success
        const deploymentTx = await contract.deploymentTransaction();
        if (deploymentTx) {
            const receipt = await deploymentTx.wait();
            if (receipt?.status === 0) {
                throw new Error("Contract deployment transaction failed");
            }

            // If there's an address mismatch, use the receipt address
            if (
                receipt?.contractAddress &&
                receipt.contractAddress !== agentContractAddress
            ) {
                const receiptAddress = receipt.contractAddress;
                const receiptCode = await provider.getCode(receiptAddress);

                if (receiptCode !== "0x") {
                    // Use receipt address and verify it works
                    const agentContract = new ethers.Contract(
                        receiptAddress,
                        agentContractAbi,
                        provider
                    );
                    await agentContract.user();
                    await agentContract.mainContract();
                    await agentContract.subscriptionRate();

                    // Register with main contract
                    const mainContract = new ethers.Contract(
                        mainContractAddress,
                        mainContractAbi,
                        wallet
                    );
                    const tx = await mainContract.registerAgent(receiptAddress);
                    const regReceipt = await tx.wait();

                    return NextResponse.json(
                        {
                            message:
                                "Contract deployed and registered successfully",
                            agentAddress: receiptAddress,
                            transactionHash: tx.hash,
                            blockNumber: regReceipt.blockNumber,
                            subscriptionRateETH: subscriptionRate.toString(),
                            subscriptionRateWei: subscriptionRateWei.toString(),
                        },
                        { status: 200 }
                    );
                }
            }
        }

        // Verify contract was deployed successfully
        let deployedCode = await provider.getCode(agentContractAddress);

        // Handle network propagation delays
        if (deployedCode === "0x") {
            await new Promise((resolve) => setTimeout(resolve, 5000));
            deployedCode = await provider.getCode(agentContractAddress);

            if (deployedCode === "0x") {
                const freshProvider = new ethers.JsonRpcProvider(RPC_URL);
                deployedCode = await freshProvider.getCode(
                    agentContractAddress
                );

                if (deployedCode === "0x") {
                    throw new Error(
                        "Contract deployment failed - no code at deployed address"
                    );
                }
            }
        }

        // Verify deployed contract functions
        try {
            const agentContract = new ethers.Contract(
                agentContractAddress,
                agentContractAbi,
                provider
            );
            await agentContract.user();
            await agentContract.mainContract();
            await agentContract.subscriptionRate();
        } catch (error) {
            throw new Error(
                `Contract verification failed: ${
                    error instanceof Error ? error.message : String(error)
                }`
            );
        }

        // Register agent in main contract
        const mainContract = new ethers.Contract(
            mainContractAddress,
            mainContractAbi,
            wallet
        );
        const tx = await mainContract.registerAgent(agentContractAddress);
        const receipt = await tx.wait();

        return NextResponse.json(
            {
                message: "Contract deployed and registered successfully",
                agentAddress: agentContractAddress,
                transactionHash: tx.hash,
                blockNumber: receipt.blockNumber,
                subscriptionRateETH: subscriptionRate.toString(),
                subscriptionRateWei: subscriptionRateWei.toString(),
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deploying contract:", error);
        return NextResponse.json(
            {
                error: "Failed to deploy contract",
                details:
                    error instanceof Error ? error.message : "Unknown error",
                // Add more debugging info
                stack: error instanceof Error ? error.stack : undefined,
            },
            { status: 500 }
        );
    }
}

export { postHandler as POST };
