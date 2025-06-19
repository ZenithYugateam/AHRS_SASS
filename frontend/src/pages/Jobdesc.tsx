import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, Calendar, Users, Eye, Clock, ArrowLeft } from 'lucide-react';

interface Job {
  job_id: string;
  title: string;
  description?: string;
  display_name: string;
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
  keyResponsibilities?: string;
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

    console.log("jobData from session:", jobData);

    if (jobData) {
      const formattedJob: Job = {
        ...jobData,
        display_name: jobData.display_name,
        posted_on: jobData.posted_on || jobData.job_posted
          ? new Date(jobData.posted_on || jobData.job_posted).toLocaleDateString()
          : "N/A",
        applicants: jobData.applicants || " ",
        views: jobData.views || " ",
        daysLeft: jobData.daysLeft || " ",
        description: jobData.description || "No description available",
        keyResponsibilities: jobData.keyResponsibilities || jobData.key_responsibilities || "No responsibilities available",
        requirements: jobData.requirements || [
          jobData.experience ? `${jobData.experience} of experience` : "Experience required",
        ],
        deadline: jobData.deadline || "N/A",
        benefits: jobData.benefits || "No benefits available",
        email: email,
      };

      console.log("Formatted job:", formattedJob);
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

  // Split description and other fields into arrays if they are strings
  const descriptionItems = typeof job.description === 'string' ? job.description.split('\n').filter(item => item.trim()) : [];
  const responsibilitiesItems = typeof job.keyResponsibilities === 'string' ? job.keyResponsibilities.split('\n').filter(item => item.trim()) : [];
  const benefitsItems = typeof job.benefits === 'string' ? job.benefits.split('\n').filter(item => item.trim()) : [];

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
                  <span>{job.display_name}</span>
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
              <ul className="list-none text-white/90 space-y-2">
                {descriptionItems.length > 0 ? (
                  descriptionItems.map((desc, index) => (
                    <li key={index} className="pl-0">{desc}</li>
                  ))
                ) : (
                  <li>No description available</li>
                )}
              </ul>
            </div>

            <div className="bg-[#1D1B27] rounded-xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Key Responsibilities</h2>
              <ul className="list-none text-white/90 space-y-2">
                {responsibilitiesItems.length > 0 ? (
                  responsibilitiesItems.map((resp, index) => (
                    <li key={index} className="pl-0">{resp}</li>
                  ))
                ) : (
                  <li>No key responsibilities available</li>
                )}
              </ul>
            </div>

            <div className="bg-[#1D1B27] rounded-xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Requirements</h2>
              <ul className="list-none text-white/90 space-y-2">
                {job.requirements && job.requirements.length > 0 ? (
                  job.requirements.map((req, index) => (
                    <li key={index} className="pl-0">{req}</li>
                  ))
                ) : (
                  <li>No requirements available</li>
                )}
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
              <ul className="list-none text-white/90 space-y-2">
                {benefitsItems.length > 0 ? (
                  benefitsItems.map((benefit, index) => (
                    <li key={index} className="pl-0">{benefit}</li>
                  ))
                ) : (
                  <li>No benefits available</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Jobdesc;