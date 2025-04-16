import { useWallet } from "@/lib/walletContext";
import WalletBanner from "@/components/wallet-banner";
import LendingForm from "@/components/lending-form";
import LendingMarket from "@/components/lending-market";
import AssetPositions from "@/components/asset-positions";

export default function Lend() {
  const { isConnected } = useWallet();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {!isConnected && <WalletBanner />}
      
      <h1 className="text-2xl font-bold mb-6">Lend Assets</h1>
      
      {isConnected && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Lending Positions</h2>
          <AssetPositions activeTab="lending" />
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <LendingForm />
        </div>
        
        <div className="lg:col-span-2">
          <LendingMarket />
        </div>
      </div>
    </div>
  );
}
