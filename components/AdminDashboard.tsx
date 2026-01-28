
import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, deleteDoc, doc, addDoc, setDoc, query, orderBy } from 'firebase/firestore';
import { Donor, Ad } from '../types';

interface AdminDashboardProps {
  onBack: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'donors' | 'csv' | 'ads'>('donors');
  const [donors, setDonors] = useState<Donor[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Ad Form State
  const [adForm, setAdForm] = useState({ title: '', imageUrl: '', link: '', position: 'hero' as any });

  useEffect(() => {
    fetchDonors();
    fetchAds();
  }, []);

  const fetchDonors = async () => {
    setLoading(true);
    const q = query(collection(db, "donors"), orderBy("name"));
    const snapshot = await getDocs(q);
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Donor));
    setDonors(list);
    setLoading(false);
  };

  const fetchAds = async () => {
    const snapshot = await getDocs(collection(db, "ads"));
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ad));
    setAds(list);
  };

  const handleDeleteDonor = async (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই দাতার তথ্য মুছে ফেলতে চান?')) {
      await deleteDoc(doc(db, "donors", id));
      fetchDonors();
    }
  };

  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const rows = text.split('\n').slice(1); // Skip header

      let count = 0;
      for (const row of rows) {
        const columns = row.split(',');
        if (columns.length >= 6) {
          const donorData = {
            name: columns[0].trim(),
            bloodGroup: columns[1].trim(),
            division: columns[2].trim(),
            district: columns[3].trim(),
            upazila: columns[4].trim(),
            phone: columns[5].trim(),
            gender: 'পুরুষ', // Default
            availability: '৯০+ দিন (এখনই দিতে পারবেন)',
            lastDonatedDate: '',
            createdAt: new Date().toISOString()
          };
          await addDoc(collection(db, "donors"), donorData);
          count++;
        }
      }
      alert(`${count} টি দাতার তথ্য সফলভাবে আপলোড হয়েছে।`);
      fetchDonors();
      setLoading(false);
    };
    reader.readAsText(file);
  };

  const handleAddAd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, "ads"), { ...adForm, isActive: true });
    setAdForm({ title: '', imageUrl: '', link: '', position: 'hero' });
    fetchAds();
    alert('বিজ্ঞাপন যোগ করা হয়েছে।');
  };

  const toggleAdStatus = async (ad: Ad) => {
    await setDoc(doc(db, "ads", ad.id), { ...ad, isActive: !ad.isActive });
    fetchAds();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-primary text-white p-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-10 flex items-center gap-2">
          <span className="material-icons-outlined">dashboard</span> অ্যাডমিন
        </h2>
        <nav className="space-y-4">
          <button onClick={() => setActiveTab('donors')} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all ${activeTab === 'donors' ? 'bg-white text-primary shadow-lg' : 'hover:bg-white/10'}`}>
            <span className="material-icons-outlined">people</span> দাতা তালিকা
          </button>
          <button onClick={() => setActiveTab('csv')} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all ${activeTab === 'csv' ? 'bg-white text-primary shadow-lg' : 'hover:bg-white/10'}`}>
            <span className="material-icons-outlined">upload_file</span> CSV আপলোড
          </button>
          <button onClick={() => setActiveTab('ads')} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all ${activeTab === 'ads' ? 'bg-white text-primary shadow-lg' : 'hover:bg-white/10'}`}>
            <span className="material-icons-outlined">campaign</span> বিজ্ঞাপন
          </button>
          <div className="pt-10 border-t border-white/20">
            <button onClick={onBack} className="w-full text-left p-3 rounded-xl flex items-center gap-3 hover:bg-white/10 text-red-100">
              <span className="material-icons-outlined">logout</span> লগআউট
            </button>
          </div>
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {activeTab === 'donors' ? 'রক্তদাতা ব্যবস্থাপনা' : activeTab === 'csv' ? 'CSV বাল্ক আপলোড' : 'বিজ্ঞাপন ব্যবস্থাপনা'}
          </h1>
          <div className="md:hidden">
             <button onClick={onBack} className="text-primary font-bold">লগআউট</button>
          </div>
        </div>

        {activeTab === 'donors' && (
          <div className="bg-white rounded-3xl shadow-soft p-6 border border-gray-100 animate-fade-in">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-500 font-medium">মোট দাতা: {donors.length} জন</p>
              <button onClick={fetchDonors} className="p-2 text-primary hover:bg-red-50 rounded-full transition-all">
                <span className="material-icons-outlined">refresh</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 text-sm">
                    <th className="pb-4 font-bold">নাম</th>
                    <th className="pb-4 font-bold">গ্রুপ</th>
                    <th className="pb-4 font-bold">লোকেশন</th>
                    <th className="pb-4 font-bold">ফোন</th>
                    <th className="pb-4 font-bold">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {donors.map(donor => (
                    <tr key={donor.id} className="text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                      <td className="py-4 font-bold text-gray-800">{donor.name}</td>
                      <td className="py-4"><span className="bg-red-100 text-primary px-2 py-1 rounded-md font-bold">{donor.bloodGroup}</span></td>
                      <td className="py-4">{donor.district}, {donor.upazila}</td>
                      <td className="py-4">{donor.phone}</td>
                      <td className="py-4">
                        <button onClick={() => handleDeleteDonor(donor.id)} className="text-red-400 hover:text-red-600 p-2 transition-all">
                          <span className="material-icons-outlined">delete_outline</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'csv' && (
          <div className="max-w-2xl bg-white rounded-3xl shadow-soft p-10 text-center animate-fade-in border border-gray-100">
            <span className="material-icons-outlined text-7xl text-gray-200 mb-6">cloud_upload</span>
            <h3 className="text-xl font-bold mb-4">CSV ফাইল থেকে ডাটা ইম্পোর্ট করুন</h3>
            <p className="text-gray-400 mb-8 text-sm">আপনার ফাইলের ফরম্যাট হতে হবে: <br/><b>Name, BloodGroup, Division, District, Upazila, Phone</b></p>
            
            <label className="cursor-pointer bg-primary text-white py-4 px-8 rounded-2xl font-bold shadow-lg hover:bg-primary-dark transition-all inline-block">
              {loading ? 'প্রসেসিং হচ্ছে...' : 'ফাইল সিলেক্ট করুন'}
              <input type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" disabled={loading} />
            </label>
          </div>
        )}

        {activeTab === 'ads' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-soft p-8 border border-gray-100">
              <h3 className="text-xl font-bold mb-6">নতুন বিজ্ঞাপন যোগ করুন</h3>
              <form onSubmit={handleAddAd} className="space-y-4">
                <input type="text" placeholder="বিজ্ঞাপনের শিরোনাম" required value={adForm.title} onChange={e => setAdForm({...adForm, title: e.target.value})} className="w-full p-4 rounded-xl border border-gray-100 focus:ring-primary outline-none" />
                <input type="url" placeholder="ইমেজ URL (Direct Link)" required value={adForm.imageUrl} onChange={e => setAdForm({...adForm, imageUrl: e.target.value})} className="w-full p-4 rounded-xl border border-gray-100 focus:ring-primary outline-none" />
                <input type="url" placeholder="লিঙ্ক (যেমন: ফেসবুক পেজ)" required value={adForm.link} onChange={e => setAdForm({...adForm, link: e.target.value})} className="w-full p-4 rounded-xl border border-gray-100 focus:ring-primary outline-none" />
                <select value={adForm.position} onChange={e => setAdForm({...adForm, position: e.target.value as any})} className="w-full p-4 rounded-xl border border-gray-100 focus:ring-primary outline-none">
                  <option value="hero">হিরো সেকশন</option>
                  <option value="search-bottom">সার্চ বক্সের নিচে</option>
                  <option value="footer-top">ফুটারের উপরে</option>
                </select>
                <button type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg">পাবলিশ করুন</button>
              </form>
            </div>

            <div className="bg-white rounded-3xl shadow-soft p-8 border border-gray-100">
              <h3 className="text-xl font-bold mb-6">চলমান বিজ্ঞাপনসমূহ</h3>
              <div className="space-y-4">
                {ads.map(ad => (
                  <div key={ad.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <img src={ad.imageUrl} alt={ad.title} className="w-16 h-16 rounded-lg object-cover bg-gray-200" />
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-gray-800">{ad.title}</h4>
                      <p className="text-[10px] text-gray-400">{ad.position}</p>
                    </div>
                    <button onClick={() => toggleAdStatus(ad)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${ad.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                      {ad.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
