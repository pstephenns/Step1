import React, { useState } from 'react';
import { Listing } from '../types';
import { getListings } from '../services/storageService';
import { ListingCard } from '../components/common/ListingCard';
import { CATEGORIES } from '../data/categories';
import { GHANA_REGIONS } from '../data/ghanaRegions';
import {
  ArrowRightLeft,
  ShieldCheck,
  Search,
  Sparkles,
  MapPin,
  CheckCircle2,
  TrendingUp,
  Package,
  Wrench,
  Users,
  Repeat,
  Calculator
} from 'lucide-react';

interface HomePageProps {
  navigate: (path: string) => void;
  openSafetyModal: () => void;
  openAuthModal: () => void;
  openCalculatorModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  navigate,
  openSafetyModal,
  openAuthModal,
  openCalculatorModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedType, setSelectedType] = useState<'all' | 'goods' | 'services'>('all');

  const listings = getListings({ status: 'active' });
  const featuredGoods = listings.filter(l => l.type === 'goods').slice(0, 3);
  const featuredServices = listings.filter(l => l.type === 'services').slice(0, 3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (selectedRegion !== 'all') params.set('region', selectedRegion);
    if (selectedType !== 'all') params.set('type', selectedType);
    navigate(`/marketplace?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      
      {/* Hero Section - Split view with generated Ghana trade photograph */}
      <section className="relative bg-white border-b border-neutral-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Headline, Mission, Barter Search */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Clean unboxed kicker */}
              <div className="flex items-center gap-2 text-xs font-semibold text-[#006B45]">
                <span className="w-2 h-2 rounded-full bg-[#006B45]" />
                <span>Ghana's Premier Peer-to-Peer Barter Marketplace</span>
                <span aria-hidden="true" className="text-neutral-300">·</span>
                <span className="text-[#D49B0E]">Spend Less Cash</span>
              </div>

              {/* Display Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight" style={{ textWrap: 'balance' }}>
                Trade What You Have. <br className="hidden sm:inline" />
                <span className="text-[#006B45]">Get What You Need.</span>
              </h1>

              <p className="text-base text-neutral-600 max-w-xl leading-relaxed">
                Skip the high retail markups and cash shortages. Barter laptops, smartphones, solar equipment, authentic Kente, and professional services directly with fellow Ghanaians in Accra, Kumasi, and nationwide.
              </p>

              {/* Barter Search Engine Container */}
              <form
                onSubmit={handleSearch}
                className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200/90 shadow-sm space-y-3"
              >
                <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-neutral-200">
                  <Search className="w-4 h-4 text-neutral-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="What are you seeking? e.g. MacBook, Solar Inverter, Web Design, Kente"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <select
                      value={selectedType}
                      onChange={e => setSelectedType(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white focus:outline-none focus:border-[#006B45]"
                    >
                      <option value="all">All Barter Types</option>
                      <option value="goods">Goods Only</option>
                      <option value="services">Services Only</option>
                    </select>
                  </div>

                  <div>
                    <select
                      value={selectedRegion}
                      onChange={e => setSelectedRegion(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white focus:outline-none focus:border-[#006B45]"
                    >
                      <option value="all">All 16 Regions</option>
                      {GHANA_REGIONS.map(r => (
                        <option key={r.name} value={r.name}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full py-2 text-xs font-semibold text-white bg-[#006B45] hover:bg-[#004D31] rounded-xl transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Search className="w-3.5 h-3.5 text-[#F7B718]" />
                      <span>Find Barters</span>
                    </button>
                  </div>
                </div>
              </form>

              {/* Value stats / proof strip */}
              <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-neutral-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#006B45]" />
                  <span>Zero Cash Commission</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#006B45]" />
                  <span>Optional Balancing Top-Up</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#006B45]" />
                  <span>Verified Mutual Reviews</span>
                </div>
              </div>

            </div>

            {/* Right Column: Hero Photo */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-neutral-200 shadow-xl aspect-[16/10] lg:aspect-[4/3] bg-neutral-100">
                <img
                  src="/src/assets/images/hero_ghana_trade_1792135623494.jpg"
                  alt="Ghana Barter & Trade Marketplace in Accra"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-[11px] font-semibold text-[#F7B718] uppercase tracking-wider mb-1">
                    Accra Barter Showcase
                  </div>
                  <p className="text-xs font-medium leading-snug">
                    Over GH₵ 450,000+ in estimated asset and service value bartered directly between Ghanaians this month.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How Barter in Ghana Works (4 Step Flow) */}
      <section className="py-14 bg-white border-b border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#006B45] uppercase tracking-wider">Simple & Economical</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight mt-1">
              How Barter Trading Works
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-2">
              No payments, no escrow fees. Just direct barter agreements and safe in-person exchanges.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#006B45] flex items-center justify-center font-bold text-sm mb-3">
                  01
                </div>
                <h3 className="font-semibold text-neutral-900 text-sm mb-1.5">List Goods or Skills</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  List items you no longer use or professional services you offer. State your estimated GH₵ value and what you desire in return.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm mb-3">
                  02
                </div>
                <h3 className="font-semibold text-neutral-900 text-sm mb-1.5">Propose & Negotiate</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Find an item you need. Make a trade offer with your goods/services, or add an optional cash top-up if values differ.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#006B45] flex items-center justify-center font-bold text-sm mb-3">
                  03
                </div>
                <h3 className="font-semibold text-neutral-900 text-sm mb-1.5">Safe Public Exchange</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Once accepted, use private chat to coordinate meeting in daylight at Accra Mall, Kumasi City Mall, or in front of a Police Station.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm mb-3">
                  04
                </div>
                <h3 className="font-semibold text-neutral-900 text-sm mb-1.5">Mutual Confirmation</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Both parties tap "Confirm Handover" in GoldCoast Trade. This verifies the trade and unlocks trusted community reviews.
                </p>
              </div>
            </div>

          </div>

          {/* Barter Parity Calculator CTA Box */}
          <div className="mt-10 p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-white to-amber-50/60 border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-[#006B45] text-[#F7B718] shadow-xs">
                <Calculator className="w-5 h-5" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-neutral-900">Wondering if your barter proposal is balanced?</h4>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Calculate fair value parity and recommended cash balancing top-ups in Ghana Cedis (GH₵).
                </p>
              </div>
            </div>

            <button
              onClick={openCalculatorModal}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#006B45] hover:bg-[#004D31] rounded-xl transition-colors shadow-xs shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <Calculator className="w-3.5 h-3.5 text-[#F7B718]" />
              <span>Open Value Calculator</span>
            </button>
          </div>

        </div>
      </section>

      {/* Featured Goods Barter Grid */}
      <section className="py-14 bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#006B45]">
                <Package className="w-4 h-4 text-[#006B45]" />
                <span>Physical Items for Barter</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mt-1">
                Featured Goods in Ghana
              </h2>
            </div>
            <button
              onClick={() => navigate('/marketplace?type=goods')}
              className="text-xs font-semibold text-[#006B45] hover:underline cursor-pointer"
            >
              View All Goods →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredGoods.map(item => (
              <ListingCard
                key={item.id}
                listing={item}
                onClick={() => navigate(`/listing/${item.id}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services Barter Grid */}
      <section className="py-14 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#006B45]">
                <Wrench className="w-4 h-4 text-[#006B45]" />
                <span>Professional Skills & Trades</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mt-1">
                Services You Can Trade For
              </h2>
            </div>
            <button
              onClick={() => navigate('/marketplace?type=services')}
              className="text-xs font-semibold text-[#006B45] hover:underline cursor-pointer"
            >
              View All Services →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredServices.map(item => (
              <ListingCard
                key={item.id}
                listing={item}
                onClick={() => navigate(`/listing/${item.id}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Barter Categories */}
      <section className="py-14 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#006B45] uppercase tracking-wider">Explore Directory</span>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mt-1">
              Top Barter Categories
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => navigate(`/marketplace?cat=${cat.slug}`)}
                className="p-4 rounded-xl bg-white border border-neutral-200 hover:border-[#006B45] hover:shadow-sm transition-all text-left group cursor-pointer"
              >
                <div className="text-xs font-bold text-neutral-900 group-hover:text-[#006B45] transition-colors mb-1">
                  {cat.name}
                </div>
                <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
                <div className="text-[10px] font-medium text-[#D49B0E] mt-2 flex items-center gap-1">
                  <span>Browse Listings</span>
                  <span>→</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
