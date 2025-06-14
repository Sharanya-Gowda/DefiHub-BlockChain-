import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CryptoIcon } from "@/components/ui/crypto-icon";
import { useWallet } from "@/lib/walletContext";
import { borrowingMarket } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, AlertCircle } from "lucide-react";

export default function BorrowingMarket() {
  const { isConnected, openModal } = useWallet();
  const { toast } = useToast();

  const handleBorrow = (assetSymbol: string) => {
    if (!isConnected) {
      openModal();
      return;
    }

    // In a real DeFi app, this would navigate to the borrow form with the asset pre-selected
    toast({
      title: "Asset Selected",
      description: `Selected ${assetSymbol} for borrowing`,
    });
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-100">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <DollarSign className="h-5 w-5 mr-1 text-purple-600" />
            Borrowing Market
          </h3>
          <div className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
            <span>Updated 1 min ago</span>
          </div>
        </div>

        {!isConnected && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-blue-700 text-sm font-medium">Connect your wallet to borrow assets</p>
              <p className="text-blue-600 text-xs mt-1">Unlock access to borrowing features by connecting your wallet</p>
            </div>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium ml-4 btn-hover-effect"
              onClick={() => openModal()}
            >
              Connect Wallet
            </Button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-purple-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Asset</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Available</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Interest Rate</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Collateral Required</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Borrower</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {borrowingMarket.map((item, index) => (
                <tr key={`borrowing-market-${index}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <CryptoIcon src={item.asset.icon} alt={item.asset.symbol} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900">{item.asset.name}</div>
                        <div className="text-xs text-gray-500">{item.asset.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium font-mono">
                      {item.asset.symbol === "ETH" 
                        ? item.available / item.asset.price 
                        : item.available.toLocaleString(undefined, { maximumFractionDigits: 0 })
                      } {item.asset.symbol}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      ${(item.available / 1000000).toFixed(1)}M
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm bg-purple-100 text-purple-800 font-bold px-4 py-1.5 rounded-full inline-block shadow-sm">
                      {item.interestRate}% APR
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full inline-block shadow-sm">
                      {item.collateralRequired}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {/* Added Borrower information */}
                    {item.borrower}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button 
                      className={`bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 btn-hover-effect ${!isConnected ? 'opacity-80' : ''}`}
                      onClick={() => isConnected ? handleBorrow(item.asset.symbol) : openModal()}
                    >
                      Borrow
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}