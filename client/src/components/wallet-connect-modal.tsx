import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useWallet } from "@/lib/walletContext";

const walletProviders = [
  {
    name: "MetaMask",
    icon: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg",
  },
  {
    name: "WalletConnect",
    icon: "https://walletconnect.com/images/walletconnect-logo.svg",
  },
  {
    name: "Ledger",
    icon: "https://www.ledger.com/wp-content/uploads/2021/01/Ledger_Live_icon.svg",
  },
  {
    name: "Coinbase Wallet",
    icon: "https://www.coinbase.com/assets/favicon.ico",
  },
];

export default function WalletConnectModal() {
  const { isModalOpen, closeModal, connectWallet } = useWallet();

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-4">
          {walletProviders.map((provider) => (
            <button
              key={provider.name}
              className="w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors duration-200"
              onClick={() => connectWallet(provider.name)}
            >
              <div className="flex items-center">
                <img src={provider.icon} alt={provider.name} className="h-8 w-8 mr-3" />
                <span className="font-medium">{provider.name}</span>
              </div>
              <i className="ri-arrow-right-line"></i>
            </button>
          ))}
        </div>
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>
            By connecting your wallet, you agree to our{" "}
            <a href="#" className="text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
