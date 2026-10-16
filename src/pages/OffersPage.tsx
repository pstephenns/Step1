import React, { useState, useEffect } from 'react';
import { TradeOffer, OfferStatus } from '../types';
import {
  getCurrentUser,
  getTradeOffers,
  respondToOffer,
  getUserById,
  subscribeToStore
} from '../services/storageService';
import { VerifiedUserBadge } from '../components/common/VerifiedUserBadge';
import { CounterOfferModal } from '../components/modals/CounterOfferModal';
import { MutualCompletionModal } from '../components/modals/MutualCompletionModal';
import { TradeReceiptModal } from '../components/modals/TradeReceiptModal';
import {
  Repeat,
  ArrowRightLeft,
  CheckCircle,
  XCircle,
  RefreshCw,
  MessageSquare,
  Clock,
  ShieldCheck,
  Star,
  ChevronRight,
  PlusCircle,
  Inbox,
  Send,
  FileText
} from 'lucide-react';

interface OffersPageProps {
  navigate: (path: string) => void;
  openAuthModal: () => void;
}

export const OffersPage: React.FC<OffersPageProps> = ({ navigate, openAuthModal }) => {
  const currentUser = getCurrentUser();

  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [offers, setOffers] = useState<TradeOffer[]>([]);

  // Modals
  const [counterTarget, setCounterTarget] = useState<TradeOffer | null>(null);
  const [completionTarget, setCompletionTarget] = useState<TradeOffer | null>(null);
  const [receiptTarget, setReceiptTarget] = useState<TradeOffer | null>(null);

  const fetchOffers = () => {
    if (!currentUser) return;
    const all = getTradeOffers(currentUser.id);
    setOffers(all);
  };

  useEffect(() => {
    fetchOffers();
    const unsub = subscribeToStore(fetchOffers);
    return () => unsub();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm max-w-md w-full text-center space-y-4">
          <Repeat className="w-10 h-10 text-[#006B45] mx-auto" />
          <h2 className="text-lg font-bold text-neutral-900">Sign in to View Trade Offers</h2>
          <p className="text-xs text-neutral-600">
            Sign in to track your incoming barter proposals, respond to counterparties, and confirm mutual exchanges.
          </p>
          <button
            onClick={openAuthModal}
            className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#006B45] hover:bg-[#004D31] rounded-lg transition-colors cursor-pointer"
          >
            Sign In / Switch Trader
          </button>
        </div>
      </div>
    );
  }

  const incomingOffers = offers.filter(o => o.listingOwnerId === currentUser.id);
  const outgoingOffers = offers.filter(o => o.offererId === currentUser.id);
  const displayedOffers = (activeTab === 'incoming' ? incomingOffers : outgoingOffers).filter(o => {
    if (statusFilter === 'all') return true;
    return o.status === statusFilter;
  });

  const handleAccept = (offerId: string) => {
    if (window.confirm('Accept this barter offer? You will coordinate meeting in private chat.')) {
      respondToOffer(offerId, 'accept');
    }
  };

  const handleReject = (offerId: string) => {
    if (window.confirm('Decline this barter offer?')) {
      respondToOffer(offerId, 'reject');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#006B45] mb-1">
              <span>Barter Negotiation Center</span>
              <span>·</span>
              <span>Logged in as {currentUser.name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              Trade Offers & Barter Deals
            </h1>
          </div>

          <button
            onClick={() => navigate('/create-listing')}
            className="self-start sm:self-auto px-4 py-2 text-xs font-semibold text-white bg-[#006B45] hover:bg-[#004D31] rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-[#F7B718]" />
            <span>List Another Item</span>
          </button>
        </div>

        {/* Primary Tabs: Incoming vs Outgoing */}
        <div className="flex items-center gap-2 border-b border-neutral-200 mb-6">
          <button
            onClick={() => setActiveTab('incoming')}
            className={`pb-3 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors border-b-2 cursor-pointer ${
              activeTab === 'incoming'
                ? 'border-[#006B45] text-[#006B45]'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Incoming Proposals</span>
            <span className="px-1.5 py-0.2 rounded-full text-[11px] bg-neutral-100 text-neutral-700">
              {incomingOffers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('outgoing')}
            className={`pb-3 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors border-b-2 cursor-pointer ${
              activeTab === 'outgoing'
                ? 'border-[#006B45] text-[#006B45]'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Proposals I Made</span>
            <span className="px-1.5 py-0.2 rounded-full text-[11px] bg-neutral-100 text-neutral-700">
              {outgoingOffers.length}
            </span>
          </button>
        </div>

        {/* Status Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 mb-6 text-xs">
          {['all', 'pending', 'accepted', 'countered', 'completed', 'rejected'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-medium capitalize transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#006B45] text-white shadow-xs'
                  : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Offers List */}
        {displayedOffers.length > 0 ? (
          <div className="space-y-4">
            {displayedOffers.map(offer => {
              const isOwner = currentUser.id === offer.listingOwnerId;
              const counterPartyName = isOwner ? offer.offererName : offer.listingOwnerName;
              const counterPartyCity = isOwner ? offer.offererCity : 'Ghana';

              return (
                <div
                  key={offer.id}
                  className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs hover:border-neutral-300 transition-all p-5 sm:p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
                    
                    {/* Target listing info */}
                    <div className="flex items-center gap-3">
                      <img
                        src={offer.listingImage}
                        alt={offer.listingTitle}
                        className="w-14 h-14 rounded-xl object-cover border border-neutral-200 shrink-0"
                      />
                      <div>
                        <span className="text-[10px] text-neutral-400 uppercase tracking-wide">
                          {isOwner ? 'Your Listing Under Offer' : 'Target Barter Listing'}
                        </span>
                        <h3 className="font-bold text-sm text-neutral-900 line-clamp-1">
                          {offer.listingTitle}
                        </h3>
                        <div className="text-xs text-neutral-600 font-mono">
                          Est. Value: GH₵ {offer.listingEstimatedValueGHS.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-3 self-start lg:self-center">
                      <div className="text-right">
                        <span className="text-[10px] text-neutral-400 block">Offer Date</span>
                        <span className="text-xs text-neutral-600">
                          {new Date(offer.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                        {offer.status === 'pending' && (
                          <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> Pending Response
                          </span>
                        )}
                        {offer.status === 'accepted' && (
                          <span className="bg-emerald-100 text-[#006B45] px-3 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> Accepted · Meetup Ready
                          </span>
                        )}
                        {offer.status === 'countered' && (
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-1">
                            <RefreshCw className="w-3.5 h-3.5" /> Counter-Proposal
                          </span>
                        )}
                        {offer.status === 'completed' && (
                          <span className="bg-[#004D31] text-[#F7B718] px-3 py-1 rounded-full flex items-center gap-1 font-bold">
                            🏆 Trade Handover Verified
                          </span>
                        )}
                        {offer.status === 'rejected' && (
                          <span className="bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Declined
                          </span>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Proposed Trade Exchange Details */}
                  <div className="py-4 grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                    
                    {/* Trader and offered items */}
                    <div className="md:col-span-7 space-y-3">
                      <div className="flex flex-wrap items-center gap-2 text-neutral-700">
                        <span className="text-neutral-500">{isOwner ? 'Offered by' : 'Offered to'}:</span>
                        <strong className="text-neutral-900">{counterPartyName}</strong>
                        <span>({counterPartyCity})</span>
                        {getUserById(isOwner ? offer.offererId : offer.listingOwnerId) && (
                          <VerifiedUserBadge
                            user={getUserById(isOwner ? offer.offererId : offer.listingOwnerId)!}
                            variant="badge"
                          />
                        )}
                      </div>

                      <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 space-y-2">
                        <div className="text-[11px] font-bold text-[#006B45] uppercase tracking-wide">
                          Offered Items / Services:
                        </div>
                        {offer.offeredItems.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-neutral-800">
                              • {item.title} <span className="text-neutral-400 capitalize">({item.type})</span>
                            </span>
                            {item.estimatedValueGHS && (
                              <span className="font-mono text-neutral-600">
                                ~GH₵ {item.estimatedValueGHS.toLocaleString()}
                              </span>
                            )}
                          </div>
                        ))}

                        {/* Cash balancing notice */}
                        {offer.cashDirection !== 'none' && offer.optionalCashTopUpGHS > 0 && (
                          <div className="pt-2 border-t border-neutral-200/70 text-xs font-semibold text-amber-900 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            <span>
                              {offer.cashDirection === 'offered_by_sender'
                                ? `+ GH₵ ${offer.optionalCashTopUpGHS.toLocaleString()} cash balancing top-up offered`
                                : `+ GH₵ ${offer.optionalCashTopUpGHS.toLocaleString()} cash balancing top-up requested`}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Proposal Note */}
                      {offer.offerNote && (
                        <div className="text-neutral-600 italic text-xs bg-white p-3 rounded-xl border border-neutral-100">
                          "{offer.offerNote}"
                        </div>
                      )}
                    </div>

                    {/* Mutual confirmation & chat actions (Right 5 cols) */}
                    <div className="md:col-span-5 flex flex-col justify-between space-y-3 p-3 bg-neutral-50/70 rounded-xl border border-neutral-100">
                      <div>
                        <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide mb-1">
                          Mutual Completion Check
                        </div>
                        <div className="text-[11px] text-neutral-600 space-y-1 mb-2">
                          <div>
                            Owner Handover:{' '}
                            {offer.mutualConfirmation.ownerConfirmed ? (
                              <span className="text-[#006B45] font-semibold">✓ Confirmed</span>
                            ) : (
                              <span className="text-neutral-400">Pending</span>
                            )}
                          </div>
                          <div>
                            Offerer Handover:{' '}
                            {offer.mutualConfirmation.offererConfirmed ? (
                              <span className="text-[#006B45] font-semibold">✓ Confirmed</span>
                            ) : (
                              <span className="text-neutral-400">Pending</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="space-y-2 pt-2 border-t border-neutral-200">
                        {/* Open Chat */}
                        <button
                          onClick={() => navigate(`/messages?conv=${offer.conversationId}`)}
                          className="w-full py-2 px-3 text-xs font-semibold text-neutral-800 bg-white hover:bg-neutral-100 rounded-lg border border-neutral-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-[#006B45]" />
                          <span>Coordinate in Private Chat</span>
                        </button>

                        {/* Owner action if pending */}
                        {isOwner && offer.status === 'pending' && (
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => handleAccept(offer.id)}
                              className="py-2 px-3 font-semibold text-xs text-white bg-[#006B45] hover:bg-[#004D31] rounded-lg transition-colors cursor-pointer"
                            >
                              Accept Trade
                            </button>
                            <button
                              onClick={() => setCounterTarget(offer)}
                              className="py-2 px-3 font-semibold text-xs text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-50 rounded-lg transition-colors cursor-pointer"
                            >
                              Counter Offer
                            </button>
                          </div>
                        )}

                        {/* Both can confirm handover if accepted or countered */}
                        {(offer.status === 'accepted' || offer.status === 'countered') && (
                          <button
                            onClick={() => setCompletionTarget(offer)}
                            className="w-full py-2 px-3 font-semibold text-xs text-white bg-[#006B45] hover:bg-[#004D31] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-[#F7B718]" />
                            <span>Confirm In-Person Handover</span>
                          </button>
                        )}

                        {/* When completed, leave or view reviews & official slip */}
                        {offer.status === 'completed' && (
                          <div className="space-y-1.5">
                            <button
                              onClick={() => setCompletionTarget(offer)}
                              className="w-full py-2 px-3 font-semibold text-xs text-[#006B45] bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Star className="w-3.5 h-3.5 text-[#F7B718] fill-[#F7B718]" />
                              <span>Leave / View Verified Review</span>
                            </button>
                            <button
                              onClick={() => setReceiptTarget(offer)}
                              className="w-full py-2 px-3 font-semibold text-xs text-neutral-700 bg-white hover:bg-neutral-50 rounded-lg border border-neutral-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                            >
                              <FileText className="w-3.5 h-3.5 text-[#006B45]" />
                              <span>Official Barter Handover Slip</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center bg-white rounded-2xl border border-neutral-200 p-8 max-w-lg mx-auto">
            <Repeat className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-neutral-800">
              No {activeTab === 'incoming' ? 'Incoming' : 'Outgoing'} Barter Offers Found
            </h3>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              {activeTab === 'incoming'
                ? 'When other traders in Accra or Ghana propose a trade on your items, they will appear here.'
                : 'Browse the marketplace to find items or services you need, and propose a barter trade!'}
            </p>
            <div className="mt-5">
              <button
                onClick={() => navigate('/marketplace')}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#006B45] hover:bg-[#004D31] rounded-xl transition-colors cursor-pointer"
              >
                Browse Marketplace
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Counter Offer Modal */}
      {counterTarget && (
        <CounterOfferModal
          isOpen={!!counterTarget}
          offer={counterTarget}
          onClose={() => setCounterTarget(null)}
          onSuccess={fetchOffers}
        />
      )}

      {/* Mutual Completion & Review Modal */}
      {completionTarget && (
        <MutualCompletionModal
          isOpen={!!completionTarget}
          offer={completionTarget}
          onClose={() => setCompletionTarget(null)}
          onSuccess={fetchOffers}
        />
      )}

      {/* Official Barter Handover Slip */}
      {receiptTarget && (
        <TradeReceiptModal
          isOpen={!!receiptTarget}
          offer={receiptTarget}
          onClose={() => setReceiptTarget(null)}
        />
      )}

    </div>
  );
};
