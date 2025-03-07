import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Package, Mic, UserCircle, Menu, Search, ChevronUp, ChevronDown } from 'lucide-react';

// Navbar Component
function Navbar() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string | null>(null);

  // Retrieve username from session storage
  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        // Use the 'name' property if available, otherwise fallback to email.
        setUserName(parsedUser.name || parsedUser.email);
      } catch (error) {
        console.error("Error parsing user data from session storage:", error);
      }
    }
  }, []);

  return (
    <nav className="bg-[#0a0a0a] border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-white">Dashboard</span>
            <span className="ml-4 text-purple-500 flex items-center">
              Hi, <span className="ml-1 animate-wave">👋</span>{userName?.trimEnd()}
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {/* Wrap Home link with Link component to navigate to /Company-dashboard */}
            <Link to="/Company-dashboard">
              <NavLink icon={<Home size={20} />} text="Home" active />
            </Link>
            <NavLink icon={<Package size={20} />} text="Packages" />
            <NavLink icon={<Mic size={20} />} text="Interview Maker" />
            <NavLink icon={<UserCircle size={20} />} text="Profile" />
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2">
              <span>Manage Subscription</span>
            </button>
          </div>

          <div className="md:hidden">
            <button className="text-gray-400 hover:text-white">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ icon, text, active = false }: { icon: React.ReactNode; text: string; active?: boolean }) {
  return (
    <a
      href="#"
      className={`flex items-center space-x-2 transition-colors duration-200 ${
        active ? 'text-purple-500' : 'text-gray-300 hover:text-white'
      }`}
    >
      {icon}
      <span>{text}</span>
    </a>
  );
}

// CandidateDetailsPage Component with API integration, sorting, filtering, and custom status rendering
interface CandidateRow {
  candidateId: string;
  jobId: number;
  status: number;
  title: string;
  postedOn: string;
}

const CandidateDetailsPage = () => {
  const [candidates, setCandidates] = useState<CandidateRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof CandidateRow>('postedOn');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');

  // Retrieve company id dynamically from session storage
  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        // Assuming the email is used as the company id
        setCompanyId(parsedUser.email);
      } catch (error) {
        console.error("Error parsing user data from session storage:", error);
      }
    }
  }, []);

  // Fetch candidate data once companyId is available
  useEffect(() => {
    if (!companyId) return;

    axios
      .get(
        `https://p103cwsao7.execute-api.us-east-1.amazonaws.com/default/get_total_interview?company_id=${companyId}`
      )
      .then((response) => {
        const jobs = response.data.jobs || [];
        const candidateRows: CandidateRow[] = [];
        // Loop through each job and then each candidate in candidateList
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

  // Sorting functionality
  const handleSort = (field: keyof CandidateRow) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedCandidates = [...candidates].sort((a, b) => {
    if (sortDirection === 'asc') {
      return a[sortField] > b[sortField] ? 1 : -1;
    }
    return a[sortField] < b[sortField] ? 1 : -1;
  });

  const filteredCandidates = sortedCandidates.filter(candidate =>
    Object.values(candidate).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Map status to a color and label (customize as needed)
  const getStatusColor = (status: number) => {
    if (status === 5) return 'bg-red-500';
    if (status === 10) return 'bg-green-500';
    const statusMap: Record<number, string> = {
      4: 'bg-yellow-500',
      3: 'bg-red-500',
      2: 'bg-blue-500',
      1: 'bg-gray-500'
    };
    return statusMap[status] || 'bg-gray-500';
  };

  const getStatusLabel = (status: number) => {
    if (status === 5) return 'Reject';
    if (status === 10) return 'Selected';
    return status.toString();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar at the top */}
      <Navbar />

      <main className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-purple-500">Candidate Details</h1>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search candidates..."
              className="w-full pl-10 pr-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-gray-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          // Shadow loading animation for loading jobs
          <div className="animate-pulse p-6">
            <div className="h-6 bg-gray-700 rounded mb-4 w-1/3"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-700 rounded w-full"></div>
              ))}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-purple-500 shadow-lg">
            <table className="min-w-full bg-[#1a1a1a] divide-y divide-gray-800">
              <thead>
                <tr className="bg-purple-800">
                  {['candidateId', 'jobId', 'status', 'title', 'postedOn'].map((key) => (
                    <th
                      key={key}
                      className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider cursor-pointer hover:bg-[#3a3a3a] transition-colors"
                      onClick={() => handleSort(key as keyof CandidateRow)}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{key}</span>
                        <div className="flex flex-col">
                          <ChevronUp
                            size={14}
                            className={`${
                              sortField === key && sortDirection === 'asc'
                                ? 'text-purple-500'
                                : 'text-gray-600'
                            }`}
                          />
                          <ChevronDown
                            size={14}
                            className={`${
                              sortField === key && sortDirection === 'desc'
                                ? 'text-purple-500'
                                : 'text-gray-600'
                            }`}
                          />
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredCandidates.length > 0 ? (
                  filteredCandidates.map((candidate, index) => (
                    <tr key={index} className="hover:bg-[#2a2a2a] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">{candidate.candidateId}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{candidate.jobId}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(candidate.status)} bg-opacity-20 border border-opacity-20`}>
                          {getStatusLabel(candidate.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{candidate.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{candidate.postedOn}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center px-6 py-4">
                      No candidates found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default CandidateDetailsPage;
