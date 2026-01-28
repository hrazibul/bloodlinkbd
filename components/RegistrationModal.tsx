import React, { useState, useEffect } from 'react';
// Import Auth functions from local firebase.ts to ensure consistency and fix module resolution errors
import { auth, db, createUserWithEmailAndPassword } from '../firebase';
import { BLOOD_GROUPS, LOCATIONS } from '../constants';
import { Gender, Availability } from '../types';
import { doc, setDoc } from 'firebase/firestore';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    bloodGroup: '',
    division: '',
    district: '',
    upazila: '',
    phone: '',
    gender: '' as Gender | '',
    availability: '' as Availability | '',
    lastDonatedDate: ''
  });

  const [districts, setDistricts] = useState<string[]>([]);
  const [upazilas, setUpazilas] = useState<string[]>([]);

  useEffect(() => {
    if (formData.division) {
      const availableDistricts = LOCATIONS.districts[formData.division] || [];
      setDistricts(availableDistricts);
      if (!availableDistricts.includes(formData.district)) {
        setFormData(prev => ({ ...prev, district: '', upazila: '' }));
      }
    } else {
      setDistricts([]);
      setFormData(prev => ({ ...prev, district: '', upazila: '' }));
    }
  }, [formData.division]);

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
        // Create User in Firebase Auth using the modular standard SDK function from local config
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        // Save Donor Profile to Firestore
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
        setStep(1);
        setFormData({
          email: '', password: '', confirmPassword: '', name: '', bloodGroup: '',
          division: '', district: '', upazila: '', phone: '', gender: '',
          availability: '', lastDonatedDate: ''
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
      <div className="bg-white dark:bg-surface-dark w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden border border-white/10">
        <div className="flex items-center justify-center gap-4 py-10">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>১</div>
            <span className={`text-sm font-bold ${step >= 1 ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400'}`}>অ্যাকাউন্ট</span>
          </div>
          <div className="w-10 h-[2px] bg-gray-100 dark:bg-gray-800"></div>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>২</div>
            <span className={`text-sm font-bold ${step >= 2 ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400'}`}>ডোনার তথ্য</span>
          </div>
        </div>
        <div className="p-10 pt-0">
          <form onSubmit={handleNext} className="space-y-6">
            {step === 1 ? (
              <div className="space-y-5">
                <input type="email" required placeholder="ইমেইল" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-5 py-4 rounded-2xl border dark:bg-[#252525]" />
                <input type="password" required placeholder="পাসওয়ার্ড" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-5 py-4 rounded-2xl border dark:bg-[#252525]" />
                <input type="password" required placeholder="পাসওয়ার্ড নিশ্চিত করুন" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className="w-full px-5 py-4 rounded-2xl border dark:bg-[#252525]" />
              </div>
            ) : (
              <div className="space-y-5 max-h-[50vh] overflow-y-auto pr-2">
                <input type="text" required placeholder="নাম" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-4 rounded-2xl border dark:bg-[#252525]" />
                <select required value={formData.bloodGroup} onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})} className="w-full px-5 py-4 rounded-2xl border dark:bg-[#252525]">
                  <option value="">গ্রুপ বাছাই করুন</option>
                  {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
                <select required value={formData.division} onChange={(e) => setFormData({...formData, division: e.target.value})} className="w-full px-5 py-4 rounded-2xl border dark:bg-[#252525]">
                  <option value="">বিভাগ বাছাই করুন</option>
                  {LOCATIONS.divisions.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <input type="tel" required placeholder="ফোন নম্বর" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-5 py-4 rounded-2xl border dark:bg-[#252525]" />
              </div>
            )}
            <button type="submit" disabled={loading} className="w-full bg-primary text-white font-bold py-4 rounded-2xl">
              {step === 1 ? 'পরবর্তী' : loading ? 'নিবন্ধন হচ্ছে...' : 'নিবন্ধন সম্পন্ন করুন'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;