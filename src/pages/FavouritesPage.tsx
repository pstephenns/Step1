import React, { useState, useEffect } from 'react';
import { Listing } from '../types';
import { getFavourites, getListings, subscribeToStore, getCurrentUser } from '../services/storageService';
import { ListingCard } from '../components/common/ListingCard';
import { Heart, Package } from 'lucide-react';

interface FavouritesPageProps {
  navigate: (path: string) => void;
  openAuthModal: () => void;
}

export const FavouritesPage: React.FC<FavouritesPageProps> = ({ navigate, openAuthModal }) => {
  const currentUser = getCurrentUser();
  const [favListings, setFavListings] = useState<Listing[]>([]);

  const fetchFavs = () => {
    if (!currentUser) return;
    const favIds = getFavourites();
    const all = getListings({ status: 'active' });
    setFavListings(all.filter(l => favIds.includes(l.id)));
  };

  useEffect(() => {
    fetchFavs();
    const unsub = subscribeToStore(fetchFavs);
    return () => unsub();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm max-w-md w-full text-center space-y-4">
          <Heart className="w-10 h-10 text-red-500 mx-auto" />
          <h2 className="text-lg font-bold text-neutral-900">Sign in to View Your Wishlist</h2>
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

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-red-600 mb-1">
            <Heart className="w-3.5 h-3.5 fill-red-500" />
            <span>Saved Wishlist</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Bookmarked Barter Items
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Items you have bookmarked to propose offers on later.
          </p>
        </div>

        {favListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favListings.map(item => (
              <ListingCard
                key={item.id}
                listing={item}
                onClick={() => navigate(`/listing/${item.id}`)}
                onFavouriteChange={fetchFavs}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-white rounded-2xl border border-neutral-200 p-8 max-w-md mx-auto">
            <Heart className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-neutral-800">Your Wishlist is Empty</h3>
            <p className="text-xs text-neutral-500 mt-1 mb-5">
              Click the heart icon on any barter listing in the marketplace to save it here.
            </p>
            <button
              onClick={() => navigate('/marketplace')}
              className="px-5 py-2 text-xs font-semibold text-white bg-[#006B45] hover:bg-[#004D31] rounded-xl transition-colors cursor-pointer"
            >
              Explore Marketplace
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
