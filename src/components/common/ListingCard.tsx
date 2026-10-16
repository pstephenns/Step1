import React from 'react';
import { Listing } from '../../types';
import { Heart, Repeat, MapPin, CheckCircle, ArrowRightLeft } from 'lucide-react';
import { getFavourites, toggleFavourite } from '../../services/storageService';
import { VerifiedUserBadge } from './VerifiedUserBadge';

interface ListingCardProps {
  listing: Listing;
  onClick: () => void;
  onFavouriteChange?: () => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onClick, onFavouriteChange }) => {
  const [isFav, setIsFav] = React.useState(false);

  React.useEffect(() => {
    const favs = getFavourites();
    setIsFav(favs.includes(listing.id));
  }, [listing.id]);

  const handleToggleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    const state = toggleFavourite(listing.id);
    setIsFav(state);
    if (onFavouriteChange) onFavouriteChange();
  };

  const formattedValue = new Intl.NumberFormat('en-GH', {
    style: 'decimal',
    maximumFractionDigits: 0
  }).format(listing.estimatedValueGHS);

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-xl border border-neutral-200/90 hover:border-neutral-300 hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Image Container - 65%-70% of upper visual weight */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
        <img
          src={listing.images[0]}
          alt={listing.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
        />

        {/* Wishlist Barter Indicator Tag */}
        <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded flex items-center gap-1.5 shadow-xs">
          <ArrowRightLeft className="w-3 h-3 text-[#F7B718]" />
          <span className="capitalize">{listing.type} Barter</span>
        </div>

        {/* Favourite Button */}
        <button
          onClick={handleToggleFav}
          aria-label="Save to favourites"
          className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 hover:bg-white text-neutral-600 hover:text-red-500 shadow-sm transition-colors cursor-pointer"
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Negotiation or Traded Banner if not active */}
        {listing.status === 'in_negotiation' && (
          <div className="absolute bottom-0 inset-x-0 bg-amber-600/90 text-white text-[11px] py-1 text-center font-medium backdrop-blur-xs">
            In Active Barter Negotiation
          </div>
        )}
        {listing.status === 'traded' && (
          <div className="absolute bottom-0 inset-x-0 bg-[#006B45]/90 text-white text-[11px] py-1 text-center font-semibold backdrop-blur-xs">
            ✓ Barter Completed
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Clean Unboxed Metadata with · separator (Zero-pill discipline) */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-1.5 truncate">
            <span className="font-medium text-neutral-700">{listing.category}</span>
            <span aria-hidden="true">·</span>
            <span>{listing.city}</span>
            {listing.condition !== 'not_applicable' && (
              <>
                <span aria-hidden="true">·</span>
                <span className="capitalize">{listing.condition.replace('_', ' ')}</span>
              </>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-sm text-neutral-900 group-hover:text-[#006B45] transition-colors line-clamp-1 mb-2">
            {listing.title}
          </h3>

          {/* Estimated Value (for barter balance) */}
          <div className="mb-3">
            <div className="text-[11px] text-neutral-400">Est. Trade Value</div>
            <div className="text-base font-bold text-neutral-900 font-mono tabular-nums tracking-tight">
              GH₵ {formattedValue}
            </div>
          </div>

          {/* What trader wants in return */}
          <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-100 text-xs mb-3">
            <div className="text-[10px] font-bold text-[#006B45] uppercase tracking-wider mb-0.5 flex items-center gap-1">
              <Repeat className="w-3 h-3 text-[#D49B0E]" />
              <span>Seeking in Exchange</span>
            </div>
            <p className="text-neutral-700 line-clamp-2 text-xs leading-snug">
              {listing.wishlistExchange}
            </p>
          </div>
        </div>

        {/* Trader info row */}
        <div className="pt-2.5 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center gap-1.5 truncate">
            <img
              src={listing.userAvatar}
              alt={listing.userName}
              className="w-5 h-5 rounded-full object-cover shrink-0"
            />
            <span className="truncate text-neutral-700 font-medium">{listing.userName}</span>
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
          <div className="text-[11px] font-medium text-amber-800 shrink-0">
            ★ {listing.userRating} ({listing.userCompletedTrades} trades)
          </div>
        </div>
      </div>
    </div>
  );
};
