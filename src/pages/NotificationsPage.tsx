import React, { useState, useEffect } from 'react';
import { NotificationItem } from '../types';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsRead,
  subscribeToStore,
  getCurrentUser
} from '../services/storageService';
import { Bell, CheckCheck, Clock, ArrowRightLeft, Star, MessageSquare, ShieldCheck } from 'lucide-react';

interface NotificationsPageProps {
  navigate: (path: string) => void;
  openAuthModal: () => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ navigate, openAuthModal }) => {
  const currentUser = getCurrentUser();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const fetchNotifs = () => {
    setNotifications(getNotifications());
  };

  useEffect(() => {
    fetchNotifs();
    const unsub = subscribeToStore(fetchNotifs);
    return () => unsub();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm max-w-md w-full text-center space-y-4">
          <Bell className="w-10 h-10 text-[#006B45] mx-auto" />
          <h2 className="text-lg font-bold text-neutral-900">Sign in to View Notifications</h2>
          <button
            onClick={openAuthModal}
            className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#006B45] rounded-lg"
          >
            Sign In / Register
          </button>
        </div>
      </div>
    );
  }

  const handleItemClick = (notif: NotificationItem) => {
    markNotificationAsRead(notif.id);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'offer_received':
      case 'offer_accepted':
      case 'offer_countered':
        return <ArrowRightLeft className="w-4 h-4 text-[#006B45]" />;
      case 'trade_completed':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case 'review_received':
        return <Star className="w-4 h-4 text-[#F7B718] fill-[#F7B718]" />;
      case 'new_message':
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      default:
        return <Bell className="w-4 h-4 text-neutral-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Notification Center</h1>
            <p className="text-xs text-neutral-500 mt-0.5">Stay updated on trade proposals, completions, and messages</p>
          </div>

          {notifications.some(n => !n.read) && (
            <button
              onClick={() => markAllNotificationsRead()}
              className="text-xs font-semibold text-[#006B45] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all as read</span>
            </button>
          )}
        </div>

        {notifications.length > 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs divide-y divide-neutral-100 overflow-hidden">
            {notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => handleItemClick(notif)}
                className={`p-4 flex items-start gap-3 transition-colors cursor-pointer ${
                  !notif.read ? 'bg-emerald-50/40 hover:bg-emerald-50/70' : 'hover:bg-neutral-50'
                }`}
              >
                <div className="p-2 rounded-xl bg-white border border-neutral-200 shrink-0">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0 text-xs">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-neutral-900">{notif.title}</span>
                    <span className="text-[10px] text-neutral-400">
                      {new Date(notif.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-neutral-600 leading-relaxed">{notif.message}</p>
                </div>

                {!notif.read && (
                  <span className="w-2 h-2 rounded-full bg-[#006B45] shrink-0 mt-2" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-white rounded-2xl border border-neutral-200 p-8 text-neutral-400 text-xs">
            <Bell className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p>You have no notifications right now.</p>
          </div>
        )}

      </div>
    </div>
  );
};
