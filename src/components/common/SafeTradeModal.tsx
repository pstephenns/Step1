import React from 'react';
import { X, ShieldAlert, CheckCircle2, AlertTriangle, MapPin, SunMedium, Smartphone, Lock } from 'lucide-react';

interface SafeTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafeTradeModal: React.FC<SafeTradeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200">
        
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-neutral-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-[#006B45]">
              <ShieldAlert className="w-5 h-5 text-[#006B45]" />
            </span>
            <div>
              <h3 className="text-base font-bold text-neutral-900">Ghana Safe Barter Exchange Protocol</h3>
              <p className="text-xs text-neutral-500">Protecting your trades in Accra, Kumasi, and nationwide</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-sm">
          
          {/* Key Rule Callout */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">
                Golden Rule: Never Pay Advance Mobile Money
              </strong>
              <p className="text-xs text-amber-800 leading-relaxed">
                Legitimate barterers never demand upfront "delivery fees", "reservation deposits", or fuel allowances over MoMo. If an offerer insists on money before an in-person meeting, cancel and report them immediately.
              </p>
            </div>
          </div>

          {/* 4 Pillars of Safe Exchange */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50">
              <div className="flex items-center gap-2 text-neutral-900 font-semibold text-xs mb-2">
                <MapPin className="w-4 h-4 text-[#006B45]" />
                <span>1. Verified Public Meetup Points</span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Meet in crowded, well-lit spaces with active security. Great spots include: <strong>Accra Mall Food Court</strong>, <strong>Kumasi City Mall</strong>, <strong>Junction Mall (Nungua)</strong>, or directly in front of the local <strong>Ghana Police Station</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50">
              <div className="flex items-center gap-2 text-neutral-900 font-semibold text-xs mb-2">
                <SunMedium className="w-4 h-4 text-[#006B45]" />
                <span>2. Daylight Trading Hours</span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Schedule your exchange between <strong>9:00 AM and 4:30 PM</strong>. Never agree to night meetups, secluded unpaved backroads, or private residences with strangers. Bring a friend along when exchanging high-value items.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50">
              <div className="flex items-center gap-2 text-neutral-900 font-semibold text-xs mb-2">
                <Smartphone className="w-4 h-4 text-[#006B45]" />
                <span>3. In-Person Tech Inspection</span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                For phones, laptops, or solar inverters: Power on the device, verify iCloud / Google account is completely signed out, test cameras, microphones, battery health, and test SIM slots before confirming handover.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50">
              <div className="flex items-center gap-2 text-neutral-900 font-semibold text-xs mb-2">
                <Lock className="w-4 h-4 text-[#006B45]" />
                <span>4. Mutual Completion System</span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                After both parties inspect and exchange items, both must tap <strong>"Confirm Handover Complete"</strong> in GoldCoast Trade. This officially marks the barter completed and unlocks verified community reviews.
              </p>
            </div>

          </div>

          {/* Legal Disclaimer */}
          <div className="pt-4 border-t border-neutral-200 text-xs text-neutral-500 leading-relaxed">
            <strong className="text-neutral-700 block mb-1">Platform Disclaimer:</strong>
            GoldCoast Trade provides peer-to-peer barter discovery, negotiation tools, and reputation ratings. GoldCoast Trade does not act as an escrow agent, does not process money payments, does not inspect goods on your behalf, and does not provide courier guarantees. Users retain sole responsibility for evaluating counterparties and executing physical exchanges safely.
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#006B45] hover:bg-[#004D31] rounded-lg transition-colors cursor-pointer"
          >
            I Understand & Agree to Trade Safely
          </button>
        </div>

      </div>
    </div>
  );
};
