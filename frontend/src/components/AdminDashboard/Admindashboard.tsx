import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import Sidebar from './components/Sidebar';
// import Header from './components/Header';
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
    { id: 1, name: 'GENBASIC', duration: 900, tokensPerMinute: 100, tokens: 1000, price: 30.00, subscribers: 0, revenue: 0 },
    { id: 2, name: 'new', duration: 30, tokensPerMinute: 100, tokens: 1000, price: 39.00, subscribers: 0, revenue: 0 },
    { id: 3, name: 'Elite', duration: 30, tokensPerMinute: 100, tokens: 3000, price: 899.00, subscribers: 0, revenue: 0 },
    { id: 4, name: 'premium', duration: 30, tokensPerMinute: 30, tokens: 30, price: 30.00, subscribers: 0, revenue: 0 },
    { id: 5, name: 'basic plans', duration: 434, tokensPerMinute: 3434, tokens: 3434, price: 39.96, subscribers: 3, revenue: 0 },
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

  const handleLogout = () => {
    // Add logout logic here (e.g., clear auth token, redirect to login page)
    console.log('Logging out...');
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        {/* <Header /> */}
        
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

          {activeTab === 'logout' && (
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