export interface Asset {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  price: number;
  change24h: number;
}

export interface LendingPosition {
  asset: Asset;
  balance: number;
  apy: number;
  earned: number;
}

export interface BorrowingPosition {
  asset: Asset;
  amount: number;
  interest: number;
  collateral: Asset;
  collateralAmount: number;
  healthFactor: number;
}

export interface LiquidityPosition {
  pair: [Asset, Asset];
  liquidity: number;
  share: number;
  apy: number;
}

export interface LendingMarketAsset {
  asset: Asset;
  marketSize: number;
  apy: number;
  lender: string;
}

export interface BorrowingMarketAsset {
  asset: Asset;
  available: number;
  interestRate: number;
  collateralRequired: number;
  borrower: string;
}

export interface LiquidityPool {
  pair: [Asset, Asset];
  liquidity: number;
  volume24h: number;
  apy: number;
  feeTier: string;
}

export interface Transaction {
  id: string;
  type: 'lend' | 'borrow' | 'repay' | 'withdraw' | 'swap' | 'interest';
  asset: Asset;
  amount: number;
  fromAsset?: Asset;
  toAsset?: Asset;
  date: Date;
  status: 'pending' | 'completed' | 'failed';
}

export interface PortfolioSummary {
  totalValue: number;
  totalValueChange24h: number;
  lendingValue: number;
  lendingValueChange24h: number;
  borrowedValue: number;
  borrowedValueChange24h: number;
}

// Mock Assets
export const assets: Asset[] = [
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    icon: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    price: 1825,
    change24h: 2.4
  },
  {
    id: "btc",
    name: "Bitcoin",
    symbol: "BTC",
    icon: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    price: 57000,
    change24h: 1.2
  },
  {
    id: "usdc",
    name: "USD Coin",
    symbol: "USDC",
    icon: "https://assets.coingecko.com/coins/images/6319/large/usdc.png",
    price: 1,
    change24h: 0.01
  },
  {
    id: "link",
    name: "Chainlink",
    symbol: "LINK",
    icon: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png",
    price: 11.5,
    change24h: -0.8
  },
  {
    id: "uni",
    name: "Uniswap",
    symbol: "UNI",
    icon: "https://assets.coingecko.com/coins/images/12504/large/uni.jpg",
    price: 6.5,
    change24h: 3.5
  },
  {
    id: "dai",
    name: "Dai",
    symbol: "DAI",
    icon: "https://assets.coingecko.com/coins/images/9956/large/Badge_Dai.png",
    price: 1,
    change24h: 0.02
  },
  {
    id: "usdt",
    name: "Tether",
    symbol: "USDT",
    icon: "https://assets.coingecko.com/coins/images/325/large/Tether.png",
    price: 1,
    change24h: 0.0
  }
];

const getAssetBySymbol = (symbol: string): Asset => {
  const asset = assets.find(a => a.symbol === symbol);
  if (!asset) throw new Error(`Asset ${symbol} not found`);
  return asset;
};

// Portfolio Summary
export const portfolioSummary: PortfolioSummary = {
  totalValue: 12456.78,
  totalValueChange24h: 2.4,
  lendingValue: 5238.92,
  lendingValueChange24h: 1.8,
  borrowedValue: 3127.45,
  borrowedValueChange24h: 0.5,
};

// Lending Positions
export const lendingPositions: LendingPosition[] = [
  {
    asset: getAssetBySymbol("ETH"),
    balance: 2.5,
    apy: 3.2,
    earned: 0.08,
  },
  {
    asset: getAssetBySymbol("USDC"),
    balance: 1200,
    apy: 5.8,
    earned: 69.6,
  },
  {
    asset: getAssetBySymbol("LINK"),
    balance: 75,
    apy: 2.1,
    earned: 1.58,
  }
];

// Borrowing Positions
export const borrowingPositions: BorrowingPosition[] = [
  {
    asset: getAssetBySymbol("USDC"),
    amount: 2000,
    interest: 7.2,
    collateral: getAssetBySymbol("ETH"),
    collateralAmount: 1.5,
    healthFactor: 1.8,
  },
  {
    asset: getAssetBySymbol("DAI"),
    amount: 1000,
    interest: 6.8,
    collateral: getAssetBySymbol("ETH"),
    collateralAmount: 0.75,
    healthFactor: 1.6,
  },
];

