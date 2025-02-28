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
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="post-job" element={<PostJob />} />
          <Route path="candidate" element={<CandidateHome />} />
          <Route path="interview" element={<InterviewScreen />} />
          <Route path="candidate-dashboard" element={<CandidateDashboard />} />
          <Route path="upload-resume" element={<ResumeUpload />} /> 
        {/*Admin dashboard routes*/}
          <Route path="/Admindashboard" element={<Admindashboard />} />
          {/*landing page route*/}
          <Route path="/landingpage" element={<Landingpage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;