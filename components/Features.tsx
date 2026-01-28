
import React from 'react';

const Features: React.FC = () => {
  const features = [
    { icon: 'favorite', title: 'সহজ নিবন্ধন', desc: 'মাত্র কয়েক মিনিটে রক্তদাতা হিসেবে নিবন্ধন করুন' },
    { icon: 'people', title: 'বৃহৎ নেটওয়ার্ক', desc: 'সারা দেশে হাজারো স্বেচ্ছায় রক্তদাতা' },
    { icon: 'schedule', title: 'দ্রুত সন্ধান', desc: 'জরুরি প্রয়োজনে দ্রুত রক্তদাতা খুঁজে পান' },
    { icon: 'security', title: 'নিরাপদ তথ্য', desc: 'আপনার ব্যক্তিগত তথ্য সম্পূর্ণ সুরক্ষিত' },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-text-light dark:text-text-dark">কেন আমাদের সাথে যুক্ত হবেন?</h2>
        <div className="h-1 w-20 bg-primary mx-auto rounded-full mt-4"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((f, i) => (
          <div key={i} className="group bg-surface-light dark:bg-surface-dark p-8 rounded-2xl shadow-card hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-800 text-center transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
              <span className="material-icons-outlined text-3xl">{f.icon}</span>
            </div>
            <h3 className="font-bold text-xl mb-3">{f.title}</h3>
            <p className="text-sm text-muted-light dark:text-muted-dark leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
