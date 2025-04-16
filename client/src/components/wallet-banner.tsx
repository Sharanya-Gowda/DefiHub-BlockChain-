import { useWallet } from "@/lib/walletContext";
import { Button } from "@/components/ui/button";

export default function WalletBanner() {
  const { openModal } = useWallet();

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white mb-8">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl font-bold mb-2">Welcome to DefiHub</h2>
          <p className="opacity-90">Connect your wallet to start lending, borrowing, and trading crypto assets</p>
        </div>
        <Button
          className="bg-white text-primary hover:bg-gray-100 transition-colors duration-200"
          size="lg"
          onClick={openModal}
        >
          Connect Wallet
        </Button>
      </div>
    </div>
  );
}
