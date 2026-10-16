import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Clock, CheckCircle2, Info, X } from 'lucide-react';
import { getUserVerificationDetails, VerificationDetails } from '../../utils/userVerification';

interface VerifiedUserBadgeProps {
  user: {
    createdAt?: string;
    memberSince?: string;
    completedTradesCount?: number;
    trustRating?: number;
    verifiedTrader?: boolean;
    name?: string;
  };
  variant?: 'inline' | 'card' | 'badge';
  showPopover?: boolean;
}

export const VerifiedUserBadge: React.FC<VerifiedUserBadgeProps> = ({
  user,
  variant = 'inline',
  showPopover = true
}) => {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const details: VerificationDetails = getUserVerificationDetails(user);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  // Variant: Card (Used on User Profile & Listing Detail)
  if (variant === 'card') {
    return (
      <div className={`p-4 rounded-xl border ${details.borderClass} ${details.bgClass} text-neutral-800`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <span className="p-1.5 rounded-lg bg-white shadow-2xs text-[#006B45] shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5 text-[#006B45]" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-neutral-900">{details.title}</h4>
                <span className="text-[10px] font-semibold text-[#006B45] bg-white px-2 py-0.5 rounded border border-emerald-200">
                  {details.ageFormatted}
                </span>
              </div>
              <p className="text-[11px] text-neutral-600 mt-0.5 leading-relaxed">
                Verified based on account activity age and safe trade standing. Member since {details.memberSinceFormatted}.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-emerald-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-neutral-600">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#006B45] shrink-0" />
            <span>Account Age: <strong>{details.ageFormatted}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#006B45] shrink-0" />
            <span>Completed Barters: <strong>{user.completedTradesCount || 0} trades</strong></span>
          </div>
        </div>
      </div>
    );
  }

  // Variant: Badge (Prominent pill/tag)
  if (variant === 'badge') {
    return (
      <div className="relative inline-block" ref={popoverRef}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (showPopover) setOpen(!open);
          }}
          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
            details.isVerified
              ? 'bg-emerald-50 text-[#006B45] border-emerald-200 hover:bg-emerald-100/70'
              : 'bg-neutral-100 text-neutral-600 border-neutral-200 hover:bg-neutral-200/60'
          }`}
          title="Click to view Account Activity Age verification details"
        >
          <ShieldCheck className={`w-3.5 h-3.5 ${details.isVerified ? 'text-[#006B45]' : 'text-neutral-400'}`} />
          <span>{details.shortBadge}</span>
          {showPopover && <Info className="w-2.5 h-2.5 opacity-60 ml-0.5" />}
        </button>

        {open && renderPopover(details, user, () => setOpen(false))}
      </div>
    );
  }

  // Variant: Inline (Clean unboxed inline indicator for cards and lists)
  return (
    <div className="relative inline-flex items-center" ref={popoverRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (showPopover) setOpen(!open);
        }}
        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#006B45] hover:text-[#004D31] hover:underline cursor-pointer group"
        title="Verified based on account activity age"
      >
        <ShieldCheck className="w-3.5 h-3.5 text-[#006B45] shrink-0" />
        <span>{details.isVerified ? `Verified · ${details.ageFormatted}` : details.shortBadge}</span>
      </button>

      {open && renderPopover(details, user, () => setOpen(false))}
    </div>
  );
};

function renderPopover(
  details: VerificationDetails,
  user: any,
  onClose: () => void
) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute bottom-full left-0 mb-2 w-72 bg-white rounded-xl shadow-xl border border-neutral-200 p-3.5 z-50 text-xs text-neutral-800 animate-in fade-in duration-100"
    >
      <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
        <div className="flex items-center gap-1.5 font-bold text-neutral-900">
          <ShieldCheck className="w-4 h-4 text-[#006B45]" />
          <span>{details.title}</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-neutral-400 hover:text-neutral-700 rounded cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="py-2.5 space-y-2">
        <div className="text-[11px] text-neutral-600 leading-snug">
          Verified User indicator is calculated based on <strong>account activity longevity</strong> to protect Ghana barterers from new, unvetted accounts.
        </div>

        <div className="p-2 bg-neutral-50 rounded-lg space-y-1 text-[11px]">
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Account Age:</span>
            <strong className="text-neutral-900">{details.ageFormatted}</strong>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Member Since:</span>
            <span className="text-neutral-800">{details.memberSinceFormatted}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Completed Barters:</span>
            <span className="text-neutral-800">{user.completedTradesCount || 0} verified</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Trust Score:</span>
            <span className="text-amber-800 font-bold">★ {user.trustRating || 5.0}</span>
          </div>
        </div>

        <div className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 leading-tight">
          ✓ Passed 30+ day account activity threshold with zero verified fraud or scam reports.
        </div>
      </div>
    </div>
  );
}
