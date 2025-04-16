import { useState, useEffect } from "react";
import { useWallet } from "@/lib/walletContext";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { assets, getExchangeRate, calculatePriceImpact } from "@/lib/mockData";
import { Asset } from "@/lib/mockData";
import { 
  ArrowUpDown, 
  RefreshCw, 
  Zap, 
  AlertCircle, 
  Percent,
  ChevronDown
} from "lucide-react";
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
    <div className="card-shadow hover:shadow-md transition-all duration-300">
      <Card className="bg-white border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 py-4 px-6">
          <h3 className="text-lg font-bold text-white flex items-center">
            <RefreshCw className="mr-2 h-5 w-5" />
            Token Swap
          </h3>
          <p className="text-sm text-emerald-100">
            Instantly exchange tokens at the best rates
          </p>
        </div>
        
        <CardContent className="p-6">
          {!isConnected && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center">
              <AlertCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-blue-700 text-sm font-medium">Connect your wallet to swap tokens</p>
                <p className="text-blue-600 text-xs mt-1">You need to connect your wallet first to access swapping</p>
              </div>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium ml-4 btn-hover-effect"
                onClick={() => openModal()}
              >
                Connect Wallet
              </Button>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <span className="mr-1">You Pay</span>
                <div className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">From</div>
              </Label>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-emerald-300 transition-colors">
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
                      <SelectTrigger className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 w-full justify-between">
                        {fromAsset ? (
                          <div className="flex items-center">
                            <img src={fromAsset.icon} alt={fromAsset.symbol} className="h-6 w-6 rounded-full mr-2" />
                            <span className="font-medium">{fromAsset.symbol}</span>
                          </div>
                        ) : (
                          <span>Select</span>
                        )}
                        <ChevronDown className="h-4 w-4 opacity-70" />
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
                    className="text-emerald-600 font-medium px-2 py-1 h-auto hover:bg-emerald-50 rounded-md"
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
            
            <div className="flex justify-center my-3">
              <Button 
                type="button" 
                variant="outline"
                size="icon"
                className="bg-white border border-emerald-200 p-3 rounded-full text-emerald-600 hover:bg-emerald-50 transition-all duration-200 shadow-sm"
                onClick={switchAssets}
              >
                <ArrowUpDown className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="mb-5">
              <Label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <span className="mr-1">You Receive</span>
                <div className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">To</div>
              </Label>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-emerald-300 transition-colors">
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
                      <SelectTrigger className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 w-full justify-between">
                        {toAsset ? (
                          <div className="flex items-center">
                            <img src={toAsset.icon} alt={toAsset.symbol} className="h-6 w-6 rounded-full mr-2" />
                            <span className="font-medium">{toAsset.symbol}</span>
                          </div>
                        ) : (
                          <span>Select</span>
                        )}
                        <ChevronDown className="h-4 w-4 opacity-70" />
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
            
            <div className="bg-emerald-50 p-4 rounded-lg mb-5 border border-emerald-100">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700 flex items-center">
                  <RefreshCw className="h-4 w-4 mr-1 text-emerald-600" />
                  Exchange Rate
                </span>
                <span className="font-medium text-emerald-700">
                  {exchangeRate && fromAsset && toAsset
                    ? `1 ${fromAsset.symbol} = ${exchangeRate.toFixed(6)} ${toAsset.symbol}`
                    : "-"
                  }
                </span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700 flex items-center">
                  <Percent className="h-4 w-4 mr-1 text-emerald-600" />
                  Price Impact
                </span>
                <span className={`font-medium px-2 py-0.5 rounded-full ${
                  priceImpact < 1 ? "bg-green-100 text-green-700" : 
                  priceImpact < 3 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                }`}>
                  {priceImpact.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700 flex items-center">
                  <Zap className="h-4 w-4 mr-1 text-emerald-600" />
                  LP Fee
                </span>
                <span className="font-medium text-emerald-700">0.3%</span>
              </div>
            </div>
            
            <div className="mt-4">
              <Button 
                type={isConnected ? "submit" : "button"}
                onClick={() => !isConnected && openModal()}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-4 px-6 rounded-lg font-bold text-md transition-all duration-200 shadow-md hover:shadow-lg btn-hover-effect"
              >
                Swap Now
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
