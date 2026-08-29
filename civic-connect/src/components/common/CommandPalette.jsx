import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCivic } from '../../context/CivicContext';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  FileText,
  Building2,
  HardHat,
  MapPin,
  X,
  ArrowRight,
  Sparkles,
  Command,
  CornerDownLeft,
  Clock
} from 'lucide-react';
import { IssueStatus } from '../issues/IssueStatus';
import { IssuePriority } from '../issues/IssuePriority';

export const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { issues, departments, workers } = useCivic();
  const { role } = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open trigger handled by parent or state
          window.dispatchEvent(new CustomEvent('toggle-command-palette'));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter items
  const trimmed = query.trim().toLowerCase();

  const matchedIssues = trimmed
    ? issues.filter(i =>
        i.id.toLowerCase().includes(trimmed) ||
        i.title.toLowerCase().includes(trimmed) ||
        i.ward?.toLowerCase().includes(trimmed) ||
        i.category?.toLowerCase().includes(trimmed) ||
        i.department?.toLowerCase().includes(trimmed) ||
        i.assignedWorker?.toLowerCase().includes(trimmed)
      ).slice(0, 5)
    : issues.slice(0, 3);

  const matchedWorkers = trimmed
    ? workers.filter(w =>
        w.name.toLowerCase().includes(trimmed) ||
        w.department?.toLowerCase().includes(trimmed) ||
        w.ward?.toLowerCase().includes(trimmed)
      ).slice(0, 3)
    : [];

  const matchedDepts = trimmed
    ? departments.filter(d =>
        d.name.toLowerCase().includes(trimmed)
      ).slice(0, 3)
    : [];

  const allResults = [
    ...matchedIssues.map(i => ({ type: 'issue', item: i })),
    ...matchedWorkers.map(w => ({ type: 'worker', item: w })),
    ...matchedDepts.map(d => ({ type: 'department', item: d }))
  ];

  const handleSelect = (result) => {
    if (!result) return;
    onClose();

    const rolePrefix = role === 'SUPER_ADMIN' ? '/admin' : role === 'DEPARTMENT_ADMIN' ? '/department' : role === 'FIELD_WORKER' ? '/worker' : '/citizen';

    if (result.type === 'issue') {
      if (role === 'CITIZEN') {
        navigate('/citizen/reports');
      } else if (role === 'FIELD_WORKER') {
        navigate(`/worker/tasks/${result.item.id}`);
      } else {
        navigate(`${rolePrefix}/issues/${result.item.id}`);
      }
    } else if (result.type === 'worker') {
      if (role === 'SUPER_ADMIN') navigate('/admin/workers');
      else if (role === 'DEPARTMENT_ADMIN') navigate('/department/workers');
      else navigate('/worker/profile');
    } else if (result.type === 'department') {
      if (role === 'SUPER_ADMIN') navigate('/admin/departments');
      else navigate('/department/dashboard');
    }
  };

  const handleKeyDownInput = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (allResults.length > 0 ? (prev + 1) % allResults.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (allResults.length > 0 ? (prev - 1 + allResults.length) % allResults.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allResults[selectedIndex]) {
        handleSelect(allResults[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      {/* Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal surface */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[80vh]">
        {/* Search input bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200/80 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDownInput}
            placeholder="Search issue ID (e.g. CC-1024), ward, category, worker..."
            className="flex-1 bg-transparent px-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-2xs">
            ESC to close
          </span>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-slate-100">
          {allResults.length === 0 ? (
            <div className="py-12 text-center">
              <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">No results found for "{query}"</p>
              <p className="text-[11px] text-slate-400 mt-1">Try searching by Issue ID (e.g. CC-1024), Ward, Category, or Department name.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {!trimmed && (
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> Recent & Active Issues
                </div>
              )}
              {allResults.map((res, index) => {
                const isSelected = index === selectedIndex;
                if (res.type === 'issue') {
                  const issue = res.item;
                  return (
                    <div
                      key={issue.id}
                      onClick={() => handleSelect(res)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                        isSelected ? 'bg-blue-50 text-blue-900 border border-blue-200/80 shadow-2xs' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-blue-600">{issue.id}</span>
                            <IssuePriority priority={issue.priority} />
                          </div>
                          <p className="text-xs font-bold text-slate-900 truncate mt-0.5">{issue.title}</p>
                          <p className="text-[10px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{issue.ward} • {issue.department}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <IssueStatus status={issue.status} />
                        {isSelected && <CornerDownLeft className="w-4 h-4 text-blue-600 ml-1" />}
                      </div>
                    </div>
                  );
                }

                if (res.type === 'worker') {
                  const worker = res.item;
                  return (
                    <div
                      key={worker.id}
                      onClick={() => handleSelect(res)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                        isSelected ? 'bg-blue-50 text-blue-900 border border-blue-200/80 shadow-2xs' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={worker.avatar} alt={worker.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{worker.name}</p>
                          <p className="text-[10px] text-slate-500 truncate">{worker.department} • {worker.ward}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">Field Worker</span>
                    </div>
                  );
                }

                if (res.type === 'department') {
                  const dept = res.item;
                  return (
                    <div
                      key={dept.id}
                      onClick={() => handleSelect(res)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                        isSelected ? 'bg-blue-50 text-blue-900 border border-blue-200/80 shadow-2xs' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{dept.name}</p>
                          <p className="text-[10px] text-slate-500 truncate">{dept.totalIssues} issues • {dept.workersCount} workers</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Department</span>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts info */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-medium"><kbd className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10px] shadow-2xs font-mono font-bold">↑</kbd><kbd className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10px] shadow-2xs font-mono font-bold">↓</kbd> Navigate</span>
            <span className="flex items-center gap-1 font-medium"><kbd className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10px] shadow-2xs font-mono font-bold">↵</kbd> Select</span>
          </div>
          <span className="font-semibold text-slate-600">CivicConnect GIS Engine</span>
        </div>
      </div>
    </div>
  );
};
