import { useState } from 'react';
import type { FormData } from '../types';

export const useFormData = () => {
  const [formData, setFormData] = useState<FormData>({
    companyProfile: {
      companyId: JSON.parse(sessionStorage.getItem('user') || '{}').username, // Add companyId if needed as the primary key
      name: '',
      logo: '',
      industry: '',
      size: '',
      yearFounded: '',
      description: '',
      headquarters: '',
      officeLocations: [],
      website: '',
      businessType: '',
      products: [],
      targetMarket: '',
      competitors: [],
      revenueRange: '',
      culture: '',
      mission: '',
      vision: '',
      leadership: '',
      achievements: [],
      socialMedia: {
        facebook: '',
        twitter: '',
        linkedin: '',
        instagram: ''
      },
      csrInitiatives: [],
      growthPlans: ''
    }
  });

  const [saveStatus, setSaveStatus] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData(prevData => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value
      }
    }));
    // triggerAutoSave();
  };

  const handleAddTag = (
    section: string,
    field: string,
    value: string,
    inputSetter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (value.trim() !== '') {
      setFormData(prevData => ({
        ...prevData,
        [section]: {
          ...prevData[section],
          [field]: [...prevData[section][field], value.trim()]
        }
      }));
      inputSetter('');
      // triggerAutoSave();
    }
  };

  const handleRemoveTag = (section: string, field: string, index: number) => {
    setFormData(prevData => {
      const newTags = [...prevData[section][field]];
      newTags.splice(index, 1);
      return {
        ...prevData,
        [section]: {
          ...prevData[section],
          [field]: newTags
        }
      };
    });
    // triggerAutoSave();
  };

  const handleLogoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      handleInputChange('companyProfile', 'logo', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const triggerAutoSave = async () => {
    setSaveStatus('Saving...');
    console.log('Saving changes...');

    try {
      const response = await fetch(
        'https://a3ynn4mrji.execute-api.us-east-1.amazonaws.com/default/post_company_profile_details',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      );

      if (response.ok) {
        console.log('Changes saved successfully!', formData);
        setSaveStatus('Changes saved');
      } else {
        const errorData = await response.json();
        console.error('Failed to save changes:', errorData);
        setSaveStatus('Failed to save changes');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      setSaveStatus('Error saving changes');
    }

    setTimeout(() => setSaveStatus(''), 2000);
  };

  const handleManualSave = async () => {
    console.log('Manual save triggered');
    
    // Set companyId directly from sessionStorage before saving
    setFormData(prevData => ({
      ...prevData,
      companyProfile: {
        ...prevData.companyProfile,
        companyId: JSON.parse(sessionStorage.getItem('user') || '{}').username || ''
      }
    }));

    console.log('Current form data:', formData);
    await triggerAutoSave(); // Call the actual API on manual save
    setIsEditing(false);
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  return {
    formData,
    handleInputChange,
    handleAddTag,
    handleRemoveTag,
    handleLogoUpload,
    saveStatus,
    isEditing,
    toggleEditMode,
    handleManualSave
  };
};