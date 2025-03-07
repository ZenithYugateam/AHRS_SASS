import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  User,
  BarChart3,
  Users,
  Target,
  PlusCircle,
  CreditCard,
  Clock,
  Check,
  X,
  RefreshCw,
  Mic,
  Home,
  Zap,
  Briefcase, 
  MapPin, 
  DollarSign
} from 'lucide-react';
import axios from 'axios';
import PaymentModal from '../components/StripePayment';

// Custom ChevronUp and ChevronDown components
const ChevronUp = ({ size = 24, ...props }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
);

const ChevronDown = ({ size = 24, ...props }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

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
  : string;
  popular?: boolean;
}

interface PricingData {
  plans: SubscriptionPlan[];
  tokenPackages: TokenPackage[];
}

// Define job type
interface Job {
  job_id: string;
  job_title: string;
  job_description?: string;
  experience?: string;
  location?: string;
  salary?: string;
  company_id: string;
}

// Define CandidateRow type for interview stats API response
interface CandidateRow {
  candidateId: string;
  jobId: string;
  status: number;
  title: string;
  postedOn: string;
}

// Default pricing data for token packages and additional plans
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

function Dashboard() {
  const navigate = useNavigate();

  // User details from session storage
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);

  // Additional states
  const [isSubscriptionExpanded, setIsSubscriptionExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [pricingData, setPricingData] = useState<PricingData>(defaultPricingData);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<TokenPackage | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentType, setPaymentType] = useState<'token' | 'plan' | null>(null);

  // The current plan, fetched from your subscription API
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null);

  // New states for dynamic interview statistics
  const [totalInterviews, setTotalInterviews] = useState<number>(0);
  const [totalParticipants, setTotalParticipants] = useState<number>(0);
  const [totalQualified, setTotalQualified] = useState<number>(0);

  // On mount, parse the "user" object from sessionStorage
  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    console.log("User Data:", userData);
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUserName(parsed.username);
        setUserEmail(parsed.email || "No Email Found");
        setSessionEmail(parsed.email);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  // Fetch subscription details from your API
  const fetchUserSubscription = async () => {
    setIsLoading(true);
    try {
      if (!sessionEmail) {
        console.warn("No email found in session storage for subscription fetch.");
        setIsLoading(false);
        return;
      }
      const response = await axios.get(
        `https://ywl2agqqd3.execute-api.us-east-1.amazonaws.com/default/fechdetails?email=${sessionEmail}`
      );
      console.log("Subscription API Response:", response.data);
      if (response.data && response.data.subscriptions && response.data.subscriptions.length > 0) {
        const sub = response.data.subscriptions[0];
        setCurrentPlan({
          id: sub.transactionId || "unknown",
          name: sub.subscriptionType || "Unknown Plan",
          price: 0,
          description: "Your active subscription plan",
          features: [
            `Tokens Left: ${sub.tokensLeft}`,
            `Tokens Purchased: ${sub.tokensPurchased}`,
            `Transaction ID: ${sub.transactionId}`,
          ],
          tokens: parseInt(sub.tokensLeft) || 0,
          interviews: 0,
          duration: "N/A",
        });
      } else {
        console.warn("No subscription found in response:", response.data);
        setCurrentPlan(null);
      }
    } catch (error) {
      console.error("Error fetching user subscription details:", error);
      setCurrentPlan(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCompanyJobs = async () => {
    try {
      const storedUser = sessionStorage.getItem('user');
      const companyId = storedUser ? JSON.parse(storedUser).email : 'default@example.com';
      const response = await axios.post(
        'https://ujohw8hshk.execute-api.us-east-1.amazonaws.com/default/get_company_posted_jobs',
        { company_id: companyId }
      );
      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    }
  };

  // Fetch pricing data from your API
  const fetchPricingData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        'https://ngwu0au0uh.execute-api.us-east-1.amazonaws.com/default/get_pricing_list'
      );
      if (response.data) {
        if (Array.isArray(response.data) || typeof response.data === 'object') {
          const transformedData = transformApiResponse(response.data);
          setPricingData(transformedData);
        } else {
          console.error('Invalid pricing data format:', response.data);
          setPricingData(defaultPricingData);
        }
      } else {
        console.error('Invalid pricing data format:', response.data);
        setPricingData(defaultPricingData);
      }
    } catch (error) {
      console.error('Error fetching pricing data:', error);
      setPricingData(defaultPricingData);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch interview statistics from the candidate details API
  const fetchInterviewStats = async () => {
    try {
      if (!sessionEmail) return;
      const response = await axios.get(
        `https://p103cwsao7.execute-api.us-east-1.amazonaws.com/default/get_total_interview?company_id=${sessionEmail}`
      );
      const jobsData = response.data.jobs || [];
      const candidateRows: CandidateRow[] = [];
      jobsData.forEach((job: any) => {
        if (job.candidateList && Array.isArray(job.candidateList)) {
          job.candidateList.forEach((candidate: any) => {
            candidateRows.push({
              candidateId: candidate.candidateId,
              jobId: job.job_id,
              status: candidate.status,
              title: job.job_title || 'N/A',
              postedOn: job.posted_on || 'N/A',
            });
          });
        }
      });
      setTotalInterviews(jobsData.length);
      setTotalParticipants(candidateRows.length);
      setTotalQualified(candidateRows.filter(candidate => candidate.status === 10).length);
    } catch (error) {
      console.error("Error fetching interview stats:", error);
    }
  };

  // Transform the pricing API response to match the PricingData structure
  const transformApiResponse = (apiData: any): PricingData => {
    if (apiData && !Array.isArray(apiData) && apiData.id && apiData.name) {
      const plan: SubscriptionPlan = {
        id: apiData.id || 'subscription',
        name: apiData.name || 'Subscription',
        price: parseInt(apiData.price) || 0,
        description: `${apiData.tokens} tokens subscription`,
        features: [
          `${apiData.tokens} tokens per month`,
          `Duration: ${apiData.duration || 'N/A'} days`,
          `${apiData.tokensPerMinute || 'N/A'} tokens per minute`
        ],
        tokens: parseInt(apiData.tokens) || 0,
        interviews: 20,
        current: true,
        duration: apiData.duration,
      };

      const tokenPackage: TokenPackage = {
        id: 'additional',
        name: `${Math.floor(parseInt(apiData.tokens) / 2)} Additional Tokens`,
        tokens: Math.floor(parseInt(apiData.tokens) / 2),
        price: Math.floor(parseInt(apiData.price) / 2),
        description: 'Additional tokens for your subscription',
        popular: true
      };

      return {
        plans: [plan],
        tokenPackages: [tokenPackage]
      };
    }
    
    if (Array.isArray(apiData)) {
      const plans: SubscriptionPlan[] = apiData.map((item, index) => ({
        id: item.id || `plan-${index}`,
        name: item.name || `Plan ${index + 1}`,
        price: parseInt(item.price) || 0,
        description: `${item.tokens} tokens subscription`,
        features: [
          `${item.tokens} tokens per month`,
          `Duration: ${item.duration || 'N/A'} days`,
          `${item.tokensPerMinute || 'N/A'} tokens per minute`
        ],
        tokens: parseInt(item.tokens) || 0,
        interviews: 20,
        current: index === 0,
        duration: item.duration,
      }));

      const tokenPackages: TokenPackage[] = apiData.map((item, index) => ({
        id: `package-${index}`,
        name: `${Math.floor(parseInt(item.tokens) / 2)} Tokens`,
        tokens: Math.floor(parseInt(item.tokens) / 2),
        price: Math.floor(parseInt(item.price) / 2),
        description: `Additional tokens for ${item.name}`,
        popular: index === 0
      }));

      return {
        plans,
        tokenPackages
      };
    }
    return defaultPricingData;
  };

  // On mount or when sessionEmail changes, fetch data
  useEffect(() => {
    if (sessionEmail) {
      fetchUserSubscription();
      fetchInterviewStats();
    }
    fetchCompanyJobs();
    fetchPricingData();
  }, [sessionEmail]);

  // Toggling subscription panel
  const toggleSubscription = () => {
    setIsSubscriptionExpanded(!isSubscriptionExpanded);
  };

  // Navigation helper
  const navigateTo = (page: string) => {
    setCurrentPage(page);
    if (page !== 'home') {
      setIsSubscriptionExpanded(false);
    }
  };

  // "Interview Maker" page
  const openInterviewMaker = () => {
    setCurrentPage('interview-maker');
  };

  // Handle applying to a job
  const handleApply = (job: Job) => {
    console.log('Applying to job:', job);
    navigate("/interview-maker", { state: job });
  };

  // Handle token package purchase
  const handlePurchaseTokens = (pkg: TokenPackage) => {
    setSelectedPackage(pkg);
    setSelectedPlan(null);
    setPaymentType('token');
    setPaymentModalOpen(true);
  };

  // Handle subscription plan selection
  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setSelectedPackage(null);
    setPaymentType('plan');
    setPaymentModalOpen(true);
  };

  // Payment success: update tokens or plan
  const handlePaymentSuccess = () => {
    if (paymentType === 'token' && selectedPackage) {
      console.log(`Added ${selectedPackage.tokens} tokens to user account`);
      setCurrentPlan(prevPlan => {
        if (prevPlan) {
          return { ...prevPlan, tokens: prevPlan.tokens + selectedPackage.tokens };
        } else {
          return {
            id: "token-purchase",
            name: "Token Purchase",
            price: 0,
            description: "Tokens added from purchase",
            features: [`Tokens Purchased: ${selectedPackage.tokens}`],
            tokens: selectedPackage.tokens,
            interviews: 0,
            duration: "N/A"
          };
        }
      });
    } else if (paymentType === 'plan' && selectedPlan) {
      console.log(`Updated subscription to ${selectedPlan.name} plan`);
      const updatedPlans = pricingData.plans.map(plan => ({
        ...plan,
        current: plan.id === selectedPlan.id
      }));
      setPricingData({
        ...pricingData,
        plans: updatedPlans
      });
      setCurrentPlan(selectedPlan);
    }
    setPaymentSuccess(true);
    setTimeout(() => {
      setPaymentSuccess(false);
    }, 5000);
  };

  // Usage stats (example values)
  const tokensUsed = 0;
  const tokensRemaining = currentPlan ? currentPlan.tokens - tokensUsed : 0;
  const tokensPercentage = currentPlan && currentPlan.tokens > 0
    ? Math.floor((tokensUsed / currentPlan.tokens) * 100)
    : 0;

  const interviewsUsed = 0;
  const interviewsRemaining = currentPlan ? currentPlan.interviews - interviewsUsed : 0;
  const interviewsPercentage = currentPlan && currentPlan.interviews > 0
    ? Math.floor((interviewsUsed / currentPlan.interviews) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* Payment Success Notification */}
      {paymentSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 flex items-center">
          <Check className="mr-2" size={20} />
          Payment successful! Your account has been updated.
        </div>
      )}

      {/* Payment Modal */}
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
        tokensPurchased={selectedPackage ? selectedPackage.tokens : undefined}
        tokensLeft={selectedPackage ? selectedPackage.tokens : undefined}
        subscriptionType={selectedPlan ? selectedPlan.name : undefined}
        email={userEmail || ""}
      />

      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <div className="text-lg font-medium">
          {userName ? `Hi, ${userName} 👋` : "Hi, User! 👋"}
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <a
            href="#"
            className={`flex items-center space-x-2 ${currentPage === 'home' ? 'text-purple-400' : 'hover:text-purple-400'}`}
            onClick={() => navigateTo('home')}
          >
            <Home size={20} />
            <span>Home</span>
          </a>
          <a 
            href="#"
            className={`flex items-center space-x-2 ${currentPage === 'packages' ? 'text-purple-400' : 'hover:text-purple-400'}`}
            onClick={() => navigateTo('packages')}
          >
            <Package size={20} />
            <span>Packages</span>
          </a>
          <a
            href="#"
            className="flex items-center space-x-2 hover:text-purple-400"
            onClick={openInterviewMaker}
          >
            <Mic size={20} />
            <span>Interview Maker</span>
          </a>
          <a href="#" className="flex items-center space-x-2 hover:text-purple-400">
            <User size={20} />
            <span>Profile</span>
          </a>
        </nav>
        <div className="flex items-center space-x-4">
          <button 
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
            onClick={() => navigateTo('packages')}
          >
            Manage Subscription
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
            <span className="font-bold">Z</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <>
            {currentPage === 'home' && (
              <>
                {/* Button to post a new job */}
                <div className="flex justify-end mb-8">
                  <button
                    onClick={() => navigate('/post-job')}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1A1528] text-white border border-gray-700 rounded-lg hover:bg-[#2A2538] transition-colors"
                  >
                    <PlusCircle size={20} /> Post New Job
                  </button>
                </div>

                {/* Stats Cards with dynamic metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-purple-600 rounded-lg p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-lg mb-2">Total Interviews</p>
                        <h3 className="text-5xl font-bold mb-2">{totalInterviews}</h3>
                        <p className="text-sm mb-4">{totalInterviews} Applications</p>
                        <button className="text-white hover:underline" onClick={() => navigate("/total-interview")}>
                          View Details
                        </button>
                      </div>
                      <BarChart3 size={24} />
                    </div>
                  </div>
                  <div className="bg-blue-500 rounded-lg p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-lg mb-2">Total Participants</p>
                        <h3 className="text-5xl font-bold mb-2">{totalParticipants}</h3>
                        <p className="text-sm mb-4">{totalParticipants} Applications</p>
                        <button className="text-white hover:underline">View Details</button>
                      </div>
                      <Users size={24} />
                    </div>
                  </div>
                  <div className="bg-red-500 rounded-lg p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-lg mb-2">Total Qualified</p>
                        <h3 className="text-5xl font-bold mb-2">{totalQualified}</h3>
                        <p className="text-sm mb-4">{totalQualified} Applications</p>
                        <button className="text-white hover:underline">View Details</button>
                      </div>
                      <Target size={24} />
                    </div>
                  </div>
                </div>
              </>
            )}

            {currentPage === 'packages' && (
              <>
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
                              onClick={() => handleSelectPlan(plan)}
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
                </div>
              </>
            )}

            {currentPage === 'interview-maker' && (
              <div className="min-h-screen bg-gray-900 text-white p-8">
                <div className="flex justify-end mb-8">
                  <button
                    onClick={() => navigate('/post-job')}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1A1528] text-white border border-gray-700 rounded-lg hover:bg-[#2A2538] transition-colors"
                  >
                    <PlusCircle size={20} /> Post New Job
                  </button>
                </div>
                <div className="max-w-7xl mx-auto">
                  <h1 className="text-4xl font-bold mb-8">Company Posted Jobs</h1>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.length > 0 ? (
                      jobs.map((job) => (
                        <div
                          key={job.job_id}
                          className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-all duration-300"
                        >
                          <div className="flex items-center mb-4">
                            <Briefcase className="mr-2" />
                            <h2 className="text-xl font-bold">{job.job_title}</h2>
                          </div>
                          <p className="text-gray-300 mb-4 line-clamp-3">
                            {job.description || "No description available."}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {job.experience && (
                              <span className="bg-gray-700 text-sm px-3 py-1 rounded-full">
                                {job.experience}
                              </span>
                            )}
                            {job.location && (
                              <div className="flex items-center bg-gray-700 text-sm px-3 py-1 rounded-full">
                                <MapPin size={14} className="mr-1" />
                                <span>{job.location}</span>
                              </div>
                            )}
                            {job.salary && (
                              <div className="flex items-center bg-gray-700 text-sm px-3 py-1 rounded-full">
                                <DollarSign size={14} className="mr-1" />
                                <span>{job.salary}</span>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleApply(job)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors"
                          >
                            SET INTERVIEW
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-3 text-center py-12">
                        <div className="mb-4">
                          <Briefcase size={48} className="mx-auto text-gray-500" />
                        </div>
                        <h3 className="text-xl font-medium mb-2">No jobs found</h3>
                        <p className="text-gray-400">There are currently no jobs posted by your company.</p>
                        <button 
                          onClick={() => navigate('/post-job')}
                          className="mt-4 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md inline-flex items-center"
                        >
                          <PlusCircle size={16} className="mr-2" /> Post a New Job
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Subscription Panel - Only visible on home page */}
      {currentPage === 'home' && (
        <div
          className={`fixed bottom-0 left-0 right-0 bg-gray-800 transition-all duration-300 ${
            isSubscriptionExpanded ? 'h-64' : 'h-16'
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center">
              <button
                onClick={toggleSubscription}
                className="mr-4 bg-gray-700 hover:bg-gray-600 p-2 rounded-full"
              >
                {isSubscriptionExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
              </button>
              <div>
                <p className="font-medium">
                  Current Plan:{' '}
                  <span className="text-purple-400">
                    {currentPlan ? currentPlan.name : 'No Plan'}
                  </span>
                </p>
              </div>
            </div>
            <button 
              className="bg-purple-600 hover:bg-purple-700 px-4 py-1 rounded text-sm"
              onClick={() => navigateTo('packages')}
            >
              Upgrade Plan
            </button>
          </div>

          {isSubscriptionExpanded && (
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-bold mb-2">Usage Statistics</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-300">Tokens Used</p>
                    <div className="w-full bg-gray-600 rounded-full h-2.5">
                      <div
                        className="bg-purple-600 h-2.5 rounded-full"
                        style={{ width: `${tokensPercentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-right mt-1">
                      {tokensUsed} / {currentPlan ? currentPlan.tokens : 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">Interviews Conducted</p>
                    <div className="w-full bg-gray-600 rounded-full h-2.5">
                      <div
                        className="bg-blue-500 h-2.5 rounded-full"
                        style={{ width: `${interviewsPercentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-right mt-1">
                      {interviewsUsed} / {currentPlan ? currentPlan.interviews : 0}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-bold mb-2">Available Plans</h3>
                <div className="space-y-2">
                  {pricingData.plans.map((plan) => (
                    <div key={plan.id} className="flex justify-between items-center">
                      <p className="text-sm">{plan.name}</p>
                      <p className={`text-sm font-bold ${plan.current ? 'text-purple-400' : ''}`}>
                        ${plan.price}/mo {plan.current ? '(Current)' : ''}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-bold mb-2">Custom Options</h3>
                <p className="text-sm mb-3">Need a tailored solution for your organization?</p>
                <button className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded text-sm">
                  Contact Sales
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
