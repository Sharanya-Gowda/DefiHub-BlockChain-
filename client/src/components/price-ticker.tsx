import { useState, useEffect } from 'react';
import { usePriceFeed, useMultiplePriceFeeds } from '@/hooks/use-price-feed';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Clock,
  Wifi,
  WifiOff,
  Activity
} from 'lucide-react';

interface PriceTickerProps {
  symbol: string;
  showDetails?: boolean;
  compact?: boolean;
}

export function PriceTicker({ symbol, showDetails = false, compact = false }: PriceTickerProps) {
  const { price, loading, error, lastUpdated, refresh, isStale } = usePriceFeed(symbol, {
    enableAutoRefresh: true,
    refreshInterval: 30000
  });

  const formatPrice = (price: number) => {
    if (price >= 1) {
      return `$${price.toLocaleString('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      })}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600 dark:text-green-400';
    if (change < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4" />;
    if (change < 0) return <TrendingDown className="h-4 w-4" />;
    return null;
  };

  if (loading) {
    return (
      <div className={compact ? "flex items-center space-x-2" : ""}>
        <Skeleton className={compact ? "h-6 w-20" : "h-8 w-24"} />
        <Skeleton className={compact ? "h-4 w-16" : "h-6 w-20"} />
      </div>
    );
  }

  if (error || !price) {
    return (
      <div className={`flex items-center space-x-2 ${compact ? 'text-sm' : ''}`}>
        <WifiOff className="h-4 w-4 text-red-500" />
        <span className="text-red-600 dark:text-red-400">
          {error || 'Price unavailable'}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={refresh}
          className="h-6 w-6 p-0"
        >
          <RefreshCw className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          <span className="font-semibold text-sm">{formatPrice(price.price)}</span>
          <div className={`flex items-center space-x-1 ${getChangeColor(price.change24h)}`}>
            {getChangeIcon(price.change24h)}
            <span className="text-xs">{formatChange(price.change24h)}</span>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {isStale ? (
            <WifiOff className="h-3 w-3 text-orange-500" />
          ) : (
            <Wifi className="h-3 w-3 text-green-500" />
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">{symbol.toUpperCase()}</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant={isStale ? "destructive" : "secondary"} className="text-xs">
              {isStale ? "Stale" : "Live"}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={refresh}
              className="h-6 w-6 p-0"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{formatPrice(price.price)}</div>
            <div className={`flex items-center space-x-1 ${getChangeColor(price.change24h)}`}>
              {getChangeIcon(price.change24h)}
              <span className="text-lg font-semibold">{formatChange(price.change24h)}</span>
            </div>
          </div>

          {showDetails && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">24h Volume:</span>
                <span className="font-medium">
                  ${price.volume24h.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Confidence:</span>
                <span className="font-medium">{(price.confidence * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Source:</span>
                <span className="font-medium">{price.source}</span>
              </div>
              {lastUpdated && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span className="font-medium">{lastUpdated.toLocaleTimeString()}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface MarketOverviewProps {
  symbols: string[];
}

export function MarketOverview({ symbols }: MarketOverviewProps) {
  const { prices, loading, errors, refresh } = useMultiplePriceFeeds(symbols, {
    enableAutoRefresh: true,
    refreshInterval: 30000
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Market Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {symbols.map(symbol => (
              <div key={symbol} className="flex items-center justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Market Overview</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={refresh}
            className="h-6 w-6 p-0"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {symbols.map(symbol => {
            const price = prices.get(symbol);
            const error = errors.get(symbol);

            if (error) {
              return (
                <div key={symbol} className="flex items-center justify-between">
                  <span className="font-medium">{symbol.toUpperCase()}</span>
                  <span className="text-red-600 dark:text-red-400 text-sm">{error}</span>
                </div>
              );
            }

            if (!price) {
              return (
                <div key={symbol} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              );
            }

            return (
              <div key={symbol} className="flex items-center justify-between">
                <span className="font-medium">{symbol.toUpperCase()}</span>
                <span className="font-mono">
                  {price.price >= 1 
                    ? `$${price.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    : `$${price.price.toFixed(6)}`
                  }
                </span>
                <div className={`flex items-center space-x-1 ${
                  price.change24h > 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : price.change24h < 0 
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {price.change24h > 0 && <TrendingUp className="h-3 w-3" />}
                  {price.change24h < 0 && <TrendingDown className="h-3 w-3" />}
                  <span className="text-sm">
                    {price.change24h >= 0 ? '+' : ''}{price.change24h.toFixed(2)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}