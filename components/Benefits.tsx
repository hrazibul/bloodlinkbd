
import React from 'react';

const Benefits: React.FC<{onBack: () => void}> = ({ onBack }) => {
  const benefits = [
    {
      title: 'হৃদরোগের ঝুঁকি হ্রাস',
      desc: 'নিয়মিত রক্তদান করলে শরীরে আয়রনের ভারসাম্য বজায় থাকে। এটি রক্তচাপ নিয়ন্ত্রণে রাখতে সাহায্য করে এবং হৃদরোগ ও হার্ট অ্যাটাকের ঝুঁকি অনেকাংশে কমিয়ে দেয়।',
      icon: 'favorite'
    },
    {
      title: 'নতুন রক্তকণিকা সৃষ্টি',
      desc: 'রক্ত দেওয়ার পর শরীরের রক্তশূন্যতা পূরণের জন্য অস্থিমজ্জা (Bone Marrow) নতুন রক্তকণিকা তৈরির প্রক্রিয়া শুরু করে। এর ফলে শরীরে নতুন এবং কর্মক্ষম রক্তকণিকা সৃষ্টি হয়।',
      icon: 'auto_awesome'
    },
    {
      title: 'ক্যান্সারের ঝুঁকি কমানো',
      desc: 'শরীরে আয়রনের পরিমাণ বেশি থাকলে তা লিভার, কোলন ও ফুসফুসের ক্যান্সারের ঝুঁকি বাড়াতে পারে। নিয়মিত রক্তদান করলে আয়রনের মাত্রা সঠিক থাকে।',
      icon: 'health_and_safety'
    },
    {
      title: 'রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি',
      desc: 'রক্তদানের ফলে শরীরের রোগ প্রতিরোধ ক্ষমতা (Immune System) আরও শক্তিশালী হয় এবং সামগ্রিক স্বাস্থ্যের উন্নতি ঘটে।',
      icon: 'shield'
    },
    {
      title: 'বিনামূল্যে স্বাস্থ্য পরীক্ষা',
      desc: 'রক্তদানের আগে দাতার রক্তচাপ, এবং হিমোগ্লোবিনের মাত্রা পরীক্ষা করা হয়। এছাড়া হেপাটাইটিস-বি, সি, এইচআইভি-র মতো বড় কিছু রোগের স্ক্রিনিংও হয়ে যায়।',
      icon: 'clinical_notes'
    },
    {
      title: 'মানসিক প্রশান্তি ও আত্মতৃপ্তি',
      desc: 'এক ব্যাগ রক্ত দিয়ে আপনি একজনের জীবন বাঁচাচ্ছেন—এই অনুভূতি দাতার মানসিক চাপ কমিয়ে প্রশান্তি দেয় এবং আত্মবিশ্বাস বৃদ্ধি করে।',
      icon: 'psychology'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-primary font-bold mb-8 hover:underline">
        <span className="material-icons-outlined">arrow_back</span>
        ফিরে যান
      </button>

      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6">রক্তদানের অসামান্য উপকারিতা</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          রক্তদান শুধু অন্যের জীবন বাঁচায় না, এটি দাতার নিজের শরীরের জন্যও অত্যন্ত উপকারী।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {benefits.map((b, i) => (
          <div key={i} className="bg-white dark:bg-surface-dark p-8 rounded-3xl shadow-soft border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
              <span className="material-icons-outlined">{b.icon}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{b.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{b.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-red-50 dark:bg-red-900/10 p-8 rounded-3xl border border-red-100 dark:border-red-900/20 text-center">
        <h4 className="font-bold text-gray-800 dark:text-white mb-4">মনে রাখবেন:</h4>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          ১৮ থেকে ৬০ বছর বয়সী যেকোনো সুস্থ মানুষ, যাদের ওজন ৪৫ কেজির উপরে, তারা প্রতি ৩-৪ মাস অন্তর রক্তদান করতে পারেন।
        </p>
      </div>
    </div>
  );
};

export default Benefits;
