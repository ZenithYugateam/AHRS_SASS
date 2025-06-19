import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Briefcase, 
  Lock,
  Mail,
  Phone,
  BookOpen,
  Clock,
  ArrowLeft,
  Pencil,
  Save,
  X,
  Menu,
  GraduationCap,
  Building2,
  Calendar,
  Trash2,
  Plus
} from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase';

// Interfaces for our profile, education and work experience data
interface UserProfileData {
  username: string;
  email: string;
  phoneNumber?: string;
  role?: string;
  bio?: string;
  jobPreferences?: string[]; // Array of tags
}

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

// Extended interface to include education and work experience (if stored in session)
interface ExtendedUserProfileData extends UserProfileData {
  education?: Education[];
  workExperience?: WorkExperience[];
}

// Custom TagsInput component for editing job preferences
function TagsInput({ tags, setTags }: { tags: string[]; setTags: (tags: string[]) => void }) {
  const [inputValue, setInputValue] = useState('');
  const addTag = () => {
    const newTag = inputValue.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setInputValue('');
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  return (
    <div className="flex flex-wrap gap-2 border border-gray-600 p-2 rounded-md bg-[#1a1a1a]">
      {tags.map((tag, index) => (
        <div key={index} className="bg-purple-600 text-white px-2 py-1 rounded-md flex items-center">
          {tag}
          <button type="button" onClick={() => removeTag(tag)} className="ml-1 text-xs">x</button>
        </div>
      ))}
      <input 
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add tag and press Enter"
        className="bg-transparent outline-none text-white"
      />
    </div>
  );
}

// Reusable field components (view and edit) following the candidate dashboard style
const ViewField = ({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) => (
  <div className="space-y-2 bg-[#1a1a1a] p-4 rounded-lg border border-gray-800">
    <label className="flex items-center space-x-2 text-sm font-medium text-gray-400">
      <Icon size={16} />
      <span>{label}</span>
    </label>
    <div className="text-white font-medium break-words">{value}</div>
  </div>
);

const EditField = ({ label, value, onChange, icon: Icon, type = "text" }: { 
  label: string; 
  value: string; 
  onChange: (v: string) => void; 
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

// Sidebar Tab Button component
const TabButton = ({ id, icon: Icon, label, activeTab, onClick } : { 
  id: string; 
  icon: React.ElementType; 
  label: string; 
  activeTab: string; 
  onClick: (id: string) => void;
}) => (
  <button
    onClick={() => onClick(id)}
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

function UserProfileDashboard() {
  const navigate = useNavigate();
  // Define which tab is active; available options: profile, education, work, password
  const [activeTab, setActiveTab] = useState<'profile' | 'education' | 'work' | 'password'>('profile');
  const [isEditing, setIsEditing] = useState(false);

  // States for user profile data, education and work experience
  const [userData, setUserData] = useState<ExtendedUserProfileData | null>(null);
  const [profileForm, setProfileForm] = useState<ExtendedUserProfileData | null>(null);
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [workExperienceList, setWorkExperienceList] = useState<WorkExperience[]>([]);

  // Load user data (and education/work arrays if available) from session storage on mount
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed: ExtendedUserProfileData = JSON.parse(storedUser);
        setUserData(parsed);
        setProfileForm(parsed); // Pre-fill the profile form with stored data
        if (parsed.education) setEducationList(parsed.education);
        if (parsed.workExperience) setWorkExperienceList(parsed.workExperience);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
      }
    }
  }, []);

  // Functions to update profile form data
  const handleInputChange = (field: keyof UserProfileData, value: string) => {
    if (profileForm) {
      setProfileForm({ ...profileForm, [field]: value });
    }
  };

  const handleJobPreferencesChange = (tags: string[]) => {
    if (profileForm) {
      setProfileForm({ ...profileForm, jobPreferences: tags });
    }
  };

  // Education state updates
  const addEducation = () => {
    setEducationList([
      ...educationList,
      { id: Date.now().toString(), degree: '', institution: '', graduationYear: '', fieldOfStudy: '' }
    ]);
  };

  const removeEducation = (id: string) => {
    if (educationList.length > 0) {
      setEducationList(educationList.filter(edu => edu.id !== id));
    }
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducationList(educationList.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  // Work Experience state updates
  const addWorkExperience = () => {
    setWorkExperienceList([
      ...workExperienceList,
      { id: Date.now().toString(), jobTitle: '', company: '', startDate: '', endDate: '', description: '' }
    ]);
  };

  const removeWorkExperience = (id: string) => {
    if (workExperienceList.length > 0) {
      setWorkExperienceList(workExperienceList.filter(work => work.id !== id));
    }
  };

  const updateWorkExperience = (id: string, field: keyof WorkExperience, value: string) => {
    setWorkExperienceList(workExperienceList.map(work => 
      work.id === id ? { ...work, [field]: value } : work
    ));
  };

  // Save all changes to Firestore and update session storage (profile, education, and work experience)
  const handleSave = async () => {
    if (profileForm) {
      try {
        const userId = sessionStorage.getItem('uid');
        if (userId) {
          await updateDoc(doc(db, 'users', userId), {
            username: profileForm.username ?? '',
            phoneNumber: profileForm.phoneNumber ?? '',
            bio: profileForm.bio ?? '',
            jobPreferences: profileForm.jobPreferences ?? [],
            education: educationList,
            workExperience: workExperienceList
          });
          const updatedUserData = { 
            ...profileForm, 
            education: educationList, 
            workExperience: workExperienceList 
          };
          sessionStorage.setItem('user', JSON.stringify(updatedUserData));
          setUserData(updatedUserData);
          setIsEditing(false);
          alert('Profile updated successfully!');
        } else {
          alert('User not logged in.');
        }
      } catch (error: any) {
        console.error('Error updating profile:', error);
        alert('There was an error updating your profile. Please try again.');
      }
    }
  };

  const handleCancel = () => {
    // Reset all changes by re-loading from userData
    setProfileForm(userData);
    setIsEditing(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('uid');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="bg-black text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </button>
            <h1 className="text-xl sm:text-2xl font-bold">User Profile</h1>
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
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-[#111111] rounded-lg shadow-lg flex flex-col md:flex-row border border-gray-800">
          {/* Mobile Menu Button */}
          <button
            onClick={() =>
              setActiveTab(
                activeTab === 'profile'
                  ? 'education'
                  : activeTab === 'education'
                  ? 'work'
                  : activeTab === 'work'
                  ? 'password'
                  : 'profile'
              )
            }
            className="md:hidden flex items-center space-x-2 p-4 text-gray-400 hover:text-purple-400"
          >
            <Menu size={24} />
            <span>
              {activeTab === 'profile'
                ? 'Profile'
                : activeTab === 'education'
                ? 'Education'
                : activeTab === 'work'
                ? 'Work Experience'
                : 'Password Settings'}
            </span>
          </button>
          {/* Sidebar */}
          <div className="hidden md:block w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-800">
            <TabButton 
              id="profile"
              icon={User}
              label="Profile"
              activeTab={activeTab}
              onClick={setActiveTab}
            />
            <TabButton 
              id="education"
              icon={GraduationCap}
              label="Education"
              activeTab={activeTab}
              onClick={setActiveTab}
            />
            <TabButton 
              id="work"
              icon={Briefcase}
              label="Work Experience"
              activeTab={activeTab}
              onClick={setActiveTab}
            />
            <TabButton 
              id="password"
              icon={Lock}
              label="Password Settings"
              activeTab={activeTab}
              onClick={setActiveTab}
            />
          </div>
          {/* Content Area */}
          <div className="flex-1 p-4 sm:p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Profile Details</h2>
                {profileForm ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {isEditing ? (
                      <>
                        <EditField
                          label="Username"
                          value={profileForm.username}
                          onChange={(value) => handleInputChange('username', value)}
                          icon={User}
                        />
                        <ViewField
                          label="Email"
                          value={profileForm.email}
                          icon={Mail}
                        />
                        <EditField
                          label="Phone Number"
                          value={profileForm.phoneNumber || ''}
                          onChange={(value) => handleInputChange('phoneNumber', value)}
                          icon={Phone}
                        />
                        <ViewField
                          label="Role"
                          value={profileForm.role || ''}
                          icon={Briefcase}
                        />
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
                            <BookOpen size={16} />
                            <span>Bio</span>
                          </label>
                          <textarea
                            value={profileForm.bio || ''}
                            onChange={(e) => handleInputChange('bio', e.target.value)}
                            className="w-full p-2 bg-[#1a1a1a] border border-gray-700 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white"
                            rows={3}
                          />
                        </div>
                        <div>
                          <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
                            <Clock size={16} />
                            <span>Job Preferences</span>
                          </label>
                          <TagsInput
                            tags={profileForm.jobPreferences || []}
                            setTags={handleJobPreferencesChange}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <ViewField
                          label="Username"
                          value={profileForm.username}
                          icon={User}
                        />
                        <ViewField
                          label="Email"
                          value={profileForm.email}
                          icon={Mail}
                        />
                        {profileForm.phoneNumber && (
                          <ViewField
                            label="Phone Number"
                            value={profileForm.phoneNumber}
                            icon={Phone}
                          />
                        )}
                        <ViewField
                          label="Role"
                          value={profileForm.role || ''}
                          icon={Briefcase}
                        />
                        {profileForm.bio && (
                          <div className="space-y-2 bg-[#1a1a1a] p-4 rounded-lg border border-gray-800">
                            <label className="flex items-center space-x-2 text-sm font-medium text-gray-400">
                              <BookOpen size={16} />
                              <span>Bio</span>
                            </label>
                            <div className="text-white font-medium break-words">{profileForm.bio}</div>
                          </div>
                        )}
                        {profileForm.jobPreferences && profileForm.jobPreferences.length > 0 && (
                          <div className="space-y-2">
                            <label className="flex items-center space-x-2 text-sm font-medium text-gray-400">
                              <Clock size={16} />
                              <span>Job Preferences</span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {profileForm.jobPreferences.map((tag, index) => (
                                <span key={index} className="bg-purple-600 text-white px-2 py-1 rounded-md">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <p className="text-white">No profile data available.</p>
                )}
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
                {educationList.map((edu) => (
                  <div key={edu.id} className="space-y-6 bg-[#1a1a1a] p-4 sm:p-6 rounded-lg relative border border-gray-800">
                    {isEditing && educationList.length > 0 && (
                      <button
                        onClick={() => removeEducation(edu.id)}
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
                            value={edu.degree}
                            onChange={(val) => updateEducation(edu.id, 'degree', val)}
                            icon={GraduationCap}
                          />
                          <EditField
                            label="Institution"
                            value={edu.institution}
                            onChange={(val) => updateEducation(edu.id, 'institution', val)}
                            icon={Building2}
                          />
                          <EditField
                            label="Graduation Year"
                            value={edu.graduationYear}
                            onChange={(val) => updateEducation(edu.id, 'graduationYear', val)}
                            icon={Calendar}
                            type="number"
                          />
                          <EditField
                            label="Field of Study"
                            value={edu.fieldOfStudy}
                            onChange={(val) => updateEducation(edu.id, 'fieldOfStudy', val)}
                            icon={BookOpen}
                          />
                        </>
                      ) : (
                        <>
                          <ViewField label="Degree" value={edu.degree} icon={GraduationCap} />
                          <ViewField label="Institution" value={edu.institution} icon={Building2} />
                          <ViewField label="Graduation Year" value={edu.graduationYear} icon={Calendar} />
                          <ViewField label="Field of Study" value={edu.fieldOfStudy} icon={BookOpen} />
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
                {workExperienceList.map((work) => (
                  <div key={work.id} className="space-y-6 bg-[#1a1a1a] p-4 sm:p-6 rounded-lg relative border border-gray-800">
                    {isEditing && workExperienceList.length > 0 && (
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
                            onChange={(val) => updateWorkExperience(work.id, 'jobTitle', val)}
                            icon={Briefcase}
                          />
                          <EditField
                            label="Company"
                            value={work.company}
                            onChange={(val) => updateWorkExperience(work.id, 'company', val)}
                            icon={Building2}
                          />
                          <EditField
                            label="Start Date"
                            value={work.startDate}
                            onChange={(val) => updateWorkExperience(work.id, 'startDate', val)}
                            icon={Calendar}
                            type="date"
                          />
                          <EditField
                            label="End Date"
                            value={work.endDate}
                            onChange={(val) => updateWorkExperience(work.id, 'endDate', val)}
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
        {/* Logout Button */}
        <div className="mt-4 flex justify-end space-x-4">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserProfileDashboard;
