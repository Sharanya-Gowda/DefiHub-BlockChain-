import { createContext, useState, useContext, ReactNode } from "react";

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  connectWallet: (provider?: string) => void;
  disconnectWallet: () => void;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

// Provide a default context value instead of undefined
const defaultWalletContext: WalletContextType = {
  isConnected: false,
  address: null,
  connectWallet: () => {},
  disconnectWallet: () => {},
  isModalOpen: false,
  openModal: () => {},
  closeModal: () => {},
};

const WalletContext = createContext<WalletContextType>(defaultWalletContext);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const connectWallet = (provider?: string) => {
    console.log("Connecting wallet with provider:", provider || "default");
    // In a real app, this would connect to the actual wallet provider
    setIsConnected(true);
    setAddress("0x7a...3f4"); // Mock address
    closeModal();
  };

  const disconnectWallet = () => {
    console.log("Disconnecting wallet");
    setIsConnected(false);
    setAddress(null);
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
