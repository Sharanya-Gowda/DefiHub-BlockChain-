import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CryptoIcon } from "@/components/ui/crypto-icon";
import { useWallet } from "@/lib/walletContext";
import { lendingMarket } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

export default function LendingMarket() {
  const { isConnected, openModal } = useWallet();
  const { toast } = useToast();

  const handleLend = (assetSymbol: string) => {
    if (!isConnected) {
      openModal();
      return;
    }
    
    // In a real DeFi app, this would navigate to the lend form with the asset pre-selected
    toast({
      title: "Asset Selected",
      description: `Selected ${assetSymbol} for lending`,
    });
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-100">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Lending Market</h3>
          <div className="text-sm text-gray-500">
            <span>Updated 1 min ago</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Size</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">APY</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lendingMarket.map((item, index) => (
                <tr key={`lending-market-${index}`}>
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
                      {(item.marketSize / item.asset.price).toLocaleString(undefined, { maximumFractionDigits: 0 })} {item.asset.symbol}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      ${(item.marketSize / 1000000).toFixed(2)}M
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-success font-medium">{item.apy}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button 
                      className="bg-primary hover:bg-blue-600 text-white px-4 py-1 rounded-lg text-sm transition-colors duration-200"
                      onClick={() => handleLend(item.asset.symbol)}
                    >
                      Lend
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
