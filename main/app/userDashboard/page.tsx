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
import { useAccount } from "wagmi";
import { policyManagerAbi } from "../abi";
import Navbar from "@/components/Navbar";
import Link from "next/link";

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

const mockPolicies: PolicyDataType[] = [
  {
    id: 1,
    address: "0x1234567890abcdef",
    policyType: 1,
    coverageAmount: 50000,
    premiumAmount: 250,
    riskLevel: 2,
    startDate: 1673740800,
    expiryDate: 1704278400,
    isActive: true,
    metadataUri: "ipfs://Qm1234567890abcdef",
  },
];

export default function Dashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { address } = useAccount();
  const [userPolicies, setUserPolicies] = useState<PolicyDataType[]>([]);
  const riskLevelNames = ["Low", "Medium", "High"];
  const policyType = [
    "DeFi Protocol",
    "Bridge Security",
    "Smart Contract",
    "Wallet Hack",
  ];
  const [open, setOpen] = useState(false);

  const {
    data: userPoliciesData,
    refetch: refetchUserPolicies,
    isFetching: isFetchingUserPolicies,
    status: userPoliciesStatus,
  } = useGetUserPolicies(address as `0x${string}`);

  useEffect(() => {
    console.log("Setting up refetch interval");

    const interval = setInterval(() => {
      refetchUserPolicies()
        .then((result: any) => {
          console.log("Data refetched: ", result);
          const res = JSON.parse(result.data) as PolicyDataType[];

          res.forEach((policy) => {
            // Convert coverageAmount and premiumAmount to numbers
            policy.coverageAmount = Number(policy.coverageAmount) / 10 ** 18;
            policy.premiumAmount = Number(policy.premiumAmount) / 10 ** 18;

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
    }, 2);
    return () => {
      console.log("Clearing refetch interval");
      clearInterval(interval);
    };
  }, [refetchUserPolicies]);

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

  const handlePremiumDeposit = (policyId: number) => {
    toast("Premium Paid", {
      description: "Your premium payment has been processed successfully.",
      className: "bg-gray-900 border-blue-500/30 text-white",
    });
  };

  const handleAutopayToggle = (policyId: number, enabled: boolean) => {
    // setUserPolicies((prev) =>
    //   prev.map((policy) =>
    //     policy.id === policyId ? { ...policy, autopayEnabled: enabled } : policy
    //   )
    // );
    toast(enabled ? "Autopay Enabled" : "Autopay Disabled", {
      description: enabled
        ? "Automatic payments are now active."
        : "Automatic payments have been disabled.",
      className: "bg-gray-900 border-blue-500/30 text-white",
    });
  };

  const handleFundAI = (policyId: number) => {
    toast("AI Agent Funded", {
      description: "Your AI monitoring agent has been successfully funded.",
      className: "bg-gray-900 border-blue-500/30 text-white",
    });
  };

  const handleSubmitClaim = (policyId: number) => {
    toast("Claim Submitted", {
      description: "Your claim has been submitted and is under review.",
      className: "bg-gray-900 border-blue-500/30 text-white",
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Multi-layer Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950/30 via-transparent to-blue-950/30"></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-purple-950/20 to-indigo-950/30"></div>

      {/* Animated mesh gradient overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-500/15 to-cyan-500/15 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Subtle dot pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%23ffffff fillOpacity=0.03%3E%3Ccircle cx=30 cy=30 r=1/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

      {/* Header */}
      <header className="relative z-10 p-10">
        <Navbar />
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent leading-tight">
            Your Active Insurance Policies
          </h1>
          <p className="text-xl md:text-2xl bg-gradient-to-r from-cyan-400/90 to-blue-400/90 bg-clip-text text-transparent max-w-2xl mx-auto">
            Manage and interact with your autonomous protection stack
          </p>
        </div>

        {/* Enhanced Policy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {userPolicies.map((policy, index) => (
            <Card
              key={policy.id}
              className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl hover:bg-slate-800/50 transition-all duration-500 relative overflow-hidden group transform hover:scale-[1.02] hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Dynamic glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Animated border */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-[1px]">
                <div className="w-full h-full bg-slate-900/90 rounded-xl"></div>
              </div>

              <div className="relative z-10 p-6">
                <CardHeader className="p-0 mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <CardTitle className="text-white text-xl font-bold mb-2 group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                        {policy.id} - <Link href={policy.metadataUri}>URI</Link>
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge
                          className={`${getStatusColor(
                            policy.isActive ? "Active" : "Inactive"
                          )} border-0 font-medium px-3 py-1`}
                        >
                          {policy.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge
                          className={`${getRiskLevelColor(
                            policy.riskLevel
                          )} border-0 font-medium px-3 py-1`}
                        >
                          {riskLevelNames[policy.riskLevel]} Risk
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
                    <div className="bg-slate-800/50 rounded-lg p-4 group-hover:bg-slate-800/70 transition-colors duration-300">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-400 text-sm">Policy Type</p>
                      </div>
                      <p className="text-white font-semibold">
                        {policyType[policy.policyType]}
                      </p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4 group-hover:bg-slate-800/70 transition-colors duration-300">
                      <div className="flex items-center space-x-2 mb-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-400 text-sm">Coverage</p>
                      </div>
                      <p className="text-white font-semibold">
                        {policy.coverageAmount} ETH
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-4 group-hover:bg-slate-800/70 transition-colors duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <Zap className="w-4 h-4 text-gray-400" />
                          <p className="text-gray-400 text-sm">Premium</p>
                        </div>
                        <p className="text-white font-semibold text-lg">
                          {policy.premiumAmount} ETH
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-1 justify-end">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <p className="text-gray-400 text-sm">Expiry</p>
                        </div>
                        <p className="text-white font-semibold">
                          {new Date(
                            Number(policy?.expiryDate)
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full">
                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 text-white border-0 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 py-3 font-semibold">
                          <Shield className="w-4 h-4 mr-2" />
                          Manage Policy
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="bg-slate-900/95 border-slate-700/50 text-white max-w-5xl  max-h-[90vh] min-w-[50vw] overflow-y-auto backdrop-blur-md">
                        <DialogHeader className="pb-6 space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-3">
                              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Policy {policy.id}
                              </DialogTitle>
                              <p className="text-slate-400 text-sm font-mono break-all max-w-lg">
                                {policy.metadataUri}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Badge
                              className={`${getStatusColor(
                                policy.isActive ? "Active" : "Inactive"
                              )} border px-3 py-1 font-medium text-xs`}
                            >
                              {policy.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <Badge
                              className={`${getRiskLevelColor(
                                policy.riskLevel
                              )} border px-3 py-1 font-medium text-xs`}
                            >
                              {riskLevelNames[policy.riskLevel]} Risk
                            </Badge>
                          </div>
                        </DialogHeader>

                        <div className="space-y-8">
                          {/* Policy Overview Cards */}
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-slate-800/60 rounded-lg p-4 border border-slate-700/50 backdrop-blur-sm">
                              <div className="flex items-center gap-2 mb-3">
                                <div className="p-2 bg-blue-500/20 rounded-md">
                                  <Calendar className="w-4 h-4 text-blue-400" />
                                </div>
                                <span className="text-slate-300 text-sm font-medium">
                                  Start Date
                                </span>
                              </div>
                              <p className="text-white font-semibold">
                                {new Date(
                                  Number(policy?.startDate)
                                ).toLocaleDateString()}
                              </p>
                            </div>

                            <div className="bg-slate-800/60 rounded-lg p-4 border border-slate-700/50 backdrop-blur-sm">
                              <div className="flex items-center gap-2 mb-3">
                                <div className="p-2 bg-orange-500/20 rounded-md">
                                  <Calendar className="w-4 h-4 text-orange-400" />
                                </div>
                                <span className="text-slate-300 text-sm font-medium">
                                  End Date
                                </span>
                              </div>
                              <p className="text-white font-semibold">
                                {new Date(
                                  Number(policy?.expiryDate)
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
                                {policy.coverageAmount} ETH
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
                                {policy.premiumAmount} ETH
                              </p>
                            </div>
                          </div>

                          {/* Stats Section */}
                          <div className="bg-slate-800/40 rounded-lg p-6 border border-slate-700/50 backdrop-blur-sm">
                            <h3 className="text-lg font-semibold text-slate-200 mb-6 flex items-center gap-2">
                              <TrendingUp className="w-5 h-5 text-cyan-400" />
                              Policy Statistics
                            </h3>

                            <div className="grid grid-cols-3 gap-8">
                              <div className="text-center space-y-2">
                                <div className="text-slate-400 text-sm font-medium">
                                  Days Remaining
                                </div>
                                <div className="text-cyan-400 font-bold text-2xl">
                                  {Math.floor(
                                    (policy.expiryDate - Date.now()) /
                                      1000 /
                                      3600 /
                                      24
                                  )}
                                </div>
                                <div className="text-slate-500 text-xs">
                                  Until expiry
                                </div>
                              </div>

                              <div className="text-center space-y-2">
                                <div className="text-slate-400 text-sm font-medium">
                                  Coverage Ratio
                                </div>
                                <div className="text-purple-400 font-bold text-2xl">
                                  {(
                                    Number(policy.coverageAmount) /
                                    Number(policy.premiumAmount)
                                  ).toFixed(1)}
                                  x
                                </div>
                                <div className="text-slate-500 text-xs">
                                  Coverage to premium
                                </div>
                              </div>

                              <div className="text-center space-y-2">
                                <div className="text-slate-400 text-sm font-medium">
                                  Status
                                </div>
                                <div
                                  className={`font-bold text-2xl ${
                                    policy.isActive
                                      ? "text-emerald-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  {policy.isActive ? "ACTIVE" : "INACTIVE"}
                                </div>
                                <div className="text-slate-500 text-xs">
                                  Current state
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Main Content Grid */}
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Claim History */}
                            <div className="lg:col-span-1">
                              <div className="bg-slate-800/40 rounded-lg p-6 border border-slate-700/50 backdrop-blur-sm h-full">
                                <h3 className="text-lg font-semibold text-blue-400 mb-6 flex items-center gap-2">
                                  <FileText className="w-5 h-5" />
                                  Claim History
                                </h3>

                                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                                  <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center">
                                    <FileText className="w-8 h-8 text-slate-400" />
                                  </div>
                                  <div className="text-center space-y-2">
                                    <p className="text-slate-300 font-medium">
                                      No claims submitted
                                    </p>
                                    <p className="text-slate-500 text-sm">
                                      Your policy is secure and active
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Policy Actions */}
                            <div className="lg:col-span-2">
                              <div className="bg-slate-800/40 rounded-lg p-6 border border-slate-700/50 backdrop-blur-sm h-full flex flex-col gap-4">
                                <h3 className="text-lg font-semibold text-purple-400 mb-6 flex items-center gap-2">
                                  <Zap className="w-5 h-5" />
                                  Policy Actions
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <Button
                                    onClick={() =>
                                      handlePremiumDeposit(policy.id)
                                    }
                                    className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white border-0 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 p-4 h-auto hover:scale-[1.02] group"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="p-2 bg-white/20 rounded-md group-hover:bg-white/30 transition-colors">
                                        <DollarSign className="w-4 h-4" />
                                      </div>
                                      <div className="text-left">
                                        <div className="font-semibold text-sm">
                                          Premium Deposit
                                        </div>
                                        <div className="text-emerald-100 text-xs opacity-90">
                                          Manual payment
                                        </div>
                                      </div>
                                    </div>
                                  </Button>

                                  <Button
                                    onClick={() => handleFundAI(policy.id)}
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 p-4 h-auto hover:scale-[1.02] group"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="p-2 bg-white/20 rounded-md group-hover:bg-white/30 transition-colors">
                                        <Bot className="w-4 h-4" />
                                      </div>
                                      <div className="text-left">
                                        <div className="font-semibold text-sm">
                                          Fund AI Agent
                                        </div>
                                        <div className="text-purple-100 text-xs opacity-90">
                                          Automated management
                                        </div>
                                      </div>
                                    </div>
                                  </Button>

                                  <Button
                                    onClick={() => handleSubmitClaim(policy.id)}
                                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white border-0 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 p-4 h-auto hover:scale-[1.02] group"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="p-2 bg-white/20 rounded-md group-hover:bg-white/30 transition-colors">
                                        <FileText className="w-4 h-4" />
                                      </div>
                                      <div className="text-left">
                                        <div className="font-semibold text-sm">
                                          Submit Claim
                                        </div>
                                        <div className="text-orange-100 text-xs opacity-90">
                                          File a claim
                                        </div>
                                      </div>
                                    </div>
                                  </Button>

                                  <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30 backdrop-blur-sm">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <div className="p-2 bg-cyan-500/20 rounded-md">
                                          <Activity className="w-4 h-4 text-cyan-400" />
                                        </div>
                                        <div>
                                          <div className="font-semibold text-white text-sm">
                                            Autopay
                                          </div>
                                          <div className="text-slate-400 text-xs">
                                            Automatic payments
                                          </div>
                                        </div>
                                      </div>
                                      <Switch
                                        checked={false}
                                        onCheckedChange={(checked) =>
                                          handleAutopayToggle(
                                            policy.id,
                                            checked
                                          )
                                        }
                                        className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500"
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
      </main>
    </div>
  );
}
