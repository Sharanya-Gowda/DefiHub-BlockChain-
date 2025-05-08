
import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Lend from "@/pages/lend";
import Borrow from "@/pages/borrow";
import Swap from "@/pages/swap";
import History from "@/pages/history";
import Auth from "@/pages/auth";
import Admin from "@/pages/admin";
import { useWallet } from "@/lib/walletContext";
import Header from "@/components/header";
import WalletConnectModal from "@/components/wallet-connect-modal";
import SettingsModal from "@/components/settings-modal";
import { SettingsProvider } from "@/lib/settingsContext";
import { WalletProvider } from "@/lib/walletContext";
import { useEffect } from "react";

function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) {
  const { isConnected, isAdmin } = useWallet();
  
  if (!isConnected) {
    return <Switch><Route path="*"><Auth /></Route></Switch>;
  }
  
  if (requireAdmin && !isAdmin) {
    return <Switch><Route path="*"><NotFound /></Route></Switch>;
  }
  
  return <>{children}</>;
}

function App() {
  useEffect(() => {
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
              <Route path="/auth"><Auth /></Route>
              <Route path="/"><ProtectedRoute><Dashboard /></ProtectedRoute></Route>
              <Route path="/lend"><ProtectedRoute><Lend /></ProtectedRoute></Route>
              <Route path="/borrow"><ProtectedRoute><Borrow /></ProtectedRoute></Route>
              <Route path="/swap"><ProtectedRoute><Swap /></ProtectedRoute></Route>
              <Route path="/history"><ProtectedRoute><History /></ProtectedRoute></Route>
              <Route path="/admin"><ProtectedRoute requireAdmin={true}><Admin /></ProtectedRoute></Route>
              <Route><NotFound /></Route>
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
