// Real-time Price Oracle Integration
// Supports multiple oracle providers for authentic price data

export interface PriceFeed {
  symbol: string;
  price: number;
  timestamp: number;
  confidence: number;
  source: string;
  change24h: number;
  volume24h: number;
}

export interface OracleProvider {
  name: string;
  baseUrl: string;
  apiKey?: string;
  rateLimit: number;
}

// Popular oracle providers configuration
export const ORACLE_PROVIDERS = {
  CHAINLINK: {
    name: 'Chainlink',
    baseUrl: 'https://api.chain.link/v1/feeds',
    rateLimit: 100
  },
  COINGECKO: {
    name: 'CoinGecko',
    baseUrl: 'https://api.coingecko.com/api/v3',
    rateLimit: 50
  },
  COINMARKETCAP: {
    name: 'CoinMarketCap',
    baseUrl: 'https://pro-api.coinmarketcap.com/v1',
    rateLimit: 333
  },
  PYTH: {
    name: 'Pyth Network',
    baseUrl: 'https://benchmarks.pyth.network/v1',
    rateLimit: 200
  }
};

export class PriceOracleManager {
  private providers: Map<string, OracleProvider> = new Map();
  private priceCache: Map<string, PriceFeed> = new Map();
  private subscribers: Map<string, Set<(price: PriceFeed) => void>> = new Map();
  private updateInterval: NodeJS.Timeout | null = null;
  private isUpdating = false;

  constructor() {
    this.initializeProviders();
    this.startPriceUpdates();
  }

  private initializeProviders() {
    Object.values(ORACLE_PROVIDERS).forEach(provider => {
      this.providers.set(provider.name, provider);
    });
  }

