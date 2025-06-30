'use client';

import React, { useState, useEffect } from 'react';
import { useWriteContract, useReadContract } from 'wagmi';
import { rugPullAbi, rugPullAddress } from '../abi';

export default function RugPullPage() {
    const [isClaimSubmitted, setIsClaimSubmitted] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isTimerComplete, setIsTimerComplete] = useState(false);

    // Using wagmi's useWriteContract hook to interact with the smart contract
    const { writeContractAsync, error, isError, isPending, isSuccess } =
        useWriteContract();

    // Using wagmi's useReadContract hook to read data from the smart contract
    const { data: claimData, isLoading: isClaimLoading } = useReadContract({
        address: rugPullAddress,
        abi: rugPullAbi,
        functionName: 'isRugPull', // Replace with the actual function name to get claim status
        args: [], // Add any required arguments for the function here
    });

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isClaimSubmitted && timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining((prev) => {
                    if (prev <= 1) {
                        setIsTimerComplete(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isClaimSubmitted, timeRemaining]);

    const handleSubmitClaim = () => {
        // Call the smart contract function to submit the claim
        writeContractAsync({
            address: rugPullAddress,
            abi: rugPullAbi,
            functionName: 'sendRugPullCheckRequest',
            args: [15703], // Add any required arguments for the function here
        }).then((tx) => {
            console.log('Claim submitted successfully:', tx);
        }).catch((err) => {
            console.error('Error submitting claim:', err);
            setIsClaimSubmitted(false);
            setTimeRemaining(0);
            setIsTimerComplete(false);
        });
        
        setTimeRemaining(300); // Reset timer to 5 minutes
        setIsTimerComplete(false);
        setIsClaimSubmitted(true);
    };

    const handleCheckResult = () => {
        // call the smart contract function to check the claim result
        console.log('Checking claim result...');
        console.log('Claim Data:', claimData);
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const resetClaim = () => {
        setIsClaimSubmitted(false);
        setTimeRemaining(0);
        setIsTimerComplete(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 w-full max-w-md shadow-2xl">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">Rug Pull Claim</h1>
                    <p className="text-gray-300 mb-8">Submit your claim for verification</p>

                    {!isClaimSubmitted ? (
                        <div className="space-y-6">
                            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                                <h2 className="text-lg font-semibold text-white mb-3">Claim Details</h2>
                                <p className="text-gray-300 text-sm">
                                    Your claim will be processed and reviewed within 5 minutes after submission.
                                </p>
                            </div>

                            <button
                                onClick={handleSubmitClaim}
                                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                                Submit Claim
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {!isTimerComplete ? (
                                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                                    <div className="text-center">
                                        <div className="mb-4">
                                            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/20 rounded-full mb-4">
                                                <svg className="w-8 h-8 text-yellow-400 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                                                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                                                </svg>
                                            </div>
                                            <h2 className="text-xl font-semibold text-white mb-2">Processing Claim</h2>
                                            <p className="text-gray-300 text-sm mb-4">Your claim is being reviewed...</p>
                                        </div>

                                        <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/20">
                                            <p className="text-yellow-400 text-sm mb-2">Time Remaining</p>
                                            <div className="text-3xl font-mono text-yellow-400 font-bold">
                                                {formatTime(timeRemaining)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                                    <div className="text-center">
                                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                                            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <h2 className="text-xl font-semibold text-white mb-2">Review Complete</h2>
                                        <p className="text-gray-300 text-sm">Your claim has been processed and is ready for review.</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col space-y-3">
                                {isTimerComplete ? (
                                    <button
                                        onClick={handleCheckResult}
                                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                                    >
                                        Check Result
                                    </button>
                                ) : (
                                    <button
                                        disabled
                                        className="w-full bg-gray-500/50 text-gray-300 font-semibold py-4 px-6 rounded-lg cursor-not-allowed"
                                    >
                                        Processing...
                                    </button>
                                )}

                                <button
                                    onClick={resetClaim}
                                    className="w-full bg-gray-600/50 hover:bg-gray-600/70 text-gray-300 hover:text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 border border-gray-500/30"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}