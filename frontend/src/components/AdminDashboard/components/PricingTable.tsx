import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface PricingPlan {
  id: string;
  name: string;
  duration: number;
  tokensPerMinute: number;
  tokens: number;
  price: number;
  subscribers: number;
  revenue: number;
}

const PricingTable: React.FC = () => {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch pricing plans from the get_pricing_list API.
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('https://ngwu0au0uh.execute-api.us-east-1.amazonaws.com/default/get_pricing_list');
        const data = await response.json();
        setPlans(
          data.map((plan: any) => ({
            id: plan.id,
            name: plan.name,
            duration: Number(plan.duration),
            tokensPerMinute: Number(plan.tokensPerMinute),
            tokens: Number(plan.tokens),
            price: Number(plan.price),
            subscribers: Number(plan.subscribers),
            revenue: Number(plan.revenue),
          }))
        );
      } catch (error) {
        console.error('Error fetching pricing plans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Fetch transactions from the dash API and update subscribers.
  useEffect(() => {
    // Only run this effect if there are already pricing plans loaded.
    if (plans.length === 0) return;

    const fetchTransactions = async () => {
      try {
        const response = await fetch('https://upftf5d4qb.execute-api.us-east-1.amazonaws.com/default/dash');
        const transactions = await response.json();

        // Filter transactions with a valid subscriptionType.
        const validTransactions = transactions.filter((txn: any) => {
          const subType = txn.subscriptionType?.trim();
          return subType && subType.toLowerCase() !== 'unknown';
        });

        // Group transactions by subscription type using a Set for unique transactionIds.
        const subscribersByType: { [key: string]: Set<string> } = {};
        validTransactions.forEach((txn: any) => {
          const subType = txn.subscriptionType.trim();
          if (!subscribersByType[subType]) {
            subscribersByType[subType] = new Set();
          }
          subscribersByType[subType].add(txn.transactionId);
        });

        // Update each plan's subscriber count based on matching plan name and subscription type.
        setPlans(prevPlans =>
          prevPlans.map(plan => {
            const subsCount = subscribersByType[plan.name] ? subscribersByType[plan.name].size : 0;
            return { ...plan, subscribers: subsCount };
          })
        );
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, [plans.length]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch('https://hh1ljjljzj.execute-api.us-east-1.amazonaws.com/default/delete_pricing_plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (!response.ok) throw new Error('Failed to delete plan');

      setPlans(prev => prev.filter(plan => plan.id !== id));
      toast.success('Plan deleted successfully');
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast.error('Failed to delete plan');
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md border border-gray-700">
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="bg-gray-700 text-left">
              <th className="p-4">Plan Name</th>
              <th className="p-4">Duration (min)</th>
              <th className="p-4">Tokens/Min</th>
              <th className="p-4">Total Tokens</th>
              <th className="p-4">Price ($)</th>
              <th className="p-4">Subscribers</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.id} className="border-b border-gray-700 hover:bg-gray-750">
                <td className="p-4 font-medium">{plan.name}</td>
                <td className="p-4">{plan.duration}</td>
                <td className="p-4">{plan.tokensPerMinute}</td>
                <td className="p-4">{plan.tokens.toLocaleString()}</td>
                <td className="p-4">${plan.price.toFixed(2)}</td>
                <td className="p-4">{plan.subscribers}</td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    <button 
                      className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-gray-700"
                      onClick={() => handleDelete(plan.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PricingTable;
