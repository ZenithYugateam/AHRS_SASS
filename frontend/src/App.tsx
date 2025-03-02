import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CandidateHome from './pages/CandidateHome';
import InterviewScreen from './pages/InterviewScreen';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import CandidateDashboard from './pages/CandidateDashboard';
import ResumeUpload from './pages/ResumeUpload';

import Admindashboard from './components/AdminDashboard/Admindashboard';
import Landingpage from './components/landingpages/Landingpage';

import PostJob from './pages/PostJob';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
          <Route index element={<Landingpage />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/candidate-dashboard" element={<CandidateHome />} />
          <Route path="/interview" element={<InterviewScreen />} />
          <Route path="/upload-resume" element={<ResumeUpload />} /> 
          <Route path="/Admin-dashboard" element={<Admindashboard />} />
          <Route path="/Company-dashboard" element={<Dashboard />} ></Route>
      </Routes>
    </Router>
  );
}

export default App;