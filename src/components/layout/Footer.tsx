import React from 'react';
import { ShieldCheck, MapPin, HeartHandshake, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  navigate: (path: string) => void;
  openSafetyModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate, openSafetyModal }) => {
  return (
    <footer className="bg-neutral-900 text-neutral-300 pt-16 pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Safe Trade Notice Banner */}
        <div className="p-5 rounded-2xl bg-[#004D31]/70 border border-[#006B45] text-neutral-200 mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-[#F7B718] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-white">Safe Exchange Protocol & Disclaimer</h4>
              <p className="text-xs text-neutral-300 mt-1 max-w-2xl leading-relaxed">
                GoldCoast Trade connects users to barter goods and services directly. We do not hold escrow, process real payments, or arrange courier collections. Always inspect items thoroughly and meet in busy public venues (Accra Mall, Kumasi Mall, Shell stations, or outside Police Stations) during daylight hours.
              </p>
            </div>
          </div>
          <button
            onClick={openSafetyModal}
            className="px-4 py-2 text-xs font-semibold text-neutral-900 bg-[#F7B718] hover:bg-[#D49B0E] rounded-lg transition-colors shrink-0 cursor-pointer"
          >
            Read Safety Rules
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-neutral-800">
          {/* Brand Col */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 rounded-lg bg-[#006B45] text-[#F7B718] flex items-center justify-center font-black text-sm">
                GC
              </span>
              <span className="text-lg font-bold text-white tracking-tight">
                GoldCoast<span className="text-[#F7B718]">Trade</span>
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed mb-4">
              Ghana's premier peer-to-peer barter marketplace. Trade what you have. Get what you need. Spend less cash.
            </p>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <MapPin className="w-3.5 h-3.5 text-[#F7B718]" />
              <span>Accra, Kumasi & All 16 Regions</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-xs font-bold text-neutral-200 uppercase tracking-wider mb-3">Marketplace</h5>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button onClick={() => navigate('/marketplace?type=goods')} className="hover:text-white transition-colors cursor-pointer">
                  Barter Goods
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/marketplace?type=services')} className="hover:text-white transition-colors cursor-pointer">
                  Exchange Professional Services
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/create-listing')} className="hover:text-white transition-colors cursor-pointer">
                  List Your Items for Barter
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/offers')} className="hover:text-white transition-colors cursor-pointer">
                  Active Trade Proposals
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h5 className="text-xs font-bold text-neutral-200 uppercase tracking-wider mb-3">Top Trades</h5>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button onClick={() => navigate('/marketplace?cat=electronics')} className="hover:text-white transition-colors cursor-pointer">
                  Laptops & Smartphones
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/marketplace?cat=home-solar')} className="hover:text-white transition-colors cursor-pointer">
                  Solar Power & Inverters
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/marketplace?cat=services-digital')} className="hover:text-white transition-colors cursor-pointer">
                  Web & Brand Design Services
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/marketplace?cat=fashion-kente')} className="hover:text-white transition-colors cursor-pointer">
                  Authentic Kente & Fashion
                </button>
              </li>
            </ul>
          </div>

          {/* Trust & Community */}
          <div>
            <h5 className="text-xs font-bold text-neutral-200 uppercase tracking-wider mb-3">Trust & Safety</h5>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button onClick={openSafetyModal} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1">
                  <span>Ghana Safe Meetup Guide</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </button>
              </li>
              <li>
                <span className="text-neutral-400">No Advance Mobile Money Fees</span>
              </li>
              <li>
                <span className="text-neutral-400">Mutual Completion Verification</span>
              </li>
              <li>
                <button onClick={() => navigate('/admin')} className="text-neutral-500 hover:text-neutral-300 text-[11px] pt-1">
                  Admin Governance
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            © {new Date().getFullYear()} GoldCoast Trade. Trade What You Have. Get What You Need.
          </div>
          <div className="flex items-center gap-4 text-neutral-400 text-[11px]">
            <span>Ghana Cedis (GH₵) Estimates for Balancing Only</span>
            <span>·</span>
            <span>Zero Payment Escrow</span>
            <span>·</span>
            <span className="text-emerald-400 font-medium">Made for Ghanaian Commerce</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
