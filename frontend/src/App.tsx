import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PostJob from './pages/PostJob';
import CandidateHome from './pages/CandidateHome';
import InterviewScreen from './pages/InterviewScreen';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import CandidateDashboard from './pages/CandidateDashboard';
import ResumeUpload from './pages/ResumeUpload';

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
        </Route>
      </Routes>
    </Router>
  );
}

export default App;