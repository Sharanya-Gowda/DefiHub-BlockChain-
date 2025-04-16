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

function App() {
  return (
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
      <Toaster />
    </div>
  );
}

export default App;
