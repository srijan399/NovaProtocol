"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    TrendingUp,
    Shield,
    ChevronRight,
    Plus,
    Minus,
    DollarSign,
    PieChart,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
    Zap,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAccount, useReadContract } from "wagmi";
import { yieldPoolAbi, yieldPoolAddress } from "../abi";

const riskPools = [
    {
        id: 1,
        name: "Low Risk Pool",
        risk: "Low",
        badge: "🟢",
        color: "from-green-400 to-emerald-500",
        totalDeposits: "$2,847,392",
        premiumEarned: "$12,847",
        apy: "8.5%",
        riskLevel: "low",
        userStake: "1,250.00", // Mock user stake
        userRewards: "45.23",
    },
    {
        id: 2,
        name: "Medium Risk Pool",
        risk: "Medium",
        badge: "🟠",
        color: "from-orange-400 to-yellow-500",
        totalDeposits: "$1,923,847",
        premiumEarned: "$28,394",
        apy: "15.2%",
        riskLevel: "medium",
        userStake: "750.00",
        userRewards: "89.12",
    },
    {
        id: 3,
        name: "High Risk Pool",
        risk: "High",
        badge: "🔴",
        color: "from-red-400 to-pink-500",
        totalDeposits: "$847,293",
        premiumEarned: "$45,829",
        apy: "24.7%",
        riskLevel: "high",
        userStake: "0.00",
        userRewards: "0.00",
    },
];

interface StakeModalProps {
    pool: (typeof riskPools)[0];
    isOpen: boolean;
    onClose: () => void;
}

function StakeModal({ pool, isOpen, onClose }: StakeModalProps) {
    const [depositAmount, setDepositAmount] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleDeposit = async () => {
        setIsLoading(true);
        // Simulate transaction
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsLoading(false);
        onClose();
    };

    const handleWithdraw = async () => {
        setIsLoading(true);
        // Simulate transaction
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsLoading(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#0e0f11] border-gray-800 text-white max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-xl">
                        <span className="text-2xl">{pool.badge}</span>
                        <span className="bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] bg-clip-text text-transparent">
                            {pool.name}
                        </span>
                    </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="deposit" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-900/50 border border-gray-800">
                        <TabsTrigger
                            value="deposit"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#06b6d4] data-[state=active]:to-[#3b82f6] data-[state=active]:text-white"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Deposit
                        </TabsTrigger>
                        <TabsTrigger
                            value="withdraw"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#06b6d4] data-[state=active]:to-[#3b82f6] data-[state=active]:text-white"
                        >
                            <Minus className="w-4 h-4 mr-2" />
                            Withdraw
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="deposit" className="space-y-6 mt-6">
                        {/* Current Position */}
                        <Card className="bg-gray-900/30 border-gray-800">
                            <CardContent className="p-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-400">
                                            Your Stake
                                        </p>
                                        <p className="text-white font-bold">
                                            ${pool.userStake} USDC
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">
                                            Rewards Earned
                                        </p>
                                        <p className="text-green-400 font-bold">
                                            ${pool.userRewards}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Deposit Form */}
                        <div className="space-y-4">
                            <div>
                                <Label
                                    htmlFor="deposit-amount"
                                    className="text-gray-300"
                                >
                                    Deposit Amount (USDC)
                                </Label>
                                <div className="relative mt-2">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        id="deposit-amount"
                                        type="number"
                                        placeholder="0.00"
                                        value={depositAmount}
                                        onChange={(e) =>
                                            setDepositAmount(e.target.value)
                                        }
                                        className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-[#06b6d4]"
                                    />
                                </div>
                            </div>

                            {/* Quick Amount Buttons */}
                            <div className="flex gap-2">
                                {["25", "50", "100", "Max"].map((amount) => (
                                    <Button
                                        key={amount}
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setDepositAmount(
                                                amount === "Max"
                                                    ? "1000"
                                                    : amount
                                            )
                                        }
                                        className="border-gray-700 text-gray-300 hover:border-[#06b6d4] hover:text-white bg-transparent"
                                    >
                                        {amount}
                                    </Button>
                                ))}
                            </div>

                            {/* Pool Info */}
                            <div className="bg-gray-900/30 rounded-lg p-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">
                                        Current APY
                                    </span>
                                    <span className="text-green-400 font-medium">
                                        {pool.apy}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">
                                        Pool Utilization
                                    </span>
                                    <span className="text-white">67%</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">
                                        Your Share
                                    </span>
                                    <span className="text-white">0.08%</span>
                                </div>
                            </div>

                            <Button
                                onClick={handleDeposit}
                                disabled={!depositAmount || isLoading}
                                className="w-full bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] hover:from-[#0891b2] hover:to-[#2563eb] text-white border-0 font-medium"
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Processing...
                                    </div>
                                ) : (
                                    <>
                                        <ArrowUpRight className="w-4 h-4 mr-2" />
                                        Deposit ${depositAmount || "0.00"}
                                    </>
                                )}
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="withdraw" className="space-y-6 mt-6">
                        {/* Current Position */}
                        <Card className="bg-gray-900/30 border-gray-800">
                            <CardContent className="p-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-400">
                                            Available to Withdraw
                                        </p>
                                        <p className="text-white font-bold">
                                            ${pool.userStake} USDC
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">
                                            Pending Rewards
                                        </p>
                                        <p className="text-green-400 font-bold">
                                            ${pool.userRewards}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Withdraw Form */}
                        <div className="space-y-4">
                            <div>
                                <Label
                                    htmlFor="withdraw-amount"
                                    className="text-gray-300"
                                >
                                    Withdraw Amount (USDC)
                                </Label>
                                <div className="relative mt-2">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        id="withdraw-amount"
                                        type="number"
                                        placeholder="0.00"
                                        value={withdrawAmount}
                                        onChange={(e) =>
                                            setWithdrawAmount(e.target.value)
                                        }
                                        className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-[#06b6d4]"
                                    />
                                </div>
                            </div>

                            {/* Quick Percentage Buttons */}
                            <div className="flex gap-2">
                                {["25%", "50%", "75%", "100%"].map(
                                    (percentage) => (
                                        <Button
                                            key={percentage}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                const amount =
                                                    Number.parseFloat(
                                                        pool.userStake
                                                    ) *
                                                    (Number.parseInt(
                                                        percentage
                                                    ) /
                                                        100);
                                                setWithdrawAmount(
                                                    amount.toString()
                                                );
                                            }}
                                            className="border-gray-700 text-gray-300 hover:border-[#06b6d4] hover:text-white bg-transparent"
                                        >
                                            {percentage}
                                        </Button>
                                    )
                                )}
                            </div>

                            {/* Withdrawal Info */}
                            <div className="bg-gray-900/30 rounded-lg p-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">
                                        Withdrawal Fee
                                    </span>
                                    <span className="text-white">0.1%</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">
                                        Processing Time
                                    </span>
                                    <span className="text-white">
                                        ~2 minutes
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">
                                        You'll Receive
                                    </span>
                                    <span className="text-green-400 font-medium">
                                        $
                                        {withdrawAmount
                                            ? (
                                                  Number.parseFloat(
                                                      withdrawAmount
                                                  ) * 0.999
                                              ).toFixed(2)
                                            : "0.00"}
                                    </span>
                                </div>
                            </div>

                            <Button
                                onClick={handleWithdraw}
                                disabled={
                                    !withdrawAmount ||
                                    isLoading ||
                                    Number.parseFloat(pool.userStake) === 0
                                }
                                className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0 font-medium"
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Processing...
                                    </div>
                                ) : (
                                    <>
                                        <ArrowDownRight className="w-4 h-4 mr-2" />
                                        Withdraw ${withdrawAmount || "0.00"}
                                    </>
                                )}
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}

