import { portfolioSummary } from "@/lib/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

export default function PortfolioOverview() {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Portfolio Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Value Card */}
        <Card className="bg-white shadow-sm border border-gray-100">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Total Value</p>
                <p className="text-2xl font-semibold font-mono">${portfolioSummary.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <i className="ri-funds-line text-primary text-xl"></i>
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className={`font-medium flex items-center ${portfolioSummary.totalValueChange24h >= 0 ? 'text-success' : 'text-error'}`}>
                {portfolioSummary.totalValueChange24h >= 0 ? 
                  <ArrowUpIcon className="h-4 w-4 mr-1" /> : 
                  <ArrowDownIcon className="h-4 w-4 mr-1" />
                }
                {Math.abs(portfolioSummary.totalValueChange24h)}%
              </span>
              <span className="text-gray-500 ml-2">last 24h</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Lending Value Card */}
        <Card className="bg-white shadow-sm border border-gray-100">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Lending Value</p>
                <p className="text-2xl font-semibold font-mono">${portfolioSummary.lendingValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <i className="ri-money-dollar-circle-line text-secondary text-xl"></i>
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className={`font-medium flex items-center ${portfolioSummary.lendingValueChange24h >= 0 ? 'text-success' : 'text-error'}`}>
                {portfolioSummary.lendingValueChange24h >= 0 ? 
                  <ArrowUpIcon className="h-4 w-4 mr-1" /> : 
                  <ArrowDownIcon className="h-4 w-4 mr-1" />
                }
                {Math.abs(portfolioSummary.lendingValueChange24h)}%
              </span>
              <span className="text-gray-500 ml-2">last 24h</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Borrowed Value Card */}
        <Card className="bg-white shadow-sm border border-gray-100">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Borrowed Value</p>
                <p className="text-2xl font-semibold font-mono">${portfolioSummary.borrowedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div className="bg-purple-100 p-2 rounded-lg">
                <i className="ri-coin-line text-accent text-xl"></i>
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className={`font-medium flex items-center ${portfolioSummary.borrowedValueChange24h >= 0 ? 'text-success' : 'text-error'}`}>
                {portfolioSummary.borrowedValueChange24h >= 0 ? 
                  <ArrowUpIcon className="h-4 w-4 mr-1" /> : 
                  <ArrowDownIcon className="h-4 w-4 mr-1" />
                }
                {Math.abs(portfolioSummary.borrowedValueChange24h)}%
              </span>
              <span className="text-gray-500 ml-2">last 24h</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
