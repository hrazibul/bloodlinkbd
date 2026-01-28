import React, { useState } from 'react';
// Import Auth functions from local firebase.ts to ensure consistency and fix module resolution errors
import { auth, signInWithEmailAndPassword } from '../firebase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Authenticate user using modular Firebase SDK standard method from local config
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      onSuccess(userCredential.user.email || '');
      onClose();
    } catch (err: any) {
      console.error("Login error:", err);
      setError('ইমেইল বা পাসওয়ার্ড ভুল হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white dark:bg-surface-dark w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden border border-white/10">
        <div className="p-10">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">লগইন করুন</h3>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <input 
              type="email" required placeholder="ইমেইল"
              value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border dark:bg-[#252525]"
            />
            <input 
              type="password" required placeholder="পাসওয়ার্ড"
              value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border dark:bg-[#252525]"
            />
            {error && <p className="text-primary text-xs font-bold text-center">{error}</p>}
            <button type="submit" disabled={loading} className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-xl">
              {loading ? 'প্রবেশ করছে...' : 'প্রবেশ করুন'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;