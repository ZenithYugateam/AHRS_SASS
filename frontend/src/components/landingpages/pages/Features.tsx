import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  BrainCircuit, 
  Users, 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Search, 
  MessageSquare, 
  FileText, 
  Briefcase, 
  LineChart, 
  Zap,
  Layers,
  Shield,
  Cpu,
  Database
} from 'lucide-react';

function Features() {
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
        <div className="container mx-auto px-6 max-w-7xl relative z-10 text-center">
          <Badge className="bg-purple-900/50 text-purple-300 mb-4">FEATURES</Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Powerful Features for <span className="text-purple-500">Modern Recruitment</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-8">
            Discover how our AI-powered platform transforms every aspect of your recruitment process, 
            from sourcing to onboarding and beyond.
          </p>
          <div className="flex gap-4 justify-center">
            <Button className="bg-purple-600 hover:bg-purple-700">
              Get Started
            </Button>
            <Button variant="outline" className="border-purple-600 text-purple-400">
              Book a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Categories */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-7xl">
          <Tabs defaultValue="sourcing" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8 bg-gray-900 p-1">
              <TabsTrigger value="sourcing" className="data-[state=active]:bg-purple-600">Sourcing</TabsTrigger>
              <TabsTrigger value="screening" className="data-[state=active]:bg-purple-600">Screening</TabsTrigger>
              <TabsTrigger value="interviewing" className="data-[state=active]:bg-purple-600">Interviewing</TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sourcing" className="mt-6">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">AI-Powered Candidate Sourcing</h2>
                  <p className="text-gray-400 mb-6">
                    Our advanced AI algorithms scan multiple sources to find the perfect candidates for your open positions, 
                    saving you countless hours of manual searching.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <CheckCircle2 className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Multi-channel Sourcing</h3>
                        <p className="text-gray-400">Automatically search across job boards, social networks, and professional databases.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <CheckCircle2 className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Passive Candidate Identification</h3>
                        <p className="text-gray-400">Find qualified candidates who aren't actively job hunting but match your requirements.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <CheckCircle2 className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Talent Pool Building</h3>
                        <p className="text-gray-400">Create and maintain a database of potential candidates for future positions.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg opacity-30 blur-xl"></div>
                  <Card className="bg-gray-900 border-gray-800 relative z-10 overflow-hidden">
                    <div className="max-w-md mx-auto md:max-w-full">
                      <img 
                        src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                        alt="AI Sourcing" 
                        className="w-full h-[250px] md:h-[300px] lg:h-[350px] object-cover"
                      />
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="screening" className="mt-6">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1 relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg opacity-30 blur-xl"></div>
                  <Card className="bg-gray-900 border-gray-800 relative z-10 overflow-hidden">
                    <div className="max-w-md mx-auto md:max-w-full">
                      <img 
                        src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                        alt="AI Screening" 
                        className="w-full h-[250px] md:h-[300px] lg:h-[350px] object-cover"
                      />
                    </div>
                  </Card>
                </div>
                <div className="order-1 md:order-2">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Intelligent Candidate Screening</h2>
                  <p className="text-gray-400 mb-6">
                    Our platform automatically evaluates resumes and applications against your job requirements, 
                    ensuring you only spend time on the most qualified candidates.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <CheckCircle2 className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Resume Parsing</h3>
                        <p className="text-gray-400">Automatically extract and analyze key information from resumes in any format.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <CheckCircle2 className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Skill Assessment</h3>
                        <p className="text-gray-400">Evaluate technical and soft skills through customizable assessments.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <CheckCircle2 className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Automated Ranking</h3>
                        <p className="text-gray-400">Rank candidates based on match percentage to your job requirements.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="interviewing" className="mt-6">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Streamlined Interview Process</h2>
                  <p className="text-gray-400 mb-6">
                    Our platform helps you conduct and evaluate interviews more efficiently, 
                    with AI-assisted question generation and response analysis.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <CheckCircle2 className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Interview Scheduling</h3>
                        <p className="text-gray-400">Automated scheduling that syncs with your calendar and sends reminders.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <CheckCircle2 className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Video Interviews</h3>
                        <p className="text-gray-400">Conduct and record video interviews directly through our platform.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <CheckCircle2 className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">AI Interview Analysis</h3>
                        <p className="text-gray-400">Get insights on candidate responses and communication patterns.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg opacity-30 blur-xl"></div>
                  <Card className="bg-gray-900 border-gray-800 relative z-10 overflow-hidden">
                    <div className="max-w-md mx-auto md:max-w-full">
                      <img 
                        src="https://images.unsplash.com/photo-1560439514-4e9645039924?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                        alt="Interview Process" 
                        className="w-full h-[250px] md:h-[300px] lg:h-[350px] object-cover"
                      />
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-6">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1 relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg opacity-30 blur-xl"></div>
                  <Card className="bg-gray-900 border-gray-800 relative z-10 overflow-hidden">
                    <div className="max-w-md mx-auto md:max-w-full">
                      <img 
                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                        alt="Recruitment Analytics" 
                        className="w-full h-[250px] md:h-[300px] lg:h-[350px] object-cover"
                      />
                    </div>
                  </Card>
                </div>
                <div className="order-1 md:order-2">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Data-Driven Recruitment Analytics</h2>
                  <p className="text-gray-400 mb-6">
                    Gain valuable insights into your recruitment process with comprehensive analytics 
                    that help you make data-driven decisions and continuously improve.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <CheckCircle2 className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Performance Metrics</h3>
                        <p className="text-gray-400">Track key metrics like time-to-hire, cost-per-hire, and source effectiveness.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <CheckCircle2 className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Pipeline Visualization</h3>
                        <p className="text-gray-400">See your entire recruitment funnel and identify bottlenecks.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <CheckCircle2 className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Predictive Insights</h3>
                        <p className="text-gray-400">AI-powered predictions on hiring trends and candidate success factors.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <Badge className="bg-purple-900/50 text-purple-300 mb-4">CORE CAPABILITIES</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need in one platform</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our comprehensive suite of features covers every aspect of the recruitment process,
              helping you find and hire the best talent efficiently.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gray-900 border-gray-800 p-6 hover:border-purple-600 transition-colors">
              <div className="h-12 w-12 rounded-full bg-purple-900/30 flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Search</h3>
              <p className="text-gray-400">
                Advanced search capabilities with filters for skills, experience, location, and more.
              </p>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800 p-6 hover:border-purple-600 transition-colors">
              <div className="h-12 w-12 rounded-full bg-purple-900/30 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Automated Communication</h3>
              <p className="text-gray-400">
                Personalized email templates and automated follow-ups to keep candidates engaged.
              </p>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800 p-6 hover:border-purple-600 transition-colors">
              <div className="h-12 w-12 rounded-full bg-purple-900/30 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Custom Applications</h3>
              <p className="text-gray-400">
                Create tailored application forms to gather the specific information you need.
              </p>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800 p-6 hover:border-purple-600 transition-colors">
              <div className="h-12 w-12 rounded-full bg-purple-900/30 flex items-center justify-center mb-4">
                <Briefcase className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Job Management</h3>
              <p className="text-gray-400">
                Easily create, publish, and manage job listings across multiple channels.
              </p>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800 p-6 hover:border-purple-600 transition-colors">
              <div className="h-12 w-12 rounded-full bg-purple-900/30 flex items-center justify-center mb-4">
                <LineChart className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Performance Tracking</h3>
              <p className="text-gray-400">
                Monitor recruitment KPIs and team performance with customizable dashboards.
              </p>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800 p-6 hover:border-purple-600 transition-colors">
              <div className="h-12 w-12 rounded-full bg-purple-900/30 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Workflow Automation</h3>
              <p className="text-gray-400">
                Automate repetitive tasks and create custom workflows to match your process.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6">
              <Badge className="bg-purple-900/50 text-purple-300 mb-4">TECHNOLOGY</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                Cutting-Edge AI Technology Powering Your Recruitment
              </h2>
              <p className="text-gray-400">
                Our platform leverages the latest advancements in artificial intelligence and machine learning 
                to transform how you find, evaluate, and hire talent.
              </p>
              
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3">
                  <Cpu className="h-5 w-5 text-purple-500" />
                  <span>Advanced machine learning algorithms</span>
                </div>
                <div className="flex items-center gap-3">
                  <Layers className="h-5 w-5 text-purple-500" />
                  <span>Deep learning for resume analysis</span>
                </div>
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-purple-500" />
                  <span>Big data processing capabilities</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-purple-500" />
                  <span>Enterprise-grade security</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg opacity-30 blur-xl"></div>
                <Card className="bg-gray-900 border-gray-800 relative z-10">
                  <img 
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                    alt="AI Technology" 
                    className="rounded-t-lg w-full h-[250px] md:h-[300px] lg:h-[350px] object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">AI-Powered Matching</h3>
                    <p className="text-gray-400">
                      Our proprietary algorithms analyze over 50 data points to find the perfect match between candidates and positions.
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900/30 to-blue-900/30">
        <div className="container mx-auto px-6 max-w-7xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your recruitment process?</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Join thousands of companies that are already using our platform to hire better candidates faster.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button className="bg-purple-600 hover:bg-purple-700">
              Get Started
            </Button>
            <Button variant="outline" className="border-purple-600 text-purple-400">
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

export default Features;