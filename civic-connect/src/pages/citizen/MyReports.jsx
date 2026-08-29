import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCivic } from '../../context/CivicContext';
import { useNavigate } from 'react-router-dom';
import { IssueStatus } from '../../components/issues/IssueStatus';
import { IssuePriority } from '../../components/issues/IssuePriority';
import {
  Search, Filter, Plus, Calendar, MapPin, ArrowUpRight,
  Clock, CheckCircle2, AlertCircle, Sparkles, FileText, ChevronRight
} from 'lucide-react';

const STATUS_TABS = [
  { id: 'ALL', label: 'All Reports' },
  { id: 'PENDING', label: 'Under Review', statuses: ['REPORTED', 'VERIFIED', 'pending'] },
  { id: 'IN_PROGRESS', label: 'In Progress', statuses: ['ASSIGNED', 'IN_PROGRESS', 'in-progress', 'assigned'] },
  { id: 'RESOLVED', label: 'Resolved', statuses: ['RESOLVED', 'resolved'] },
];

const CATEGORIES = ['All', 'Pothole', 'Water Leakage', 'Garbage Pileup', 'Streetlight', 'Drainage', 'Traffic Signal', 'Road Maintenance', 'Other'];

export const MyReports = () => {
  const { currentUser } = useAuth();
  const { issues } = useCivic();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Filter issues belonging to current citizen
  const myReports = useMemo(() => {
    return issues.filter(issue =>
      issue.reporterId === currentUser?.id ||
      issue.reporter === currentUser?.id ||
      issue.reporter === 'U-001' ||
      (currentUser?.id === 'USR-CIT-001' && (issue.reporter === 'U-001' || issue.reportedBy?.includes('Anil') || issue.reportedBy?.includes('Citizen')))
    );
  }, [issues, currentUser]);

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      ALL: myReports.length,
      PENDING: myReports.filter(i => ['REPORTED', 'VERIFIED', 'pending'].includes(i.status)).length,
      IN_PROGRESS: myReports.filter(i => ['ASSIGNED', 'IN_PROGRESS', 'in-progress', 'assigned'].includes(i.status)).length,
      RESOLVED: myReports.filter(i => ['RESOLVED', 'resolved'].includes(i.status)).length,
    };
  }, [myReports]);

  // Filtered & sorted
  const filteredReports = useMemo(() => {
    return myReports.filter(issue => {
      // Tab filter
      if (activeTab !== 'ALL') {
        const targetTab = STATUS_TABS.find(t => t.id === activeTab);
        if (targetTab && !targetTab.statuses.includes(issue.status)) return false;
      }
      // Category filter
      if (selectedCategory !== 'All' && issue.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = issue.title?.toLowerCase().includes(q);
        const matchesAddress = (issue.address || issue.location?.address)?.toLowerCase().includes(q);
        const matchesId = issue.id?.toLowerCase().includes(q);
        const matchesCat = issue.category?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesAddress && !matchesId && !matchesCat) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.reportedDate || 0) - new Date(a.reportedDate || 0);
      if (sortBy === 'oldest') return new Date(a.reportedDate || 0) - new Date(b.reportedDate || 0);
      if (sortBy === 'priority') {
        const weight = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
        return (weight[b.priority] || 0) - (weight[a.priority] || 0);
      }
      return 0;
    });
  }, [myReports, activeTab, selectedCategory, searchQuery, sortBy]);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Pothole': return '🕳️';
      case 'Water Leakage': return '💧';
      case 'Garbage Pileup':
      case 'Garbage': return '🗑️';
      case 'Streetlight': return '💡';
      case 'Drainage': return '🌊';
      case 'Traffic Signal': return '🚦';
      case 'Road Maintenance': return '🛣️';
      case 'Park Maintenance': return '🌳';
      default: return '📋';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Reported Issues</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track live resolution progress, updates, and worker notes for all your submitted civic issues.
          </p>
        </div>
        <button
          onClick={() => navigate('/citizen/report')}
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm shadow-emerald-200 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Report New Issue
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px">
        {STATUS_TABS.map(tab => {
          const count = tabCounts[tab.id] || 0;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, title, or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-slate-800"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap sm:flex-nowrap">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-emerald-500 font-medium cursor-pointer"
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-emerald-500 font-medium cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority">Highest Priority</option>
          </select>
        </div>
      </div>

      {/* Issue List */}
      {filteredReports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReports.map(issue => (
            <div
              key={issue.id}
              onClick={() => navigate(`/citizen/issues/${issue.id}`)}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-2 bg-slate-50 border border-slate-100 rounded-xl shrink-0">
                      {getCategoryIcon(issue.category)}
                    </span>
                    <div>
                      <span className="font-mono text-xs font-bold text-slate-400 block">{issue.id}</span>
                      <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors text-base line-clamp-1">
                        {issue.title}
                      </h3>
                    </div>
                  </div>
                  <IssueStatus status={issue.status} />
                </div>

                {/* Description snippet */}
                <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                  {issue.description || 'No detailed description provided.'}
                </p>

                {/* Evidence Image Preview if available */}
                {issue.images?.before && (
                  <div className="mb-4 rounded-xl overflow-hidden h-32 border border-slate-100 bg-slate-50 relative">
                    <img
                      src={issue.images.before}
                      alt={issue.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                      Report Photo
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Meta */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs text-slate-500">
                <div className="flex items-center gap-3 truncate">
                  <span className="flex items-center gap-1 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{issue.address || issue.location?.address || 'Unknown address'}</span>
                  </span>
                  <span className="flex items-center gap-1 shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{issue.reportedDate ? String(issue.reportedDate).split(',')[0] : 'Recent'}</span>
                  </span>
                </div>
                <div className="flex items-center gap-1 font-bold text-emerald-600 group-hover:translate-x-0.5 transition-transform shrink-0">
                  <span>Track</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <FileText className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No reports found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-5">
            {searchQuery || selectedCategory !== 'All' || activeTab !== 'ALL'
              ? 'Try changing your search keywords or filter options to see more reports.'
              : 'You haven’t submitted any civic issue reports yet. Report a pothole or streetlight to get started!'}
          </p>
          <button
            onClick={() => navigate('/citizen/report')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Report an Issue Now
          </button>
        </div>
      )}
    </div>
  );
};

export default MyReports;
