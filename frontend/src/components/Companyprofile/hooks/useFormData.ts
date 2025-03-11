import { useState } from 'react';
import type { FormData } from '../types';

export const useFormData = () => {
  const [formData, setFormData] = useState<FormData>({
    companyProfile: {
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
    triggerAutoSave();
  };

  const handleAddTag = (section: string, field: string, value: string, inputSetter: React.Dispatch<React.SetStateAction<string>>) => {
    if (value.trim() !== '') {
      setFormData(prevData => ({
        ...prevData,
        [section]: {
          ...prevData[section],
          [field]: [...prevData[section][field], value.trim()]
        }
      }));
      inputSetter('');
      triggerAutoSave();
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
    triggerAutoSave();
  };

  const handleLogoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      handleInputChange('companyProfile', 'logo', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const triggerAutoSave = () => {
    setSaveStatus('Saving...');
    console.log('Saving changes...');
    
    // Simulate API call
    setTimeout(() => {
      console.log('Changes saved successfully!', formData);
      setSaveStatus('Changes saved');
      
      setTimeout(() => {
        setSaveStatus('');
      }, 2000);
    }, 1000);
  };

  const handleManualSave = () => {
    console.log('Manual save triggered');
    console.log('Current form data:', formData);
    triggerAutoSave();
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