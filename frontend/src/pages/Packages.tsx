import React from 'react';
import {
  Package,
  CreditCard,
  RefreshCw,
  Check,
  X,
} from 'lucide-react';

// Define types for subscription plan and pricing data
interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  tokens: number;
  interviews: number;
  duration?: string;
  current?: boolean;
}

interface TokenPackage {
  id: string;
  name: string;
  tokens: number;
  price: number;
  description: string;
  popular?: boolean;
}

interface PricingData {
  plans: SubscriptionPlan[];
  tokenPackages: TokenPackage[];
}

interface PackagesProps {
  currentPlan: SubscriptionPlan | null;
  pricingData: PricingData;
  onSelectPlan: (plan: SubscriptionPlan) => void;
  onPurchaseTokens: (pkg: TokenPackage) => void;
  tokensPercentage: number;
  interviewsPercentage: number;
}

const Packages: React.FC<PackagesProps> = ({
  currentPlan,
  pricingData,
  onSelectPlan,
  onPurchaseTokens,
  tokensPercentage,
  interviewsPercentage,
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold mb-6">Subscription & Packages</h2>

      {/* Current Subscription Overview */}
      {!currentPlan ? (
        <div className="bg-red-500 p-4 rounded-lg mb-8">
          <p>No active subscription found for this user.</p>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <div className="flex items-center mb-4">
                <CreditCard className="mr-2" />
                <h3 className="text-xl font-bold">Current Plan: {currentPlan.name}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-purple-200 mb-1">Tokens Usage</p>
                  <div className="w-full bg-purple-900 rounded-full h-3 mb-1">
                    <div
                      className="bg-white h-3 rounded-full"
                      style={{ width: `${tokensPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>0 used</span>
                    <span>{currentPlan.tokens} remaining</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-purple-200 mb-1">Interviews Conducted</p>
                  <div className="w-full bg-purple-900 rounded-full h-3 mb-1">
                    <div
                      className="bg-white h-3 rounded-full"
                      style={{ width: `${interviewsPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>0 used</span>
                    <span>{currentPlan.interviews} remaining</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 md:mt-0 flex flex-col justify-center items-start md:items-end">
              <div className="flex space-x-3 mt-2">
                <button 
                  className="bg-white text-purple-700 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium"
                  onClick={() => onSelectPlan(currentPlan)}
                >
                  Renew Plan
                </button>
                <button 
                  className="bg-purple-900 text-white hover:bg-purple-800 px-4 py-2 rounded-md text-sm font-medium"
                  onClick={() => {
                    const enterprisePlan = pricingData.plans.find(p => p.id === 'enterprise');
                    if (enterprisePlan) onSelectPlan(enterprisePlan);
                  }}
                >
                  Upgrade
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Token Packages */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold mb-4">Need More Tokens?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingData.tokenPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer relative"
            >
              {pkg.popular && (
                <div className="absolute -top-3 -right-3 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                  Popular
                </div>
              )}
              <h4 className="font-bold mb-2">{pkg.name}</h4>
              <p className="text-2xl font-bold mb-2">${pkg.price}</p>
              <p className="text-sm text-gray-300 mb-4">{pkg.description}</p>
              <button
                className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded text-sm"
                onClick={() => onPurchaseTokens(pkg)}
              >
                Purchase
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Available Plans */}
      <h3 className="text-2xl font-bold mb-4">Available Subscription Plans</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {pricingData.plans.map((plan) => (
          <div 
            key={plan.id} 
            className={`${
              plan.current 
                ? 'bg-gradient-to-b from-purple-700 to-purple-900' 
                : 'bg-gray-800'
            } rounded-lg overflow-hidden relative`}
          >
            {plan.current && (
              <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs px-3 py-1">
                CURRENT
              </div>
            )}
            <div className="p-6">
              <h4 className="text-xl font-bold mb-2">{plan.name}</h4>
              <p className="text-3xl font-bold mb-4">
                ${plan.price}
                <span className="text-sm font-normal">/month</span>
              </p>
              <p className={`text-sm ${plan.current ? 'text-purple-200' : 'text-gray-300'} mb-6`}>
                {plan.description}
              </p>
              
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => {
                  const isIncluded = !feature.includes('API access') || plan.id === 'enterprise';
                  return (
                    <li key={index} className="flex items-start">
                      {isIncluded ? (
                        <Check size={18} className="text-green-400 mr-2 mt-0.5" />
                      ) : (
                        <X size={18} className="text-red-400 mr-2 mt-0.5" />
                      )}
                      <span className={!isIncluded ? 'text-gray-400' : ''}>
                        {feature}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="px-6 pb-6">
              {plan.current ? (
                <button 
                  className="w-full bg-white text-purple-700 hover:bg-gray-100 py-3 rounded text-sm font-medium flex items-center justify-center"
                  onClick={() => onSelectPlan(plan)}
                >
                  <RefreshCw size={16} className="mr-2" />
                  Renew Plan
                </button>
              ) : (
                <button 
                  className={`w-full ${
                    plan.id === 'enterprise'
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : 'bg-gray-700 hover:bg-gray-600'
                  } py-3 rounded text-sm font-medium`}
                  onClick={() => onSelectPlan(plan)}
                >
                  {plan.id === 'enterprise' ? 'Upgrade' : 'Choose Plan'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Custom Enterprise Solutions */}
      <div className="bg-gradient-to-r from-blue-700 to-purple-700 rounded-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h3 className="text-xl font-bold mb-2">Need a Custom Solution?</h3>
            <p className="max-w-2xl">
              We offer tailored enterprise solutions for organizations with specific requirements.
              Our team will work with you to create a custom package that fits your needs.
            </p>
          </div>
          <button className="mt-4 md:mt-0 bg-white text-purple-700 hover:bg-gray-100 px-6 py-3 rounded-md font-medium">
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  );
};

export default Packages;