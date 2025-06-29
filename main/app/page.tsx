"use client";

import { useState, useEffect } from "react";
import { Search, Shield, Layers, Zap, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";

export default function Landing() {
  const [inputValue, setInputValue] = useState("");
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);

  const placeholderTexts = [
    "I want insurance for my DeFi protocol...",
    "I want insurance for my meme coins...",
    "I want insurance for my NFT collection...",
    "I want insurance for my smart contracts...",
    "I want insurance for my yield farming...",
    "I want insurance for my bridge transactions...",
    "I want insurance for my wallet...",
    "I want insurance for my staking rewards...",
    "I want insurance for my liquidity pools...",
    "I want insurance for my DAO treasury...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholderTexts.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [placeholderTexts.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white overflow-hidden">
      {/* Top Boundary Gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-60"></div>
      <Navbar />
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Hero Section */}
      <main className="relative z-10 pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          {/* Main Headlines */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight">
            Protect Your On-Chain Assets with{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Autonomous Insurance
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Nova Protocol is a modular, AI-powered protocol securing DeFi,
            bridges, wallets, and smart contracts across chains.
          </p>

          {/* Central Input with Glow Effect */}
          <div className="relative max-w-2xl mx-auto mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl animate-pulse"></div>
            <div className="relative bg-black/40 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder={placeholderTexts[currentPlaceholder]}
                  value={inputValue}
                  onChange={(e: any) => setInputValue(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border-gray-600/50 rounded-xl text-white placeholder-gray-400 text-lg focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder:transition-all placeholder:duration-500"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 hover:opacity-100 transition-opacity pointer-events-none"></div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-cyan-500/25 transition-all">
              Explore Policies
            </Button>
            <Button
              variant="outline"
              className="bg-gray-800/50 text-white border-gray-600/50 hover:bg-gray-700/50 px-8 py-3 rounded-xl font-semibold text-lg"
            >
              Stake as LP
            </Button>
            <Button
              variant="outline"
              className="bg-gray-800/50 text-white border-gray-600/50 hover:bg-gray-700/50 px-8 py-3 rounded-xl font-semibold text-lg"
            >
              Submit Claim
            </Button>
          </div>

          {/* Chain Icons */}
          <div className="flex justify-center items-center space-x-8 mb-20">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-2xl flex items-center justify-center mb-2 shadow-lg hover:shadow-purple-500/20 transition-all hover:scale-105">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">Ξ</span>
                </div>
              </div>
              <span className="text-gray-400 text-sm">Ethereum</span>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-2xl flex items-center justify-center mb-2 shadow-lg hover:shadow-purple-500/20 transition-all hover:scale-105">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <Layers className="w-4 h-4 text-white" />
                </div>
              </div>
              <span className="text-gray-400 text-sm">Polygon</span>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-2xl flex items-center justify-center mb-2 shadow-lg hover:shadow-red-500/20 transition-all hover:scale-105">
                <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">▲</span>
                </div>
              </div>
              <span className="text-gray-400 text-sm">Avalanche</span>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-800/30 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                AI-Powered Protection
              </h3>
              <p className="text-gray-400">
                Advanced algorithms continuously monitor and assess risks across
                multiple blockchain networks.
              </p>
            </div>

            <div className="bg-gray-800/30 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Cross-Chain Coverage
              </h3>
              <p className="text-gray-400">
                Seamless protection across Ethereum, Polygon, Avalanche, and
                other major networks.
              </p>
            </div>

            <div className="bg-gray-800/30 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant Claims</h3>
              <p className="text-gray-400">
                Automated claim processing with smart contracts for rapid
                payouts when conditions are met.
              </p>
            </div>
          </div>
        </div>
        {/* Footer */}
        <footer className="relative z-10 mt-32 border-t border-gray-700/50">
          <div className="max-w-6xl mx-auto px-4 py-16">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              {/* Company Info */}
              <div className="md:col-span-1">
                <div className="flex items-center space-x-2 mb-4">
                  <Shield className="w-8 h-8 text-cyan-400" />
                  <span className="font-bold text-2xl">Nova Protocol</span>
                </div>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  The future of decentralized insurance. Protecting your digital
                  assets with AI-powered autonomous coverage across all major
                  blockchains.
                </p>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="w-10 h-10 bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-xl flex items-center justify-center hover:bg-gray-700/50 transition-all"
                  >
                    <span className="text-cyan-400 font-bold">𝕏</span>
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-xl flex items-center justify-center hover:bg-gray-700/50 transition-all"
                  >
                    <span className="text-cyan-400 font-bold">D</span>
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-xl flex items-center justify-center hover:bg-gray-700/50 transition-all"
                  >
                    <span className="text-cyan-400 font-bold">G</span>
                  </a>
                </div>
              </div>

              {/* Product Links */}
              <div>
                <h3 className="font-semibold text-lg mb-4 text-white">
                  Product
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Insurance Policies
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Liquidity Pools
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Claims Portal
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Risk Assessment
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Analytics
                    </a>
                  </li>
                </ul>
              </div>

              {/* Resources Links */}
              <div>
                <h3 className="font-semibold text-lg mb-4 text-white">
                  Resources
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      API Reference
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Whitepaper
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Security Audits
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Bug Bounty
                    </a>
                  </li>
                </ul>
              </div>

              {/* Company Links */}
              <div>
                <h3 className="font-semibold text-lg mb-4 text-white">
                  Company
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Careers
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Press Kit
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gray-800/30 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-8 mb-12">
              <div className="max-w-2xl mx-auto text-center">
                <h3 className="text-2xl font-semibold mb-4">Stay Updated</h3>
                <p className="text-gray-400 mb-6">
                  Get the latest updates on new insurance products, protocol
                  upgrades, and security insights.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                  />
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-2 rounded-lg font-semibold">
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-700/50">
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-gray-400 text-sm">
                <p>&copy; 2024 Nova Protocol Protocol. All rights reserved.</p>
                <div className="flex space-x-6">
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                  <a href="#" className="hover:text-white transition-colors">
                    Cookie Policy
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <span className="text-gray-400 text-sm">Secured by</span>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                    <Shield className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-green-400 text-sm font-semibold">
                    Multi-Sig
                  </span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
