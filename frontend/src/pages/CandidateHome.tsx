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
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("User");
  const [jobPreferences, setJobPreferences] = useState<string[]>([]);
  const [isJobsDropdownOpen, setIsJobsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [sortByNewest, setSortByNewest] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const availableStacks = [
    "AI", "ML", "MERN Stack", "Full Stack", "Backend", "Frontend", 
    "DevOps", "Data Science", "Cybersecurity", "Mobile Dev"
  ];

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://y9mnrdc2qd.execute-api.us-east-1.amazonaws.com/default/get_all_company_details",
          { timeout: 5000, headers: { "Content-Type": "application/json" } }
        );
        if (response.data && response.data.data) {
          setJobData(response.data.data);
          setFilteredJobs(response.data.data);
        } else {
          setError("No job data found");
        }
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.code === "ECONNABORTED" ? "Request timed out." : "Failed to fetch job data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...jobData];
    if (searchQuery) {
      filtered = filtered.filter((job) =>
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company_id?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedLocation) {
      filtered = filtered.filter((job) => 
        job.location?.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }
    if (selectedTags.length > 0) {
      filtered = filtered.filter((job) =>
        selectedTags.some((tag) =>
          job.title?.toLowerCase().includes(tag.toLowerCase()) ||
          job.description?.toLowerCase().includes(tag.toLowerCase())
        )
      );
    }
    if (sortByNewest) {
      filtered.sort((a, b) => {
        const dateA = new Date(a.posted_on || a.job_posted || Date.now()).getTime();
        const dateB = new Date(b.posted_on || b.job_posted || Date.now()).getTime();
        return dateB - dateA;
      });
    }
    setFilteredJobs(filtered);
  }, [searchQuery, selectedLocation, selectedTags, sortByNewest, jobData]);

  const uniqueLocations = Array.from(new Set(jobData.map((job) => job.location || "N/A")));

  const renderJobCard = (job: Job, index: number) => (
    <motion.div
      key={index}
      onClick={() => handleJobClick(job)}
      className="w-full max-w-[300px] h-[250px] p-5 bg-gradient-to-r from-[#F700FC] to-[#2941B9] 
                 rounded-lg flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className="flex justify-between">
        <div className="text-white">
          <h3 className="text-[16px] font-semibold">{job.title}</h3>
          <p className="text-[10px] font-thin">{job.company_id}</p>
          <p className="text-[8px] font-thin">
            {new Date(job.posted_on || job.job_posted || Date.now()).toDateString()}
          </p>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-center h-fit text-[8px] 
                      ${job.approval ? "bg-green-500" : "bg-yellow-500"}`}
        >
          {job.approval ? "Eligible" : "Pending"}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-2 text-[12px] text-white">
        <div>
          <h4>Experience</h4>
          <p>{job.experience || "N/A"}</p>
        </div>
        <div>
          <h4>Location</h4>
          <p>{job.location || "N/A"}</p>
        </div>
        <div>
          <h4>Salary</h4>
          <p>{job.salary || "N/A"}</p>
        </div>
        <div>
          <h4>Description</h4>
          <p className="line-clamp-3">{job.description || "N/A"}</p>
        </div>
      </div>
    </motion.div>
  );

  const handleJobClick = (job: Job) => {
    localStorage.setItem("selectedJob", JSON.stringify(job));
    const storedUserData = sessionStorage.getItem("user");
    if (storedUserData) {
      const email = JSON.parse(storedUserData).email;
      navigate("/upload-resume", { state: { job, email } });
    }
  };

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

  return (
    <div className="min-h-screen bg-[#0F0B1E]">
      {/* Navigation Bar */}
      <nav className="bg-[#1A1528] py-4 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-white font-bold text-2xl">247 Interview.com</div>
          <div className="flex items-center space-x-8">
            <a href="#" className="text-white hover:text-gray-300 transition-colors">Home</a>
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
            {/* Red Logout Button */}
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-white">Welcome, {username}</h2>
          <p className="text-gray-400 mt-1">
            Find your dream job with our exclusive listings from top companies.
          </p>
        </header>

        {/* Filters and Search */}
        <section className="mb-8">
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs by title, description, or company..."
              className="w-full p-3 rounded-lg bg-[#1A1528] text-white placeholder-gray-400 
                         focus:outline-none focus:ring-2 focus:ring-[#F700FC]"
            />
            <div className="flex flex-wrap gap-4">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="p-2 rounded-lg bg-[#1A1528] text-white focus:outline-none"
              >
                <option value="">All Locations</option>
                {uniqueLocations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              <label className="flex items-center text-white">
                <input
                  type="checkbox"
                  checked={sortByNewest}
                  onChange={() => setSortByNewest((prev) => !prev)}
                  className="mr-2"
                />
                Sort by Newest
              </label>
              <div className="flex flex-wrap gap-2">
                {availableStacks.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSelectedTags((prev) =>
                        prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                      );
                    }}
                    className={`px-3 py-1 rounded-full text-sm text-white 
                               ${selectedTags.includes(tag) ? "bg-[#F700FC]" : "bg-[#2A2538]"} 
                               hover:bg-[#F700FC] transition-colors`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Job Listings Section (4x4 Grid) */}
        <section>
          <h3 className="text-2xl font-semibold text-white mb-4">Job Listings</h3>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {[...Array(4)].map((_, index) => (
                <ContentLoader
                  key={index}
                  speed={2}
                  width={300}
                  height={250}
                  viewBox="0 0 300 250"
                  backgroundColor="#1E1A2B"
                  foregroundColor="#2E2840"
                  className="rounded-lg"
                >
                  <rect x="10" y="10" rx="8" ry="8" width="280" height="25" />
                  <rect x="10" y="50" rx="6" ry="6" width="150" height="15" />
                  <rect x="10" y="80" rx="6" ry="6" width="200" height="15" />
                  <rect x="10" y="120" rx="6" ry="6" width="120" height="15" />
                  <rect x="10" y="160" rx="6" ry="6" width="100" height="15" />
                </ContentLoader>
              ))}
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredJobs.map((job, index) => renderJobCard(job, index))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default CandidateHome;