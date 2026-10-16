import React, { useState } from 'react';
import { submitReport } from '../../services/storageService';
import { Report } from '../../types';
import { X, Flag, AlertTriangle, CheckCircle } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  targetType: 'listing' | 'user';
  targetId: string;
  targetTitleOrName: string;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  targetType,
  targetId,
  targetTitleOrName,
  onClose
}) => {
  const [reason, setReason] = useState<Report['reason']>('scam_fraud');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;

    submitReport({
      targetType,
      targetId,
      targetTitleOrName,
      reason,
      details: details.trim()
    });

    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setDetails('');
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-neutral-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-red-50 text-red-600">
              <Flag className="w-5 h-5" />
            </span>
            <h3 className="text-base font-bold text-neutral-900">
              Report {targetType === 'listing' ? 'Listing' : 'Trader'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-xs">
          {submitted ? (
            <div className="py-8 text-center text-emerald-800 space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-sm">Report Received</h4>
              <p className="text-neutral-600 max-w-xs mx-auto">
                Thank you for helping keep the GoldCoast Trade community trustworthy and secure. Our Trust & Safety team will review this incident promptly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                <span className="text-[11px] text-neutral-500 uppercase tracking-wider block">Target</span>
                <span className="font-semibold text-neutral-800 text-xs">{targetTitleOrName}</span>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Reason for Report
                </label>
                <select
                  value={reason}
                  onChange={e => setReason(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-[#006B45]"
                >
                  <option value="scam_fraud">Scam, Advance Fee or MoMo deposit demand</option>
                  <option value="prohibited_item">Prohibited item or service</option>
                  <option value="abusive_chat">Harassment, hate speech, or offensive behavior</option>
                  <option value="fake_valuation">Grossly fake valuation / misleading counterfeit item</option>
                  <option value="ghosting">Unreasonable ghosting after accepting barter</option>
                  <option value="other">Other issue</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Specific Details *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Explain what happened. Include specific messages, dates, or circumstances so our moderation team can take immediate action."
                  value={details}
                  onChange={e => setDetails(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-[#006B45]"
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
                  className="px-5 py-2 font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer"
                >
                  Submit Report
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
