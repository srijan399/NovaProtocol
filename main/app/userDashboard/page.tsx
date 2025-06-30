"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
    Shield,
    DollarSign,
    Bot,
    FileText,
    Menu,
    X,
    Zap,
    TrendingUp,
    Calendar,
    Activity,
} from "lucide-react";
import { useGetUserPolicies } from "@/utils/PolicyManagement";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import usePremiumForwarder, {
    useAutopayStatus,
} from "@/utils/PremiumForwarder";
import {
    rugPullAbi,
    rugPullAddress,
    yieldPoolAddress,
    yieldPoolAbi,
    premiumForwarderAbi,
    premiumForwarderAddress,
} from "../abi";
import { parseEther } from "viem";

interface PolicyDataType {
    id: number;
    address: string;
    policyType: number;
    coverageAmount: number;
    premiumAmount: number;
    riskLevel: number;
    startDate: number;
    expiryDate: number;
    isActive: boolean;
    metadataUri: string;
}

export default function Dashboard() {
    const { address } = useAccount();
    const [userPolicies, setUserPolicies] = useState<PolicyDataType[]>([]);
    const riskLevelNames = ["Low", "Medium", "High"];
    const policyType = [
        "Rug Pull",
        "Bridge Security",
        "DeFi Protocol",
        "Wallet Hack",
    ];
    const [open, setOpen] = useState(false);
    const [currentPolicy, setCurrentPolicy] = useState<PolicyDataType | null>(
        null
    );
    const [autopayEnabled, setAutopayEnabled] = useState(false);

    // Claim-related state variables
    const [claimStatus, setClaimStatus] = useState<{
        [key: number]: {
            isSubmitted: boolean;
            timeRemaining: number;
            isTimerComplete: boolean;
        };
    }>({});

    const { enableAutopay, disableAutopay, manualPremiumPayment } =
        usePremiumForwarder();

    // Using wagmi's useWriteContract hook to interact with the smart contract
    const { writeContractAsync, error, isError, isPending, isSuccess } =
        useWriteContract();

    // Using wagmi's useReadContract hook to read data from the smart contract
    const { data: claimData, isLoading: isClaimLoading } = useReadContract({
        address: rugPullAddress,
        abi: rugPullAbi,
        functionName: "isRugPull",
        args: [],
    });

    const { refetch: refetchUserPolicies } = useGetUserPolicies(
        address as `0x${string}`
    );

    const { data: autopayStatus, refetch: refetchAutopayStatus } =
        useAutopayStatus(currentPolicy?.id as number);

    useEffect(() => {
        console.log("Setting up refetch interval");

        const interval = setInterval(() => {
            refetchAutopayStatus()
                .then((result: any) => {
                    console.log("Refetched autopay status:", result.data);
                    // setAutopayEnabled(result.data);
                })
                .catch((error: any) => {
                    console.error("Error during refetch: ", error);
                });
        }, 10000);
        return () => {
            console.log("Clearing refetch interval");
            clearInterval(interval);
        };
    }, [refetchUserPolicies]);

    useEffect(() => {
        console.log("Setting up refetch interval");

        const interval = setInterval(() => {
            refetchUserPolicies()
                .then((result: any) => {
                    console.log("Refetched user policies:", result);
                    const res = JSON.parse(result.data) as PolicyDataType[];

                    res.forEach((policy) => {
                        // Convert coverageAmount and premiumAmount to numbers
                        policy.coverageAmount =
                            Number(policy.coverageAmount) / 10 ** 18;
                        policy.premiumAmount =
                            Number(policy.premiumAmount) / 10 ** 18;

                        // convert start time to milliseconds
                        policy.startDate = Number(policy.startDate) * 1000;
                        // convert end time to milliseconds
                        policy.expiryDate = Number(policy.expiryDate) * 1000;
                    });

                    console.log("Parsed:", res);
                    setUserPolicies(res);
                })
                .catch((error: any) => {
                    console.error("Error during refetch: ", error);
                });
        }, 2000);
        return () => {
            console.log("Clearing refetch interval");
            clearInterval(interval);
        };
    }, [refetchUserPolicies]);

    // Timer effect for claims
    useEffect(() => {
        const intervals: { [key: number]: NodeJS.Timeout } = {};

        Object.keys(claimStatus).forEach((policyIdStr) => {
            const policyId = parseInt(policyIdStr);
            const status = claimStatus[policyId];

            if (status?.isSubmitted && status.timeRemaining > 0) {
                intervals[policyId] = setInterval(() => {
                    setClaimStatus((prev) => ({
                        ...prev,
                        [policyId]: {
                            ...prev[policyId],
                            timeRemaining:
                                prev[policyId].timeRemaining <= 1
                                    ? 0
                                    : prev[policyId].timeRemaining - 1,
                            isTimerComplete: prev[policyId].timeRemaining <= 1,
                        },
                    }));
                }, 1000);
            }
        });

        return () => {
            Object.values(intervals).forEach((interval) =>
                clearInterval(interval)
            );
        };
    }, [claimStatus]);

    const getRiskLevelColor = (level: number) => {
        if (level === 0) {
            return "bg-green-500/20 text-green-400 border-green-500/30";
        }
        if (level === 1) {
            return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
        }
        if (level === 2) {
            return "bg-red-500/20 text-red-400 border-red-500/30";
        }
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    };

    const getStatusColor = (status: string) => {
        return status === "Active"
            ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
            : "bg-gray-500/20 text-gray-400 border-gray-500/30";
    };

    const handlePremiumDeposit = async (policyId: number) => {
        // Logic to handle premium deposit
        try {
            const tx = await manualPremiumPayment(
                policyId,
                currentPolicy?.premiumAmount as number
            );

            console.log("Handling premium deposit for policy:", policyId);
            toast("Premium Paid", {
                description:
                    "Your premium payment has been processed successfully.",
                className: "bg-gray-900 border-blue-500/30 text-white",
            });
        } catch (error: any) {
            console.error("Error processing premium payment:", error);
            toast.error("Failed to process premium payment", {
                description: error.message,
                className: "bg-red-900 border-red-500/30 text-white",
            });
        }
    };

    const handleAutopayToggle = async (policyId: number) => {
        const newAutopayState = !autopayEnabled; // Calculate the new state

        console.log(
            "Toggling autopay for policy:",
            policyId,
            "from:",
            autopayEnabled,
            "to:",
            newAutopayState
        );

        if (newAutopayState) {
            // Logic to enable autopay
            console.log("Enabling autopay for policy:", policyId);
            try {
                const tx = await enableAutopay(policyId);

                console.log("Waiting for transaction confirmation:", tx);

                setAutopayEnabled(true);
                toast("Autopay Enabled", {
                    description: "Automatic payments are now active.",
                    className: "bg-gray-900 border-blue-500/30 text-white",
                });
            } catch (error: any) {
                console.error("Error enabling autopay:", error);
                toast.error("Failed to enable autopay", {
                    description: error.message,
                    className: "bg-red-900 border-red-500/30 text-white",
                });
            }
        } else {
            // Logic to disable autopay
            console.log("Disabling autopay for policy:", policyId);
            try {
                const data = await disableAutopay(policyId);

                // Wait for transaction confirmation
                console.log("Waiting for transaction confirmation:", data);
                // If you have a way to wait for confirmation, add it here
                // await waitForTransaction(tx);

                setAutopayEnabled(false);
                toast("Autopay Disabled", {
                    description: "Automatic payments have been stopped.",
                    className: "bg-gray-900 border-blue-500/30 text-white",
                });
            } catch (error: any) {
                console.error("Error disabling autopay:", error);
                toast.error("Failed to disable autopay", {
                    description: error.message,
                    className: "bg-red-900 border-red-500/30 text-white",
                });
            }
        }
    };

    const handleFundAI = async (policyId: number) => {
        // Logic to handle funding the AI agent
        console.log("Funding AI agent for policy:", policyId);

        const data = await writeContractAsync({
            address: premiumForwarderAddress,
            abi: premiumForwarderAbi,
            functionName: "fundAgent",
            args: ["0xF9a33884BfB411EE2fb4ee9bE079a8d2FAB39d65"],
            value: parseEther("0.002"),
        });

        console.log("Funding transaction data:", data);

        toast("AI Agent Funded", {
            description:
                "Your AI monitoring agent has been successfully funded.",
            className: "bg-gray-900 border-blue-500/30 text-white",
        });
    };

    const handleSubmitClaim = async (policyId: number) => {
        try {
            await writeContractAsync({
                address: rugPullAddress,
                abi: rugPullAbi,
                functionName: "sendRugPullCheckRequest",
                args: [15703],
            });

            console.log("Claim submitted successfully for policy:", policyId);

            // Set claim status with timer
            setClaimStatus((prev) => ({
                ...prev,
                [policyId]: {
                    isSubmitted: true,
                    timeRemaining: 300, // 5 minutes
                    isTimerComplete: false,
                },
            }));

            toast("Claim Submitted", {
                description:
                    "Your claim has been submitted and is under review.",
                className: "bg-gray-900 border-blue-500/30 text-white",
            });
        } catch (error: any) {
            console.error("Error submitting claim:", error);
            toast.error("Failed to submit claim", {
                description: error.message,
                className: "bg-red-900 border-red-500/30 text-white",
            });
        }
    };

    const handleCheckResult = async (policyId: number) => {
        // Call the smart contract function to check the claim result
        console.log("Checking claim result for policy:", policyId);
        console.log("Claim Data:", claimData);
        console.log("Current Policy:", currentPolicy);

        // Ensure coverageAmount is converted to string and parsed to BigInt (wei, uint256)
        const coverageAmountWei =
            currentPolicy?.coverageAmount !== undefined
                ? BigInt(parseEther(currentPolicy.coverageAmount.toString()))
                : BigInt(0);

        console.log("Coverage Amount (wei):", coverageAmountWei);

        await writeContractAsync({
            address: yieldPoolAddress,
            abi: yieldPoolAbi,
            functionName: "processClaim",
            args: [
                coverageAmountWei,
                currentPolicy?.riskLevel || 0,
                address as `0x${string}`,
            ],
        });

        toast("Claim Result Checked", {
            description: "Your claim result has been retrieved.",
            className: "bg-gray-900 border-blue-500/30 text-white",
        });
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white overflow-hidden">
            {/* Top Boundary Gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-60"></div>

            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Header */}
            <header className="relative z-50 pt-8 px-4">
                <Navbar />
            </header>

            {/* Main Content */}
            <main className="relative z-10 pt-16 pb-20 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-7xl z-10 font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight">
                            Your Active Insurance Policies
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                            Manage and interact with your autonomous protection
                            stack
                        </p>
                    </div>

                    {/* Enhanced Policy Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {userPolicies.map((policy, index) => (
                            <Card
                                key={policy.id}
                                className="bg-gray-800/30 backdrop-blur-lg border border-gray-700/50 hover:bg-gray-700/40 transition-all duration-500 relative overflow-hidden group transform hover:scale-105 shadow-xl hover:shadow-2xl"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Dynamic glow effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                {/* Animated border */}
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-[1px]">
                                    <div className="w-full h-full bg-gray-800/90 rounded-xl"></div>
                                </div>

                                <div className="relative z-10 p-6">
                                    <CardHeader className="p-0 mb-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <CardTitle className="text-white text-xl font-bold mb-2 group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                                                    {policy.id} -{" "}
                                                    <Link
                                                        href={
                                                            policy.metadataUri
                                                        }
                                                    >
                                                        URI
                                                    </Link>
                                                </CardTitle>
                                                <div className="flex items-center space-x-2">
                                                    <Badge
                                                        className={`${getStatusColor(
                                                            policy.isActive
                                                                ? "Active"
                                                                : "Inactive"
                                                        )} border-0 font-medium px-3 py-1`}
                                                    >
                                                        {policy.isActive
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </Badge>
                                                    <Badge
                                                        className={`${getRiskLevelColor(
                                                            policy.riskLevel
                                                        )} border-0 font-medium px-3 py-1`}
                                                    >
                                                        {
                                                            riskLevelNames[
                                                                policy.riskLevel
                                                            ]
                                                        }{" "}
                                                        Risk
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-all duration-300">
                                                <Shield className="w-6 h-6 text-cyan-400" />
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-0 space-y-6">
                                        {/* Policy Details Grid */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg p-4 group-hover:bg-gray-700/60 transition-colors duration-300">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <TrendingUp className="w-4 h-4 text-gray-400" />
                                                    <p className="text-gray-400 text-sm">
                                                        Policy Type
                                                    </p>
                                                </div>
                                                <p className="text-white font-semibold">
                                                    {
                                                        policyType[
                                                            policy.policyType
                                                        ]
                                                    }
                                                </p>
                                            </div>
                                            <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg p-4 group-hover:bg-gray-700/60 transition-colors duration-300">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <DollarSign className="w-4 h-4 text-gray-400" />
                                                    <p className="text-gray-400 text-sm">
                                                        Coverage
                                                    </p>
                                                </div>
                                                <p className="text-white font-semibold">
                                                    {policy.coverageAmount} ETH
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg p-4 group-hover:bg-gray-700/60 transition-colors duration-300">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <Zap className="w-4 h-4 text-gray-400" />
                                                        <p className="text-gray-400 text-sm">
                                                            Premium
                                                        </p>
                                                    </div>
                                                    <p className="text-white font-semibold text-lg">
                                                        {policy.premiumAmount}{" "}
                                                        ETH
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="flex items-center space-x-2 mb-1 justify-end">
                                                        <Calendar className="w-4 h-4 text-gray-400" />
                                                        <p className="text-gray-400 text-sm">
                                                            Expiry
                                                        </p>
                                                    </div>
                                                    <p className="text-white font-semibold">
                                                        {new Date(
                                                            Number(
                                                                policy?.expiryDate
                                                            )
                                                        ).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                month: "short",
                                                                day: "numeric",
                                                            }
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <Dialog
                                                open={open}
                                                onOpenChange={setOpen}
                                            >
                                                <DialogTrigger asChild>
                                                    <Button
                                                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 py-3 font-semibold rounded-xl"
                                                        onClick={() => {
                                                            setCurrentPolicy(
                                                                policy
                                                            );
                                                            setOpen(true);
                                                        }}
                                                    >
                                                        <Shield className="w-4 h-4 mr-2" />
                                                        Manage Policy
                                                    </Button>
                                                </DialogTrigger>

                                                <DialogContent className="bg-gray-900/95 backdrop-blur-lg border-2 border-gray-600/60 shadow-2xl shadow-cyan-500/10 text-white max-w-5xl  max-h-[90vh] min-w-[50vw] overflow-y-auto rounded-2xl">
                                                    <DialogHeader className="pb-6 space-y-4">
                                                        <div className="flex items-start justify-between">
                                                            <div className="space-y-3">
                                                                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                                                                    Policy{" "}
                                                                    {
                                                                        currentPolicy?.id
                                                                    }
                                                                </DialogTitle>
                                                                <p className="text-gray-400 text-sm font-mono break-all max-w-lg">
                                                                    {
                                                                        currentPolicy?.metadataUri
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-3">
                                                            <Badge
                                                                className={`${getStatusColor(
                                                                    currentPolicy?.isActive
                                                                        ? "Active"
                                                                        : "Inactive"
                                                                )} border px-3 py-1 font-medium text-xs`}
                                                            >
                                                                {currentPolicy?.isActive
                                                                    ? "Active"
                                                                    : "Inactive"}
                                                            </Badge>
                                                            <Badge
                                                                className={`${getRiskLevelColor(
                                                                    policy.riskLevel
                                                                )} border px-3 py-1 font-medium text-xs`}
                                                            >
                                                                {
                                                                    riskLevelNames[
                                                                        policy
                                                                            .riskLevel
                                                                    ]
                                                                }{" "}
                                                                Risk
                                                            </Badge>
                                                        </div>
                                                    </DialogHeader>

                                                    <div className="space-y-8">
                                                        {/* Policy Overview Cards */}
                                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                                            <div className="bg-gray-800/60 backdrop-blur-lg border border-gray-700/50 rounded-lg p-4">
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <div className="p-2 bg-blue-500/20 rounded-md">
                                                                        <Calendar className="w-4 h-4 text-blue-400" />
                                                                    </div>
                                                                    <span className="text-gray-300 text-sm font-medium">
                                                                        Start
                                                                        Date
                                                                    </span>
                                                                </div>
                                                                <p className="text-white font-semibold">
                                                                    {new Date(
                                                                        Number(
                                                                            policy?.startDate
                                                                        )
                                                                    ).toLocaleDateString()}
                                                                </p>
                                                            </div>

                                                            <div className="bg-gray-800/60 backdrop-blur-lg border border-gray-700/50 rounded-lg p-4">
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <div className="p-2 bg-orange-500/20 rounded-md">
                                                                        <Calendar className="w-4 h-4 text-orange-400" />
                                                                    </div>
                                                                    <span className="text-gray-300 text-sm font-medium">
                                                                        End Date
                                                                    </span>
                                                                </div>
                                                                <p className="text-white font-semibold">
                                                                    {new Date(
                                                                        Number(
                                                                            currentPolicy?.expiryDate
                                                                        )
                                                                    ).toLocaleDateString()}
                                                                </p>
                                                            </div>

                                                            <div className="bg-emerald-900/30 rounded-lg p-4 border border-emerald-500/30 backdrop-blur-sm">
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <div className="p-2 bg-emerald-500/20 rounded-md">
                                                                        <Shield className="w-4 h-4 text-emerald-400" />
                                                                    </div>
                                                                    <span className="text-emerald-300 text-sm font-medium">
                                                                        Coverage
                                                                    </span>
                                                                </div>
                                                                <p className="text-emerald-400 font-bold text-lg">
                                                                    {
                                                                        currentPolicy?.coverageAmount
                                                                    }{" "}
                                                                    ETH
                                                                </p>
                                                            </div>

                                                            <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-500/30 backdrop-blur-sm">
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <div className="p-2 bg-blue-500/20 rounded-md">
                                                                        <DollarSign className="w-4 h-4 text-blue-400" />
                                                                    </div>
                                                                    <span className="text-blue-300 text-sm font-medium">
                                                                        Premium
                                                                    </span>
                                                                </div>
                                                                <p className="text-blue-400 font-bold text-lg">
                                                                    {
                                                                        currentPolicy?.premiumAmount
                                                                    }{" "}
                                                                    ETH
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Stats Section */}
                                                        <div className="bg-gray-800/40 backdrop-blur-lg border border-gray-700/50 rounded-lg p-6">
                                                            <h3 className="text-lg font-semibold text-gray-200 mb-6 flex items-center gap-2">
                                                                <TrendingUp className="w-5 h-5 text-cyan-400" />
                                                                Policy
                                                                Statistics
                                                            </h3>

                                                            <div className="grid grid-cols-3 gap-8">
                                                                <div className="text-center space-y-2">
                                                                    <div className="text-gray-400 text-sm font-medium">
                                                                        Days
                                                                        Remaining
                                                                    </div>
                                                                    <div className="text-cyan-400 font-bold text-2xl">
                                                                        {Math.floor(
                                                                            (policy.expiryDate -
                                                                                Date.now()) /
                                                                                1000 /
                                                                                3600 /
                                                                                24
                                                                        )}
                                                                    </div>
                                                                    <div className="text-gray-500 text-xs">
                                                                        Until
                                                                        expiry
                                                                    </div>
                                                                </div>

                                                                <div className="text-center space-y-2">
                                                                    <div className="text-gray-400 text-sm font-medium">
                                                                        Coverage
                                                                        Ratio
                                                                    </div>
                                                                    <div className="text-purple-400 font-bold text-2xl">
                                                                        {(
                                                                            Number(
                                                                                currentPolicy?.coverageAmount
                                                                            ) /
                                                                            Number(
                                                                                currentPolicy?.premiumAmount
                                                                            )
                                                                        ).toFixed(
                                                                            1
                                                                        )}
                                                                        x
                                                                    </div>
                                                                    <div className="text-gray-500 text-xs">
                                                                        Coverage
                                                                        to
                                                                        premium
                                                                    </div>
                                                                </div>

                                                                <div className="text-center space-y-2">
                                                                    <div className="text-gray-400 text-sm font-medium">
                                                                        Status
                                                                    </div>
                                                                    <div
                                                                        className={`font-bold text-2xl ${
                                                                            policy.isActive
                                                                                ? "text-emerald-400"
                                                                                : "text-red-400"
                                                                        }`}
                                                                    >
                                                                        {currentPolicy?.isActive
                                                                            ? "ACTIVE"
                                                                            : "INACTIVE"}
                                                                    </div>
                                                                    <div className="text-gray-500 text-xs">
                                                                        Current
                                                                        state
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Main Content Grid */}
                                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                            {/* Claim History */}
                                                            <div className="lg:col-span-1">
                                                                <div className="bg-gray-800/40 backdrop-blur-lg border border-gray-700/50 rounded-lg p-6 h-full">
                                                                    <h3 className="text-lg font-semibold text-blue-400 mb-6 flex items-center gap-2">
                                                                        <FileText className="w-5 h-5" />
                                                                        Claim
                                                                        History
                                                                    </h3>

                                                                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                                                                        <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center">
                                                                            <FileText className="w-8 h-8 text-gray-400" />
                                                                        </div>
                                                                        <div className="text-center space-y-2">
                                                                            <p className="text-gray-300 font-medium">
                                                                                No
                                                                                claims
                                                                                submitted
                                                                            </p>
                                                                            <p className="text-gray-500 text-sm">
                                                                                Your
                                                                                policy
                                                                                is
                                                                                secure
                                                                                and
                                                                                active
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Policy Actions */}
                                                            <div className="lg:col-span-2">
                                                                <div className="bg-gray-800/40 backdrop-blur-lg border border-gray-700/50 rounded-lg p-6 h-full flex flex-col gap-4">
                                                                    <h3 className="text-lg font-semibold text-purple-400 mb-6 flex items-center gap-2">
                                                                        <Zap className="w-5 h-5" />
                                                                        Policy
                                                                        Actions
                                                                    </h3>

                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                        <Button
                                                                            onClick={() =>
                                                                                handlePremiumDeposit(
                                                                                    currentPolicy?.id as number
                                                                                )
                                                                            }
                                                                            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white border-0 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 p-2 h-auto hover:scale-[1.02] group"
                                                                        >
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="p-2 bg-white/20 rounded-md group-hover:bg-white/30 transition-colors">
                                                                                    <DollarSign className="w-4 h-4" />
                                                                                </div>
                                                                                <div className="text-left">
                                                                                    <div className="font-semibold text-sm">
                                                                                        Premium
                                                                                        Deposit
                                                                                    </div>
                                                                                    <div className="text-emerald-100 text-xs opacity-90">
                                                                                        Manual
                                                                                        payment
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </Button>

                                                                        <Button
                                                                            onClick={() =>
                                                                                handleFundAI(
                                                                                    currentPolicy?.id as number
                                                                                )
                                                                            }
                                                                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 p-4 h-auto hover:scale-[1.02] group"
                                                                        >
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="p-2 bg-white/20 rounded-md group-hover:bg-white/30 transition-colors">
                                                                                    <Bot className="w-4 h-4" />
                                                                                </div>
                                                                                <div className="text-left">
                                                                                    <div className="font-semibold text-sm">
                                                                                        Fund
                                                                                        AI
                                                                                        Agent
                                                                                    </div>
                                                                                    <div className="text-purple-100 text-xs opacity-90">
                                                                                        Automated
                                                                                        management
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </Button>

                                                                        {/* Claim Section with Timer */}
                                                                        {!claimStatus[
                                                                            currentPolicy?.id as number
                                                                        ]
                                                                            ?.isSubmitted ? (
                                                                            <Button
                                                                                onClick={() =>
                                                                                    handleSubmitClaim(
                                                                                        currentPolicy?.id as number
                                                                                    )
                                                                                }
                                                                                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white border-0 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 p-4 h-auto hover:scale-[1.02] group"
                                                                            >
                                                                                <div className="flex items-center gap-3">
                                                                                    <div className="p-2 bg-white/20 rounded-md group-hover:bg-white/30 transition-colors">
                                                                                        <FileText className="w-4 h-4" />
                                                                                    </div>
                                                                                    <div className="text-left">
                                                                                        <div className="font-semibold text-sm">
                                                                                            Submit
                                                                                            Claim
                                                                                        </div>
                                                                                        <div className="text-orange-100 text-xs opacity-90">
                                                                                            File
                                                                                            a
                                                                                            claim
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </Button>
                                                                        ) : (
                                                                            <div className="space-y-4">
                                                                                {!claimStatus[
                                                                                    currentPolicy?.id as number
                                                                                ]
                                                                                    ?.isTimerComplete ? (
                                                                                    <div className="bg-gray-800/60 backdrop-blur-lg border border-gray-700/50 rounded-lg p-4">
                                                                                        <div className="text-center">
                                                                                            <div className="mb-4">
                                                                                                <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-500/20 rounded-full mb-3">
                                                                                                    <svg
                                                                                                        className="w-6 h-6 text-yellow-400 animate-spin"
                                                                                                        fill="none"
                                                                                                        viewBox="0 0 24 24"
                                                                                                    >
                                                                                                        <circle
                                                                                                            cx="12"
                                                                                                            cy="12"
                                                                                                            r="10"
                                                                                                            stroke="currentColor"
                                                                                                            strokeWidth="4"
                                                                                                            className="opacity-25"
                                                                                                        ></circle>
                                                                                                        <path
                                                                                                            fill="currentColor"
                                                                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                                                            className="opacity-75"
                                                                                                        ></path>
                                                                                                    </svg>
                                                                                                </div>
                                                                                                <h3 className="text-lg font-semibold text-white mb-2">
                                                                                                    Processing
                                                                                                    Claim
                                                                                                </h3>
                                                                                                <p className="text-gray-300 text-sm mb-3">
                                                                                                    Your
                                                                                                    claim
                                                                                                    is
                                                                                                    being
                                                                                                    reviewed. Do not close or refresh this page.
                                                                                                </p>
                                                                                            </div>

                                                                                            <div className="bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/20">
                                                                                                <p className="text-yellow-400 text-sm mb-2">
                                                                                                    Time
                                                                                                    Remaining
                                                                                                </p>
                                                                                                <div className="text-2xl font-mono text-yellow-400 font-bold">
                                                                                                    {formatTime(
                                                                                                        claimStatus[
                                                                                                            currentPolicy?.id as number
                                                                                                        ]
                                                                                                            ?.timeRemaining ||
                                                                                                            0
                                                                                                    )}
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className="bg-gray-800/60 backdrop-blur-lg border border-gray-700/50 rounded-lg p-4">
                                                                                        <div className="text-center">
                                                                                            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-full mb-3">
                                                                                                <svg
                                                                                                    className="w-6 h-6 text-green-400"
                                                                                                    fill="none"
                                                                                                    stroke="currentColor"
                                                                                                    viewBox="0 0 24 24"
                                                                                                >
                                                                                                    <path
                                                                                                        strokeLinecap="round"
                                                                                                        strokeLinejoin="round"
                                                                                                        strokeWidth="2"
                                                                                                        d="M5 13l4 4L19 7"
                                                                                                    ></path>
                                                                                                </svg>
                                                                                            </div>
                                                                                            <h3 className="text-lg font-semibold text-white mb-2">
                                                                                                Review
                                                                                                Complete
                                                                                            </h3>
                                                                                            <p className="text-gray-300 text-sm">
                                                                                                Your
                                                                                                claim
                                                                                                has
                                                                                                been
                                                                                                processed
                                                                                                and
                                                                                                is
                                                                                                ready
                                                                                                for
                                                                                                review.
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                )}

                                                                                <div className="flex flex-col space-y-2">
                                                                                    {claimStatus[
                                                                                        currentPolicy?.id as number
                                                                                    ]
                                                                                        ?.isTimerComplete ? (
                                                                                        <Button
                                                                                            onClick={() =>
                                                                                                handleCheckResult(
                                                                                                    currentPolicy?.id as number
                                                                                                )
                                                                                            }
                                                                                            className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                                                                                        >
                                                                                            Check
                                                                                            Result
                                                                                        </Button>
                                                                                    ) : (
                                                                                        <Button
                                                                                            disabled
                                                                                            className="bg-gray-500/50 text-gray-300 font-semibold py-3 px-4 rounded-lg cursor-not-allowed"
                                                                                        >
                                                                                            Processing...
                                                                                        </Button>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        <div className="bg-gray-700/50 backdrop-blur-lg border border-gray-600/30 rounded-lg p-4">
                                                                            <div className="flex items-center justify-between">
                                                                                <div className="flex items-center gap-3">
                                                                                    <div className="p-2 bg-cyan-500/20 rounded-md">
                                                                                        <Activity className="w-4 h-4 text-cyan-400" />
                                                                                    </div>
                                                                                    <div>
                                                                                        <div className="font-semibold text-white text-sm">
                                                                                            Autopay
                                                                                        </div>
                                                                                        <div className="text-gray-400 text-xs">
                                                                                            Automatic
                                                                                            payments
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <Switch
                                                                                    checked={
                                                                                        autopayEnabled
                                                                                    }
                                                                                    onCheckedChange={(
                                                                                        checked
                                                                                    ) => {
                                                                                        handleAutopayToggle(
                                                                                            currentPolicy?.id as number
                                                                                        );
                                                                                    }}
                                                                                    className="data-[state=checked]:bg-blue-600"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </CardContent>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
