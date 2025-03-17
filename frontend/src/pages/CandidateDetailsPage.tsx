import React, { useState, useEffect } from 'react';
import { Home, Mic, Package, Search, User } from 'lucide-react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- NavLink Component ---
function NavLink({ icon, text, to }: { icon: React.ReactNode; text: string; to: string }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if this link is active
  const isActive = location.pathname === to;

  return (
    <button
      onClick={() => navigate(to)}
      className={`flex items-center space-x-2 transition-colors ${
        isActive ? 'text-purple-400' : 'text-gray-400 hover:text-purple-400'
      }`}
    >
      {icon}
      <span>{text}</span>
    </button>
  );
}

// --- Navbar Component ---
function Navbar() {
  return (
    <nav className="bg-[#12121a] border-b border-gray-800 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-white">247 Interview.com</h1>
          <div className="ml-8">
            <span className="text-gray-400">Hi, zenithyugaa</span>
            <span className="ml-2">👋</span>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <NavLink icon={<Home className="w-5 h-5" />} text="Home" to="/Company-dashboard" />
          <NavLink icon={<Package className="w-5 h-5" />} text="Packages" to="/packages" />
          <NavLink icon={<Mic className="w-5 h-5" />} text="Interview Maker" to="/interview-maker" />
          <NavLink icon={<User className="w-5 h-5" />} text="Profile" to="/profile" />
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            Manage Subscription
          </button>
        </div>
      </div>
    </nav>
  );
}

// --- CandidateRow Interface ---
interface CandidateRow {
  candidateId: string;
  jobId: number;
  status: number;
  title: string;
  postedOn: string;
  managerMessage?: string;
  updated?: boolean;
}

