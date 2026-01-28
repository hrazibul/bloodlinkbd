
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, auth, db, ADMIN_EMAIL } from './firebase';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LiveRequestTicker from './components/LiveRequestTicker';
import SearchBox from './components/SearchBox';
import Features from './components/Features';
import BloodGroups from './components/BloodGroups';
import Footer from './components/Footer';
import RegistrationModal from './components/RegistrationModal';
import LoginModal from './components/LoginModal';
import PostRequestModal from './components/PostRequestModal';
import AdminDashboard from './components/AdminDashboard';
import ProfileDashboard from './components/ProfileDashboard';
import { SearchFilters, Donor, Ad } from './types';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isProfileMode, setIsProfileMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [searchResults, setSearchResults] = useState<Donor[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isPostRequestModalOpen, setIsPostRequestModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeAd, setActiveAd] = useState<Ad | null>(null);

  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetchActiveAd();
    
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      setCurrentUser(user);
      if (user) {
        if (user.email === ADMIN_EMAIL) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
        setIsAdminMode(false);
        setIsProfileMode(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAiAssistant = async () => {
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    setAiResponse('');
    try {
      // Fix: Initialized GoogleGenAI with named parameter as per guidelines.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Fix: Selected 'gemini-3-pro-preview' for complex reasoning tasks like medical/eligibility Q&A.
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: aiQuery,
        config: {
          systemInstruction: "You are a specialized AI assistant for 'BloodLink BD', a blood donation platform in Bangladesh. Help users understand blood group compatibility, donation eligibility, and general health advice related to blood donation. Keep answers concise, helpful, and in the language of the query (Bengali or English).",
        }
      });
      // Fix: Accessed .text property directly from response as it is not a method.
      setAiResponse(response.text || 'দুঃখিত, কোনো উত্তর পাওয়া যায়নি।');
    } catch (error) {
      console.error("AI Assistant Error:", error);
      setAiResponse('দুঃখিত, এআই সার্ভারে সংযোগ করা সম্ভব হচ্ছে না।');
    } finally {
      setAiLoading(false);
    }
  };

  const fetchActiveAd = async () => {
    try {
      if (!db) return;
      const q = query(collection(db, "ads"), where("isActive", "==", true), limit(1));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const adData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Ad;
        setActiveAd(adData);
      }
    } catch (e: any) {
      console.error("Ad fetch error:", e);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsAdminMode(false);
    setIsProfileMode(false);
  };

  const handleSearch = async (filters: SearchFilters) => {
    setLoading(true);
    setHasSearched(true);
    try {
      if (!db) throw new Error("Database not initialized");
      const donorsRef = collection(db, "donors");
      let q = query(donorsRef);
      
      if (filters.division) q = query(q, where("division", "==", filters.division));
      if (filters.district) q = query(q, where("district", "==", filters.district));
      if (filters.upazila) q = query(q, where("upazila", "==", filters.upazila));
      if (filters.bloodGroup) q = query(q, where("bloodGroup", "==", filters.bloodGroup));
      if (filters.gender) q = query(q, where("gender", "==", filters.gender));
      if (filters.availability) q = query(q, where("availability", "==", filters.availability));
      
      const querySnapshot = await getDocs(q);
      const results: Donor[] = [];
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() } as Donor);
      });
      setSearchResults(results);
      
      setTimeout(() => {
        document.getElementById('search-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (error: any) {
      console.error("Search Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isAdminMode && isAdmin) {
    return <AdminDashboard onBack={() => setIsAdminMode(false)} />;
  }

  if (isProfileMode && currentUser) {
    return <ProfileDashboard userId={currentUser.uid} onBack={() => setIsProfileMode(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD] dark:bg-[#0F0F10] relative">
      <Navbar 
        onRegisterClick={() => setIsRegModalOpen(true)} 
        onLoginClick={() => setIsLoginModalOpen(true)}
        user={currentUser}
        onLogout={handleLogout}
        isAdmin={isAdmin}
        onAdminClick={() => { setIsAdminMode(true); setIsProfileMode(false); }}
        onProfileClick={() => { setIsProfileMode(true); setIsAdminMode(false); }}
      />
      
      <main className="flex-grow">
        <Hero onRegisterClick={() => setIsRegModalOpen(true)} />
        <LiveRequestTicker />
        <SearchBox onSearch={handleSearch} />

        <section className="max-w-5xl mx-auto px-4 mt-8 md:mt-12">
          <div className="bg-gradient-to-r from-red-50 to-white dark:from-red-900/10 dark:to-surface-dark p-6 rounded-2xl border border-red-100 dark:border-red-900/30 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <span className="material-icons-outlined">psychology</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 dark:text-white">ব্লাডলিঙ্ক এআই সাহায্যকারী</h3>
                <p className="text-xs text-gray-500">রক্তদান বা রক্ত পাওয়া নিয়ে কোনো প্রশ্ন আছে?</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="যেমন: 'আমি কি ডায়াবেটিস রোগী হয়ে রক্ত দিতে পারি?'"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAiAssistant()}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-800 dark:bg-[#252525] focus:ring-2 focus:ring-primary outline-none text-sm"
              />
              <button 
                onClick={handleAiAssistant}
                disabled={aiLoading}
                className="bg-primary text-white px-6 py-2 rounded-xl font-bold text-sm shadow-md hover:bg-primary-dark transition-all disabled:opacity-50"
              >
                {aiLoading ? 'খোঁজা হচ্ছে...' : 'জিজ্ঞাসা করুন'}
              </button>
            </div>

            {aiResponse && (
              <div className="mt-4 p-4 bg-white dark:bg-[#1A1A1B] rounded-xl border border-gray-50 dark:border-gray-800 animate-fade-in shadow-inner">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{aiResponse}</p>
              </div>
            )}
          </div>
        </section>

        {hasSearched && (
           <section id="search-results" className="max-w-7xl mx-auto px-4 py-20 scroll-mt-24">
             <div className="text-center mb-12">
               <h2 className="text-2xl font-bold flex items-center justify-center gap-3">
                 <span className="material-icons-outlined text-primary">person_search</span>
                 অনুসন্ধান ফলাফল ({searchResults.length})
               </h2>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {loading ? (
                 <div className="col-span-full text-center py-12">
                   <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                   <p className="text-gray-500 font-bold">খোঁজা হচ্ছে...</p>
                 </div>
               ) : searchResults.length > 0 ? (
                 searchResults.map((donor) => (
                   <div key={donor.id} className="bg-white dark:bg-surface-dark p-6 rounded-3xl shadow-soft border border-gray-100 dark:border-gray-800 animate-fade-in group hover:shadow-2xl transition-all duration-300">
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-14 h-14 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center text-primary font-black text-xl shadow-inner">
                          {donor.bloodGroup}
                        </div>
                        <div className={`text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm ${donor.availability.includes('৯০+') ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                          {donor.availability}
                        </div>
                      </div>
                      <h3 className="font-bold text-xl mb-1 text-gray-800 dark:text-white">{donor.name}</h3>
                      <div className="space-y-2 mb-6">
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <span className="material-icons-outlined text-sm">location_on</span>
                          {donor.district}, {donor.upazila}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <span className="material-icons-outlined text-sm">history</span>
                          শেষ দান: {donor.lastDonatedDate || 'তথ্য নেই'}
                        </p>
                      </div>
                      <a 
                        href={`tel:${donor.phone}`}
                        className="w-full bg-gray-50 dark:bg-gray-800/50 hover:bg-primary hover:text-white py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 font-bold text-sm shadow-sm group-hover:scale-[1.02]"
                      >
                        <span className="material-icons-outlined">call</span>
                        কল করুন
                      </a>
                   </div>
                 ))
               ) : (
                 <div className="col-span-full text-center py-24 bg-gray-50 dark:bg-gray-800/20 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-800">
                   <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                     <span className="material-icons-outlined text-4xl text-gray-300">search_off</span>
                   </div>
                   <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-2">কোনো দাতা পাওয়া যায়নি</h4>
                   <p className="text-gray-500 text-sm">আপনার সার্চ ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।</p>
                 </div>
               )}
             </div>
           </section>
        )}

        <Features />
        <BloodGroups />
      </main>

      <button 
        onClick={() => setIsPostRequestModalOpen(true)}
        className="fixed bottom-8 right-8 z-[90] bg-primary text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center group transition-all hover:scale-110 active:scale-90 border-4 border-white/20"
      >
        <span className="material-icons-outlined text-3xl">emergency</span>
      </button>

      <RegistrationModal isOpen={isRegModalOpen} onClose={() => setIsRegModalOpen(false)} onRegistrationSuccess={() => setIsProfileMode(true)} />
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onSuccess={(email) => {
          if (email === ADMIN_EMAIL) {
            setIsAdminMode(true);
            setIsProfileMode(false);
          } else {
            setIsProfileMode(true);
            setIsAdminMode(false);
          }
        }} 
      />
      <PostRequestModal isOpen={isPostRequestModalOpen} onClose={() => setIsPostRequestModalOpen(false)} />
      
      <Footer />
    </div>
  );
};

export default App;
