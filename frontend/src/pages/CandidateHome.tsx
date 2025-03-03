import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ContentLoader from 'react-content-loader';

function CandidateHome() {
  const [jobData, setJobData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("User"); // Default value
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  // Retrieve username from session storage
  useEffect(() => {
    const storedUserData = sessionStorage.getItem("user");

    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        setUsername(userData?.username);
      } catch (error) {
        console.error("Error parsing session storage data:", error);
      }
    }
  }, []);

  useEffect(() => {
    console.log("Fetching job data...");
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
      } catch (err) {
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
  

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -450, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 450, behavior: "smooth" });
  };

  const handleJobClick = (job) => {
    console.log("Selected job:", job);
    localStorage.setItem("selectedJob", JSON.stringify(job));
    navigate('/upload-resume', { state: { job } });
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/");
  };
  
  

  return (
    <div className="min-h-screen bg-[#0F0B1E] relative">
      {/* Logout Button */}
      {/* <div className="absolute top-5 right-5">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-all"
        >
          Logout
        </button>
      </div> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">
              Welcome, {username}
            </h2>
            <p className="text-gray-400 mt-1">
              Find your dream job with our exclusive listings from top companies.
            </p>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition duration-300"
          >
            Logout
          </button>
        </div>

        {/* Jobs Section */}
        <div className="relative overflow-hidden">
          <div className="relative overflow-hidden pr-5">
            {loading ? (
              <div className="flex gap-5 overflow-hidden">
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
                className="flex overflow-x-scroll scrollbar-hide gap-5 w-full h-fit"
                ref={scrollRef}
              >
                {jobData.map((job, index) => (
                  <motion.div
                    key={index}
                    onClick={() => handleJobClick(job)}
                    className="cursor-pointer lg:min-w-[443px] lg:min-h-[251px] min-w-[343px] min-h-[151px] px-5 lg:px-10 py-5 bg-gradient-to-r from-[#F700FC] to-[#2941B9] rounded-lg flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="w-full flex justify-between">
                      <div className="text-white">
                        <h3 className="text-[18px] lg:text-[20px] font-semibold">
                          {job.job_title || job.data?.title || job.job_name}
                        </h3>
                        <p className="text-[10px] lg:text-[12px] font-thin">
                          {job.company_id}
                        </p>
                        <p className="text-[8px] lg:text-[10px] font-thin">
                          {new Date(job.posted_on || job.job_posted).toDateString()}
                        </p>
                      </div>
                      <div className={`px-5 py-1 rounded-full text-center h-fit text-[8px] lg:text-[10px] ${job.approval ? "bg-green-500" : "bg-yellow-500"}`}>
                        {job.approval ? "Eligible" : "Pending"}
                      </div>
                    </div>
                    <div className="grid w-full grid-cols-2 gap-5 m-2 lg:m-3">
                      <div className="text-[12px] lg:text-[16px] text-white">
                        <h4>Experience</h4>
                        <p>{job.experience || "N/A"}</p>
                      </div>
                      <div className="text-[12px] lg:text-[16px] text-white">
                        <h4>Location</h4>
                        <p>{job.location || job.data?.location}</p>
                      </div>
                      <div className="text-[12px] lg:text-[16px] text-white">
                        <h4>Salary</h4>
                        <p>{job.salary || job.data?.salary || "N/A"}</p>
                      </div>
                      <div className="text-[12px] lg:text-[16px] text-white">
                        <h4>Job Description</h4>
                        <p>{job.job_description || "No description available"}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Scroll Buttons */}
        <div className="flex w-full justify-between my-5">
          <button
            onClick={scrollLeft}
            className="p-3 rounded-full bg-[#1A1528] hover:bg-[#2A2538] transition-transform transform hover:scale-110"
          >
            ◀
          </button>
          <button
            onClick={scrollRight}
            className="p-3 rounded-full bg-[#1A1528] hover:bg-[#2A2538] transition-transform transform hover:scale-110"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
}

export default CandidateHome;
