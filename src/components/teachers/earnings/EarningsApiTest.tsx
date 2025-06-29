import React, { useEffect, useState } from 'react';
import { teacherService } from '@/integrations/api';
import type { TeacherBalance, TeacherTransaction } from '@/integrations/api';

// Simple test component to demonstrate the new API endpoints
const EarningsApiTest: React.FC = () => {
  const [balance, setBalance] = useState<TeacherBalance | null>(null);
  const [transactions, setTransactions] = useState<TeacherTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch teacher balance
        const balanceResponse = await teacherService.getTeacherBalance();
        if (balanceResponse.data) {
          setBalance(balanceResponse.data);
        }

        // Fetch all transactions
        const transactionsResponse = await teacherService.getAllTransactions();
        if (transactionsResponse.data) {
          setTransactions(transactionsResponse.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-6">Loading teacher earnings data...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Teacher Earnings API Test</h2>
      
      {/* Balance Summary */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Balance Summary</h3>
        {balance ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-xl font-bold">${balance.totalEarnings}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Payouts</p>
              <p className="text-xl font-bold">${balance.totalPayouts}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Refunds</p>
              <p className="text-xl font-bold">${balance.totalRefunds}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Balance</p>
              <p className="text-xl font-bold text-green-600">${balance.currentBalance}</p>
            </div>
          </div>
        ) : (
          <p>No balance data available</p>
        )}
      </div>

      {/* Transactions List */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        {transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Amount</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Description</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction._id} className="border-b">
                    <td className="p-2">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-2 capitalize">{transaction.transactionType}</td>
                    <td className="p-2 font-semibold">${transaction.amount}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="p-2">{transaction.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No transactions found</p>
        )}
      </div>
    </div>
  );
};

export default EarningsApiTest;