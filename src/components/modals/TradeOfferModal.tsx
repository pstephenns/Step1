import React, { useState } from 'react';
import { Listing, User, OfferedItem } from '../../types';
import {
  getCurrentUser,
  getListings,
  createTradeOffer
} from '../../services/storageService';
import { X, ArrowRightLeft, ShieldCheck, Plus, Trash2, AlertCircle } from 'lucide-react';
import { VerifiedUserBadge } from '../common/VerifiedUserBadge';

interface TradeOfferModalProps {
  isOpen: boolean;
  listing: Listing;
  onClose: () => void;
  onSuccess: (offerId: string) => void;
}

export const TradeOfferModal: React.FC<TradeOfferModalProps> = ({
  isOpen,
  listing,
  onClose,
  onSuccess
}) => {
  const currentUser = getCurrentUser();
  const myListings = currentUser ? getListings({ userId: currentUser.id, status: 'active' }) : [];

  const [useExistingListing, setUseExistingListing] = useState(myListings.length > 0);
  const [selectedMyListingId, setSelectedMyListingId] = useState(myListings[0]?.id || '');

  // Custom item fields if not using existing listing
  const [customItemTitle, setCustomItemTitle] = useState('');
  const [customItemType, setCustomItemType] = useState<'goods' | 'services'>('goods');
  const [customItemValGHS, setCustomItemValGHS] = useState<number | ''>('');
  const [customItemDesc, setCustomItemDesc] = useState('');

  // Cash balancing top-up
  const [cashDirection, setCashDirection] = useState<'none' | 'offered_by_sender' | 'requested_from_receiver'>('none');
  const [cashTopUpGHS, setCashTopUpGHS] = useState<number | ''>('');

  // Note
  const [offerNote, setOfferNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentUser) {
      setError('Please log in first to propose a trade.');
      return;
    }

    if (currentUser.id === listing.userId) {
      setError('You cannot trade with your own listing.');
      return;
    }

    let itemsToOffer: OfferedItem[] = [];

    if (useExistingListing && selectedMyListingId) {
      const selected = myListings.find(l => l.id === selectedMyListingId);
      if (!selected) {
        setError('Please select an item to offer.');
        return;
      }
      itemsToOffer.push({
        id: `offered_${Date.now()}`,
        title: selected.title,
        type: selected.type,
        description: selected.description,
        estimatedValueGHS: selected.estimatedValueGHS,
        existingListingId: selected.id
      });
    } else {
      if (!customItemTitle.trim()) {
        setError('Please enter what item or service you are offering.');
        return;
      }
      itemsToOffer.push({
        id: `offered_${Date.now()}`,
        title: customItemTitle.trim(),
        type: customItemType,
        description: customItemDesc.trim(),
        estimatedValueGHS: Number(customItemValGHS) || 0
      });
    }

    const res = createTradeOffer({
      listingId: listing.id,
      offeredItems: itemsToOffer,
      optionalCashTopUpGHS: cashDirection !== 'none' ? Number(cashTopUpGHS) || 0 : 0,
      cashDirection,
      offerNote: offerNote.trim()
    });

    if (res.success && res.offer) {
      onSuccess(res.offer.id);
      onClose();
    } else {
      setError(res.error || 'Failed to submit trade offer.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-neutral-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-[#006B45]">
              <ArrowRightLeft className="w-5 h-5 text-[#006B45]" />
            </span>
            <div>
              <h3 className="text-base font-bold text-neutral-900">Propose Barter Exchange</h3>
              <p className="text-xs text-neutral-500">Negotiate trade with {listing.userName}</p>
            </div>
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
          
          {/* Target Listing Summary */}
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 mb-5 flex items-center gap-3">
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="w-14 h-14 rounded-lg object-cover shrink-0 border border-neutral-200"
            />
            <div className="flex-1 min-w-0 text-xs">
              <span className="text-[10px] text-neutral-500 uppercase tracking-wide">Target Listing</span>
              <h4 className="font-semibold text-neutral-900 truncate">{listing.title}</h4>
              <div className="flex items-center gap-2 text-neutral-600 mt-0.5">
                <span>Value: <strong>GH₵ {listing.estimatedValueGHS.toLocaleString()}</strong></span>
                <span>·</span>
                <span>{listing.city}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-neutral-500">
                <span>Listed by: <strong>{listing.userName}</strong></span>
                <VerifiedUserBadge
                  user={{
                    createdAt: listing.userCreatedAt,
                    memberSince: listing.userMemberSince,
                    completedTradesCount: listing.userCompletedTrades,
                    trustRating: listing.userRating,
                    verifiedTrader: listing.userVerified,
                    name: listing.userName
                  }}
                  variant="inline"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Offer Item Source */}
            <div>
              <label className="block font-semibold text-neutral-800 mb-1.5">
                What are you proposing to trade?
              </label>

              {myListings.length > 0 && (
                <div className="flex items-center gap-3 mb-3">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="itemSource"
                      checked={useExistingListing}
                      onChange={() => setUseExistingListing(true)}
                      className="text-[#006B45] focus:ring-[#006B45]"
                    />
                    <span>Select from my active listings</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="itemSource"
                      checked={!useExistingListing}
                      onChange={() => setUseExistingListing(false)}
                      className="text-[#006B45] focus:ring-[#006B45]"
                    />
                    <span>Propose a custom item or service</span>
                  </label>
                </div>
              )}

              {useExistingListing && myListings.length > 0 ? (
                <div>
                  <select
                    value={selectedMyListingId}
                    onChange={e => setSelectedMyListingId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:outline-none focus:border-[#006B45]"
                  >
                    {myListings.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.title} (Est. GH₵ {item.estimatedValueGHS.toLocaleString()}) - {item.type}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-3 p-3.5 bg-neutral-50/70 rounded-xl border border-neutral-200">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                        Item or Service Name *
                      </label>
                      <input
                        type="text"
                        required={!useExistingListing}
                        placeholder="e.g. iPhone 13 Pro or 2 Months Social Media Management"
                        value={customItemTitle}
                        onChange={e => setCustomItemTitle(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-300 bg-white focus:outline-none focus:border-[#006B45]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                        Type
                      </label>
                      <select
                        value={customItemType}
                        onChange={e => setCustomItemType(e.target.value as any)}
                        className="w-full px-2 py-1.5 text-xs rounded-lg border border-neutral-300 bg-white focus:outline-none focus:border-[#006B45]"
                      >
                        <option value="goods">Goods</option>
                        <option value="services">Services</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                        Est. Value (GH₵)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 5000"
                        value={customItemValGHS}
                        onChange={e => setCustomItemValGHS(e.target.value ? Number(e.target.value) : '')}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-300 bg-white focus:outline-none focus:border-[#006B45]"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                        Short Description / Condition
                      </label>
                      <input
                        type="text"
                        placeholder="Condition, specs, deliverables, or turnaround"
                        value={customItemDesc}
                        onChange={e => setCustomItemDesc(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-300 bg-white focus:outline-none focus:border-[#006B45]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cash Balancing Top-Up */}
            <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200/80">
              <label className="block font-semibold text-neutral-800 mb-1">
                Optional Cash Balancing Top-Up (GHS)
              </label>
              <p className="text-[11px] text-neutral-500 mb-2.5">
                Barter values rarely match identically. You can propose a cash balance to bridge differences (settled in person only).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setCashDirection('none')}
                  className={`py-1.5 px-2 rounded-lg border text-center transition-colors cursor-pointer ${
                    cashDirection === 'none'
                      ? 'border-[#006B45] bg-[#006B45] text-white font-medium'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  Pure Barter (No Cash)
                </button>
                <button
                  type="button"
                  onClick={() => setCashDirection('offered_by_sender')}
                  className={`py-1.5 px-2 rounded-lg border text-center transition-colors cursor-pointer ${
                    cashDirection === 'offered_by_sender'
                      ? 'border-[#006B45] bg-[#006B45] text-white font-medium'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  I'll Add Cash (+GH₵)
                </button>
                <button
                  type="button"
                  onClick={() => setCashDirection('requested_from_receiver')}
                  className={`py-1.5 px-2 rounded-lg border text-center transition-colors cursor-pointer ${
                    cashDirection === 'requested_from_receiver'
                      ? 'border-[#006B45] bg-[#006B45] text-white font-medium'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  Request Cash (+GH₵)
                </button>
              </div>

              {cashDirection !== 'none' && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-neutral-500 font-semibold">GH₵</span>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="Enter balancing amount (e.g. 500)"
                    value={cashTopUpGHS}
                    onChange={e => setCashTopUpGHS(e.target.value ? Number(e.target.value) : '')}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-neutral-300 bg-white focus:outline-none focus:border-[#006B45]"
                  />
                </div>
              )}
            </div>

            {/* Proposal Message */}
            <div>
              <label className="block font-semibold text-neutral-800 mb-1">
                Proposal Note & Suggested Safe Meetup Spot
              </label>
              <textarea
                rows={3}
                required
                placeholder="Hi! I'm interested in trading for your item. I can meet at Accra Mall food court or Kumasi City Mall to test and inspect..."
                value={offerNote}
                onChange={e => setOfferNote(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:outline-none focus:border-[#006B45]"
              />
            </div>

            {/* Safe Trading Reminder */}
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[#004D31] flex items-start gap-2 text-[11px] leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-[#006B45] shrink-0 mt-0.5" />
              <span>
                <strong>Ghana Safe Barter Rule:</strong> Never send Mobile Money or cash ahead of time. Once the trade is accepted, you can chat privately to finalize the public meetup. Both parties confirm handover afterwards.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-semibold text-white bg-[#006B45] hover:bg-[#004D31] rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              Send Barter Proposal
            </button>

          </form>

        </div>

      </div>
    </div>
  );
};
