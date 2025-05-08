
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import TransactionsTable from "@/components/transactions-table";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Fetch users and transactions
    fetchData();
  }, []);

  const fetchData = async () => {
    const [usersRes, txRes] = await Promise.all([
      fetch("/api/admin/users"),
      fetch("/api/admin/transactions")
    ]);
    
    if (usersRes.ok && txRes.ok) {
      setUsers(await usersRes.json());
      setTransactions(await txRes.json());
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">User Statistics</h2>
          <div className="text-3xl font-bold">{users.length}</div>
          <div className="text-gray-600">Total Users</div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Transaction Statistics</h2>
          <div className="text-3xl font-bold">{transactions.length}</div>
          <div className="text-gray-600">Total Transactions</div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">All Transactions</h2>
        <TransactionsTable transactions={transactions} />
      </Card>
    </div>
  );
}
