import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { BloodRequest } from '../types';

const LiveRequestTicker: React.FC = () => {
  const [requests, setRequests] = useState<BloodRequest[]>([]);

  useEffect(() => {
    if (!db) return;

    const q = query(
      collection(db, "blood_requests"),
      where("isActive", "==", true)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BloodRequest));
      const sortedList = list.sort((a, b) => 
        new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
      );
      setRequests(sortedList);
    }, (error) => {
      console.error("Ticker fetch error:", error);
    });

    return () => unsubscribe();
  }, []);

  if (requests.length === 0) return null;

  const displayList = [...requests, ...requests];

  return (
    <div className="bg-primary text-white py-2 overflow-hidden border-y border-red-500/20 relative z-30 shadow-sm">
      <div className="flex whitespace-nowrap animate-marquee">
        {displayList.map((req, idx) => (
          <div key={`${req.id}-${idx}`} className="flex items-center gap-6 px-12 border-r border-white/10 last:border-none">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse-fast"></span>
              <span className="text-[9px] font-bold tracking-widest uppercase opacity-80">Live</span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="bg-white text-primary px-2 py-0.5 rounded-md font-black text-xs">{req.bloodGroup}</span>
              <span className="font-bold text-xs tracking-tight">{req.district}-এ রক্ত প্রয়োজন</span>
            </div>

            <div className="flex items-center gap-2 text-[11px] opacity-90">
              <span className="material-icons-outlined text-xs">location_on</span>
              <span>{req.hospitalName}</span>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-bold text-red-100">
              <span className="material-icons-outlined text-xs">schedule</span>
              <span>{req.requiredWithin}</span>
            </div>

            <a 
              href={`tel:${req.contactNumber}`} 
              className="bg-white/20 hover:bg-white hover:text-primary px-2.5 py-1 rounded-full text-[9px] font-bold transition-all flex items-center gap-1"
            >
              <span className="material-icons-outlined text-[10px]">call</span>
              কল
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveRequestTicker;