import { CryptoIcon } from "@/components/ui/crypto-icon";
import { 
  lendingPositions, 
  borrowingPositions,
  liquidityPositions
} from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { DualCryptoIcon } from "./ui/crypto-icon";

interface AssetPositionsProps {
  activeTab: "lending" | "borrowing" | "liquidity";
}

export default function AssetPositions({ activeTab }: AssetPositionsProps) {
  return (
    <div className="overflow-x-auto">
      {activeTab === "lending" && (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">APY</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Earned</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {lendingPositions.map((position, index) => (
              <tr key={`lending-${index}`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <CryptoIcon src={position.asset.icon} alt={position.asset.symbol} />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{position.asset.name}</div>
                      <div className="text-xs text-gray-500">{position.asset.symbol}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium font-mono">{position.balance} {position.asset.symbol}</div>
                  <div className="text-xs text-gray-500 font-mono">${(position.balance * position.asset.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-success font-medium">{position.apy}%</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-mono">{position.earned} {position.asset.symbol}</div>
                  <div className="text-xs text-gray-500 font-mono">${(position.earned * position.asset.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors mr-2 text-sm font-semibold">Withdraw</button>
                  <button className="bg-purple-600 text-white px-4 py-1.5 rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold">Borrow</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeTab === "borrowing" && (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrowed</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collateral</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Health Factor</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {borrowingPositions.map((position, index) => (
              <tr key={`borrowing-${index}`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <CryptoIcon src={position.asset.icon} alt={position.asset.symbol} />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{position.asset.name}</div>
                      <div className="text-xs text-gray-500">{position.asset.symbol}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium font-mono">{position.amount} {position.asset.symbol}</div>
                  <div className="text-xs text-gray-500 font-mono">${(position.amount * position.asset.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-semibold inline-block">{position.interest}% APR</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <CryptoIcon src={position.collateral.icon} alt={position.collateral.symbol} size={6} />
                    <div className="ml-2 text-sm font-mono">
                      {position.collateralAmount} {position.collateral.symbol}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${
                    position.healthFactor > 1.5 ? 'text-success' : 
                    position.healthFactor > 1.1 ? 'text-warning' : 'text-error'
                  }`}>
                    {position.healthFactor.toFixed(1)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold shadow-sm hover:shadow-md transition-all duration-200 mr-2">Repay</button>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow-sm hover:shadow-md transition-all duration-200">Add Collateral</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeTab === "liquidity" && (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pool</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Liquidity Value</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Share</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">APY</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {liquidityPositions.map((position, index) => (
              <tr key={`liquidity-${index}`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <DualCryptoIcon 
                      src1={position.pair[0].icon} 
                      src2={position.pair[1].icon} 
                      alt1={position.pair[0].symbol} 
                      alt2={position.pair[1].symbol}
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {position.pair[0].symbol} / {position.pair[1].symbol}
                      </div>
                      <div className="text-xs text-gray-500">0.3% fee tier</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-mono">${position.liquidity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium">{(position.share * 100).toFixed(2)}%</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold inline-block">{position.apy}%</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow-sm hover:shadow-md transition-all duration-200 mr-2">Remove</button>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow-sm hover:shadow-md transition-all duration-200">Add</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}