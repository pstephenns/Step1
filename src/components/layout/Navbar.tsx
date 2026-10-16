import React, { useState, useEffect } from 'react';
import {
  getCurrentUser,
  getNotifications,
  getConversations,
  logoutUser,
  switchPersona,
  getAllUsers,
  subscribeToStore
} from '../../services/storageService';
import { User } from '../../types';
import {
  PlusCircle,
  Bell,
  MessageSquare,
  ShieldCheck,
  ChevronDown,
  User as UserIcon,
  LogOut,
  Repeat,
  Heart,
  Sliders,
  ShieldAlert
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
  openAuthModal: () => void;
  openSafetyModal: () => void;
  openCalculatorModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  navigate,
  openAuthModal,
  openSafetyModal,
  openCalculatorModal
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(getCurrentUser());
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const allUsers = getAllUsers();

  const refreshState = () => {
    const user = getCurrentUser();
    setCurrentUser(user);

    if (user) {
      const notifs = getNotifications();
      setUnreadNotifs(notifs.filter(n => !n.read).length);

      const convs = getConversations(user.id);
      const totalUnread = convs.reduce((acc, c) => acc + (c.unreadCountFor[user.id] || 0), 0);
      setUnreadMessages(totalUnread);
    } else {
      setUnreadNotifs(0);
      setUnreadMessages(0);
    }
  };

  useEffect(() => {
    refreshState();
    const unsubscribe = subscribeToStore(refreshState);
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    logoutUser();
    setShowUserMenu(false);
    navigate('/');
  };

  const handleSwitchTrader = (userId: string) => {
    switchPersona(userId);
    setShowPersonaMenu(false);
    setShowUserMenu(false);
  };

  return (
    <>
      {/* Persona quick switch notice banner */}
      <div className="bg-[#004D31] text-emerald-100 text-xs py-1.5 px-4 border-b border-[#006B45]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#F7B718] font-semibold">🇬🇭 Ghana Barter Network</span>
            <span className="text-emerald-300 hidden sm:inline">· Trade Goods & Services in Accra, Kumasi & Nationwide</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={openSafetyModal}
              className="text-[#F7B718] hover:underline flex items-center gap-1 font-medium text-xs cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#F7B718]" />
              Safe Trade Tips
            </button>
            <div className="relative">
              <button
                onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                className="text-xs bg-[#006B45] hover:bg-[#0B8F5E] text-white px-2 py-0.5 rounded flex items-center gap-1 transition-colors cursor-pointer"
                title="Switch demo account to test 2-sided barter negotiation and completion"
              >
                <span>Active: <strong>{currentUser ? currentUser.name.split(' ')[0] : 'Guest'}</strong></span>
                <ChevronDown className="w-3 h-3 opacity-80" />
              </button>

              {showPersonaMenu && (
                <div className="absolute right-0 top-full mt-1.5 w-60 bg-white text-neutral-900 rounded-lg shadow-xl border border-neutral-200 py-1.5 z-50 text-xs">
                  <div className="px-3 py-1 font-semibold text-neutral-500 border-b border-neutral-100">
                    Switch Test Trader (2-Sided Barter Flow)
                  </div>
                  {allUsers.map(u => (
                    <button
                      key={u.id}
                      onClick={() => handleSwitchTrader(u.id)}
                      className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-neutral-50 cursor-pointer ${
                        currentUser?.id === u.id ? 'bg-emerald-50 text-[#006B45] font-semibold' : ''
                      }`}
                    >
                      <img src={u.avatar} alt={u.name} className="w-5 h-5 rounded-full object-cover" />
                      <div className="flex-1 truncate">
                        <div className="truncate">{u.name} {u.role === 'admin' ? '(Admin)' : ''}</div>
                        <div className="text-[10px] text-neutral-400">{u.city}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Top Bar - Strictly Adhering to the Top Bar Contract:
          [Brand title, 1 line] — [4-5 nav links, 1-2 words, single line] — [1 primary action] */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => navigate('/')}
            className="text-xl sm:text-2xl font-bold tracking-tight text-[#006B45] whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <span className="w-8 h-8 rounded-lg bg-[#006B45] text-[#F7B718] flex items-center justify-center font-black text-base shadow-sm">
              GC
            </span>
            <span>GoldCoast<span className="text-[#D49B0E]">Trade</span></span>
          </button>

          {/* Zone 2: 4-5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-600">
            <button
              onClick={() => navigate('/marketplace')}
              className={`hover:text-[#006B45] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentPath === '/marketplace' ? 'text-[#006B45] font-semibold' : ''
              }`}
            >
              Marketplace
            </button>
            <button
              onClick={() => navigate('/offers')}
              className={`hover:text-[#006B45] transition-colors whitespace-nowrap shrink-0 relative cursor-pointer ${
                currentPath === '/offers' ? 'text-[#006B45] font-semibold' : ''
              }`}
            >
              Trade Offers
            </button>
            <button
              onClick={() => navigate('/messages')}
              className={`hover:text-[#006B45] transition-colors whitespace-nowrap shrink-0 relative cursor-pointer ${
                currentPath === '/messages' ? 'text-[#006B45] font-semibold' : ''
              }`}
            >
              Messages
              {unreadMessages > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-[#006B45] text-white text-[10px] font-bold rounded-full">
                  {unreadMessages}
                </span>
              )}
            </button>
            <button
              onClick={openCalculatorModal}
              className="hover:text-[#006B45] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Value Calculator
            </button>
            <button
              onClick={openSafetyModal}
              className="hover:text-[#006B45] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Safe Exchange
            </button>
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className={`hover:text-[#006B45] transition-colors whitespace-nowrap shrink-0 text-amber-700 font-semibold cursor-pointer ${
                  currentPath === '/admin' ? 'text-amber-900 underline' : ''
                }`}
              >
                Admin Panel
              </button>
            )}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/notifications')}
                  className="p-2 text-neutral-600 hover:text-[#006B45] hover:bg-neutral-100 rounded-lg transition-colors relative cursor-pointer"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifs > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F7B718] rounded-full ring-2 ring-white" />
                  )}
                </button>

                <button
                  onClick={() => navigate('/create-listing')}
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#006B45] hover:bg-[#004D31] rounded-lg transition-colors shadow-sm cursor-pointer whitespace-nowrap"
                >
                  <PlusCircle className="w-4 h-4 text-[#F7B718]" />
                  <span>List for Barter</span>
                </button>

                {/* Profile menu button */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1 pl-2 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer border border-neutral-200"
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-7 h-7 rounded-full object-cover border border-emerald-600/30"
                    />
                    <span className="text-xs font-semibold text-neutral-800 max-w-[90px] truncate hidden lg:inline">
                      {currentUser.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-neutral-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-neutral-100">
                        <p className="text-xs font-semibold text-neutral-900 truncate">{currentUser.name}</p>
                        <p className="text-[11px] text-neutral-500 truncate">{currentUser.email}</p>
                        <p className="text-[10px] text-emerald-700 font-medium mt-0.5">
                          {currentUser.city} · ★ {currentUser.trustRating}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate('/dashboard');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 cursor-pointer"
                      >
                        <Sliders className="w-4 h-4 text-neutral-400" />
                        My Trader Dashboard
                      </button>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate(`/user/${currentUser.id}`);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 cursor-pointer"
                      >
                        <UserIcon className="w-4 h-4 text-neutral-400" />
                        Public Trader Profile
                      </button>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate('/favourites');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 cursor-pointer"
                      >
                        <Heart className="w-4 h-4 text-neutral-400" />
                        Saved Wishlist
                      </button>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate('/offers');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 cursor-pointer"
                      >
                        <Repeat className="w-4 h-4 text-neutral-400" />
                        Trade Offers & History
                      </button>

                      {currentUser.role === 'admin' && (
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            navigate('/admin');
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-amber-700 font-semibold hover:bg-amber-50 flex items-center gap-2 cursor-pointer"
                        >
                          <ShieldAlert className="w-4 h-4 text-amber-600" />
                          Admin Console
                        </button>
                      )}

                      <div className="border-t border-neutral-100 my-1" />

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={openAuthModal}
                  className="px-3.5 py-2 text-xs font-semibold text-neutral-700 hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={openAuthModal}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#006B45] hover:bg-[#004D31] rounded-lg transition-colors shadow-sm cursor-pointer whitespace-nowrap"
                >
                  Join Barter
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile secondary navigation strip */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-neutral-100 bg-neutral-50/90 text-xs">
          <button
            onClick={() => navigate('/marketplace')}
            className={`px-2 py-1 ${currentPath === '/marketplace' ? 'text-[#006B45] font-bold' : 'text-neutral-600'}`}
          >
            Marketplace
          </button>
          <button
            onClick={() => navigate('/offers')}
            className={`px-2 py-1 ${currentPath === '/offers' ? 'text-[#006B45] font-bold' : 'text-neutral-600'}`}
          >
            Offers
          </button>
          <button
            onClick={() => navigate('/messages')}
            className={`px-2 py-1 relative ${currentPath === '/messages' ? 'text-[#006B45] font-bold' : 'text-neutral-600'}`}
          >
            Chat
            {unreadMessages > 0 && (
              <span className="ml-1 text-[10px] bg-[#006B45] text-white px-1 rounded-full">
                {unreadMessages}
              </span>
            )}
          </button>
          <button
            onClick={() => navigate('/create-listing')}
            className="px-2.5 py-1 bg-[#006B45] text-white rounded font-medium flex items-center gap-1"
          >
            <PlusCircle className="w-3 h-3 text-[#F7B718]" />
            List
          </button>
        </div>
      </header>
    </>
  );
};
