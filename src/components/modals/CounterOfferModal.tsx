import React, { useState } from 'react';
import { TradeOffer, OfferedItem } from '../../types';
import { respondToOffer } from '../../services/storageService';
import { X, RefreshCw, AlertCircle } from 'lucide-react';

interface CounterOfferModalProps {
  isOpen: boolean;
  offer: TradeOffer;
  onClose: () => void;
  onSuccess: () => void;
}

export const CounterOfferModal: React.FC<CounterOfferModalProps> = ({
  isOpen,
  offer,
  onClose,
  onSuccess
}) => {
  const [note, setNote] = useState('');
  const [cashDirection, setCashDirection] = useState<'none' | 'offered_by_sender' | 'requested_from_receiver'>(
    offer.cashDirection || 'none'
  );
  const [cashTopUpGHS, setCashTopUpGHS] = useState<number | ''>(offer.optionalCashTopUpGHS || '');
  const [itemTitle, setItemTitle] = useState(offer.offeredItems[0]?.title || '');
  const [itemType, setItemType] = useState<'goods' | 'services'>(offer.offeredItems[0]?.type || 'goods');
  const [itemVal, setItemVal] = useState<number | ''>(offer.offeredItems[0]?.estimatedValueGHS || '');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!note.trim()) {
      setError('Please provide a note explaining your counter-proposal.');
      return;
    }

    const items: OfferedItem[] = [
      {
        id: `offered_${Date.now()}`,
        title: itemTitle.trim() || offer.offeredItems[0]?.title || 'Barter Item',
        type: itemType,
        estimatedValueGHS: Number(itemVal) || 0
      }
    ];

    const ok = respondToOffer(offer.id, 'counter', {
      note: note.trim(),
      offeredItems: items,
      optionalCashTopUpGHS: cashDirection !== 'none' ? Number(cashTopUpGHS) || 0 : 0,
      cashDirection
    });

    if (ok) {
      onSuccess();
      onClose();
    } else {
      setError('Failed to submit counter-proposal.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
              <RefreshCw className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-neutral-900">Counter-Offer Proposal</h3>
              <p className="text-xs text-neutral-500">Adjust barter terms for "{offer.listingTitle}"</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              Adjust Offered Item / Service Description
            </label>
            <input
              type="text"
              required
              value={itemTitle}
              onChange={e => setItemTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:border-[#006B45]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-neutral-700 mb-1">Type</label>
              <select
                value={itemType}
                onChange={e => setItemType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:border-[#006B45]"
              >
                <option value="goods">Goods</option>
                <option value="services">Services</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-neutral-700 mb-1">Est. Value (GH₵)</label>
              <input
                type="number"
                value={itemVal}
                onChange={e => setItemVal(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:border-[#006B45]"
              />
            </div>
          </div>

          {/* Cash top up adjustment */}
          <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
            <label className="block font-semibold text-neutral-800 mb-2">
              Adjust Cash Balancing Top-Up
            </label>
            <div className="grid grid-cols-3 gap-1.5 mb-2.5">
              <button
                type="button"
                onClick={() => setCashDirection('none')}
                className={`py-1 px-2 rounded border text-center cursor-pointer ${
                  cashDirection === 'none'
                    ? 'border-[#006B45] bg-[#006B45] text-white font-medium'
                    : 'border-neutral-200 bg-white text-neutral-700'
                }`}
              >
                No Cash
              </button>
              <button
                type="button"
                onClick={() => setCashDirection('offered_by_sender')}
                className={`py-1 px-2 rounded border text-center cursor-pointer ${
                  cashDirection === 'offered_by_sender'
                    ? 'border-[#006B45] bg-[#006B45] text-white font-medium'
                    : 'border-neutral-200 bg-white text-neutral-700'
                }`}
              >
                Offer +GH₵
              </button>
              <button
                type="button"
                onClick={() => setCashDirection('requested_from_receiver')}
                className={`py-1 px-2 rounded border text-center cursor-pointer ${
                  cashDirection === 'requested_from_receiver'
                    ? 'border-[#006B45] bg-[#006B45] text-white font-medium'
                    : 'border-neutral-200 bg-white text-neutral-700'
                }`}
              >
                Request +GH₵
              </button>
            </div>

            {cashDirection !== 'none' && (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-neutral-600">GH₵</span>
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="Amount in GH₵"
                  value={cashTopUpGHS}
                  onChange={e => setCashTopUpGHS(e.target.value ? Number(e.target.value) : '')}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-neutral-300 bg-white focus:outline-none focus:border-[#006B45]"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              Counter Explanation / Reason *
            </label>
            <textarea
              rows={3}
              required
              placeholder="e.g. I can do the trade if you add GH₵ 500 top-up or include the charger and case."
              value={note}
              onChange={e => setNote(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:border-[#006B45]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-semibold text-white bg-[#006B45] hover:bg-[#004D31] rounded-lg transition-colors cursor-pointer"
            >
              Send Counter Proposal
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
