import { useWallet } from "@/lib/walletContext";
import WalletBanner from "@/components/wallet-banner";
import BorrowingForm from "@/components/borrowing-form";
import BorrowingMarket from "@/components/borrowing-market";
import AssetPositions from "@/components/asset-positions";

export default function Borrow() {
  const { isConnected } = useWallet();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {!isConnected && <WalletBanner />}
      
      <h1 className="text-2xl font-bold mb-6">Borrow Assets</h1>
      
      {isConnected && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Borrowed Assets</h2>
          <AssetPositions activeTab="borrowing" />
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <BorrowingForm />
        </div>
        
        <div className="lg:col-span-2">
          <BorrowingMarket />
        </div>
      </div>
    </div>
  );
}
