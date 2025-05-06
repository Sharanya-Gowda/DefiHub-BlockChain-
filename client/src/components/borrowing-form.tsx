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

export default function BorrowingForm() {
  const { isConnected, openModal } = useWallet();
  const { toast } = useToast();
  const [borrowAsset, setBorrowAsset] = useState<Asset | null>(null);
  const [collateralAsset, setCollateralAsset] = useState<Asset | null>(null);
  const [borrowAmount, setBorrowAmount] = useState("");
  const [collateralAmount, setCollateralAmount] = useState("");

  const handleBorrowAssetChange = (value: string) => {
    const asset = assets.find(a => a.symbol === value);
    if (asset) setBorrowAsset(asset);
  };

  const handleCollateralAssetChange = (value: string) => {
    const asset = assets.find(a => a.symbol === value);
    if (asset) setCollateralAsset(asset);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      openModal();
      return;
    }
    
    if (!borrowAsset || !collateralAsset || !borrowAmount || !collateralAmount || 
        parseFloat(borrowAmount) <= 0 || parseFloat(collateralAmount) <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please select assets and enter valid amounts",
        variant: "destructive",
      });
      return;
    }
    
    // In a real DeFi app, this would interact with a smart contract
    toast({
      title: "Transaction Submitted",
      description: `Borrowing ${borrowAmount} ${borrowAsset.symbol} against ${collateralAmount} ${collateralAsset.symbol}`,
    });
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-100">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Borrow Assets</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="borrowAsset" className="block text-sm font-medium text-gray-700 mb-1">I want to borrow</Label>
            <Select onValueChange={handleBorrowAssetChange}>
              <SelectTrigger id="borrowAsset" className="w-full pl-3 py-3 text-base border-gray-300 focus:ring-accent focus:border-accent rounded-lg appearance-none bg-white">
                <SelectValue placeholder="Select an asset" />
              </SelectTrigger>
              <SelectContent>
                {assets.map((asset) => (
                  <SelectItem key={`borrow-${asset.symbol}`} value={asset.symbol}>
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
            <Label htmlFor="borrowAmount" className="block text-sm font-medium text-gray-700 mb-1">Amount</Label>
            <div className="relative rounded-lg shadow-sm">
              <Input 
                id="borrowAmount"
                type="text"
                placeholder="0.0"
                value={borrowAmount}
                onChange={(e) => setBorrowAmount(e.target.value)}
                className="block w-full pl-3 pr-20 py-3 text-base border-gray-300 focus:ring-accent focus:border-accent rounded-lg"
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <Button 
                  type="button" 
                  variant="ghost"
                  className="h-full rounded-r-lg border-0 bg-gray-100 px-3 text-gray-600 text-sm font-medium hover:bg-gray-200"
                  onClick={() => setBorrowAmount("1000")}
                >
                  MAX
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <Label htmlFor="collateralAsset" className="block text-sm font-medium text-gray-700 mb-1">Collateral</Label>
            <Select onValueChange={handleCollateralAssetChange}>
              <SelectTrigger id="collateralAsset" className="w-full pl-3 py-3 text-base border-gray-300 focus:ring-accent focus:border-accent rounded-lg appearance-none bg-white">
                <SelectValue placeholder="Select a collateral asset" />
              </SelectTrigger>
              <SelectContent>
                {assets.map((asset) => (
                  <SelectItem key={`collateral-${asset.symbol}`} value={asset.symbol}>
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
            <Label htmlFor="collateralAmount" className="block text-sm font-medium text-gray-700 mb-1">Collateral Amount</Label>
            <div className="relative rounded-lg shadow-sm">
              <Input 
                id="collateralAmount"
                type="text"
                placeholder="0.0"
                value={collateralAmount}
                onChange={(e) => setCollateralAmount(e.target.value)}
                className="block w-full pl-3 pr-20 py-3 text-base border-gray-300 focus:ring-accent focus:border-accent rounded-lg"
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <Button 
                  type="button" 
                  variant="ghost"
                  className="h-full rounded-r-lg border-0 bg-gray-100 px-3 text-gray-600 text-sm font-medium hover:bg-gray-200"
                  onClick={() => setCollateralAmount("5")}
                >
                  MAX
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <Button 
              type="submit" 
              className="w-full bg-accent hover:bg-purple-600 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200"
            >
              {isConnected ? "Borrow Now" : "Connect Wallet to Borrow"}
            </Button>
          </div>
        </form>
        
        <div className="mt-6 bg-purple-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Borrowing Info</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Interest Rate</span>
              <span className="font-medium text-accent">7.2% APR</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Collateral Ratio</span>
              <span className="font-medium">150%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Liquidation Threshold</span>
              <span className="font-medium">120%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Health Factor</span>
              <span className="font-medium text-success">1.6</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
