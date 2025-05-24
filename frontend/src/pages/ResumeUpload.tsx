import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import * as pdfjsLib from 'pdfjs-dist';
import { ChevronDown, User } from 'lucide-react';

// Set worker source dynamically
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

function ResumeUpload() {
  const location = useLocation();
  const navigate = useNavigate();
  const { job, email } = location.state || {};

  if (!job) {
    console.error("Job data not provided");
  }

  const [resume, setResume] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [matchPercentage, setMatchPercentage] = useState<number | null>(null);
  const [username, setUsername] = useState("User");
  const [isJobsDropdownOpen, setIsJobsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Retrieve username from session storage
  React.useEffect(() => {
    const storedUserData = sessionStorage.getItem("user");
    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        setUsername(userData?.username || "User");
      } catch (err) {
        console.error("Error parsing session storage data:", err);
      }
    }
  }, []);

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const fileReader = new FileReader();
    return new Promise((resolve, reject) => {
      fileReader.onload = async () => {
        try {
          const typedarray = new Uint8Array(fileReader.result as ArrayBuffer);
          const pdf = await pdfjsLib.getDocument(typedarray).promise;
          let text = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const pageText = content.items.map((item: any) => item.str).join(' ');
            text += pageText + '\n';
          }
          resolve(text);
        } catch (err) {
          reject(err);
        }
      };
      fileReader.onerror = reject;
      fileReader.readAsArrayBuffer(file);
    });
  };

  const analyzeResumeWithAI = async (resumeText: string, jobDescription: string) => {
    try {
      const apiKey = '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';
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'qwen/qwq-32b:free',
          messages: [
            {
              role: 'system',
              content: 'You are an AI assistant that evaluates if a resume matches a job description and provides a match percentage.',
            },
            {
              role: 'user',
              content: `Job Description:\n${jobDescription || ''}\n\nResume:\n${resumeText || ''}\n\nProvide a match percentage from 0 to 100, indicating how well the resume matches the job description.`,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const aiMessage = response.data.choices[0].message.content;
      const percentageMatch = parseFloat(
        (aiMessage.match(/(\d+)%/g) || []).pop()?.replace('%', '') || '0'
      );
      return percentageMatch;
    } catch (error) {
      console.error('Error analyzing resume with AI:', error.response ? error.response.data : error);
      return 0;
    }
  };

  const handleSubmit = async () => {
    if (!resume) return;
    setLoading(true);
    try {
      const resumeText = await extractTextFromPDF(resume);
      const percentage = await analyzeResumeWithAI(resumeText, job.description || '');
      setMatchPercentage(percentage);
      if (percentage < 30) {
        setLoading(false);
        alert(`Your resume is rejected.`);
        await handleLater(5);
        navigate('/candidate-dashboard');
      }
    } catch (error) {
      console.error('Error processing PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLater = async (status = 4) => {
    try {
      const payload = {
        companyId: job.company_id,
        jobId: job.job_id,
        candidateId: email,
        status: status,
      };
      await axios.post(
        'https://l1i2uu3p32.execute-api.us-east-1.amazonaws.com/default/post_candidate_status',
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );
      alert('Your status has been updated. You will be notified later.');
    } catch (error) {
      console.error('Failed to update candidate status:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      navigate('/applied-jobs');
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
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1E] to-[#2B2D42]">
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
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Button on Left Side */}
        <div className="flex justify-start mb-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/candidate-dashboard')}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Dashboard
          </motion.button>
        </div>

        <div className="flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl font-extrabold text-white mb-8 drop-shadow-lg"
          >
            Upload Your Resume for <span className="text-blue-400">{job?.title || 'Job'}</span>
          </motion.h1>

          {loading ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
              className="flex flex-col items-center gap-4 text-white"
            >
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
              <p>Analyzing your resume...</p>
            </motion.div>
          ) : matchPercentage !== null ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-6 text-white"
            >
              <div className="w-32 h-32">
                <CircularProgressbar
                  value={matchPercentage}
                  text={`${matchPercentage.toFixed(0)}%`}
                  styles={buildStyles({
                    textColor: '#ffffff',
                    pathColor: matchPercentage >= 30 ? '#4CAF50' : '#FF5252',
                    trailColor: '#2B2D42',
                  })}
                />
              </div>
              {matchPercentage >= 0 ? (
                <div className="text-center">
                  <p className="text-lg font-semibold">Would you like to proceed now or later?</p>
                  <div className="flex gap-4 mt-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => navigate('/interview', { state: { job } })}
                      className="px-6 py-3 bg-green-500 rounded-lg shadow-lg text-white hover:bg-green-600"
                    >
                      Proceed Now
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleLater()}
                      className="px-6 py-3 bg-yellow-500 rounded-lg shadow-lg text-white hover:bg-yellow-600"
                    >
                      Later
                    </motion.button>
                  </div>
                </div>
              ) : (
                <p className="text-red-500 text-lg font-semibold">
                  Your resume does not meet the required match percentage (30%).
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col items-center bg-[#1E1E2F] p-8 rounded-xl shadow-lg"
            >
              <input
                type="file"
                accept="application/pdf"
                onChange={handleResumeUpload}
                className="mb-4 text-white file:bg-blue-500 file:text-white file:rounded-lg file:px-4 file:py-2 cursor-pointer"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSubmit}
                className="px-6 py-3 bg-blue-500 rounded-lg text-white font-semibold shadow-lg hover:bg-blue-600 transition"
              >
                Submit Resume
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResumeUpload;