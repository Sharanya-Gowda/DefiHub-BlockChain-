import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { ethers } from "ethers";

// Type definition for global window.ethereum from MetaMask
declare global {
  interface Window {
    ethereum?: any;
  }
}

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  connectWallet: (provider?: string) => Promise<void>;
  disconnectWallet: () => void;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  balance: string;
  chainId: number | null;
}

// Provide a default context value
const defaultWalletContext: WalletContextType = {
  isConnected: false,
  address: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isModalOpen: false,
  openModal: () => {},
  closeModal: () => {},
  balance: "0",
  chainId: null,
};

const WalletContext = createContext<WalletContextType>(defaultWalletContext);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [balance, setBalance] = useState("0");
  const [chainId, setChainId] = useState<number | null>(null);

  // Detect if ethereum is available (MetaMask or similar)
  const hasEthereum = typeof window !== "undefined" && !!window.ethereum;

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (hasEthereum) {
        try {
          // Use ethers v5 syntax
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          
          if (accounts.length > 0) {
            setIsConnected(true);
            setAddress(accounts[0].address);
            
            // Get chain ID
            const network = await provider.getNetwork();
            setChainId(Number(network.chainId));
            
            // Get balance
            const balance = await provider.getBalance(accounts[0].address);
            setBalance(ethers.formatEther(balance));
          }
        } catch (error) {
          console.error("Failed to check wallet connection:", error);
        }
      }
    };
    
    checkConnection();
  }, [hasEthereum]);

  // For demo/mock implementation
  const mockWalletConnect = async (provider?: string) => {
    console.log("Mock connecting wallet with provider:", provider || "default");
    setIsConnected(true);
    
    // Generate a random Ethereum address for demo
    const randomAddr = "0x" + Array.from({length: 40}, () => 
      Math.floor(Math.random() * 16).toString(16)).join('');
    
    const shortenedAddress = randomAddr.slice(0, 6) + "..." + randomAddr.slice(-4);
    setAddress(shortenedAddress);
    
    // Mock balance
    setBalance("1.234");
    
    // Mock chain ID (1 = Ethereum Mainnet)
    setChainId(1);
    
    closeModal();
  };

  // Real implementation for connecting to MetaMask or other providers
  const realConnectWallet = async (providerName?: string) => {
    if (!hasEthereum) {
      alert("Please install MetaMask or another Ethereum wallet to connect.");
      return;
    }
    
    try {
      console.log("Connecting wallet with provider:", providerName || "default");
      
      // Request access to the user's accounts using ethers v5 syntax
      const provider = new ethers.BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await provider.listAccounts();
      
      if (accounts.length > 0) {
        setIsConnected(true);
        setAddress(accounts[0].address);
        
        // Get chain ID
        const network = await provider.getNetwork();
        setChainId(Number(network.chainId));
        
        // Get balance
        const balance = await provider.getBalance(accounts[0].address);
        setBalance(ethers.formatEther(balance));
      }
      
      closeModal();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      alert("Failed to connect wallet. Please try again.");
    }
  };

  // Choose between mock and real implementation
  const connectWallet = async (providerName?: string) => {
    // Use mock implementation for now since we're in development
    // In production, you would replace this with realConnectWallet
    await mockWalletConnect(providerName);
  };

  const disconnectWallet = () => {
    console.log("Disconnecting wallet");
    setIsConnected(false);
    setAddress(null);
    setBalance("0");
    setChainId(null);
  };

  const openModal = () => {
    console.log("Opening wallet modal");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log("Closing wallet modal");
    setIsModalOpen(false);
  };

  const value = {
    isConnected,
    address,
    connectWallet,
    disconnectWallet,
    isModalOpen,
    openModal,
    closeModal,
    balance,
    chainId,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  return context;
}
