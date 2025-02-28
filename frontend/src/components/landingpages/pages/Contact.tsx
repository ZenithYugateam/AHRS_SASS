import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  MessageSquare,
  Building2
} from 'lucide-react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      company: '',
      phone: '',
      message: ''
    });
    // Show success message (in a real app, you'd use a toast or other notification)
    alert('Your message has been sent. We will get back to you soon!');
  };

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
          <Badge className="bg-purple-900/50 text-purple-300 mb-4">CONTACT US</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Get in <span className="text-purple-500">Touch</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-8">
            Have questions about our platform? Want to schedule a demo? Our team is here to help you.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
              <p className="text-gray-400 mb-8">
                Fill out the form below and our team will get back to you within 24 hours.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Your Name
                    </label>
                    <Input 
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="bg-gray-900 border-gray-700"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="bg-gray-900 border-gray-700"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium mb-2">
                      Company Name
                    </label>
                    <Input 
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Your Company"
                      className="bg-gray-900 border-gray-700"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <Input 
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (123) 456-7890"
                      className="bg-gray-900 border-gray-700"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Your Message
                  </label>
                  <Textarea 
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help you..."
                    className="bg-gray-900 border-gray-700 min-h-[150px]"
                    required
                  />
                </div>
                
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700 w-full md:w-auto">
                  Send Message
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
              <p className="text-gray-400 mb-8">
                You can also reach out to us directly using the information below.
              </p>
              
              <div className="space-y-6">
                <Card className="bg-gray-900 border-gray-800 p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Email Us</h3>
                      <p className="text-gray-400 mb-2">For general inquiries:</p>
                      <a href="mailto:info@ahrsdigital.com" className="text-purple-400 hover:underline">
                        info@ahrsdigital.com
                      </a>
                      <p className="text-gray-400 mt-2 mb-2">For support:</p>
                      <a href="mailto:support@ahrsdigital.com" className="text-purple-400 hover:underline">
                        support@ahrsdigital.com
                      </a>
                    </div>
                  </div>
                </Card>
                
                <Card className="bg-gray-900 border-gray-800 p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Call Us</h3>
                      <p className="text-gray-400 mb-2">Main Office:</p>
                      <a href="tel:+11234567890" className="text-purple-400 hover:underline">
                        +1 (123) 456-7890
                      </a>
                      <p className="text-gray-400 mt-2 mb-2">Support Hotline:</p>
                      <a href="tel:+18001234567" className="text-purple-400 hover:underline">
                        +1 (800) 123-4567
                      </a>
                    </div>
                  </div>
                </Card>
                
                <Card className="bg-gray-900 border-gray-800 p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Visit Us</h3>
                      <p className="text-gray-400 mb-2">Headquarters:</p>
                      <p className="text-white">
                        123 Tech Street<br />
                        San Francisco, CA 94107<br />
                        United States
                      </p>
                    </div>
                  </div>
                </Card>
                
                <Card className="bg-gray-900 border-gray-800 p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Business Hours</h3>
                      <p className="text-gray-400 mb-2">Monday - Friday:</p>
                      <p className="text-white mb-2">9:00 AM - 6:00 PM (PST)</p>
                      <p className="text-gray-400 mb-2">Saturday - Sunday:</p>
                      <p className="text-white">Closed</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="bg-purple-900/50 text-purple-300 mb-4">FAQ</Badge>
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Find quick answers to common questions about contacting us and our support services.
            </p>
           </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-gray-900 border-gray-800 p-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-400" />
                How quickly will I receive a response?
              </h3>
              <p className="text-gray-400">
                We aim to respond to all inquiries within 24 hours during business days. For urgent matters, 
                please use our support hotline for immediate assistance.
              </p>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800 p-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-400" />
                Do you offer technical support?
              </h3>
              <p className="text-gray-400">
                Yes, we provide technical support for all our customers. The level of support depends on your 
                subscription plan. Please check our pricing page for more details.
              </p>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800 p-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-400" />
                Can I schedule a demo?
              </h3>
              <p className="text-gray-400">
                Absolutely! You can request a demo by filling out the contact form or by emailing us directly 
                at sales@ahrsdigital.com. We'll be happy to show you how our platform can help your business.
              </p>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800 p-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-400" />
                Do you have international support?
              </h3>
              <p className="text-gray-400">
                Yes, we provide support to customers worldwide. While our main office is in San Francisco, 
                we have support staff in multiple time zones to ensure timely assistance for all our customers.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg opacity-30 blur-xl"></div>
            <Card className="bg-gray-900 border-gray-800 relative z-10 overflow-hidden">
              <div className="aspect-video w-full">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0968143067466!2d-122.40058638468173!3d37.78532797975723!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085807ded297e89%3A0x9cdf304c4c9a0e17!2s123%20Main%20St%2C%20San%20Francisco%2C%20CA%2094105!5e0!3m2!1sen!2sus!4v1625612000000!5m2!1sen!2sus" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy"
                  title="AHRS Office Location"
                ></iframe>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900/30 to-blue-900/30">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to transform your recruitment process?</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Get in touch today to learn how our AI-powered platform can help your business hire better candidates faster.
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

export default Contact;