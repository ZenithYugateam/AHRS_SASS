import React from 'react';
import { Menu, X, Building2, Save, Pencil, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onNavToggle: () => void;
  onSave: () => void;
  isEditing: boolean;
  toggleEditMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavToggle, onSave, isEditing, toggleEditMode }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-slate-900/90 backdrop-blur-md p-4 flex justify-between items-center border-b border-indigo-500/30 shadow-md relative z-50">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/company-dashboard')}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors duration-300"
        >
          <ArrowLeft size={16} className="text-indigo-500" />
          <span className="hidden sm:inline">Back to Dashboard</span>
        </button>

        <div className="flex items-center space-x-2">
          <Building2 className="h-6 w-6 text-indigo-500" />
          <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
            Company Profile
          </h1>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <button
          onClick={toggleEditMode}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors duration-300"
        >
          <Pencil size={16} className="text-indigo-500" />
          <span className="hidden md:inline">{isEditing ? 'Preview' : 'Edit'}</span>
        </button>

        <button 
          onClick={onSave}
          className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 px-4 md:px-6 py-2 rounded-lg transition-all duration-300 font-medium shadow-[0_0_20px_rgba(99,102,241,0.15)] hover:shadow-[inset_0_2px_4px_rgba(99,102,241,0.05)]"
        >
          <Save size={20} />
          <span className="hidden md:inline">Save Profile</span>
        </button>

        <button 
          className="md:hidden text-indigo-500 p-2 hover:bg-indigo-500/10 rounded-lg transition-colors duration-300"
          onClick={onNavToggle}
        >
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
};

export default Header;