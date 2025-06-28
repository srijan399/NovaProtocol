"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Terminal } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function GetPolicyPage() {
  const [currentInput, setCurrentInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { type: "system", content: "💀 AEGIS BREACH PROTOCOL INITIATED..." },
    { type: "system", content: "🔓 FIREWALL BYPASSED - ACCESS GRANTED" },
    { type: "system", content: "⚡ SHADOW INSURANCE MODULE LOADED" },
    { type: "system", content: "🎯 READY TO EXPLOIT... I MEAN, INSURE YOUR ASSETS" },
    { type: "warning", content: "⚠️  WARNING: This session is being monitored ⚠️" },
  ]);

  // Blinking cursor effect
  const [showCursor, setShowCursor] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInput.trim()) {
      setChatHistory((prev) => [
        ...prev,
        { type: "user", content: currentInput },
        { type: "agent", content: "Processing your request..." },
      ]);
      setCurrentInput("");
      setIsTyping(true);

      // Simulate AI response
      setTimeout(() => {
        setChatHistory((prev) => [
          ...prev.slice(0, -1),
          {
            type: "agent",
            content:
              "🔍 ANALYZING TARGET ASSET... CALCULATING RISK VECTORS... INSURANCE TERMS OPTIMIZED FOR MAXIMUM COVERAGE 💰",
          },
        ]);
        setIsTyping(false);
      }, 2000);
    }
  };

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
          <div className="bg-black/95 backdrop-blur-sm border border-green-500/40 rounded-lg shadow-2xl shadow-green-500/20 overflow-hidden relative">
            {/* Glitch effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 via-transparent to-red-900/10 animate-pulse pointer-events-none" />
            
            {/* Terminal Header */}
            <div className="flex items-center justify-between bg-gray-900/80 px-4 py-3 border-b border-green-500/30 relative">
              <div className="flex items-center space-x-3">
                <Terminal className="w-4 h-4 text-green-400 animate-pulse" />
                <span className="text-green-400 font-mono text-sm font-medium tracking-wider">
                  ⚠️ AEGIS_PROTOCOL_BREACH_v2.3.7 ⚠️
                </span>
                <span className="text-red-400 text-xs animate-pulse">[UNAUTHORIZED ACCESS]</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-xs text-slate-400">Policy ID: AEG-2025-{Math.random().toString(36).substr(2, 6).toUpperCase()}</div>
                <div className="flex items-center space-x-2">
                  <button className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 transition-colors" />
                  <button className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 transition-colors" />
                  <button className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-400 transition-colors animate-pulse" />
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
              <div className="space-y-2 mb-6 max-h-56 overflow-y-auto">
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
                      <div className="text-green-400">
                        <span className="text-gray-400">
                          [ SHADOW_USER@darknet-ins ]#
                        </span>{" "}
                        <span className="text-green-300">{message.content}</span>
                      </div>
                    )}
                    {message.type === "agent" && (
                      <div className="text-cyan-300">
                        <span className="text-gray-400">[SHADOW-AI]</span>{" "}
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
                <div className="flex items-center text-green-400 mr-2">
                  <span className="text-gray-400">
                    [ SHADOW_USER@darknet-ins ]#
                  </span>
                </div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={currentInput}
                    onChange={handleInputChange}
                    placeholder="Enter asset to exploit... I mean insure 🔓"
                    className="w-full bg-transparent text-green-400 placeholder-gray-500 outline-none font-mono tracking-wide"
                    autoFocus
                  />
                  {currentInput && (
                    <span
                      className={`absolute top-0 bg-green-400 w-2 h-4 transition-opacity duration-100 ${
                        showCursor ? "opacity-100" : "opacity-0"
                      }`}
                      style={{ left: `${currentInput.length * 0.6}em` }}
                    />
                  )}
                </div>
              </form>

              {/* Help Text */}
              <div className="mt-6 text-gray-500 text-xs space-y-1">
                <div>💀 Type asset details to begin shadow policy generation</div>
                <div>⚡ Press Enter to execute command</div>
                <div>🔍 Use 'hack --help' for advanced commands</div>
                <div className="text-red-400 animate-pulse">⚠️ Remember: We were never here...</div>
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div className="mt-4 flex items-center justify-between text-xs font-mono text-gray-400">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                AI Agent: Online
              </span>
              <span className="text-red-400 animate-pulse">Chain: DARKNET</span>
              <span className="text-yellow-400">⚡ BREACH_MODE</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-green-400">Session: ANONYMOUS</span>
              <span className="text-red-400 animate-pulse">Encryption: BYPASSED</span>
              <span className="text-yellow-400">🔓 ROOT_ACCESS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced glow effects */}
      <div className="absolute inset-0 bg-gradient-radial from-green-500/10 via-transparent to-red-900/5 pointer-events-none" />
      
      {/* Moving shadows */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400/50 to-transparent animate-pulse" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-400/50 to-transparent animate-pulse" />
    </div>
  );
}
