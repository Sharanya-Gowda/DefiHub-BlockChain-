import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useWallet } from "@/lib/walletContext";
import { useState } from "react";

const walletProviders = [
  {
    name: "MetaMask",
    icon: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg",
    description: "The most popular Ethereum wallet",
    popular: true
  },
  {
    name: "WalletConnect",
    icon: "https://walletconnect.com/images/walletconnect-logo.svg",
    description: "Connect to mobile wallets",
    popular: true
  },
  {
    name: "Coinbase Wallet",
    icon: "https://www.coinbase.com/assets/favicon.ico",
    description: "Use Coinbase's wallet service",
    popular: true
  },
  {
    name: "Ledger",
    icon: "https://www.ledger.com/wp-content/uploads/2021/01/Ledger_Live_icon.svg",
    description: "Hardware wallet for secure storage",
    popular: false
  },
  {
    name: "Trezor",
    icon: "https://trezor.io/static/images/favicon.ico",
    description: "Hardware wallet for security-focused users",
    popular: false
  },
  {
    name: "Trust Wallet",
    icon: "https://trustwallet.com/assets/images/favicon.ico",
    description: "Multi-chain mobile wallet",
    popular: false
  }
];

export default function WalletConnectModal() {
  const { isModalOpen, closeModal, connectWallet } = useWallet();
  const [connecting, setConnecting] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  
  const handleConnect = async (providerName: string) => {
    setConnecting(providerName);
    try {
      await connectWallet(providerName);
    } catch (error) {
      console.error("Connection error:", error);
    } finally {
      setConnecting(null);
    }
  };
  
  const displayedProviders = showAll 
    ? walletProviders 
    : walletProviders.filter(provider => provider.popular);

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">Connect Your Wallet</DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            Connect your wallet to use the DeFi platform for lending, borrowing, and swapping assets.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 py-4">
          {displayedProviders.map((provider) => (
            <button
              key={provider.name}
              className={`w-full flex items-center justify-between p-4 rounded-lg transition-all duration-200 ${
                connecting === provider.name
                  ? "bg-blue-50 border border-blue-200"
                  : "bg-gray-50 hover:bg-gray-100 hover:shadow-sm border border-transparent"
              }`}
              onClick={() => handleConnect(provider.name)}
              disabled={connecting !== null}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 bg-white rounded-full p-1.5 flex items-center justify-center shadow-sm">
                  <img src={provider.icon} alt={provider.name} className="h-full w-full object-contain" />
                </div>
                <div className="ml-3 text-left">
                  <span className="font-semibold text-gray-900">{provider.name}</span>
                  <p className="text-xs text-gray-500 mt-0.5">{provider.description}</p>
                </div>
              </div>
              
              {connecting === provider.name ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              ) : (
                <i className="ri-arrow-right-line text-gray-400"></i>
              )}
            </button>
          ))}
          
          {!showAll && walletProviders.some(p => !p.popular) && (
            <button
              className="w-full text-sm text-blue-600 hover:text-blue-800 underline py-2"
              onClick={() => setShowAll(true)}
            >
              Show more options
            </button>
          )}
          
          {showAll && (
            <button
              className="w-full text-sm text-blue-600 hover:text-blue-800 underline py-2"
              onClick={() => setShowAll(false)}
            >
              Show fewer options
            </button>
          )}
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
          <p>
            By connecting your wallet, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
              Privacy Policy
            </a>
            .
          </p>
          <p className="mt-2 text-xs text-gray-400">
            This dApp will never ask for your private keys or recovery phrase.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
