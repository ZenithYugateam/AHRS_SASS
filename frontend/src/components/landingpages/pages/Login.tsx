import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { auth, db } from '../../../Firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Checkbox } from '../components/ui/checkbox';
import { BrainCircuit, Lock, Mail, Eye, EyeOff, ArrowRight, Phone, User } from 'lucide-react';

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
  const [role, setRole] = useState(''); // Role selection for signup
  const [rememberMe, setRememberMe] = useState(false);
  const [activeTab, setActiveTab] = useState(validType);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setActiveTab(validType);
  }, [validType]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      let userCredential;

      if (isSignUp) {
        // **Signup Process**
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: username });

        // **Store user role in Firestore**
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email,
          username,
          phoneNumber,
          role,
        });

        alert('Account created successfully!');
      } else {
        // **Login Process**
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // **Fetch user's role from Firestore**
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

        <Tabs defaultValue={validType} value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="admin">Admin</TabsTrigger>
            <TabsTrigger value="candidate">Candidate</TabsTrigger>
            <TabsTrigger value="company">Company</TabsTrigger>
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
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium">Password</label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="bg-gray-800"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="text-gray-500 hover:text-gray-300 mt-1"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? 'Hide' : 'Show'} Password
                    </button>
                  </div>

                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                    {isSignUp ? 'Sign Up' : 'Sign In'}
                    <ArrowRight className="ml-2" />
                  </Button>

                  <button
                    type="button"
                    className="text-sm text-purple-400 hover:text-purple-300"
                    onClick={() => setIsSignUp(!isSignUp)}
                  >
                    {isSignUp ? 'Already have an account? Sign In' : 'Don\'t have an account? Sign Up'}
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
