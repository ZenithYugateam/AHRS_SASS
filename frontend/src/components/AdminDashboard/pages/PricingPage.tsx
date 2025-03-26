import React, { useEffect, useState } from 'react';
import { PlusCircle, Zap, PieChart, TrendingUp } from 'lucide-react';
import PricingTable from '../components/PricingTable';
import EmptyPricingState from '../components/EmptyPricingState';
import PricingForm from '../components/PricingForm';

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

interface PricingPageProps {
  pricingPlans: PricingPlan[];
  showAddPricingForm: boolean;
  setShowAddPricingForm: (show: boolean) => void;
  handleAddPlan: (plan: Omit<PricingPlan, 'id' | 'subscribers' | 'revenue'>) => void;
  handleDeletePlan: (id: number) => void;
}

const PricingPage: React.FC<PricingPageProps> = ({
  pricingPlans,
  showAddPricingForm,
  setShowAddPricingForm,
  handleAddPlan,
  handleDeletePlan
}) => {
  // Local state to store pricing plans updated with subscribers count from the transactions API
  const [updatedPlans, setUpdatedPlans] = useState<PricingPlan[]>(pricingPlans);

  // Whenever pricingPlans prop changes, reset the updated plans state.
  useEffect(() => {
    setUpdatedPlans(pricingPlans);
  }, [pricingPlans]);

  // Fetch transactions from the GET API and update the subscribers field.
  useEffect(() => {
    const fetchTransactionsAndUpdateSubscribers = async () => {
      try {
        const response = await fetch('https://upftf5d4qb.execute-api.us-east-1.amazonaws.com/default/dash');
        const transactions = await response.json();

        // Filter transactions with a valid subscription type (ignoring unknown or empty)
        const validTransactions = transactions.filter((txn: any) => {
          const subType = txn.subscriptionType?.trim();
          return subType && subType.toLowerCase() !== 'unknown';
        });

        // Group transactions by subscription type using transactionId as unique subscriber
        const subscribersByType: { [key: string]: Set<string> } = {};
        validTransactions.forEach((txn: any) => {
          const subType = txn.subscriptionType.trim();
          if (!subscribersByType[subType]) {
            subscribersByType[subType] = new Set();
          }
          // Each unique transactionId counts as one subscriber
          subscribersByType[subType].add(txn.transactionId);
        });

        // Update pricing plans with the new subscribers count
        const newPlans = updatedPlans.map(plan => {
          const subsCount = subscribersByType[plan.name] ? subscribersByType[plan.name].size : 0;
          return { ...plan, subscribers: subsCount };
        });

        setUpdatedPlans(newPlans);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactionsAndUpdateSubscribers();
  }, [pricingPlans]); // Re-run when pricingPlans prop changes

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Pricing Plans Management</h2>
        <button 
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-md flex items-center shadow-md"
          onClick={() => setShowAddPricingForm(true)}
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Create New Plan
        </button>
      </div>
      
      {showAddPricingForm && (
        <PricingForm 
          onAddPlan={handleAddPlan}
          onCancel={() => setShowAddPricingForm(false)}
        />
      )}
      
      {updatedPlans.length > 0 ? (
        <PricingTable 
          plans={updatedPlans}
          onDeletePlan={handleDeletePlan}
        />
      ) : (
        <EmptyPricingState 
          onCreatePlan={() => setShowAddPricingForm(true)}
        />
      )}
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Pricing Recommendations</h3>
            <Zap className="h-5 w-5 text-yellow-400" />
          </div>
          <p className="text-gray-400 mb-4">Based on market analysis, we recommend:</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="text-green-400 mr-2">•</span>
              <span>Increase Basic Plan price by 10% to $32.99</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-2">•</span>
              <span>Add a new Enterprise tier at $299.99</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-2">•</span>
              <span>Increase Premium Plan tokens by 20%</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Popular Features</h3>
            <PieChart className="h-5 w-5 text-blue-400" />
          </div>
          <p className="text-gray-400 mb-4">Most valued by subscribers:</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">•</span>
              <span>Extended interview duration (85%)</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">•</span>
              <span>Higher token allocation (72%)</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">•</span>
              <span>Custom interview templates (68%)</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Churn Analysis</h3>
            <TrendingUp className="h-5 w-5 text-red-400" />
          </div>
          <p className="text-gray-400 mb-4">Reasons for cancellations:</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="text-red-400 mr-2">•</span>
              <span>Token limits too restrictive (42%)</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-400 mr-2">•</span>
              <span>Price too high for value (28%)</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-400 mr-2">•</span>
              <span>Missing advanced features (18%)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