// Liquidity Positions
export const liquidityPositions: LiquidityPosition[] = [
  {
    pair: [getAssetBySymbol("ETH"), getAssetBySymbol("USDC")],
    liquidity: 5000,
    share: 0.02,
    apy: 15.2,
  }
];

// Lending Market
export const lendingMarket: LendingMarketAsset[] = [
  {
    asset: getAssetBySymbol("ETH"),
    marketSize: 15246 * 1825,
    apy: 3.2,
    lender: "DeFi Pool A",
  },
  {
    asset: getAssetBySymbol("BTC"),
    marketSize: 985 * 57000,
    apy: 2.5,
  },
  {
    asset: getAssetBySymbol("USDC"),
    marketSize: 32568421,
    apy: 5.8,
  },
  {
    asset: getAssetBySymbol("LINK"),
    marketSize: 965420 * 11.5,
    apy: 2.1,
  },
  {
    asset: getAssetBySymbol("UNI"),
    marketSize: 524190 * 6.5,
    apy: 1.7,
  },
];

// Borrowing Market
export const borrowingMarket: BorrowingMarketAsset[] = [
  {
    asset: getAssetBySymbol("USDC"),
    available: 12400000,
    interestRate: 7.2,
    collateralRequired: 150,
    borrower: "Crypto Fund X",
  },
  {
    asset: getAssetBySymbol("DAI"),
    available: 8200000,
    interestRate: 6.8,
    collateralRequired: 150,
  },
  {
    asset: getAssetBySymbol("USDT"),
    available: 15600000,
    interestRate: 7.5,
    collateralRequired: 150,
  },
  {
    asset: getAssetBySymbol("ETH"),
    available: 2458 * 1825,
    interestRate: 3.5,
    collateralRequired: 175,
  },
];

// Liquidity Pools
export const liquidityPools: LiquidityPool[] = [
  {
    pair: [getAssetBySymbol("ETH"), getAssetBySymbol("USDC")],
    liquidity: 24500000,
    volume24h: 3200000,
    apy: 15.2,
    feeTier: "0.3%",
  },
  {
    pair: [getAssetBySymbol("BTC"), getAssetBySymbol("ETH")],
    liquidity: 18300000,
    volume24h: 2400000,
    apy: 12.5,
    feeTier: "0.3%",
  },
  {
    pair: [getAssetBySymbol("USDC"), getAssetBySymbol("DAI")],
    liquidity: 32100000,
    volume24h: 5800000,
    apy: 4.2,
    feeTier: "0.05%",
  },
  {
    pair: [getAssetBySymbol("ETH"), getAssetBySymbol("LINK")],
    liquidity: 5700000,
    volume24h: 890000,
    apy: 18.4,
    feeTier: "0.3%",
  },
];

// Transactions
export const transactions: Transaction[] = [
  {
    id: "tx1",
    type: "lend",
    asset: getAssetBySymbol("ETH"),
    amount: 1.5,
    date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: "completed",
  },
  {
    id: "tx2",
    type: "borrow",
    asset: getAssetBySymbol("USDC"),
    amount: 500,
    date: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    status: "completed",
  },
  {
    id: "tx3",
    type: "swap",
    amount: 0.5,
    fromAsset: getAssetBySymbol("ETH"),
    toAsset: getAssetBySymbol("USDC"),
    asset: getAssetBySymbol("ETH"), // This is a bit weird, but needed for consistency
    date: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    status: "completed",
  },
  {
    id: "tx4",
    type: "interest",
    asset: getAssetBySymbol("ETH"),
    amount: 0.002,
    date: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    status: "completed",
  },
];

// Exchange rates for swaps
export const getExchangeRate = (fromAsset: Asset, toAsset: Asset): number => {
  return fromAsset.price / toAsset.price;
};

// Calculate price impact 
export const calculatePriceImpact = (amount: number, fromAsset: Asset): number => {
  // Mock calculation - in reality this would depend on liquidity depth
  const impact = amount * fromAsset.price / 1000000;
  return Math.min(impact, 5); // Cap at 5%
};
