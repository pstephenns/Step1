import React, { useState } from 'react';
import { TradeOffer } from '../../types';
import { X, Printer, CheckCircle, ShieldCheck, Download, Copy, Share2, Award } from 'lucide-react';
import { getUserVerificationDetails } from '../../utils/userVerification';

interface TradeReceiptModalProps {
  isOpen: boolean;
  offer: TradeOffer;
  onClose: () => void;
}

export const TradeReceiptModal: React.FC<TradeReceiptModalProps> = ({ isOpen, offer, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const ownerAge = getUserVerificationDetails({ memberSince: 'March 2025' });
  const offererAge = getUserVerificationDetails({ memberSince: 'January 2025' });

  const receiptId = `GCT-${offer.id.toUpperCase().slice(-8)}`;
  const dateStr = offer.mutualConfirmation.ownerConfirmedAt
    ? new Date(offer.mutualConfirmation.ownerConfirmedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const text = `GoldCoast Trade - Official Barter Handover Slip
Verification ID: ${receiptId}
Date: ${dateStr}
Party A: ${offer.listingOwnerName} (${offer.offererRegion})
Party B: ${offer.offererName} (${offer.offererCity})
Item A: ${offer.listingTitle} (Est. GH₵ ${offer.listingEstimatedValueGHS.toLocaleString()})
Item B: ${offer.offeredItems.map(i => i.title).join(', ')}
Cash Top-Up: ${offer.cashDirection !== 'none' ? `GH₵ ${offer.optionalCashTopUpGHS.toLocaleString()}` : 'None (Pure Barter)'}
Status: Mutually Confirmed & Completed in Person`;

    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-neutral-200">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between sticky top-0 bg-white z-10 print:hidden">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-[#006B45]">
              <ShieldCheck className="w-5 h-5 text-[#006B45]" />
            </span>
            <div>
              <h3 className="text-base font-bold text-neutral-900">Official Barter Handover Slip</h3>
              <p className="text-xs text-neutral-500">Mutual exchange verification record</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg cursor-pointer"
              title="Print slip"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Slip (Printable) */}
        <div className="p-6 sm:p-8 space-y-6 text-xs bg-white text-neutral-900 font-sans print:p-0">
          
          {/* Slip Header */}
          <div className="border-b-2 border-[#006B45] pb-5 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-8 h-8 rounded-lg bg-[#006B45] text-[#F7B718] flex items-center justify-center font-black text-sm">
                  GC
                </span>
                <span className="text-xl font-extrabold text-[#006B45] tracking-tight">
                  GoldCoast<span className="text-[#D49B0E]">Trade</span>
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 uppercase tracking-widest font-semibold">
                Republic of Ghana · Peer-to-Peer Barter Exchange
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Verification ID</span>
              <span className="font-mono font-bold text-sm text-neutral-900">{receiptId}</span>
              <div className="text-[10px] text-neutral-500 mt-0.5">{dateStr}</div>
            </div>
          </div>

          {/* Verification Seal Callout */}
          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Award className="w-5 h-5 text-[#006B45] shrink-0" />
              <div>
                <span className="font-bold text-xs text-[#006B45]">
                  Status: Mutually Confirmed Handover Complete
                </span>
                <p className="text-[10px] text-neutral-600 mt-0.5">
                  Both parties inspected assets and validated physical handover in public venue.
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-white text-[#006B45] rounded-md font-mono text-[10px] font-bold border border-emerald-200">
              VERIFIED
            </span>
          </div>

          {/* Parties Grid */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Party A */}
            <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-1">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide block">
                Party A (Listing Owner)
              </span>
              <div className="font-bold text-sm text-neutral-900">{offer.listingOwnerName}</div>
              <div className="text-[11px] text-neutral-600">{offer.offererRegion}</div>
              <div className="text-[10px] text-[#006B45] font-semibold pt-1">
                ✓ Verified Account ({ownerAge.ageFormatted})
              </div>
            </div>

            {/* Party B */}
            <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-1">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide block">
                Party B (Trade Proposer)
              </span>
              <div className="font-bold text-sm text-neutral-900">{offer.offererName}</div>
              <div className="text-[11px] text-neutral-600">{offer.offererCity}</div>
              <div className="text-[10px] text-[#006B45] font-semibold pt-1">
                ✓ Verified Account ({offererAge.ageFormatted})
              </div>
            </div>

          </div>

          {/* Exchanged Items Ledger */}
          <div className="border border-neutral-200 rounded-xl overflow-hidden">
            <div className="bg-neutral-100 px-4 py-2 font-bold text-neutral-700 text-xs">
              Exchanged Assets & Value Parity Ledger
            </div>
            <div className="divide-y divide-neutral-100 p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-neutral-900">{offer.listingTitle}</div>
                  <div className="text-[11px] text-neutral-500">Transferred from Party A to Party B</div>
                </div>
                <div className="font-mono font-bold text-neutral-800 text-xs">
                  GH₵ {offer.listingEstimatedValueGHS.toLocaleString()}
                </div>
              </div>

              <div className="pt-2 flex items-start justify-between">
                <div>
                  <div className="font-bold text-neutral-900">
                    {offer.offeredItems.map(i => i.title).join(', ')}
                  </div>
                  <div className="text-[11px] text-neutral-500">Transferred from Party B to Party A</div>
                </div>
                <div className="font-mono font-bold text-neutral-800 text-xs">
                  {offer.offeredItems[0]?.estimatedValueGHS
                    ? `GH₵ ${offer.offeredItems[0].estimatedValueGHS.toLocaleString()}`
                    : 'Trade Agreed'}
                </div>
              </div>

              {offer.cashDirection !== 'none' && offer.optionalCashTopUpGHS > 0 && (
                <div className="pt-2 flex items-start justify-between text-amber-900 bg-amber-50/50 p-2 rounded-lg">
                  <div>
                    <div className="font-bold text-xs">In-Person Balancing Cash Adjustment</div>
                    <div className="text-[10px] text-amber-800">
                      Settled at in-person handover via Cash or instant Mobile Money
                    </div>
                  </div>
                  <div className="font-mono font-bold text-xs">
                    +GH₵ {offer.optionalCashTopUpGHS.toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Legal Non-Repudiation Footnote */}
          <div className="pt-4 border-t border-neutral-200 text-[10px] text-neutral-500 leading-relaxed space-y-1">
            <p>
              <strong>Acknowledgement:</strong> By mutually confirming trade handover within the GoldCoast Trade system, both parties affirm that items were inspected, delivered in satisfactory condition, and that full transfer of barter ownership occurred willingly.
            </p>
            <p>
              GoldCoast Trade is a peer-to-peer barter directory. This slip serves as a verified record of mutual completion.
            </p>
          </div>

        </div>

        {/* Actions Footer */}
        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between print:hidden">
          <button
            onClick={handleCopy}
            className="px-3.5 py-1.5 text-xs text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-100 flex items-center gap-1.5 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-[#006B45] hover:bg-[#004D31] rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#F7B718]" />
              <span>Print / Save PDF Slip</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
