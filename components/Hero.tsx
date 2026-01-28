import React from 'react';

interface HeroProps {
  onRegisterClick: (e: React.MouseEvent) => void;
}

const Hero: React.FC<HeroProps> = ({ onRegisterClick }) => {
  return (
    <div className="bg-secondary dark:bg-[#2C1A1A] pb-4 pt-10 relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
        <div className="inline-flex items-center gap-2 bg-[#FFCDD2] dark:bg-red-900/30 text-primary dark:text-red-200 px-4 py-1 rounded-full text-xs font-semibold mb-6 animate-bounce">
          <span className="material-icons-outlined text-sm">favorite</span>
          রক্ত দিন, জীবন বাঁচান
        </div>
        
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight mb-4">
          "আপনার এক ব্যাগ রক্ত, বাঁচাতে পারে একটি প্রাণ"
        </h1>
        
        <p className="text-muted-light dark:text-muted-dark mb-6 text-base md:text-lg max-w-2xl mx-auto">
          ব্লাডলিঙ্ক বাংলাদেশ-এ যুক্ত হয়ে আপনিও হতে পারেন একজন জীবনদাতা। আমাদের বিশাল নেটওয়ার্ক থেকে খুঁজে নিন আপনার নিকটস্থ রক্তদাতাকে।
        </p>
        
        <button 
          onClick={onRegisterClick}
          className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white font-medium py-4 px-10 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 gap-2 mb-2"
        >
          <span className="material-icons-outlined">favorite_border</span>
          রক্তদাতা হিসেবে নিবন্ধন করুন
        </button>
      </div>

      {/* Background Decorative Blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-5 rounded-full blur-3xl -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary opacity-5 rounded-full blur-3xl -ml-40 -mb-40"></div>
    </div>
  );
};

export default Hero;