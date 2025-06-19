import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- CandidateRow Interface ---
interface CandidateRow {
  candidateId: string;
  jobId: number;
  aiStatus: number; // AI-generated status from get_total_interview
  manualStatus?: number; // Manually updated status from getnightstatus
  title: string;
  postedOn: string;
  managerMessage?: string;
  updated?: boolean;
  timestamp?: string;
}

const CandidateDetailsPage: React.FC = () => {
  const [candidates, setCandidates] = useState<CandidateRow[]>([]);
  const [updatedCandidates, setUpdatedCandidates] = useState<CandidateRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof CandidateRow>('postedOn');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // filter for status
  const navigate = useNavigate();

  // Retrieve company id from session storage
  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setCompanyId(parsedUser.email);
      } catch (error) {
        console.error('Error parsing user data from session storage:', error);
      }
    }
  }, []);

  // Fetch candidate data from get_total_interview and filter out updated ones
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
                aiStatus: candidate.status,
                title: job.title || 'N/A',
                postedOn: job.posted_on || 'N/A',
              });
            });
          }
        });
        setCandidates(candidateRows);
        fetchUpdatedCandidates(candidateRows);
      })
      .catch((error) => {
        console.error('Error fetching candidate data:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [companyId]);

  // Function to fetch updated candidates with retry logic
  const fetchWithRetry = async (url: string, retries: number = 3, delay: number = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await axios.get(url);
        return response;
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
      }
    }
  };

  const fetchUpdatedCandidates = async (candidateRows: CandidateRow[]) => {
    const updatedCandidatesPromises = candidateRows.map((candidate) =>
      fetchWithRetry(
        `https://ho5dvgc5u2.execute-api.us-east-1.amazonaws.com/default/getnightstatus?candidateId=${candidate.candidateId}&jobId=${candidate.jobId}`
      )
        .then((response) => {
          const updatedData = response.data.data || [];
          return updatedData.map((item: any) => ({
            ...candidate,
            manualStatus: item.status,
            managerMessage: item.managerMessage,
            updated: true,
            timestamp: item.timestamp,
          }));
        })
        .catch((error) => {
          console.error(`Error fetching status for ${candidate.candidateId}-${candidate.jobId}:`, error);
          return [{ ...candidate, updated: false }];
        })
    );

    try {
      const results = await Promise.all(updatedCandidatesPromises);
      const flattenedResults = results.flat();
      setUpdatedCandidates(flattenedResults.filter((c) => c.updated));
      setCandidates((prev) =>
        prev.filter(
          (c) =>
            !flattenedResults.some(
              (u) => u.candidateId === c.candidateId && u.jobId === c.jobId && u.updated
            )
        )
      );
    } catch (error) {
      console.error('Error processing updated candidates:', error);
      setUpdatedCandidates([]);
    }
  };

  // Combine updated candidates and those pending update
  const finalCandidates = [...updatedCandidates, ...candidates];

  // Filter candidates by search term and status filter
  const filteredCandidates = finalCandidates.filter((candidate) =>
    (candidate.candidateId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.jobId.toString().includes(searchTerm)) &&
    (filterStatus === 'all' ||
      (filterStatus === 'selected'
        ? (candidate.manualStatus ?? candidate.aiStatus) === 10
        : (candidate.manualStatus ?? candidate.aiStatus) !== 10))
  );

  // Sort the filtered candidates
  const sortedCandidates = filteredCandidates.sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Handle candidate action via POST API
  const handleCandidateAction = (candidate: CandidateRow, action: 'approve' | 'reject') => {
    const endpoint = 'https://v92aqono0a.execute-api.us-east-1.amazonaws.com/default/nightstatus';
    axios
      .post(endpoint, {
        candidateId: candidate.candidateId,
        jobId: candidate.jobId,
        action: action,
      })
      .then(() => {
        setCandidates((prev) =>
          prev.filter(
            (c) => !(c.candidateId === candidate.candidateId && c.jobId === c.jobId)
          )
        );
        fetchUpdatedCandidates([
          ...candidates.filter(
            (c) => !(c.candidateId === candidate.candidateId && c.jobId === c.jobId)
          ),
        ]).then(() => {
          toast.success(`Candidate ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
        });
      })
      .catch((error) => {
        console.error('Error updating candidate status:', error);
        toast.error('There was an error updating the candidate status.');
      });
  };

  // Render a skeleton loader for loading state
  const LoadingSkeleton = () => (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="grid grid-cols-5 gap-4 p-4 animate-pulse">
          <div className="bg-gray-700 h-6 rounded"></div>
          <div className="bg-gray-700 h-6 rounded"></div>
          <div className="bg-gray-700 h-6 rounded"></div>
          <div className="bg-gray-700 h-6 rounded"></div>
          <div className="bg-gray-700 h-6 rounded"></div>
        </div>
      ))}
    </>
  );

  // Helper function to render status
  const renderStatus = (status: number | undefined, label: string) => {
    if (status === undefined) return null;
    return (
      <span
        className={`inline-block px-3 py-1 rounded-full text-sm ${
          status === 10 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}
      >
        {label}: {status === 10 ? 'Selected' : 'Rejected'}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="p-6">
        <button
          onClick={() => navigate('/Company-dashboard')}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors mb-4"
        >
          Back to Dashboard
        </button>

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
        ) : updatedCandidates.length === 0 && candidates.length === 0 ? (
          <div className="text-center text-gray-400">Failed to load candidate updates. Please try again later.</div>
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
                    <Link to={`/analysis/${candidate.candidateId}`} state={{ candidate }} className="hover:underline">
                      {candidate.candidateId}
                    </Link>
                  </div>
                  <div className="text-gray-300">
                    <Link to={`/analysis/${candidate.candidateId}`} state={{ candidate }} className="hover:underline">
                      {candidate.jobId}
                    </Link>
                  </div>
                  <div className="flex flex-col gap-2">
                    {renderStatus(candidate.aiStatus, 'AI')}
                    {renderStatus(candidate.manualStatus, 'Manual')}
                    {candidate.managerMessage && (
                      <div className="text-xs text-gray-400 mt-1">Message: {candidate.managerMessage}</div>
                    )}
                  </div>
                  <div className="text-gray-300">
                    <Link to={`/analysis/${candidate.candidateId}`} state={{ candidate }} className="hover:underline">
                      {candidate.title}
                    </Link>
                  </div>
                  <div className="flex gap-2">
                    {!candidate.updated ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCandidateAction(candidate, 'approve');
                          }}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCandidateAction(candidate, 'reject');
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