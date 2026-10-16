import React, { useState } from 'react';
import { registerUser, loginUser, switchPersona, getAllUsers } from '../../services/storageService';
import { GHANA_REGIONS } from '../../data/ghanaRegions';
import { GhanaRegion } from '../../types';
import { X, CheckCircle, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [region, setRegion] = useState<GhanaRegion>('Greater Accra');
  const [city, setCity] = useState('East Legon, Accra');
  const [phone, setPhone] = useState('+233 ');
  const [bio, setBio] = useState('');
  const [error, setError] = useState<string | null>(null);

  const demoUsers = getAllUsers();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'login') {
      if (!email) {
        setError('Please enter your email address.');
        return;
      }
      const res = loginUser(email);
      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setError(res.error || 'Login failed.');
      }
    } else {
      if (!name || !email) {
        setError('Please fill in your name and email address.');
        return;
      }
      const res = registerUser({
        name,
        email,
        password,
        region,
        city,
        phone,
        bio
      });
      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setError(res.error || 'Registration failed.');
      }
    }
  };

  const handleQuickSwitch = (userId: string) => {
    switchPersona(userId);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-neutral-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-md bg-[#006B45] text-[#F7B718] flex items-center justify-center font-bold text-xs">
              GC
            </span>
            <h3 className="text-base font-bold text-neutral-900">
              {mode === 'login' ? 'Sign In to GoldCoast Trade' : 'Join Ghana Barter Community'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          
          {/* Quick Switch Persona (Crucial for test flow: Kwame -> Ama -> Admin) */}
          <div className="mb-6 p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/80">
            <div className="text-[11px] font-semibold text-neutral-600 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1 text-[#006B45]">
                <UserCheck className="w-3.5 h-3.5" />
                Quick Test Traders (1-Click Login):
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {demoUsers.slice(0, 4).map(u => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickSwitch(u.id)}
                  className="flex items-center gap-2 p-1.5 rounded-lg border border-neutral-200 bg-white hover:border-[#006B45] hover:bg-emerald-50/50 transition-colors text-left cursor-pointer truncate"
                >
                  <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
                  <div className="truncate">
                    <div className="font-semibold text-neutral-900 truncate text-[11px]">{u.name}</div>
                    <div className="text-[10px] text-neutral-500 truncate">{u.city}</div>
                  </div>
                </button>
              ))}
            </div>
            {demoUsers.find(u => u.role === 'admin') && (
              <button
                type="button"
                onClick={() => handleQuickSwitch('admin_kofi')}
                className="mt-2 w-full py-1 text-center text-[11px] font-medium text-amber-800 hover:text-amber-900 bg-amber-50 rounded border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
              >
                Log in as Admin (Kofi Boateng - Accra)
              </button>
            )}
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex border-b border-neutral-200 mb-5">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); }}
              className={`pb-2.5 text-xs font-semibold px-4 cursor-pointer transition-colors border-b-2 ${
                mode === 'login'
                  ? 'border-[#006B45] text-[#006B45]'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Sign In with Email
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(null); }}
              className={`pb-2.5 text-xs font-semibold px-4 cursor-pointer transition-colors border-b-2 ${
                mode === 'register'
                  ? 'border-[#006B45] text-[#006B45]'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Create Real Account
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Full Name / Business Trade Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Yaw Boakye or Tech Ghana Ltd"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:outline-none focus:border-[#006B45] focus:ring-1 focus:ring-[#006B45]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="you@domain.gh or gmail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:outline-none focus:border-[#006B45] focus:ring-1 focus:ring-[#006B45]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Password *
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:outline-none focus:border-[#006B45] focus:ring-1 focus:ring-[#006B45]"
              />
            </div>

            {mode === 'register' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      Ghana Region *
                    </label>
                    <select
                      value={region}
                      onChange={e => {
                        const reg = e.target.value as GhanaRegion;
                        setRegion(reg);
                        const regInfo = GHANA_REGIONS.find(r => r.name === reg);
                        if (regInfo && regInfo.popularTowns[0]) {
                          setCity(regInfo.popularTowns[0]);
                        }
                      }}
                      className="w-full px-2.5 py-2 text-xs rounded-lg border border-neutral-300 focus:outline-none focus:border-[#006B45]"
                    >
                      {GHANA_REGIONS.map(r => (
                        <option key={r.name} value={r.name}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      Town / Suburb *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Osu, Kumasi Adum, Tema"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:outline-none focus:border-[#006B45]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Phone / WhatsApp (Kept Private until Trade Accepted)
                  </label>
                  <input
                    type="tel"
                    placeholder="+233 24 123 4567"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:outline-none focus:border-[#006B45]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Trader Bio / What items or skills you often barter
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Electrician with 5 years experience looking to trade wiring jobs for solar panels."
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:outline-none focus:border-[#006B45]"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-semibold text-white bg-[#006B45] hover:bg-[#004D31] rounded-lg transition-colors shadow-sm cursor-pointer mt-2"
            >
              {mode === 'login' ? 'Sign In' : 'Create Trader Account'}
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
