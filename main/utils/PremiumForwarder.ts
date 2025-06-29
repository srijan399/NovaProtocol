import { premiumForwarderAbi, premiumForwarderAddress } from "@/app/abi";
import { useReadContract, useWriteContract } from "wagmi";
import { usePolicyDetails } from "./PolicyManagement";
import { parseEther } from "viem";

const usePremiumForwarder = () => {
    const { writeContractAsync } = useWriteContract();

    const enableAutopay = async (policyId: number) => {
        const tx = await writeContractAsync({
            abi: premiumForwarderAbi,
            address: premiumForwarderAddress,
            functionName: "enableAutoPay",
            args: [policyId],
        });

        return tx;
    };

    const disableAutopay = async (policyId: number) => {
        const tx = await writeContractAsync({
            abi: premiumForwarderAbi,
            address: premiumForwarderAddress,
            functionName: "disableAutoPay",
            args: [policyId],
        });

        return tx;
    };

    const manualPremiumPayment = async (
        policyId: number,
        premiumAmount: number
    ) => {
        console.log(
            "Processing premium deposit for policy:",
            policyId,
            premiumAmount * 10 ** 18
        );
        const tx = await writeContractAsync({
            abi: premiumForwarderAbi,
            address: premiumForwarderAddress,
            functionName: "manualPremiumPayment",
            args: [policyId],
            value: BigInt(premiumAmount * 10 ** 18),
        });

        return tx;
    };

    return {
        enableAutopay,
        disableAutopay,
        manualPremiumPayment,
    };
};

export const useAutopayStatus = (policyId: number) => {
    return useReadContract({
        address: premiumForwarderAddress,
        abi: premiumForwarderAbi,
        functionName: "autopayEnabled",
        args: [policyId],
    });
};

export default usePremiumForwarder;
