import React, { useState, useEffect, useRef } from 'react';
import { Conversation, Message, TradeOffer } from '../types';
import {
  getCurrentUser,
  getConversations,
  getMessages,
  sendMessage,
  markConversationRead,
  getTradeOfferById,
  getUserById,
  subscribeToStore
} from '../services/storageService';
import { VerifiedUserBadge } from '../components/common/VerifiedUserBadge';
import {
  MessageSquare,
  Send,
  ShieldCheck,
  MapPin,
  Clock,
  ArrowRightLeft,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface MessagesPageProps {
  navigate: (path: string) => void;
  openSafetyModal: () => void;
  initialConversationId?: string;
}

export const MessagesPage: React.FC<MessagesPageProps> = ({
  navigate,
  openSafetyModal,
  initialConversationId
}) => {
  const currentUser = getCurrentUser();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(initialConversationId || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputContent, setInputContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = () => {
    if (!currentUser) return;
    const all = getConversations(currentUser.id);
    setConversations(all);

    // If no selected or selected not in list, select first
    if (!selectedConvId && all.length > 0) {
      setSelectedConvId(all[0].id);
      markConversationRead(all[0].id);
    }
  };

  useEffect(() => {
    fetchConversations();
    const unsub = subscribeToStore(() => {
      fetchConversations();
      if (selectedConvId) {
        setMessages(getMessages(selectedConvId));
      }
    });
    return () => unsub();
  }, [currentUser, selectedConvId]);

  useEffect(() => {
    if (selectedConvId) {
      setMessages(getMessages(selectedConvId));
      markConversationRead(selectedConvId);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [selectedConvId]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm max-w-md w-full text-center space-y-4">
          <MessageSquare className="w-10 h-10 text-[#006B45] mx-auto" />
          <h2 className="text-lg font-bold text-neutral-900">Sign in to Access Private Messages</h2>
          <p className="text-xs text-neutral-600">
            Messages on GoldCoast Trade are private between barter counterparties to coordinate safe exchange locations.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#006B45] rounded-lg"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const activeConv = conversations.find(c => c.id === selectedConvId);
  const linkedOffer: TradeOffer | undefined = activeConv
    ? getTradeOfferById(activeConv.tradeOfferId)
    : undefined;

  const otherParticipantIdx = activeConv
    ? activeConv.participantIds.findIndex(id => id !== currentUser.id)
    : -1;
  const otherName =
    activeConv && otherParticipantIdx !== -1
      ? activeConv.participantNames[otherParticipantIdx]
      : 'Trader';
  const otherAvatar =
    activeConv && otherParticipantIdx !== -1
      ? activeConv.participantAvatars[otherParticipantIdx]
      : '';
  const otherId =
    activeConv && otherParticipantIdx !== -1
      ? activeConv.participantIds[otherParticipantIdx]
      : '';

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputContent.trim() || !selectedConvId) return;

    sendMessage({
      conversationId: selectedConvId,
      content: inputContent.trim()
    });

    setInputContent('');
    setMessages(getMessages(selectedConvId));
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleSendQuickMeetup = (spot: string) => {
    setInputContent(`Let's meet at ${spot} during daylight hours for safe inspection.`);
  };

  return (
    <div className="min-h-[calc(100vh-120px)] bg-neutral-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full">
        
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[640px]">
          
          {/* Left Panel: Conversation Threads (4 cols) */}
          <div className="md:col-span-4 border-r border-neutral-200 flex flex-col bg-neutral-50/50">
            
            <div className="p-4 border-b border-neutral-200 bg-white">
              <h2 className="text-base font-bold text-neutral-900">Barter Conversations</h2>
              <p className="text-xs text-neutral-500">Private threads tied to trade proposals</p>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-neutral-100">
              {conversations.length > 0 ? (
                conversations.map(conv => {
                  const pIdx = conv.participantIds.findIndex(id => id !== currentUser.id);
                  const pName = pIdx !== -1 ? conv.participantNames[pIdx] : 'Trader';
                  const pAvatar = pIdx !== -1 ? conv.participantAvatars[pIdx] : '';
                  const unread = conv.unreadCountFor[currentUser.id] || 0;
                  const isSelected = conv.id === selectedConvId;

                  return (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConvId(conv.id)}
                      className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors cursor-pointer ${
                        isSelected ? 'bg-emerald-50/70 border-l-4 border-l-[#006B45]' : 'hover:bg-neutral-100/60'
                      }`}
                    >
                      <img
                        src={pAvatar}
                        alt={pName}
                        className="w-10 h-10 rounded-full object-cover shrink-0 border border-neutral-200"
                      />
                      <div className="flex-1 min-w-0 text-xs">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-bold text-neutral-900 truncate">{pName}</span>
                          <span className="text-[10px] text-neutral-400">
                            {new Date(conv.lastMessageTimestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <div className="font-medium text-neutral-700 truncate text-[11px] mb-1">
                          Re: {conv.listingTitle}
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-neutral-500 truncate text-[11px]">
                            {conv.lastMessage}
                          </p>
                          {unread > 0 && (
                            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#006B45] text-white shrink-0 ml-1">
                              {unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-8 text-center text-xs text-neutral-500">
                  No active trade conversations yet. Propose or accept an offer to start chatting!
                </div>
              )}
            </div>

          </div>

          {/* Right Panel: Chat Thread (8 cols) */}
          <div className="md:col-span-8 flex flex-col h-full bg-white">
            {activeConv ? (
              <>
                {/* Header */}
                <div className="p-4 border-b border-neutral-200 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={otherAvatar}
                      alt={otherName}
                      className="w-9 h-9 rounded-full object-cover border border-neutral-200 cursor-pointer"
                      onClick={() => navigate(`/user/${otherId}`)}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          onClick={() => navigate(`/user/${otherId}`)}
                          className="font-bold text-sm text-neutral-900 hover:text-[#006B45] cursor-pointer"
                        >
                          {otherName}
                        </span>
                        {getUserById(otherId) && (
                          <VerifiedUserBadge
                            user={getUserById(otherId)!}
                            variant="badge"
                          />
                        )}
                      </div>
                      <div className="text-[11px] text-neutral-500 flex items-center gap-1">
                        <span>Trading on: <strong>{activeConv.listingTitle}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate('/offers')}
                      className="px-3 py-1.5 text-xs font-semibold text-[#006B45] bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                      <span>View Offer Status</span>
                    </button>
                    <button
                      onClick={openSafetyModal}
                      className="p-1.5 text-neutral-400 hover:text-[#006B45] hover:bg-neutral-100 rounded-lg cursor-pointer"
                      title="Safe Exchange Guidelines"
                    >
                      <ShieldCheck className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Offer context banner */}
                {linkedOffer && (
                  <div className="p-3 bg-neutral-50 border-b border-neutral-200 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-neutral-800">Barter Status:</span>
                      <span className="capitalize px-2 py-0.5 rounded text-[11px] font-bold bg-white border border-neutral-200 text-[#006B45]">
                        {linkedOffer.status}
                      </span>
                      {linkedOffer.optionalCashTopUpGHS > 0 && linkedOffer.cashDirection !== 'none' && (
                        <span className="text-amber-800 font-semibold text-[11px]">
                          (Cash balance top-up: GH₵ {linkedOffer.optionalCashTopUpGHS.toLocaleString()})
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-neutral-500 hidden sm:inline">
                      Mutual handover confirmation required before reviews
                    </span>
                  </div>
                )}

                {/* Messages Container */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-neutral-50/30">
                  
                  {/* Safety Watermark Banner */}
                  <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start gap-2 max-w-lg mx-auto">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-relaxed">
                      <strong>Ghana Safe Trade Tip:</strong> Never send Mobile Money upfront for "delivery" or "fuel". Agree to meet in daylight at a public place (e.g. Accra Mall or outside a Police Station) to inspect goods first.
                    </span>
                  </div>

                  {messages.map(msg => {
                    if (msg.isSystemNotice) {
                      return (
                        <div key={msg.id} className="py-2 text-center">
                          <span className="inline-block px-3 py-1 rounded-full bg-neutral-200/80 text-neutral-700 text-[11px] font-medium">
                            {msg.content}
                          </span>
                        </div>
                      );
                    }

                    const isMine = msg.senderId === currentUser.id;

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs shadow-2xs leading-relaxed ${
                            isMine
                              ? 'bg-[#006B45] text-white rounded-br-none'
                              : 'bg-white border border-neutral-200 text-neutral-900 rounded-bl-none'
                          }`}
                        >
                          <p>{msg.content}</p>
                          <div
                            className={`text-[9px] mt-1 text-right ${
                              isMine ? 'text-emerald-100/80' : 'text-neutral-400'
                            }`}
                          >
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Meetup Location Chips */}
                <div className="px-4 py-2 bg-white border-t border-neutral-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
                  <span className="text-neutral-400 shrink-0">Quick suggest:</span>
                  <button
                    onClick={() => handleSendQuickMeetup('Accra Mall Food Court')}
                    className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 shrink-0 cursor-pointer"
                  >
                    Accra Mall
                  </button>
                  <button
                    onClick={() => handleSendQuickMeetup('Kumasi City Mall')}
                    className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 shrink-0 cursor-pointer"
                  >
                    Kumasi Mall
                  </button>
                  <button
                    onClick={() => handleSendQuickMeetup('Cantonments Police Station frontage')}
                    className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 shrink-0 cursor-pointer"
                  >
                    Police Station
                  </button>
                  <button
                    onClick={() => handleSendQuickMeetup('Shell / TotalEnergies Station Osu')}
                    className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 shrink-0 cursor-pointer"
                  >
                    Shell Osu
                  </button>
                </div>

                {/* Input Bar */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-3 bg-white border-t border-neutral-200 flex items-center gap-2"
                >
                  <input
                    type="text"
                    placeholder={`Message ${otherName}...`}
                    value={inputContent}
                    onChange={e => setInputContent(e.target.value)}
                    className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:border-[#006B45]"
                  />
                  <button
                    type="submit"
                    className="p-2.5 bg-[#006B45] hover:bg-[#004D31] text-white rounded-xl transition-colors cursor-pointer shadow-xs"
                    title="Send message"
                  >
                    <Send className="w-4 h-4 text-[#F7B718]" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-center text-neutral-400 text-xs">
                Select a conversation on the left to coordinate barter details.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
