
import React, { useState } from 'react';

interface NavbarProps {
  onRegisterClick: (e: React.MouseEvent) => void;
  onLoginClick: () => void;
  user: any;
  onLogout: () => void;
  isAdmin: boolean;
  onAdminClick: () => void;
  onProfileClick: () => void;
  onHomeClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  onRegisterClick, 
  onLoginClick, 
  user, 
  onLogout, 
  isAdmin, 
  onAdminClick,
  onProfileClick,
  onHomeClick
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onHomeClick();
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  return (
    <nav className="bg-surface-light dark:bg-surface-dark shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-4 cursor-pointer" onClick={handleHomeClick}>
            <div className="relative w-12 h-14 flex items-center justify-center">
              <span className="material-icons-outlined text-primary text-4xl relative z-10 drop-shadow-md">water_drop</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-bold text-primary leading-tight tracking-tight">ব্লাডলিঙ্ক বাংলাদেশ</span>
              <span className="text-[9px] md:text-[11px] text-muted-light dark:text-muted-dark font-medium -mt-1 italic">প্রযুক্তির সেতুতে, জীবনের টানে</span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <a className="text-text-light dark:text-text-dark hover:text-primary transition-colors" href="#" onClick={handleHomeClick}>হোম</a>
            
            {!user && (
              <button 
                onClick={onRegisterClick}
                className="text-text-light dark:text-text-dark hover:text-primary transition-colors bg-transparent border-none cursor-pointer font-medium"
              >
                রক্তদাতা হোন
              </button>
            )}
            
            <a className="text-text-light dark:text-text-dark hover:text-primary transition-colors" href="#organizations">সংগঠনসমূহ</a>
            
            {user ? (
              <div className="flex items-center gap-4">
                <button 
                  onClick={onProfileClick}
                  className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg font-bold hover:bg-gray-200 transition-all flex items-center gap-2"
                >
                  <span className="material-icons-outlined text-sm">account_circle</span>
                  প্রোফাইল
                </button>
                {isAdmin && (
                  <button 
                    onClick={onAdminClick}
                    className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-bold hover:bg-primary hover:text-white transition-all"
                  >
                    ড্যাশবোর্ড
                  </button>
                )}
                <button 
                  onClick={onLogout}
                  className="text-muted-light dark:text-muted-dark hover:text-primary transition-all font-bold text-xs"
                >
                  লগআউট
                </button>
              </div>
            ) : (
              <button 
                onClick={onLoginClick}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg transition-all shadow-md flex items-center gap-2 hover:scale-105 active:scale-95"
              >
                <span className="material-icons-outlined text-sm">person</span>
                লগইন
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 dark:text-gray-300 hover:text-primary"
            >
              <span className="material-icons-outlined text-3xl">
                {isMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-surface-light dark:bg-surface-dark border-t dark:border-gray-800 p-4 space-y-4 shadow-xl animate-fade-in">
          <a className="block text-text-light dark:text-text-dark font-medium px-2" href="#" onClick={handleHomeClick}>হোম</a>
          {!user && <button onClick={(e) => { onRegisterClick(e); setIsMenuOpen(false); }} className="block w-full text-left text-text-light dark:text-text-dark font-medium px-2">রক্তদাতা হোন</button>}
          {user && (
            <>
              <button onClick={() => { onProfileClick(); setIsMenuOpen(false); }} className="block w-full text-left text-text-light dark:text-text-dark font-medium px-2">আমার প্রোফাইল</button>
              {isAdmin && (
                <button onClick={() => { onAdminClick(); setIsMenuOpen(false); }} className="block w-full text-left text-primary font-bold px-2">অ্যাডমিন ড্যাশবোর্ড</button>
              )}
              <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="w-full bg-gray-100 text-gray-600 py-3.5 rounded-xl font-bold">লগআউট</button>
            </>
          )}
          {!user && (
            <button onClick={() => { onLoginClick(); setIsMenuOpen(false); }} className="w-full bg-primary text-white py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg">
              <span className="material-icons-outlined text-sm">person</span> লগইন
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
