import { Link, useLocation } from "wouter";
import { Logo } from "@/components/ui/logo";
import WalletConnectButton from "@/components/wallet-connect-button";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  Home, 
  TrendingUp, 
  DollarSign, 
  RefreshCw, 
  Clock, 
  Settings,
  User,
  Bell,
  Moon,
  Sun
} from "lucide-react";
import { useSettings } from "@/lib/settingsContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openSettings, theme, setTheme } = useSettings();

  const isActive = (path: string) => {
    return location === path;
  };

  const navigationItems = [
    { name: "Dashboard", path: "/", icon: <Home size={18} /> },
    { name: "Lend", path: "/lend", icon: <TrendingUp size={18} /> },
    { name: "Borrow", path: "/borrow", icon: <DollarSign size={18} /> },
    { name: "Swap", path: "/swap", icon: <RefreshCw size={18} /> },
    { name: "History", path: "/history", icon: <Clock size={18} /> },
  ];

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="bg-gradient-to-r from-blue-50 via-white to-blue-50 border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/">
              <div className="flex items-center">
                <Logo />
                <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 hidden sm:inline-block">
                  DeFi Platform
                </span>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`
                  flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                  ${isActive(item.path)
                    ? "bg-blue-100 text-blue-700 shadow-sm"
                    : "hover:bg-blue-50 text-gray-700 hover:text-blue-700"
                  }
                `}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-blue-100"
                    onClick={toggleTheme}
                  >
                    {theme === 'light' ? 
                      <Moon className="h-5 w-5 text-gray-700" /> : 
                      <Sun className="h-5 w-5 text-gray-700" />
                    }
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-blue-100"
                    onClick={openSettings}
                  >
                    <Settings className="h-5 w-5 text-gray-700" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <WalletConnectButton />
            
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full hover:bg-blue-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="text-gray-700" /> : <Menu className="text-gray-700" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white shadow-lg absolute w-full z-50">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`
                  flex items-center px-4 py-3 rounded-lg text-base font-medium
                  ${isActive(item.path)
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                  }
                `}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
            
            <button 
              className="w-full flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700"
              onClick={() => {
                openSettings();
                setMobileMenuOpen(false);
              }}
            >
              <Settings className="mr-3" size={18} />
              Settings
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
