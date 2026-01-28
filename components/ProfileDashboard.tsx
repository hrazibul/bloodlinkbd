import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { Donor, Availability, Gender, BloodGroup } from '../types';
import { BLOOD_GROUPS, LOCATIONS } from '../constants';

interface ProfileDashboardProps {
  onBack: () => void;
  userId: string;
}

const ProfileDashboard: React.FC<ProfileDashboardProps> = ({ onBack, userId }) => {
  const [donorData, setDonorData] = useState<Donor | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Setup Form State for missing profiles
  const [setupForm, setSetupForm] = useState({
    name: '',
    bloodGroup: '' as BloodGroup | '',
    division: '',
    district: '',
    upazila: '',
    phone: '',
    gender: '' as Gender | '',
    availability: '৯০+ দিন (এখনই দিতে পারবেন)' as Availability,
    lastDonatedDate: ''
  });

  const [districts, setDistricts] = useState<string[]>([]);
  const [upazilas, setUpazilas] = useState<string[]>([]);

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  useEffect(() => {
    if (setupForm.division) {
      setDistricts(LOCATIONS.districts[setupForm.division] || []);
    }
  }, [setupForm.division]);

  useEffect(() => {
    if (setupForm.district) {
      setUpazilas(LOCATIONS.upazilas[setupForm.district] || []);
    }
  }, [setupForm.district]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "donors", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setDonorData({ id: docSnap.id, ...docSnap.data() } as Donor);
        setIsSettingUp(false);
      } else {
        setIsSettingUp(true);
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const docRef = doc(db, "donors", userId);
      const newData = {
        ...setupForm,
        id: userId,
        createdAt: new Date().toISOString()
      };
      await setDoc(docRef, newData);
      setDonorData(newData as Donor);
      setIsSettingUp(false);
      setMessage({ text: 'প্রোফাইল সফলভাবে তৈরি হয়েছে!', type: 'success' });
    } catch (error) {
      setMessage({ text: 'প্রোফাইল তৈরিতে সমস্যা হয়েছে।', type: 'error' });
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorData) return;
    
    setUpdating(true);
    setMessage({ text: '', type: '' });
    try {
      const docRef = doc(db, "donors", userId);
      await updateDoc(docRef, {
        availability: donorData.availability,
        lastDonatedDate: donorData.lastDonatedDate,
        phone: donorData.phone
      });
      setMessage({ text: 'প্রোফাইল সফলভাবে আপডেট হয়েছে!', type: 'success' });
      // Scroll to top of form to see the success message if needed
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    } catch (error) {
      console.error("Update Error:", error);
      setMessage({ text: 'আপডেট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।', type: 'error' });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0F0F10]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Setup Profile View
  if (isSettingUp) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0F0F10] py-12 px-4">
        <div className="max-w-2xl mx-auto bg-white dark:bg-surface-dark rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
          <div className="bg-primary p-10 text-center text-white">
            <span className="material-icons-outlined text-5xl mb-4">account_circle</span>
            <h2 className="text-2xl font-bold">প্রোফাইল সেটআপ করুন</h2>
            <p className="text-white/80 text-sm mt-2">রক্তদাতা হিসেবে আপনার তথ্য প্রদান করুন</p>
          </div>
          <form onSubmit={handleSetupSubmit} className="p-10 space-y-5">
            <input type="text" required placeholder="আপনার পূর্ণ নাম" value={setupForm.name} onChange={e => setSetupForm({...setupForm, name: e.target.value})} className="w-full px-5 py-4 rounded-2xl border dark:bg-[#252525] border-gray-100 dark:border-gray-800 dark:text-white" />
            <div className="grid grid-cols-2 gap-4">
              <select required value={setupForm.bloodGroup} onChange={e => setSetupForm({...setupForm, bloodGroup: e.target.value as BloodGroup})} className="w-full px-5 py-4 rounded-2xl border dark:bg-[#252525] border-gray-100 dark:border-gray-800 dark:text-white">
                <option value="">রক্তের গ্রুপ</option>
                {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
              <select required value={setupForm.gender} onChange={e => setSetupForm({...setupForm, gender: e.target.value as Gender})} className="w-full px-5 py-4 rounded-2xl border dark:bg-[#252525] border-gray-100 dark:border-gray-800 dark:text-white">
                <option value="">লিঙ্গ</option>
                <option value="পুরুষ">পুরুষ</option>
                <option value="মহিলা">মহিলা</option>
              </select>
            </div>
            <select required value={setupForm.division} onChange={e => setSetupForm({...setupForm, division: e.target.value})} className="w-full px-5 py-4 rounded-2xl border dark:bg-[#252525] border-gray-100 dark:border-gray-800 dark:text-white">
              <option value="">বিভাগ বাছাই করুন</option>
              {LOCATIONS.divisions.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-4">
              <select required value={setupForm.district} onChange={e => setSetupForm({...setupForm, district: e.target.value})} disabled={!setupForm.division} className="w-full px-5 py-4 rounded-2xl border dark:bg-[#252525] border-gray-100 dark:border-gray-800 dark:text-white">
                <option value="">জেলা</option>
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select required value={setupForm.upazila} onChange={e => setSetupForm({...setupForm, upazila: e.target.value})} disabled={!setupForm.district} className="w-full px-5 py-4 rounded-2xl border dark:bg-[#252525] border-gray-100 dark:border-gray-800 dark:text-white">
                <option value="">উপজেলা</option>
                {upazilas.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <input type="tel" required placeholder="ফোন নম্বর" value={setupForm.phone} onChange={e => setSetupForm({...setupForm, phone: e.target.value})} className="w-full px-5 py-4 rounded-2xl border dark:bg-[#252525] border-gray-100 dark:border-gray-800 dark:text-white" />
            
            <button type="submit" disabled={updating} className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-xl transition-all hover:bg-primary-dark">
              {updating ? 'তৈরি হচ্ছে...' : 'প্রোফাইল সংরক্ষণ করুন'}
            </button>
            <button type="button" onClick={onBack} className="w-full text-gray-500 font-bold py-2">পরে করুন</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0F0F10] pb-20">
      <div className="bg-primary pt-10 pb-24 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-white">
          <button onClick={onBack} className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-all bg-white/10 px-4 py-2 rounded-xl">
            <span className="material-icons-outlined text-sm">arrow_back</span>
            ফিরে যান
          </button>
          <h1 className="text-xl font-bold tracking-tight">আমার প্রোফাইল</h1>
          <div className="w-10 md:w-24"></div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-16">
        <div className="bg-white dark:bg-surface-dark rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-12 pb-12 border-b border-gray-50 dark:border-gray-800">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-red-100 dark:bg-red-900/20 rounded-[2.5rem] flex items-center justify-center text-primary font-black text-4xl shadow-inner shrink-0 animate-fade-in">
                {donorData.bloodGroup}
              </div>
              <div className="text-center md:text-left flex-1 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{donorData.name}</h2>
                <p className="text-gray-500 flex items-center justify-center md:justify-start gap-2 text-sm">
                  <span className="material-icons-outlined text-sm">location_on</span>
                  {donorData.division} > {donorData.district} > {donorData.upazila}
                </p>
                <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
                  <span className={`text-[10px] font-bold px-4 py-1.5 rounded-full shadow-sm ${donorData.availability.includes('৯০+') ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                    {donorData.availability}
                  </span>
                  <span className="text-[10px] font-bold px-4 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500">
                    লিঙ্গ: {donorData.gender}
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      <span className="material-icons-outlined text-sm">edit</span>
                    </div>
                    তথ্য আপডেট করুন
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <span className="material-icons-outlined text-xs">call</span>
                        ফোন নম্বর
                      </label>
                      <input 
                        type="tel" 
                        placeholder="আপনার ফোন নম্বর"
                        value={donorData.phone} 
                        onChange={e => setDonorData({...donorData, phone: e.target.value})}
                        className="w-full px-5 py-4 rounded-2xl border dark:bg-[#252525] border-gray-100 dark:border-gray-800 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white" 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <span className="material-icons-outlined text-xs">event_available</span>
                        রক্তদানের সক্ষমতা
                      </label>
                      <select 
                        value={donorData.availability} 
                        onChange={e => setDonorData({...donorData, availability: e.target.value as Availability})}
                        className="w-full px-5 py-4 rounded-2xl border dark:bg-[#252525] border-gray-100 dark:border-gray-800 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                      >
                        <option value="৯০+ দিন (এখনই দিতে পারবেন)">৯০+ দিন (এখনই দিতে পারবেন)</option>
                        <option value="৯০- দিন (অপেক্ষমান)">৯০- দিন (অপেক্ষমান)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <span className="material-icons-outlined text-xs">history</span>
                        সর্বশেষ রক্তদানের তারিখ
                      </label>
                      <input 
                        type="date" 
                        value={donorData.lastDonatedDate} 
                        onChange={e => setDonorData({...donorData, lastDonatedDate: e.target.value})}
                        className="w-full px-5 py-4 rounded-2xl border dark:bg-[#252525] border-gray-100 dark:border-gray-800 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="bg-gray-50 dark:bg-gray-800/30 p-8 rounded-3xl flex-grow border border-gray-100 dark:border-gray-800/50 flex flex-col justify-center">
                  <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                      <span className="material-icons-outlined text-3xl text-primary">verified_user</span>
                    </div>
                    <h4 className="font-bold text-gray-800 dark:text-white mb-2">তথ্য সঠিক রাখুন</h4>
                    <p className="text-sm text-gray-500 leading-relaxed px-4">
                      আপনার সর্বশেষ রক্তদানের তারিখ এবং ফোন নম্বর নিয়মিত আপডেট রাখুন। এটি জরুরি মুহূর্তে গ্রহীতাদের দ্রুত যোগাযোগ করতে সাহায্য করবে।
                    </p>
                  </div>

                  {message.text && (
                    <div className={`mb-8 p-4 rounded-2xl text-center text-sm font-bold animate-fade-in shadow-sm ${message.type === 'success' ? 'bg-green-100 text-green-600 border border-green-200' : 'bg-red-100 text-red-600 border border-red-200'}`}>
                      <div className="flex items-center justify-center gap-2">
                        <span className="material-icons-outlined text-sm">{message.type === 'success' ? 'check_circle' : 'error_outline'}</span>
                        {message.text}
                      </div>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={updating}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-5 rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 transform active:scale-95 disabled:opacity-50"
                  >
                    {updating ? (
                      <span className="material-icons-outlined animate-spin">sync</span>
                    ) : (
                      <span className="material-icons-outlined">save</span>
                    )}
                    {updating ? 'সংরক্ষণ হচ্ছে...' : 'তথ্য সংরক্ষণ করুন'}
                  </button>
                </div>
                
                <p className="text-[10px] text-gray-400 text-center mt-6 flex items-center justify-center gap-1">
                  <span className="material-icons-outlined text-xs">lock</span>
                  আপনার সকল তথ্য নিরাপদ রাখা হয়েছে
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;