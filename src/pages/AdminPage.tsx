import React, { useState, useEffect } from 'react';
import {
  getCurrentUser,
  getAllUsers,
  getListings,
  getTradeOffers,
  getAllReports,
  getAuditLogs,
  updateReportStatus,
  deleteListing,
  updateListing,
  toggleUserVerification,
  toggleUserBan,
  subscribeToStore
} from '../services/storageService';
import { VerifiedUserBadge } from '../components/common/VerifiedUserBadge';
import {
  ShieldAlert,
  Users,
  Package,
  Repeat,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Trash2,
  Flag,
  FileText,
  Clock,
  ArrowRightLeft
} from 'lucide-react';

interface AdminPageProps {
  navigate: (path: string) => void;
  openAuthModal: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ navigate, openAuthModal }) => {
  const currentUser = getCurrentUser();

  const [activeTab, setActiveTab] = useState<'reports' | 'listings' | 'users' | 'audit'>('reports');
  const [users, setUsers] = useState(getAllUsers());
  const [listings, setListings] = useState(getListings({ status: undefined }));
  const [reports, setReports] = useState(getAllReports());
  const [auditLogs, setAuditLogs] = useState(getAuditLogs());

  const refresh = () => {
    setUsers(getAllUsers());
    setListings(getListings({ status: undefined }));
    setReports(getAllReports());
    setAuditLogs(getAuditLogs());
  };

  useEffect(() => {
    refresh();
    const unsub = subscribeToStore(refresh);
    return () => unsub();
  }, []);

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm max-w-md w-full text-center space-y-4">
          <ShieldAlert className="w-12 h-12 text-red-600 mx-auto" />
          <h2 className="text-lg font-bold text-neutral-900">Admin Governance Portal Restricted</h2>
          <p className="text-xs text-neutral-600 leading-relaxed">
            This console is strictly restricted to platform administrators to monitor reports, moderate listings, and maintain trust and safety.
          </p>
          <div className="p-3 bg-amber-50 rounded-lg text-amber-900 text-xs border border-amber-200">
            For testing: You can switch to administrator account <strong>Kofi Boateng</strong> in the top switcher bar or sign in as <code>admin@goldcoasttrade.gh</code>.
          </div>
          <button
            onClick={openAuthModal}
            className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#006B45] hover:bg-[#004D31] rounded-lg transition-colors cursor-pointer"
          >
            Switch to Admin Persona
          </button>
        </div>
      </div>
    );
  }

  const allOffers = getTradeOffers();
  const completedCount = allOffers.filter(o => o.status === 'completed').length;
  const pendingReportsCount = reports.filter(r => r.status === 'pending').length;

  const handleResolveReport = (reportId: string, status: 'resolved' | 'dismissed') => {
    const note = prompt(`Enter resolution notes for report ${reportId}:`, 'Action taken per platform policy.');
    if (note !== null) {
      updateReportStatus(reportId, status, note);
    }
  };

  const handleDeleteListing = (id: string) => {
    if (window.confirm('Delete this listing permanently as administrator?')) {
      deleteListing(id);
    }
  };

  const handleToggleFlag = (id: string, currentStatus: string) => {
    const next = currentStatus === 'flagged' ? 'active' : 'flagged';
    updateListing(id, { status: next as any });
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 mb-1">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Trust & Safety Administration</span>
              <span>·</span>
              <span>Ghana Operations Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              Platform Governance & Moderation
            </h1>
          </div>

          <div className="text-xs text-neutral-500 bg-white px-3 py-2 rounded-xl border border-neutral-200">
            Logged in: <strong>{currentUser.name}</strong> ({currentUser.email})
          </div>
        </div>

        {/* High Level Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-2xs">
            <span className="text-neutral-400 block text-xs">Total Registered Traders</span>
            <span className="text-2xl font-black text-neutral-900 font-mono mt-1 block">
              {users.length}
            </span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-2xs">
            <span className="text-neutral-400 block text-xs">Active Barter Listings</span>
            <span className="text-2xl font-black text-[#006B45] font-mono mt-1 block">
              {listings.length}
            </span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-2xs">
            <span className="text-neutral-400 block text-xs">Completed Verified Trades</span>
            <span className="text-2xl font-black text-amber-800 font-mono mt-1 block">
              {completedCount}
            </span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-2xs">
            <span className="text-neutral-400 block text-xs">Pending Reports</span>
            <span className={`text-2xl font-black font-mono mt-1 block ${pendingReportsCount > 0 ? 'text-red-600' : 'text-neutral-900'}`}>
              {pendingReportsCount}
            </span>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-neutral-200 mb-6 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('reports')}
            className={`pb-3 px-3 transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'reports'
                ? 'border-[#006B45] text-[#006B45]'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Safety Reports ({pendingReportsCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('listings')}
            className={`pb-3 px-3 transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'listings'
                ? 'border-[#006B45] text-[#006B45]'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Listings Management ({listings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 px-3 transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'users'
                ? 'border-[#006B45] text-[#006B45]'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Traders & Verification ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`pb-3 px-3 transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'audit'
                ? 'border-[#006B45] text-[#006B45]'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Audit Trail ({auditLogs.length})</span>
          </button>
        </div>

        {/* Tab 1: Safety Reports */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-6">
            <h3 className="text-base font-bold text-neutral-900 mb-4">Reported Users & Listings</h3>
            {reports.length > 0 ? (
              <div className="divide-y divide-neutral-100 text-xs">
                {reports.map(rep => (
                  <div key={rep.id} className="py-4 flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900 capitalize">
                          [{rep.targetType}] {rep.targetTitleOrName}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          rep.status === 'pending'
                            ? 'bg-red-100 text-red-800'
                            : rep.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}>
                          {rep.status}
                        </span>
                      </div>
                      <div className="text-neutral-500 text-[11px]">
                        Reported by: <strong>{rep.reporterName}</strong> · Reason: <span className="font-semibold text-neutral-700 capitalize">{rep.reason.replace('_', ' ')}</span> · Date: {new Date(rep.createdAt).toLocaleDateString()}
                      </div>
                      <p className="text-neutral-700 bg-neutral-50 p-2.5 rounded-lg border border-neutral-100 italic">
                        "{rep.details}"
                      </p>
                      {rep.adminNotes && (
                        <div className="text-[11px] text-[#006B45] font-medium">
                          Moderator Action: {rep.adminNotes}
                        </div>
                      )}
                    </div>

                    {rep.status === 'pending' && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleResolveReport(rep.id, 'resolved')}
                          className="px-3 py-1.5 bg-[#006B45] hover:bg-[#004D31] text-white font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                          Resolve & Penalize
                        </button>
                        <button
                          onClick={() => handleResolveReport(rep.id, 'dismissed')}
                          className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors cursor-pointer"
                        >
                          Dismiss
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-neutral-400 text-xs">
                No reports submitted. Community is trading smoothly!
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Listings Moderation */}
        {activeTab === 'listings' && (
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-6">
            <h3 className="text-base font-bold text-neutral-900 mb-4">All Marketplace Offerings</h3>
            <div className="divide-y divide-neutral-100 text-xs">
              {listings.map(l => (
                <div key={l.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={l.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover border border-neutral-200" />
                    <div>
                      <div className="font-bold text-neutral-900 hover:text-[#006B45] cursor-pointer" onClick={() => navigate(`/listing/${l.id}`)}>
                        {l.title}
                      </div>
                      <div className="text-neutral-500 text-[11px]">
                        Owner: <strong>{l.userName}</strong> · {l.city} · Est. GH₵ {l.estimatedValueGHS.toLocaleString()} · Status: <span className="font-semibold">{l.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleFlag(l.id, l.status)}
                      className={`px-2.5 py-1 rounded text-xs border cursor-pointer ${
                        l.status === 'flagged'
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                      }`}
                    >
                      {l.status === 'flagged' ? 'Unflag' : 'Flag Listing'}
                    </button>
                    <button
                      onClick={() => handleDeleteListing(l.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 rounded cursor-pointer"
                      title="Delete listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Traders Management */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-6">
            <h3 className="text-base font-bold text-neutral-900 mb-4">Registered Traders & Verification</h3>
            <div className="divide-y divide-neutral-100 text-xs">
              {users.map(u => {
                const isBanned = (u as any).banned || false;
                return (
                  <div key={u.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-neutral-200" />
                      <div>
                        <div className="font-bold text-neutral-900 flex items-center gap-1.5 flex-wrap">
                          <span>{u.name}</span>
                          <VerifiedUserBadge
                            user={{
                              createdAt: u.createdAt,
                              memberSince: u.memberSince,
                              completedTradesCount: u.completedTradesCount,
                              trustRating: u.trustRating,
                              verifiedTrader: u.verifiedTrader,
                              name: u.name
                            }}
                            variant="badge"
                          />
                          {u.role === 'admin' && <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 rounded">Admin</span>}
                          {isBanned && <span className="text-[10px] text-red-700 bg-red-100 px-1.5 rounded font-bold">Banned</span>}
                        </div>
                        <div className="text-neutral-500 text-[11px]">
                          {u.email} · {u.city} ({u.region}) · ★ {u.trustRating} ({u.completedTradesCount} barters)
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleUserVerification(u.id)}
                        className={`px-3 py-1 text-xs rounded-lg border font-medium cursor-pointer transition-colors ${
                          u.verifiedTrader
                            ? 'bg-emerald-50 text-[#006B45] border-emerald-300'
                            : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                        }`}
                      >
                        {u.verifiedTrader ? '✓ Verified Trader' : 'Grant Verified'}
                      </button>

                      {u.id !== currentUser.id && (
                        <button
                          onClick={() => toggleUserBan(u.id)}
                          className={`px-3 py-1 text-xs rounded-lg border font-medium cursor-pointer transition-colors ${
                            isBanned
                              ? 'bg-red-600 text-white border-red-700'
                              : 'bg-white text-red-600 border-red-200 hover:bg-red-50'
                          }`}
                        >
                          {isBanned ? 'Unban User' : 'Ban User'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Audit Logs */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-6">
            <h3 className="text-base font-bold text-neutral-900 mb-4">Chronological Moderation Audit Trail</h3>
            <div className="space-y-3 text-xs">
              {auditLogs.map(log => (
                <div key={log.id} className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neutral-900">{log.action.replace('_', ' ').toUpperCase()}</span>
                      <span className="text-[10px] text-neutral-400">Actor: {log.actorName}</span>
                    </div>
                    <p className="text-neutral-700">{log.details}</p>
                  </div>
                  <span className="text-[10px] text-neutral-400 shrink-0">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
