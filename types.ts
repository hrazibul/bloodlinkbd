
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type Gender = 'পুরুষ' | 'মহিলা' | 'অন্যান্য';
export type Availability = '৯০+ দিন (এখনই দিতে পারবেন)' | '৯০- দিন (অপেক্ষমান)';

export interface LocationData {
  divisions: string[];
  districts: Record<string, string[]>;
  upazilas: Record<string, string[]>;
}

export interface Donor {
  id: string;
  name: string;
  bloodGroup: BloodGroup;
  division: string;
  district: string;
  upazila: string;
  phone: string;
  gender: Gender;
  availability: Availability;
  lastDonatedDate: string;
  isPhoneHidden?: boolean;
  createdAt?: string;
}

export interface BloodRequest {
  id: string;
  bloodGroup: BloodGroup;
  hospitalName: string;
  district: string;
  contactNumber: string;
  requiredWithin: string;
  postedAt: string;
  isActive: boolean;
}

export interface SearchFilters {
  division: string;
  district: string;
  upazila: string;
  bloodGroup: string;
  gender: string;
  availability: string;
}

export interface Ad {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
  isActive: boolean;
  position: 'hero' | 'search-bottom' | 'footer-top';
}
