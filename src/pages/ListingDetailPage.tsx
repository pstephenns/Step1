import React, { useState, useEffect } from 'react';
import { Listing } from '../types';
import {
  getListingById,
  getUserById,
  getCurrentUser,
  getFavourites,
  toggleFavourite,
  deleteListing,
  incrementListingView
} from '../services/storageService';
import { VerifiedUserBadge } from '../components/common/VerifiedUserBadge';
import { TradeOfferModal } from '../components/modals/TradeOfferModal';
import { ReportModal } from '../components/modals/ReportModal';
import {
  ArrowLeft,
  Heart,
  Repeat,
  ShieldCheck,
  CheckCircle,
  MapPin,
  Flag,
  Share2,
  Trash2,
  Edit,
  Building2,
  Calendar,
  AlertTriangle
} from 'lucide-react';

interface ListingDetailPageProps {
  listingId: string;
  navigate: (path: string) => void;
  openSafetyModal: () => void;
  openAuthModal: () => void;
}

export const ListingDetailPage: React.FC<ListingDetailPageProps> = ({
  listingId,
  navigate,
  openSafetyModal,
  openAuthModal
}) => {
  const [listing, setListing] = useState<Listing | undefined>(() => getListingById(listingId));
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const currentUser = getCurrentUser();
  const isOwner = currentUser && listing && currentUser.id === listing.userId;

  useEffect(() => {
    const item = getListingById(listingId);
    setListing(item);
    if (item) {
      incrementListingView(item.id);
      const favs = getFavourites();
      setIsFav(favs.includes(item.id));
    }
  }, [listingId]);

  if (!listing) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <h2 className="text-lg font-bold text-neutral-800">Listing Not Found</h2>
          <p className="text-xs text-neutral-500 mt-1 mb-4">
            This barter item may have been traded, paused, or deleted.
          </p>
          <button
            onClick={() => navigate('/marketplace')}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#006B45] rounded-lg"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const handleToggleFav = () => {
    if (!currentUser) {
      openAuthModal();
      return;
    }
    const state = toggleFavourite(listing.id);
    setIsFav(state);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDeleteListing = () => {
    if (window.confirm('Are you sure you want to delete this listing from GoldCoast Trade?')) {
      deleteListing(listing.id);
      navigate('/marketplace');
    }
  };

  const formattedValue = new Intl.NumberFormat('en-GH', {
    style: 'decimal',
    maximumFractionDigits: 0
  }).format(listing.estimatedValueGHS);

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Back Link */}
        <button
          onClick={() => navigate('/marketplace')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Barter Marketplace</span>
        </button>

        {/* 2-Column Split: Visuals & Description (Left) + Purchase/Barter Module (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (7 cols): Images + Detailed Description */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Main Photo Showcase */}
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
              <div className="aspect-[4/3] w-full bg-neutral-100 relative">
                <img
                  src={listing.images[activeImageIndex] || listing.images[0]}
                  alt={listing.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />

                {listing.status === 'in_negotiation' && (
                  <div className="absolute top-3 left-3 bg-amber-600 text-white text-xs px-3 py-1 rounded-md font-semibold shadow-xs">
                    In Active Negotiation
                  </div>
                )}
                {listing.status === 'traded' && (
                  <div className="absolute top-3 left-3 bg-[#006B45] text-white text-xs px-3 py-1 rounded-md font-semibold shadow-xs">
                    ✓ Trade Handover Completed
                  </div>
                )}
              </div>

              {/* Thumbnails if multiple */}
              {listing.images.length > 1 && (
                <div className="p-3 border-t border-neutral-100 flex items-center gap-2 overflow-x-auto">
                  {listing.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer ${
                        activeImageIndex === idx ? 'border-[#006B45]' : 'border-transparent opacity-70'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description & Specs Card */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-6">
              
              <div>
                <h3 className="text-base font-bold text-neutral-900 mb-2">Item or Service Overview</h3>
                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
                  {listing.description}
                </p>
              </div>

              {/* Specifications Matrix */}
              <div className="pt-4 border-t border-neutral-100">
                <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-3">
                  Barter Specifications
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                    <span className="text-neutral-400 block text-[11px]">Type</span>
                    <span className="font-semibold text-neutral-800 capitalize">{listing.type}</span>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                    <span className="text-neutral-400 block text-[11px]">Condition</span>
                    <span className="font-semibold text-neutral-800 capitalize">
                      {listing.condition !== 'not_applicable' ? listing.condition.replace('_', ' ') : 'N/A (Service)'}
                    </span>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                    <span className="text-neutral-400 block text-[11px]">Ghana Region</span>
                    <span className="font-semibold text-neutral-800">{listing.region}</span>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                    <span className="text-neutral-400 block text-[11px]">Town / Location</span>
                    <span className="font-semibold text-neutral-800">{listing.city}</span>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                    <span className="text-neutral-400 block text-[11px]">Meetup Preference</span>
                    <span className="font-semibold text-neutral-800 capitalize">
                      {listing.meetupPreference.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                    <span className="text-neutral-400 block text-[11px]">Category</span>
                    <span className="font-semibold text-neutral-800">{listing.category}</span>
                  </div>
                </div>
              </div>

              {/* Safe Trading Notice */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-900 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="block font-bold">Ghana Safe Barter Checklist:</strong>
                  <p className="mt-0.5 text-amber-800 leading-relaxed">
                    Always arrange exchanges at high-footfall spots (e.g. Accra Mall food court, Kumasi City Mall, Shell fuel stations, or outside District Police Stations). Never pay upfront money over MoMo.
                  </p>
                  <button
                    onClick={openSafetyModal}
                    className="text-[#006B45] font-semibold underline mt-1 inline-block cursor-pointer"
                  >
                    View Safe Exchange Rules →
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column (5 cols): Contiguous Purchase & Negotiation Module */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-20">
            
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-5">
              
              {/* Category & Region Kicker */}
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="font-medium text-neutral-700">{listing.category}</span>
                  <span>·</span>
                  <span>{listing.city}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleShare}
                    className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg cursor-pointer"
                    title="Share listing link"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleToggleFav}
                    className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-neutral-100 rounded-lg cursor-pointer"
                    title="Save to wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                </div>
              </div>

              {copiedLink && (
                <div className="text-[11px] text-[#006B45] font-semibold bg-emerald-50 px-2 py-1 rounded">
                  ✓ Link copied to clipboard!
                </div>
              )}

              {/* Title */}
              <h1 className="text-lg sm:text-xl font-bold text-neutral-900 leading-snug">
                {listing.title}
              </h1>

              {/* Estimated Barter Value Callout */}
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/80">
                <span className="text-[11px] text-neutral-400 uppercase tracking-wide block">
                  Estimated Trade Value Reference
                </span>
                <div className="text-2xl font-black text-neutral-900 font-mono tabular-nums tracking-tight mt-0.5">
                  GH₵ {formattedValue}
                </div>
                <p className="text-[10px] text-neutral-500 mt-1">
                  * For value balancing comparison only. GoldCoast Trade processes zero payments or escrow.
                </p>
              </div>

              {/* Desired Exchange Box */}
              <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200/80">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#006B45] mb-1">
                  <Repeat className="w-3.5 h-3.5 text-[#D49B0E]" />
                  <span>Owner is Seeking in Exchange</span>
                </div>
                <p className="text-xs text-neutral-800 font-medium leading-relaxed">
                  {listing.wishlistExchange}
                </p>
              </div>

              {/* Primary Action Button */}
              {isOwner ? (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-2">
                  <div className="font-semibold">You own this barter listing.</div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="flex-1 py-2 bg-white text-neutral-800 rounded-lg border border-neutral-300 font-semibold text-center hover:bg-neutral-50 cursor-pointer"
                    >
                      View in Dashboard
                    </button>
                    <button
                      onClick={handleDeleteListing}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer border border-red-200"
                      title="Delete listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      if (!currentUser) {
                        openAuthModal();
                      } else {
                        setShowOfferModal(true);
                      }
                    }}
                    className="w-full py-3 px-4 text-xs sm:text-sm font-semibold text-white bg-[#006B45] hover:bg-[#004D31] rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Repeat className="w-4 h-4 text-[#F7B718]" />
                    <span>Propose Barter Offer</span>
                  </button>
                  <p className="text-[11px] text-center text-neutral-500">
                    Offer your goods, services, or an optional balancing cash top-up.
                  </p>
                </div>
              )}

              {/* Trader Trust Card */}
              <div className="pt-4 border-t border-neutral-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    Trader Profile & Verification
                  </span>
                  <VerifiedUserBadge
                    user={{
                      createdAt: listing.userCreatedAt || getUserById(listing.userId)?.createdAt,
                      memberSince: listing.userMemberSince || getUserById(listing.userId)?.memberSince,
                      completedTradesCount: listing.userCompletedTrades,
                      trustRating: listing.userRating,
                      verifiedTrader: listing.userVerified,
                      name: listing.userName
                    }}
                    variant="badge"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => navigate(`/user/${listing.userId}`)}
                    className="flex items-center gap-3 text-left group cursor-pointer"
                  >
                    <img
                      src={listing.userAvatar}
                      alt={listing.userName}
                      className="w-10 h-10 rounded-full object-cover border border-neutral-200"
                    />
                    <div>
                      <div className="text-xs font-bold text-neutral-900 group-hover:text-[#006B45] transition-colors flex items-center gap-1.5">
                        <span>{listing.userName}</span>
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        {listing.userCity} · {listing.userCompletedTrades} trades completed
                      </div>
                    </div>
                  </button>

                  <div className="text-right">
                    <div className="text-xs font-bold text-amber-800">
                      ★ {listing.userRating} / 5.0
                    </div>
                    <button
                      onClick={() => navigate(`/user/${listing.userId}`)}
                      className="text-[11px] text-[#006B45] font-semibold hover:underline cursor-pointer"
                    >
                      View Reviews
                    </button>
                  </div>
                </div>

                <VerifiedUserBadge
                  user={{
                    createdAt: listing.userCreatedAt || getUserById(listing.userId)?.createdAt,
                    memberSince: listing.userMemberSince || getUserById(listing.userId)?.memberSince,
                    completedTradesCount: listing.userCompletedTrades,
                    trustRating: listing.userRating,
                    verifiedTrader: listing.userVerified,
                    name: listing.userName
                  }}
                  variant="card"
                />
              </div>

              {/* Report affordance */}
              {!isOwner && (
                <div className="pt-2 text-right">
                  <button
                    onClick={() => setShowReportModal(true)}
                    className="text-[11px] text-neutral-400 hover:text-red-600 transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Flag className="w-3 h-3" />
                    <span>Report this listing</span>
                  </button>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* Trade Offer Modal */}
      <TradeOfferModal
        isOpen={showOfferModal}
        listing={listing}
        onClose={() => setShowOfferModal(false)}
        onSuccess={() => {
          navigate('/offers');
        }}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        targetType="listing"
        targetId={listing.id}
        targetTitleOrName={listing.title}
        onClose={() => setShowReportModal(false)}
      />

    </div>
  );
};
