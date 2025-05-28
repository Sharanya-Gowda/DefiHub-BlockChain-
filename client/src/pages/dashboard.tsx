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
import { MarketOverview } from "@/components/price-ticker";
import { TrendingUp, DollarSign, RefreshCw, Clock, ChevronRight, BarChart2, ShieldCheck } from "lucide-react";

export default function Dashboard() {
  const { isConnected } = useWallet();
  const [activeTab, setActiveTab] = useState<"lend" | "borrow" | "swap">("lend");
  const [activePositionTab, setActivePositionTab] = useState<"lending" | "borrowing" | "liquidity">("lending");

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
      {!isConnected ? (
        <WalletBanner />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 animate-fadeIn">
              <PortfolioOverview />
            </div>
            <div className="animate-fadeIn">
              <MarketOverview symbols={['BTC', 'ETH', 'USDC', 'USDT', 'DAI', 'LINK']} />
            </div>
          </div>
          
          {/* Asset Positions */}
          <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-5 animate-fadeIn">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <BarChart2 className="mr-2 h-5 w-5 text-blue-600" />
                Your Positions
              </h2>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center">
                View Details <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            
            {/* Position Tab Navigation */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex -mb-px space-x-8" aria-label="Position tabs">
                <button 
                  className={`whitespace-nowrap py-3 px-3 border-b-2 font-medium text-sm transition-all duration-200 flex items-center ${
                    activePositionTab === "lending" 
                      ? "border-blue-600 text-blue-700" 
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => setActivePositionTab("lending")}
                >
                  <TrendingUp className="mr-1.5 h-4 w-4" />
                  Lending <span className="ml-1.5 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-semibold">3</span>
                </button>
                <button 
                  className={`whitespace-nowrap py-3 px-3 border-b-2 font-medium text-sm transition-all duration-200 flex items-center ${
                    activePositionTab === "borrowing" 
                      ? "border-purple-600 text-purple-700" 
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => setActivePositionTab("borrowing")}
                >
                  <DollarSign className="mr-1.5 h-4 w-4" />
                  Borrowing <span className="ml-1.5 bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full font-semibold">2</span>
                </button>
                <button 
                  className={`whitespace-nowrap py-3 px-3 border-b-2 font-medium text-sm transition-all duration-200 flex items-center ${
                    activePositionTab === "liquidity" 
                      ? "border-emerald-600 text-emerald-700" 
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => setActivePositionTab("liquidity")}
                >
                  <RefreshCw className="mr-1.5 h-4 w-4" />
                  Liquidity <span className="ml-1.5 bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-semibold">1</span>
                </button>
              </nav>
            </div>
            
            <AssetPositions activeTab={activePositionTab} />
          </div>
        </>
      )}

      {/* Main App Features Tabs */}
      <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <ShieldCheck className="mr-2 h-5 w-5 text-blue-600" />
            DeFi Services
          </h2>
          <div className="ml-auto">
            <div className="inline-flex bg-gray-100 rounded-lg p-1">
              <button
                className={`whitespace-nowrap py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 flex items-center ${
                  activeTab === "lend"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-gray-700 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("lend")}
              >
                <TrendingUp className="mr-1.5 h-4 w-4" />
                Lend
              </button>
              <button
                className={`whitespace-nowrap py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 flex items-center ${
                  activeTab === "borrow"
                    ? "bg-white text-purple-700 shadow-sm"
                    : "text-gray-700 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("borrow")}
              >
                <DollarSign className="mr-1.5 h-4 w-4" />
                Borrow
              </button>
              <button
                className={`whitespace-nowrap py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 flex items-center ${
                  activeTab === "swap"
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-gray-700 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("swap")}
              >
                <RefreshCw className="mr-1.5 h-4 w-4" />
                Swap
              </button>
            </div>
          </div>
        </div>

        {/* Lending Panel */}
        {activeTab === "lend" && (
          <div className="py-2">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Lending Form */}
              <div className="lg:col-span-1">
                <div className="bg-blue-50 bg-opacity-70 rounded-xl p-4 border border-blue-100">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Lend Assets
                  </h3>
                  <LendingForm />
                </div>
              </div>
              
              {/* Lending Market */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Lending Market</h3>
                  <LendingMarket />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Borrow Panel */}
        {activeTab === "borrow" && (
          <div className="py-2">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Borrow Form */}
              <div className="lg:col-span-1">
                <div className="bg-purple-50 bg-opacity-70 rounded-xl p-4 border border-purple-100">
                  <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                    <DollarSign className="mr-2 h-5 w-5" />
                    Borrow Assets
                  </h3>
                  <BorrowingForm />
                </div>
              </div>
              
              {/* Borrowing Market */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Borrowing Market</h3>
                  <BorrowingMarket />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Swap Panel */}
        {activeTab === "swap" && (
          <div className="py-2">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Swap Form */}
              <div className="lg:col-span-1">
                <div className="bg-emerald-50 bg-opacity-70 rounded-xl p-4 border border-emerald-100">
                  <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center">
                    <RefreshCw className="mr-2 h-5 w-5" />
                    Swap Tokens
                  </h3>
                  <SwapForm />
                </div>
              </div>
              
              {/* Liquidity Pools */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Liquidity Pools</h3>
                  <LiquidityPools />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-8">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <Clock className="mr-2 h-5 w-5 text-blue-600" />
            Recent Transactions
          </h2>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center">
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        <TransactionsTable limit={4} showViewAll={true} />
      </div>
    </div>
  );
}
