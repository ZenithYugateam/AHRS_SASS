import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, User, Briefcase, MapPin, DollarSign } from 'lucide-react';

interface Job {
  job_id: string;
  title: string;
  description?: string;
  experience?: string;
  location?: string;
  salary?: string;
  display_name?:string;
  company_id: string;
  posted_on?: string;
  job_posted?: string;
  approval?: boolean;
  private_job?: boolean;
  college_names?: string;
  status?: string; // Add status to the interface (optional field)
}

function CandidateHome() {
  const [jobData, setJobData] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [filteredPreferenceMatches, setFilteredPreferenceMatches] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("User");
  const [jobPreferences, setJobPreferences] = useState<string[]>([]);

  const [isJobsDropdownOpen, setIsJobsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [myCollegePost, setMyCollegePost] = useState(false);

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
          // Filter jobs to only include those without a 'status' field or where 'status' is undefined
          const filteredData = response.data.data.filter(
            (job: Job) => !job.status // Only keep jobs where status is undefined or not present
          );
          setJobData(filteredData);
          setFilteredJobs(filteredData);
        } else {
          setError("No job data found");
        }
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(
          err.code === "ECONNABORTED"
            ? "Request timed out."
            : "Failed to fetch job data."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const uniqueLocations = Array.from(new Set(jobData.map((job) => job.location || "N/A")));

  useEffect(() => {
    let filtered = [...jobData];
    if (searchQuery) {
      filtered = filtered.filter((job) =>
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
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

    if (myCollegePost) {
      const storedUser = sessionStorage.getItem("user");
      const userData = storedUser ? JSON.parse(storedUser) : null;
      const candidateCollege = userData ? userData.selectedCollege : "";
      filtered = filtered.filter(
        (job) => job.private_job === true && job.college_names?.includes(candidateCollege)
      );
    }

    setFilteredJobs(filtered);

    let prefMatches = jobData.filter((job) => {
      if (!jobPreferences || jobPreferences.length === 0) return false;
      return jobPreferences.some((pref) => {
        const lowerPref = pref.toLowerCase();
        return (
          job.title?.toLowerCase().includes(lowerPref) ||
          job.description?.toLowerCase().includes(lowerPref)
        );
      });
    });

    if (searchQuery) {
      prefMatches = prefMatches.filter((job) =>
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedLocation) {
      prefMatches = prefMatches.filter((job) =>
        job.location?.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }
    if (selectedTags.length > 0) {
      prefMatches = prefMatches.filter((job) =>
        selectedTags.some((tag) =>
          job.title?.toLowerCase().includes(tag.toLowerCase()) ||
          job.description?.toLowerCase().includes(tag.toLowerCase())
        )
      );
    }
    if (myCollegePost) {
      const storedUser = sessionStorage.getItem("user");
      const userData = storedUser ? JSON.parse(storedUser) : null;
      const candidateCollege = userData ? userData.selectedCollege : "";
      prefMatches = prefMatches.filter(
        (job) => job.private_job === true && job.college_names?.includes(candidateCollege)
      );
    }

    if (sortByNewest) {
      prefMatches.sort((a, b) => {
        const dateA = new Date(a.posted_on || a.job_posted || Date.now()).getTime();
        const dateB = new Date(b.posted_on || b.job_posted || Date.now()).getTime();
        return dateB - dateA;
      });
    }

    setFilteredPreferenceMatches(prefMatches);
  }, [searchQuery, selectedLocation, selectedTags, sortByNewest, jobData, jobPreferences, myCollegePost]);

  const renderJobCard = (job: Job, index: number) => (
    <motion.div
      key={index}
      onClick={() => handleJobClick(job)}
      className="w-[300px] h-[300px] bg-[#1E1A2B] rounded-2xl p-5 shadow-inner 
                 hover:shadow-[0_0_15px_rgba(247,0,252,0.5)] transition-all duration-300 
                 cursor-pointer relative overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.5, delay: index * 0.1, type: "spring" }}
    >
      <div className="h-2 w-full bg-gradient-to-r from-[#F700FC] to-[#2941B9] rounded-t-lg absolute top-0 left-0" />
      <div className="absolute top-4 right-4">
        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-medium text-white
                          ${job.approval ? "bg-green-500/80" : "bg-yellow-500/80"}`}>
          {job.approval ? "Eligible" : "Pending"}
        </span>
      </div>
      <div className="mt-6">
        <motion.h3
          className="text-xl font-bold text-white line-clamp-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {job.title}
        </motion.h3>
        <div className="inline-block bg-[#F700FC]/20 text-white text-sm font-medium px-2 py-1 rounded-full mt-1">
          {job.display_name}
        </div>
        <p className="text-[12px] text-gray-400 mt-1">
          {new Date(job.posted_on || job.job_posted || Date.now()).toDateString()}
        </p>
      </div>
      <div className="mt-3 flex flex-col gap-1 text-base text-[#B0B0B0]">
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-[#F700FC]" />
          <span className="line-clamp-1">{job.experience || "N/A"}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-[#F700FC]" />
          <span className="line-clamp-1">{job.location || "N/A"}</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-[#F700FC]" />
          <span className="text-white relative line-clamp-1">
            {job.salary || "N/A"}
            <div className="absolute -bottom-1 left-0 w-full h-1.5 bg-[#F700FC] rounded opacity-80" />
          </span>
        </div>
        <p className="text-[14px] text-gray-400 line-clamp-1 mt-1">
          {job.description || "N/A"}
        </p>
      </div>
    </motion.div>
  );

  const handleJobClick = (job: Job) => {
    console.log("Job clicked:", job);
    localStorage.setItem("selectedJob", JSON.stringify(job));
    const storedUserData = sessionStorage.getItem("user");
    if (storedUserData) {
      try {
        const email = JSON.parse(storedUserData).email;
        console.log("Navigating to /jobdesc with:", { job, email });
        navigate("/jobdesc", { state: { job, email } });
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    } else {
      console.log("No user data in sessionStorage, redirecting to signin");
      navigate("/signin");
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
      <nav className="bg-[#1A1528] py-4 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-white font-bold text-2xl">247 Interview.com</div>
          <div className="flex items-center space-x-8">
            <a href="#" className="text-white hover:text-gray-300 transition-colors">
              Home
            </a>
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
              <button
                className="flex items-center space-x-2"
                onClick={() => {
                  navigate("/profile");
                  setIsProfileDropdownOpen(false);
                }}
              >
                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="h-6 w-6 text-[#1A1528]" />
                </div>
                <span className="text-white">{username}</span>
              </button>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-white">Welcome, {username}</h2>
          <p className="text-gray-400 mt-1">
            Find your dream job with our exclusive listings from top companies.
          </p>
        </header>

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
              <label className="flex items-center text-white">
                <input
                  type="checkbox"
                  checked={myCollegePost}
                  onChange={() => setMyCollegePost((prev) => !prev)}
                  className="mr-2"
                />
                My College Posts Only
              </label>
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

        {jobPreferences.length > 0 && filteredPreferenceMatches.length > 0 && (
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-white mb-4">
              Jobs Matching Your Preferences
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
              {filteredPreferenceMatches.map((job, index) => renderJobCard(job, index))}
            </div>
          </section>
        )}

        <section>
          <h3 className="text-2xl font-semibold text-white mb-4">Job Listings</h3>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="w-[300px] h-[300px] bg-[#1E1A2B] rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
              {filteredJobs.map((job, index) => renderJobCard(job, index))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default CandidateHome;
