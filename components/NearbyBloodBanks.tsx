
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

const NearbyBloodBanks: React.FC<{onBack: () => void}> = ({ onBack }) => {
  const [banks, setBanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sources, setSources] = useState<any[]>([]);

  const findNearbyBanks = async (lat: number, lng: number) => {
    setLoading(true);
    setError('');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Find blood banks, hospitals with blood banks, and Red Crescent centers near my location. List their names, addresses, and phone numbers if available.",
        config: {
          tools: [{googleMaps: {}}],
          toolConfig: {
            retrievalConfig: {
              latLng: { latitude: lat, longitude: lng }
            }
          }
        },
      });

      // Extract text and grounding chunks for map links
      const text = response.text;
      const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      
      // In a real app we'd parse the text or ask for JSON, but for grounding we want to show URLs
      setSources(grounding.filter((g: any) => g.maps).map((g: any) => g.maps));
      setBanks([{ name: "Results from Google Maps", details: text }]);
    } catch (err) {
      console.error(err);
      setError('তথ্য খুঁজে পাওয়া যায়নি। দয়া করে আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setError('আপনার ব্রাউজার লোকেশন সাপোর্ট করে না।');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => findNearbyBanks(pos.coords.latitude, pos.coords.longitude),
      () => {
        setError('লোকেশন অ্যাক্সেস পাওয়া যায়নি।');
        setLoading(false);
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-primary font-bold mb-8 hover:underline">
        <span className="material-icons-outlined">arrow_back</span>
        ফিরে যান
      </button>

      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">নিকটস্থ ব্লাড ব্যাংক ও হাসপাতাল</h1>
        <p className="text-gray-500">আপনার বর্তমান অবস্থানের আশেপাশে রক্তের উৎসগুলো খুঁজে নিন।</p>
      </div>

      <div className="flex justify-center mb-12">
        <button 
          onClick={handleLocate}
          disabled={loading}
          className="bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-xl flex items-center gap-3 hover:bg-primary-dark transition-all disabled:opacity-50"
        >
          <span className="material-icons-outlined">{loading ? 'sync' : 'my_location'}</span>
          {loading ? 'খোঁজা হচ্ছে...' : 'আমার চারপাশ দেখুন'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-xl text-center mb-8 border border-red-100">
          {error}
        </div>
      )}

      {banks.length > 0 && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-surface-dark p-8 rounded-3xl shadow-soft border border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="material-icons-outlined text-primary">map</span>
              ম্যাপ থেকে পাওয়া তথ্য:
            </h2>
            <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
              {banks[0].details}
            </div>
          </div>

          {sources.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sources.map((src, i) => (
                <a 
                  key={i} 
                  href={src.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl hover:bg-red-50 transition-colors border border-gray-100 dark:border-gray-800"
                >
                  <span className="font-bold text-sm truncate pr-4">{src.title || 'View on Maps'}</span>
                  <span className="material-icons-outlined text-primary">open_in_new</span>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NearbyBloodBanks;
