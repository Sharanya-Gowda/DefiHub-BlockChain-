import { useState, useEffect } from "react";
import { useWallet } from "@/lib/walletContext";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { assets, getExchangeRate, calculatePriceImpact } from "@/lib/mockData";
import { Asset } from "@/lib/mockData";
import { ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function SwapForm() {
  const { isConnected, openModal } = useWallet();
  const { toast } = useToast();
  const [fromAsset, setFromAsset] = useState<Asset | null>(null);
  const [toAsset, setToAsset] = useState<Asset | null>(null);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [priceImpact, setPriceImpact] = useState<number>(0);

  const handleFromAssetChange = (value: string) => {
    const asset = assets.find(a => a.symbol === value);
    if (asset) {
      setFromAsset(asset);
      updateCalculations(fromAmount, asset, toAsset);
    }
  };

  const handleToAssetChange = (value: string) => {
    const asset = assets.find(a => a.symbol === value);
    if (asset) {
      setToAsset(asset);
      updateCalculations(fromAmount, fromAsset, asset);
    }
  };

  const updateCalculations = (amount: string, from: Asset | null, to: Asset | null) => {
    if (from && to && amount && !isNaN(parseFloat(amount))) {
      const rate = getExchangeRate(from, to);
      setExchangeRate(rate);
      
      const fromAmountNum = parseFloat(amount);
      setToAmount((fromAmountNum * rate).toFixed(6));
      
      const impact = calculatePriceImpact(fromAmountNum, from);
      setPriceImpact(impact);
    } else {
      setToAmount("");
      setExchangeRate(null);
      setPriceImpact(0);
    }
  };

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFromAmount(value);
    updateCalculations(value, fromAsset, toAsset);
  };

  const switchAssets = () => {
    const tempFromAsset = fromAsset;
    const tempToAsset = toAsset;
    const tempFromAmount = fromAmount;
    const tempToAmount = toAmount;
    
    setFromAsset(tempToAsset);
    setToAsset(tempFromAsset);
    setFromAmount(tempToAmount);
    setToAmount(tempFromAmount);
    
    updateCalculations(tempToAmount, tempToAsset, tempFromAsset);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      openModal();
      return;
    }
    
    if (!fromAsset || !toAsset || !fromAmount || parseFloat(fromAmount) <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please select assets and enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    
    // In a real DeFi app, this would interact with a smart contract
    toast({
      title: "Transaction Submitted",
      description: `Swapping ${fromAmount} ${fromAsset.symbol} for approximately ${toAmount} ${toAsset.symbol}`,
    });
  };

  // Set default assets on load
  useEffect(() => {
    const defaultFromAsset = assets.find(a => a.symbol === "ETH");
    const defaultToAsset = assets.find(a => a.symbol === "USDC");
    
    if (defaultFromAsset && defaultToAsset) {
      setFromAsset(defaultFromAsset);
      setToAsset(defaultToAsset);
      setExchangeRate(getExchangeRate(defaultFromAsset, defaultToAsset));
    }
  }, []);

  return (
    <Card className="bg-white shadow-sm border border-gray-100">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Swap Tokens</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label className="block text-sm font-medium text-gray-700 mb-1">You Pay</Label>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <div className="relative w-2/3">
                  <Input
                    type="text"
                    value={fromAmount}
                    onChange={handleFromAmountChange}
                    className="block w-full bg-transparent text-xl font-medium focus:outline-none font-mono border-none"
                    placeholder="0.0"
                  />
                </div>
                <div className="w-1/3">
                  <Select value={fromAsset?.symbol} onValueChange={handleFromAssetChange}>
                    <SelectTrigger className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary w-full justify-between">
                      {fromAsset ? (
                        <div className="flex items-center">
                          <img src={fromAsset.icon} alt={fromAsset.symbol} className="h-5 w-5 rounded-full mr-2" />
                          <span>{fromAsset.symbol}</span>
                        </div>
                      ) : (
                        <span>Select</span>
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {assets.map((asset) => (
                        <SelectItem key={`from-${asset.symbol}`} value={asset.symbol}>
                          <div className="flex items-center">
                            <img src={asset.icon} alt={asset.symbol} className="h-5 w-5 rounded-full mr-2" />
                            <span>{asset.symbol}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="text-sm text-gray-500 flex justify-between">
                <span>Balance: {fromAsset ? `10.5 ${fromAsset.symbol}` : "0"}</span>
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="text-primary font-medium p-0 h-auto"
                  onClick={() => {
                    if (fromAsset) {
                      setFromAmount("1");
                      updateCalculations("1", fromAsset, toAsset);
                    }
                  }}
                >
                  MAX
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center my-2">
            <Button 
              type="button" 
              variant="outline"
              size="icon"
              className="bg-gray-100 p-2 rounded-full text-gray-600 hover:bg-gray-200 transition-colors duration-200"
              onClick={switchAssets}
            >
              <ArrowUpDown className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="mb-4">
            <Label className="block text-sm font-medium text-gray-700 mb-1">You Receive</Label>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <div className="relative w-2/3">
                  <Input
                    type="text"
                    value={toAmount}
                    className="block w-full bg-transparent text-xl font-medium focus:outline-none font-mono border-none"
                    placeholder="0.0"
                    readOnly
                  />
                </div>
                <div className="w-1/3">
                  <Select value={toAsset?.symbol} onValueChange={handleToAssetChange}>
                    <SelectTrigger className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary w-full justify-between">
                      {toAsset ? (
                        <div className="flex items-center">
                          <img src={toAsset.icon} alt={toAsset.symbol} className="h-5 w-5 rounded-full mr-2" />
                          <span>{toAsset.symbol}</span>
                        </div>
                      ) : (
                        <span>Select</span>
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {assets.map((asset) => (
                        <SelectItem key={`to-${asset.symbol}`} value={asset.symbol}>
                          <div className="flex items-center">
                            <img src={asset.icon} alt={asset.symbol} className="h-5 w-5 rounded-full mr-2" />
                            <span>{asset.symbol}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                <span>Balance: {toAsset ? `1,200 ${toAsset.symbol}` : "0"}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Exchange Rate</span>
              <span className="font-medium">
                {exchangeRate && fromAsset && toAsset
                  ? `1 ${fromAsset.symbol} = ${exchangeRate.toFixed(6)} ${toAsset.symbol}`
                  : "-"
                }
              </span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Price Impact</span>
              <span className={`font-medium ${
                priceImpact < 1 ? "text-success" : 
                priceImpact < 3 ? "text-warning" : "text-error"
              }`}>
                {priceImpact.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Liquidity Provider Fee</span>
              <span className="font-medium">0.3%</span>
            </div>
          </div>
          
          <div className="mt-4">
            <Button 
              type="submit" 
              className="w-full bg-secondary hover:bg-green-600 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200"
            >
              {isConnected ? "Swap Now" : "Connect Wallet to Swap"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
