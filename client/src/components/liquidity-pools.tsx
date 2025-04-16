import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DualCryptoIcon } from "@/components/ui/crypto-icon";
import { useWallet } from "@/lib/walletContext";
import { liquidityPools } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from "lucide-react";

export default function LiquidityPools() {
  const { isConnected, openModal } = useWallet();
  const { toast } = useToast();

  const handleSwap = (pool: string) => {
    if (!isConnected) {
      openModal();
      return;
    }
    
    // In a real DeFi app, this would navigate to the swap form with the pool assets pre-selected
    toast({
      title: "Pool Selected",
      description: `Selected ${pool} pool for swapping`,
    });
  };

  const handleAddLiquidity = (pool: string) => {
    if (!isConnected) {
      openModal();
      return;
    }
    
    // In a real DeFi app, this would navigate to the add liquidity form with the pool pre-selected
    toast({
      title: "Add Liquidity",
      description: `Selected ${pool} pool for adding liquidity`,
    });
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-100">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Liquidity Pools</h3>
          <div className="flex items-center">
            <Button 
              variant="ghost"
              className="text-sm font-medium text-primary mr-4 flex items-center"
              onClick={() => {
                if (!isConnected) {
                  openModal();
                  return;
                }
                toast({
                  title: "Add Liquidity",
                  description: "Navigate to add liquidity form",
                });
              }}
            >
              <PlusCircle className="h-4 w-4 mr-1" /> Add Liquidity
            </Button>
            <span className="text-sm text-gray-500">
              Updated 1 min ago
            </span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pool</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Liquidity</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume (24h)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">APR</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {liquidityPools.map((pool, index) => (
                <tr key={`liquidity-pool-${index}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DualCryptoIcon 
                        src1={pool.pair[0].icon} 
                        src2={pool.pair[1].icon} 
                        alt1={pool.pair[0].symbol} 
                        alt2={pool.pair[1].symbol}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{pool.pair[0].symbol} / {pool.pair[1].symbol}</div>
                        <div className="text-xs text-gray-500">{pool.feeTier} fee tier</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono">
                      ${(pool.liquidity / 1000000).toFixed(1)}M
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono">
                      ${(pool.volume24h / 1000000).toFixed(1)}M
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-success font-medium">{pool.apy}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      className="text-primary hover:text-blue-700 mr-3"
                      onClick={() => handleSwap(`${pool.pair[0].symbol}/${pool.pair[1].symbol}`)}
                    >
                      Swap
                    </button>
                    <button 
                      className="text-secondary hover:text-green-700"
                      onClick={() => handleAddLiquidity(`${pool.pair[0].symbol}/${pool.pair[1].symbol}`)}
                    >
                      Add
                    </button>
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
