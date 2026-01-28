
import React from 'react';

const PrivacyPolicy: React.FC<{onBack: () => void}> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-primary font-bold mb-8 hover:underline">
        <span className="material-icons-outlined">arrow_back</span>
        ফিরে যান
      </button>

      <div className="bg-white dark:bg-surface-dark p-10 md:p-16 rounded-[3rem] shadow-soft border border-gray-100 dark:border-gray-800">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">প্রাইভেসি পলিসি</h1>
        
        <div className="space-y-8 text-gray-600 dark:text-gray-400 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">তথ্য সংগ্রহ</h2>
            <p>ব্লাডলিঙ্ক বাংলাদেশ (BloodLink BD) শুধুমাত্র আপনার নাম, রক্তের গ্রুপ, ফোন নম্বর এবং অবস্থান সংগ্রহ করে যা রক্তদাতা এবং গ্রহীতার মধ্যে দ্রুত যোগাযোগ নিশ্চিত করতে ব্যবহৃত হয়।</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">তথ্যের ব্যবহার</h2>
            <p>আপনার ফোন নম্বরটি ডিফল্টভাবে গ্রহীতাদের জন্য উন্মুক্ত রাখা হয় যাতে জরুরি মুহূর্তে তারা সরাসরি কল করতে পারে। তবে আপনি প্রোফাইল সেটিং থেকে এটি নিয়ন্ত্রণ করার সুবিধা ভবিষ্যতে পাবেন।</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">নিরাপত্তা</h2>
            <p>আমরা আপনার তথ্যের সর্বোচ্চ নিরাপত্তা নিশ্চিত করতে আধুনিক প্রযুক্তির ব্যবহার করি। আপনার ব্যক্তিগত তথ্য বাণিজ্যিক উদ্দেশ্যে কোনো তৃতীয় পক্ষের কাছে বিক্রি বা শেয়ার করা হয় না।</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">যোগাযোগ</h2>
            <p>আমাদের প্রাইভেসি পলিসি সম্পর্কে কোনো প্রশ্ন থাকলে hello@bloodlinkbd.com এ ইমেইল করতে পারেন।</p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-50 dark:border-gray-800 text-xs text-gray-400">
          সর্বশেষ আপডেট: ১ মার্চ, ২০২৬
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
