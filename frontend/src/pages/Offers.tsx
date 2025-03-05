import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, Briefcase, Calendar, Building, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

// Status badge component
const StatusBadge = ({ statusText, type }: { statusText: string; type: 'success' | 'rejected' | 'pending' }) => {
  const getStatusColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 mr-1" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 mr-1" />;
      case 'pending':
      default:
        return <AlertCircle className="w-4 h-4 mr-1" />;
    }
  };

  return (
    <span className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
      {getStatusIcon()}
      {statusText}
    </span>
  );
};

function Offers() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("User");
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve candidate user data from session storage.
    const storedUserData = sessionStorage.getItem("user");
    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        setUsername(userData.username);
        // Use the email as candidate ID.
        const candidateId = userData.email;
        if (!candidateId) {
          throw new Error("Candidate ID (email) not found in user data.");
        }
        fetchOffers(candidateId);
      } catch (err) {
        console.error("Error parsing user data:", err);
        setError("User data is corrupted.");
        setLoading(false);
      }
    } else {
      setError("No user data found. Please sign in.");
      setLoading(false);
    }
  }, []);

  const fetchOffers = async (candidateId: string) => {
    try {
      // GET API call with candidateId as a query parameter.
      const response = await axios.get(
        `https://8psobgwfh2.execute-api.us-east-1.amazonaws.com/default/pass_or_fail`,
        { params: { candidateId } }
      );
      
      // Use candidateJobs property since API returns candidateJobs.
      setOffers(response.data.candidateJobs || []);
    } catch (err) {
      console.error("Error fetching offers:", err);
      setError("Failed to fetch offers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Navigate to Candidate Home when clicking "Home" in the navbar.
  const goToHome = () => {
    navigate('/candidate-dashboard');
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white">
      {/* Header */}
      <header className="bg-[#16213e] shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">247 Interview.com</h1>
          <nav className="flex items-center space-x-6">
            <a href="#" onClick={goToHome} className="hover:text-purple-300">Home</a>
            <a href="#" className="hover:text-purple-300">Jobs</a>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <User className="w-5 h-5 text-[#1a1a2e]" />
              </div>
              <span className="text-purple-300">{username}</span>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <section className="mb-12">
          <h2 className="text-4xl font-bold mb-2">
            Hi, <span className="text-purple-400">{username}</span>
          </h2>
          <p className="text-xl text-gray-300">
            Track your offer status and stay updated.
          </p>
        </section>

        {/* Offers Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <Briefcase className="mr-2" /> Offers
            </h2>
            <div className="flex space-x-2">
              <select className="bg-[#16213e] border border-gray-700 rounded-md px-3 py-1 text-sm">
                <option>All Statuses</option>
                <option>Interview Selected</option>
                <option>Not Selected</option>
              </select>
              <select className="bg-[#16213e] border border-gray-700 rounded-md px-3 py-1 text-sm">
                <option>Sort by Date</option>
                <option>Sort by Company</option>
              </select>
            </div>
          </div>

          {loading ? (
            <p className="text-gray-300">Loading offers...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : offers.length === 0 ? (
            <p className="text-gray-300">No offers found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map((offer, index) => {
                // Determine status display text and badge type based on status code.
                let statusText = "";
                let badgeType: 'success' | 'rejected' | 'pending' = 'pending';
                if (offer.status === 5) {
                  statusText = "Not Selected";
                  badgeType = "rejected";
                } else if (offer.status === 10) {
                  statusText = "Interview Selected - Final call by company, update soon";
                  badgeType = "success";
                } else {
                  statusText = "Pending";
                }

                return (
                  <motion.div
                    key={index}
                    className="rounded-lg overflow-hidden shadow-lg bg-gradient-to-br from-[#e100ff] to-[#7f00ff] hover:shadow-xl transition-shadow duration-300"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="p-6 bg-[#16213e] bg-opacity-95">
                      {/* Offer Details */}
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold truncate">{offer.title}</h3>
                        <StatusBadge statusText={statusText} type={badgeType} />
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-300">
                          <Building className="w-4 h-4 mr-2" />
                          <span>{offer.companyName || 'Company Name'}</span>
                        </div>
                        <div className="flex items-center text-gray-300">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{offer.date ? new Date(offer.date).toLocaleDateString() : 'Date not available'}</span>
                        </div>
                        <div className="flex items-center text-gray-300">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{offer.description || 'No description available'}</span>
                        </div>
                      </div>
                      {/* Actions */}
                      <div className="flex flex-col gap-2 pt-4 border-t border-gray-700">
                        {offer.status === 10 && (
                          <button
                            className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                            onClick={() => navigate('/interview-details', { state: { offer } })}
                          >
                            View Interview Details
                          </button>
                        )}
                        {offer.status === 5 && (
                          <button
                            className="w-full px-4 py-2 bg-gray-500 text-white rounded cursor-not-allowed"
                            disabled
                          >
                            No Further Action
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-1 rounded bg-[#16213e] text-gray-300 hover:bg-purple-900">Previous</button>
            <button className="px-3 py-1 rounded bg-purple-700 text-white">1</button>
            <button className="px-3 py-1 rounded bg-[#16213e] text-gray-300 hover:bg-purple-900">2</button>
            <button className="px-3 py-1 rounded bg-[#16213e] text-gray-300 hover:bg-purple-900">3</button>
            <button className="px-3 py-1 rounded bg-[#16213e] text-gray-300 hover:bg-purple-900">Next</button>
          </nav>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#16213e] py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© 2023 247 Interview.com. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <a href="#" className="hover:text-purple-300">Privacy Policy</a>
            <a href="#" className="hover:text-purple-300">Terms of Service</a>
            <a href="#" className="hover:text-purple-300">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Offers;
