import React, { useState } from 'react';
import { TradeOffer } from '../../types';
import {
  getCurrentUser,
  confirmTradeCompletion,
  submitReview,
  getReviewsForUser
} from '../../services/storageService';
import { X, CheckCircle, Star, ShieldCheck, AlertCircle, Award } from 'lucide-react';

interface MutualCompletionModalProps {
  isOpen: boolean;
  offer: TradeOffer;
  onClose: () => void;
  onSuccess: () => void;
}

export const MutualCompletionModal: React.FC<MutualCompletionModalProps> = ({
  isOpen,
  offer,
  onClose,
  onSuccess
}) => {
  const currentUser = getCurrentUser();
  const isOwner = currentUser?.id === offer.listingOwnerId;
  const isOfferer = currentUser?.id === offer.offererId;

  const myConfirmed = isOwner
    ? offer.mutualConfirmation.ownerConfirmed
    : offer.mutualConfirmation.offererConfirmed;
  const otherConfirmed = isOwner
    ? offer.mutualConfirmation.offererConfirmed
    : offer.mutualConfirmation.ownerConfirmed;
  const bothCompleted = offer.status === 'completed';

  const otherTraderName = isOwner ? offer.offererName : offer.listingOwnerName;
  const otherTraderId = isOwner ? offer.offererId : offer.listingOwnerId;

  // Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [selectedBadges, setSelectedBadges] = useState<string[]>([
    'Accurate Description',
    'Smooth Exchange'
  ]);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [hasReviewed, setHasReviewed] = useState(false);

  // Check if current user already submitted a review for this offer
  React.useEffect(() => {
    if (currentUser) {
      const allTargetReviews = getReviewsForUser(otherTraderId);
      const done = allTargetReviews.some(
        r => r.tradeOfferId === offer.id && r.reviewerId === currentUser.id
      );
      setHasReviewed(done);
    }
  }, [offer.id, otherTraderId, currentUser]);

  if (!isOpen) return null;

  const BADGE_OPTIONS = [
    'Accurate Description',
    'Punctual',
    'Smooth Exchange',
    'Honest Valuation',
    'Great Communication',
    'Recommended Trader'
  ];

  const handleToggleBadge = (badge: string) => {
    if (selectedBadges.includes(badge)) {
      setSelectedBadges(selectedBadges.filter(b => b !== badge));
    } else {
      setSelectedBadges([...selectedBadges, badge]);
    }
  };

  const handleConfirmHandover = () => {
    setError(null);
    const res = confirmTradeCompletion(offer.id);
    if (res.success) {
      setNotice(res.message);
      onSuccess();
    } else {
      setError(res.message);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!comment.trim()) {
      setError('Please provide feedback for this verified barter trade.');
      return;
    }

    const res = submitReview({
      tradeOfferId: offer.id,
      rating,
      comment: comment.trim(),
      badges: selectedBadges
    });

    if (res.success) {
      setHasReviewed(true);
      setNotice('Verified review published! Thank you for strengthening Ghana barter trust.');
      onSuccess();
    } else {
      setError(res.error || 'Failed to submit review.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-neutral-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-[#006B45]">
              <ShieldCheck className="w-5 h-5 text-[#006B45]" />
            </span>
            <div>
              <h3 className="text-base font-bold text-neutral-900">Mutual Trade Completion & Review</h3>
              <p className="text-xs text-neutral-500">Trade on "{offer.listingTitle}"</p>
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
        <div className="p-6 space-y-5 text-xs">
          
          {notice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{notice}</span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Handover Status Step */}
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
            <div className="font-semibold text-neutral-900 mb-2 flex items-center justify-between">
              <span>Two-Way Handover Verification</span>
              <span className="text-[11px] text-neutral-500">Required before reviews unlock</span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-neutral-200/80">
                <span className="font-medium text-neutral-700">Your Confirmation ({currentUser?.name}):</span>
                {myConfirmed ? (
                  <span className="text-[#006B45] font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Handover Confirmed
                  </span>
                ) : (
                  <span className="text-amber-700 font-medium">Pending Your Confirmation</span>
                )}
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-neutral-200/80">
                <span className="font-medium text-neutral-700">Other Party ({otherTraderName}):</span>
                {otherConfirmed ? (
                  <span className="text-[#006B45] font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Handover Confirmed
                  </span>
                ) : (
                  <span className="text-amber-700 font-medium">Pending Confirmation</span>
                )}
              </div>
            </div>

            {!myConfirmed && (
              <button
                type="button"
                onClick={handleConfirmHandover}
                className="w-full py-2.5 px-4 font-semibold text-white bg-[#006B45] hover:bg-[#004D31] rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4 text-[#F7B718]" />
                <span>I Confirm Items Exchanged in Person</span>
              </button>
            )}
          </div>

          {/* Review Section - STRICTLY unlocked only when BOTH confirmed */}
          {bothCompleted ? (
            hasReviewed ? (
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center text-emerald-900">
                <Award className="w-8 h-8 text-emerald-600 mx-auto mb-1.5" />
                <h4 className="font-bold text-sm">Verified Barter Review Recorded</h4>
                <p className="text-[11px] text-emerald-700 mt-1">
                  You have already reviewed {otherTraderName} for this barter. Both traders have received verified trade credit!
                </p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4 pt-2 border-t border-neutral-200">
                <div className="flex items-center gap-2 text-neutral-900 font-bold">
                  <Star className="w-4 h-4 text-[#F7B718] fill-[#F7B718]" />
                  <span>Leave Verified Barter Review for {otherTraderName}</span>
                </div>

                {/* Rating Stars */}
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">
                    Overall Barter Experience Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 cursor-pointer transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating
                              ? 'text-[#F7B718] fill-[#F7B718]'
                              : 'text-neutral-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="font-semibold text-neutral-800 ml-2">{rating} of 5 Stars</span>
                  </div>
                </div>

                {/* Badges */}
                <div>
                  <label className="block text-neutral-600 font-medium mb-1.5">
                    Recognize Trader Qualities
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {BADGE_OPTIONS.map(b => {
                      const active = selectedBadges.includes(b);
                      return (
                        <button
                          key={b}
                          type="button"
                          onClick={() => handleToggleBadge(b)}
                          className={`px-2.5 py-1 rounded-md text-[11px] transition-colors cursor-pointer border ${
                            active
                              ? 'bg-emerald-50 border-[#006B45] text-[#006B45] font-semibold'
                              : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                          }`}
                        >
                          {active ? '✓ ' : ''}{b}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">
                    Public Review Comments *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe the trade: was the item condition accurate? Was the meetup on time? Would you barter with them again?"
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:border-[#006B45]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 font-semibold text-white bg-[#006B45] hover:bg-[#004D31] rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Submit Verified Trader Review
                </button>
              </form>
            )
          ) : (
            <div className="p-4 bg-neutral-100 rounded-xl text-neutral-500 text-center text-xs">
              🔒 Reviews remain locked until <strong>both</strong> {currentUser?.name} and {otherTraderName} confirm the physical handover in person.
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
