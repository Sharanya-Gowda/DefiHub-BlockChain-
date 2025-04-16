import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { CryptoIcon, DualCryptoIcon } from "@/components/ui/crypto-icon";
import { transactions } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TransactionsTableProps {
  limit?: number;
  showViewAll?: boolean;
}

export default function TransactionsTable({ limit, showViewAll = false }: TransactionsTableProps) {
  const displayedTransactions = limit ? transactions.slice(0, limit) : transactions;
  
  // Format timestamp relative to now (e.g. "2 hours ago")
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Transactions</h2>
        {showViewAll && (
          <Link href="/history">
            <Button variant="link" className="text-primary hover:text-blue-700 text-sm font-medium p-0 h-auto">
              View All
            </Button>
          </Link>
        )}
      </div>
      
      <Card className="bg-white shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="outline" className={`
                      ${tx.type === 'lend' ? 'bg-blue-100 text-blue-800' : ''}
                      ${tx.type === 'borrow' ? 'bg-purple-100 text-purple-800' : ''}
                      ${tx.type === 'swap' ? 'bg-green-100 text-green-800' : ''}
                      ${tx.type === 'interest' ? 'bg-yellow-100 text-yellow-800' : ''}
                    `}>
                      {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {tx.type === 'swap' && tx.fromAsset && tx.toAsset ? (
                        <div className="flex-shrink-0 h-6 w-6 flex">
                          <img className="h-6 w-6 rounded-full" src={tx.fromAsset.icon} alt={tx.fromAsset.symbol} />
                          <img className="h-6 w-6 rounded-full -ml-2" src={tx.toAsset.icon} alt={tx.toAsset.symbol} />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 h-6 w-6">
                          <img className="h-6 w-6 rounded-full" src={tx.asset.icon} alt={tx.asset.symbol} />
                        </div>
                      )}
                      
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {tx.type === 'swap' && tx.fromAsset && tx.toAsset 
                            ? `${tx.fromAsset.symbol} → ${tx.toAsset.symbol}`
                            : `${tx.asset.name} (${tx.asset.symbol})`
                          }
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-mono ${
                      tx.type === 'borrow' ? 'text-error' : 
                      tx.type === 'interest' ? 'text-success' : ''
                    }`}>
                      {tx.type === 'swap' && tx.fromAsset && tx.toAsset 
                        ? `${tx.amount} ${tx.fromAsset.symbol} → ${(tx.amount * tx.fromAsset.price / tx.toAsset.price).toFixed(2)} ${tx.toAsset.symbol}`
                        : `${tx.type === 'borrow' ? '-' : '+'} ${tx.amount} ${tx.asset.symbol}`
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatRelativeTime(tx.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="outline" className={`
                      ${tx.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                      ${tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${tx.status === 'failed' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
