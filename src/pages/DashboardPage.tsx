import React, { useState, useEffect } from 'react';
import { Listing, TradeOffer, User } from '../types';
import {
  getCurrentUser,
  getListings,
  getTradeOffers,
  deleteListing,
  updateListing,
  subscribeToStore
} from '../services/storageService';
import { VerifiedUserBadge } from '../components/common/VerifiedUserBadge';
import {
  Sliders,
  PlusCircle,
  Package,
  Repeat,
  Star,
  CheckCircle,
  Eye,
  Trash2,
  ExternalLink,
  MapPin,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

interface DashboardPageProps {
  navigate: (path: string) => void;
  openAuthModal: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ navigate, openAuthModal }) => {
  const currentUser = getCurrentUser();
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [myOffers, setMyOffers] = useState<TradeOffer[]>([]);

  const fetchData = () => {
    if (!currentUser) return;
    const items = getListings({ userId: currentUser.id });
    const offers = getTradeOffers(currentUser.id);
    setMyListings(items);
    setMyOffers(offers);
  };

  useEffect(() => {
    fetchData();
    const unsub = subscribeToStore(fetchData);
    return () => unsub();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm max-w-md w-full text-center space-y-4">
          <Sliders className="w-10 h-10 text-[#006B45] mx-auto" />
          <h2 className="text-lg font-bold text-neutral-900">Sign in to Access Your Trader Dashboard</h2>
          <button
            onClick={openAuthModal}
            className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#006B45] hover:bg-[#004D31] rounded-lg transition-colors cursor-pointer"
          >
            Sign In / Register
          </button>
        </div>
      </div>
    );
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this listing?')) {
      deleteListing(id);
    }
  };

  const handleTogglePause = (listing: Listing) => {
    const nextStatus = listing.status === 'paused' ? 'active' : 'paused';
    updateListing(listing.id, { status: nextStatus });
  };

  const activeOffersCount = myOffers.filter(
    o => o.status === 'pending' || o.status === 'accepted' || o.status === 'countered'
  ).length;

  const totalEstAssetVal = myListings.reduce((sum, l) => sum + l.estimatedValueGHS, 0);

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Trader Profile Banner */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#006B45]/20 shadow-xs"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-neutral-900">{currentUser.name}</h1>
                  <VerifiedUserBadge
                    user={{
                      createdAt: currentUser.createdAt,
                      memberSince: currentUser.memberSince,
                      completedTradesCount: currentUser.completedTradesCount,
                      trustRating: currentUser.trustRating,
                      verifiedTrader: currentUser.verifiedTrader,
                      name: currentUser.name
                    }}
                    variant="badge"
                  />
                  {currentUser.role === 'admin' && (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Admin
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#006B45]" />
                    {currentUser.city} ({currentUser.region})
                  </span>
                  <span>·</span>
                  <span>Member since {currentUser.memberSince}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/user/${currentUser.id}`)}
                className="px-4 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer"
              >
                View Public Profile
              </button>
              <button
                onClick={() => navigate('/create-listing')}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#006B45] hover:bg-[#004D31] rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-[#F7B718]" />
                <span>List for Barter</span>
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-neutral-100 text-xs">
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
              <span className="text-neutral-400 block text-[11px]">Active Listings</span>
              <span className="text-lg font-black text-neutral-900 font-mono tabular-nums">
                {myListings.filter(l => l.status === 'active').length}
              </span>
            </div>
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
              <span className="text-neutral-400 block text-[11px]">Active Negotiations</span>
              <span className="text-lg font-black text-[#006B45] font-mono tabular-nums">
                {activeOffersCount}
              </span>
            </div>
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
              <span className="text-neutral-400 block text-[11px]">Completed Trades</span>
              <span className="text-lg font-black text-neutral-900 font-mono tabular-nums">
                {currentUser.completedTradesCount}
              </span>
            </div>
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
              <span className="text-neutral-400 block text-[11px]">Trust Rating</span>
              <span className="text-lg font-black text-amber-800 font-mono tabular-nums flex items-center gap-1">
                ★ {currentUser.trustRating} <span className="text-neutral-400 font-normal text-xs">({currentUser.reviewCount} reviews)</span>
              </span>
            </div>
          </div>

          {/* Verification & Trust Standing Card */}
          <div className="mt-6 pt-6 border-t border-neutral-100">
            <h3 className="text-xs font-bold text-neutral-900 mb-2">My Trader Verification & Account Standing</h3>
            <VerifiedUserBadge
              user={{
                createdAt: currentUser.createdAt,
                memberSince: currentUser.memberSince,
                completedTradesCount: currentUser.completedTradesCount,
                trustRating: currentUser.trustRating,
                verifiedTrader: currentUser.verifiedTrader,
                name: currentUser.name
              }}
              variant="card"
            />
          </div>
        </div>

        {/* My Barter Listings Section */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-neutral-900">My Barter Items & Services</h2>
              <p className="text-xs text-neutral-500">Manage your active offerings and what you desire in return</p>
            </div>
            <span className="text-xs font-semibold text-neutral-500 font-mono">
              Total Listed Value: GH₵ {totalEstAssetVal.toLocaleString()}
            </span>
          </div>

          {myListings.length > 0 ? (
            <div className="divide-y divide-neutral-100">
              {myListings.map(listing => (
                <div
                  key={listing.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-14 h-14 rounded-xl object-cover border border-neutral-200 shrink-0"
                    />
                    <div className="text-xs">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-semibold text-neutral-900 hover:text-[#006B45] cursor-pointer" onClick={() => navigate(`/listing/${listing.id}`)}>
                          {listing.title}
                        </span>
                        <span className="text-[10px] capitalize px-2 py-0.2 rounded-full bg-neutral-100 text-neutral-700 font-medium">
                          {listing.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-neutral-500 flex items-center gap-2">
                        <span>Est. GH₵ {listing.estimatedValueGHS.toLocaleString()}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" /> {listing.viewsCount} views
                        </span>
                        <span>·</span>
                        <span className="capitalize">{listing.type}</span>
                      </div>
                      <div className="text-emerald-800 text-[11px] mt-0.5 font-medium line-clamp-1">
                        Seeking: {listing.wishlistExchange}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => navigate(`/listing/${listing.id}`)}
                      className="p-2 text-neutral-600 hover:text-[#006B45] hover:bg-neutral-100 rounded-lg cursor-pointer"
                      title="View listing"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleTogglePause(listing)}
                      className="px-2.5 py-1 text-xs text-neutral-600 hover:bg-neutral-100 rounded-lg border border-neutral-200 cursor-pointer"
                    >
                      {listing.status === 'paused' ? 'Resume' : 'Pause'}
                    </button>
                    <button
                      onClick={() => handleDelete(listing.id)}
                      className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                      title="Delete listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-neutral-500 text-xs">
              <Package className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
              <p>You haven't listed any items or services yet.</p>
              <button
                onClick={() => navigate('/create-listing')}
                className="mt-3 px-4 py-2 text-xs font-semibold text-white bg-[#006B45] rounded-lg"
              >
                Create First Barter Listing
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
