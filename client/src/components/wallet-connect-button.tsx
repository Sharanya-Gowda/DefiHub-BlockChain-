import { Button } from "@/components/ui/button";
import { useWallet } from "@/lib/walletContext";
import { useState, useEffect } from "react";

export default function WalletConnectButton() {
  const { isConnected, address, openModal, balance, chainId, disconnectWallet } = useWallet();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsDropdownOpen(false);
    };

    if (isDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isConnected) {
      setIsDropdownOpen(!isDropdownOpen);
    } else {
      openModal();
    }
  };

  const getNetworkName = (chainId: number | null) => {
    if (!chainId) return "Unknown Network";
    
    switch (chainId) {
      case 1:
        return "Ethereum Mainnet";
      case 5:
        return "Goerli Testnet";
      case 137:
        return "Polygon";
      case 42161:
        return "Arbitrum";
      default:
        return `Chain ID: ${chainId}`;
    }
  };

  return (
    <div className="relative">
      <Button
        className="bg-primary hover:bg-blue-600 text-white transition-colors duration-200 flex items-center"
        onClick={handleButtonClick}
      >
        <i className={`mr-2 ${isConnected ? "ri-wallet-fill" : "ri-wallet-3-line"}`}></i>
        <span>{isConnected ? address : "Connect Wallet"}</span>
      </Button>

      {isConnected && isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-60 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" onClick={(e) => e.stopPropagation()}>
            <div className="px-4 py-2 text-sm text-gray-700 border-b">
              <div className="font-medium text-gray-900">{address}</div>
              <div className="mt-1 text-xs text-gray-500">{getNetworkName(chainId)}</div>
            </div>
            <div className="px-4 py-2 text-sm text-gray-700 border-b">
              <div className="text-xs text-gray-500">Balance</div>
              <div className="font-medium text-gray-900">{balance} ETH</div>
            </div>
            <button
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              onClick={() => {
                disconnectWallet();
                setIsDropdownOpen(false);
              }}
            >
              Disconnect Wallet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
