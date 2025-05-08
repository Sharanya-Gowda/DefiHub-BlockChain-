import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { assets } from "@/lib/mockData";

export default function LendingMarket() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lending Market</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-2">Asset</th>
                <th className="text-left p-2">APY</th>
                <th className="text-left p-2">Total Supply</th>
                <th className="text-right p-2">Action</th>
              </tr>
            </thead>
            <tbody>{assets.map((asset) => (
                <tr key={asset.symbol}>
                  <td className="p-2">{asset.name}</td>
                  <td className="p-2">{asset.lendingAPY}%</td>
                  <td className="p-2">${asset.totalSupply.toLocaleString()}</td>
                  <td className="text-right p-2">
                    <Button size="sm">Lend</Button>
                  </td>
                </tr>))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}