import React, { useState, useEffect } from 'react';
import { LOCATIONS, BLOOD_GROUPS } from '../constants';
import { SearchFilters } from '../types';

interface SearchBoxProps {
  onSearch: (filters: SearchFilters) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch }) => {
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    division: '',
    district: '',
    upazila: '',
    bloodGroup: '',
    gender: '',
    availability: ''
  });

  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  const [availableUpazilas, setAvailableUpazilas] = useState<string[]>([]);

  useEffect(() => {
    if (filters.division) {
      const districts = LOCATIONS.districts[filters.division] || [];
      setAvailableDistricts(districts);
      if (!districts.includes(filters.district)) {
        setFilters(prev => ({ ...prev, district: '', upazila: '' }));
      }
    } else {
      setAvailableDistricts([]);
      setFilters(prev => ({ ...prev, district: '', upazila: '' }));
    }
  }, [filters.division]);

  useEffect(() => {
    if (filters.district) {
      const upazilas = LOCATIONS.upazilas[filters.district] || [];
      setAvailableUpazilas(upazilas);
      if (!upazilas.includes(filters.upazila)) {
        setFilters(prev => ({ ...prev, upazila: '' }));
      }
    } else {
      setAvailableUpazilas([]);
      setFilters(prev => ({ ...prev, upazila: '' }));
    }
  }, [filters.district]);

  const handleSearch = () => {
    onSearch(filters);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 mt-8 md:mt-12 relative z-20">
      <div className="bg-surface-light dark:bg-surface-dark p-6 md:p-10 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">রক্তদাতা খুঁজুন</h2>
          <div className="h-1 w-16 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="flex flex-col">
            <label className="text-xs font-bold mb-2 text-muted-light dark:text-muted-dark uppercase tracking-wider">বিভাগ</label>
            <select 
              value={filters.division}
              onChange={(e) => setFilters({ ...filters, division: e.target.value })}
              className="w-full bg-background-light dark:bg-[#2A2A2A] border-gray-200 dark:border-gray-700 rounded-lg py-3 px-4 text-sm focus:ring-primary focus:border-primary transition-all"
            >
              <option value="">বিভাগ বাছাই করুন</option>
              {LOCATIONS.divisions.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold mb-2 text-muted-light dark:text-muted-dark uppercase tracking-wider">জেলা</label>
            <select 
              value={filters.district}
              onChange={(e) => setFilters({ ...filters, district: e.target.value })}
              disabled={!filters.division}
              className="w-full bg-background-light dark:bg-[#2A2A2A] border-gray-200 dark:border-gray-700 rounded-lg py-3 px-4 text-sm focus:ring-primary focus:border-primary transition-all disabled:opacity-50"
            >
              <option value="">জেলা বাছাই করুন</option>
              {availableDistricts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold mb-2 text-muted-light dark:text-muted-dark uppercase tracking-wider">উপজেলা</label>
            <select 
              value={filters.upazila}
              onChange={(e) => setFilters({ ...filters, upazila: e.target.value })}
              disabled={!filters.district}
              className="w-full bg-background-light dark:bg-[#2A2A2A] border-gray-200 dark:border-gray-700 rounded-lg py-3 px-4 text-sm focus:ring-primary focus:border-primary transition-all disabled:opacity-50"
            >
              <option value="">উপজেলা বাছাই করুন</option>
              {availableUpazilas.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold mb-2 text-muted-light dark:text-muted-dark uppercase tracking-wider">রক্তের গ্রুপ</label>
            <select 
              value={filters.bloodGroup}
              onChange={(e) => setFilters({ ...filters, bloodGroup: e.target.value })}
              className="w-full bg-background-light dark:bg-[#2A2A2A] border-gray-200 dark:border-gray-700 rounded-lg py-3 px-4 text-sm focus:ring-primary focus:border-primary transition-all"
            >
              <option value="">গ্রুপ বাছাই করুন</option>
              {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
          </div>
        </div>

        {showMoreFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 pt-4 border-t border-gray-100 dark:border-gray-800 animate-fade-in">
            <div className="flex flex-col">
              <label className="text-xs font-bold mb-2 text-muted-light dark:text-muted-dark uppercase tracking-wider">লিঙ্গ</label>
              <select 
                value={filters.gender}
                onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                className="w-full bg-background-light dark:bg-[#2A2A2A] border-gray-200 dark:border-gray-700 rounded-lg py-3 px-4 text-sm focus:ring-primary transition-all"
              >
                <option value="">সব লিঙ্গ</option>
                <option value="পুরুষ">পুরুষ</option>
                <option value="মহিলা">মহিলা</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-bold mb-2 text-muted-light dark:text-muted-dark uppercase tracking-wider">রক্তদানে সক্ষমতা</label>
              <select 
                value={filters.availability}
                onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                className="w-full bg-background-light dark:bg-[#2A2A2A] border-gray-200 dark:border-gray-700 rounded-lg py-3 px-4 text-sm focus:ring-primary transition-all"
              >
                <option value="">সবাই</option>
                <option value="৯০+ দিন (এখনই দিতে পারবেন)">এখনই দিতে পারবেন (৯০+ দিন)</option>
                <option value="৯০- দিন (অপেক্ষমান)">অপেক্ষমান (৯০- দিন)</option>
              </select>
            </div>
          </div>
        )}

        <div className="flex justify-center mb-8">
          <button 
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            className="flex items-center text-xs font-semibold text-muted-light dark:text-muted-dark hover:text-primary gap-2 transition-colors"
          >
            <span className="material-icons-outlined text-sm">{showMoreFilters ? 'expand_less' : 'filter_alt'}</span>
            {showMoreFilters ? 'কম ফিল্টার দেখুন' : 'আরো ফিল্টার দেখুন'}
          </button>
        </div>

        <button 
          onClick={handleSearch}
          className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-3 transform active:scale-[0.98]"
        >
          <span className="material-icons-outlined">search</span>
          রক্তদাতা খুঁজুন
        </button>
      </div>
    </div>
  );
};

export default SearchBox;