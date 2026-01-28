
import React from 'react';
import { BLOOD_GROUPS } from '../constants';

const BloodGroups: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-text-light dark:text-text-dark">রক্তের গ্রুপ</h2>
        <div className="h-1 w-16 bg-primary mx-auto rounded-full mt-4"></div>
      </div>
      <div className="flex flex-wrap justify-center gap-4 md:gap-8">
        {BLOOD_GROUPS.map((bg) => (
          <button 
            key={bg} 
            className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary hover:bg-primary-dark text-white font-bold text-xl md:text-2xl shadow-lg flex items-center justify-center transition-all transform hover:scale-110 hover:rotate-6 active:scale-90"
          >
            {bg}
          </button>
        ))}
      </div>
    </section>
  );
};

export default BloodGroups;
