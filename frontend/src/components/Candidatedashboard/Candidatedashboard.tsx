import React, { useState } from 'react';
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Lock,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building2,
  BookOpen,
  Clock,
  Plus,
  Trash2,
  ArrowLeft,
  Pencil,
  Save,
  X,
  Menu
} from 'lucide-react';

interface Education {
  id: string;
  degree: string;
  institution: string;
  graduationYear: string;
  fieldOfStudy: string;
}

interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface PersonalDetails {
  fullName: string;
  email: string;
  phone: string;
  location: string;
}

function Candidatedashboard() {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 000-0000',
    location: 'New York, USA'
  });
  const [educationList, setEducationList] = useState<Education[]>([
    { 
      id: '1', 
      degree: 'Bachelor of Science', 
      institution: 'MIT', 
      graduationYear: '2020', 
      fieldOfStudy: 'Computer Science' 
    }
  ]);
  const [workExperienceList, setWorkExperienceList] = useState<WorkExperience[]>([
    { 
      id: '1', 
      jobTitle: 'Senior Software Engineer', 
      company: 'Google', 
      startDate: '2020-01-01', 
      endDate: '2023-12-31', 
      description: 'Led development of key features for Google Cloud Platform.' 
    }
  ]);

  const TabButton = ({ id, icon: Icon, label }: { id: string; icon: React.ElementType; label: string }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setIsSidebarOpen(false);
      }}
      className={`flex items-center space-x-2 p-4 w-full ${
        activeTab === id 
          ? 'bg-purple-900/20 border-r-4 border-purple-500 text-purple-400' 
          : 'text-gray-400 hover:bg-purple-900/10 hover:text-purple-400'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Here you would typically reset to last saved state
  };

  const ViewField = ({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) => (
    <div className="space-y-2 bg-[#1a1a1a] p-4 rounded-lg border border-gray-800">
      <label className="flex items-center space-x-2 text-sm font-medium text-gray-400">
        <Icon size={16} />
        <span>{label}</span>
      </label>
      <div className="text-white font-medium break-words">{value}</div>
    </div>
  );

  const EditField = ({ 
    label, 
    value, 
    onChange, 
    icon: Icon,
    type = "text"
  }: { 
    label: string; 
    value: string; 
    onChange: (value: string) => void; 
    icon: React.ElementType;
    type?: string;
  }) => (
    <div className="space-y-2">
      <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
        <Icon size={16} />
        <span>{label}</span>
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 bg-[#1a1a1a] border border-gray-700 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white"
      />
    </div>
  );

  const addEducation = () => {
    setEducationList([
      ...educationList,
      { id: Date.now().toString(), degree: '', institution: '', graduationYear: '', fieldOfStudy: '' }
    ]);
  };

  const removeEducation = (id: string) => {
    if (educationList.length > 1) {
      setEducationList(educationList.filter(edu => edu.id !== id));
    }
  };

  const addWorkExperience = () => {
    setWorkExperienceList([
      ...workExperienceList,
      { id: Date.now().toString(), jobTitle: '', company: '', startDate: '', endDate: '', description: '' }
    ]);
  };

  const removeWorkExperience = (id: string) => {
    if (workExperienceList.length > 1) {
      setWorkExperienceList(workExperienceList.filter(work => work.id !== id));
    }
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducationList(educationList.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const updateWorkExperience = (id: string, field: keyof WorkExperience, value: string) => {
    setWorkExperienceList(workExperienceList.map(work => 
      work.id === id ? { ...work, [field]: value } : work
    ));
  };

  const updatePersonalDetail = (field: keyof PersonalDetails, value: string) => {
    setPersonalDetails(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="bg-black text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.history.back()}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                <ArrowLeft size={16} />
                <span className="hidden sm:inline">Back to Dashboard</span>
              </button>
              <h1 className="text-xl sm:text-2xl font-bold">Candidate Profile</h1>
            </div>
            <div className="flex items-center space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    <Save size={16} />
                    <span className="hidden sm:inline">Save Changes</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    <X size={16} />
                    <span className="hidden sm:inline">Cancel</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  <Pencil size={16} />
                  <span className="hidden sm:inline">Edit Profile</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-[#111111] rounded-lg shadow-lg flex flex-col md:flex-row border border-gray-800">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden flex items-center space-x-2 p-4 text-gray-400 hover:text-purple-400"
          >
            <Menu size={24} />
            <span>{activeTab === 'personal' ? 'Personal Details' : 
                   activeTab === 'education' ? 'Education' :
                   activeTab === 'work' ? 'Work Experience' : 'Password Settings'}</span>
          </button>

          {/* Sidebar */}
          <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-800`}>
            <TabButton id="personal" icon={User} label="Personal Details" />
            <TabButton id="education" icon={GraduationCap} label="Education" />
            <TabButton id="work" icon={Briefcase} label="Work Experience" />
            <TabButton id="password" icon={Lock} label="Password Settings" />
          </div>

          {/* Content Area */}
          <div className="flex-1 p-4 sm:p-6">
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Personal Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {isEditing ? (
                    <>
                      <EditField
                        label="Full Name"
                        value={personalDetails.fullName}
                        onChange={(value) => updatePersonalDetail('fullName', value)}
                        icon={User}
                      />
                      <EditField
                        label="Email"
                        value={personalDetails.email}
                        onChange={(value) => updatePersonalDetail('email', value)}
                        icon={Mail}
                        type="email"
                      />
                      <EditField
                        label="Phone"
                        value={personalDetails.phone}
                        onChange={(value) => updatePersonalDetail('phone', value)}
                        icon={Phone}
                        type="tel"
                      />
                      <EditField
                        label="Location"
                        value={personalDetails.location}
                        onChange={(value) => updatePersonalDetail('location', value)}
                        icon={MapPin}
                      />
                    </>
                  ) : (
                    <>
                      <ViewField label="Full Name" value={personalDetails.fullName} icon={User} />
                      <ViewField label="Email" value={personalDetails.email} icon={Mail} />
                      <ViewField label="Phone" value={personalDetails.phone} icon={Phone} />
                      <ViewField label="Location" value={personalDetails.location} icon={MapPin} />
                    </>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'education' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                  <h2 className="text-xl font-semibold text-white">Education Details</h2>
                  {isEditing && (
                    <button
                      onClick={addEducation}
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors w-full sm:w-auto justify-center sm:justify-start"
                    >
                      <Plus size={16} />
                      <span>Add Education</span>
                    </button>
                  )}
                </div>
                {educationList.map((education, index) => (
                  <div key={education.id} className="space-y-6 bg-[#1a1a1a] p-4 sm:p-6 rounded-lg relative border border-gray-800">
                    {isEditing && educationList.length > 1 && (
                      <button
                        onClick={() => removeEducation(education.id)}
                        className="absolute top-4 right-4 text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {isEditing ? (
                        <>
                          <EditField
                            label="Degree"
                            value={education.degree}
                            onChange={(value) => updateEducation(education.id, 'degree', value)}
                            icon={GraduationCap}
                          />
                          <EditField
                            label="Institution"
                            value={education.institution}
                            onChange={(value) => updateEducation(education.id, 'institution', value)}
                            icon={Building2}
                          />
                          <EditField
                            label="Graduation Year"
                            value={education.graduationYear}
                            onChange={(value) => updateEducation(education.id, 'graduationYear', value)}
                            icon={Calendar}
                            type="number"
                          />
                          <EditField
                            label="Field of Study"
                            value={education.fieldOfStudy}
                            onChange={(value) => updateEducation(education.id, 'fieldOfStudy', value)}
                            icon={BookOpen}
                          />
                        </>
                      ) : (
                        <>
                          <ViewField label="Degree" value={education.degree} icon={GraduationCap} />
                          <ViewField label="Institution" value={education.institution} icon={Building2} />
                          <ViewField label="Graduation Year" value={education.graduationYear} icon={Calendar} />
                          <ViewField label="Field of Study" value={education.fieldOfStudy} icon={BookOpen} />
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'work' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                  <h2 className="text-xl font-semibold text-white">Work Experience</h2>
                  {isEditing && (
                    <button
                      onClick={addWorkExperience}
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors w-full sm:w-auto justify-center sm:justify-start"
                    >
                      <Plus size={16} />
                      <span>Add Experience</span>
                    </button>
                  )}
                </div>
                {workExperienceList.map((work, index) => (
                  <div key={work.id} className="space-y-6 bg-[#1a1a1a] p-4 sm:p-6 rounded-lg relative border border-gray-800">
                    {isEditing && workExperienceList.length > 1 && (
                      <button
                        onClick={() => removeWorkExperience(work.id)}
                        className="absolute top-4 right-4 text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {isEditing ? (
                        <>
                          <EditField
                            label="Job Title"
                            value={work.jobTitle}
                            onChange={(value) => updateWorkExperience(work.id, 'jobTitle', value)}
                            icon={Briefcase}
                          />
                          <EditField
                            label="Company"
                            value={work.company}
                            onChange={(value) => updateWorkExperience(work.id, 'company', value)}
                            icon={Building2}
                          />
                          <EditField
                            label="Start Date"
                            value={work.startDate}
                            onChange={(value) => updateWorkExperience(work.id, 'startDate', value)}
                            icon={Calendar}
                            type="date"
                          />
                          <EditField
                            label="End Date"
                            value={work.endDate}
                            onChange={(value) => updateWorkExperience(work.id, 'endDate', value)}
                            icon={Clock}
                            type="date"
                          />
                        </>
                      ) : (
                        <>
                          <ViewField label="Job Title" value={work.jobTitle} icon={Briefcase} />
                          <ViewField label="Company" value={work.company} icon={Building2} />
                          <ViewField label="Start Date" value={new Date(work.startDate).toLocaleDateString()} icon={Calendar} />
                          <ViewField label="End Date" value={new Date(work.endDate).toLocaleDateString()} icon={Clock} />
                        </>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Description</label>
                      {isEditing ? (
                        <textarea
                          className="w-full p-2 bg-[#1a1a1a] border border-gray-700 rounded-md h-32 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white"
                          placeholder="Describe your role and responsibilities..."
                          value={work.description}
                          onChange={(e) => updateWorkExperience(work.id, 'description', e.target.value)}
                        />
                      ) : (
                        <div className="text-white bg-[#1a1a1a] p-4 rounded-lg border border-gray-800">
                          {work.description}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'password' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Password Settings</h2>
                <div className="max-w-md space-y-4">
                  {isEditing ? (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Current Password</label>
                        <input
                          type="password"
                          className="w-full p-2 bg-[#1a1a1a] border border-gray-700 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white"
                          placeholder="Enter current password"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">New Password</label>
                        <input
                          type="password"
                          className="w-full p-2 bg-[#1a1a1a] border border-gray-700 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white"
                          placeholder="Enter new password"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Confirm New Password</label>
                        <input
                          type="password"
                          className="w-full p-2 bg-[#1a1a1a] border border-gray-700 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-800 text-gray-400">
                      Password is securely stored. Click "Edit Profile" to change your password.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Candidatedashboard;