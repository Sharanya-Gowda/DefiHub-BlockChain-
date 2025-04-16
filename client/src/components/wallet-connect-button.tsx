import { Button } from "@/components/ui/button";
import { useWallet } from "@/lib/walletContext";
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
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
        <div className="absolute right-0 mt-2 w-72 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-3 text-white">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <div className="font-bold">Connected Wallet</div>
                <div className="mt-0.5 text-xs text-blue-100">{getNetworkName(chainId)}</div>
              </div>
            </div>
          </div>
          
          <div onClick={(e) => e.stopPropagation()}>
            <div className="px-4 py-3 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xs text-gray-500">Wallet Address</div>
                  <div className="font-medium text-gray-900 text-sm">{address}</div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full hover:bg-blue-50"
                  onClick={copyAddress}
                >
                  {isCopied ? <CheckCheck className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-gray-500" />}
                </Button>
              </div>
            </div>
            
            <div className="px-4 py-3 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xs text-gray-500">Balance</div>
                  <div className="font-medium text-gray-900">{balance} ETH</div>
                </div>
                <div className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                  $2,345.67 USD
                </div>
              </div>
            </div>
            
            {/* Profile Options */}
            <div className="p-2">
              <div className="text-xs text-gray-500 px-2 py-1">SETTINGS</div>
              
              <button className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg" onClick={() => {
                toast({
                  title: "Profile Settings",
                  description: "Profile settings would open here",
                });
              }}>
                <User className="h-4 w-4 mr-3 text-gray-500" />
                <span>Profile Settings</span>
              </button>
              
              <button className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg" onClick={toggleTheme}>
                {theme === 'light' ? (
                  <>
                    <Moon className="h-4 w-4 mr-3 text-gray-500" />
                    <span>Dark Mode</span>
                  </>
                ) : (
                  <>
                    <Sun className="h-4 w-4 mr-3 text-gray-500" />
                    <span>Light Mode</span>
                  </>
                )}
              </button>
              
              <button className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                <Bell className="h-4 w-4 mr-3 text-gray-500" />
                <span>Notifications</span>
              </button>
              
              <button className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                <Shield className="h-4 w-4 mr-3 text-gray-500" />
                <span>Security Settings</span>
              </button>
              
              <div className="mt-2 pt-2 border-t">
                <button
                  className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
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
