import React, { useState } from 'react';
import { Assignment, HotlinkedImage, UserProfile } from '../types';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  Image as ImageIcon, 
  ExternalLink, 
  Eye, 
  Award, 
  Search, 
  Sparkles, 
  Filter, 
  MessageSquareQuote,
  Trash2,
  Calendar,
  X
} from 'lucide-react';
import { ImageHotlinkModal } from './ImageHotlinkModal';

interface AssignmentsViewProps {
  currentUser: UserProfile;
  assignments: Assignment[];
  onAddAssignment: (assignment: Assignment) => void;
  onSubmitAssignment: (id: string, textAnswer: string, images: HotlinkedImage[]) => void;
  onGradeAssignment: (id: string, score: number, feedback: string) => void;
}

export const AssignmentsView: React.FC<AssignmentsViewProps> = ({
  currentUser,
  assignments,
  onAddAssignment,
  onSubmitAssignment,
  onGradeAssignment,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [activeAssignment, setActiveAssignment] = useState<Assignment | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [isHotlinkToolOpen, setIsHotlinkToolOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Form states for student submission
  const [submissionText, setSubmissionText] = useState('');
  const [submissionImages, setSubmissionImages] = useState<HotlinkedImage[]>([]);

  // Form states for teacher creating assignment
  const [newTitle, setNewTitle] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState('ว32201');
  const [newSubjectName, setNewSubjectName] = useState('ฟิสิกส์ 3');
  const [newDueDate, setNewDueDate] = useState('2026-09-30');
  const [newDueTime, setNewDueTime] = useState('16:30 น.');
  const [newPoints, setNewPoints] = useState(20);
  const [newCategory, setNewCategory] = useState<'homework' | 'project' | 'lab' | 'quiz'>('homework');
  const [newDescription, setNewDescription] = useState('');
  const [newRefImages, setNewRefImages] = useState<HotlinkedImage[]>([]);

  // Form states for teacher grading
  const [gradeScore, setGradeScore] = useState<number>(20);
  const [gradeFeedback, setGradeFeedback] = useState('');

  // Filtering
  const filteredAssignments = assignments.filter((a) => {
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
    const matchesSubject = selectedSubject === 'all' || a.subjectCode === selectedSubject;
    const matchesQuery = 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.subjectCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSubject && matchesQuery;
  });

  const subjects = Array.from(new Set(assignments.map((a) => a.subjectCode)));

  const handleOpenSubmit = (asg: Assignment) => {
    setActiveAssignment(asg);
    setSubmissionText(asg.studentSubmission?.textAnswer || '');
    setSubmissionImages(asg.studentSubmission?.hotlinkedImages || []);
    setIsSubmitModalOpen(true);
  };

  const handleOpenGrade = (asg: Assignment) => {
    setActiveAssignment(asg);
    setGradeScore(asg.earnedPoints || asg.totalPoints);
    setGradeFeedback(asg.feedback || 'ผลงานมีความถูกต้อง ละเอียด เรียบร้อยดีมาก');
    setIsGradeModalOpen(true);
  };

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAssignment) return;
    onSubmitAssignment(activeAssignment.id, submissionText, submissionImages);
    setIsSubmitModalOpen(false);
  };

  const handleConfirmCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newAsg: Assignment = {
      id: `asg-${Date.now()}`,
      title: newTitle,
      subjectCode: newSubjectCode,
      subjectName: newSubjectName,
      teacherName: currentUser.thaiName,
      dueDate: newDueDate,
      dueTime: newDueTime,
      totalPoints: Number(newPoints),
      category: newCategory,
      description: newDescription,
      status: 'pending',
      hotlinkImages: newRefImages
    };

    onAddAssignment(newAsg);
    setIsCreateModalOpen(false);
    // Reset
    setNewTitle('');
    setNewDescription('');
    setNewRefImages([]);
  };

  const handleConfirmGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAssignment) return;
    onGradeAssignment(activeAssignment.id, Number(gradeScore), gradeFeedback);
    setIsGradeModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#6E6E73] font-medium mb-1">
            <span>ระบบบันทึกงาน ส่งงาน และสั่งงาน</span>
            <span>•</span>
            <span className="text-[#0071E3]">ม.5/1 โรงเรียนดอนตาลวิทยา</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
            {currentUser.role === 'teacher' ? 'ระบบจัดการการบ้าน & ตรวจงาน' : 'ภาระงาน & ส่งการบ้านออนไลน์'}
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Direct HTML Hotlink image tester */}
          <button
            onClick={() => setIsHotlinkToolOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white border border-black/10 hover:border-[#0071E3] text-[#1D1D1F] hover:text-[#0071E3] text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
            title="แปลงโค้ด HTML <img> หรือ URL รูปภาพ"
          >
            <ImageIcon className="w-3.5 h-3.5 text-[#0071E3]" />
            <span>เครื่องมือฮอตลิงก์รูปภาพ</span>
          </button>

          {currentUser.role === 'teacher' ? (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#0071E3] hover:bg-[#005bb5] text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>สั่งงานนักเรียนใหม่</span>
            </button>
          ) : (
            <button
              onClick={() => {
                const firstPending = assignments.find((a) => a.status === 'pending');
                if (firstPending) handleOpenSubmit(firstPending);
              }}
              className="px-4 py-2 rounded-xl bg-[#0071E3] hover:bg-[#005bb5] text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
            >
              <FileText className="w-4 h-4" />
              <span>ส่งงานด่วน</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-black/[0.06] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 p-1 bg-black/[0.04] rounded-xl w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all whitespace-nowrap ${
              filterStatus === 'all'
                ? 'bg-white text-[#1D1D1F] shadow-xs font-semibold'
                : 'text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            ทั้งหมด ({assignments.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all whitespace-nowrap ${
              filterStatus === 'pending'
                ? 'bg-white text-[#DC2626] shadow-xs font-semibold'
                : 'text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            ค้างส่ง ({assignments.filter((a) => a.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilterStatus('submitted')}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all whitespace-nowrap ${
              filterStatus === 'submitted'
                ? 'bg-white text-[#0071E3] shadow-xs font-semibold'
                : 'text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            รอตรวจ ({assignments.filter((a) => a.status === 'submitted').length})
          </button>
          <button
            onClick={() => setFilterStatus('graded')}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all whitespace-nowrap ${
              filterStatus === 'graded'
                ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                : 'text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            ตรวจแล้ว ({assignments.filter((a) => a.status === 'graded').length})
          </button>
        </div>

        {/* Search & Subject Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-black/[0.04] border-0 text-xs text-[#1D1D1F] outline-none"
          >
            <option value="all">ทุกรายวิชา</option>
            {subjects.map((code) => {
              const asg = assignments.find((a) => a.subjectCode === code);
              return (
                <option key={code} value={code}>
                  {code} - {asg?.subjectName}
                </option>
              );
            })}
          </select>

          <div className="relative flex-1 md:w-56">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#86868B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อการบ้าน..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-black/[0.04] text-xs text-[#1D1D1F] outline-none focus:bg-white focus:ring-1 focus:ring-[#0071E3]"
            />
          </div>
        </div>
      </div>

      {/* Assignment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAssignments.map((asg) => {
          const isPending = asg.status === 'pending';
          const isSubmitted = asg.status === 'submitted';
          const isGraded = asg.status === 'graded';

          return (
            <div
              key={asg.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-black/[0.06] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              {/* Category indicator line */}
              <div
                className={`absolute top-0 left-0 right-0 h-1.5 ${
                  isPending
                    ? 'bg-red-500'
                    : isSubmitted
                    ? 'bg-[#0071E3]'
                    : 'bg-emerald-500'
                }`}
              ></div>

              <div>
                {/* Subject & Status */}
                <div className="flex items-center justify-between text-xs mb-2 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#0071E3]">{asg.subjectCode}</span>
                    <span className="text-[#86868B]">·</span>
                    <span className="text-[#6E6E73]">{asg.subjectName}</span>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 ${
                      isPending
                        ? 'bg-red-50 text-[#DC2626]'
                        : isSubmitted
                        ? 'bg-blue-50 text-[#0071E3]'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {isPending && <Clock className="w-3 h-3" />}
                    {isSubmitted && <AlertCircle className="w-3 h-3" />}
                    {isGraded && <CheckCircle2 className="w-3 h-3" />}
                    <span>{isPending ? 'ค้างส่ง' : isSubmitted ? 'ส่งแล้ว (รอตรวจ)' : 'ตรวจแล้ว'}</span>
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-[#1D1D1F] tracking-tight group-hover:text-[#0071E3] transition-colors">
                  {asg.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-[#6E6E73] mt-2 line-clamp-2 leading-relaxed">
                  {asg.description}
                </p>

                {/* Hotlink Image preview badges (if present) */}
                {(asg.hotlinkImages && asg.hotlinkImages.length > 0) || (asg.studentSubmission?.hotlinkedImages && asg.studentSubmission.hotlinkedImages.length > 0) ? (
                  <div className="mt-3 pt-2 border-t border-black/[0.04]">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[11px] font-semibold text-[#1D1D1F] flex items-center gap-1">
                        <ImageIcon className="w-3.5 h-3.5 text-[#0071E3]" />
                        รูปภาพฮอตลิงก์แนบ:
                      </span>
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {/* Teacher ref images */}
                      {asg.hotlinkImages?.map((img) => (
                        <div
                          key={img.id}
                          onClick={() => setLightboxImage(img.url)}
                          className="relative w-16 h-12 rounded-lg overflow-hidden border border-black/10 shrink-0 cursor-pointer group/img"
                        >
                          <img
                            src={img.url}
                            alt={img.caption || 'ภาพโจทย์'}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover/img:scale-105 transition-transform"
                          />
                          <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] text-center truncate px-0.5">
                            โจทย์
                          </span>
                        </div>
                      ))}

                      {/* Student submitted images */}
                      {asg.studentSubmission?.hotlinkedImages?.map((img) => (
                        <div
                          key={img.id}
                          onClick={() => setLightboxImage(img.url)}
                          className="relative w-16 h-12 rounded-lg overflow-hidden border border-emerald-400 shrink-0 cursor-pointer group/img"
                        >
                          <img
                            src={img.url}
                            alt={img.caption || 'ภาพงานส่ง'}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover/img:scale-105 transition-transform"
                          />
                          <span className="absolute bottom-0 inset-x-0 bg-emerald-700/80 text-white text-[8px] text-center truncate px-0.5">
                            งานส่ง
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Score badge if graded */}
                {isGraded && (
                  <div className="mt-3 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-2.5">
                    <Award className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div className="text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-800">
                          ได้คะแนน {asg.earnedPoints} / {asg.totalPoints} คะแนน
                        </span>
                        <span className="text-[10px] text-emerald-600 font-medium">เกรด 4 (ยอดเยี่ยม)</span>
                      </div>
                      {asg.feedback && (
                        <p className="text-[#414753] mt-1 text-[11px] italic">
                          "{asg.feedback}"
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-black/[0.06] flex items-center justify-between text-xs">
                <div className="text-[#86868B] space-y-0.5">
                  <p>ครูผู้สอน: {asg.teacherName}</p>
                  <p className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3 text-[#DC2626]" />
                    <span>กำหนดส่ง: {asg.dueTime}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {currentUser.role === 'teacher' ? (
                    <button
                      onClick={() => handleOpenGrade(asg)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-[#0071E3] hover:text-white text-[#1D1D1F] text-xs font-semibold transition-all"
                    >
                      {asg.status === 'graded' ? 'แก้ไขคะแนน' : 'ตรวจงาน'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenSubmit(asg)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isPending
                          ? 'bg-[#0071E3] hover:bg-[#005bb5] text-white shadow-xs'
                          : 'bg-black/[0.04] hover:bg-black/[0.08] text-[#1D1D1F]'
                      }`}
                    >
                      {isPending ? 'ส่งงานนี้' : 'ดูงานที่ส่ง'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAssignments.length === 0 && (
        <div className="py-16 text-center bg-white rounded-3xl border border-black/[0.06] p-8 space-y-3">
          <FileText className="w-12 h-12 text-[#86868B] mx-auto opacity-50" />
          <h3 className="text-base font-bold text-[#1D1D1F]">ไม่พบรายการภาระงาน</h3>
          <p className="text-xs text-[#6E6E73]">ลองเปลี่ยนตัวกรอง หรือค้นหาด้วยคำอื่น</p>
        </div>
      )}

      {/* Student Submit Work Modal */}
      {isSubmitModalOpen && activeAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-2xl border border-black/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-black/[0.06] flex items-center justify-between bg-slate-50/80">
              <div>
                <span className="text-[11px] font-semibold text-[#0071E3]">
                  {activeAssignment.subjectCode} · {activeAssignment.subjectName}
                </span>
                <h3 className="text-sm font-bold text-[#1D1D1F]">{activeAssignment.title}</h3>
              </div>
              <button onClick={() => setIsSubmitModalOpen(false)} className="p-1 rounded-full text-[#86868B]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div className="p-3 bg-slate-50 rounded-2xl border border-black/5 text-xs text-[#414753]">
                <p className="font-semibold text-[#1D1D1F] mb-1">คำชี้แจงจากครู:</p>
                <p>{activeAssignment.description}</p>
                <div className="mt-2 text-[11px] text-[#86868B] flex items-center gap-3">
                  <span>กำหนดส่ง: {activeAssignment.dueTime}</span>
                  <span>คะแนนเต็ม: {activeAssignment.totalPoints} คะแนน</span>
                </div>
              </div>

              {/* Student Answer */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#1D1D1F]">
                  บันทึกข้อความ / คำตอบของนักเรียน:
                </label>
                <textarea
                  rows={4}
                  required
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  placeholder="พิมพ์คำตอบ วิธีทำ หรือสรุปผลการทดลองที่นี่..."
                  className="w-full p-3 rounded-xl bg-black/[0.02] border border-black/10 focus:border-[#0071E3] focus:bg-white text-xs text-[#1D1D1F] outline-none resize-none"
                />
              </div>

              {/* Hotlinked Images */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#1D1D1F] flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#0071E3]" />
                    <span>แนบรูปภาพฮอตลิงก์ (รูปภาพจาก HTML / URL):</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsHotlinkToolOpen(true)}
                    className="text-xs text-[#0071E3] font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>+ วางโค้ดรูปภาพ</span>
                  </button>
                </div>

                {submissionImages.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {submissionImages.map((img) => (
                      <div key={img.id} className="relative rounded-xl border border-black/10 p-1 bg-slate-50 group">
                        <img
                          src={img.url}
                          alt={img.caption || 'งานส่ง'}
                          referrerPolicy="no-referrer"
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <p className="text-[10px] text-[#6E6E73] truncate mt-1">{img.caption}</p>
                        <button
                          type="button"
                          onClick={() => setSubmissionImages((prev) => prev.filter((i) => i.id !== img.id))}
                          className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    onClick={() => setIsHotlinkToolOpen(true)}
                    className="p-4 rounded-2xl border-2 border-dashed border-black/10 hover:border-[#0071E3] text-center cursor-pointer bg-slate-50/50"
                  >
                    <p className="text-xs font-semibold text-[#1D1D1F]">
                      คลิกเพื่อแนบรูปภาพด้วยโค้ด HTML (&lt;img src="..." /&gt;) หรือ URL
                    </p>
                    <p className="text-[11px] text-[#86868B] mt-1">
                      สามารถใช้ภาพถ่ายสมุดงาน กราฟแล็บ หรือสไลด์นำเสนอผ่านฮอตลิงก์ได้ทันที
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-black/[0.06] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#6E6E73]"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0071E3] hover:bg-[#005bb5] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>บันทึกและส่งงานไปยังครู</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teacher Create Assignment Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-xl border border-black/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-black/[0.06] flex items-center justify-between bg-slate-50/80">
              <div>
                <h3 className="text-sm font-bold text-[#1D1D1F]">สั่งงานนักเรียนใหม่ (ครูผู้สอน)</h3>
                <p className="text-[11px] text-[#6E6E73]">กำหนดภาระงานและแนบเอกสาร/ไดอะแกรมประกอบ</p>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-1 rounded-full text-[#86868B]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmCreate} className="p-6 space-y-3 overflow-y-auto text-xs">
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">ชื่อภาระงาน / หัวข้อ:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="เช่น แล็บรีพอร์ตการเหนี่ยวนำแม่เหล็กไฟฟ้า หรือ แบบฝึกหัดบทที่ 5"
                  className="w-full px-3 py-2 rounded-xl bg-black/[0.02] border border-black/10 outline-none focus:border-[#0071E3]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1D1D1F] mb-1">รหัสวิชา:</label>
                  <input
                    type="text"
                    required
                    value={newSubjectCode}
                    onChange={(e) => setNewSubjectCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] border border-black/10 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1D1D1F] mb-1">ชื่อวิชา:</label>
                  <input
                    type="text"
                    required
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] border border-black/10 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#1D1D1F] mb-1">กำหนดส่ง (วันที่):</label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] border border-black/10 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1D1D1F] mb-1">เวลาส่ง:</label>
                  <input
                    type="text"
                    required
                    value={newDueTime}
                    onChange={(e) => setNewDueTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] border border-black/10 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1D1D1F] mb-1">คะแนนเต็ม:</label>
                  <input
                    type="number"
                    required
                    value={newPoints}
                    onChange={(e) => setNewPoints(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] border border-black/10 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">คำอธิบายและแนวทางการทำงาน:</label>
                <textarea
                  rows={3}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="ระบุข้อกำหนด เกณฑ์การประเมิน หรือสิ่งที่ต้องส่ง..."
                  className="w-full p-2.5 rounded-xl bg-black/[0.02] border border-black/10 outline-none resize-none"
                />
              </div>

              {/* Reference Images */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-[#1D1D1F]">แนบภาพตัวอย่างโจทย์ (ฮอตลิงก์):</span>
                  <button
                    type="button"
                    onClick={() => setIsHotlinkToolOpen(true)}
                    className="text-[#0071E3] font-semibold hover:underline"
                  >
                    + เพิ่มรูปภาพฮอตลิงก์
                  </button>
                </div>
                {newRefImages.length > 0 && (
                  <div className="flex gap-2">
                    {newRefImages.map((img) => (
                      <div key={img.id} className="relative w-20 h-16 rounded-lg overflow-hidden border border-black/10">
                        <img src={img.url} alt="โจทย์" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setNewRefImages((p) => p.filter((i) => i.id !== img.id))}
                          className="absolute top-1 right-1 p-0.5 rounded-full bg-black/60 text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-black/[0.06] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-[#6E6E73]"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0071E3] text-white font-semibold shadow-xs"
                >
                  ประกาศสั่งงานลงระบบ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teacher Grade Modal */}
      {isGradeModalOpen && activeAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-lg border border-black/10 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <div>
                <span className="text-[11px] font-semibold text-[#0071E3]">
                  {activeAssignment.subjectCode} · ตรวจงานนักเรียน
                </span>
                <h3 className="text-base font-bold text-[#1D1D1F]">{activeAssignment.title}</h3>
              </div>
              <button onClick={() => setIsGradeModalOpen(false)} className="p-1 rounded-full text-[#86868B]">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Submission preview */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-black/5 text-xs space-y-2">
              <p className="font-semibold text-[#1D1D1F]">
                นักเรียน: นายวรเมธ วิริยพาณิชย์ (เลขที่ 14)
              </p>
              <p className="text-[#414753]">
                {activeAssignment.studentSubmission?.textAnswer || 'ยังไม่มีข้อความส่งงาน'}
              </p>
              {activeAssignment.studentSubmission?.hotlinkedImages && (
                <div className="flex gap-2 pt-1">
                  {activeAssignment.studentSubmission.hotlinkedImages.map((img) => (
                    <img
                      key={img.id}
                      src={img.url}
                      alt="งานส่ง"
                      onClick={() => setLightboxImage(img.url)}
                      className="w-20 h-16 object-cover rounded-lg border border-black/10 cursor-pointer"
                    />
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={handleConfirmGrade} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  คะแนนที่ให้ (เต็ม {activeAssignment.totalPoints} คะแนน):
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  max={activeAssignment.totalPoints}
                  value={gradeScore}
                  onChange={(e) => setGradeScore(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-black/[0.02] border border-black/10 outline-none text-base font-bold text-[#0071E3]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">
                  คำแนะนำ / ข้อเสนอแนะแก่นักเรียน (Feedback):
                </label>
                <textarea
                  rows={3}
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  placeholder="เขียนข้อเสนอแนะเพื่อให้เกิดการพัฒนาความรู้ต่อไป..."
                  className="w-full p-2.5 rounded-xl bg-black/[0.02] border border-black/10 outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsGradeModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-[#6E6E73]"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0071E3] text-white font-semibold shadow-xs"
                >
                  บันทึกผลการตรวจและแจ้งเตือนเข้า LINE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Lightbox */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
        >
          <div className="relative max-w-4xl max-h-[90vh] p-2">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-10 right-0 p-1.5 rounded-full bg-white/20 text-white hover:bg-white/40"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={lightboxImage}
              alt="ขยายรูปภาพ"
              referrerPolicy="no-referrer"
              className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Hotlink Image Modal */}
      <ImageHotlinkModal
        isOpen={isHotlinkToolOpen}
        onClose={() => setIsHotlinkToolOpen(false)}
        onInsertImage={(img) => {
          if (isSubmitModalOpen) {
            setSubmissionImages((prev) => [...prev, img]);
          } else if (isCreateModalOpen) {
            setNewRefImages((prev) => [...prev, img]);
          } else {
            alert(`สร้างฮอตลิงก์รูปภาพสำเร็จ:\n${img.url}\nคุณสามารถนำไปแนบในการส่งงานหรือสั่งงานได้ทันที`);
          }
        }}
      />
    </div>
  );
};
