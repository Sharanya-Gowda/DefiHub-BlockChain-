
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "@/lib/queryClient";
import { WalletProvider } from "@/lib/walletContext";
import { AuthProvider, useAuth } from "@/lib/authContext";
import { SettingsProvider } from "@/lib/settingsContext";
import Header from "@/components/header";
import Dashboard from "@/pages/dashboard";
import Lend from "@/pages/lend";
import Borrow from "@/pages/borrow";
import Swap from "@/pages/swap";
import History from "@/pages/history";
import Login from "@/pages/login";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function AppContent() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/lend" element={<Lend />} />
          <Route path="/borrow" element={<Borrow />} />
          <Route path="/swap" element={<Swap />} />
          <Route path="/history" element={<History />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WalletProvider>
          <SettingsProvider>
            <Router>
              <AppContent />
            </Router>
          </SettingsProvider>
        </WalletProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