const CandidateDetailsPage: React.FC = () => {
  const [candidates, setCandidates] = useState<CandidateRow[]>([]);
  const [updatedCandidates, setUpdatedCandidates] = useState<CandidateRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof CandidateRow>('postedOn');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // new filter for status
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();

  // Retrieve company id and user info from session storage
  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setCompanyId(parsedUser.email);
        setUserName(parsedUser.name || parsedUser.email);
      } catch (error) {
        console.error("Error parsing user data from session storage:", error);
      }
    }
  }, []);

  // Load updated candidates from localStorage (if any)
  useEffect(() => {
    const storedUpdated = localStorage.getItem('updatedCandidates');
    if (storedUpdated) {
      setUpdatedCandidates(JSON.parse(storedUpdated));
    }
  }, []);

  // Fetch candidate data once companyId is available
  useEffect(() => {
    if (!companyId) return;
    axios
      .get(`https://p103cwsao7.execute-api.us-east-1.amazonaws.com/default/get_total_interview?company_id=${companyId}`)
      .then((response) => {
        const jobs = response.data.jobs || [];
        let candidateRows: CandidateRow[] = [];
        jobs.forEach((job: any) => {
          if (job.candidateList && Array.isArray(job.candidateList)) {
            job.candidateList.forEach((candidate: any) => {
              candidateRows.push({
                candidateId: candidate.candidateId,
                jobId: job.job_id,
                status: candidate.status,
                title: job.title || 'N/A',
                postedOn: job.posted_on || 'N/A',
              });
            });
          }
        });
        // Directly read updated candidates from localStorage
        const storedUpdated = localStorage.getItem('updatedCandidates');
        const updatedFromStorage: CandidateRow[] = storedUpdated ? JSON.parse(storedUpdated) : [];
        
        // Remove any candidates that have already been updated.
        const filteredCandidates = candidateRows.filter(c =>
          !updatedFromStorage.some(
            (u) => u.candidateId === c.candidateId && u.jobId === c.jobId
          )
        );
        setCandidates(filteredCandidates);
      })
      .catch((error) => {
        console.error('Error fetching candidate data:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [companyId]); // Note: updatedCandidates is no longer a dependency here

  // Combine updated candidates and those pending update.
  const finalCandidates = [...updatedCandidates, ...candidates];

  // Filter candidates by search term and status filter
  const filteredCandidates = finalCandidates.filter(candidate =>
    (candidate.candidateId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.jobId.toString().includes(searchTerm)) &&
    (filterStatus === 'all' ||
      (filterStatus === 'selected' ? candidate.status === 10 : candidate.status !== 10))
  );

  // Sort the filtered candidates
  const sortedCandidates = filteredCandidates.sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Handle candidate action via POST API.
  const handleCandidateAction = (candidate: CandidateRow, action: "approve" | "reject") => {
    const endpoint = "https://v92aqono0a.execute-api.us-east-1.amazonaws.com/default/nightstatus";
    
    axios
      .post(endpoint, {
        candidateId: candidate.candidateId,
        jobId: candidate.jobId,
        action: action,
      })
      .then(() => {
        // Create an updated candidate object with the new status and manager message.
        const updatedCandidate: CandidateRow = {
          ...candidate,
          status: action === "approve" ? 10 : 0,
          managerMessage:
            action === "approve"
              ? "Candidate is approved by the manager"
              : "Candidate is rejected by the manager",
          updated: true,
        };
        // Remove this candidate from the pending list.
        setCandidates(prev =>
          prev.filter(
            (c) =>
              !(c.candidateId === candidate.candidateId && c.jobId === candidate.jobId)
          )
        );
        // Add the updated candidate to the updatedCandidates list and persist in localStorage.
        setUpdatedCandidates((prev) => {
          const newUpdated = [...prev, updatedCandidate];
          localStorage.setItem('updatedCandidates', JSON.stringify(newUpdated));
          return newUpdated;
        });
        toast.success(`Candidate ${action === "approve" ? "approved" : "rejected"} successfully`);
      })
      .catch((error) => {
        console.error("Error updating candidate status:", error);
        toast.error("There was an error updating the candidate status.");
      });
  };

  // Render a skeleton loader for loading state
  const LoadingSkeleton = () => (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-5 gap-4 p-4 animate-pulse"
        >
          <div className="bg-gray-700 h-6 rounded"></div>
          <div className="bg-gray-700 h-6 rounded"></div>
          <div className="bg-gray-700 h-6 rounded"></div>
          <div className="bg-gray-700 h-6 rounded"></div>
          <div className="bg-gray-700 h-6 rounded"></div>
        </div>
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Navbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold text-purple-400 mb-6">Candidate Details</h1>
        
        {/* Search and Filter Options */}
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6">
          <div className="relative flex-1 mb-4 md:mb-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search candidates..."
              className="w-full bg-[#12121a] border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex-shrink-0">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[#12121a] border border-gray-800 rounded-lg pl-4 pr-2 py-2 text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Statuses</option>
              <option value="selected">Selected</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <div className="bg-[#12121a] rounded-lg overflow-hidden">
            <div className="grid grid-cols-5 gap-4 p-4 bg-[#1a1a23] text-purple-400 font-semibold">
              <div>CANDIDATE ID</div>
              <div>JOB ID</div>
              <div>STATUS</div>
              <div>TITLE</div>
              <div>ACTIONS</div>
            </div>
            
            <div className="divide-y divide-gray-800">
              {sortedCandidates.map((candidate) => (
                <div
                  key={`${candidate.candidateId}-${candidate.jobId}`}
                  className="grid grid-cols-5 gap-4 p-4 hover:bg-[#1a1a23] transition-colors"
                >
                  <div className="text-gray-300">
                    <Link
                      to={`/analysis/${candidate.candidateId}`}
                      state={{ candidate }}
                      className="hover:underline"
                    >
                      {candidate.candidateId}
                    </Link>
                  </div>
                  <div className="text-gray-300">
                    <Link
                      to={`/analysis/${candidate.candidateId}`}
                      state={{ candidate }}
                      className="hover:underline"
                    >
                      {candidate.jobId}
                    </Link>
                  </div>
                  <div>
                    {candidate.status === 10 ? (
                      <span className="inline-block px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-400">
                        Selected
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 rounded-full text-sm bg-red-500/20 text-red-400">
                        Rejected
                      </span>
                    )}
                    {candidate.managerMessage && (
                      <div className="text-xs text-gray-400 mt-1">
                        {candidate.managerMessage}
                      </div>
                    )}
                  </div>
                  <div className="text-gray-300">
                    <Link
                      to={`/analysis/${candidate.candidateId}`}
                      state={{ candidate }}
                      className="hover:underline"
                    >
                      {candidate.title}
                    </Link>
                  </div>
                  <div className="flex gap-2">
                    {/* If this candidate has been updated, hide action buttons */}
                    {!candidate.updated ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCandidateAction(candidate, "approve");
                          }}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCandidateAction(candidate, "reject");
                          }}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-sm text-gray-400">Action Taken</span>
                    )}
                    <button
                      onClick={() =>
                        navigate(`/analysis/${candidate.candidateId}`, { state: { candidate } })
                      }
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                    >
                      View Analysis
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default CandidateDetailsPage;
