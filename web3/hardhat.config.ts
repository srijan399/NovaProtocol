import { HardhatUserConfig } from "hardhat/config";
import "dotenv/config";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-verify";

const { RPC_URL_ETH, PRIVATE_KEY, ETHERSCAN_API, FUJI_RPC_URL, FUJI_API_KEY } =
    process.env;

const config: HardhatUserConfig = {
    solidity: "0.8.28",
    networks: {
        sepolia: {
            url: RPC_URL_ETH || "",
            accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
        },
        fuji: {
            url: FUJI_RPC_URL || "",
            accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
        },
    },
    etherscan: {
        apiKey: {
            sepolia: `${ETHERSCAN_API}`,
            avalancheFujiTestnet: `${FUJI_API_KEY}`,
        },
    },
    sourcify: {
        enabled: true,
    },
};

export default config;
