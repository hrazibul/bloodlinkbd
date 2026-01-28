
import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Donor, Availability } from '../types';

interface ProfileDashboardProps {
  onBack: () => void;
  userId: string;
}

const ProfileDashboard: React.FC<ProfileDashboardProps> = ({ onBack, userId }) => {
  const [donorData, setDonorData] = useState<Donor | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "donors", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setDonorData({ id: docSnap.id, ...docSnap.data() } as Donor);
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
    } finally {
      setLoading(false);
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
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: 'আপডেট করতে সমস্যা হয়েছে।', type: 'error' });
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

  if (!donorData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0F0F10] p-4 text-center">
        <span className="material-icons-outlined text-6xl text-gray-300 mb-4">error_outline</span>
        <h2 className="text-xl font-bold mb-2">প্রোফাইল পাওয়া যায়নি</h2>
        <p className="text-gray-500 mb-6">আপনার দাতা প্রোফাইলটি খুঁজে পাওয়া সম্ভব হচ্ছে না।</p>
        <button onClick={onBack} className="bg-primary text-white px-8 py-3 rounded-xl font-bold">ফিরে যান</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0F0F10] pb-20">
      <div className="bg-primary pt-10 pb-24 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-white">
          <button onClick={onBack} className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-all">
            <span className="material-icons-outlined">arrow_back</span>
            ফিরে যান
          </button>
          <h1 className="text-xl font-bold">আমার প্রোফাইল</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-16">
        <div className="bg-white dark:bg-surface-dark rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-12 pb-12 border-b border-gray-50 dark:border-gray-800">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-red-100 dark:bg-red-900/20 rounded-[2.5rem] flex items-center justify-center text-primary font-black text-4xl shadow-inner shrink-0">
                {donorData.bloodGroup}
              </div>
              <div className="text-center md:text-left flex-1">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{donorData.name}</h2>
                <p className="text-gray-500 flex items-center justify-center md:justify-start gap-2 text-sm">
                  <span className="material-icons-outlined text-sm">location_on</span>
                  {donorData.division} > {donorData.district} > {donorData.upazila}
                </p>
                <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
                  <span className={`text-xs font-bold px-4 py-1.5 rounded-full ${donorData.availability.includes('৯০+') ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                    {donorData.availability}
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <span className="material-icons-outlined text-primary">edit</span>
                  তথ্য আপডেট করুন
                </h3>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">ফোন নম্বর</label>
                  <input 
                    type="tel" 
                    value={donorData.phone} 
                    onChange={e => setDonorData({...donorData, phone: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl border dark:bg-[#252525] border-gray-100 dark:border-gray-800 focus:ring-2 focus:ring-primary outline-none transition-all" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">রক্তদানের সক্ষমতা</label>
                  <select 
                    value={donorData.availability} 
                    onChange={e => setDonorData({...donorData, availability: e.target.value as Availability})}
                    className="w-full px-5 py-4 rounded-2xl border dark:bg-[#252525] border-gray-100 dark:border-gray-800 focus:ring-2 focus:ring-primary outline-none transition-all"
                  >
                    <option value="৯০+ দিন (এখনই দিতে পারবেন)">৯০+ দিন (এখনই দিতে পারবেন)</option>
                    <option value="৯০- দিন (অপেক্ষমান)">৯০- দিন (অপেক্ষমান)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">সর্বশেষ রক্তদানের তারিখ</label>
                  <input 
                    type="date" 
                    value={donorData.lastDonatedDate} 
                    onChange={e => setDonorData({...donorData, lastDonatedDate: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl border dark:bg-[#252525] border-gray-100 dark:border-gray-800 focus:ring-2 focus:ring-primary outline-none transition-all" 
                  />
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/20 p-8 rounded-3xl flex flex-col justify-center border border-gray-100 dark:border-gray-800">
                <div className="text-center mb-8">
                  <span className="material-icons-outlined text-4xl text-primary mb-4">info</span>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    আপনার তথ্য সঠিকভাবে আপডেট রাখুন যাতে গ্রহীতারা আপনাকে সহজেই খুঁজে পেতে পারে। আপনি রক্ত দান করার পর অবশ্যই তারিখটি এখানে এসে পরিবর্তন করবেন।
                  </p>
                </div>

                {message.text && (
                  <div className={`mb-6 p-4 rounded-xl text-center text-sm font-bold ${message.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {message.text}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={updating}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50"
                >
                  {updating ? (
                    <span className="material-icons-outlined animate-spin">sync</span>
                  ) : (
                    <span className="material-icons-outlined text-sm">save</span>
                  )}
                  তথ্য সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
