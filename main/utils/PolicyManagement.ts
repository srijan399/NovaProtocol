import { policyManagerAbi, policyManagerAddress } from "@/app/abi";
import { parseEther } from "viem";
import { useWriteContract, useReadContract } from "wagmi";

interface createData {
  policyType: number;
  _coverageAmount: number;
  _premiumAmount: number;
  _duration: Date;
  uri: string;
  _riskLevel: number;
}

const usePolicyManagement = () => {
  const { writeContractAsync, error, isError, isPending, isSuccess } =
    useWriteContract();

  const createPolicy = async (createData: createData) => {
    console.log("Creating policy with data:", createData);
    const {
      policyType,
      _coverageAmount,
      _premiumAmount,
      _duration,
      uri,
      _riskLevel,
    } = createData;

    // Calculate the duration in seconds from current date to the provided date
    const currentDate = new Date();
    const durationInSeconds = Math.floor(
      (_duration.getTime() - currentDate.getTime()) / 1000
    );

    const data = await writeContractAsync({
      abi: policyManagerAbi,
      address: policyManagerAddress,
      functionName: "createPolicy",
      args: [
        policyType,
        parseEther(_coverageAmount.toString()),
        parseEther(_premiumAmount.toString()),
        durationInSeconds,
        uri,
        _riskLevel,
      ],
    });

    return data;
  };

  return {
    createPolicy,
    error,
    isError,
    isPending,
    isSuccess,
  };
};

export const usePolicyDetails = (policyId: number | null) => {
  return useReadContract({
    address: policyManagerAddress,
    abi: policyManagerAbi,
    functionName: "getPolicyDetailsJson",
    args: [policyId],
  });
};

export const usePoliciesGet = () => {
  return useReadContract({
    address: policyManagerAddress,
    abi: policyManagerAbi,
    functionName: "getAllPoliciesJson",
    args: [],
  });
};

export const useGetUserPolicies = (address: string) => {
  return useReadContract({
    address: policyManagerAddress,
    abi: policyManagerAbi,
    functionName: "getUserPoliciesJson",
    args: [address],
  });
};

export default usePolicyManagement;
