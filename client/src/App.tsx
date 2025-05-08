import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Lend from "@/pages/lend";
import Borrow from "@/pages/borrow";
import Swap from "@/pages/swap";
import History from "@/pages/history";
import Header from "@/components/header";
import WalletConnectModal from "@/components/wallet-connect-modal";
import SettingsModal from "@/components/settings-modal";
import { SettingsProvider } from "@/lib/settingsContext";
import { WalletProvider } from "@/lib/walletContext";
import { useEffect } from "react";

function App() {
  // Apply global styles
  useEffect(() => {
    // Add some nice animations for buttons
    const style = document.createElement('style');
    style.textContent = `
      .btn-hover-effect {
        transition: all 0.3s ease;
      }
      .btn-hover-effect:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <SettingsProvider>
      <WalletProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-grow flex flex-col">
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/lend" component={Lend} />
              <Route path="/borrow" component={Borrow} />
              <Route path="/swap" component={Swap} />
              <Route path="/history" component={History} />
              <Route component={NotFound} />
            </Switch>
          </main>
          <WalletConnectModal />
          <SettingsModal />
          <Toaster />
        </div>
      </WalletProvider>
    </SettingsProvider>
  );
}

export default App;
