"use client";
import { Input } from "@/components/ui/input";
import usePolicyManagement, {
  useGetUserPolicies,
  usePoliciesGet,
  usePolicyDetails,
} from "@/utils/PolicyManagement";
import { useEffect, useState } from "react";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import { ConnectKitButton } from "connectkit";

interface createData {
  policyType: number;
  _coverageAmount: number;
  _premiumAmount: number;
  _duration: Date;
  uri: string;
  _riskLevel: number;
}

interface PolicyDataType {
  id: number;
  address: string;
  policyType: number;
  coverageAmount: number;
  premiumAmount: number;
  riskLevel: number;
  startDate: number;
  expiryDate: number;
  isActive: boolean;
  metadataUri: string;
}

const test = () => {
  const { address } = useAccount();
  console.log("Address:", address);
  const { createPolicy, isPending } = usePolicyManagement();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | undefined>();
  const [policyId, setPolicyId] = useState<number | null>(null);
  const [policyData, setPolicyData] = useState<PolicyDataType>({
    id: 0,
    address: "",
    policyType: 0,
    coverageAmount: 0,
    premiumAmount: 0,
    riskLevel: 0,
    startDate: new Date().getTime(),
    expiryDate: new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
    isActive: false,
    metadataUri: "",
  });
  const [_policies, setPolicies] = useState<PolicyDataType[]>([]);
  const [_userPolicies, setUserPolicies] = useState<PolicyDataType[]>([]);

  const { data: receipt, isLoading: isReceiptLoading } =
    useWaitForTransactionReceipt({
      hash: txHash as `0x${string}`,
    });

  const {
    data: policyDetails,
    refetch: refetchPolicyDetails,
    isFetching,
    status,
  } = usePolicyDetails(policyId);

  const {
    data: policiesList,
    refetch: refetchPolicies,
    isFetching: isFetchingPolicies,
    status: policiesStatus,
  } = usePoliciesGet();

  const {
    data: userPolicies,
    refetch: refetchUserPolicies,
    isFetching: isFetchingUserPolicies,
    status: userPoliciesStatus,
  } = useGetUserPolicies(address as `0x${string}`);

  useEffect(() => {
    if (isPending) {
      console.log("Transaction is pending...");
    }
  }, [isPending]);

  // Use useEffect to handle receipt
  useEffect(() => {
    if (receipt) {
      console.log("Transaction receipt:", receipt);
      setSuccess(true);
      setLoading(false);
    }
  }, [receipt]);

  const handleCreatePolicy = async () => {
    const createData: createData = {
      policyType: 1,
      _coverageAmount: 1000,
      _premiumAmount: 100,
      _duration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      uri: "https://example.com/policy",
      _riskLevel: 2,
    };

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const tx = await createPolicy(createData);
      setTxHash(tx);
      console.log("Transaction submitted:", tx);
    } catch (err: any) {
      console.error("Policy creation failed:", err);
      setSuccess(false);
      setError(
        `Transaction failed: ${err.message || "Unknown error occurred"}`
      );
      setLoading(false);
    }
  };

  const handleGetPolicyDetails = async () => {
    if (policyId === null) {
      setError("Please enter a valid policy ID.");
      return;
    }

    try {
      const result = await refetchPolicyDetails();

      if (result.isSuccess && result.data) {
        console.log(
          "Policy details fetched successfully:",
          JSON.parse(result.data as string)
        );
        const res = JSON.parse(result.data as string);
        setPolicyData(res as PolicyDataType);
      } else {
        console.error("Failed to fetch policy details:", result.error);
        setError("Failed to fetch policy details.");
      }
    } catch (err: any) {
      console.error("Error fetching policy details:", err);
      setError(
        `Failed to fetch policy details: ${err.message || "Unknown error"}`
      );
    }
  };

  const handleGetPolicies = async () => {
    try {
      const result = await refetchPolicies();
      if (result.isSuccess && result.data) {
        console.log(
          "All policies fetched successfully:",
          JSON.parse(result.data as string)
        );
        const res = JSON.parse(result.data as string);
        setPolicies(res as PolicyDataType[]);
      } else {
        console.error("Failed to fetch all policies:", result.error);
        setError("Failed to fetch all policies.");
      }
    } catch (err: any) {
      console.error("Error fetching all policies:", err);
      setError(
        `Failed to fetch all policies: ${err.message || "Unknown error"}`
      );
    }
  };

  const handleGetUserPolicies = async () => {
    try {
      const result = await refetchUserPolicies();
      if (result.isSuccess && result.data) {
        console.log(
          "User policies fetched successfully:",
          JSON.parse(result.data as string)
        );
        const res = JSON.parse(result.data as string);
        setUserPolicies(res as PolicyDataType[]);
      } else {
        console.error("Failed to fetch user policies:", result.error);
        setError("Failed to fetch user policies.");
      }
    } catch (err: any) {
      console.error("Error fetching user policies:", err);
      setError(
        `Failed to fetch user policies: ${err.message || "Unknown error"}`
      );
    }
  };

  return (
    <div className="p-4">
      {" "}
      {/* Add some padding */}
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <p className="mb-6">This is a test page.</p>
      <ConnectKitButton />
      <button
        onClick={handleCreatePolicy}
        disabled={loading}
        className={`px-4 py-2 rounded transition duration-300 ${
          loading
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-black text-white hover:bg-gray-800"
        }`}
      >
        {loading ? "Creating Policy..." : "Create Policy"}
      </button>
      {/* Status messages */}
      {success && (
        <p className="text-green-500 mt-4 font-medium">
          Policy created successfully!
        </p>
      )}
      {error && (
        <p className="text-red-500 mt-4">
          <span className="font-medium">Error:</span> {error}
        </p>
      )}
      <div className="mt-6">
        <Input
          type="text"
          placeholder="Enter policyId"
          className="border border-gray-300 rounded p-2 w-full"
          value={policyId ?? ""}
          onChange={(e) => setPolicyId(Number(e.target.value))}
        />
        <button
          onClick={handleGetPolicyDetails}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Get Policy Details
        </button>
        {policyData && (
          <div className="mt-4 p-4 border border-gray-300 rounded">
            <h2 className="text-xl font-semibold mb-2">Policy Details</h2>
            <p>
              <strong>ID:</strong> {policyData.id}
              <br />
              <strong>Coverage Amount:</strong> {policyData.coverageAmount}
              <br />
              <strong>Premium Amount:</strong> {policyData.premiumAmount}
              <br />
              <strong>Duration:</strong>{" "}
              {new Date(
                Number(policyData?.startDate) * 1000
              ).toLocaleDateString()}{" "}
              -{" "}
              {new Date(
                Number(policyData?.expiryDate) * 1000
              ).toLocaleDateString()}
              <br />
              <strong>URI:</strong> {policyData?.metadataUri}
              <br />
              <strong>Risk Level:</strong> {policyData?.riskLevel}
            </p>
          </div>
        )}
      </div>
      <div className="mt-6">
        <button
          onClick={handleGetPolicies}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Get all Policies
        </button>
      </div>
      <div className="mt-6">
        <button
          onClick={handleGetUserPolicies}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Get all User Policies
        </button>
      </div>
    </div>
  );
};

export default test;
