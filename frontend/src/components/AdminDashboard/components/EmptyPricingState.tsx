import React from 'react';
import { CreditCard, PlusCircle } from 'lucide-react';

interface EmptyPricingStateProps {
  onCreatePlan: () => void;
}

const EmptyPricingState: React.FC<EmptyPricingStateProps> = ({ onCreatePlan }) => {
  return (
    <div className="bg-gray-800 p-8 rounded-lg text-center shadow-md border border-gray-700">
      <div className="flex justify-center mb-4">
        <CreditCard className="h-16 w-16 text-gray-400" />
      </div>
      <h3 className="text-xl font-bold mb-2">No Pricing Plans</h3>
      <p className="text-gray-400 mb-6">You haven't created any pricing plans yet.</p>
      <button 
        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-md inline-flex items-center"
        onClick={onCreatePlan}
      >
        <PlusCircle className="h-5 w-5 mr-2" />
        Create First Plan
      </button>
    </div>
  );
};

export default EmptyPricingState;