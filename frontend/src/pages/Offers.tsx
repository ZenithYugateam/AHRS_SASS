import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, Briefcase, Calendar, Building, Clock, CheckCircle, XCircle, AlertCircle, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

// Status badge component
const StatusBadge = ({ statusText, type }: { statusText: string; type: 'success' | 'rejected' | 'pending' }) => {
  const getStatusColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 mr-1" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 mr-1" />;
      case 'pending':
      default:
        return <AlertCircle className="w-4 h-4 mr-1" />;
    }
  };

  return (
    <span className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
      {getStatusIcon()}
      {statusText}
    </span>
  );
};

function Offers() {
  const [offers, setOffers] = useState<any[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("User");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [sortByDate, setSortByDate] = useState(false);
  const [isJobsDropdownOpen, setIsJobsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = sessionStorage.getItem("user");
    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        setUsername(userData.username || "User");
        const candidateId = userData.email;
        if (!candidateId) throw new Error("Candidate ID (email) not found.");
        fetchOffers(candidateId);
      } catch (err) {
        console.error("Error parsing user data:", err);
        setError("User data is corrupted.");
        setLoading(false);
      }
    } else {
      setError("No user data found. Please sign in.");
      setLoading(false);
    }
  }, []);

  const fetchOffers = async (candidateId: string) => {
    try {
      const response = await axios.get(
        `https://8psobgwfh2.execute-api.us-east-1.amazonaws.com/default/pass_or_fail`,
        { params: { candidateId } }
      );
      console.log("API Response:", response.data); // Log the response for debugging

      // Transform the API response to match expected structure
      const fetchedOffers = response.data.candidateJobs.map((job: any) => {
        const candidate = job.candidateList.find((c: any) => c.candidateId === candidateId);
        return {
          job_id: job.job_id,
          title: job.title || "Untitled Job",
          companyName: job.company_id, // Placeholder for companyName
          description: job.description || "No description available",
          date: job.posted_on || "",
          status: candidate ? candidate.status : null,
        };
      });

      setOffers(fetchedOffers);
      setFilteredOffers(fetchedOffers);
    } catch (err) {
      console.error("Error fetching offers:", err);
      setError("Failed to fetch offers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort offers
  useEffect(() => {
    let filtered = [...offers];

    if (searchQuery) {
      filtered = filtered.filter((offer) =>
        offer.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter((offer) => {
        if (selectedStatus === "Interview Selected") return offer.status === 10;
        if (selectedStatus === "Not Selected") return offer.status === 5;
        if (selectedStatus === "Pending") return offer.status !== 5 && offer.status !== 10;
        return true;
      });
    }

    if (selectedCompany) {
      filtered = filtered.filter((offer) =>
        offer.companyName?.toLowerCase().includes(selectedCompany.toLowerCase())
      );
    }

    if (sortByDate) {
      filtered.sort((a, b) => {
        const dateA = new Date(a.date || Date.now()).getTime();
        const dateB = new Date(b.date || Date.now()).getTime();
        return dateB - dateA; // Newest first
      });
    }

    setFilteredOffers(filtered);
  }, [searchQuery, selectedStatus, selectedCompany, sortByDate, offers]);

  const uniqueCompanies = Array.from(new Set(offers.map((offer) => offer.companyName || "Unknown")));

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/");
  };

  const toggleJobsDropdown = () => setIsJobsDropdownOpen((prev) => !prev);
  const toggleProfileDropdown = () => setIsProfileDropdownOpen((prev) => !prev);

  const goToAppliedJobs = () => {
    setIsJobsDropdownOpen(false);
    navigate("/applied-jobs");
  };

  const goToOffers = () => {
    setIsJobsDropdownOpen(false);
    navigate("/offers");
  };

  const goToHome = () => {
    navigate('/candidate-dashboard');
  };

  // Loading shadow animation variant
  const loadingCardVariants = {
    animate: {
      boxShadow: [
        "0px 4px 15px rgba(247, 0, 252, 0.3)",
        "0px 4px 25px rgba(247, 0, 252, 0.5)",
        "0px 4px 15px rgba(247, 0, 252, 0.3)",
      ],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#0F0B1E]">
      {/* Navigation Bar */}
      <nav className="bg-[#1A1528] py-4 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-white font-bold text-2xl">247 Interview.com</div>
          <div className="flex items-center space-x-8">
            <a href="#" onClick={goToHome} className="text-white hover:text-gray-300 transition-colors">Home</a>
            <div className="relative">
              <button
                className="text-white hover:text-gray-300 transition-colors flex items-center"
                onClick={toggleJobsDropdown}
              >
                Jobs <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {isJobsDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1A1528] rounded-md shadow-lg py-1 z-10">
                  <button
                    onClick={goToAppliedJobs}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#2A2538]"
                  >
                    Applied Jobs
                  </button>
                  <button
                    onClick={goToOffers}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#2A2538]"
                  >
                    Offers
                  </button>
                </div>
              )}
            </div>
            <div className="relative">
              <button className="flex items-center space-x-2" onClick={toggleProfileDropdown}>
                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="h-6 w-6 text-[#1A1528]" />
                </div>
                <span className="text-white">
                  {username} <ChevronDown className="inline h-4 w-4" />
                </span>
              </button>
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1A1528] rounded-md shadow-lg py-1 z-10">
                  <button
                    onClick={() => { navigate("/profile"); setIsProfileDropdownOpen(false); }}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#2A2538]"
                  >
                    Profile
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#2A2538]"
                  >
                    Settings
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-white">
            Hi, <span className="text-purple-400">{username}</span>
          </h2>
          <p className="text-gray-400 mt-1">
            Track your offer status and stay updated.
          </p>
        </section>

        {/* Filters and Search */}
        <section className="mb-8">
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search offers by title, company, or description..."
              className="w-full p-3 rounded-lg bg-[#1A1528] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F700FC]"
            />
            <div className="flex flex-wrap gap-4">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="p-2 rounded-lg bg-[#1A1528] text-white focus:outline-none"
              >
                <option value="">All Statuses</option>
                <option value="Interview Selected">Interview Selected</option>
                <option value="Not Selected">Not Selected</option>
                <option value="Pending">Pending</option>
              </select>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="p-2 rounded-lg bg-[#1A1528] text-white focus:outline-none"
              >
                <option value="">All Companies</option>
                {uniqueCompanies.map((company) => (
                  <option key={company} value={company}>{company}</option>
                ))}
              </select>
              <label className="flex items-center text-white">
                <input
                  type="checkbox"
                  checked={sortByDate}
                  onChange={() => setSortByDate((prev) => !prev)}
                  className="mr-2"
                />
                Sort by Latest
              </label>
            </div>
          </div>
        </section>

        {/* Offers Section */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
            <Briefcase className="mr-2" /> Offers
          </h2>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <motion.div
                  key={index}
                  className="rounded-lg overflow-hidden bg-gradient-to-br from-[#F700FC] to-[#2941B9]"
                  variants={loadingCardVariants}
                  animate="animate"
                >
                  <div className="p-6 bg-[#16213e] bg-opacity-95">
                    <div className="h-6 bg-gray-600 rounded w-3/4 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-600 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-600 rounded w-2/3"></div>
                      <div className="h-4 bg-gray-600 rounded w-1/3"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : filteredOffers.length === 0 ? (
            <p className="text-gray-300">No offers found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredOffers.map((offer, index) => {
                let statusText = "";
                let badgeType: 'success' | 'rejected' | 'pending' = 'pending';
                if (offer.status === 5) {
                  statusText = "Not Selected";
                  badgeType = "rejected";
                } else if (offer.status === 10) {
                  statusText = "Interview Selected";
                  badgeType = "success";
                } else {
                  statusText = "Pending";
                }

                return (
                  <motion.div
                    key={offer.job_id || index}
                    className="rounded-lg overflow-hidden shadow-lg bg-gradient-to-br from-[#F700FC] to-[#2941B9] hover:shadow-xl transition-shadow duration-300"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="p-6 bg-[#16213e] bg-opacity-95">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-white truncate">{offer.title}</h3>
                        <StatusBadge statusText={statusText} type={badgeType} />
                      </div>
                      <div className="space-y-2 mb-4 text-gray-300">
                        <div className="flex items-center">
                          <Building className="w-4 h-4 mr-2" />
                          <span>{offer.companyName || 'Unknown Company'}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{offer.date ? new Date(offer.date).toLocaleDateString() : 'N/A'}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          <span className="line-clamp-2">{offer.description}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 pt-4 border-t border-gray-700">
                        {offer.status === 10 && (
                          <button
                            className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                            onClick={() => navigate('/interview-details', { state: { offer } })}
                          >
                            View Interview Details
                          </button>
                        )}
                        {offer.status === 5 && (
                          <button
                            className="w-full px-4 py-2 bg-gray-500 text-white rounded cursor-not-allowed"
                            disabled
                          >
                            No Further Action
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Offers;