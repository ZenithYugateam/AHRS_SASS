import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, Calendar, Heart, Share2, Users, Eye, Clock, ArrowLeft } from 'lucide-react';

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
  applicants?: number;
  views?: number;
  daysLeft?: number;
  responsibilities?: string[];
  requirements?: string[];
  deadline?: string;
  benefits?: string[];
  email?: string;
}

function Jobdesc() {
  const [job, setJob] = useState<Job | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const jobData = location.state?.job || JSON.parse(localStorage.getItem("selectedJob") || "{}");
    const email = location.state?.email;

    if (jobData) {
      const formattedJob: Job = {
        ...jobData,
        company_id: jobData.company_id,
        posted_on: jobData.posted_on || jobData.job_posted 
          ? new Date(jobData.posted_on || jobData.job_posted).toLocaleDateString()
          : "N/A",
        applicants: jobData.applicants || 287,
        views: jobData.views || 13040,
        daysLeft: jobData.daysLeft || 9,
        description: jobData.description || "No description available",
        responsibilities: jobData.responsibilities || [
          "Design and implement scalable software solutions",
          "Lead technical design discussions",
        ],
        requirements: jobData.requirements || [
          jobData.experience ? `${jobData.experience} of experience` : "Experience required",
        ],
        deadline: jobData.deadline || "N/A",
        benefits: jobData.benefits || ["Competitive salary package"],
        email: email,
      };
      setJob(formattedJob);
    }
  }, [location.state]);

  const handleApplyClick = () => {
    if (job) {
      navigate("/upload-resume", { state: { job, email: job.email } });
    }
  };

  const handleBackClick = () => {
    navigate("/candidate-dashboard");
  };

  if (!job) {
    return <div className="text-white text-center py-20">Loading job details...</div>;
  }

  return (
    <div className="min-h-screen bg-[#13111C]">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={handleBackClick}
          className="text-white flex items-center mb-4 hover:text-violet-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Jobs
        </button>

        <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl p-8 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">{job.title}</h1>
              <div className="flex items-center gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  <span>{job.company_id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{job.location || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>Posted: {job.posted_on}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleApplyClick}
                className="bg-white text-violet-600 px-6 py-2 rounded-lg font-semibold hover:bg-violet-50 transition-colors"
              >
                Apply
              </button>
              <button className="text-white border border-white/30 p-2 rounded-lg hover:bg-white/10 transition-colors">
                <Heart className="w-6 h-6" />
              </button>
              <button className="text-white border border-white/30 p-2 rounded-lg hover:bg-white/10 transition-colors">
                <Share2 className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex gap-8 mt-8">
            <div className="flex items-center gap-2 text-white/90">
              <Users className="w-5 h-5" />
              <span>{job.applicants} Applied</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <Eye className="w-5 h-5" />
              <span>{job.views} Views</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <Clock className="w-5 h-5" />
              <span>{job.daysLeft} Days Left</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-8">
            <div className="bg-[#1D1B27] rounded-xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Job Description</h2>
              <p className="text-white/90 leading-relaxed">{job.description}</p>
            </div>

            <div className="bg-[#1D1B27] rounded-xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Key Responsibilities</h2>
              <ul className="list-disc list-inside text-white/90 space-y-2">
                {job.responsibilities.map((resp, index) => (
                  <li key={index}>{resp}</li>
                ))}
              </ul>
            </div>

            <div className="bg-[#1D1B27] rounded-xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Requirements</h2>
              <ul className="list-disc list-inside text-white/90 space-y-2">
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-[#1D1B27] rounded-xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Job Details</h2>
              <div className="space-y-4 text-white/90">
                <div>
                  <h3 className="font-semibold">Experience</h3>
                  <p>{job.experience || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Salary Range</h3>
                  <p>{job.salary || "Not disclosed"}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Last Date to Apply</h3>
                  <p>{job.deadline}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#1D1B27] rounded-xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Benefits</h2>
              <ul className="list-disc list-inside text-white/90 space-y-2">
                {job.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Jobdesc;