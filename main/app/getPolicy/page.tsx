"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Terminal } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function GetPolicyPage() {
  const [currentInput, setCurrentInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { type: "system", content: "Aegis Protocol Terminal v1.0 initialized..." },
    { type: "system", content: "AI Agent loaded successfully." },
    { type: "system", content: "Ready to generate your insurance policy." },
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
              "I can help you insure that asset. Let me gather some details...",
          },
        ]);
        setIsTyping(false);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-indigo-950 relative overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <Navbar />

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-4xl">
          {/* Terminal Window */}
          <div className="bg-black/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg shadow-2xl shadow-cyan-500/10 overflow-hidden">
            {/* Terminal Header */}
            <div className="flex items-center justify-between bg-slate-800/50 px-4 py-3 border-b border-cyan-500/20">
              <div className="flex items-center space-x-3">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-400 font-mono text-sm font-medium">
                  Aegis Protocol Terminal v1.0
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 transition-colors" />
                <button className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 transition-colors" />
                <button className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-400 transition-colors" />
              </div>
            </div>

            {/* Terminal Content */}
            <div className="p-6 font-mono text-sm">
              {/* Chat History */}
              <div className="space-y-2 mb-6 max-h-96 overflow-y-auto">
                {chatHistory.map((message, index) => (
                  <div key={index} className="flex">
                    {message.type === "system" && (
                      <div className="text-cyan-400">
                        <span className="text-slate-500">[SYSTEM]</span>{" "}
                        {message.content}
                      </div>
                    )}
                    {message.type === "user" && (
                      <div className="text-green-400">
                        <span className="text-slate-400">
                          [ Aegis-Agent@chain-protect ]$
                        </span>{" "}
                        {message.content}
                      </div>
                    )}
                    {message.type === "agent" && (
                      <div className="text-blue-300">
                        <span className="text-slate-400">[AI-AGENT]</span>{" "}
                        {message.content}
                        {isTyping && index === chatHistory.length - 1 && (
                          <span className="inline-block w-2 h-4 bg-blue-400 ml-1 animate-pulse" />
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Input Prompt */}
              <form onSubmit={handleSubmit} className="flex items-center">
                <div className="flex items-center text-green-400 mr-2">
                  <span className="text-slate-400">
                    [ Aegis-Agent@chain-protect ]$
                  </span>
                </div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={currentInput}
                    onChange={handleInputChange}
                    placeholder="What type of asset would you like to insure?"
                    className="w-full bg-transparent text-green-400 placeholder-slate-500 outline-none font-mono"
                    autoFocus
                  />
                  {!currentInput && (
                    <div className="absolute left-0 top-0 flex items-center">
                      <span className="text-slate-500">
                        What type of asset would you like to insure?
                      </span>
                      <span
                        className={`ml-1 w-2 h-4 bg-green-400 transition-opacity duration-100 ${
                          showCursor ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    </div>
                  )}
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
              <div className="mt-6 text-slate-500 text-xs space-y-1">
                <div>• Type your asset details to begin policy generation</div>
                <div>• Press Enter to submit your query</div>
                <div>• Use 'help' for available commands</div>
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div className="mt-4 flex items-center justify-between text-xs font-mono text-slate-400">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                AI Agent: Online
              </span>
              <span>Chain: Ethereum Mainnet</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>Session: Active</span>
              <span>Encryption: AES-256</span>
            </div>
          </div>
        </div>
      </div>

      {/* Glow effects */}
      <div className="absolute inset-0 bg-gradient-radial from-cyan-500/5 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
