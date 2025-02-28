import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Switch } from '../components/ui/switch';
import { 
  CheckCircle2, 
  XCircle,
  HelpCircle,
  Users,
  Building,
  Building2
} from 'lucide-react';

function Pricing() {
  const [billingCycle, setBillingCycle] = useState('yearly');
  
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
          <Badge className="bg-purple-900/50 text-purple-300 mb-4">PRICING</Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Simple, Transparent <span className="text-purple-500">Pricing</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-8">
            Choose the plan that's right for your business. All plans include full access to our AI-powered recruitment platform.
          </p>
          
          <div className="flex items-center justify-center gap-3 mb-12">
            <span className={`text-sm ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
            <Switch 
              checked={billingCycle === 'yearly'} 
              onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
              className="data-[state=checked]:bg-purple-600"
            />
            <span className={`text-sm ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-400'}`}>
              Yearly <Badge className="ml-1 bg-green-900/50 text-green-300">Save 20%</Badge>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="pb-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <Card className="bg-gray-900 border-gray-800 overflow-hidden hover:border-purple-600 transition-colors">
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-purple-400" />
                  <h3 className="text-xl font-bold">Starter</h3>
                </div>
                <p className="text-gray-400 mb-4">Perfect for small teams and startups</p>
                <div className="flex items-end gap-2 mb-4">
                  <span className="text-4xl font-bold">${billingCycle === 'yearly' ? '79' : '99'}</span>
                  <span className="text-gray-400 mb-1">/month</span>
                </div>
                {billingCycle === 'yearly' && (
                  <Badge className="bg-green-900/50 text-green-300 mb-4">$238 saved yearly</Badge>
                )}
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Get Started
                </Button>
              </div>
              <div className="p-6">
                <p className="font-medium mb-4">Includes:</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Up to 5 active job postings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>AI candidate matching</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Basic resume parsing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Email templates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Standard support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-gray-500 mt-0.5" />
                    <span className="text-gray-400">Advanced analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-gray-500 mt-0.5" />
                    <span className="text-gray-400">Custom workflows</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-gray-500 mt-0.5" />
                    <span className="text-gray-400">API access</span>
                  </li>
                </ul>
              </div>
            </Card>
            
            {/* Professional Plan */}
            <Card className="bg-gray-900 border-gray-800 overflow-hidden relative hover:border-purple-600 transition-colors transform md:scale-105 z-10 shadow-xl">
              <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1">
                MOST POPULAR
              </div>
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <Building className="h-5 w-5 text-purple-400" />
                  <h3 className="text-xl font-bold">Professional</h3>
                </div>
                <p className="text-gray-400 mb-4">Ideal for growing businesses</p>
                <div className="flex items-end gap-2 mb-4">
                  <span className="text-4xl font-bold">${billingCycle === 'yearly' ? '199' : '249'}</span>
                  <span className="text-gray-400 mb-1">/month</span>
                </div>
                {billingCycle === 'yearly' && (
                  <Badge className="bg-green-900/50 text-green-300 mb-4">$600 saved yearly</Badge>
                )}
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Get Started
                </Button>
              </div>
              <div className="p-6">
                <p className="font-medium mb-4">Everything in Starter, plus:</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Up to 20 active job postings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Advanced candidate matching</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Video interview capabilities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Custom application forms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-gray-500 mt-0.5" />
                    <span className="text-gray-400">Dedicated account manager</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-gray-500 mt-0.5" />
                    <span className="text-gray-400">Enterprise integrations</span>
                  </li>
                </ul>
              </div>
            </Card>
            
            {/* Enterprise Plan */}
            <Card className="bg-gray-900 border-gray-800 overflow-hidden hover:border-purple-600 transition-colors">
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="h-5 w-5 text-purple-400" />
                  <h3 className="text-xl font-bold">Enterprise</h3>
                </div>
                <p className="text-gray-400 mb-4">For large organizations with complex needs</p>
                <div className="flex items-end gap-2 mb-4">
                  <span className="text-4xl font-bold">Custom</span>
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Contact Sales
                </Button>
              </div>
              <div className="p-6">
                <p className="font-medium mb-4">Everything in Professional, plus:</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Unlimited job postings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Custom AI model training</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Advanced workflow automation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Dedicated account manager</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Enterprise integrations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Custom reporting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>API access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>24/7 premium support</span>
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <Badge className="bg-purple-900/50 text-purple-300 mb-4">COMPARE PLANS</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Feature Comparison</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Compare our plans to find the perfect fit for your recruitment needs.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-4 px-4">Feature</th>
                  <th className="text-center py-4 px-4">Starter</th>
                  <th className="text-center py-4 px-4">Professional</th>
                  <th className="text-center py-4 px-4">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-4">Active job postings</td>
                  <td className="text-center py-4 px-4">5</td>
                  <td className="text-center py-4 px-4">20</td>
                  <td className="text-center py-4 px-4">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-4">Candidate database</td>
                  <td className="text-center py-4 px-4">500</td>
                  <td className="text-center py-4 px-4">5,000</td>
                  <td className="text-center py-4 px-4">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-4">AI matching</td>
                  <td className="text-center py-4 px-4">Basic</td>
                  <td className="text-center py-4 px-4">Advanced</td>
                  <td className="text-center py-4 px-4">Custom</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-4">Video interviews</td>
                  <td className="text-center py-4 px-4">
                    <XCircle className="h-5 w-5 text-gray-500 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-4">Custom application forms</td>
                  <td className="text-center py-4 px-4">
                    <XCircle className="h-5 w-5 text-gray-500 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-4">Analytics</td>
                  <td className="text-center py-4 px-4">Basic</td>
                  <td className="text-center py-4 px-4">Advanced</td>
                  <td className="text-center py-4 px-4">Custom</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-4">API access</td>
                  <td className="text-center py-4 px-4">
                    <XCircle className="h-5 w-5 text-gray-500 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <XCircle className="h-5 w-5 text-gray-500 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-4">Support</td>
                  <td className="text-center py-4 px-4">Standard</td>
                  <td className="text-center py-4 px-4">Priority</td>
                  <td className="text-center py-4 px-4">24/7 Premium</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <Badge className="bg-purple-900/50 text-purple-300 mb-4">FAQ</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Find answers to common questions about our pricing and plans.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-gray-900 border-gray-800 p-6 hover:border-purple-600 transition-colors">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-purple-400" />
                Can I switch plans later?
              </h3>
              <p className="text-gray-400">
                Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be prorated for the remainder of your billing cycle. When downgrading, changes will take effect at the start of your next billing cycle.
              </p>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800 p-6 hover:border-purple-600 transition-colors">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-purple-400" />
                Is there a free trial?
              </h3>
              <p className="text-gray-400">
                Yes, we offer a 14-day free trial on all plans. No credit card required to start your trial. You can explore all features before making a decision.
              </p>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800 p-6 hover:border-purple-600 transition-colors">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-purple-400" />
                What payment methods do you accept?
              </h3>
              <p className="text-gray-400">
                We accept all major credit cards, including Visa, Mastercard, American Express, and Discover. For Enterprise plans, we also offer invoicing options.
              </p>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800 p-6 hover:border-purple-600 transition-colors">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-purple-400" />
                Can I cancel anytime?
              </h3>
              <p className="text-gray-400">
                Yes, you can cancel your subscription at any time. If you cancel, you'll have access to your plan until the end of your current billing cycle.
              </p>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800 p-6 hover:border-purple-600 transition-colors">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-purple-400" />
                Do you offer discounts for nonprofits?
              </h3>
              <p className="text-gray-400">
                Yes, we offer special pricing for nonprofit organizations. Please contact our sales team for more information.
              </p>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800 p-6 hover:border-purple-600 transition-colors">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-purple-400" />
                What kind of support is included?
              </h3>
              <p className="text-gray-400">
                All plans include access to our help center and email support. Professional plans include priority support, while Enterprise plans include 24/7 premium support and a dedicated account manager.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900/30 to-blue-900/30">
        <div className="container mx-auto px-6 max-w-7xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your recruitment process?</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Start your 14-day free trial today. No credit card required.
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

export default Pricing;