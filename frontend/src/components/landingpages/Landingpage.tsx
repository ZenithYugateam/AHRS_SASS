import { useState } from 'react';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Avatar } from './components/ui/avatar';
import { Badge } from './components/ui/badge';
import { Input } from './components/ui/input';
import { Separator } from './components/ui/separator';
import { 
  BrainCircuit, 
  Users, 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  MessageSquare, 
  Mail, 
  Phone, 
  Building2,
  X,
  Menu
} from 'lucide-react';
import { Link } from "react-router-dom";

// Import pages
import Home from './pages/Home';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import { useNavigate } from "react-router-dom";

function Landingpage() {
  const navigate = useNavigate();
  const [isLoginVisible, setIsLoginVisible] = useState(true);

  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginType, setLoginType] = useState<'admin' | 'candidate' | 'company' | null>(null);

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <Home />;
      case 'features':
        return <Features />;
      case 'pricing':
        return <Pricing />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'login':
        return <Login type={loginType} />;
      default:
        return <Home />;
    }
  };

  const handleLoginClick = () => {
    setIsLoginVisible(false); // Hide button when clicked

    setCurrentPage('login');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 py-4 px-6 sticky top-0 bg-black/95 backdrop-blur-sm z-50">
        <div className="container mx-auto max-w-7xl flex justify-between items-center">
        <Link to="/">
  <div className="flex items-center gap-2 cursor-pointer">
    <BrainCircuit className="h-6 w-6 text-purple-500" />
    <span className="font-bold text-xl">AHRS</span>
  </div>
</Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a 
              href="#" 
              className={`text-sm hover:text-purple-400 transition-colors ${currentPage === 'home' ? 'text-purple-400' : ''}`}
              onClick={(e) => { e.preventDefault(); setCurrentPage('home'); setIsLoginVisible(true); }}
            >
              Home
            </a>
            <a 
              href="#" 
              className={`text-sm hover:text-purple-400 transition-colors ${currentPage === 'features' ? 'text-purple-400' : ''}`}
              onClick={(e) => { e.preventDefault(); setCurrentPage('features');setIsLoginVisible(true); }}
            >
              Features
            </a>
            <a 
              href="#" 
              className={`text-sm hover:text-purple-400 transition-colors ${currentPage === 'pricing' ? 'text-purple-400' : ''}`}
              onClick={(e) => { e.preventDefault(); setCurrentPage('pricing'); setIsLoginVisible(true);}}
            >
              Pricing
            </a>
            <a 
              href="#" 
              className={`text-sm hover:text-purple-400 transition-colors ${currentPage === 'about' ? 'text-purple-400' : ''}`}
              onClick={(e) => { e.preventDefault(); setCurrentPage('about'); setIsLoginVisible(true);}}
            >
              About
            </a>
            <a 
              href="#" 
              className={`text-sm hover:text-purple-400 transition-colors ${currentPage === 'contact' ? 'text-purple-400' : ''}`}
              onClick={(e) => { e.preventDefault(); setCurrentPage('contact'); setIsLoginVisible(true);}}
            >
              Contact
            </a>
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
          
          {/* Login Dropdown */}
          <div className="relative group hidden md:block">
          {isLoginVisible && <Button
      className="bg-purple-600 hover:bg-purple-700"
      onClick={() => handleLoginClick()}
    >
      Login
    </Button>}
            {/* <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <div className="py-1">
                <a 
                  href="https://us-east-1dnp36kj4m.auth.us-east-1.amazoncognito.com/login?client_id=4d6s0nfgnlt2gb4vk3pc5b38pr&response_type=code&scope=email+openid+phone&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fadmindashboard"
                  className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-purple-600 hover:text-white"
                >
                  Admin Login
                </a>
                <a 
                  href="https://us-east-1jbh0sfnyn.auth.us-east-1.amazoncognito.com/login?client_id=7235jqfsrq6us6vj9gutgb8c1o&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2Flocalhost%3A5173%2FCompanydashboard"
                  className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-purple-600 hover:text-white"
                >
                  Company Login
                </a>
                <a 
                  href="https://us-east-1ahnhr07jk.auth.us-east-1.amazoncognito.com/login?client_id=gqiphkof1gpahub6b0h600549&response_type=code&scope=email+openid+phone&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fcandidate-dashboard"
                  className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-purple-600 hover:text-white"
                >
                  Candidate Login
                </a>
              </div>
            </div> */}
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-gray-900 border-b border-gray-800 py-4 px-6 flex flex-col space-y-4">
            <a 
              href="#" 
              className={`text-sm hover:text-purple-400 transition-colors ${currentPage === 'home' ? 'text-purple-400' : ''}`}
              onClick={(e) => { 
                e.preventDefault(); 
                setCurrentPage('home'); 
                setMobileMenuOpen(false);
                setIsLoginVisible(true);
              }}
            >
              Home
            </a>
            <a 
              href="#" 
              className={`text-sm hover:text-purple-400 transition-colors ${currentPage === 'features' ? 'text-purple-400' : ''}`}
              onClick={(e) => { 
                e.preventDefault(); 
                setCurrentPage('features'); 
                setMobileMenuOpen(false);
                setIsLoginVisible(true);
              }}
            >
              Features
            </a>
            <a 
              href="#" 
              className={`text-sm hover:text-purple-400 transition-colors ${currentPage === 'pricing' ? 'text-purple-400' : ''}`}
              onClick={(e) => { 
                e.preventDefault(); 
                setCurrentPage('pricing'); 
                setMobileMenuOpen(false);
                setIsLoginVisible(true);
              }}
            >
              Pricing
            </a>
            <a 
              href="#" 
              className={`text-sm hover:text-purple-400 transition-colors ${currentPage === 'about' ? 'text-purple-400' : ''}`}
              onClick={(e) => { 
                e.preventDefault(); 
                setCurrentPage('about'); 
                setMobileMenuOpen(false);
                setIsLoginVisible(true);
              }}
            >
              About
            </a>
            <a 
              href="#" 
              className={`text-sm hover:text-purple-400 transition-colors ${currentPage === 'contact' ? 'text-purple-400' : ''}`}
              onClick={(e) => { 
                e.preventDefault(); 
                setCurrentPage('contact'); 
                setMobileMenuOpen(false);
                setIsLoginVisible(true);
              }}
            >
              Contact
            </a>
            <div className="pt-2 border-t border-gray-800">
              <p className="text-sm text-gray-400 mb-2">Login as:</p>
              <div className="flex flex-col space-y-2">
                <Button 
                  variant="outline" 
                  className="justify-start border-gray-700 hover:bg-purple-600 hover:text-white"
                  onClick={() => {
                    handleLoginClick('admin');
                    setMobileMenuOpen(false);
                  }}
                >
                  Admin Login
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start border-gray-700 hover:bg-purple-600 hover:text-white"
                  onClick={() => {
                    handleLoginClick('candidate');
                    setMobileMenuOpen(false);
                  }}
                >
                  Candidate Login
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start border-gray-700 hover:bg-purple-600 hover:text-white"
                  onClick={() => {
                    handleLoginClick('company');
                    setMobileMenuOpen(false);
                  }}
                >
                  Company Login
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="bg-gray-950 py-12">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BrainCircuit className="h-6 w-6 text-purple-500" />
                <span className="font-bold text-xl">AHRS</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered recruitment platform transforming how companies hire talent.
              </p>
              <div className="flex gap-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-purple-400">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-400">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-400">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-purple-400">Contact us</a></li>
                <li><a href="#" className="hover:text-purple-400">Account</a></li>
                <li><a href="#" className="hover:text-purple-400">Support Center</a></li>
                <li><a href="#" className="hover:text-purple-400">Feedback</a></li>
                <li><a href="#" className="hover:text-purple-400">Accessibility</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a 
                    href="#" 
                    className="hover:text-purple-400"
                    onClick={(e) => { e.preventDefault(); setCurrentPage('about'); }}
                  >
                    About Us
                  </a>
                </li>
                <li><a href="#" className="hover:text-purple-400">Blog</a></li>
                <li><a href="#" className="hover:text-purple-400">Careers</a></li>
                <li>
                  <a 
                    href="#" 
                    className="hover:text-purple-400"
                    onClick={(e) => { e.preventDefault(); setCurrentPage('features'); }}
                  >
                    Features
                  </a>
                </li>
                <li><a href="#" className="hover:text-purple-400">FAQs</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contact Info</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-purple-500" />
                  <span>+1 (123) 456-7890</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-purple-500" />
                  <span>info@ahrsdigital.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-purple-500" />
                  <span>123 Tech Street, San Francisco, CA 94107</span>
                </li>
              </ul>
            </div>
          </div>
          
          <Separator className="my-8 bg-gray-800" />
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © 2025 AHRS. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm text-gray-500 mt-4 md:mt-0">
              <a href="#" className="hover:text-purple-400">Privacy Policy</a>
              <a href="#" className="hover:text-purple-400">Terms of Service</a>
              <a href="#" className="hover:text-purple-400">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landingpage;