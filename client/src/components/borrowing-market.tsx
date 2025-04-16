import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CryptoIcon } from "@/components/ui/crypto-icon";
import { useWallet } from "@/lib/walletContext";
import { borrowingMarket } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

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
          <h3 className="text-lg font-medium text-gray-900">Borrowing Market</h3>
          <div className="text-sm text-gray-500">
            <span>Updated 1 min ago</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest Rate</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collateral Required</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {borrowingMarket.map((item, index) => (
                <tr key={`borrowing-market-${index}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <CryptoIcon src={item.asset.icon} alt={item.asset.symbol} />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{item.asset.name}</div>
                        <div className="text-xs text-gray-500">{item.asset.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono">
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
                    <div className="text-sm text-accent font-medium">{item.interestRate}% APR</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium">{item.collateralRequired}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button 
                      className="bg-accent hover:bg-purple-600 text-white px-4 py-1 rounded-lg text-sm transition-colors duration-200"
                      onClick={() => handleBorrow(item.asset.symbol)}
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
