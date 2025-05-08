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
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';


function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isConnected } = useWallet();
  if (!isConnected) return <Navigate to="/auth" />;
  return <>{children}</>;
}

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
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-grow flex flex-col">
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/lend" element={<ProtectedRoute><Lend /></ProtectedRoute>} />
                <Route path="/borrow" element={<ProtectedRoute><Borrow /></ProtectedRoute>} />
                <Route path="/swap" element={<ProtectedRoute><Swap /></ProtectedRoute>} />
                <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <WalletConnectModal />
            <SettingsModal />
            <Toaster />
          </div>
        </Router>
      </WalletProvider>
    </SettingsProvider>
  );
}

export default App;