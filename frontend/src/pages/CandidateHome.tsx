import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CandidateHome() {
  const [jobData, setJobData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://y9mnrdc2qd.execute-api.us-east-1.amazonaws.com/default/get_all_company_details",
          {
            timeout: 5000,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data && response.data.data) {
          setJobData(response.data.data);
        } else {
          setError("No job data found");
        }
      } catch (err) {
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
    navigate('/upload-resume', { state: { job } });
  };

  return (
    <div className="min-h-screen bg-[#0F0B1E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">Welcome User,</h2>
            <p className="text-gray-400 mt-1">
              We are delighted to have you here. This platform is designed to streamline your job posting process and help you find the best talent for your organization.
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div className="relative overflow-hidden pr-5">
            {loading ? (
              <p className="text-white">Loading jobs...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <div
                className="flex overflow-x-scroll scrollbar-hide gap-5 w-full h-fit"
                ref={scrollRef}
              >
                {jobData.map((job, index) => (
                  <div
                    key={index}
                    onClick={() => handleJobClick(job)}
                    className="cursor-pointer lg:min-w-[443px] lg:min-h-[251px] min-w-[343px] min-h-[151px] px-5 lg:px-10 py-5 bg-gradient-to-r from-[#F700FC] to-[#2941B9] rounded-lg flex flex-col justify-between"
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
                      <div className="px-5 py-1 rounded-full bg-[#F700FC] bg-opacity-35 text-center h-fit text-[8px] lg:text-[10px]">
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
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex w-full justify-between my-5">
          <button
            onClick={scrollLeft}
            className="p-2 rounded-full bg-[#1A1528] hover:bg-[#2A2538] transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={scrollRight}
            className="p-2 rounded-full bg-[#1A1528] hover:bg-[#2A2538] transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CandidateHome;
  