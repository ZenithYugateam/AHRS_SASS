import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  User, Briefcase, Calendar, Building, Clock, 
  CheckCircle, XCircle, AlertCircle, ChevronDown 
} from 'lucide-react';
import { motion } from 'framer-motion';

// Status badge component (unchanged)
const StatusBadge = ({ status, type }) => {
  const getStatusColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500/80 text-white';
      case 'rejected':
        return 'bg-red-500/80 text-white';
      default:
        return 'bg-yellow-500/80 text-white';
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
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
      {getStatusIcon()}
      {status}
    </span>
  );
};

function AppliedJobs() {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
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
        fetchAppliedJobs(candidateId);
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

  const fetchAppliedJobs = async (candidateId) => {
    try {
      const response = await axios.post(
        `https://wfm4lgpdh2.execute-api.us-east-1.amazonaws.com/default/get_applied_job_by_candidate`,
        { candidateId }
      );
      console.log("API Response:", response.data);
      const jobs = response.data.candidateJobs || [];
      setAppliedJobs(jobs);
      setFilteredJobs(jobs);
    } catch (err) {
      console.error("Error fetching applied jobs:", err);
      setError("Failed to fetch applied jobs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...appliedJobs];

    if (searchQuery) {
      filtered = filtered.filter((job) =>
        (job.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (job.display_name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (job.description?.toLowerCase() || "").includes(searchQuery.toLowerCase())
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter((job) => {
        if (selectedStatus === "Interview") return job.status === 10;
        if (selectedStatus === "Rejected") return job.status === 5;
        if (selectedStatus === "Pending") return job.status !== 5 && job.status !== 10;
        return true;
      });
    }

    if (selectedCompany) {
      filtered = filtered.filter((job) =>
        (job.display_name?.toLowerCase() || "").includes(selectedCompany.toLowerCase())
      );
    }

    if (sortByDate) {
      filtered.sort((a, b) => {
        const dateA = new Date(a.posted_on || Date.now()).getTime();
        const dateB = new Date(b.posted_on || Date.now()).getTime();
        return dateB - dateA;
      });
    }

    setFilteredJobs(filtered);
  }, [searchQuery, selectedStatus, selectedCompany, sortByDate, appliedJobs]);

  const uniqueCompanies = Array.from(new Set(appliedJobs.map((job) => job.display_name|| "Unknown")));

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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-white">
            Hi, <span className="text-purple-400">{username}</span>
          </h2>
          <p className="text-gray-400 mt-1">
            Track your job applications and stay organized.
          </p>
        </section>

        <section className="mb-8">
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs by title, company, or description..."
              className="w-full p-3 rounded-lg bg-[#1A1528] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F700FC]"
            />
            <div className="flex flex-wrap gap-4">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="p-2 rounded-lg bg-[#1A1528] text-white focus:outline-none"
              >
                <option value="">All Statuses</option>
                <option value="Interview">Eligible</option>
                <option value="Rejected">Rejected</option>
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

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
            <Briefcase className="mr-2" /> Applied Jobs
          </h2>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <motion.div
                  key={index}
                  className="w-[350px] h-[400px] bg-[#1E1A2B] rounded-2xl animate-pulse"
                  variants={loadingCardVariants}
                  animate="animate"
                />
              ))}
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : filteredJobs.length === 0 ? (
            <p className="text-gray-300">No applied jobs found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredJobs.map((job, index) => {
                let statusText = "";
                let statusType = "pending";
                if (job.status === 5) {
                  statusText = "Rejected";
                  statusType = "rejected";
                } else if (job.status === 10) {
                  statusText = "Eligible";
                  statusType = "success";
                } else {
                  statusText = "Pending";
                  statusType = "pending";
                }

                return (
                  <motion.div
                    key={job.job_id || index}
                    className="w-[350px] h-[400px] bg-[#1E1A2B] rounded-2xl p-6 shadow-inner 
                               hover:shadow-[0_0_15px_rgba(247,0,252,0.5)] transition-all duration-300 
                               cursor-pointer relative overflow-hidden"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    transition={{ duration: 0.5, delay: index * 0.1, type: "spring" }}
                  >
                    <div className="h-2 w-full bg-gradient-to-r from-[#F700FC] to-[#2941B9] rounded-t-lg absolute top-0 left-0" />
                    <div className="absolute top-4 right-4">
                      <StatusBadge status={statusText} type={statusType} />
                    </div>
                    <div className="mt-8">
                      <motion.h3
                        className="text-2xl font-bold text-white line-clamp-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {job.title || "Untitled Job"}
                      </motion.h3>
                      <div className="inline-block bg-[#F700FC]/20 text-white text-sm font-medium px-3 py-1 rounded-full mt-2">
                        {job.display_name|| "Unknown Company"}
                      </div>
                      <p className="text-[14px] text-gray-400 mt-2">
                        {job.posted_on ? new Date(job.posted_on).toDateString() : "N/A"}
                      </p>
                    </div>
                    <div className="mt-4 flex flex-col gap-2 text-base text-[#B0B0B0]">
                      <div className="flex items-center gap-2">
                        <Building className="h-5 w-5 text-[#F700FC]" />
                        <span className="line-clamp-1">{job.display_name || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-[#F700FC]" />
                        <span className="line-clamp-1">
                          {job.posted_on ? new Date(job.posted_on).toDateString() : "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-[#F700FC]" />
                        <span className="line-clamp-1">{statusText}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-[#F700FC]" />
                        <span className="text-[16px] line-clamp-2">{job.description || "N/A"}</span>
                      </div>
                    </div>
                    <div className="absolute bottom-6 left-6 right-6">
                      {(job.status === null || job.status < 5) && (
                        <button
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                          onClick={() => navigate('/interview', { state: { job, email: JSON.parse(sessionStorage.getItem("user") || "{}").email } })}
                        >
                          Start Test
                        </button>
                      )}
                      {job.status === 10 && (
                        <button
                          className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                          onClick={() => navigate('/interview', { state: { job } })}
                        >
                          Start Interview
                        </button>
                      )}
                      {job.status === 5 && (
                        <button
                          className="w-full px-4 py-2 bg-gray-500 text-white rounded cursor-not-allowed text-sm"
                          disabled
                        >
                          Rejected
                        </button>
                      )}
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

export default AppliedJobs;