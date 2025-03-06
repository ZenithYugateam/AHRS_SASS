import React, { useEffect, useState } from 'react';
import { Check, CreditCard, RefreshCw, PlusCircle, X, Clock, MapPin, DollarSign } from 'lucide-react';
import axios from 'axios';
import PaymentModal from '../components/StripePayment';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  tokens: number;
  interviews: number;
  duration?: string;
  // Optional flag to mark the current plan
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

const defaultPricingData: PricingData = {
  plans: [
    {
      id: 'basic',
      name: 'Basic',
      price: 29,
      description: 'Perfect for startups and small businesses',
      features: ['300 tokens per month', 'Up to 10 interviews', 'Basic analytics'],
      tokens: 300,
      interviews: 10,
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 79,
      description: 'Ideal for growing companies',
      features: ['1000 tokens per month', 'Up to 20 interviews', 'Advanced analytics', 'Custom branding'],
      tokens: 1000,
      interviews: 20,
      current: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 199,
      description: 'For large organizations with high volume',
      features: ['3000 tokens per month', 'Unlimited interviews', 'Premium analytics & reporting', 'Custom branding', 'API access'],
      tokens: 3000,
      interviews: 999,
    }
  ],
  tokenPackages: [
    {
      id: 'small',
      name: '100 Tokens',
      tokens: 100,
      price: 19,
      description: 'Best for small teams'
    },
    {
      id: 'medium',
      name: '500 Tokens',
      tokens: 500,
      price: 79,
      description: 'Best for medium teams',
      popular: true
    },
    {
      id: 'large',
      name: '1000 Tokens',
      tokens: 1000,
      price: 149,
      description: 'Best for large teams'
    }
  ]
};

const PackagesPage: React.FC = () => {
  const [pricingData, setPricingData] = useState<PricingData>(defaultPricingData);
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<TokenPackage | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [paymentType, setPaymentType] = useState<'token' | 'plan' | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Usage stats (for display in the subscription panel)
  const tokensUsed = 0;
  const tokensPercentage = currentPlan && currentPlan.tokens > 0
    ? Math.floor((tokensUsed / currentPlan.tokens) * 100)
    : 0;
  const interviewsUsed = 0;
  const interviewsPercentage = currentPlan && currentPlan.interviews > 0
    ? Math.floor((interviewsUsed / currentPlan.interviews) * 100)
    : 0;
  
  // Fetch pricing data from your API (if available)
  const fetchPricingData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        'https://ngwu0au0uh.execute-api.us-east-1.amazonaws.com/default/get_pricing_list'
      );
      if (response.data) {
        // You can transform the API response if needed
        setPricingData(response.data);
      } else {
        setPricingData(defaultPricingData);
      }
    } catch (error) {
      console.error('Error fetching pricing data:', error);
      setPricingData(defaultPricingData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPricingData();
  }, []);

  // Update current plan when pricingData is updated
  useEffect(() => {
    if (pricingData?.plans) {
      const activePlan = pricingData.plans.find(plan => plan.current);
      setCurrentPlan(activePlan || null);
    }
  }, [pricingData]);

  const handlePurchaseTokens = (pkg: TokenPackage) => {
    setSelectedPackage(pkg);
    setSelectedPlan(null);
    setPaymentType('token');
    setPaymentModalOpen(true);
  };

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setSelectedPackage(null);
    setPaymentType('plan');
    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    if (paymentType === 'token' && selectedPackage && currentPlan) {
      setCurrentPlan({ ...currentPlan, tokens: currentPlan.tokens + selectedPackage.tokens });
    } else if (paymentType === 'plan' && selectedPlan) {
      // Update the local pricing data marking the selected plan as current
      const updatedPlans = pricingData.plans.map(plan => ({
        ...plan,
        current: plan.id === selectedPlan.id
      }));
      setPricingData({ ...pricingData, plans: updatedPlans });
      setCurrentPlan(selectedPlan);
    }
    setPaymentSuccess(true);
    setTimeout(() => setPaymentSuccess(false), 5000);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">
      {paymentSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 flex items-center">
          <Check className="mr-2" size={20} />
          Payment successful! Your account has been updated.
        </div>
      )}

      <PaymentModal 
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        amount={selectedPackage ? selectedPackage.price : selectedPlan ? selectedPlan.price : 0}
        description={
          selectedPackage
            ? `Purchase ${selectedPackage.name} (${selectedPackage.tokens} tokens)`
            : selectedPlan
            ? `Subscribe to ${selectedPlan.name} Plan`
            : ''
        }
        onSuccess={handlePaymentSuccess}
      />

      <h2 className="text-3xl font-bold mb-6">Subscription & Packages</h2>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <>
          {/* Current Subscription Overview */}
          {currentPlan ? (
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
                        <div className="bg-white h-3 rounded-full" style={{ width: `${tokensPercentage}%` }}></div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{tokensUsed} used</span>
                        <span>{currentPlan.tokens} remaining</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-purple-200 mb-1">Interviews Conducted</p>
                      <div className="w-full bg-purple-900 rounded-full h-3 mb-1">
                        <div className="bg-white h-3 rounded-full" style={{ width: `${interviewsPercentage}%` }}></div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{interviewsUsed} used</span>
                        <span>{currentPlan.interviews} remaining</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 md:mt-0 flex flex-col justify-center items-end">
                  <div className="flex space-x-3 mt-2">
                    <button 
                      className="bg-white text-purple-700 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium"
                      onClick={() => handleSelectPlan(currentPlan)}
                    >
                      Renew Plan
                    </button>
                    <button 
                      className="bg-purple-900 text-white hover:bg-purple-800 px-4 py-2 rounded-md text-sm font-medium"
                      onClick={() => {
                        const enterprisePlan = pricingData.plans.find(p => p.id === 'enterprise');
                        if (enterprisePlan) handleSelectPlan(enterprisePlan);
                      }}
                    >
                      Upgrade
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-500 p-4 rounded-lg mb-8">
              <p>No active subscription found for this user.</p>
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
                    onClick={() => handlePurchaseTokens(pkg)}
                  >
                    Purchase
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Available Subscription Plans */}
          <h3 className="text-2xl font-bold mb-4">Available Subscription Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {pricingData.plans.map((plan) => (
              <div 
                key={plan.id} 
                className={`${plan.current ? 'bg-gradient-to-b from-purple-700 to-purple-900' : 'bg-gray-800'} rounded-lg overflow-hidden relative`}
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
                      onClick={() => handleSelectPlan(plan)}
                    >
                      <RefreshCw size={16} className="mr-2" />
                      Renew Plan
                    </button>
                  ) : (
                    <button 
                      className={`w-full ${plan.id === 'enterprise' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-700 hover:bg-gray-600'} py-3 rounded text-sm font-medium`}
                      onClick={() => handleSelectPlan(plan)}
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
        </>
      )}
    </div>
  );
};

export default PackagesPage;
