import React, { useState, useEffect } from 'react';
import { Home, Mic, Package, Search, User } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// --- Navbar Component ---
// --- Navbar Component ---
function Navbar() {
  return (
    <nav className="bg-[#12121a] border-b border-gray-800 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
          <div className="ml-8">
            <span className="text-gray-400">Hi, zenithyugaa</span>
            <span className="ml-2">👋</span>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <NavLink icon={<Home className="w-5 h-5" />} text="Home" />
          <NavLink icon={<Package className="w-5 h-5" />} text="Packages" />
          <NavLink icon={<Mic className="w-5 h-5" />} text="Interview Maker" />
          <NavLink icon={<User className="w-5 h-5" />} text="Profile" />
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            Manage Subscription
          </button>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <a href="#" className="flex items-center space-x-2 text-gray-400 hover:text-purple-400 transition-colors">
      {icon}
      <span>{text}</span>
    </a>
  );
}

interface CandidateRow {
  candidateId: string;
  jobId: number;
  status: number;
  title: string;
  postedOn: string;
}

const CandidateDetailsPage: React.FC = () => {
  const [candidates, setCandidates] = useState<CandidateRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof CandidateRow>('postedOn');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [userName, setUserName] = useState<string | null>(null);

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

  // Fetch candidate data once companyId is available
  useEffect(() => {
    if (!companyId) return;

    axios
      .get(`https://p103cwsao7.execute-api.us-east-1.amazonaws.com/default/get_total_interview?company_id=${companyId}`)
      .then((response) => {
        const jobs = response.data.jobs || [];
        const candidateRows: CandidateRow[] = [];
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
        setCandidates(candidateRows);
      })
      .catch((error) => {
        console.error('Error fetching candidate data:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [companyId]);

  // Filter candidates by search term
  const filteredCandidates = candidates.filter(candidate =>
    candidate.candidateId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.jobId.toString().includes(searchTerm)
  );

  // Sort the filtered candidates
  const sortedCandidates = filteredCandidates.sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Navbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold text-purple-400 mb-6">Candidate Details</h1>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search candidates..."
            className="w-full bg-[#12121a] border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="bg-[#12121a] rounded-lg overflow-hidden">
            <div className="grid grid-cols-4 gap-4 p-4 bg-[#1a1a23] text-purple-400 font-semibold">
              <div>CANDIDATE ID</div>
              <div>JOB ID</div>
              <div>STATUS</div>
              <div>TITLE</div>
            </div>
            
            <div className="divide-y divide-gray-800">
              {sortedCandidates.map((candidate) => (
                <Link
                  key={`${candidate.candidateId}-${candidate.jobId}`}
                  to={`/analysis/${candidate.candidateId}`}
                  state={{ candidate }}  // pass candidate data to analysis page
                  className="grid grid-cols-4 gap-4 p-4 hover:bg-[#1a1a23] cursor-pointer transition-colors"
                >
                  <div className="text-gray-300">{candidate.candidateId}</div>
                  <div className="text-gray-300">{candidate.jobId}</div>
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                      candidate.status === 1 
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {candidate.status === 1 ? 'Selected' : 'Rejected'}
                    </span>
                  </div>
                  <div className="text-gray-300">{candidate.title}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDetailsPage;
