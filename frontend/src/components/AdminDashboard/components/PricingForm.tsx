import React, { useState } from 'react';
import { Clock, Zap, DollarSign } from 'lucide-react';

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

interface PricingFormProps {
  onAddPlan: (plan: PricingPlan) => void;
  onCancel: () => void;
}

const PricingForm: React.FC<PricingFormProps> = ({ onAddPlan, onCancel }) => {
  const [newPlan, setNewPlan] = useState({
    name: '',
    duration: 0,
    tokensPerMinute: 0,
    tokens: 0,
    price: 0
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (newPlan.name && newPlan.duration > 0 && newPlan.tokensPerMinute > 0 && newPlan.tokens > 0 && newPlan.price > 0) {
      setLoading(true);
      setMessage('');

      try {
        const response = await fetch('https://1fyvrmedp8.execute-api.us-east-1.amazonaws.com/default/post_pricing', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newPlan),
        });

        const data = await response.json();

        if (response.ok) {
          setMessage('Plan created successfully!');
          onAddPlan({ ...newPlan, id: data.id, subscribers: 0, revenue: 0 });
          setNewPlan({ name: '', duration: 0, tokensPerMinute: 0, tokens: 0, price: 0 });
        } else {
          setMessage(`Error: ${data.error || 'Something went wrong'}`);
        }
      } catch (error) {
        setMessage('Error: Unable to connect to the server');
      }

      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg mb-6 shadow-md border border-gray-700">
      <h3 className="text-xl font-bold mb-4">Create New Pricing Plan</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-400 mb-2">Plan Name</label>
          <input 
            type="text" 
            className="w-full bg-gray-700 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={newPlan.name}
            onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
            placeholder="e.g. Premium Plan"
          />
        </div>
        
        <div>
          <label className="block text-gray-400 mb-2">Interview Duration (minutes)</label>
          <div className="relative">
            <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
            <input 
              type="number" 
              className="w-full bg-gray-700 rounded-md py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={newPlan.duration || ''}
              onChange={(e) => setNewPlan({...newPlan, duration: parseInt(e.target.value) || 0})}
              placeholder="e.g. 30"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-gray-400 mb-2">Tokens Per Minute</label>
          <div className="relative">
            <Zap className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
            <input 
              type="number" 
              className="w-full bg-gray-700 rounded-md py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={newPlan.tokensPerMinute || ''}
              onChange={(e) => setNewPlan({...newPlan, tokensPerMinute: parseInt(e.target.value) || 0})}
              placeholder="e.g. 100"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-gray-400 mb-2">Total Tokens Included</label>
          <div className="relative">
            <Zap className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
            <input 
              type="number" 
              className="w-full bg-gray-700 rounded-md py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={newPlan.tokens || ''}
              onChange={(e) => setNewPlan({...newPlan, tokens: parseInt(e.target.value) || 0})}
              placeholder="e.g. 3000"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-gray-400 mb-2">Price ($)</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
            <input 
              type="number" 
              step="0.01"
              className="w-full bg-gray-700 rounded-md py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={newPlan.price || ''}
              onChange={(e) => setNewPlan({...newPlan, price: parseFloat(e.target.value) || 0})}
              placeholder="e.g. 79.99"
            />
          </div>
        </div>
      </div>
      
      {message && (
        <p className={`mt-4 ${message.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>{message}</p>
      )}

      <div className="flex justify-end mt-6 space-x-3">
        <button 
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button 
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-md"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Create Plan'}
        </button>
      </div>
    </div>
  );
};

export default PricingForm;
