import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CandidateHome from './pages/CandidateHome';
import InterviewScreen from './pages/InterviewScreen';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ResumeUpload from './pages/ResumeUpload';
import Admindashboard from './components/AdminDashboard/Admindashboard';
import Landingpage from './components/landingpages/Landingpage';
import PostJob from './pages/PostJob';
import InterviewMaker from './pages/InterviewMaker';
import AppliedJobs from './pages/AppliedJobs';
import Offers from './pages/Offers';
import CandidateDetailsPage from './pages/CandidateDetailsPage';
import Profile from './pages/UserProfile';
import Jobdesc from './pages/Jobdesc';
import { ToastContainer } from 'react-toastify';
//
import CandidateAnalysisPage from './pages/CandidateAnalysisPage';
import Companyprofile from './components/Companyprofile/Companyprofile';


function App() {
  return (
    <>
    <ToastContainer />
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route index element={<Landingpage />} />
        <Route path="/post-job" element={<PostJob />} />
        <Route path="/candidate-dashboard" element={<CandidateHome />} />
        <Route path="/interview" element={<InterviewScreen />} />
        <Route path="/upload-resume" element={<ResumeUpload />} /> 
        <Route path="/applied-jobs" element={<AppliedJobs />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/Admin-dashboard" element={<Admindashboard />} />
        <Route path="/Company-dashboard" element={<Dashboard />} />
        <Route path="/interview-maker" element={<InterviewMaker />} />
        <Route path="/total-interview" element={<CandidateDetailsPage/>}/>;
        <Route path="/profile" element={<Profile/>}/>;
        <Route path="/Companyprofile" element={<Companyprofile/>}/>;
        <Route path="/analysis/:candidateId" element={<CandidateAnalysisPage />} />
        <Route path="/jobdesc" element={<Jobdesc />} />
        
      </Routes>
    </Router>
  </>
  );
}

export default App;
