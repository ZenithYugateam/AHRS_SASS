import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import HelpButton from './components/HelpButton';
import Dashboard from './pages/Dashboard';
import PricingPage from './pages/PricingPage';
import RevenuePage from './pages/RevenuePage';
import CustomersPage from './pages/CustomersPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';

function Admindashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [pricingPlans, setPricingPlans] = useState([
    { id: 1, name: 'Basic Plan', duration: 10, tokensPerMinute: 100, tokens: 1000, price: 29.99, subscribers: 42, revenue: 1259.58 },
    { id: 2, name: 'Standard Plan', duration: 30, tokensPerMinute: 120, tokens: 3000, price: 79.99, subscribers: 28, revenue: 2239.72 },
    { id: 3, name: 'Premium Plan', duration: 60, tokensPerMinute: 150, tokens: 9000, price: 149.99, subscribers: 16, revenue: 2399.84 },
  ]);
  const [showAddPricingForm, setShowAddPricingForm] = useState(false);
  const [timeFilter, setTimeFilter] = useState('month');

  const handleAddPlan = (newPlan: { name: any; duration: any; tokensPerMinute: any; tokens: any; price: any; id?: number; subscribers?: number; revenue?: number; }) => {
    if (newPlan.name && newPlan.duration > 0 && newPlan.tokensPerMinute > 0 && newPlan.tokens > 0 && newPlan.price > 0) {
      setPricingPlans([...pricingPlans, { 
        ...newPlan, 
        id: pricingPlans.length + 1,
        subscribers: 0,
        revenue: 0
      }]);
      setShowAddPricingForm(false);
    }
  };

  const handleDeletePlan = (id: number) => {
    setPricingPlans(pricingPlans.filter(plan => plan.id !== id));
  };

  const navigateToPricing = () => {
    setActiveTab('pricing');
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />
        
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-900 p-6">
          {activeTab === 'dashboard' && (
            <Dashboard 
              pricingPlans={pricingPlans}
              timeFilter={timeFilter}
              setTimeFilter={setTimeFilter}
              navigateToPricing={navigateToPricing}
            />
          )}
          
          {activeTab === 'pricing' && (
            <PricingPage 
              pricingPlans={pricingPlans}
              showAddPricingForm={showAddPricingForm}
              setShowAddPricingForm={setShowAddPricingForm}
              handleAddPlan={handleAddPlan}
              handleDeletePlan={handleDeletePlan}
            />
          )}
          
          {activeTab === 'revenue' && (
            <RevenuePage pricingPlans={pricingPlans} />
          )}
          
          {activeTab === 'customers' && (
            <CustomersPage />
          )}
          
          {activeTab === 'analytics' && (
            <AnalyticsPage />
          )}
          
          {activeTab === 'settings' && (
            <SettingsPage />
          )}
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
      
      {/* Help Button */}
      <HelpButton />
    </div>
  );
}

export default Admindashboard;