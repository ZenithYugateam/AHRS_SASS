import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ContentLoader from 'react-content-loader';
import { ChevronDown, User } from 'lucide-react';

interface Job {
  job_id: string;
  title: string;
  description?: string;
  experience?: string;
  location?: string;
  salary?: string;
  company_id: string;
  posted_on?: string;
  job_posted?: string;
  approval?: boolean;
}

function CandidateHome() {
  const [jobData, setJobData] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("User");
  const [jobPreferences, setJobPreferences] = useState<string[]>([]);
  const [isJobsDropdownOpen, setIsJobsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  // Retrieve username and job preferences from session storage
  useEffect(() => {
    const storedUserData = sessionStorage.getItem("user");
    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        setUsername(userData?.username || "User");
        if (userData?.jobPreferences) {
          setJobPreferences(userData.jobPreferences);
        }
      } catch (err) {
        console.error("Error parsing session storage data:", err);
      }
    }
  }, []);

  // Fetch job data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://y9mnrdc2qd.execute-api.us-east-1.amazonaws.com/default/get_all_company_details",
          {
            timeout: 5000,
            headers: { "Content-Type": "application/json" },
          }
        );
        console.log("API response:", response.data);
        if (response.data && response.data.data) {
          setJobData(response.data.data);
        } else {
          setError("No job data found");
        }
      } catch (err: any) {
        console.error("Fetch error:", err);
        if (err.code === "ECONNABORTED") {
          setError("Request timed out. Please try again later.");
        } else {
          setError("Failed to fetch job data. Check API Gateway configuration.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter jobs based on user's saved job preference tags (case-insensitive)
  const preferenceJobs = jobData.filter((job) => {
    if (!jobPreferences || jobPreferences.length === 0) return false;
    return jobPreferences.some((pref) => {
      const lowerPref = pref.toLowerCase();
      return (
        job.title?.toLowerCase().includes(lowerPref) ||
        job.description?.toLowerCase().includes(lowerPref)
      );
    });
  });

  // Horizontal scroll logic
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -450, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 450, behavior: "smooth" });
    }
  };

  // Renders a single job card
  const renderJobCard = (job: Job, index: number) => (
    <motion.div
      key={index}
      onClick={() => handleJobClick(job)}
      // flex-none ensures each card doesn't shrink, 
      // so total width is just sum of all cards.
      className="flex-none lg:w-[443px] lg:h-[251px] w-[343px] h-[151px] 
                 px-5 lg:px-10 py-5 bg-gradient-to-r from-[#F700FC] to-[#2941B9] 
                 rounded-lg flex flex-col justify-between shadow-lg 
                 hover:shadow-xl transition-shadow"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className="flex justify-between">
        <div className="text-white">
          <h3 className="text-[18px] lg:text-[20px] font-semibold">{job.title}</h3>
          <p className="text-[10px] lg:text-[12px] font-thin">{job.company_id}</p>
          <p className="text-[8px] lg:text-[10px] font-thin">
            {new Date(job.posted_on || job.job_posted || Date.now()).toDateString()}
          </p>
        </div>
        <div
          className={`px-5 py-1 rounded-full text-center h-fit text-[8px] lg:text-[10px] 
                      ${job.approval ? "bg-green-500" : "bg-yellow-500"}`}
        >
          {job.approval ? "Eligible" : "Pending"}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5 mt-2">
        <div className="text-[12px] lg:text-[16px] text-white">
          <h4>Experience</h4>
          <p>{job.experience || "N/A"}</p>
        </div>
        <div className="text-[12px] lg:text-[16px] text-white">
          <h4>Location</h4>
          <p>{job.location || "N/A"}</p>
        </div>
        <div className="text-[12px] lg:text-[16px] text-white">
          <h4>Salary</h4>
          <p>{job.salary || "N/A"}</p>
        </div>
        <div className="text-[12px] lg:text-[16px] text-white">
          <h4>Job Description</h4>
          <div className="relative group">
            <p
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {job.description || "No description available"}
            </p>
            <div
              className="absolute top-full left-0 mt-1 w-[300px] bg-[#1A1528] 
                         text-white text-sm p-2 rounded-md shadow-lg opacity-0 
                         group-hover:opacity-100 transition-opacity z-10"
            >
              {job.description || "No description available"}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Handles job card click
  const handleJobClick = (job: Job) => {
    localStorage.setItem("selectedJob", JSON.stringify(job));
    const storedUserData = sessionStorage.getItem("user");
    if (storedUserData) {
      const email = JSON.parse(storedUserData).email;
      navigate("/upload-resume", { state: { job, email } });
    }
  };

  // Logout
  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/");
  };

  // Dropdown toggles
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

  return (
    <div className="min-h-screen bg-[#0F0B1E]">
      {/* Navigation Bar */}
      <nav className="bg-[#1A1528] py-4 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-white font-bold text-2xl">247 Interview.com</div>
          <div className="flex items-center space-x-8">
            <a href="#" className="text-white hover:text-gray-300 transition-colors">
              Home
            </a>
            {/* Jobs Dropdown */}
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
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                className="flex items-center space-x-2"
                onClick={toggleProfileDropdown}
              >
                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                  <User className="h-6 w-6 text-[#1A1528]" />
                </div>
                <span className="text-white">
                  {username} <ChevronDown className="inline h-4 w-4" />
                </span>
              </button>
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1A1528] rounded-md shadow-lg py-1 z-10">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setIsProfileDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#2A2538]"
                  >
                    Profile
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#2A2538]"
                  >
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#2A2538]"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-white">Welcome, {username}</h2>
          <p className="text-gray-400 mt-1">
            Find your dream job with our exclusive listings from top companies.
          </p>
        </header>

        {/* Preferred Jobs Section */}
        {jobPreferences.length > 0 && preferenceJobs.length > 0 && (
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-white mb-4">
              Jobs Matching Your Preferences
            </h3>
            <div className="overflow-x-auto scrollbar-hide flex gap-5" 
                 style={{ scrollBehavior: 'smooth' }}>
              {preferenceJobs.map((job, index) => renderJobCard(job, index))}
            </div>
          </section>
        )}

        {/* Job Listings Section */}
        <section>
          <h3 className="text-2xl font-semibold text-white mb-4">Job Listings</h3>
          {loading ? (
            <div className="flex gap-5">
              {[...Array(3)].map((_, index) => (
                <ContentLoader
                  key={index}
                  speed={2}
                  width={450}
                  height={200}
                  viewBox="0 0 450 200"
                  backgroundColor="#1E1A2B"
                  foregroundColor="#2E2840"
                  className="rounded-lg"
                >
                  <rect x="10" y="10" rx="8" ry="8" width="420" height="25" />
                  <rect x="10" y="50" rx="6" ry="6" width="200" height="15" />
                  <rect x="10" y="80" rx="6" ry="6" width="250" height="15" />
                  <rect x="10" y="120" rx="6" ry="6" width="180" height="15" />
                  <rect x="10" y="160" rx="6" ry="6" width="140" height="15" />
                </ContentLoader>
              ))}
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div 
              className="overflow-x-auto scrollbar-hide flex gap-5" 
              style={{ scrollBehavior: 'smooth' }}
              ref={scrollRef}
            >
              {jobData.map((job, index) => renderJobCard(job, index))}
            </div>
          )}
        </section>

        {/* Scroll Buttons */}
        <div className="flex w-full justify-between my-5">
          <button
            onClick={scrollLeft}
            className="p-3 rounded-full bg-[#1A1528] hover:bg-[#2A2538] 
                       transition-transform transform hover:scale-110"
          >
            ◀
          </button>
          <button
            onClick={scrollRight}
            className="p-3 rounded-full bg-[#1A1528] hover:bg-[#2A2538] 
                       transition-transform transform hover:scale-110"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
}

export default CandidateHome;
