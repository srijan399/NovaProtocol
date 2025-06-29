"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Shield,
  FileText,
  Zap,
  DollarSign,
  Bot,
  Calendar,
  TrendingUp,
  Activity,
} from "lucide-react";

// Mock data for the policy
const policy = {
  id: "1",
  metadataUri: "ipfs://QmHash1",
  isActive: true,
  riskLevel: 1,
  startDate: "1719532800", // 6/28/2024
  expiryDate: "1751068800", // 6/28/2025
  coverageAmount: "1",
  premiumAmount: "0.05",
};

const riskLevelNames = ["Low", "Medium", "High"];

const getStatusColor = (status: string) => {
  return status === "Active"
    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
    : "bg-red-500/20 text-red-400 border-red-500/30";
};

const getRiskLevelColor = (level: number) => {
  const colors = [
    "bg-green-500/20 text-green-400 border-green-500/30",
    "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    "bg-red-500/20 text-red-400 border-red-500/30",
  ];
  return colors[level] || colors[0];
};

export function PolicyDialog() {
  const [open, setOpen] = useState(false);

  const handlePremiumDeposit = (id: string) => {
    console.log("Premium deposit for policy:", id);
  };

  const handleFundAI = (id: string) => {
    console.log("Fund AI for policy:", id);
  };

  const handleSubmitClaim = (id: string) => {
    console.log("Submit claim for policy:", id);
  };

  const handleAutopayToggle = (id: string, checked: boolean) => {
    console.log("Toggle autopay for policy:", id, checked);
  };

  const daysRemaining = Math.ceil(
    (Number(policy?.expiryDate) * 1000 - Date.now()) / (1000 * 60 * 60 * 24)
  );

  const coverageRatio = (
    Number(policy.coverageAmount) / Number(policy.premiumAmount)
  ).toFixed(1);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 text-white border-0 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 py-3 font-semibold">
          <Shield className="w-4 h-4 mr-2" />
          Manage Policy
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-slate-900/95 border-slate-700/50 text-white max-w-[1200px] w-[95vw] max-h-[90vh] overflow-y-auto backdrop-blur-xl">
        <DialogHeader className="pb-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <DialogTitle className="text-2xl bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Policy {policy.id}
              </DialogTitle>
              <p className="text-slate-400 text-sm font-mono break-all">
                {policy.metadataUri}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge
              className={`${getStatusColor(
                policy.isActive ? "Active" : "Inactive"
              )} border px-3 py-1.5 font-medium`}
            >
              {policy.isActive ? "Active" : "Inactive"}
            </Badge>
            <Badge
              className={`${getRiskLevelColor(
                policy.riskLevel
              )} border px-3 py-1.5 font-medium`}
            >
              {riskLevelNames[policy.riskLevel]} Risk
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-8">
          {/* Policy Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700/50 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Calendar className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-slate-300 text-sm font-medium">
                  Start Date
                </span>
              </div>
              <p className="text-white font-semibold text-lg">
                {new Date(
                  Number(policy?.startDate) * 1000
                ).toLocaleDateString()}
              </p>
            </div>

            <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700/50 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Calendar className="w-4 h-4 text-orange-400" />
                </div>
                <span className="text-slate-300 text-sm font-medium">
                  End Date
                </span>
              </div>
              <p className="text-white font-semibold text-lg">
                {new Date(
                  Number(policy?.expiryDate) * 1000
                ).toLocaleDateString()}
              </p>
            </div>

            <div className="bg-emerald-900/30 rounded-xl p-6 border border-emerald-500/30 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <Shield className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-emerald-300 text-sm font-medium">
                  Coverage
                </span>
              </div>
              <p className="text-emerald-400 font-bold text-xl">
                {policy.coverageAmount} ETH
              </p>
            </div>

            <div className="bg-blue-900/30 rounded-xl p-6 border border-blue-500/30 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <DollarSign className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-blue-300 text-sm font-medium">
                  Premium
                </span>
              </div>
              <p className="text-blue-400 font-bold text-xl">
                {policy.premiumAmount} ETH
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-slate-800/40 rounded-xl p-8 border border-slate-700/50 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-slate-200 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              Policy Statistics
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-2">
                <div className="text-slate-400 text-sm font-medium">
                  Days Remaining
                </div>
                <div className="text-cyan-400 font-bold text-3xl">
                  {daysRemaining}
                </div>
                <div className="text-slate-500 text-xs">Until expiry</div>
              </div>

              <div className="text-center space-y-2">
                <div className="text-slate-400 text-sm font-medium">
                  Coverage Ratio
                </div>
                <div className="text-purple-400 font-bold text-3xl">
                  {coverageRatio}x
                </div>
                <div className="text-slate-500 text-xs">
                  Coverage to premium
                </div>
              </div>

              <div className="text-center space-y-2">
                <div className="text-slate-400 text-sm font-medium">Status</div>
                <div
                  className={`font-bold text-3xl ${
                    policy.isActive ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {policy.isActive ? "ACTIVE" : "INACTIVE"}
                </div>
                <div className="text-slate-500 text-xs">Current state</div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Claim History */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800/40 rounded-xl p-8 border border-slate-700/50 backdrop-blur-sm h-full">
                <h3 className="text-lg font-semibold text-blue-400 mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Claim History
                </h3>

                <div className="flex flex-col items-center justify-center py-12 space-y-4">
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
              <div className="bg-slate-800/40 rounded-xl p-8 border border-slate-700/50 backdrop-blur-sm h-full">
                <h3 className="text-lg font-semibold text-purple-400 mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Policy Actions
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Button
                    onClick={() => handlePremiumDeposit(policy.id)}
                    className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white border-0 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 p-6 h-auto hover:scale-[1.02] group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">Premium Deposit</div>
                        <div className="text-emerald-100 text-sm opacity-90">
                          Manual payment
                        </div>
                      </div>
                    </div>
                  </Button>

                  <Button
                    onClick={() => handleFundAI(policy.id)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 p-6 h-auto hover:scale-[1.02] group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">Fund AI Agent</div>
                        <div className="text-purple-100 text-sm opacity-90">
                          Automated management
                        </div>
                      </div>
                    </div>
                  </Button>

                  <Button
                    onClick={() => handleSubmitClaim(policy.id)}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white border-0 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 p-6 h-auto hover:scale-[1.02] group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">Submit Claim</div>
                        <div className="text-orange-100 text-sm opacity-90">
                          File a claim
                        </div>
                      </div>
                    </div>
                  </Button>

                  <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600/30 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-cyan-500/20 rounded-lg">
                          <Activity className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">
                            Autopay
                          </div>
                          <div className="text-slate-400 text-sm">
                            Automatic payments
                          </div>
                        </div>
                      </div>
                      <Switch
                        checked={false}
                        onCheckedChange={(checked) =>
                          handleAutopayToggle(policy.id, checked)
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
  );
}
