import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import * as pdfjsLib from 'pdfjs-dist';

// Set worker source dynamically
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

function ResumeUpload() {
  const location = useLocation();
  const navigate = useNavigate();
  const { job, email , description,title } = location.state || {};

  // Optionally check for job data here
  if (!job) {
    console.error("Job data not provided");
    // You might want to redirect or show an error message.
  }

  const [resume, setResume] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [matchPercentage, setMatchPercentage] = useState<number | null>(null);

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  // Extract text from PDF using pdfjs-dist
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

  // Update the analyzeResumeWithAI function
  const analyzeResumeWithAI = async (resumeText: string, jobDescription: string) => {
    try {
      const apiKey = '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'; // Replace with your actual OpenRouter API key

      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions', // OpenRouter API URL
        {
          model: 'qwen/qwq-32b:free', // Use the appropriate model for your use case
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
      console.log("***** ai message ", aiMessage);
      const percentageMatch = parseFloat(
        (aiMessage.match(/(\d+)%/g) || []).pop()?.replace('%', '') || '0'
      );

      console.log("***** ai percentage ", percentageMatch);
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
        candidateId: email, // Using email as candidate_id
        status: status,
      };

      await axios.post(
        'https://l1i2uu3p32.execute-api.us-east-1.amazonaws.com/default/post_candidate_status',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      alert('Your status has been updated. You will be notified later.');
    } catch (error) {
      console.error('Failed to update candidate status:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      navigate('/applied-jobs');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1E] to-[#2B2D42] flex flex-col justify-center items-center px-6">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl font-extrabold text-white mb-8 drop-shadow-lg"
      >
        Upload Your Resume for <span className="text-blue-400">{job.title}</span>
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
  );
}

export default ResumeUpload;