  // Subscribe to price updates for a specific asset
  subscribe(symbol: string, callback: (price: PriceFeed) => void): () => void {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, new Set());
    }
    
    this.subscribers.get(symbol)!.add(callback);
    
    // Send cached price immediately if available
    const cachedPrice = this.priceCache.get(symbol);
    if (cachedPrice) {
      callback(cachedPrice);
    }

    // Return unsubscribe function
    return () => {
      const symbolSubscribers = this.subscribers.get(symbol);
      if (symbolSubscribers) {
        symbolSubscribers.delete(callback);
        if (symbolSubscribers.size === 0) {
          this.subscribers.delete(symbol);
        }
      }
    };
  }

  // Get current price for an asset
  async getPrice(symbol: string): Promise<PriceFeed | null> {
    // Check cache first
    const cached = this.priceCache.get(symbol);
    if (cached && Date.now() - cached.timestamp < 30000) { // 30 second cache
      return cached;
    }

    // Fetch from multiple sources for reliability
    const prices = await Promise.allSettled([
      this.fetchFromCoinGecko(symbol),
      this.fetchFromCoinMarketCap(symbol),
      this.fetchFromPyth(symbol)
    ]);

    const validPrices = prices
      .filter((result): result is PromiseFulfilledResult<PriceFeed> => 
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value);

    if (validPrices.length === 0) {
      return null;
    }

    // Use median price for better accuracy
    const medianPrice = this.calculateMedianPrice(validPrices);
    
    // Cache the result
    this.priceCache.set(symbol, medianPrice);
    
    // Notify subscribers
    this.notifySubscribers(symbol, medianPrice);
    
    return medianPrice;
  }

  // Fetch price from CoinGecko (free tier)
  private async fetchFromCoinGecko(symbol: string): Promise<PriceFeed | null> {
    try {
      const coinId = this.getCoinGeckoId(symbol);
      const response = await fetch(
        `${ORACLE_PROVIDERS.COINGECKO.baseUrl}/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`
      );
      
      if (!response.ok) return null;
      
      const data = await response.json();
      const coinData = data[coinId];
      
      if (!coinData) return null;

      return {
        symbol: symbol.toUpperCase(),
        price: coinData.usd,
        timestamp: Date.now(),
        confidence: 0.95,
        source: 'CoinGecko',
        change24h: coinData.usd_24h_change || 0,
        volume24h: coinData.usd_24h_vol || 0
      };
    } catch (error) {
      console.error(`CoinGecko price fetch error for ${symbol}:`, error);
      return null;
    }
  }

  // Fetch price from CoinMarketCap (requires API key)
  private async fetchFromCoinMarketCap(symbol: string): Promise<PriceFeed | null> {
    const apiKey = import.meta.env.VITE_COINMARKETCAP_API_KEY;
    if (!apiKey) return null;

    try {
      const response = await fetch(
        `${ORACLE_PROVIDERS.COINMARKETCAP.baseUrl}/cryptocurrency/quotes/latest?symbol=${symbol}`,
        {
          headers: {
            'X-CMC_PRO_API_KEY': apiKey
          }
        }
      );
      
      if (!response.ok) return null;
      
      const data = await response.json();
      const quote = data.data[symbol]?.quote?.USD;
      
      if (!quote) return null;

      return {
        symbol: symbol.toUpperCase(),
        price: quote.price,
        timestamp: Date.now(),
        confidence: 0.98,
        source: 'CoinMarketCap',
        change24h: quote.percent_change_24h || 0,
        volume24h: quote.volume_24h || 0
      };
    } catch (error) {
      console.error(`CoinMarketCap price fetch error for ${symbol}:`, error);
      return null;
    }
  }

  // Fetch price from Pyth Network
  private async fetchFromPyth(symbol: string): Promise<PriceFeed | null> {
    try {
      const priceId = this.getPythPriceId(symbol);
      const response = await fetch(
        `${ORACLE_PROVIDERS.PYTH.baseUrl}/price_feeds?ids[]=${priceId}`
      );
      
      if (!response.ok) return null;
      
      const data = await response.json();
      const priceFeed = data[0];
      
      if (!priceFeed) return null;

      const price = priceFeed.price.price * Math.pow(10, priceFeed.price.expo);

      return {
        symbol: symbol.toUpperCase(),
        price: price,
        timestamp: Date.now(),
        confidence: priceFeed.price.conf / price,
        source: 'Pyth Network',
        change24h: 0, // Pyth doesn't provide 24h change
        volume24h: 0
      };
    } catch (error) {
      console.error(`Pyth price fetch error for ${symbol}:`, error);
      return null;
    }
  }

  private calculateMedianPrice(prices: PriceFeed[]): PriceFeed {
    const sortedPrices = prices.sort((a, b) => a.price - b.price);
    const medianIndex = Math.floor(sortedPrices.length / 2);
    const medianPrice = sortedPrices[medianIndex];
    
    // Calculate weighted average of other metrics
    const totalConfidence = prices.reduce((sum, p) => sum + p.confidence, 0);
    const avgChange24h = prices.reduce((sum, p) => sum + p.change24h, 0) / prices.length;
    const avgVolume24h = prices.reduce((sum, p) => sum + p.volume24h, 0) / prices.length;

    return {
      ...medianPrice,
      confidence: totalConfidence / prices.length,
      change24h: avgChange24h,
      volume24h: avgVolume24h,
      source: `Aggregated (${prices.length} sources)`
    };
  }

  private notifySubscribers(symbol: string, price: PriceFeed) {
    const subscribers = this.subscribers.get(symbol);
    if (subscribers) {
      subscribers.forEach(callback => callback(price));
    }
  }

  private startPriceUpdates() {
    this.updateInterval = setInterval(async () => {
      if (this.isUpdating) return;
      
      this.isUpdating = true;
      
      // Update prices for all subscribed symbols
      const symbols = Array.from(this.subscribers.keys());
      await Promise.all(symbols.map(symbol => this.getPrice(symbol)));
      
      this.isUpdating = false;
    }, 30000); // Update every 30 seconds
  }

  private getCoinGeckoId(symbol: string): string {
    const mapping: Record<string, string> = {
      'BTC': 'bitcoin',
      'ETH': 'ethereum',
      'USDC': 'usd-coin',
      'USDT': 'tether',
      'DAI': 'dai',
      'LINK': 'chainlink',
      'UNI': 'uniswap',
      'AAVE': 'aave'
    };
    return mapping[symbol.toUpperCase()] || symbol.toLowerCase();
  }

  private getPythPriceId(symbol: string): string {
    const mapping: Record<string, string> = {
      'BTC': '0xe62df6c8b4c85fe1b7bd04b4ab6f6ff48ee3c16cddf6c86e7c7ad9f0f3c8e8b8',
      'ETH': '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
      'USDC': '0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a',
      'USDT': '0x2b89b9dc5f0a3f4d7c3b9e1f8b7a1e8e5d4a6f7d2b5a1c3d2e9f1b4a7c5e8d6'
    };
    return mapping[symbol.toUpperCase()] || '';
  }

  destroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    this.subscribers.clear();
    this.priceCache.clear();
  }
}

// Global price oracle instance
export const priceOracle = new PriceOracleManager();