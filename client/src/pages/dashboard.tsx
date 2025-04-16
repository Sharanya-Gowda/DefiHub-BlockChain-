import { useState } from "react";
import { useWallet } from "@/lib/walletContext";
import WalletBanner from "@/components/wallet-banner";
import PortfolioOverview from "@/components/portfolio-overview";
import AssetPositions from "@/components/asset-positions";
import LendingForm from "@/components/lending-form";
import LendingMarket from "@/components/lending-market";
import BorrowingForm from "@/components/borrowing-form";
import BorrowingMarket from "@/components/borrowing-market";
import SwapForm from "@/components/swap-form";
import LiquidityPools from "@/components/liquidity-pools";
import TransactionsTable from "@/components/transactions-table";

export default function Dashboard() {
  const { isConnected } = useWallet();
  const [activeTab, setActiveTab] = useState<"lend" | "borrow" | "swap">("lend");
  const [activePositionTab, setActivePositionTab] = useState<"lending" | "borrowing" | "liquidity">("lending");

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {!isConnected ? (
        <WalletBanner />
      ) : (
        <>
          <PortfolioOverview />
          
          {/* Asset Positions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Positions</h2>
            
            {/* Position Tab Navigation */}
            <div className="border-b border-gray-200 mb-4">
              <nav className="flex -mb-px space-x-8" aria-label="Position tabs">
                <button 
                  className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                    activePositionTab === "lending" 
                      ? "border-primary text-primary" 
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActivePositionTab("lending")}
                >
                  Lending <span className="ml-1 bg-blue-100 text-primary text-xs px-2 py-1 rounded-full">3</span>
                </button>
                <button 
                  className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                    activePositionTab === "borrowing" 
                      ? "border-primary text-primary" 
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActivePositionTab("borrowing")}
                >
                  Borrowing <span className="ml-1 bg-purple-100 text-accent text-xs px-2 py-1 rounded-full">2</span>
                </button>
                <button 
                  className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                    activePositionTab === "liquidity" 
                      ? "border-primary text-primary" 
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActivePositionTab("liquidity")}
                >
                  Liquidity <span className="ml-1 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">1</span>
                </button>
              </nav>
            </div>
            
            <AssetPositions activeTab={activePositionTab} />
          </div>
        </>
      )}

      {/* Main App Features Tabs */}
      <div className="mb-8">
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                className={`whitespace-nowrap py-4 px-1 text-sm font-medium ${
                  activeTab === "lend"
                    ? "border-b-2 border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("lend")}
              >
                Lend
              </button>
              <button
                className={`whitespace-nowrap py-4 px-1 text-sm font-medium ${
                  activeTab === "borrow"
                    ? "border-b-2 border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("borrow")}
              >
                Borrow
              </button>
              <button
                className={`whitespace-nowrap py-4 px-1 text-sm font-medium ${
                  activeTab === "swap"
                    ? "border-b-2 border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("swap")}
              >
                Swap
              </button>
            </nav>
          </div>
        </div>

        {/* Lending Panel */}
        {activeTab === "lend" && (
          <div className="py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Lending Form */}
              <div className="lg:col-span-1">
                <LendingForm />
              </div>
              
              {/* Lending Market */}
              <div className="lg:col-span-2">
                <LendingMarket />
              </div>
            </div>
          </div>
        )}
        
        {/* Borrow Panel */}
        {activeTab === "borrow" && (
          <div className="py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Borrow Form */}
              <div className="lg:col-span-1">
                <BorrowingForm />
              </div>
              
              {/* Borrowing Market */}
              <div className="lg:col-span-2">
                <BorrowingMarket />
              </div>
            </div>
          </div>
        )}
        
        {/* Swap Panel */}
        {activeTab === "swap" && (
          <div className="py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Swap Form */}
              <div className="lg:col-span-1">
                <SwapForm />
              </div>
              
              {/* Liquidity Pools */}
              <div className="lg:col-span-2">
                <LiquidityPools />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Recent Transactions */}
      <TransactionsTable limit={4} showViewAll={true} />
    </div>
  );
}
