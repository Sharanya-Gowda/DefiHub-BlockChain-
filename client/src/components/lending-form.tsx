import { useState } from "react";
import { useWallet } from "@/lib/walletContext";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { assets } from "@/lib/mockData";
import { Asset } from "@/lib/mockData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function LendingForm() {
  const { isConnected, openModal } = useWallet();
  const { toast } = useToast();
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [amount, setAmount] = useState("");

  const handleAssetChange = (value: string) => {
    const asset = assets.find(a => a.symbol === value);
    if (asset) setSelectedAsset(asset);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      openModal();
      return;
    }
    
    if (!selectedAsset || !amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please select an asset and enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    
    // In a real DeFi app, this would interact with a smart contract
    toast({
      title: "Transaction Submitted",
      description: `Lending ${amount} ${selectedAsset.symbol}`,
    });
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-100">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Lend Assets</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="lendAsset" className="block text-sm font-medium text-gray-700 mb-1">Select Asset</Label>
            <Select onValueChange={handleAssetChange}>
              <SelectTrigger id="lendAsset" className="w-full pl-3 py-3 text-base border-gray-300 focus:ring-primary focus:border-primary rounded-lg appearance-none bg-white">
                <SelectValue placeholder="Select an asset" />
              </SelectTrigger>
              <SelectContent>
                {assets.map((asset) => (
                  <SelectItem key={asset.symbol} value={asset.symbol}>
                    <div className="flex items-center">
                      <img src={asset.icon} alt={asset.symbol} className="h-5 w-5 rounded-full mr-2" />
                      {asset.name} ({asset.symbol})
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="mb-4">
            <Label htmlFor="lendAmount" className="block text-sm font-medium text-gray-700 mb-1">Amount</Label>
            <div className="relative rounded-lg shadow-sm">
              <Input 
                id="lendAmount"
                type="text"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="block w-full pl-3 pr-20 py-3 text-base border-gray-300 focus:ring-primary focus:border-primary rounded-lg"
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <Button 
                  type="button" 
                  variant="ghost"
                  className="h-full rounded-r-lg border-0 bg-gray-100 px-3 text-gray-600 text-sm font-medium hover:bg-gray-200"
                  onClick={() => {
                    // In a real app, this would set the max balance from the wallet
                    setAmount(selectedAsset ? "10" : "");
                  }}
                >
                  MAX
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200"
            >
              {isConnected ? "Lend Now" : "Connect Wallet to Lend"}
            </Button>
          </div>
        </form>
        
        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Lending Info</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Current APY</span>
              <span className="font-medium text-success">3.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Liquidity</span>
              <span className="font-medium font-mono">$12.5M</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Platform Fee</span>
              <span className="font-medium">0.1%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
