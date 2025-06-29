"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Terminal } from "lucide-react";
import Navbar from "@/components/Navbar";
import { PolicyPreviewDialog } from "@/components/PolicyPreviewDialog";
import usePolicyManagement from "@/utils/PolicyManagement";
import { useAccount } from "wagmi";

interface ChatMessage {
  type: "system" | "user" | "agent" | "warning";
  content: string;
}

interface PolicyPreviewData {
  policyType: string;
  coverageAmount: number;
  duration: number;
  paymentType: string;
  premiumAmount: number;
  riskLevel: string;
  autoPayment: boolean;
}

interface ContractData {
  policyType: number;
  _coverageAmount: number;
  _premiumAmount: number;
  _duration: Date;
  uri: string;
  _riskLevel: number;
}

export default function GetPolicyPage() {
  const [currentInput, setCurrentInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<PolicyPreviewData | null>(null);
  const [contractData, setContractData] = useState<ContractData | null>(null);
  const [calculationBreakdown, setCalculationBreakdown] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const { address } = useAccount();
  const chatHistoryRef = useRef<HTMLDivElement>(null);
  const { createPolicy, isPending, isSuccess, error } = usePolicyManagement();

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { type: "system", content: "🛡️ Welcome to Nova Protocol Onchain Insurance." },
    { type: "system", content: "🔒 Secure connection established." },
    { type: "system", content: "💡 Protect your assets from protocol risks and exploits." },
    { type: "system", content: "🚀 Ready to insure your onchain holdings." },
    { type: "warning", content: "ℹ️  For your safety, all activity is confidential and protected." },
    { type: "agent", content: "Hello! I'm Nova, your AI insurance assistant. How can I help you protect your crypto assets today?" },
  ]);

  // Blinking cursor effect
  const [showCursor, setShowCursor] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom when chat history changes
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInput.trim()) {
      const userMessage = currentInput.trim();
      setChatHistory((prev) => [
        ...prev,
        { type: "user", content: userMessage },
      ]);
      setCurrentInput("");
      setIsTyping(true);

      try {
        // Add user message to chat messages for API
        const updatedMessages = [...chatMessages, { role: 'user' as const, content: userMessage }];
        setChatMessages(updatedMessages);

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ messages: updatedMessages }),
        });

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        // Add AI response to chat history
        setChatHistory((prev) => [
          ...prev,
          { type: "agent", content: data.message },
        ]);

        // Add AI response to chat messages
        setChatMessages([...updatedMessages, { role: 'assistant', content: data.message }]);

        // Check if preview should be shown
        if (data.showPreview && data.previewData && data.contractData) {
          setPreviewData(data.previewData);
          setContractData(data.contractData);
          setCalculationBreakdown(data.calculationBreakdown || null);
          setShowPreview(true);
        }

      } catch (error) {
        console.error('Chat error:', error);
        setChatHistory((prev) => [
          ...prev,
          { type: "agent", content: "I apologize, but I encountered an error. Please try again." },
        ]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handlePolicyConfirm = async (contractData: ContractData) => {
    try {
      console.log('Creating policy with data:', contractData);
      // console.log('previewData:', previewData);
      if (previewData?.autoPayment) {
        const res = await fetch('/api/deployAgent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userAddress: `${address}`,
            subscriptionRate: previewData.premiumAmount,
          }),
        });
        const response = await res.json();
        if (response.error) {
          throw new Error(response.error);
        }
      }

      await createPolicy(contractData);

      setShowPreview(false);
      setChatHistory((prev) => [
        ...prev,
        { type: "agent", content: "🎉 Your policy has been created successfully! Your agent is now active and will handle automatic payments." },
        { type: "system", content: "✅ Policy deployed to blockchain" },
        { type: "system", content: "🤖 Auto-payment agent activated" },
      ]);
    } catch (error) {
      console.error('Policy creation error:', error);
      setChatHistory((prev) => [
        ...prev,
        { type: "agent", content: "❌ There was an error creating your policy. Please try again or contact support." },
      ]);
    }
  };

  // Handle successful policy creation
  useEffect(() => {
    if (isSuccess) {
      setChatHistory((prev) => [
        ...prev,
        { type: "system", content: "🎊 Transaction confirmed! Your insurance policy is now active." },
      ]);
    }
  }, [isSuccess]);

  // Handle policy creation errors
  useEffect(() => {
    if (error) {
      setChatHistory((prev) => [
        ...prev,
        { type: "warning", content: `❌ Transaction failed: ${error.message || 'Unknown error'}` },
      ]);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
      {/* Matrix-like grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />

      {/* Animated scanlines */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,0,0.02)_50%)] bg-[length:100%_4px] animate-pulse" />

      {/* Glitch overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-900/5 to-transparent animate-pulse" />

      <Navbar />

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-4xl">
          {/* Terminal Window */}
          <div className="bg-black/95 backdrop-blur-sm border border-blue-500/40 rounded-lg shadow-2xl shadow-blue-500/20 overflow-hidden relative">
            {/* Glitch effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 via-transparent to-red-900/10 animate-pulse pointer-events-none" />

            {/* Terminal Header */}
            <div className="flex items-center justify-between bg-gray-900/80 px-4 py-3 border-b border-blue-500/30 relative">
              <div className="flex items-center space-x-3">
                <Terminal className="w-4 h-4 text-blue-400 animate-pulse" />
                <span className="text-blue-400 font-mono text-sm font-medium tracking-wider">
                  🏦 NOVA_PROTOCOL_v0.0.1 🛡️
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-xs text-slate-400">Policy ID: NOV-2025-{Math.random().toString(36).substr(2, 6).toUpperCase()}</div>
                <div className="flex items-center space-x-2">
                  <button className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 transition-colors" />
                  <button className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 transition-colors" />
                  <button className="w-3 h-3 bg-blue-500 rounded-full hover:bg-blue-400 transition-colors animate-pulse" />
                </div>
              </div>
            </div>

            {/* Terminal Content */}
            <div className="p-6 font-mono text-sm relative">
              {/* Floating code fragments */}
              <div className="absolute top-2 right-4 text-green-400/30 text-xs animate-pulse">
                &lt;/exploit&gt;
              </div>

              {/* Chat History */}
              <div
                ref={chatHistoryRef}
                className="space-y-2 mb-6 max-h-56 overflow-y-auto scroll-smooth"
              >
                {chatHistory.map((message, index) => (
                  <div key={index} className="flex">
                    {message.type === "system" && (
                      <div className="text-green-400 tracking-wide">
                        <span className="text-gray-500">[SYSTEM]</span>{" "}
                        <span className="text-green-300">{message.content}</span>
                      </div>
                    )}
                    {message.type === "warning" && (
                      <div className="text-red-400 tracking-wide animate-pulse">
                        <span className="text-red-500">[ALERT]</span>{" "}
                        <span className="text-red-300">{message.content}</span>
                      </div>
                    )}
                    {message.type === "user" && (
                      <div className="text-blue-400">
                        <span className="text-gray-400">
                          [ YOU ]#
                        </span>{" "}
                        <span className="text-blue-300">{message.content}</span>
                      </div>
                    )}
                    {message.type === "agent" && (
                      <div className="text-cyan-300">
                        <span className="text-gray-400">[ NOVA-AI ]</span>{" "}
                        <span className="text-cyan-200">{message.content}</span>
                        {isTyping && index === chatHistory.length - 1 && (
                          <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse" />
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Input Prompt */}
              <form onSubmit={handleSubmit} className="flex items-center">
                <div className="flex items-center text-blue-400 mr-2">
                  <span className="text-gray-400">
                    [ Nova-Agent@chain-protect ]#
                  </span>
                </div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={currentInput}
                    onChange={handleInputChange}
                    placeholder="Enter asset to insure 🔒"
                    className="w-full bg-transparent text-green-400 placeholder-gray-500 outline-none font-mono tracking-wide"
                    autoFocus
                  />
                  {currentInput && (
                    <span
                      className={`absolute top-0 bg-blue-400 w-2 h-4 transition-opacity duration-100 ${showCursor ? "opacity-100" : "opacity-0"
                        }`}
                      style={{ left: `${currentInput.length * 0.6}em` }}
                    />
                  )}
                </div>
              </form>

              {/* Help Text */}
              <div className="mt-6 text-gray-400 text-xs space-y-1">
                <div>📝 Enter your asset details to start your insurance policy</div>
                <div>✅ Press Enter to submit your request securely</div>
                <div className="text-green-400 animate-pulse">🔒 Your information is confidential and protected</div>
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div className="mt-4 flex items-center justify-between text-xs font-mono text-gray-400">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse" />
                AI Agent: Online
              </span>
              <span className="text-blue-400">Chain: MAINNET</span>
              <span className="text-green-400">🛡️ PROTECTED_MODE</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-green-400">Session: SECURE</span>
              <span className="text-blue-400">Encryption: ACTIVE</span>
              <span className="text-green-400">🔒 TRUSTED_ACCESS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced glow effects */}
      <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 via-transparent to-red-900/5 pointer-events-none" />

      {/* Moving shadows */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent animate-pulse" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-400/50 to-transparent animate-pulse" />

      {/* Policy Preview Dialog */}
      {showPreview && previewData && contractData && (
        <PolicyPreviewDialog
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          previewData={previewData}
          contractData={contractData}
          calculationBreakdown={calculationBreakdown}
          onConfirm={handlePolicyConfirm}
          isCreating={isPending}
        />
      )}
    </div>
  );
}
