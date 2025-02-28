import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import { 
  BrainCircuit, 
  Users, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight,
  Award,
  Clock,
  Globe,
  Heart
} from 'lucide-react';

function About() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-12 h-full">
            {Array.from({ length: 120 }).map((_, i) => (
              <div key={i} className="aspect-square border border-purple-900/20 flex items-center justify-center">
                {i % 7 === 0 && <div className="w-1 h-1 rounded-full bg-purple-500"></div>}
              </div>
            ))}
          </div>
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <Badge className="bg-purple-900/50 text-purple-300 mb-4">ABOUT US</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Revolutionizing <span className="text-purple-500">Recruitment</span> with AI
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-8">
            We're on a mission to transform how companies find and hire talent through 
            innovative AI technology and a deep understanding of the recruitment process.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-purple-900/50 text-purple-300 mb-4">OUR STORY</Badge>
              <h2 className="text-3xl font-bold mb-6">
                From Startup to Industry Leader
              </h2>
              <p className="text-gray-400 mb-4">
                Founded in 2020, AHRS began with a simple idea: recruitment should be more efficient, 
                data-driven, and focused on finding the right match between candidates and companies.
              </p>
              <p className="text-gray-400 mb-4">
                Our founders, experienced HR professionals and AI engineers, recognized the limitations 
                of traditional recruitment methods and set out to build a platform that would revolutionize 
                the industry.
              </p>
              <p className="text-gray-400">
                Today, we're proud to serve thousands of companies worldwide, from startups to Fortune 500 
                enterprises, helping them find and hire the best talent more efficiently than ever before.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg opacity-30 blur-xl"></div>
              <Card className="bg-gray-900 border-gray-800 relative z-10 overflow-hidden">
                <div className="max-w-md mx-auto md:max-w-full">
                  <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                    alt="Our Team" 
                    className="w-full h-[300px] md:h-[400px] object-cover"
                  />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission & Values */}
      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="bg-purple-900/50 text-purple-300 mb-4">MISSION & VALUES</Badge>
            <h2 className="text-3xl font-bold mb-4">What Drives Us</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our mission and values guide everything we do, from product development to customer service.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <Card className="bg-gray-900 border-gray-800 p-8">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Globe className="h-6 w-6 text-purple-500" />
                Our Mission
              </h3>
              <p className="text-gray-400 mb-6">
                To transform the recruitment industry by leveraging AI technology to create more efficient, 
                effective, and equitable hiring processes that benefit both employers and job seekers.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="mt-1">
                    <CheckCircle2 className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-gray-300">Eliminate bias in hiring</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1">
                    <CheckCircle2 className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-gray-300">Reduce time-to-hire by 75%</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1">
                    <CheckCircle2 className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-gray-300">Improve candidate experience</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1">
                    <CheckCircle2 className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-gray-300">Increase hiring success rate</p>
                  </div>
                </li>
              </ul>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800 p-8">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Heart className="h-6 w-6 text-purple-500" />
                Our Values
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-lg mb-2">Innovation</h4>
                  <p className="text-gray-400">
                    We're constantly pushing the boundaries of what's possible with AI in recruitment.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">Integrity</h4>
                  <p className="text-gray-400">
                    We believe in transparency, honesty, and ethical AI practices.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">Inclusion</h4>
                  <p className="text-gray-400">
                    We're committed to creating technology that promotes diversity and reduces bias.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">Impact</h4>
                  <p className="text-gray-400">
                    We measure our success by the positive difference we make for our customers.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="bg-purple-900/50 text-purple-300 mb-4">OUR TEAM</Badge>
            <h2 className="text-3xl font-bold mb-4">Meet Our Leadership</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our diverse team of experts brings together decades of experience in HR, technology, and AI.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-900 border-gray-800 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Michael Chen" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">Michael Chen</h3>
                <p className="text-purple-400 text-sm mb-4">Co-Founder & CEO</p>
                <p className="text-gray-400 mb-4">
                  Former HR executive with 15+ years of experience at Fortune 500 companies. 
                  Passionate about transforming recruitment through technology.
                </p>
                <div className="flex gap-3">
                  <a href="#" className="text-gray-400 hover:text-purple-400">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-purple-400">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-purple-400">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Sarah Johnson" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">Sarah Johnson</h3>
                <p className="text-purple-400 text-sm mb-4">Co-Founder & CTO</p>
                <p className="text-gray-400 mb-4">
                  AI researcher with a PhD in Machine Learning. Previously led AI teams at top tech companies. 
                  Expert in natural language processing and predictive analytics.
                </p>
                <div className="flex gap-3">
                  <a href="#" className="text-gray-400 hover:text-purple-400">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-purple-400">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-purple-400">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="David Rodriguez" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">David Rodriguez</h3>
                <p className="text-purple-400 text-sm mb-4">Chief Product Officer</p>
                <p className="text-gray-400 mb-4">
                  Product visionary with experience at leading tech companies. 
                  Focused on creating intuitive, powerful solutions that solve real business problems.
                </p>
                <div className="flex gap-3">
                  <a href="#" className="text-gray-400 hover:text-purple-400">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-purple-400">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-purple-400">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="bg-purple-900/50 text-purple-300 mb-4">ACHIEVEMENTS</Badge>
            <h2 className="text-3xl font-bold mb-4">Our Journey So Far</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We're proud of what we've accomplished in a short time, but we're just getting started.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-900 border-gray-800 p-6">
              <div className="h-12 w-12 rounded-full bg-purple-900/30 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-purple-400" />
              </div>
              <div className="flex items-center mb-4">
                <div>
                  <h3 className="font-semibold text-lg">AI Innovation Award</h3>
                  <p className="text-sm text-gray-400">2023</p>
                </div>
              </div>
              <p className="text-gray-400">
                Named one of the top 50 companies leveraging AI to solve real-world business problems by AI Business Magazine.
              </p>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800 p-6">
              <div className="h-12 w-12 rounded-full bg-purple-900/30 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-purple-400" />
              </div>
              <div className="flex items-center mb-4">
                <div>
                  <h3 className="font-semibold text-lg">10,000+ Customers</h3>
                  <p className="text-sm text-gray-400">2024</p>
                </div>
              </div>
              <p className="text-gray-400">
                Reached the milestone of 10,000 companies using our platform to transform their recruitment process.
              </p>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800 p-6">
              <div className="h-12 w-12 rounded-full bg-purple-900/30 flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-purple-400" />
              </div>
              <div className="flex items-center mb-4">
                <div>
                  <h3 className="font-semibold text-lg">Global Expansion</h3>
                  <p className="text-sm text-gray-400">2022</p>
                </div>
              </div>
              <p className="text-gray-400">
                Expanded our operations to 15 countries, with offices in San Francisco, London, and Singapore.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="bg-purple-900/50 text-purple-300 mb-4">PARTNERS</Badge>
            <h2 className="text-3xl font-bold mb-4">Trusted by Industry Leaders</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We're proud to partner with some of the world's most innovative companies.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            <div className="flex justify-center">
              <div className="h-16 w-32 bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-gray-400">TechCorp</span>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="h-16 w-32 bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-gray-400">InnovateCo</span>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="h-16 w-32 bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-gray-400">FutureTech</span>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="h-16 w-32 bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-gray-400">GlobalHR</span>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="h-16 w-32 bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-gray-400">NextGen</span>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="h-16 w-32 bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-gray-400">DataFlow</span>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="h-16 w-32 bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-gray-400">AIVentures</span>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="h-16 w-32 bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-gray-400">SmartHire</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900/30 to-blue-900/30">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Join us in transforming recruitment</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Ready to experience the future of recruitment? Get started with our AI-powered platform today.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button className="bg-purple-600 hover:bg-purple-700">
              Get Started
            </Button>
            <Button variant="outline" className="border-purple-600 text-purple-400">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

export default About;