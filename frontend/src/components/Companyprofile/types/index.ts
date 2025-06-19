export interface SocialMedia {
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
}

export interface CompanyProfile {
  companyId : string;
  name: string;
  logo: string;
  industry: string;
  size: string;
  yearFounded: string;
  description: string;
  headquarters: string;
  officeLocations: string[];
  website: string;
  businessType: string;
  products: string[];
  targetMarket: string;
  competitors: string[];
  revenueRange: string;
  culture: string;
  mission: string;
  vision: string;
  leadership: string;
  achievements: string[];
  socialMedia: SocialMedia;
  csrInitiatives: string[];
  growthPlans: string;
}

export interface FormData {
  companyProfile: CompanyProfile;
}