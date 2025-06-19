import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  User,
  BarChart3,
  Users,
  Target,
  PlusCircle,
  CreditCard,
  Check,
  X,
  RefreshCw,
  Mic,
  Home,
  Zap,
  Briefcase,
  MapPin,
  DollarSign,
  LogOut,
  ToggleLeft,
  Trash,
  ToggleRight,
} from "lucide-react";
import axios from "axios";
import PaymentModal from "../components/StripePayment";
import Companyprofile from "../components/Companyprofile/Companyprofile";

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
  description: string;
  popular?: boolean;
}

interface PricingData {
  plans: SubscriptionPlan[];
  tokenPackages: TokenPackage[];
}

// Define job type
interface Job {
  status: string;
  job_id: string;
  title?: string;
  description?: string;
  experience?: string;
  location?: string;
  salary?: string;
  company_id: string;
  posted_on?: string;
}

// Define CandidateRow type for interview stats API response
interface CandidateRow {
  candidateId: string;
  jobId: string;
  status: number;
  title: string;
  postedOn: string;
}

function Dashboard() {
  const navigate = useNavigate();

  // User details from session storage
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Additional states
  const [isSubscriptionExpanded, setIsSubscriptionExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [pricingData, setPricingData] = useState<PricingData>({
    plans: [],
    tokenPackages: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<TokenPackage | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentType, setPaymentType] = useState<"token" | "plan" | null>(null);
  const [customTokenModalOpen, setCustomTokenModalOpen] = useState(false);
  const [customTokenAmount, setCustomTokenAmount] = useState<number>(100);
  const [customTokenPrice, setCustomTokenPrice] = useState<number>(0);

  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null);
  const [totalInterviews, setTotalInterviews] = useState<number>(0);
  const [totalParticipants, setTotalParticipants] = useState<number>(0);
  const [totalQualified, setTotalQualified] = useState<number>(0);
  const [jobStatuses, setJobStatuses] = useState<{ [key: string]: string }>({});

  // Calculate price based on token amount (example rate: $0.15 per token)
  useEffect(() => {
    setCustomTokenPrice(Math.ceil(customTokenAmount * 0.15));
  }, [customTokenAmount]);

  // On mount, parse the "user" object from sessionStorage and check for navigation target
  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUserName(parsed.username);
        setUserEmail(parsed.email || "No Email Found");
        setSessionEmail(parsed.email);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    // Check if there's a navigation target in localStorage after refresh
    const navigateTo = localStorage.getItem("navigateToAfterRefresh");
    if (navigateTo) {
      setCurrentPage(navigateTo);
      localStorage.removeItem("navigateToAfterRefresh"); // Clear the navigation target
    }

    setIsLoading(false);
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

      if (response.data && response.data.subscriptions && response.data.subscriptions.length > 0) {
        const sub = response.data.subscriptions[0];
        const matchingPlan = pricingData.plans.find(
          (plan) => plan.name.toLowerCase() === sub.subscriptionType?.toLowerCase()
        );

        if (matchingPlan) {
          const updatedPlan = {
            ...matchingPlan,
            tokens: parseInt(sub.tokensLeft) || matchingPlan.tokens,
            current: true,
            features: [
              ...matchingPlan.features,
              `Tokens Left: ${sub.tokensLeft}`,
              `Transaction ID: ${sub.transactionId}`,
            ],
          };
          setCurrentPlan(updatedPlan);
          setPricingData((prev) => ({
            ...prev,
            plans: prev.plans.map((plan) => ({
              ...plan,
              current: plan.id === matchingPlan.id,
            })),
          }));
        } else {
          const newPlan: SubscriptionPlan = {
            id: sub.transactionId || "current-plan",
            name: sub.subscriptionType || "Current Plan",
            price: 0,
            description: "Your active subscription",
            features: [
              `Tokens Left: ${sub.tokensLeft}`,
              `Tokens Purchased: ${sub.tokensPurchased}`,
              `Transaction ID: ${sub.transactionId}`,
            ],
            tokens: parseInt(sub.tokensLeft) || 0,
            interviews: 20,
            current: true,
          };
          setCurrentPlan(newPlan);
        }
      }
    } catch (error) {
      console.error("Error fetching user subscription details:", error);
      setCurrentPlan(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Job active and delete
  const handleToggleJobStatus = (jobId: string) => {
    setJobStatuses((prevStatuses) => ({
      ...prevStatuses,
      [jobId]: prevStatuses[jobId] === "active" ? "inactive" : "active",
    }));
  };

  const handleDeleteJob = (jobId: string) => {
    setJobs((prevJobs) => prevJobs.filter((job) => job.job_id !== jobId));
  };

  const fetchCompanyJobs = async () => {
    try {
      const storedUser = sessionStorage.getItem("user");
      const companyId = storedUser ? JSON.parse(storedUser).email : "default@example.com";
      const response = await axios.post(
        "https://ujohw8hshk.execute-api.us-east-1.amazonaws.com/default/get_company_posted_jobs",
        { company_id: companyId }
      );
      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
    }
  };

  const fetchPricingData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://ngwu0au0uh.execute-api.us-east-1.amazonaws.com/default/get_pricing_list"
      );

      if (response.data) {
        const transformedData = transformApiResponse(response.data);
        setPricingData(transformedData);
      }
    } catch (error) {
      console.error("Error fetching pricing data:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
              title: job.title || "N/A",
              postedOn: job.posted_on || "N/A",
            });
          });
        }
      });

      setTotalInterviews(jobsData.length);
      setTotalParticipants(candidateRows.length);
      setTotalQualified(candidateRows.filter((candidate) => candidate.status === 10).length);
    } catch (error) {
      console.error("Error fetching interview stats:", error);
    }
  };

  const transformApiResponse = (apiData: any): PricingData => {
    if (!apiData) {
      return { plans: [], tokenPackages: [] };
    }

    if (apiData.plans && apiData.tokenPackages) {
      return {
        plans: apiData.plans.map((item: any, index: number) => ({
          id: item.id || `plan-${index}`,
          name: item.name || `Plan ${index + 1}`,
          price: parseFloat(item.price) || 0,
          description: item.description || "",
          features: item.features?.length
            ? item.features
            : [
                `${item.tokens} tokens subscription`,
                `${item.tokens} tokens per month`,
                `Duration: ${item.duration} days`,
                `${item.tokensPerMinute || 100} tokens per minute`,
              ],
          tokens: parseInt(item.tokens) || 0,
          interviews: parseInt(item.interviews) || 0,
          duration: item.duration,
          current: false,
        })),
        tokenPackages: apiData.tokenPackages,
      };
    }

    if (Array.isArray(apiData)) {
      const plans: SubscriptionPlan[] = apiData.map((item, index) => ({
        id: item.id || `plan-${index}`,
        name: item.name || `Plan ${index + 1}`,
        price: parseFloat(item.price) || 0,
        description: item.description || "",
        features: item.features?.length
          ? item.features
          : [
              `${item.tokens} tokens subscription`,
              `${item.tokens} tokens per month`,
              `Duration: ${item.duration} days`,
              `${item.tokensPerMinute || 100} tokens per minute`,
            ],
        tokens: parseInt(item.tokens) || 0,
        interviews: parseInt(item.interviews) || 0,
        duration: item.duration,
        current: false,
      }));
      return { plans, tokenPackages: [] };
    }

    if (typeof apiData === "object" && apiData.id && apiData.name) {
      const plan: SubscriptionPlan = {
        id: apiData.id,
        name: apiData.name,
        price: parseFloat(apiData.price) || 0,
        description: apiData.description || "",
        features: apiData.features?.length
          ? apiData.features
          : [
              `${apiData.tokens} tokens subscription`,
              `${apiData.tokens} tokens per month`,
              `Duration: ${apiData.duration} days`,
              `${apiData.tokensPerMinute || 100} tokens per minute`,
            ],
        tokens: parseInt(apiData.tokens) || 0,
        interviews: parseInt(apiData.interviews) || 0,
        duration: apiData.duration,
        current: false,
      };
      return { plans: [plan], tokenPackages: [] };
    }

    return { plans: [], tokenPackages: [] };
  };

  useEffect(() => {
    if (sessionEmail) {
      fetchPricingData().then(() => {
        fetchUserSubscription();
      });
      fetchInterviewStats();
    } else {
      fetchPricingData();
    }
    fetchCompanyJobs();
  }, [sessionEmail]);

  const toggleSubscription = () => {
    setIsSubscriptionExpanded(!isSubscriptionExpanded);
  };

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    if (page !== "home") {
      setIsSubscriptionExpanded(false);
    }
  };

  const openInterviewMaker = () => {
    setCurrentPage("interview-maker");
  };

  const handleApply = (job: Job) => {
    navigate("/interview-maker", { state: job });
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate("/");
  };

  const handlePurchaseTokens = (pkg: TokenPackage) => {
    setSelectedPackage(pkg);
    setSelectedPlan(null);
    setPaymentType("token");
    setPaymentModalOpen(true);
  };

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setSelectedPackage(null);
    setPaymentType("plan");
    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    if (paymentType === "token" && selectedPackage) {
      setCurrentPlan((prevPlan) => {
        if (prevPlan) {
          return {
            ...prevPlan,
            tokens: prevPlan.tokens + selectedPackage.tokens,
            features: [
              ...prevPlan.features,
              `Added ${selectedPackage.tokens} tokens`,
            ],
          };
        }
        return {
          id: "token-purchase",
          name: "Token Purchase",
          price: 0,
          description: "Tokens added from purchase",
          features: [`Tokens Purchased: ${selectedPackage.tokens}`],
          tokens: selectedPackage.tokens,
          interviews: 0,
          duration: "N/A",
        };
      });
    } else if (paymentType === "plan" && selectedPlan) {
      setCurrentPlan(selectedPlan);
      setPricingData((prev) => ({
        ...prev,
        plans: prev.plans.map((plan) => ({
          ...plan,
          current: plan.id === selectedPlan.id,
        })),
      }));
    }
    setPaymentSuccess(true);
    setTimeout(() => {
      setPaymentSuccess(false);
    }, 5000);
  };

  const tokensUsed = currentPlan
    ? Math.max(
        0,
        currentPlan.tokens -
          parseInt(
            currentPlan?.features
              ?.find((f) => f.startsWith("Tokens Left:"))
              ?.split(": ")[1] || "0"
          )
      )
    : 0;

  const tokensRemaining = currentPlan
    ? parseInt(
        currentPlan?.features
          ?.find((f) => f.startsWith("Tokens Left:"))
          ?.split(": ")[1] || "0"
      )
    : 0;

  const tokensPercentage =
    currentPlan && currentPlan.tokens > 0
      ? Math.floor((tokensUsed / currentPlan.tokens) * 100)
      : 0;

  const interviewsUsed = totalInterviews;
  const interviewsRemaining = currentPlan
    ? Math.max(0, currentPlan.interviews - interviewsUsed)
    : 0;

  const interviewsPercentage =
    currentPlan && currentPlan.interviews > 0
      ? Math.floor((interviewsUsed / currentPlan.interviews) * 100)
      : 0;

  const handleCustomTokenPurchase = () => {
    const customPackage: TokenPackage = {
      id: "custom",
      name: `${customTokenAmount} Custom Tokens`,
      tokens: customTokenAmount,
      price: customTokenPrice,
      description: "Custom token package",
    };
    setSelectedPackage(customPackage);
    setPaymentType("token");
    setCustomTokenModalOpen(false);
    setPaymentModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {paymentSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 flex items-center">
          <Check className="mr-2" size={20} />
          Payment successful! Your account has been updated.
        </div>
      )}

      {customTokenModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Custom Token Purchase</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                How many tokens do you need?
              </label>
              <input
                type="number"
                min="1"
                value={customTokenAmount}
                onChange={(e) =>
                  setCustomTokenAmount(Math.max(1, parseInt(e.target.value) || 0))
                }
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white"
              />
            </div>
            <div className="mb-6">
              <p className="text-sm text-gray-300">
                Estimated Price: ${customTokenPrice}
              </p>
              <p className="text-xs text-gray-400">($0.15 per token)</p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-gray-300 hover:text-white"
                onClick={() => setCustomTokenModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md"
                onClick={handleCustomTokenPurchase}
              >
                Purchase Tokens
              </button>
            </div>
          </div>
        </div>
      )}

      {paymentModalOpen && (
        <>
          {console.log("Opening PaymentModal with:", {
            paymentType,
            selectedPackage,
            selectedPlan,
            userEmail,
          })}
          <PaymentModal
            isOpen={paymentModalOpen}
            onClose={() => setPaymentModalOpen(false)}
            amount={
              selectedPackage
                ? selectedPackage.price
                : selectedPlan
                ? selectedPlan.price
                : 0
            }
            onSuccess={handlePaymentSuccess}
            tokensPurchased={
              paymentType === "token" && selectedPackage
                ? selectedPackage.tokens
                : paymentType === "plan" && selectedPlan
                ? selectedPlan.tokens
                : 0
            }
            subscriptionType={
              paymentType === "plan" && selectedPlan ? selectedPlan.name : undefined
            }
            email={userEmail || ""}
          />
        </>
      )}

      <header className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <Zap size={24} className="text-purple-400" />
          <h1 className="text-2xl font-bold">Interview 24/7</h1>
        </div>
        <div className="text-lg font-medium">
          {userEmail ? `Hi, ${userEmail.split("@")[0]} 👋` : "Hi, User! 👋"}
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <a
            href="#"
            className={`flex items-center space-x-2 ${
              currentPage === "home" ? "text-purple-400" : "hover:text-purple-400"
            }`}
            onClick={() => navigateTo("home")}
          >
            <Home size={20} />
            <span>Home</span>
          </a>
          <a
            href="#"
            className={`flex items-center space-x-2 ${
              currentPage === "packages" ? "text-purple-400" : "hover:text-purple-400"
            }`}
            onClick={() => navigateTo("packages")}
          >
            <Package size={20} />
            <span>Packages</span>
          </a>
          <a
            href="#"
            className="flex items-center space-x-2 hover:text-purple-400"
            onClick={() => setCurrentPage("interview-maker")}
          >
            <Mic size={20} />
            <span>Interview Maker</span>
          </a>
          <a
            href="#"
            className="flex items-center space-x-2 hover:text-purple-400"
            onClick={(e) => {
              e.preventDefault();
              navigate("/Companyprofile");
            }}
          >
            <User size={20} />
            <span>Profile</span>
          </a>
        </nav>
        <div className="flex items-center space-x-4">
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
            onClick={() => navigateTo("packages")}
          >
            Manage Subscription
          </button>
          <div className="flex items-center space-x-2">
            <button
              className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <>
            {currentPage === "home" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-purple-600 rounded-lg p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-lg mb-2">Total Interviews Posted</p>
                        <h3 className="text-5xl font-bold mb-2">{totalInterviews}</h3>
                        <p className="text-sm mb-4">{totalInterviews} Applications</p>
                        <button
                          className="bg-white text-purple-600 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium"
                          onClick={() => navigateTo("interview-maker")}
                        >
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
                        <button
                          className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium"
                          onClick={() => navigate("/total-interview")}
                        >
                          View Details
                        </button>
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
                        <button
                          className="bg-white text-red-600 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium"
                          onClick={() => navigate("/total-interview")}
                        >
                          View Details
                        </button>
                      </div>
                      <Target size={24} />
                    </div>
                  </div>
                </div>
              </>
            )}

            {currentPage === "packages" && (
              <>
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold">Subscription & Packages</h2>
                  </div>

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
                            <h3 className="text-xl font-bold">
                              Current Plan: {currentPlan.name}
                            </h3>
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
                                <span>{tokensUsed} used</span>
                                <span>{tokensRemaining} remaining</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-purple-200 mb-1">
                                Interviews Conducted
                              </p>
                              <div className="w-full bg-purple-900 rounded-full h-3 mb-1">
                                <div
                                  className="bg-white h-3 rounded-full"
                                  style={{ width: `${interviewsPercentage}%` }}
                                ></div>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>{interviewsUsed} used</span>
                                <span>{interviewsRemaining} remaining</span>
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
                                const enterprisePlan = pricingData.plans.find(
                                  (p) => p.id === "enterprise"
                                );
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
                      <div className="bg-gradient-to-r from-purple-700 to-purple-900 p-4 rounded-lg hover:from-purple-800 hover:to-purple-950 transition-colors cursor-pointer">
                        <h4 className="font-bold mb-2">Custom Amount</h4>
                        <p className="text-2xl font-bold mb-2">You Decide</p>
                        <p className="text-sm text-gray-300 mb-4">
                          Need a specific number of tokens? Create your custom package.
                        </p>
                        <button
                          className="w-full bg-white text-purple-700 hover:bg-gray-100 py-2 rounded text-sm font-medium"
                          onClick={() => setCustomTokenModalOpen(true)}
                        >
                          Custom Purchase
                        </button>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-4">Available Subscription Plans</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {[...pricingData.plans]
                      .sort((a, b) => (b.current ? 1 : -1)) // Sort to place the current plan first
                      .map((plan) => (
                        <div
                          key={plan.id}
                          className={`${
                            plan.current
                              ? "bg-gradient-to-b from-purple-500 to-purple-700" // Highlight color changed to purple
                              : "bg-gray-800"
                          } rounded-lg overflow-hidden relative shadow-lg`} // Added shadow for better highlighting
                        >
                          {plan.current && (
                            <div className="absolute top-0 right-0 bg-purple-400 text-white text-xs px-3 py-1">
                              CURRENT
                            </div>
                          )}
                          <div className="p-6">
                            <h4 className="text-xl font-bold mb-2">{plan.name}</h4>
                            <p className="text-3xl font-bold mb-4">
                              ${plan.price}
                              <span className="text-sm font-normal">/month</span>
                            </p>
                            <p
                              className={`text-sm ${
                                plan.current ? "text-purple-100" : "text-gray-300"
                              } mb-6`}
                            >
                              {plan.description}
                            </p>
                            <ul className="space-y-3 mb-6">
                              {plan.features.map((feature, index) => {
                                const isIncluded =
                                  !feature.includes("API access") || plan.id === "enterprise";
                                return (
                                  <li key={index} className="flex items-start">
                                    {isIncluded ? (
                                      <Check
                                        size={18}
                                        className={
                                          plan.current
                                            ? "text-purple-200 mr-2 mt-0.5"
                                            : "text-green-400 mr-2 mt-0.5"
                                        }
                                      />
                                    ) : (
                                      <X size={18} className="text-red-400 mr-2 mt-0.5" />
                                    )}
                                    <span className={!isIncluded ? "text-gray-400" : ""}>
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
                                className="w-full bg-white text-purple-600 hover:bg-gray-100 py-3 rounded text-sm font-medium flex items-center justify-center"
                                onClick={() => handleSelectPlan(plan)}
                              >
                                <RefreshCw size={16} className="mr-2" />
                                Renew Plan
                              </button>
                            ) : (
                              <button
                                className={`w-full ${
                                  plan.id === "enterprise"
                                    ? "bg-purple-600 hover:bg-purple-700"
                                    : "bg-gray-700 hover:bg-gray-600"
                                } py-3 rounded text-sm font-medium`}
                                onClick={() => handleSelectPlan(plan)}
                              >
                                {plan.id === "enterprise" ? "Upgrade" : "Choose Plan"}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>

                  <div className="bg-gradient-to-r from-blue-700 to-purple-700 rounded-lg p-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                      <div>
                        <h3 className="text-xl font-bold mb-2">Need a Custom Solution?</h3>
                        <p className="max-w-2xl">
                          We offer tailored enterprise solutions for organizations with
                          specific requirements. Our team will work with you to create a
                          custom package that fits your needs.
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

            {currentPage === "interview-maker" && (
              <div className="min-h-screen bg-gray-900 text-white p-6 md:p-8">
                <div className="rounded-lg p-6 mb-8 flex flex-col md:flex-row justify-between items-center">
                  <h1 className="text-2xl md:text-3xl font-bold text-purple-300 mb-4 md:mb-0">
                    Company Posted Jobs
                  </h1>
                  <button
                    onClick={() => navigate("/post-job")}
                    className="flex items-center gap-2 px-4 py-2 pl-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md"
                  >
                    <PlusCircle size={20} /> Post New Job
                  </button>
                </div>

                <div className="max-w-7xl mx-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.length > 0 ? (
                      [...jobs]
                        .sort((a, b) => {
                          const dateA = a.posted_on ? new Date(a.posted_on).getTime() : 0;
                          const dateB = b.posted_on ? new Date(b.posted_on).getTime() : 0;
                          return dateB - dateA;
                        })
                        .map((job) => (
                          <div
                            key={job.job_id}
                            className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-all duration-300 shadow-md flex flex-col h-[350px]"
                          >
                            <div className="flex justify-between items-center mb-4">
                              <div className="flex items-center">
                                <Briefcase className="mr-2 text-purple-400" size={20} />
                                <h2 className="text-xl font-semibold text-white">
                                  {job.title || "Untitled Job"}
                                </h2>
                              </div>
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => handleToggleJobStatus(job.job_id)}
                                  className={`flex items-center px-3 py-1 rounded-full text-sm transition-colors ${
                                    jobStatuses[job.job_id] === "active"
                                      ? "bg-green-600 hover:bg-green-700"
                                      : "bg-red-600 hover:bg-red-700"
                                  }`}
                                >
                                  {jobStatuses[job.job_id] === "active" ? (
                                    <>
                                      <ToggleRight size={16} className="mr-1" /> Active
                                    </>
                                  ) : (
                                    <>
                                      <ToggleLeft size={16} className="mr-1" /> Inactive
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={() => handleDeleteJob(job.job_id)}
                                  className="text-red-500 hover:text-red-600 transition-colors"
                                >
                                  <Trash size={20} />
                                </button>
                              </div>
                            </div>

                            <p className="text-gray-300 text-sm mb-4 line-clamp-3 min-h-[60px] max-h-[60px] overflow-hidden">
                              {job.description || "No description available."}
                            </p>

                            <div className="flex gap-3 mb-4">
                              {job.experience ? (
                                <div className="flex items-center bg-gray-700 text-gray-200 text-xs font-medium px-3 py-1 rounded-full">
                                  <Briefcase size={12} className="mr-1 text-purple-400" />
                                  <span>{job.experience}</span>
                                </div>
                              ) : (
                                <div className="flex items-center bg-gray-700 text-gray-200 text-xs font-medium px-3 py-1 rounded-full opacity-0">
                                  <Briefcase size={12} className="mr-1 text-purple-400" />
                                  <span>Placeholder</span>
                                </div>
                              )}
                              {job.location ? (
                                <div className="flex items-center bg-gray-700 text-gray-200 text-xs font-medium px-3 py-1 rounded-full">
                                  <MapPin size={12} className="mr-1 text-purple-400" />
                                  <span>{job.location}</span>
                                </div>
                              ) : (
                                <div className="flex items-center bg-gray-700 text-gray-200 text-xs font-medium px-3 py-1 rounded-full opacity-0">
                                  <MapPin size={12} className="mr-1 text-purple-400" />
                                  <span>Placeholder</span>
                                </div>
                              )}
                              {job.salary ? (
                                <div className="flex items-center bg-gray-700 text-gray-200 text-xs font-medium px-3 py-1 rounded-full">
                                  <DollarSign size={12} className="mr-1 text-purple-400" />
                                  <span>{job.salary}</span>
                                </div>
                              ) : (
                                <div className="flex items-center bg-gray-700 text-gray-200 text-xs font-medium px-3 py-1 rounded-full opacity-0">
                                  <DollarSign size={12} className="mr-1 text-purple-400" />
                                  <span>Placeholder</span>
                                </div>
                              )}
                            </div>

                            <div className="flex-grow"></div>

                            <button
                              onClick={() => handleApply(job)}
                              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors font-medium"
                            >
                              Set Interview
                            </button>
                          </div>
                        ))
                    ) : (
                      <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-12 bg-gray-800 rounded-lg shadow-md">
                        <div className="mb-4">
                          <Briefcase size={48} className="mx-auto text-gray-500" />
                        </div>
                        <h3 className="text-xl font-medium mb-2 text-gray-200">
                          No Jobs Found
                        </h3>
                        <p className="text-gray-400 mb-4">
                          There are currently no jobs posted by your company.
                        </p>
                        <button
                          onClick={() => navigate("/post-job")}
                          className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-lg inline-flex items-center text-white font-medium"
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

      {currentPage === "home" && (
        <div
          className={`fixed bottom-0 left-0 right-0 bg-gray-800 transition-all duration-300 ${
            isSubscriptionExpanded ? "h-64" : "h-16"
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
                  Current Plan:{" "}
                  <span className="text-purple-400">
                    {currentPlan ? currentPlan.name : "No Plan"}
                  </span>
                </p>
              </div>
            </div>
            <button
              className="bg-purple-600 hover:bg-purple-700 px-4 py-1 rounded text-sm"
              onClick={() => navigateTo("packages")}
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
                      <p
                        className={`text-sm font-bold ${
                          plan.current ? "text-purple-400" : ""
                        }`}
                      >
                        ${plan.price}/mo {plan.current ? "(Current)" : ""}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-bold mb-2">Need More Tokens?</h3>
                <p className="text-sm mb-3">
                  Purchase additional tokens or upgrade your plan anytime.
                </p>
                <button
                  className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded text-sm"
                  onClick={() => navigateTo("packages")}
                >
                  View Options
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