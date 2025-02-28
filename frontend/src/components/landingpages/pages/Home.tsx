import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Avatar } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Separator } from '../components/ui/separator';
import { 
  BrainCircuit, 
  Users, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';

function Home() {
  const [email, setEmail] = useState('');

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
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6">
              <Badge className="bg-purple-900/50 text-purple-300 mb-4">AI-Powered Recruitment</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                AI Automated HR <span className="text-purple-500">Recruitment</span> Platform
              </h1>
              <p className="text-gray-400 text-lg">
                Transform your hiring process with our AI-powered platform. Streamline candidate screening, automate interviews, and make data-driven decisions.
              </p>
              <div className="flex gap-4 pt-4">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Get Started
                </Button>
                <Button variant="outline" className="border-purple-600 text-purple-400">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="max-w-md mx-auto md:max-w-full">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                  alt="AI Recruitment" 
                  className="rounded-lg shadow-2xl border border-purple-900/50 h-[300px] md:h-[400px] lg:h-[500px] object-cover w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <Badge className="bg-purple-900/50 text-purple-300 mb-4">WHAT WE DO</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Empowering businesses to hire smarter, faster</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our AI-powered platform streamlines the entire recruitment process, 
              saving you time and resources while finding your top candidates.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-900 border-gray-800 p-6 hover:border-purple-600 transition-colors">
              <div className="h-12 w-12 rounded-full bg-purple-900/30 flex items-center justify-center mb-4">
                <BrainCircuit className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Matching</h3>
              <p className="text-gray-400">
                Our advanced algorithms match candidates to your requirements with unprecedented accuracy.
              </p>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800 p-6 hover:border-purple-600 transition-colors">
              <div className="h-12 w-12 rounded-full bg-purple-900/30 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Candidate Assessments</h3>
              <p className="text-gray-400">
                Automatically evaluate skills and qualifications to find the perfect fit for your team.
              </p>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800 p-6 hover:border-purple-600 transition-colors">
              <div className="h-12 w-12 rounded-full bg-purple-900/30 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Data-Driven Insights</h3>
              <p className="text-gray-400">
                Make informed decisions with comprehensive analytics and reporting tools.
              </p>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Button className="bg-purple-600 hover:bg-purple-700">
              Read More <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6">
              <Badge className="bg-purple-900/50 text-purple-300 mb-4">PRODUCT</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                Modernize Your Hiring Approach with Our Next-Gen Recruitment Tool
              </h2>
              <p className="text-gray-400">
                Our platform is bringing together the hiring process with AI-powered insights, from sourcing to hiring and beyond.
              </p>
              
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-500" />
                  <span>Automated candidate screening</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-500" />
                  <span>Intelligent matching algorithms</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-500" />
                  <span>Customizable assessments</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-500" />
                  <span>Real-time insights</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg opacity-30 blur-xl"></div>
                <Card className="bg-gray-900 border-gray-800 relative z-10">
                  <img 
                    src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                    alt="Platform Dashboard" 
                    className="rounded-t-lg w-full h-[250px] md:h-[300px] lg:h-[350px] object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">AHRS Dashboard</h3>
                    <p className="text-gray-400">
                      Our intuitive dashboard gives you a complete overview of your recruitment pipeline.
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6 hover:bg-gray-900 transition-colors rounded-lg">
              <p className="text-4xl md:text-5xl font-bold text-purple-500">93%</p>
              <p className="text-gray-400 mt-2">Hiring Success Rate</p>
            </div>
            <div className="p-6 hover:bg-gray-900 transition-colors rounded-lg">
              <p className="text-4xl md:text-5xl font-bold text-purple-500">75%</p>
              <p className="text-gray-400 mt-2">Time Saved</p>
            </div>
            <div className="p-6 hover:bg-gray-900 transition-colors rounded-lg">
              <p className="text-4xl md:text-5xl font-bold text-purple-500">10,000+</p>
              <p className="text-gray-400 mt-2">Candidates Placed</p>
            </div>
            <div className="p-6 hover:bg-gray-900 transition-colors rounded-lg">
              <p className="text-4xl md:text-5xl font-bold text-purple-500">500+</p>
              <p className="text-gray-400 mt-2">Happy Clients</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <Badge className="bg-purple-900/50 text-purple-300 mb-4">TESTIMONIALS</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What our clients are saying?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-900 border-gray-800 p-6 hover:border-purple-600 transition-colors">
              <div className="flex items-center mb-4">
                <Avatar className="h-10 w-10 mr-4">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80" alt="Sarah Johnson" />
                </Avatar>
                <div>
                  <p className="font-semibold">Sarah Johnson</p>
                  <p className="text-sm text-gray-400">HR Director, TechCorp</p>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "This platform has revolutionized our hiring process. We've reduced time-to-hire by 60% and found better quality candidates."
              </p>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800 p-6 hover:border-purple-600 transition-colors">
              <div className="flex items-center mb-4">
                <Avatar className="h-10 w-10 mr-4">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80" alt="David Chen" />
                </Avatar>
                <div>
                  <p className="font-semibold">David Chen</p>
                  <p className="text-sm text-gray-400">CEO, StartupX</p>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "As a fast-growing startup, we needed to scale our team quickly without sacrificing quality. This tool made it possible."
              </p>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800 p-6 hover:border-purple-600 transition-colors">
              <div className="flex items-center mb-4">
                <Avatar className="h-10 w-10 mr-4">
                  <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80" alt="Michelle Rodriguez" />
                </Avatar>
                <div>
                  <p className="font-semibold">Michelle Rodriguez</p>
                  <p className="text-sm text-gray-400">Talent Acquisition, Enterprise Inc</p>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "The AI matching capabilities are incredible. We're consistently finding candidates who are not just qualified but also perfect cultural fits."
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900/30 to-blue-900/30">
        <div className="container mx-auto px-6 max-w-7xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Simplifying recruitment with innovation</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Ready to transform your hiring process? Get started with our AI-powered recruitment platform today.
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Enter your email address" 
                className="bg-gray-800 border-gray-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button className="bg-purple-600 hover:bg-purple-700 whitespace-nowrap">
                Get in touch
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;