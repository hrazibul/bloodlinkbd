
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black dark:bg-[#0A0A0A] text-gray-400 py-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-4 mb-6">
              <span className="material-icons-outlined text-primary text-3xl">water_drop</span>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white tracking-tight">ব্লাডলিঙ্ক বাংলাদেশ</span>
                <span className="text-[9px] text-gray-500 italic">প্রযুক্তির সেতুতে, জীবনের টানে</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              আমরা একটি সেবামূলক প্ল্যাটফর্ম যা রক্তদাতা এবং গ্রহীতার মধ্যে দ্রুত যোগাযোগ নিশ্চিত করতে কাজ করে। আমাদের লক্ষ্য হচ্ছে জরুরি সময়ে রক্তের অভাব দূর করে প্রতিটি জীবন রক্ষা করা।
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold text-lg mb-6">দ্রুত লিংক</h4>
            <ul className="space-y-4 text-sm">
              <li><a className="hover:text-primary transition-colors flex items-center gap-2" href="#"><span className="material-icons-outlined text-xs">arrow_forward</span> রক্তদানের সুবিধা</a></li>
              <li><a className="hover:text-primary transition-colors flex items-center gap-2" href="#"><span className="material-icons-outlined text-xs">arrow_forward</span> নিকটস্থ ব্লাড ব্যাংক</a></li>
              <li><a className="hover:text-primary transition-colors flex items-center gap-2" href="#"><span className="material-icons-outlined text-xs">arrow_forward</span> প্রাইভেসি পলিসি</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-6">যোগাযোগ</h4>
            <ul className="space-y-5 text-sm">
              <li className="flex items-start gap-4 group">
                <span className="material-icons-outlined text-primary group-hover:scale-110 transition-transform">call</span>
                <div>
                  <p className="text-gray-500 text-xs mb-1">হেল্পলাইন</p>
                  <p className="text-gray-300 font-medium">+৮৮০ ১৭১৬৫৯৬৯২৯</p>
                </div>
              </li>
              <li className="flex items-start gap-4 group">
                <span className="material-icons-outlined text-primary group-hover:scale-110 transition-transform">email</span>
                <div>
                  <p className="text-gray-500 text-xs mb-1">ইমেইল করুন</p>
                  <p className="text-gray-300">hello@bloodlinkbd.com</p>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-6">সোশ্যাল কানেক্ট</h4>
            <div className="flex flex-wrap gap-4 mb-8">
              <a href="#" className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                 <span className="material-icons-outlined text-lg">facebook</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                 <span className="material-icons-outlined text-lg">link</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-10 text-center text-xs text-gray-500">
          <p className="mb-3">@২০২৬ ।। ব্লাডলিঙ্ক বাংলাদেশ (BloodLink BD)। সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center justify-center gap-1">
            তৈরি করেছে: <a href="#" className="text-primary hover:underline font-bold ml-1">aikitbd</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
