import React, { useState, useEffect } from 'react';
import { Listing, GhanaRegion, ListingType } from '../types';
import { getListings, subscribeToStore } from '../services/storageService';
import { ListingCard } from '../components/common/ListingCard';
import { CATEGORIES } from '../data/categories';
import { GHANA_REGIONS } from '../data/ghanaRegions';
import { Search, Filter, SlidersHorizontal, X, ArrowUpDown, Package, Wrench, ShieldCheck } from 'lucide-react';

interface MarketplacePageProps {
  navigate: (path: string) => void;
  initialQuery?: string;
  initialCategory?: string;
  initialRegion?: string;
  initialType?: string;
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({
  navigate,
  initialQuery = '',
  initialCategory = 'all',
  initialRegion = 'all',
  initialType = 'all'
}) => {
  const [search, setSearch] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [region, setRegion] = useState(initialRegion);
  const [type, setType] = useState<string>(initialType);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'val_desc' | 'val_asc'>('newest');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const [listings, setListings] = useState<Listing[]>([]);

  const fetchFiltered = () => {
    let items = getListings({
      search: search.trim() || undefined,
      category: category !== 'all' ? category : undefined,
      region: region !== 'all' ? region : undefined,
      type: type !== 'all' ? (type as ListingType) : undefined,
      verifiedOnly: verifiedOnly || undefined,
      status: 'active'
    });

    if (sortBy === 'newest') {
      items = items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'val_desc') {
      items = items.sort((a, b) => b.estimatedValueGHS - a.estimatedValueGHS);
    } else if (sortBy === 'val_asc') {
      items = items.sort((a, b) => a.estimatedValueGHS - b.estimatedValueGHS);
    }

    setListings(items);
  };

  useEffect(() => {
    fetchFiltered();
    const unsub = subscribeToStore(fetchFiltered);
    return () => unsub();
  }, [search, category, region, type, sortBy, verifiedOnly]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('all');
    setRegion('all');
    setType('all');
    setVerifiedOnly(false);
    setSortBy('newest');
  };

  const hasActiveFilters = search || category !== 'all' || region !== 'all' || type !== 'all' || verifiedOnly;

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#006B45] mb-1">
            <span>Ghana Barter Directory</span>
            <span aria-hidden="true">·</span>
            <span>Accra, Kumasi & All 16 Regions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Explore Barter Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Discover electronics, home appliances, authentic Kente, and services available for barter exchange.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-neutral-200/90 shadow-sm mb-8 space-y-3">
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1 relative flex items-center">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by keywords, desired items, or Ghana cities..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:border-[#006B45]"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 p-1 text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Type Filter Buttons (Functional segmented control) */}
            <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-xl shrink-0">
              <button
                type="button"
                onClick={() => setType('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  type === 'all'
                    ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setType('goods')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                  type === 'goods'
                    ? 'bg-white text-[#006B45] shadow-xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Goods</span>
              </button>
              <button
                type="button"
                onClick={() => setType('services')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                  type === 'services'
                    ? 'bg-white text-[#006B45] shadow-xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Services</span>
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1 shrink-0">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                aria-label="Sort listings"
                className="px-3 py-2 text-xs rounded-xl border border-neutral-300 bg-white text-neutral-700 focus:outline-none focus:border-[#006B45]"
              >
                <option value="newest">Sort: Newest</option>
                <option value="val_desc">Est. Value: High to Low</option>
                <option value="val_asc">Est. Value: Low to High</option>
              </select>
            </div>
          </div>

          {/* Secondary Filter Row: Region & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-2 border-t border-neutral-100 text-xs">
            
            <div>
              <select
                value={region}
                onChange={e => setRegion(e.target.value)}
                aria-label="Filter by Ghana Region"
                className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 bg-neutral-50/70 text-neutral-800 focus:outline-none focus:border-[#006B45]"
              >
                <option value="all">📍 All Ghana Regions</option>
                {GHANA_REGIONS.map(r => (
                  <option key={r.name} value={r.name}>
                    {r.name} ({r.capital})
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-1">
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                aria-label="Filter by Category"
                className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 bg-neutral-50/70 text-neutral-800 focus:outline-none focus:border-[#006B45]"
              >
                <option value="all">🏷️ All Categories</option>
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setVerifiedOnly(!verifiedOnly)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                  verifiedOnly
                    ? 'bg-emerald-50 text-[#006B45] border-emerald-300 shadow-2xs'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                }`}
                title="Filter by traders with verified account activity age"
              >
                <ShieldCheck className={`w-3.5 h-3.5 ${verifiedOnly ? 'text-[#006B45]' : 'text-neutral-400'}`} />
                <span>Verified Accounts Only</span>
              </button>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs text-red-600 hover:text-red-800 font-medium flex items-center gap-1 ml-auto cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>

          </div>

        </div>

        {/* Listings Counter */}
        <div className="flex items-center justify-between text-xs text-neutral-500 mb-6">
          <div>
            Showing <strong className="text-neutral-900 font-semibold">{listings.length}</strong> barter listings
          </div>
          <div className="text-[11px] text-neutral-400">
            Click any item to view barter terms & propose an offer
          </div>
        </div>

        {/* Product Grid */}
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
          <div className="py-16 text-center bg-white rounded-2xl border border-neutral-200/90 p-8 max-w-lg mx-auto">
            <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-neutral-800">No Barter Listings Match</h3>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              We couldn't find items matching your search or filters. Try adjusting keywords or region, or post the first item yourself!
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
              <button
                onClick={() => navigate('/create-listing')}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#006B45] hover:bg-[#004D31] rounded-lg transition-colors cursor-pointer"
              >
                List What You Have
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
