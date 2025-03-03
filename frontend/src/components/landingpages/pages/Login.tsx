import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth } from "../../../Firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Checkbox } from "../components/ui/checkbox";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Phone,
  User,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const { type = "candidate" } = useParams<{ type: string }>();
  const validTypes = ["admin", "candidate", "company"];
  const validType = validTypes.includes(type as string) ? type : "candidate";

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(validType as string);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setActiveTab(validType as string);
  }, [validType]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: username });
        alert("Account created successfully!");
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        alert("Logged in successfully!");
      }

      const user = userCredential.user;
      const userData = {
        email: user.email,
        username: user.displayName || email.split("@")[0],
        phoneNumber: phoneNumber,
        role: activeTab,
      };

      sessionStorage.setItem("user", JSON.stringify(userData));
      console.log("User Data:", userData);

      switch (activeTab) {
        case "candidate":
          navigate("/candidate-dashboard");
          break;
        case "admin":
          navigate("/admin-dashboard");
          break;
        case "company":
          navigate("/company-dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getTitle = () => {
    if (isSignUp) return "Sign Up";
    if (activeTab === "") return "Login"; // Default state when no tab is selected
    return `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Login`;
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">{getTitle()}</h2>
          <p className="text-gray-400 mt-2">
            {isSignUp ? "Create an account to get started" : "Sign in to access your account"}
          </p>
        </div>

        <Tabs defaultValue={validType} value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger
              value="admin"
              className={`${
                activeTab === "admin" ? "bg-purple-600 text-white" : ""
              }`}
            >
              Admin
            </TabsTrigger>
            <TabsTrigger
              value="candidate"
              className={`${
                activeTab === "candidate" ? "bg-purple-600 text-white" : ""
              }`}
            >
              Candidate
            </TabsTrigger>
            <TabsTrigger
              value="company"
              className={`${
                activeTab === "company" ? "bg-purple-600 text-white" : ""
              }`}
            >
              Company
            </TabsTrigger>
          </TabsList>

          <Card className="bg-gray-900 border-gray-800 p-6">
            <TabsContent value={activeTab} className="mt-0">
              <form onSubmit={handleAuth}>
                <div className="space-y-4">
                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 bg-gray-800 border-gray-700"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {isSignUp && (
                    <>
                      <div>
                        <label htmlFor="username" className="block text-sm font-medium mb-2">Username</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                          <Input
                            id="username"
                            type="text"
                            placeholder="Enter your username"
                            className="pl-10 bg-gray-800 border-gray-700"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="Enter your phone number"
                            className="pl-10 bg-gray-800 border-gray-700"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10 bg-gray-800 border-gray-700"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                    {isSignUp ? "Sign Up" : "Sign In"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
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
