import React, { useState } from 'react';
import { Assignment, AnnouncementItem, SubjectGrade } from '../types';
import { Search, X, FileText, BarChart3, Newspaper, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignments: Assignment[];
  grades: SubjectGrade[];
  announcements: AnnouncementItem[];
  onSelectAssignment: (asg: Assignment) => void;
  onNavigateToTab: (tab: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  assignments,
  grades,
  announcements,
  onSelectAssignment,
  onNavigateToTab,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const matchedAssignments = assignments.filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.subjectName.toLowerCase().includes(query.toLowerCase()) ||
      a.subjectCode.toLowerCase().includes(query.toLowerCase())
  );

  const matchedGrades = grades.filter(
    (g) =>
      g.name.toLowerCase().includes(query.toLowerCase()) ||
      g.code.toLowerCase().includes(query.toLowerCase())
  );

  const matchedNews = announcements.filter(
    (n) =>
      n.title.toLowerCase().includes(query.toLowerCase()) ||
      n.content.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-xl border border-black/10 shadow-2xl overflow-hidden flex flex-col max-h-[70vh]">
        {/* Input */}
        <div className="p-4 border-b border-black/[0.06] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#86868B]" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาการบ้าน, วิชาเรียน, ผลการเรียน, ประกาศ..."
            className="flex-1 text-sm text-[#1D1D1F] outline-none placeholder:text-[#86868B]"
          />
          <button onClick={onClose} className="p-1 rounded-full text-[#86868B] hover:text-[#1D1D1F]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* Assignments */}
          {matchedAssignments.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider mb-2">
                ภาระงาน & การบ้าน ({matchedAssignments.length})
              </p>
              <div className="space-y-1.5">
                {matchedAssignments.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => {
                      onNavigateToTab('assignments');
                      onClose();
                    }}
                    className="p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-[#0071E3]" />
                      <div>
                        <p className="text-xs font-semibold text-[#1D1D1F] group-hover:text-[#0071E3]">
                          {a.title}
                        </p>
                        <p className="text-[10px] text-[#86868B]">
                          {a.subjectName} ({a.subjectCode}) · กำหนดส่ง: {a.dueTime}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#86868B] group-hover:text-[#0071E3]" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grades */}
          {matchedGrades.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider mb-2">
                วิชา & ผลการเรียน ({matchedGrades.length})
              </p>
              <div className="space-y-1.5">
                {matchedGrades.map((g) => (
                  <div
                    key={g.code}
                    onClick={() => {
                      onNavigateToTab('grades');
                      onClose();
                    }}
                    className="p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <BarChart3 className="w-4 h-4 text-emerald-600" />
                      <div>
                        <p className="text-xs font-semibold text-[#1D1D1F] group-hover:text-[#0071E3]">
                          {g.name} ({g.code})
                        </p>
                        <p className="text-[10px] text-[#86868B]">
                          คะแนนปัจจุบัน: {g.currentScore}/100 (เกรด {g.predictedGrade})
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#86868B] group-hover:text-[#0071E3]" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* News */}
          {matchedNews.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider mb-2">
                ข่าวสาร & ประชาสัมพันธ์ ({matchedNews.length})
              </p>
              <div className="space-y-1.5">
                {matchedNews.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      onNavigateToTab('news');
                      onClose();
                    }}
                    className="p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Newspaper className="w-4 h-4 text-purple-600" />
                      <div>
                        <p className="text-xs font-semibold text-[#1D1D1F] group-hover:text-[#0071E3]">
                          {n.title}
                        </p>
                        <p className="text-[10px] text-[#86868B]">{n.category}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#86868B] group-hover:text-[#0071E3]" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {matchedAssignments.length === 0 && matchedGrades.length === 0 && matchedNews.length === 0 && (
            <div className="py-8 text-center text-xs text-[#86868B]">
              ไม่พบผลการค้นหาสำหรับ "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
