
import React, { useState } from 'react';
import { BLOOD_GROUPS, LOCATIONS } from '../constants';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { BloodGroup } from '../types';

interface PostRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PostRequestModal: React.FC<PostRequestModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bloodGroup: '' as BloodGroup | '',
    hospitalName: '',
    district: '',
    contactNumber: '',
    requiredWithin: 'জরুরি (এখনই)'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    
    setLoading(true);
    try {
      await addDoc(collection(db, "blood_requests"), {
        ...formData,
        postedAt: new Date().toISOString(),
        isActive: true
      });
      alert('আপনার আবেদনটি সফলভাবে পোস্ট করা হয়েছে। নিকটস্থ দাতা থাকলে আপনার সাথে যোগাযোগ করবে।');
      onClose();
      setFormData({
        bloodGroup: '',
        hospitalName: '',
        district: '',
        contactNumber: '',
        requiredWithin: 'জরুরি (এখনই)'
      });
    } catch (error) {
      console.error("Post Error:", error);
      alert('দুঃখিত, আবেদনটি পোস্ট করা সম্ভব হয়নি।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="bg-white dark:bg-surface-dark w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-fade-in border border-white/5">
        <div className="p-8 text-center bg-red-50 dark:bg-red-900/10">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-primary/20">
            <span className="material-icons-outlined text-3xl">emergency</span>
          </div>
          <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2 tracking-tight">জরুরি রক্তের আবেদন</h3>
          <p className="text-gray-500 text-sm font-medium">সঠিক তথ্য দিয়ে দ্রুত সাহায্য পেতে সহায়তা করুন</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">রক্তের গ্রুপ</label>
              <select 
                required value={formData.bloodGroup} 
                onChange={e => setFormData({...formData, bloodGroup: e.target.value as BloodGroup})}
                className="w-full px-4 py-3.5 rounded-xl border-gray-100 dark:border-gray-800 dark:bg-[#252525] focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="">বাছাই করুন</option>
                {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">কখন প্রয়োজন</label>
              <select 
                required value={formData.requiredWithin} 
                onChange={e => setFormData({...formData, requiredWithin: e.target.value})}
                className="w-full px-4 py-3.5 rounded-xl border-gray-100 dark:border-gray-800 dark:bg-[#252525] focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="জরুরি (এখনই)">জরুরি (এখনই)</option>
                <option value="২ ঘণ্টার মধ্যে">২ ঘণ্টার মধ্যে</option>
                <option value="আজকের মধ্যে">আজকের মধ্যে</option>
                <option value="আগামীকাল">আগামীকাল</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">জেলা</label>
            <select 
              required value={formData.district} 
              onChange={e => setFormData({...formData, district: e.target.value})}
              className="w-full px-4 py-3.5 rounded-xl border-gray-100 dark:border-gray-800 dark:bg-[#252525] focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="">জেলা বাছাই করুন</option>
              {Object.values(LOCATIONS.districts).flat().sort().map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">হাসপাতালের নাম</label>
            <input 
              type="text" required placeholder="যেমন: ঢাকা মেডিকেল কলেজ"
              value={formData.hospitalName} onChange={e => setFormData({...formData, hospitalName: e.target.value})}
              className="w-full px-4 py-3.5 rounded-xl border-gray-100 dark:border-gray-800 dark:bg-[#252525] focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">যোগাযোগের নম্বর</label>
            <input 
              type="tel" required placeholder="017xxxxxxxx"
              value={formData.contactNumber} onChange={e => setFormData({...formData, contactNumber: e.target.value})}
              className="w-full px-4 py-3.5 rounded-xl border-gray-100 dark:border-gray-800 dark:bg-[#252525] focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <button 
            type="submit" disabled={loading}
            className={`w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 mt-4 ${loading ? 'opacity-70' : ''}`}
          >
            {loading ? <span className="material-icons-outlined animate-spin text-xl">sync</span> : <span className="material-icons-outlined">send</span>}
            পোস্ট করুন
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostRequestModal;
