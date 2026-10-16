import React, { useState } from 'react';
import { GhanaRegion, ListingType, ItemCondition, MeetupPreference } from '../types';
import { createListing, getCurrentUser } from '../services/storageService';
import { GHANA_REGIONS } from '../data/ghanaRegions';
import { CATEGORIES } from '../data/categories';
import { ArrowLeft, Package, Wrench, Image as ImageIcon, ShieldCheck, AlertCircle } from 'lucide-react';

interface CreateListingPageProps {
  navigate: (path: string) => void;
  openAuthModal: () => void;
}

const SAMPLE_IMAGE_OPTIONS = [
  { label: 'MacBook / Laptop', url: '/src/assets/images/listing_macbook_pro_1792135623934.jpg' },
  { label: 'Solar Power Unit', url: '/src/assets/images/listing_solar_generator_1792135624783.jpg' },
  { label: 'Web & Design Studio', url: '/src/assets/images/listing_web_service_1792135624275.jpg' },
  { label: 'Kente Cloth', url: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=800&auto=format&fit=crop&q=80' },
  { label: 'Shea Butter', url: 'https://images.unsplash.com/photo-1608248597359-2911b3e817a0?w=800&auto=format&fit=crop&q=80' },
  { label: 'Smartphone / Tech', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80' },
  { label: 'Solar Installation', url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?w=800&auto=format&fit=crop&q=80' }
];

export const CreateListingPage: React.FC<CreateListingPageProps> = ({ navigate, openAuthModal }) => {
  const currentUser = getCurrentUser();

  const [type, setType] = useState<ListingType>('goods');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].name);
  const [condition, setCondition] = useState<ItemCondition>('like_new');
  const [estimatedValueGHS, setEstimatedValueGHS] = useState<number | ''>('');
  const [wishlistExchange, setWishlistExchange] = useState('');
  const [description, setDescription] = useState('');
  const [region, setRegion] = useState<GhanaRegion>(currentUser?.region || 'Greater Accra');
  const [city, setCity] = useState(currentUser?.city || 'East Legon, Accra');
  const [meetupPreference, setMeetupPreference] = useState<MeetupPreference>('public_place');
  const [selectedImage, setSelectedImage] = useState(SAMPLE_IMAGE_OPTIONS[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm max-w-md w-full text-center space-y-4">
          <Package className="w-10 h-10 text-[#006B45] mx-auto" />
          <h2 className="text-lg font-bold text-neutral-900">Sign in to List for Barter</h2>
          <p className="text-xs text-neutral-600">
            You must be logged in to create barter listings and manage trade proposals in Ghana.
          </p>
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !description.trim() || !wishlistExchange.trim()) {
      setError('Please fill in title, description, and what you are seeking in return.');
      return;
    }

    const finalImage = customImageUrl.trim() ? customImageUrl.trim() : selectedImage;

    const res = createListing({
      title: title.trim(),
      description: description.trim(),
      category,
      type,
      condition: type === 'services' ? 'not_applicable' : condition,
      estimatedValueGHS: Number(estimatedValueGHS) || 0,
      wishlistExchange: wishlistExchange.trim(),
      images: [finalImage],
      region,
      city: city.trim() || `${region} Central`,
      meetupPreference
    });

    if (res.success && res.listing) {
      navigate(`/listing/${res.listing.id}`);
    } else {
      setError(res.error || 'Failed to publish listing.');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Back Link */}
        <button
          onClick={() => navigate('/marketplace')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Marketplace</span>
        </button>

        <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-sm p-6 sm:p-8">
          
          <div className="mb-6 pb-6 border-b border-neutral-100">
            <span className="text-xs font-bold text-[#006B45] uppercase tracking-wider">New Barter Offering</span>
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight mt-1">
              List Goods or Services for Trade
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Offer items or professional skills to traders across Accra, Kumasi, and all 16 Ghana regions.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            
            {/* Goods vs Services Toggle */}
            <div>
              <label className="block font-semibold text-neutral-800 mb-2">
                What are you listing? *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setType('goods')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                    type === 'goods'
                      ? 'border-[#006B45] bg-emerald-50/50 text-[#006B45] ring-1 ring-[#006B45]'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <Package className="w-5 h-5 text-[#006B45]" />
                  <div>
                    <div className="font-bold text-xs">Physical Goods</div>
                    <div className="text-[10px] text-neutral-500">Phones, laptops, solar power, furniture, Kente, auto parts</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setType('services')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                    type === 'services'
                      ? 'border-[#006B45] bg-emerald-50/50 text-[#006B45] ring-1 ring-[#006B45]'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <Wrench className="w-5 h-5 text-[#006B45]" />
                  <div>
                    <div className="font-bold text-xs">Professional Services</div>
                    <div className="text-[10px] text-neutral-500">Design, web development, electrical, carpentry, tutoring</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block font-semibold text-neutral-800 mb-1">
                Listing Title *
              </label>
              <input
                type="text"
                required
                placeholder={type === 'goods' ? 'e.g. iPhone 13 Pro 256GB Sierra Blue (Factory Unlocked)' : 'e.g. Complete Custom Logo & 5-Page Next.js Business Website'}
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:border-[#006B45]"
              />
            </div>

            {/* Category & Condition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-neutral-800 mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white focus:outline-none focus:border-[#006B45]"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {type === 'goods' ? (
                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">
                    Item Condition *
                  </label>
                  <select
                    value={condition}
                    onChange={e => setCondition(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white focus:outline-none focus:border-[#006B45]"
                  >
                    <option value="new">Brand New (Unopened/Sealed)</option>
                    <option value="like_new">Like New (Mint with minor box wear)</option>
                    <option value="gently_used">Gently Used (Fully functional)</option>
                    <option value="fair">Fair (Visible cosmetic marks, works fine)</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">
                    Service Turnaround
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 7-14 business days with 3 revision rounds"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-neutral-50"
                  />
                </div>
              )}
            </div>

            {/* Estimated Value GH₵ */}
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
              <label className="block font-semibold text-neutral-800 mb-1">
                Estimated Value in Ghana Cedis (GH₵) *
              </label>
              <p className="text-[11px] text-neutral-500 mb-2">
                This helps counterparties evaluate fair barter parity and calculate balancing cash top-ups. GoldCoast Trade processes zero real money.
              </p>
              <div className="flex items-center gap-2 max-w-xs">
                <span className="font-bold text-neutral-700">GH₵</span>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 4500"
                  value={estimatedValueGHS}
                  onChange={e => setEstimatedValueGHS(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white font-mono font-bold focus:outline-none focus:border-[#006B45]"
                />
              </div>
            </div>

            {/* Wishlist Exchange: What do you want in return? */}
            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200">
              <label className="block font-bold text-[#006B45] mb-1">
                What do you want in exchange? (Barter Wishlist) *
              </label>
              <p className="text-[11px] text-neutral-600 mb-2">
                Be specific about items or services you are willing to trade for.
              </p>
              <textarea
                rows={2}
                required
                placeholder="e.g. Portable Solar Generator (800W+), DJI Mini Drone, 4K Monitor, or Electric Scooter."
                value={wishlistExchange}
                onChange={e => setWishlistExchange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white focus:outline-none focus:border-[#006B45]"
              />
            </div>

            {/* Detailed Description */}
            <div>
              <label className="block font-semibold text-neutral-800 mb-1">
                Full Description & Specifications *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Include specifications, battery health, accessories included, reason for trading, and any warranties."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:border-[#006B45]"
              />
            </div>

            {/* Image Selector / Gallery */}
            <div>
              <label className="block font-semibold text-neutral-800 mb-1.5 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#006B45]" />
                <span>Select Showcase Photo *</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                {SAMPLE_IMAGE_OPTIONS.map(opt => (
                  <button
                    key={opt.url}
                    type="button"
                    onClick={() => { setSelectedImage(opt.url); setCustomImageUrl(''); }}
                    className={`relative rounded-xl overflow-hidden aspect-[4/3] border-2 cursor-pointer transition-all ${
                      selectedImage === opt.url && !customImageUrl
                        ? 'border-[#006B45] ring-2 ring-[#006B45]/20'
                        : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={opt.url} alt={opt.label} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] py-0.5 text-center truncate px-1">
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>

              <div>
                <input
                  type="url"
                  placeholder="Or paste an image URL (optional)"
                  value={customImageUrl}
                  onChange={e => setCustomImageUrl(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-[#006B45]"
                />
              </div>
            </div>

            {/* Location & Meetup Preference */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-neutral-800 mb-1">
                  Ghana Region *
                </label>
                <select
                  value={region}
                  onChange={e => {
                    const reg = e.target.value as GhanaRegion;
                    setRegion(reg);
                    const regInfo = GHANA_REGIONS.find(r => r.name === reg);
                    if (regInfo && regInfo.popularTowns[0]) {
                      setCity(regInfo.popularTowns[0]);
                    }
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white focus:outline-none focus:border-[#006B45]"
                >
                  {GHANA_REGIONS.map(r => (
                    <option key={r.name} value={r.name}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-800 mb-1">
                  City / Town *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. East Legon, Accra"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:border-[#006B45]"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-800 mb-1">
                  Meetup Preference
                </label>
                <select
                  value={meetupPreference}
                  onChange={e => setMeetupPreference(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white focus:outline-none focus:border-[#006B45]"
                >
                  <option value="public_place">Accra/Kumasi Mall or Public Plaza</option>
                  <option value="police_station">Police Station Frontage</option>
                  <option value="flexible">Flexible Public Venue</option>
                </select>
              </div>
            </div>

            {/* Safety Assurance */}
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-neutral-600 text-[11px] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#006B45] shrink-0" />
              <span>
                Your listing will be published immediately to traders in Ghana. You can negotiate offers and choose counterparties directly in private chat.
              </span>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/marketplace')}
                className="px-5 py-2.5 text-neutral-600 hover:bg-neutral-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 font-bold text-white bg-[#006B45] hover:bg-[#004D31] rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                Publish Barter Listing
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};
