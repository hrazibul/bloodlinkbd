
import React, { useState, useEffect } from 'react';
import { auth, db, createUserWithEmailAndPassword } from '../firebase';
import { BLOOD_GROUPS, LOCATIONS } from '../constants';
import { Gender, Availability, BloodGroup } from '../types';
import { doc, setDoc } from 'firebase/firestore';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegistrationSuccess?: () => void;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose, onRegistrationSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    bloodGroup: '' as BloodGroup | '',
    division: '',
    district: '',
    upazila: '',
    phone: '',
    gender: 'পুরুষ' as Gender,
    availability: '৯০+ দিন (এখনই দিতে পারবেন)' as Availability,
    lastDonatedDate: ''
  });

  const [districts, setDistricts] = useState<string[]>([]);
  const [upazilas, setUpazilas] = useState<string[]>([]);

  // Update districts when division changes
  useEffect(() => {
    if (formData.division) {
      const availableDistricts = LOCATIONS.districts[formData.division] || [];
      setDistricts(availableDistricts);
      // Reset district and upazila if they don't belong to the new division
      if (!availableDistricts.includes(formData.district)) {
        setFormData(prev => ({ ...prev, district: '', upazila: '' }));
      }
    } else {
      setDistricts([]);
      setFormData(prev => ({ ...prev, district: '', upazila: '' }));
    }
  }, [formData.division]);

  // Update upazilas when district changes
  useEffect(() => {
    if (formData.district) {
      const availableUpazilas = LOCATIONS.upazilas[formData.district] || [];
      setUpazilas(availableUpazilas);
      if (!availableUpazilas.includes(formData.upazila)) {
        setFormData(prev => ({ ...prev, upazila: '' }));
      }
    } else {
      setUpazilas([]);
      setFormData(prev => ({ ...prev, upazila: '' }));
    }
  }, [formData.district]);

  if (!isOpen) return null;

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.email || !formData.password) {
        alert("ইমেইল এবং পাসওয়ার্ড আবশ্যক!");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        alert("পাসওয়ার্ড মেলেনি!");
        return;
      }
      if (formData.password.length < 6) {
        alert("পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে!");
        return;
      }
      setStep(2);
    } else {
      setLoading(true);
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        await setDoc(doc(db, "donors", user.uid), {
          id: user.uid,
          name: formData.name,
          bloodGroup: formData.bloodGroup,
          division: formData.division,
          district: formData.district,
          upazila: formData.upazila,
          phone: formData.phone,
          gender: formData.gender,
          availability: formData.availability,
          lastDonatedDate: formData.lastDonatedDate,
          createdAt: new Date().toISOString()
        });

        alert('অভিনন্দন! সফলভাবে নিবন্ধিত হয়েছেন।');
        onClose();
        if (onRegistrationSuccess) onRegistrationSuccess();
        
        // Reset form
        setStep(1);
        setFormData({
          email: '', password: '', confirmPassword: '', name: '', bloodGroup: '' as BloodGroup,
          division: '', district: '', upazila: '', phone: '', gender: 'পুরুষ',
          availability: '৯০+ দিন (এখনই দিতে পারবেন)', lastDonatedDate: ''
        });
      } catch (error: any) {
        console.error("Registration Error:", error);
        if (error.code === 'auth/email-already-in-use') {
          alert('এই ইমেইলটি ইতিমধ্যে ব্যবহৃত হচ্ছে।');
        } else {
          alert('দুঃখিত, নিবন্ধন করা সম্ভব হয়নি। আবার চেষ্টা করুন।');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="bg-white dark:bg-surface-dark w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden border border-white/10 animate-fade-in">
        
        {/* Step Indicator - Matches Screenshot Style */}
        <div className="flex items-center justify-center gap-4 py-12 px-8">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step >= 1 ? 'bg-primary text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}>১</div>
            <span className={`text-sm font-bold ${step >= 1 ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400'}`}>অ্যাকাউন্ট</span>
          </div>
          <div className="w-12 h-[2px] bg-gray-100 dark:bg-gray-800"></div>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step >= 2 ? 'bg-primary text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}>২</div>
            <span className={`text-sm font-bold ${step >= 2 ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400'}`}>ডোনার তথ্য</span>
          </div>
        </div>

        <div className="px-10 pb-12 pt-0">
          <form onSubmit={handleNext} className="space-y-5">
            {step === 1 ? (
              <div className="space-y-4 animate-fade-in">
                <input 
                  type="email" required placeholder="ইমেইল" 
                  value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  className="w-full px-6 py-4 rounded-2xl border border-gray-300 dark:border-gray-700 dark:bg-[#252525] dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all" 
                />
                <input 
                  type="password" required placeholder="পাসওয়ার্ড" 
                  value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} 
                  className="w-full px-6 py-4 rounded-2xl border border-gray-300 dark:border-gray-700 dark:bg-[#252525] dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all" 
                />
                <input 
                  type="password" required placeholder="পাসওয়ার্ড নিশ্চিত করুন" 
                  value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
                  className="w-full px-6 py-4 rounded-2xl border border-gray-300 dark:border-gray-700 dark:bg-[#252525] dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all" 
                />
              </div>
            ) : (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar animate-fade-in">
                <input 
                  type="text" required placeholder="নাম" 
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  className="w-full px-6 py-4 rounded-2xl border border-gray-300 dark:border-gray-700 dark:bg-[#252525] dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all" 
                />
                
                <select 
                  required value={formData.bloodGroup} 
                  onChange={(e) => setFormData({...formData, bloodGroup: e.target.value as BloodGroup})} 
                  className="w-full px-6 py-4 rounded-2xl border border-gray-300 dark:border-gray-700 dark:bg-[#252525] dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                >
                  <option value="">গ্রুপ বাছাই করুন</option>
                  {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>

                <div className="grid grid-cols-1 gap-4">
                  <select 
                    required value={formData.division} 
                    onChange={(e) => setFormData({...formData, division: e.target.value})} 
                    className="w-full px-6 py-4 rounded-2xl border border-gray-300 dark:border-gray-700 dark:bg-[#252525] dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                  >
                    <option value="">বিভাগ বাছাই করুন</option>
                    {LOCATIONS.divisions.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>

                  {/* District Selection - Now clearly shown when division is picked */}
                  {formData.division && (
                    <select 
                      required value={formData.district} 
                      onChange={(e) => setFormData({...formData, district: e.target.value})} 
                      className="w-full px-6 py-4 rounded-2xl border border-gray-300 dark:border-gray-700 dark:bg-[#252525] dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all animate-fade-in"
                    >
                      <option value="">জেলা বাছাই করুন</option>
                      {districts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  )}

                  {/* Upazila Selection - Now clearly shown when district is picked */}
                  {formData.district && (
                    <select 
                      required value={formData.upazila} 
                      onChange={(e) => setFormData({...formData, upazila: e.target.value})} 
                      className="w-full px-6 py-4 rounded-2xl border border-gray-300 dark:border-gray-700 dark:bg-[#252525] dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all animate-fade-in"
                    >
                      <option value="">উপজেলা বাছাই করুন</option>
                      {upazilas.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  )}
                </div>

                <input 
                  type="tel" required placeholder="ফোন নম্বর" 
                  value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                  className="w-full px-6 py-4 rounded-2xl border border-gray-300 dark:border-gray-700 dark:bg-[#252525] dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all" 
                />

                <div className="grid grid-cols-2 gap-4">
                   <select 
                    required value={formData.gender} 
                    onChange={(e) => setFormData({...formData, gender: e.target.value as Gender})} 
                    className="w-full px-6 py-4 rounded-2xl border border-gray-300 dark:border-gray-700 dark:bg-[#252525] dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                  >
                    <option value="পুরুষ">পুরুষ</option>
                    <option value="মহিলা">মহিলা</option>
                    <option value="অন্যান্য">অন্যান্য</option>
                  </select>

                  <select 
                    required value={formData.availability} 
                    onChange={(e) => setFormData({...formData, availability: e.target.value as Availability})} 
                    className="w-full px-6 py-4 rounded-2xl border border-gray-300 dark:border-gray-700 dark:bg-[#252525] dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                  >
                    <option value="৯০+ দিন (এখনই দিতে পারবেন)">৯০+ দিন (সক্ষম)</option>
                    <option value="৯০- দিন (অপেক্ষমান)">৯০- দিন (অপেক্ষমান)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-3 tracking-widest">সর্বশেষ রক্তদানের তারিখ (ঐচ্ছিক)</label>
                  <input 
                    type="date" 
                    value={formData.lastDonatedDate} 
                    onChange={(e) => setFormData({...formData, lastDonatedDate: e.target.value})} 
                    className="w-full px-6 py-4 rounded-2xl border border-gray-300 dark:border-gray-700 dark:bg-[#252525] dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all" 
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 pt-4">
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-5 rounded-2xl shadow-xl shadow-primary/20 transition-all transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="material-icons-outlined animate-spin">sync</span>
                ) : null}
                {step === 1 ? 'পরবর্তী' : loading ? 'নিবন্ধন হচ্ছে...' : 'নিবন্ধন সম্পন্ন করুন'}
              </button>
              
              {step === 2 && (
                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  className="w-full text-gray-500 font-bold py-2 hover:text-primary transition-colors text-sm"
                >
                  আগের ধাপে ফিরে যান
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;
