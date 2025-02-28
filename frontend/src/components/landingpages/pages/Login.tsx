import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Checkbox } from '../components/ui/checkbox';
import { 
  BrainCircuit, 
  User, 
  Building, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff,
  ArrowRight
} from 'lucide-react';

interface LoginProps {
  type: 'admin' | 'candidate' | 'company';
}

function Login({ type }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { type: activeTab, email, password, rememberMe });
    // In a real app, you would handle authentication here
    alert(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} login attempt with email: ${email}`);
  };

  const getIcon = () => {
    switch(activeTab) {
      case 'admin':
        return <ShieldCheck className="h-6 w-6 text-purple-500" />;
      case 'candidate':
        return <User className="h-6 w-6 text-purple-500" />;
      case 'company':
        return <Building className="h-6 w-6 text-purple-500" />;
      default:
        return <User className="h-6 w-6 text-purple-500" />;
    }
  };

  const getTitle = () => {
    switch(activeTab) {
      case 'admin':
        return 'Admin Login';
      case 'candidate':
        return 'Candidate Login';
      case 'company':
        return 'Company Login';
      default:
        return 'Login';
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-12 h-full">
          {Array.from({ length: 120 }).map((_, i) => (
            <div key={i} className="aspect-square border border-purple-900/20 flex items-center justify-center">
              {i % 7 === 0 && <div className="w-1 h-1 rounded-full bg-purple-500"></div>}
            </div>
          ))}
        </div>
      </div>
      
      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BrainCircuit className="h-8 w-8 text-purple-500" />
            <span className="font-bold text-2xl">AHRS</span>
          </div>
          <h2 className="text-3xl font-bold">{getTitle()}</h2>
          <p className="text-gray-400 mt-2">Sign in to access your account</p>
        </div>
        
        <Tabs defaultValue={type} value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="admin" className="data-[state=active]:bg-purple-600">
              <ShieldCheck className="h-4 w-4 mr-2" />
              Admin
            </TabsTrigger>
            <TabsTrigger value="candidate" className="data-[state=active]:bg-purple-600">
              <User className="h-4 w-4 mr-2" />
              Candidate
            </TabsTrigger>
            <TabsTrigger value="company" className="data-[state=active]:bg-purple-600">
              <Building className="h-4 w-4 mr-2" />
              Company
            </TabsTrigger>
          </TabsList>
          
          <Card className="bg-gray-900 border-gray-800 p-6">
            <TabsContent value="admin" className="mt-0">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="admin-email" className="block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <Input
                        id="admin-email"
                        type="email"
                        placeholder="admin@example.com"
                        className="pl-10 bg-gray-800 border-gray-700"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="admin-password" className="block text-sm font-medium mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <Input
                        id="admin-password"
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
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="admin-remember" 
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      />
                      <label
                        htmlFor="admin-remember"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Remember me
                      </label>
                    </div>
                    <a href="#" className="text-sm text-purple-400 hover:text-purple-300">
                      Forgot password?
                    </a>
                  </div>
                  
                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                    Sign in as Admin
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="candidate" className="mt-0">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="candidate-email" className="block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <Input
                        id="candidate-email"
                        type="email"
                        placeholder="candidate@example.com"
                        className="pl-10 bg-gray-800 border-gray-700"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="candidate-password" className="block text-sm font-medium mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <Input
                        id="candidate-password"
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
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="candidate-remember" 
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      />
                      <label
                        htmlFor="candidate-remember"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Remember me
                      </label>
                    </div>
                    <a href="#" className="text-sm text-purple-400 hover:text-purple-300">
                      Forgot password?
                    </a>
                  </div>
                  
                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                    Sign in as Candidate
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  
                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-400">
                      Don't have an account?{" "}
                      <a href="#" className="text-purple-400 hover:text-purple-300">
                        Register as a Candidate
                      </a>
                    </p>
                  </div>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="company" className="mt-0">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="company-email" className="block text-sm font-medium mb-2">
                      Company Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <Input
                        id="company-email"
                        type="email"
                        placeholder="company@example.com"
                        className="pl-10 bg-gray-800 border-gray-700"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="company-password" className="block text-sm font-medium mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <Input
                        id="company-password"
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
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="company-remember" 
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      />
                      <label
                        htmlFor="company-remember"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Remember me
                      </label>
                    </div>
                    <a href="#" className="text-sm text-purple-400 hover:text-purple-300">
                      Forgot password?
                    </a>
                  </div>
                  
                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                    Sign in as Company
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  
                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-400">
                      Don't have an account?{" "}
                      <a href="#" className="text-purple-400 hover:text-purple-300">
                        Register your Company
                      </a>
                    </p>
                  </div>
                </div>
              </form>
            </TabsContent>
          </Card>
        </Tabs>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            By signing in, you agree to our{" "}
            <a href="#" className="text-purple-400 hover:text-purple-300">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-purple-400 hover:text-purple-300">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;