import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { auth, db } from '../../../Firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { BrainCircuit, ArrowRight, Loader2 } from 'lucide-react';

// Custom TagsInput component for candidate preferences
function TagsInput({ tags, setTags }: { tags: string[]; setTags: (tags: string[]) => void }) {
  const [inputValue, setInputValue] = useState('');

  const addTag = () => {
    const newTag = inputValue.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-wrap gap-2 border border-gray-600 p-2 rounded-md bg-gray-800">
      {tags.map((tag, index) => (
        <div key={index} className="bg-purple-600 text-white px-2 py-1 rounded-md flex items-center">
          {tag}
          <button type="button" onClick={() => removeTag(tag)} className="ml-1 text-xs">
            x
          </button>
        </div>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add tag and press Enter"
        className="bg-transparent outline-none text-white"
      />
    </div>
  );
}

function Login() {
  const navigate = useNavigate();
  const { type = 'candidate' } = useParams<{ type: string }>();
  const validTypes = ['admin', 'candidate', 'company'];
  const validType = validTypes.includes(type) ? type : 'candidate';

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  // We'll only use the role dropdown for non-candidate signups.
  const [role, setRole] = useState('');
  const [activeTab, setActiveTab] = useState(validType);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // For candidate signup: store the custom tags the user adds.
  const [candidatePreferences, setCandidatePreferences] = useState<string[]>([]);
  // New states for college data and passout year
  const [colleges, setColleges] = useState<string[]>([]);
  const [selectedCollege, setSelectedCollege] = useState('');
  const [passoutYear, setPassoutYear] = useState('');

  useEffect(() => {
    setActiveTab(validType);
  }, [validType]);

  // Fetch college names if candidate is signing up
  useEffect(() => {
    if (activeTab === 'candidate' && isSignUp) {
      fetch('https://ojphcamztk.execute-api.us-east-1.amazonaws.com/default/fetchcollege')
        .then((res) => res.json())
        .then((data) => {
         
          if (data && Array.isArray(data.college_names)) {
            // Split each string by ',' and trim spaces to get separate entries
            const splittedNames = data.college_names.flatMap((item) =>
              item.split(',').map((name) => name.trim())
            );
            setColleges(splittedNames);
          } else {
            console.error('Unexpected response format:', data);
          }
        })
        .catch((err) => console.error('Error fetching colleges:', err));
    }
  }, [activeTab, isSignUp]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let userCredential;
      if (isSignUp) {
        // **Signup Process**
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Update displayName for the user
        await updateProfile(userCredential.user, { displayName: username });

        // For candidates, force role to "candidate" and include candidatePreferences,
        // selectedCollege, and passoutYear. For non-candidates, use the value from the select dropdown.
        const signupRole = activeTab === 'candidate' ? 'candidate' : role;
        const extraData =
          activeTab === 'candidate'
            ? { candidatePreferences, selectedCollege, passoutYear }
            : {};

        // **Store user details in Firestore**
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email,
          username,
          phoneNumber,
          role: signupRole,
          ...extraData
        });

        // Store the current user's UID in session storage
        sessionStorage.setItem('uid', userCredential.user.uid);

        alert('Account created successfully!');
      } else {
        // **Login Process**
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store the current user's UID in session storage
        sessionStorage.setItem('uid', user.uid);

        // **Fetch user's details from Firestore**
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();

          // **Ensure user logs in with correct role**
          if (userData.role !== activeTab) {
            setError(`Unauthorized: You cannot log in as ${activeTab}.`);
            return;
          }
          sessionStorage.setItem('user', JSON.stringify(userData));

          // **Redirect based on role**
          switch (userData.role) {
            case 'candidate':
              navigate('/candidate-dashboard');
              break;
            case 'admin':
              navigate('/admin-dashboard');
              break;
            case 'company':
              navigate('/company-dashboard');
              break;
            default:
              navigate('/');
          }
        } else {
          setError('User data not found.');
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    if (!email) {
      setError('Please enter your email for password reset.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Password reset email sent. Please check your inbox.');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <BrainCircuit className="h-8 w-8 text-purple-500 mx-auto" />
          <h2 className="text-3xl font-bold">{isSignUp ? 'Sign Up' : `${activeTab} Login`}</h2>
          <p className="text-gray-400">{isSignUp ? 'Create an account' : 'Sign in to continue'}</p>
        </div>

        <Tabs
          defaultValue={validType}
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger
              value="admin"
              className="hover:bg-purple-700 hover:text-white transition-colors duration-200 data-[state=active]:bg-purple-700 data-[state=active]:text-white"
            >
              Admin
            </TabsTrigger>
            <TabsTrigger
              value="candidate"
              className="hover:bg-purple-700 hover:text-white transition-colors duration-200 data-[state=active]:bg-purple-700 data-[state=active]:text-white"
            >
              Candidate
            </TabsTrigger>
            <TabsTrigger
              value="company"
              className="hover:bg-purple-700 hover:text-white transition-colors duration-200 data-[state=active]:bg-purple-700 data-[state=active]:text-white"
            >
              Company
            </TabsTrigger>
          </TabsList>

          <Card className="p-6 bg-gray-900 border-gray-800">
            <TabsContent value={activeTab}>
              <form onSubmit={handleAuth}>
                <div className="space-y-4">
                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <div>
                    <label className="block text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="bg-gray-800"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  {isSignUp && (
                    <>
                      <div>
                        <label className="block text-sm font-medium">Username</label>
                        <Input
                          type="text"
                          placeholder="Enter your username"
                          className="bg-gray-800"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium">Phone Number</label>
                        <Input
                          type="tel"
                          placeholder="Enter your phone number"
                          className="bg-gray-800"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          required
                        />
                      </div>

                      {/* For candidate signup, automatically assign role and allow custom tag entry */}
                      {activeTab === 'candidate' ? (
                        <>
                          <p className="block text-sm font-medium text-white">
                            Add your job interest tags
                          </p>
                          <TagsInput
                            tags={candidatePreferences}
                            setTags={setCandidatePreferences}
                          />

                          <div className="mt-4">
                            <label className="block text-sm font-medium">College Name</label>
                            <select
                              className="w-full p-2 rounded-md bg-gray-800 text-white"
                              value={selectedCollege}
                              onChange={(e) => setSelectedCollege(e.target.value)}
                              required
                            >
                              <option value="">Select College</option>
                              {colleges.map((college, index) => (
                                <option key={index} value={college}>
                                  {college}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="mt-4">
                            <label className="block text-sm font-medium">Pass Out Year</label>
                            <Input
                              type="number"
                              placeholder="Enter your pass out year"
                              className="bg-gray-800"
                              value={passoutYear}
                              onChange={(e) => setPassoutYear(e.target.value)}
                              required
                            />
                          </div>
                        </>
                      ) : (
                        <div>
                          <label className="block text-sm font-medium">Select Role</label>
                          <select
                            className="w-full p-2 rounded-md bg-gray-800 text-white"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                          >
                            <option value="">Select a Role</option>
                            <option value="candidate">Candidate</option>
                            <option value="admin">Admin</option>
                            <option value="company">Company</option>
                          </select>
                        </div>
                      )}
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium">Password</label>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="bg-gray-800"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <div className="flex items-center justify-between mt-1">
                      <button
                        type="button"
                        className="text-gray-500 hover:text-gray-300"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? 'Hide' : 'Show'} Password
                      </button>
                      {!isSignUp && (
                        <button
                          type="button"
                          onClick={handleForgotPassword}
                          className="text-sm text-purple-400 hover:text-purple-300"
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 flex justify-center items-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="animate-spin h-5 w-5" />
                        <span>Loading...</span>
                      </div>
                    ) : (
                      <>
                        {isSignUp ? 'Sign Up' : 'Sign In'}
                        <ArrowRight className="ml-2" />
                      </>
                    )}
                  </Button>

                  <button
                    type="button"
                    className="text-sm text-purple-400 hover:text-purple-300"
                    onClick={() => setIsSignUp(!isSignUp)}
                  >
                    {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                  </button>
                </div>
              </form>
            </TabsContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
}

export default Login;
