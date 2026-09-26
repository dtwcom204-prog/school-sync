import React, { useState } from 'react';
import { Assignment, AnnouncementItem, UserProfile } from '../types';
import { 
  Download, 
  ChevronRight, 
  Clock, 
  FileText, 
  GraduationCap, 
  MapPin, 
  UploadCloud, 
  QrCode, 
  CalendarDays, 
  MessageSquare,
  ArrowRight,
  Sparkles,
  ExternalLink,
  BookOpen,
  Edit3
} from 'lucide-react';
import { 
  QuickSubmitModal, 
  QRCheckInModal, 
  LeaveRequestModal, 
  AdvisorChatModal 
} from './QuickActionModals';

interface OverviewViewProps {
  currentUser: UserProfile;
  assignments: Assignment[];
  announcements: AnnouncementItem[];
  onNavigateToAssignments: () => void;
  onNavigateToGrades: () => void;
  onNavigateToTimetable: () => void;
  onSubmitAssignment: (id: string, textAnswer: string, images: any[]) => void;
  onOpenEditProfile?: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  currentUser,
  assignments,
  announcements,
  onNavigateToAssignments,
  onNavigateToGrades,
  onNavigateToTimetable,
  onSubmitAssignment,
  onOpenEditProfile,
}) => {
  const [filterScope, setFilterScope] = useState<'school' | 'grade5' | 'room51'>('room51');
  const [isQuickSubmitOpen, setIsQuickSubmitOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementItem | null>(null);

  const heroAnnouncement = announcements[0];
  const pendingAssignments = assignments.filter((a) => a.status === 'pending');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Date & Semester Subhead + Title + Filter Pills */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#6E6E73] font-medium mb-1">
            <span>วันพุธที่ 18 กันยายน 2567</span>
            <span>•</span>
            <span className="text-[#0071E3]">ภาคเรียนที่ 1/2567</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
            ภาพรวม & บอร์ดประชาสัมพันธ์
          </h1>
        </div>

        {/* Filter Segmented Control (matching Image 1) */}
        <div className="flex items-center gap-1 p-1 bg-black/[0.04] rounded-xl self-start md:self-auto">
          <button
            onClick={() => setFilterScope('school')}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
              filterScope === 'school'
                ? 'bg-white text-[#1D1D1F] shadow-xs font-semibold'
                : 'text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            ระดับโรงเรียน
          </button>
          <button
            onClick={() => setFilterScope('grade5')}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
              filterScope === 'grade5'
                ? 'bg-white text-[#1D1D1F] shadow-xs font-semibold'
                : 'text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            ชั้น ม.5
          </button>
          <button
            onClick={() => setFilterScope('room51')}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
              filterScope === 'room51'
                ? 'bg-white text-[#1D1D1F] shadow-xs font-semibold'
                : 'text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            ห้องเรียน ม.5/1
          </button>
        </div>
      </div>

      {/* User Greeting & Profile Quick Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-black/[0.06] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative shrink-0">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.thaiName}
              referrerPolicy="no-referrer"
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover border border-black/10 shadow-xs"
            />
            {currentUser.googleLinked && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[9px] text-white font-bold" title="ซิงค์ Google แล้ว">
                ✓
              </span>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-[#1D1D1F]">
                ยินดีต้อนรับ, {currentUser.thaiName}
              </h2>
              {currentUser.nickname && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#0071E3] border border-blue-100">
                  ({currentUser.nickname})
                </span>
              )}
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                currentUser.role === 'admin' 
                  ? 'bg-purple-50 text-purple-800 border border-purple-200' 
                  : currentUser.role === 'teacher' 
                  ? 'bg-blue-50 text-blue-800 border border-blue-200' 
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}>
                {currentUser.role === 'admin' ? 'แอดมินระบบ' : currentUser.role === 'teacher' ? 'ครูประจำวิชา' : `เลขที่ ${currentUser.studentNumber || 14}`}
              </span>
            </div>
            <p className="text-xs text-[#6E6E73] mt-0.5 truncate">
              {currentUser.schoolName} · {currentUser.classroom} 
              {currentUser.bio ? ` · "${currentUser.bio}"` : ''}
            </p>
          </div>
        </div>

        {onOpenEditProfile && (
          <button
            type="button"
            onClick={onOpenEditProfile}
            className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-[#0071E3] text-[#1D1D1F] hover:text-white border border-black/10 text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-all self-stretch sm:self-auto shrink-0"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>ปรับแต่งโปรไฟล์</span>
          </button>
        )}
      </div>

      {/* Hero Announcement Card (matching Image 1 dark banner) */}
      {heroAnnouncement && (
        <div className="relative rounded-3xl bg-[#1B1D20] text-white p-6 sm:p-8 overflow-hidden shadow-xl border border-black/10">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#0071E3]/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left side: metadata & headline */}
            <div className="max-w-2xl space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded-full bg-[#DC2626] text-white font-semibold text-[11px]">
                  ด่วนที่สุด
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 text-[11px] font-medium">
                  {heroAnnouncement.category}
                </span>
                <span className="text-white/60 text-xs">
                  {heroAnnouncement.timeAgo}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold tracking-tight leading-snug">
                {heroAnnouncement.title}
              </h2>

              <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light line-clamp-3">
                {heroAnnouncement.content}
              </p>

              {/* Actions */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => alert('เริ่มดาวน์โหลดตารางสอบกลางภาค 1/2567 โรงเรียนดอนตาลวิทยา (PDF 2.4 MB)')}
                  className="px-4 py-2 rounded-xl bg-white text-[#1B1D20] hover:bg-slate-100 font-semibold text-xs transition-all flex items-center gap-2 shadow-xs active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ดาวน์โหลดตารางสอบ PDF ({heroAnnouncement.pdfSize || '2.4 MB'})</span>
                </button>
                <button
                  onClick={() => setSelectedAnnouncement(heroAnnouncement)}
                  className="px-3 py-2 text-xs text-white/80 hover:text-white transition-colors flex items-center gap-1 font-medium"
                >
                  <span>อ่านรายละเอียดฉบับเต็ม</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right side: Countdown countdown timer (matching Image 1) */}
            <div className="lg:border-l lg:border-white/10 lg:pl-8 flex flex-col justify-center items-start lg:items-end shrink-0">
              <p className="text-xs text-white/60 font-medium">นับถอยหลังสู่วันสอบ</p>
              <div className="flex items-baseline gap-1 my-1">
                <span className="text-5xl sm:text-6xl font-extrabold tracking-tight tabular-nums font-mono text-white">
                  05
                </span>
                <span className="text-base text-white/80 font-medium">วัน</span>
              </div>
              <p className="text-xs text-white/60">เริ่มสอบ 23 ก.ย. 2567</p>
            </div>
          </div>
        </div>
      )}

      {/* 3 Metric Summary Cards (matching Image 1) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Card 1: ภาระงานค้างส่ง */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-black/[0.06] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#1D1D1F]">ภาระงานค้างส่ง</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 font-semibold text-xs">
                {pendingAssignments.length} รายการ
              </span>
            </div>

            {/* List */}
            <div className="space-y-3">
              {pendingAssignments.slice(0, 3).map((asg, idx) => (
                <div key={asg.id} className="flex items-start justify-between gap-2 border-b border-black/[0.04] pb-2.5 last:border-0 last:pb-0">
                  <div>
                    <p className="text-xs font-semibold text-[#1D1D1F] line-clamp-1">{asg.title}</p>
                    <p className="text-[11px] text-[#86868B]">{asg.subjectName} ({asg.subjectCode})</p>
                  </div>
                  <span className={`text-[11px] font-medium shrink-0 px-2 py-0.5 rounded-md ${
                    idx === 0 
                      ? 'bg-red-50 text-[#DC2626] font-semibold' 
                      : idx === 1 
                      ? 'bg-amber-50 text-amber-700' 
                      : 'bg-slate-100 text-[#6E6E73]'
                  }`}>
                    {idx === 0 ? 'อีก 3 ชม.' : idx === 1 ? 'พรุ่งนี้ 23:59' : 'อีก 2 วัน'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-3 border-t border-black/[0.06]">
            <button
              onClick={onNavigateToAssignments}
              className="text-xs font-semibold text-[#0071E3] hover:text-[#005bb5] flex items-center gap-1 transition-colors"
            >
              <span>ดูงานทั้งหมด</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: ผลการเรียนสะสม (GPAX) */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-black/[0.06] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#1D1D1F]">ผลการเรียนสะสม</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-xs">
                อันดับ 3 ของห้อง
              </span>
            </div>

            <div className="my-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-[#1D1D1F] tracking-tight tabular-nums font-mono">
                {currentUser.gpax || 3.84}
              </div>
              <p className="text-xs text-[#6E6E73] mt-1 font-medium">GPAX เฉลี่ยสะสม 4 ภาคเรียน</p>
            </div>
          </div>

          <div className="pt-4 border-t border-black/[0.06] space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#6E6E73]">หน่วยกิตสะสม</span>
              <span className="font-semibold tabular-nums text-[#1D1D1F]">36.5 / 40.0</span>
            </div>
            <div className="w-full h-2 rounded-full bg-black/[0.06] overflow-hidden">
              <div className="h-full rounded-full bg-[#0071E3] w-[91%]"></div>
            </div>
            <button
              onClick={onNavigateToGrades}
              className="pt-2 text-xs font-semibold text-[#0071E3] hover:text-[#005bb5] flex items-center gap-1 transition-colors"
            >
              <span>ดูผลวิเคราะห์เกรดเต็ม</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 3: คาบเรียนถัดไป */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-black/[0.06] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0071E3] flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#1D1D1F]">คาบเรียนถัดไป</h3>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                กำลังจะเริ่ม
              </span>
            </div>

            <div className="space-y-1 my-2">
              <p className="text-xs font-semibold text-[#0071E3]">10:30 – 11:20 น.</p>
              <h4 className="text-lg font-bold text-[#1D1D1F] tracking-tight">
                ฟิสิกส์ 3 (ว32201)
              </h4>
              <p className="text-xs text-[#6E6E73]">ดร. สมบูรณ์ พรประเสริฐ</p>
            </div>
          </div>

          <div className="pt-4 border-t border-black/[0.06] flex items-center justify-between text-xs text-[#6E6E73]">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#0071E3]" />
              <span>อาคาร 4 ห้อง 421</span>
            </div>
            <button
              onClick={onNavigateToTimetable}
              className="font-semibold text-[#1D1D1F] hover:text-[#0071E3] transition-colors"
            >
              คาบ 4 &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions (การดำเนินการด่วน - matching Image 1) */}
      <div className="space-y-3 pt-2">
        <h3 className="text-base font-bold text-[#1D1D1F]">การดำเนินการด่วน</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* Action 1: ส่งงานด่วน */}
          <button
            onClick={() => setIsQuickSubmitOpen(true)}
            className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-black/[0.06] shadow-xs text-left transition-all hover:scale-[1.01] active:scale-[0.99] group"
          >
            <div className="w-9 h-9 rounded-xl bg-black/[0.04] text-[#1D1D1F] group-hover:bg-[#0071E3] group-hover:text-white flex items-center justify-center transition-colors mb-2.5">
              <UploadCloud className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-[#1D1D1F]">ส่งงานด่วน</p>
            <p className="text-[11px] text-[#86868B] mt-0.5">ฮอตลิงก์รูปภาพ / อัปโหลด</p>
          </button>

          {/* Action 2: เช็คอินเข้าเรียน */}
          <button
            onClick={() => setIsQROpen(true)}
            className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-black/[0.06] shadow-xs text-left transition-all hover:scale-[1.01] active:scale-[0.99] group"
          >
            <div className="w-9 h-9 rounded-xl bg-black/[0.04] text-[#1D1D1F] group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-colors mb-2.5">
              <QrCode className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-[#1D1D1F]">เช็คอินเข้าเรียน</p>
            <p className="text-[11px] text-[#86868B] mt-0.5">สแกน QR คาบนี้</p>
          </button>

          {/* Action 3: ยื่นใบลา */}
          <button
            onClick={() => setIsLeaveOpen(true)}
            className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-black/[0.06] shadow-xs text-left transition-all hover:scale-[1.01] active:scale-[0.99] group"
          >
            <div className="w-9 h-9 rounded-xl bg-black/[0.04] text-[#1D1D1F] group-hover:bg-amber-600 group-hover:text-white flex items-center justify-center transition-colors mb-2.5">
              <CalendarDays className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-[#1D1D1F]">ยื่นใบลา</p>
            <p className="text-[11px] text-[#86868B] mt-0.5">ลากิจ / ลาป่วย</p>
          </button>

          {/* Action 4: แชตครูประจำชั้น */}
          <button
            onClick={() => setIsChatOpen(true)}
            className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-black/[0.06] shadow-xs text-left transition-all hover:scale-[1.01] active:scale-[0.99] group"
          >
            <div className="w-9 h-9 rounded-xl bg-black/[0.04] text-[#1D1D1F] group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-colors mb-2.5">
              <MessageSquare className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-[#1D1D1F]">แชตครูประจำชั้น</p>
            <p className="text-[11px] text-[#86868B] mt-0.5">ครูศศิธร สุขสมบัติ</p>
          </button>
        </div>
      </div>

      {/* Announcement Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-xl border border-black/10 shadow-2xl p-6 sm:p-8 space-y-4 max-h-[85vh] overflow-y-auto">
            {selectedAnnouncement.coverImage && (
              <img
                src={selectedAnnouncement.coverImage}
                alt="ประกาศ"
                referrerPolicy="no-referrer"
                className="w-full h-44 object-cover rounded-2xl shadow-xs"
              />
            )}
            <div className="flex items-center gap-2 text-xs text-[#6E6E73]">
              <span className="font-semibold text-[#0071E3]">{selectedAnnouncement.category}</span>
              <span>•</span>
              <span>{selectedAnnouncement.author}</span>
            </div>
            <h3 className="text-xl font-bold text-[#1D1D1F]">
              {selectedAnnouncement.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#414753] leading-relaxed">
              {selectedAnnouncement.content}
            </p>
            <div className="pt-4 border-t border-black/[0.06] flex items-center justify-between">
              <button
                onClick={() => alert('ดาวน์โหลดเอกสารประกาศฉบับสมบูรณ์ โรงเรียนดอนตาลวิทยา')}
                className="px-4 py-2 rounded-xl bg-[#0071E3] text-white text-xs font-semibold hover:bg-[#005bb5]"
              >
                ดาวน์โหลดเอกสารแนบ
              </button>
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="px-4 py-2 rounded-xl bg-black/[0.04] text-[#6E6E73] text-xs font-medium hover:bg-black/[0.08]"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Modals */}
      <QuickSubmitModal
        isOpen={isQuickSubmitOpen}
        onClose={() => setIsQuickSubmitOpen(false)}
        assignments={assignments}
        onSubmit={onSubmitAssignment}
      />

      <QRCheckInModal
        isOpen={isQROpen}
        onClose={() => setIsQROpen(false)}
        currentUser={currentUser}
      />

      <LeaveRequestModal
        isOpen={isLeaveOpen}
        onClose={() => setIsLeaveOpen(false)}
        currentUser={currentUser}
      />

      <AdvisorChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentUser={currentUser}
      />
    </div>
  );
};
