import React, { useState, useEffect } from 'react';
import { User, Listing, Review } from '../types';
import {
  getUserById,
  getListings,
  getReviewsForUser,
  getCurrentUser,
  blockUser,
  unblockUser
} from '../services/storageService';
import { ListingCard } from '../components/common/ListingCard';
import { VerifiedUserBadge } from '../components/common/VerifiedUserBadge';
import { ReportModal } from '../components/modals/ReportModal';
import {
  User as UserIcon,
  CheckCircle,
  Star,
  MapPin,
  Calendar,
  Flag,
  ShieldBan,
  ShieldCheck,
  Package,
  Award
} from 'lucide-react';

interface UserProfilePageProps {
  userId: string;
  navigate: (path: string) => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({ userId, navigate }) => {
  const [user, setUser] = useState<User | undefined>(() => getUserById(userId));
  const [listings, setListings] = useState<Listing[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState<'listings' | 'reviews'>('listings');
  const [showReportModal, setShowReportModal] = useState(false);

  const currentUser = getCurrentUser();
  const isMe = currentUser?.id === userId;
  const isBlocked = currentUser?.blockedUserIds?.includes(userId);

  useEffect(() => {
    const target = getUserById(userId);
    setUser(target);
    if (target) {
      setListings(getListings({ userId: target.id, status: 'active' }));
      setReviews(getReviewsForUser(target.id));
    }
  }, [userId]);

  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6 text-center text-neutral-600 text-xs">
        Trader profile not found.
      </div>
    );
  }

  const handleToggleBlock = () => {
    if (isBlocked) {
      unblockUser(user.id);
    } else {
      if (window.confirm(`Block ${user.name}? Their listings will no longer appear for you.`)) {
        blockUser(user.id);
      }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Profile Header */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-600/30 shadow-xs"
              />
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-neutral-900">{user.name}</h1>
                  <VerifiedUserBadge
                    user={{
                      createdAt: user.createdAt,
                      memberSince: user.memberSince,
                      completedTradesCount: user.completedTradesCount,
                      trustRating: user.trustRating,
                      verifiedTrader: user.verifiedTrader,
                      name: user.name
                    }}
                    variant="badge"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#006B45]" />
                    {user.city} ({user.region})
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    Member since {user.memberSince}
                  </span>
                </div>

                <p className="text-xs text-neutral-600 max-w-xl leading-relaxed pt-1">
                  {user.bio}
                </p>

                {/* Account Activity Longevity Verification Card */}
                <div className="pt-2 max-w-xl">
                  <VerifiedUserBadge
                    user={{
                      createdAt: user.createdAt,
                      memberSince: user.memberSince,
                      completedTradesCount: user.completedTradesCount,
                      trustRating: user.trustRating,
                      verifiedTrader: user.verifiedTrader,
                      name: user.name
                    }}
                    variant="card"
                  />
                </div>
              </div>
            </div>

            {/* Actions & Rating Badge */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3">
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 text-right">
                <div className="text-lg font-black text-amber-800 font-mono flex items-center gap-1 sm:justify-end">
                  <Star className="w-5 h-5 text-[#F7B718] fill-[#F7B718]" />
                  <span>{user.trustRating} / 5.0</span>
                </div>
                <div className="text-[11px] text-neutral-500">
                  {user.completedTradesCount} Barters Handed Over · {reviews.length} Verified Reviews
                </div>
              </div>

              {!isMe && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleBlock}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border cursor-pointer transition-colors ${
                      isBlocked
                        ? 'bg-red-50 text-red-700 border-red-300'
                        : 'bg-white text-neutral-600 border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    {isBlocked ? 'Unblock Trader' : 'Block Trader'}
                  </button>
                  <button
                    onClick={() => setShowReportModal(true)}
                    className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-neutral-100 rounded-lg cursor-pointer"
                    title="Report user"
                  >
                    <Flag className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-4 border-b border-neutral-200 mb-6">
          <button
            onClick={() => setActiveTab('listings')}
            className={`pb-3 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors border-b-2 cursor-pointer ${
              activeTab === 'listings'
                ? 'border-[#006B45] text-[#006B45]'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Active Listings</span>
            <span className="px-2 py-0.2 rounded-full text-xs bg-neutral-100 text-neutral-700">
              {listings.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors border-b-2 cursor-pointer ${
              activeTab === 'reviews'
                ? 'border-[#006B45] text-[#006B45]'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Verified Barter Reviews</span>
            <span className="px-2 py-0.2 rounded-full text-xs bg-neutral-100 text-neutral-700">
              {reviews.length}
            </span>
          </button>
        </div>

        {/* Tab 1: Listings */}
        {activeTab === 'listings' && (
          <div>
            {listings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map(item => (
                  <ListingCard
                    key={item.id}
                    listing={item}
                    onClick={() => navigate(`/listing/${item.id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center bg-white rounded-2xl border border-neutral-200 p-8 text-neutral-500 text-xs">
                {user.name} currently has no active listings on the marketplace.
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Verified Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 mb-4">
              <ShieldCheck className="w-4 h-4 text-[#006B45] shrink-0" />
              <span>
                <strong>Verified Barter Policy:</strong> Reviews can strictly only be submitted after BOTH parties have physically completed the trade and confirmed handover.
              </span>
            </div>

            {reviews.length > 0 ? (
              <div className="space-y-3">
                {reviews.map(rev => (
                  <div
                    key={rev.id}
                    className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-2xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.reviewerAvatar}
                          alt={rev.reviewerName}
                          className="w-8 h-8 rounded-full object-cover border border-neutral-200"
                        />
                        <div>
                          <span className="font-bold text-xs text-neutral-900">{rev.reviewerName}</span>
                          <div className="text-[10px] text-neutral-400">
                            Trade on: <strong>{rev.listingTitle}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= rev.rating ? 'text-[#F7B718] fill-[#F7B718]' : 'text-neutral-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-neutral-700 leading-relaxed">
                      "{rev.comment}"
                    </p>

                    {/* Badges */}
                    {rev.badges && rev.badges.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {rev.badges.map(b => (
                          <span
                            key={b}
                            className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-neutral-100 text-neutral-700"
                          >
                            ✓ {b}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center bg-white rounded-2xl border border-neutral-200 p-8 text-neutral-500 text-xs">
                No reviews yet. Reviews unlock as trades are completed and confirmed mutually.
              </div>
            )}
          </div>
        )}

      </div>

      <ReportModal
        isOpen={showReportModal}
        targetType="user"
        targetId={user.id}
        targetTitleOrName={user.name}
        onClose={() => setShowReportModal(false)}
      />

    </div>
  );
};
