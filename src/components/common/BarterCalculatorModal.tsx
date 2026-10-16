import React, { useState } from 'react';
import { X, Calculator, ArrowRightLeft, TrendingUp, Sparkles, CheckCircle2, DollarSign } from 'lucide-react';

interface BarterCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMyVal?: number;
  initialTheirVal?: number;
}

export const BarterCalculatorModal: React.FC<BarterCalculatorModalProps> = ({
  isOpen,
  onClose,
  initialMyVal = 4500,
  initialTheirVal = 6000
}) => {
  const [myItemName, setMyItemName] = useState('My Item / Service (e.g. Phone)');
  const [myVal, setMyVal] = useState<number | ''>(initialMyVal);

  const [theirItemName, setTheirItemName] = useState('Their Item / Service (e.g. Laptop)');
  const [theirVal, setTheirVal] = useState<number | ''>(initialTheirVal);

  if (!isOpen) return null;

  const numMy = Number(myVal) || 0;
  const numTheir = Number(theirVal) || 0;
  const diff = numTheir - numMy;
  const parity = numTheir > 0 ? Math.min(100, Math.round((Math.min(numMy, numTheir) / Math.max(numMy, numTheir)) * 100)) : 100;
  const cashSaved = Math.min(numMy, numTheir);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-[#006B45]">
              <Calculator className="w-5 h-5 text-[#006B45]" />
            </span>
            <div>
              <h3 className="text-base font-bold text-neutral-900">Barter Value Parity Calculator</h3>
              <p className="text-xs text-neutral-500">Calculate fair balance top-ups in Ghana Cedis (GH₵)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* My Side */}
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
              <span className="text-[10px] font-bold text-[#006B45] uppercase tracking-wide">
                What You Are Offering
              </span>
              <input
                type="text"
                value={myItemName}
                onChange={e => setMyItemName(e.target.value)}
                placeholder="Item name"
                className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 bg-white text-xs font-medium"
              />
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-neutral-600">GH₵</span>
                <input
                  type="number"
                  min="0"
                  value={myVal}
                  onChange={e => setMyVal(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Estimated Value"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 bg-white text-xs font-mono font-bold"
                />
              </div>
            </div>

            {/* Their Side */}
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wide">
                What They Are Offering
              </span>
              <input
                type="text"
                value={theirItemName}
                onChange={e => setTheirItemName(e.target.value)}
                placeholder="Item name"
                className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 bg-white text-xs font-medium"
              />
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-neutral-600">GH₵</span>
                <input
                  type="number"
                  min="0"
                  value={theirVal}
                  onChange={e => setTheirVal(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Estimated Value"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 bg-white text-xs font-mono font-bold"
                />
              </div>
            </div>

          </div>

          {/* Results Analysis */}
          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-neutral-800 space-y-3">
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#006B45]">Barter Parity Index</span>
              <span className="font-mono font-black text-sm text-[#006B45]">{parity}% Match</span>
            </div>

            {/* Parity Bar */}
            <div className="w-full h-2 rounded-full bg-emerald-200 overflow-hidden">
              <div
                className="h-full bg-[#006B45] transition-all duration-300"
                style={{ width: `${parity}%` }}
              />
            </div>

            {/* Recommendations */}
            <div className="pt-2 text-xs leading-relaxed">
              {diff === 0 ? (
                <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Perfect 1:1 barter parity! No cash balancing needed.</span>
                </div>
              ) : diff > 0 ? (
                <div className="space-y-1">
                  <div className="font-bold text-neutral-900">
                    Recommended Balancing Adjustment:
                  </div>
                  <p className="text-neutral-700">
                    You should offer a cash balance top-up of approximately{' '}
                    <strong className="text-[#006B45] font-mono">
                      +GH₵ {diff.toLocaleString()}
                    </strong>{' '}
                    upon in-person meeting, OR add an auxiliary accessory/service to achieve fair barter value.
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="font-bold text-neutral-900">
                    Recommended Balancing Adjustment:
                  </div>
                  <p className="text-neutral-700">
                    Your offering is higher by{' '}
                    <strong className="text-amber-800 font-mono">
                      GH₵ {Math.abs(diff).toLocaleString()}
                    </strong>
                    . You can reasonably request a cash top-up of{' '}
                    <strong className="text-amber-800 font-mono">
                      +GH₵ {Math.abs(diff).toLocaleString()}
                    </strong>{' '}
                    from the counterparty.
                  </p>
                </div>
              )}
            </div>

            {/* Cash Savings Metric */}
            <div className="mt-2 pt-3 border-t border-emerald-200/80 flex items-center justify-between text-xs text-neutral-600">
              <span>Hard Currency Kept in Your Pocket:</span>
              <strong className="text-[#006B45] font-mono text-sm">
                GH₵ {cashSaved.toLocaleString()} Saved
              </strong>
            </div>

          </div>

          <div className="text-[11px] text-neutral-500 leading-relaxed">
            * Note: In barter trading, subjective utility often matters as much as book value. If both parties are happy with the mutual exchange, zero cash top-up is completely standard!
          </div>

        </div>

        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#006B45] hover:bg-[#004D31] rounded-lg cursor-pointer"
          >
            Apply to Trade
          </button>
        </div>

      </div>
    </div>
  );
};
