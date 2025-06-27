"use client";

import { createConfig, http } from "wagmi";
import { cookieStorage, createStorage } from "wagmi";
import { getDefaultConfig } from "connectkit";
import { sepolia, avalancheFuji } from "wagmi/chains";

// Create config outside of component to prevent re-initialization
export const config = createConfig(
    getDefaultConfig({
        enableFamily: false,
        chains: [sepolia, avalancheFuji],
        transports: {
            // RPC URL for each chain
            [sepolia.id]: http(),
            [avalancheFuji.id]: http(),
        },
        storage: createStorage({
            storage: cookieStorage,
        }),

        // Required API Keys
        walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "default_project_id",

        // Required App Info
        appName: "Aegis",

        // Optional App Info
        appDescription: "Decentralized on-chain insurance platform",
        // appUrl: "https://family.co", // your app's url
        // appIcon: "https://family.co/logo.png",
    })
);