import { Button } from "@/components/ui/button";
import { useWallet } from "@/lib/walletContext";
import { useSettings } from "@/lib/settingsContext";
import { useState, useEffect } from "react";
import { 
  Settings, 
  User, 
  Wallet, 
  LogOut, 
  Moon, 
  Sun, 
  Copy, 
  CheckCheck,
  Shield,
  Bell
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function WalletConnectButton() {
  const { isConnected, address, openModal, balance, chainId, disconnectWallet } = useWallet();
  const { theme, setTheme } = useSettings();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

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

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
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

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    toast({
      title: `Theme Changed: ${theme === 'light' ? 'Dark' : 'Light'} Mode`,
      description: "Your preference has been saved",
    });
  };

  return (
    <div className="relative">
      <Button
        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-sm hover:shadow transition-all duration-200 flex items-center rounded-full px-4"
        onClick={handleButtonClick}
      >
        {isConnected ? (
          <>
            <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center mr-2">
              <Wallet className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-medium">{address}</span>
          </>
        ) : (
          <>
            <Wallet className="h-4 w-4 mr-2" />
            <span>Connect Wallet</span>
          </>
        )}
      </Button>

      {isConnected && isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 z-50 overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-3 text-white">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-3">
                <div className="font-bold">Connected Wallet</div>
                <div className="mt-0.5 text-xs text-blue-100">{getNetworkName(chainId)}</div>
              </div>
            </div>
          </div>
          
          <div onClick={(e) => e.stopPropagation()}>
            <div className="px-4 py-3 border-b dark:border-gray-700">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Wallet Address</div>
                  <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">{address}</div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900"
                  onClick={copyAddress}
                >
                  {isCopied ? 
                    <CheckCheck className="h-4 w-4 text-green-600 dark:text-green-500" /> : 
                    <Copy className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  }
                </Button>
              </div>
            </div>
            
            <div className="px-4 py-3 border-b dark:border-gray-700">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Balance</div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">{balance} ETH</div>
                </div>
                <div className="text-xs px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                  $2,345.67 USD
                </div>
              </div>
            </div>
            
            {/* Profile Options */}
            <div className="p-2">
              <div className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">SETTINGS</div>
              
              <button className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" onClick={() => {
                toast({
                  title: "Profile Settings",
                  description: "Profile settings would open here",
                });
              }}>
                <User className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
                <span>Profile Settings</span>
              </button>
              
              <button className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" onClick={toggleTheme}>
                {theme === 'light' ? (
                  <>
                    <Moon className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
                    <span>Dark Mode</span>
                  </>
                ) : (
                  <>
                    <Sun className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
                    <span>Light Mode</span>
                  </>
                )}
              </button>
              
              <button className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <Bell className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
                <span>Notifications</span>
              </button>
              
              <button className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <Shield className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
                <span>Security Settings</span>
              </button>
              
              <div className="mt-2 pt-2 border-t dark:border-gray-700">
                <button
                  className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
                  onClick={() => {
                    disconnectWallet();
                    setIsDropdownOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  <span>Disconnect Wallet</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
