import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/landingpages/components/ui/card';
import { Button } from '../components/landingpages/components/ui/button';
import { User, ArrowLeft } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase';

interface UserProfileData {
  username: string;
  email: string;
  phoneNumber?: string;
  role?: string;
  bio?: string;
  jobPreferences?: string[]; // An array of tags
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
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-wrap gap-2 border border-gray-600 p-2 rounded-md bg-gray-800">
      {tags.map((tag, index) => (
        <div key={index} className="bg-purple-600 text-white px-2 py-1 rounded-md flex items-center">
          {tag}
          <button type="button" onClick={() => removeTag(tag)} className="ml-1 text-xs">
            x
          </button>
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

function UserProfile() {
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState<UserProfileData | null>(null);
  const navigate = useNavigate();

  // Load user data from session storage on mount
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser: UserProfileData = JSON.parse(storedUser);
        setUserData(parsedUser);
        setProfileForm(parsedUser); // Pre-fill form with existing data
      } catch (error) {
        console.error('Error parsing user data from session storage:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('uid');
    navigate('/');
  };

  const handleInputChange = (field: keyof UserProfileData, value: string) => {
    if (profileForm) {
      setProfileForm({ ...profileForm, [field]: value });
    }
  };

  // Update jobPreferences array using the TagsInput component
  const handleJobPreferencesChange = (tags: string[]) => {
    if (profileForm) {
      setProfileForm({ ...profileForm, jobPreferences: tags });
    }
  };

  const handleSave = async () => {
    if (profileForm) {
      try {
        // Fetch the current user's UID from session storage
        const userId = sessionStorage.getItem('uid');
        if (userId) {
          // Update Firestore document with default values if any field is undefined
          await updateDoc(doc(db, 'users', userId), {
            username: profileForm.username ?? '',
            phoneNumber: profileForm.phoneNumber ?? '',
            bio: profileForm.bio ?? '',
            jobPreferences: profileForm.jobPreferences ?? [],
          });
          // Update session storage with the new profile data
          sessionStorage.setItem('user', JSON.stringify(profileForm));
          if (profileForm.email) {
            sessionStorage.setItem(profileForm.email, JSON.stringify(profileForm));
          }
          setUserData(profileForm);
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
  
  return (
    <div className="min-h-screen bg-[#0F0B1E] flex items-center justify-center p-6">
      <Card className="max-w-md w-full p-6 bg-gray-900 border-gray-800">
        <div className="flex items-center mb-4">
          <User className="h-10 w-10 text-purple-500 mr-3" />
          <h2 className="text-2xl font-bold text-white">User Profile</h2>
        </div>

        {userData ? (
          <div className="space-y-4">
            {/* Email (read-only) */}
            <div>
              <p className="text-gray-400">Email:</p>
              <p className="text-white">{userData.email}</p>
            </div>

            {isEditing ? (
              <>
                <div>
                  <label className="text-gray-400">Username:</label>
                  <input
                    type="text"
                    value={profileForm?.username || ''}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className="w-full p-2 rounded-md bg-gray-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-400">Phone Number:</label>
                  <input
                    type="text"
                    value={profileForm?.phoneNumber || ''}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className="w-full p-2 rounded-md bg-gray-800 text-white"
                  />
                </div>
                {/* Role is read-only */}
                <div>
                  <label className="text-gray-400">Role:</label>
                  <p className="text-white">{userData.role}</p>
                </div>
                <div>
                  <label className="text-gray-400">Bio:</label>
                  <textarea
                    value={profileForm?.bio || ''}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className="w-full p-2 rounded-md bg-gray-800 text-white"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-gray-400">Job Preferences:</label>
                  <TagsInput
                    tags={profileForm?.jobPreferences || []}
                    setTags={handleJobPreferencesChange}
                  />
                </div>
                <div className="flex space-x-4">
                  <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                    Save
                  </Button>
                  <Button onClick={() => setIsEditing(false)} className="bg-gray-600 hover:bg-gray-700">
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-gray-400">Username:</p>
                  <p className="text-white">{userData.username}</p>
                </div>
                {userData.phoneNumber && (
                  <div>
                    <p className="text-gray-400">Phone Number:</p>
                    <p className="text-white">{userData.phoneNumber}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-400">Role:</p>
                  <p className="text-white">{userData.role}</p>
                </div>
                {userData.bio && (
                  <div>
                    <p className="text-gray-400">Bio:</p>
                    <p className="text-white">{userData.bio}</p>
                  </div>
                )}
                {userData.jobPreferences && userData.jobPreferences.length > 0 && (
                  <div>
                    <p className="text-gray-400">Job Preferences:</p>
                    <div className="flex flex-wrap gap-2">
                      {userData.jobPreferences.map((tag, index) => (
                        <span key={index} className="bg-purple-600 text-white px-2 py-1 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex space-x-4">
                  <Button onClick={() => setIsEditing(true)} className="bg-purple-600 hover:bg-purple-700">
                    Edit Profile
                  </Button>
                  <Button onClick={() => navigate(-1)} className="bg-purple-600 hover:bg-purple-700 flex items-center">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
                    Logout
                  </Button>
                </div>
              </>
            )}
          </div>
        ) : (
          <p className="text-white">No user data found.</p>
        )}
      </Card>
    </div>
  );
}

export default UserProfile;
