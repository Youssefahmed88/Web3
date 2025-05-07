"use client";
import { useAccount, useReadContract, useWriteContract, useChainId } from "wagmi";
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { RingLoader } from 'react-spinners';

interface Transaction{
  txHash?: string;
  type: string;
  status: string;
  timeStamp: string;
  chainId?: number;

}

const wagmiContractConfig = {
  address: process.env.NEXT_PUBLIC_ADDRESS as `0x${string}`,
  abi: [
    {
      inputs: [],
      name: "increment",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "getDoubledNumber",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "number",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
  ],
} as const;

export default function Home() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [loading, setLoading] = useState(false);  
  const [trans, setTrans] = useState<Transaction[]>([]);
  
  const isCorrectNetwork = chainId === parseInt(process.env.NEXT_PUBLIC_EXPECTED_CHAIN_ID || "0");

  const {
    data: counter,
    isLoading: isLoadingCounter,
    isError: isErrorCounter,
    error: counterError,
    refetch: refetchCounter,
  } = useReadContract({
    ...wagmiContractConfig,
    functionName: "getDoubledNumber",
    query: { enabled: isConnected && isCorrectNetwork }
  });

  const {
    data: num,
    isLoading: isLoadingNumber,
    isError: isErrorNumber,
    error: numberError,
    refetch: refetchNumber,
  } = useReadContract({
    ...wagmiContractConfig,
    functionName: "number",
    query: { enabled: isConnected && isCorrectNetwork }
  });

  const handleGetCounter = async () => {
    try {
      await refetchCounter();
      toast.success("Counter fetched successfully!");
      console.log("Counter:", counter);
      setTrans((prev) => [
        ...prev,
        {
          type: "Fetch Counter",
          status: "Success",
          timeStamp: new Date().toLocaleDateString(),
          chainId,
        },
      ]);
    } catch (error: any) {
      console.error("Failed to fetch counter:", error);
      toast.error(error.message || "Failed to fetch counter.");
      setError(error.message || "Failed to fetch counter.");
      setTrans((prev) => [
        ...prev,
        {
          type: "Fetch Counter",
          status: "Faild",
          timeStamp: new Date().toLocaleDateString(),
          chainId,
        },
      ]);
    }
  };
  
  const handleGetNumber = async () => {
    try {
      await refetchNumber();
      if (isErrorNumber || numberError) {
        throw new Error(numberError?.message || "Failed to fetch number.");
      }
      setTrans((prev) => [
        ...prev,
        {
          type: "Fetch Number",
          status: "Success",
          timeStamp: new Date().toLocaleDateString(),
          chainId,
        },
      ]);
      toast.success("Number fetched successfully!");
      console.log("Number:", num);
    } catch (error: any) {
      console.error("Failed to fetch number:", error);
      toast.error(error.message || "Failed to fetch number.");
      setError(error.message || "Failed to fetch number.");
      setTrans((prev) => [
        ...prev,
        {
          type: "Fetch Number",
          status: "Faild",
          timeStamp: new Date().toLocaleDateString(),
          chainId
        }
      ]);
    }
  };

  const { writeContractAsync } = useWriteContract();

  const handleIncrement = async () => {
    setLoading(true);  
    try {
      setError(null);
      const loadingToast = toast.loading("Sending transaction...");
      const tx = await writeContractAsync({
        ...wagmiContractConfig,
        functionName: "increment"
      });
      toast.success("Transaction sent successfully!", { id: loadingToast });
      console.log("Increment successful");
      await Promise.all([refetchCounter(), refetchNumber()]);
      toast.success("Data refreshed.");
      setTrans((prev) => [
        ...prev,
        {
          txHash: tx,
          type: "Increment",
          status: "Success",
          timeStamp: new Date().toLocaleDateString(),
          chainId,
        },
      ]);
    } catch (error: any) {
      console.error("Increment failed:", error);
      let errorMessage = "Failed to increment. Please try again.";

      // Check for transaction rejection
      if (error.code === 4001 || error.message.toLowerCase().includes("rejected") || error.message.toLowerCase().includes("denied")) {
        console.error("Transaction rejected by user:", error.message);
        toast.error("Transaction is Canceled.");
        setTrans((prev) => [
          ...prev,
          {
            type: "Increment",
            status: "insufficient transaction",
            timeStamp: new Date().toLocaleDateString(),
            chainId,
          },
        ]);
        return;
      }
      // Check for transaction revert
      else if (error.message.toLowerCase().includes("reverted")) {
        toast.error("Transaction reverted");
        setTrans((prev) => [
          ...prev,
          {
            type: "Increment",
            status: "Transaction reverted",
            timeStamp: new Date().toLocaleDateString(),
            chainId,
          },
        ]);
      }
      setError(errorMessage);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    if (isConnected) {
      toast.success("Wallet connected successfully!");
    } else {
      toast.error("Wallet not connected.");
    }
  }, [isConnected]);

  useEffect(() => {
    if (isErrorCounter && counterError) {
      console.error("Error fetching counter:", counterError);
      setError("Failed to fetch counter: " + counterError.message);
    }
    if (isErrorNumber && numberError) {
      console.error("Error fetching number:", numberError);
      setError("Failed to fetch number: " + numberError.message);
    }
    if(isPending){
      console.log('Transaction is Pending');
    }else{
      console.log('Transaction is done');
    }
  }, [isErrorCounter, isErrorNumber, counterError, numberError, isPending]);

const EtherExplorer = (txHash: string | undefined, chainId: number | undefined) => {
  if(!txHash || !chainId) return "";
  const nets: { [ key: number ]: string } = {
    1: `https://etherscan.io/tx/${txHash}`,
    11155111: `https://sepolia.etherscan.io/tx/${txHash}`
  };
  return nets[chainId] || "";
}

const handleClearHistory = ()=>{
  setTrans([]);
  toast.success("Transaction History cleared.");
}

  return (
    <div className="min-h-screen bg-black-100 flex flex-col items-center p-4">
      <div className="bg-grey-600 rounded-lg shadow p-6 w-full max-w-md">
        {/* Network and wallet */}
        <div className="flex justify-between mb-4">
          <w3m-button />
          <w3m-network-button />
        </div>

        {/* Connection State*/}
        <div
          className={`p-3 rounded text-white text-center font-medium ${
            isConnected ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {isConnected ? `Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}` : "Not Connected"}
        </div>

        {/* Network Errors*/}
        {!isCorrectNetwork && isConnected && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded text-center">
            Switch to Chain ID: {process.env.NEXT_PUBLIC_EXPECTED_CHAIN_ID}
          </div>
        )}

        {/* Error Messages*/}
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded text-center">
            {error}
          </div>
        )}

        {/* Buttons*/}
        <div className="mt-6 space-y-3">
          <button
            className="w-full p-3 rounded bg-blue-500 text-white font-medium hover:bg-blue-600 disabled:opacity-50"
            disabled={isLoadingCounter || !isCorrectNetwork}
            onClick={handleGetCounter}
          >
            Counter: {isLoadingCounter ? "Loading..." : counter !== undefined ? counter.toString() : "Error"}
          </button>
          <button
            className="w-full p-3 rounded bg-purple-500 text-white font-medium hover:bg-purple-600 disabled:opacity-50"
            disabled={isLoadingNumber || !isCorrectNetwork}
            onClick={handleGetNumber}
          >
            Number: {isLoadingNumber ? "Loading..." : num !== undefined ? num.toString() : "Error"}
          </button>
          <button
            className="w-full p-3 rounded bg-green-500 text-white font-medium hover:bg-green-600 disabled:opacity-50 flex justify-center items-center"
            disabled={!isConnected || !isCorrectNetwork || isPending}
            onClick={handleIncrement}
          >
            {loading ? (
              <RingLoader color="white" size={24} />
            ) : isPending ? (
              "Pending..."
            ) : (
              "Increment"
            )}
          </button>
        </div>
      </div>

      {/* History Transaction*/}
      <div className="mt-8 w-full max-w-2xl">
        <h2 className="text-xl font-bold text-white-800 mb-4">Transaction History</h2>
        {trans.length === 0 ? (
          <div className="bg-white p-4 rounded-lg shadow text-center text-gray-500">
            No transactions yet.
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left text-gray-600">Type</th>
                  <th className="p-3 text-left text-gray-600">Status</th>
                  <th className="p-3 text-left text-gray-600">Time</th>
                  <th className="p-3 text-left text-gray-600">Tx Hash</th>
                </tr>
              </thead>
              <tbody>
                {trans.map((tx, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-3 text-gray-700">{tx.type}</td>
                    <td className={`p-3 ${tx.status === "Success" ? "text-green-600" : "text-red-600"}`}>
                      {tx.status}
                    </td>
                    <td className="p-3 text-gray-700">{tx.timeStamp}</td>
                    <td className="p-3">
                      {tx.txHash ? (
                        <a
                          href={EtherExplorer(tx.txHash, tx.chainId)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {tx.txHash.slice(0, 6)}...{tx.txHash.slice(-4)}
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        </div>
        <div>
          <button className="mb-4 mt-6 py-4 px-6 text-sm rounded bg-red-500 text-white font-medium hover:bg-red-600" 
          onClick={handleClearHistory}>Clear History</button>
        </div>
    </div>
  );
}
