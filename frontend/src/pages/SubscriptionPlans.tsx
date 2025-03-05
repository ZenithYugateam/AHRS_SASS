import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SubscriptionPlans() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get('https://ngwu0au0uh.execute-api.us-east-1.amazonaws.com/default/get_pricing_list');
        setPlans(response.data);
      } catch (error) {
        console.error('Error fetching subscription plans:', error);
      }
    };

    fetchPlans();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
      {plans.map((plan) => (
        <div key={plan.id} className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="p-6">
            <h4 className="text-xl font-bold mb-2">{plan.name}</h4>
            <p className="text-3xl font-bold mb-4">${plan.price}<span className="text-sm font-normal">/month</span></p>
            <p className="text-sm text-gray-300 mb-6">Tokens: {plan.tokens}</p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <span>Duration: {plan.duration} days</span>
              </li>
              <li className="flex items-start">
                <span>Tokens per Minute: {plan.tokensPerMinute}</span>
              </li>
            </ul>
          </div>
          <div className="px-6 pb-6">
            <button className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded text-sm font-medium">
              Choose Plan
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SubscriptionPlans;