export default function StakerDashboard() {
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const [selectedPool, setSelectedPool] = useState<
        (typeof riskPools)[0] | null
    >(null);
    const { address } = useAccount();

    const { data: userLiquidity, refetch: refetchUserLiquidity } =
        useReadContract({
            address: yieldPoolAddress,
            abi: yieldPoolAbi,
            functionName: "getUserLiquidity",
            args: [],
        });

    const totalStaked = riskPools.reduce(
        (sum, pool) => sum + Number.parseFloat(pool.userStake),
        0
    );
    const totalRewards = riskPools.reduce(
        (sum, pool) => sum + Number.parseFloat(pool.userRewards),
        0
    );

    return (
        <div className="min-h-screen bg-[#0e0f11] text-white">
            {/* Header */}
            <header className="border-b border-gray-800/50 bg-[#0e0f11]/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-8">
                    <Navbar />
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-12">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] bg-clip-text text-transparent">
                        Stake in Risk Pools
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Underwrite On-Chain Protection and Earn Premium Rewards
                    </p>
                </div>

                {/* User Portfolio Overview */}
                {address && (
                    <section className="mb-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-800 backdrop-blur-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <PieChart className="w-5 h-5 text-[#06b6d4]" />
                                        <span className="text-gray-400">
                                            Total Staked
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold text-white">
                                        ${totalStaked.toLocaleString()}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Across{" "}
                                        {
                                            riskPools.filter(
                                                (p) =>
                                                    Number.parseFloat(
                                                        p.userStake
                                                    ) > 0
                                            ).length
                                        }{" "}
                                        pools
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-800 backdrop-blur-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Zap className="w-5 h-5 text-green-400" />
                                        <span className="text-gray-400">
                                            Total Rewards
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold text-green-400">
                                        ${totalRewards.toFixed(2)}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        +12.5% this month
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-800 backdrop-blur-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Clock className="w-5 h-5 text-orange-400" />
                                        <span className="text-gray-400">
                                            Avg. APY
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold text-white">
                                        16.1%
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Weighted average
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </section>
                )}

                {/* Risk Pools Overview */}
                <section className="mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {riskPools.map((pool) => (
                            <Card
                                key={pool.id}
                                className={`
                  relative bg-gray-900/50 border-gray-800 backdrop-blur-sm transition-all duration-300 cursor-pointer
                  hover:bg-gray-900/70 hover:border-[#06b6d4]/50 hover:shadow-2xl hover:shadow-[#06b6d4]/20
                  ${hoveredCard === pool.id ? "scale-105" : ""}
                `}
                                onMouseEnter={() => setHoveredCard(pool.id)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                {/* Gradient Border Effect */}
                                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] opacity-0 hover:opacity-20 transition-opacity duration-300" />

                                <CardHeader className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                                            <span className="text-2xl">
                                                {pool.badge}
                                            </span>
                                            {pool.name}
                                        </CardTitle>
                                        <Badge
                                            variant="outline"
                                            className={`
                        border-0 text-white font-medium
                        ${
                            pool.riskLevel === "low"
                                ? "bg-green-500/20 text-green-400"
                                : ""
                        }
                        ${
                            pool.riskLevel === "medium"
                                ? "bg-orange-500/20 text-orange-400"
                                : ""
                        }
                        ${
                            pool.riskLevel === "high"
                                ? "bg-red-500/20 text-red-400"
                                : ""
                        }
                      `}
                                        >
                                            {pool.risk}
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="relative z-10 space-y-6">
                                    {/* User Position (if any) */}
                                    {Number.parseFloat(pool.userStake) > 0 && (
                                        <div className="bg-[#06b6d4]/10 border border-[#06b6d4]/30 rounded-lg p-3">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-[#06b6d4] font-medium">
                                                    Your Position
                                                </span>
                                                <span className="text-white font-bold">
                                                    ${pool.userStake}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs mt-1">
                                                <span className="text-gray-400">
                                                    Rewards Earned
                                                </span>
                                                <span className="text-green-400">
                                                    +${pool.userRewards}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Pool Stats */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">
                                                Total Deposits
                                            </span>
                                            <span className="text-white font-bold text-lg">
                                                {pool.totalDeposits}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">
                                                Premium Earned
                                            </span>
                                            <span className="text-green-400 font-bold text-lg">
                                                {pool.premiumEarned}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">
                                                Current APY
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <TrendingUp className="w-4 h-4 text-green-400" />
                                                <span className="text-green-400 font-bold text-lg">
                                                    {pool.apy}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mini Chart Placeholder */}
                                    <div className="h-16 bg-gray-800/50 rounded-lg flex items-center justify-center">
                                        <div className="flex items-center gap-1">
                                            {[...Array(12)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`w-1 bg-gradient-to-t ${pool.color} rounded-full`}
                                                    style={{
                                                        height: `${
                                                            Math.random() * 40 +
                                                            10
                                                        }px`,
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() =>
                                                setSelectedPool(pool)
                                            }
                                            className="flex-1 bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] hover:from-[#0891b2] hover:to-[#2563eb] text-white border-0 font-medium group"
                                        >
                                            {Number.parseFloat(pool.userStake) >
                                            0
                                                ? "Manage"
                                                : "Deposit"}
                                            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </div>
                                </CardContent>

                                {/* Glow Effect */}
                                {hoveredCard === pool.id && (
                                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#06b6d4]/10 to-[#3b82f6]/10 blur-xl -z-10" />
                                )}
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Quick Actions */}
                <section className="mb-16">
                    <Card className="bg-gray-900/30 border-gray-800 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Shield className="w-5 h-5 text-[#06b6d4]" />
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Button
                                    variant="outline"
                                    className="border-gray-700 text-gray-300 hover:text-white hover:border-[#06b6d4]/50 bg-transparent"
                                >
                                    My Stakes
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-gray-700 text-gray-300 hover:text-white hover:border-[#06b6d4]/50 bg-transparent"
                                >
                                    View Rewards
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-gray-700 text-gray-300 hover:text-white hover:border-[#06b6d4]/50 bg-transparent"
                                >
                                    Withdraw All
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-800/50 bg-[#0e0f11]/80 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <p className="text-gray-400">
                            Securing DeFi, Trustlessly. Powered by{" "}
                            <span className="bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] bg-clip-text text-transparent font-medium">
                                Nova Protocol
                            </span>
                            .
                        </p>
                    </div>
                </div>
            </footer>

            {/* Stake Modal */}
            {selectedPool && (
                <StakeModal
                    pool={selectedPool}
                    isOpen={!!selectedPool}
                    onClose={() => setSelectedPool(null)}
                />
            )}
        </div>
    );
}
