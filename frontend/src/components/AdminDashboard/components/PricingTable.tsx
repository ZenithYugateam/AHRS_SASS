import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

interface PricingPlan {
  id: number;
  name: string;
  duration: number;
  tokensPerMinute: number;
  tokens: number;
  price: number;
  subscribers: number;
  revenue: number;
}

interface PricingTableProps {
  plans: PricingPlan[];
  onDeletePlan: (id: number) => void;
}

const PricingTable: React.FC<PricingTableProps> = ({ plans, onDeletePlan }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md border border-gray-700">
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
                  <button className="text-blue-400 hover:text-blue-300 p-1 rounded hover:bg-gray-700">
                    <Edit className="h-5 w-5" />
                  </button>
                  <button 
                    className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-gray-700"
                    onClick={() => onDeletePlan(plan.id)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PricingTable;