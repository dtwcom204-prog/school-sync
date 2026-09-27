import React, { useState } from 'react';
import { UserProfile, Assignment, LineAlertMessage } from '../types';
import { playNotificationSound } from '../utils/sound';
import { 
  Users, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  AlertCircle, 
  FileText, 
  Plus, 
  Search, 
  Send, 
  MessageSquare, 
  ChevronRight, 
  Award, 
  Check, 
  X, 
  Eye, 
  Edit3, 
  Layers, 
  FolderOpen, 
  Sparkles,
  UserCheck,
  TrendingUp,
  Sliders,
  Filter,
  ArrowRight,
  MoreVertical,
  Bell
} from 'lucide-react';

interface TeacherClassroom {
  id: string;
  subjectCode: string;
  subjectName: string;
  gradeLevel: string;
  room: string;
  studentCount: number;
  nextPeriod: string;
  currentTaskTitle: string;
  submittedCount: number;
  totalTaskCount: number;
  category: 'physics' | 'science' | 'math' | 'general';
  themeColor: string;
  status: 'active' | 'warning' | 'completed';
}

interface StudentAttendanceRecord {
  id: string;
  rollNo: number;
  name: string;
  status: 'present' | 'absent' | 'leave' | 'late';
  note?: string;
}

interface TeacherPortalViewProps {
  currentUser: UserProfile;
  assignments: Assignment[];
  onAddAssignment: (newAsg: Assignment) => void;
  onGradeAssignment: (id: string, score: number, feedback: string) => void;
  onBroadcastToClass: (messageText: string) => void;
  onNavigateToAssignments: () => void;
  onNavigateToGrades: () => void;
}

export const TeacherPortalView: React.FC<TeacherPortalViewProps> = ({
  currentUser,
  assignments,
  onAddAssignment,
  onGradeAssignment,
  onBroadcastToClass,
  onNavigateToAssignments,
  onNavigateToGrades,
}) => {
  // Filter for taught classes
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');

  // Modals state
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [gradingAssignment, setGradingAssignment] = useState<Assignment | null>(null);
  const [gradeScoreInput, setGradeScoreInput] = useState<number>(18);
  const [gradeFeedbackInput, setGradeFeedbackInput] = useState<string>('ทำงานได้เรียบร้อย การคำนวณถูกต้องตามหลักการ');
  const [activeAttendanceClass, setActiveAttendanceClass] = useState<TeacherClassroom | null>(null);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [activeClassroomDocs, setActiveClassroomDocs] = useState<TeacherClassroom | null>(null);

  // Teacher's assigned classrooms mock state
  const [teacherClassrooms, setTeacherClassrooms] = useState<TeacherClassroom[]>([
    {
      id: 'tc-1',
      subjectCode: 'ว30202',
      subjectName: 'ฟิสิกส์ 2 (กลศาสตร์ & คลื่นแม่เหล็ก)',
      gradeLevel: 'ชั้น ม.5/1',
      room: 'ห้อง 421 (อาคาร 4)',
      studentCount: 42,
      nextPeriod: 'วันนี้ 13:00 - 14:40 น. (คาบ 5-6)',
      currentTaskTitle: 'การทดลองที่ 4: การเคลื่อนที่แบบฮาร์มอนิกอย่างง่าย',
      submittedCount: 38,
      totalTaskCount: 42,
      category: 'physics',
      themeColor: '#0071E3',
      status: 'active'
    },
    {
      id: 'tc-2',
      subjectCode: 'ว30203',
      subjectName: 'ฟิสิกส์ 3 (ไฟฟ้าและวงจรขั้นสูง)',
      gradeLevel: 'ชั้น ม.5/2',
      room: 'ห้อง 424 (ห้องปฏิบัติการฟิสิกส์)',
      studentCount: 40,
      nextPeriod: 'วันพรุ่งนี้ 08:30 น. (คาบ 1-2)',
      currentTaskTitle: 'รายงานผลการทดลองวงจรไฟฟ้า RLC',
      submittedCount: 22,
      totalTaskCount: 40,
      category: 'physics',
      themeColor: '#5856D6',
      status: 'warning'
    },
    {
      id: 'tc-3',
      subjectCode: 'ว20101',
      subjectName: 'วิทยาศาสตร์ทั่วไป (กระบวนการทางวิทยาศาสตร์)',
      gradeLevel: 'ชั้น ม.2/3',
      room: 'ห้อง 212 (อาคารเฉลิมพระเกียรติ)',
      studentCount: 32,
      nextPeriod: 'วันพฤหัสบดี 10:20 น. (คาบ 3)',
      currentTaskTitle: 'แบบฝึกหัดท้ายบท: การสังเกตและตั้งสมมติฐาน',
      submittedCount: 32,
      totalTaskCount: 32,
      category: 'science',
      themeColor: '#34C759',
      status: 'completed'
    },
    {
      id: 'tc-4',
      subjectCode: 'ว30204',
      subjectName: 'ดาราศาสตร์และอวกาศศึกษา',
      gradeLevel: 'ชั้น ม.6/1 (ห้องเรียนพิเศษ)',
      room: 'ห้องดาราศาสตร์ ชั้น 5',
      studentCount: 28,
      nextPeriod: 'วันศุกร์ 13:50 น.',
      currentTaskTitle: 'วิเคราะห์สเปกตรัมแสงจากดาวฤกษ์',
      submittedCount: 25,
      totalTaskCount: 28,
      category: 'general',
      themeColor: '#FF9500',
      status: 'active'
    }
  ]);

  // Attendance mock list for classroom
  const [attendanceList, setAttendanceList] = useState<StudentAttendanceRecord[]>([
    { id: 'att-1', rollNo: 1, name: 'นายกิตติศักดิ์ ประเสริฐสังข์', status: 'present' },
    { id: 'att-2', rollNo: 2, name: 'นายชนาธิป ปัญญาวงศ์', status: 'present' },
    { id: 'att-3', rollNo: 3, name: 'นางสาวณัฐธิดา สมบูรณ์ทรัพย์', status: 'present' },
    { id: 'att-4', rollNo: 4, name: 'นายธีรภัทร เอกชัยกุล', status: 'late', note: 'รถรับส่งเสีย 10 นาที' },
    { id: 'att-5', rollNo: 5, name: 'นางสาวพิมพิศา ฤทธิ์ดี', status: 'present' },
    { id: 'att-6', rollNo: 6, name: 'นายวรเมธ วิริยพาณิชย์', status: 'present' },
    { id: 'att-7', rollNo: 7, name: 'นางสาวกัญญาณัฐ วงศ์สว่าง', status: 'leave', note: 'ลาป่วย มีใบรับรองแพทย์' },
    { id: 'att-8', rollNo: 8, name: 'นายธนกฤต แสงอรุณ', status: 'absent' },
  ]);

  // Create Assignment Form State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCode, setNewTaskCode] = useState('ว30202');
  const [newTaskName, setNewTaskName] = useState('ฟิสิกส์ 2 (กลศาสตร์)');
  const [newTaskDueDate, setNewTaskDueDate] = useState('2567-09-30');
  const [newTaskDueTime, setNewTaskDueTime] = useState('23:59 น.');
  const [newTaskPoints, setNewTaskPoints] = useState(20);
  const [newTaskCategory, setNewTaskCategory] = useState<'homework' | 'lab' | 'project' | 'quiz'>('lab');
  const [newTaskDesc, setNewTaskDesc] = useState('');

  // Filtered classrooms
  const filteredClassrooms = selectedSubjectFilter === 'all'
    ? teacherClassrooms
    : teacherClassrooms.filter(c => c.subjectCode === selectedSubjectFilter);

  // Priority grading submissions
  const pendingGradingSubmissions = assignments.filter(a => a.status === 'submitted' || a.status === 'pending');

  const handleOpenGradeModal = (assignment: Assignment) => {
    setGradingAssignment(assignment);
    setGradeScoreInput(assignment.earnedPoints || assignment.totalPoints || 18);
    setGradeFeedbackInput(assignment.feedback || 'งานเรียบร้อย บันทึกผลการทดลองได้ละเอียด');
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingAssignment) return;
    onGradeAssignment(gradingAssignment.id, Number(gradeScoreInput), gradeFeedbackInput);
    playNotificationSound('grade_update');
    setGradingAssignment(null);
  };

  const handleCreateTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newAssignment: Assignment = {
      id: `asg-${Date.now()}`,
      title: newTaskTitle.trim(),
      subjectCode: newTaskCode,
      subjectName: newTaskName,
      teacherName: currentUser.thaiName,
      dueDate: newTaskDueDate,
      dueTime: newTaskDueTime,
      totalPoints: Number(newTaskPoints),
      description: newTaskDesc.trim() || 'ให้นักเรียนศึกษาเนื้อหาและส่งงานในระบบ SchoolSync พร้อมแนบภาพประกอบ',
      category: newTaskCategory,
      status: 'pending'
    };

    onAddAssignment(newAssignment);
    playNotificationSound('new_assignment');
    setIsCreateTaskModalOpen(false);
    setNewTaskTitle('');
    setNewTaskDesc('');
  };

  const handleToggleAttendance = (studentId: string, status: 'present' | 'absent' | 'leave' | 'late') => {
    setAttendanceList(prev => prev.map(s => s.id === studentId ? { ...s, status } : s));
  };

  const handleSaveAttendance = () => {
    playNotificationSound('success');
    alert(`บันทึกการเช็คชื่อห้อง ${activeAttendanceClass?.gradeLevel} รายวิชา ${activeAttendanceClass?.subjectCode} สำเร็จ (${attendanceList.filter(s => s.status === 'present').length} คนมาเรียน)`);
    setActiveAttendanceClass(null);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    onBroadcastToClass(broadcastMessage.trim());
    playNotificationSound('chime');
    setIsBroadcastModalOpen(false);
    setBroadcastMessage('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Greeting & Subject Filters */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-1">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-blue-50 text-[#0071E3] text-xs font-semibold mb-2 border border-blue-100">
            <span className="w-2 h-2 rounded-full bg-[#0071E3] animate-pulse"></span>
            <span>พื้นที่ทำงานครูผู้สอนออนไลน์ (Teacher Portal)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
            สวัสดี {currentUser.thaiName}
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] mt-1">
            พื้นที่จัดการชั้นเรียนและรายวิชาที่สอน • ตรวจสอบความคืบหน้าของนักเรียนและจัดการภาระงานวันนี้
          </p>
        </div>

        {/* Action button & Subject Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCreateTaskModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0071E3] hover:bg-[#005bb5] text-white text-xs font-semibold shadow-xs transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>+ สร้างการบ้าน / งานใหม่</span>
          </button>

          <button
            type="button"
            onClick={() => setIsBroadcastModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-black/[0.04] text-[#1D1D1F] border border-black/10 text-xs font-semibold shadow-xs transition-all"
            title="ส่งประกาศแจ้งเตือนด่วนไปยัง LINE และแอปนักเรียน"
          >
            <Bell className="w-3.5 h-3.5 text-[#0071E3]" />
            <span>ประกาศในห้อง</span>
          </button>
        </div>
      </section>

      {/* Subject Filter Segmented Control */}
      <div className="flex items-center p-1 bg-black/[0.04] rounded-2xl gap-1 overflow-x-auto max-w-full">
        <button
          onClick={() => setSelectedSubjectFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            selectedSubjectFilter === 'all'
              ? 'bg-white text-[#0071E3] shadow-xs'
              : 'text-[#6E6E73] hover:text-[#1D1D1F]'
          }`}
        >
          ทั้งหมด ({teacherClassrooms.length} ห้องเรียน)
        </button>
        {teacherClassrooms.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedSubjectFilter(c.subjectCode)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedSubjectFilter === c.subjectCode
                ? 'bg-white text-[#0071E3] shadow-xs'
                : 'text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.themeColor }}></span>
            <span>{c.subjectCode} {c.gradeLevel}</span>
          </button>
        ))}
      </div>

      {/* Key Metric Stat Cards (Apple Minimal Design) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-xs hover:-translate-y-0.5 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#6E6E73] font-medium">นักเรียนในความดูแล</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0071E3] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-[#1D1D1F]">142</span>
            <span className="text-xs text-[#6E6E73]">คน</span>
          </div>
          <div className="mt-2 text-xs text-[#6E6E73] flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>4 ห้องเรียนที่รับผิดชอบ</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-xs hover:-translate-y-0.5 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#6E6E73] font-medium">งานรอตรวจและให้คะแนน</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-[#1D1D1F]">28</span>
            <span className="text-xs text-[#6E6E73]">รายการ</span>
          </div>
          <div className="mt-2 text-xs text-[#DC2626] flex items-center gap-1 font-semibold">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>ต้องตรวจด่วน 12 รายการ</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-xs hover:-translate-y-0.5 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#6E6E73] font-medium">อัตราการส่งงานตรงเวลา</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-[#1D1D1F]">94.2%</span>
          </div>
          <div className="mt-2 text-xs text-emerald-600 flex items-center gap-1 font-semibold">
            <span>+3.1% จากสัปดาห์ก่อน</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-xs hover:-translate-y-0.5 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#6E6E73] font-medium">การเข้าเรียนเฉลี่ยวันนี้</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-[#1D1D1F]">98.5%</span>
          </div>
          <div className="mt-2 text-xs text-[#6E6E73] flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>เช็คชื่อครบแล้ว 3/4 คาบ</span>
          </div>
        </div>
      </section>

      {/* Main Split: Left 8 Cols (Classrooms & Workflows), Right 4 Cols (Grading Queue & Schedule) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Section: Classrooms Cards */}
        <section className="xl:col-span-8 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#1D1D1F] flex items-center gap-2">
                <span>ห้องเรียนและรายวิชาที่สอน</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-black/[0.05] text-[#6E6E73]">
                  {filteredClassrooms.length} ห้องเรียน
                </span>
              </h2>
              <p className="text-xs text-[#6E6E73]">
                จัดการรายวิชา มอบหมายงาน เช็คชื่อ และตรวจวัดความก้าวหน้าของผู้เรียน
              </p>
            </div>
            <button
              onClick={onNavigateToAssignments}
              className="text-xs text-[#0071E3] font-semibold hover:underline flex items-center gap-1"
            >
              <span>ดูงานทั้งหมด</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Classroom Cards List */}
          <div className="space-y-4">
            {filteredClassrooms.map((c) => {
              const completionPercent = Math.round((c.submittedCount / c.totalTaskCount) * 100);
              return (
                <article
                  key={c.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-black/[0.06] shadow-xs hover:shadow-md transition-all duration-200 relative overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-xs shrink-0"
                        style={{ backgroundColor: c.themeColor }}
                      >
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-black/[0.05] text-[#1D1D1F]">
                            {c.subjectCode}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-black/[0.03] text-[#6E6E73]">
                            {c.room}
                          </span>
                          <span className="text-xs text-[#6E6E73] flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" /> {c.studentCount} คน
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-[#1D1D1F] mt-1.5">
                          {c.subjectName}
                        </h3>
                        <p className="text-xs text-[#6E6E73] mt-0.5">
                          {c.gradeLevel} • คาบถัดไป: {c.nextPeriod}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span className={`self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                      c.status === 'warning'
                        ? 'bg-red-50 text-[#DC2626]'
                        : c.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-blue-50 text-[#0071E3]'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        c.status === 'warning' ? 'bg-[#DC2626] animate-pulse' : c.status === 'completed' ? 'bg-emerald-600' : 'bg-[#0071E3]'
                      }`}></span>
                      <span>{c.status === 'warning' ? 'ต้องตรวจด่วน' : c.status === 'completed' ? 'ตรวจครบแล้ว' : 'กำลังเปิดรับงาน'}</span>
                    </span>
                  </div>

                  {/* Current Assignment Snapshot Box */}
                  <div className="mt-4 p-4 rounded-2xl bg-black/[0.02] border border-black/[0.05]">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-4 h-4 text-[#0071E3] shrink-0" />
                        <span className="font-semibold text-[#1D1D1F] truncate">
                          {c.currentTaskTitle}
                        </span>
                      </div>
                      <span className="font-medium text-[#6E6E73] shrink-0 ml-2">
                        ส่งแล้ว {c.submittedCount}/{c.totalTaskCount} คน ({completionPercent}%)
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-black/[0.06] h-2 rounded-full mt-2.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${completionPercent}%`,
                          backgroundColor: c.status === 'warning' ? '#DC2626' : c.status === 'completed' ? '#16A34A' : c.themeColor
                        }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#6E6E73] mt-2">
                      <span>ครบกำหนด: พรุ่งนี้ 23:59 น.</span>
                      <span className="font-semibold text-[#0071E3]">
                        {c.totalTaskCount - c.submittedCount === 0 ? 'ครบทุกคน' : `ค้างส่ง ${c.totalTaskCount - c.submittedCount} คน`}
                      </span>
                    </div>
                  </div>

                  {/* Class Action Bar */}
                  <div className="mt-4 pt-3.5 border-t border-black/[0.06] flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={onNavigateToAssignments}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0071E3] text-white text-xs font-semibold hover:bg-[#005bb5] transition-all shadow-xs active:scale-[0.98]"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>ตรวจงาน (Grade)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveAttendanceClass(c)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/[0.04] hover:bg-black/[0.08] text-[#1D1D1F] text-xs font-semibold transition-all"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-[#0071E3]" />
                        <span>เช็คชื่อ (Attendance)</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setBroadcastMessage(`[ประกาศรายวิชา ${c.subjectCode} ${c.subjectName}] `);
                          setIsBroadcastModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/[0.02] hover:bg-black/[0.06] text-[#6E6E73] text-xs font-medium transition-all"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>ประกาศในห้อง</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveClassroomDocs(c)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/[0.02] hover:bg-black/[0.06] text-[#6E6E73] text-xs font-medium transition-all"
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                        <span>จัดการเอกสาร</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Right Section: Priority Grading Queue & Today's Schedule */}
        <aside className="xl:col-span-4 space-y-5">
          {/* Box 1: Priority Grading Queue */}
          <div className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]"></span>
                <h3 className="text-sm font-bold text-[#1D1D1F]">ภาระงานที่ต้องตรวจเร่งด่วน</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-red-50 text-[#DC2626] text-xs font-bold">
                {pendingGradingSubmissions.length} งาน
              </span>
            </div>

            {/* List */}
            <div className="divide-y divide-black/[0.05] mt-1 max-h-[360px] overflow-y-auto">
              {pendingGradingSubmissions.slice(0, 5).map((asg) => (
                <div key={asg.id} className="py-3 flex items-center justify-between gap-3 group">
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#1D1D1F] truncate group-hover:text-[#0071E3] transition-colors">
                      {asg.title}
                    </h4>
                    <p className="text-[11px] text-[#6E6E73] truncate">
                      {asg.subjectCode} · {asg.subjectName}
                    </p>
                    <span className="text-[10px] text-[#86868B] block mt-0.5">
                      กำหนดส่ง: {asg.dueTime} · {asg.totalPoints} คะแนน
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenGradeModal(asg)}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-[#0071E3] text-[#0071E3] hover:text-white text-xs font-bold transition-all shrink-0 active:scale-95"
                  >
                    ตรวจให้คะแนน
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-black/[0.06] text-center">
              <button
                type="button"
                onClick={onNavigateToAssignments}
                className="text-xs font-semibold text-[#0071E3] hover:underline inline-flex items-center gap-1"
              >
                <span>ดูคิวงานรอตรวจทั้งหมดในสมุดงาน</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Box 2: Today's Teaching Schedule */}
          <div className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#0071E3]" />
                <h3 className="text-sm font-bold text-[#1D1D1F]">ตารางสอนวันนี้</h3>
              </div>
              <span className="text-xs text-[#6E6E73]">วันพุธที่ 18 ก.ย.</span>
            </div>

            <div className="mt-3.5 space-y-3">
              {/* Period 1 */}
              <div className="p-3 rounded-2xl bg-black/[0.02] border border-black/[0.04] opacity-80">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6E6E73] font-medium">08:30 - 10:10 น. (คาบ 1-2)</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold text-[10px] flex items-center gap-1">
                    <Check className="w-3 h-3" /> สอนเสร็จแล้ว
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[#1D1D1F] mt-1">ว30203 ฟิสิกส์ 3 (ม.5/2)</h4>
                <p className="text-[11px] text-[#6E6E73]">ห้อง 424 • นักเรียนเข้าเรียน 39/40 คน</p>
              </div>

              {/* Period 2 (Next up) */}
              <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-200 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#0071E3]"></div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#0071E3] font-bold">13:00 - 14:40 น. (คาบ 5-6)</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#0071E3] text-white font-bold text-[10px] animate-pulse">
                    คาบถัดไป
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[#1D1D1F] mt-1">ว30202 ฟิสิกส์ 2 (ม.5/1)</h4>
                <p className="text-[11px] text-[#6E6E73]">ห้อง 421 (อาคาร 4) • การทดลองการสั่นพ้อง</p>
                <div className="mt-2.5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => alert('เปิดไฟล์สไลด์การสอน: ฟิสิกส์ 2 บทที่ 4 การเคลื่อนที่แบบฮาร์มอนิกอย่างง่าย')}
                    className="px-2.5 py-1 rounded-lg bg-[#0071E3] text-white text-[11px] font-semibold hover:bg-[#005bb5] transition-all"
                  >
                    เปิดสไลด์การสอน
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveAttendanceClass(teacherClassrooms[0])}
                    className="px-2.5 py-1 rounded-lg bg-white text-[#1D1D1F] border border-black/10 text-[11px] font-semibold hover:bg-black/[0.04] transition-all"
                  >
                    เตรียมเช็คชื่อ
                  </button>
                </div>
              </div>

              {/* Period 3 */}
              <div className="p-3 rounded-2xl bg-black/[0.02] border border-black/[0.04]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6E6E73] font-medium">15:00 - 16:00 น. (กิจกรรมเสริม)</span>
                  <span className="text-[10px] text-[#86868B]">รอเริ่ม</span>
                </div>
                <h4 className="text-xs font-bold text-[#1D1D1F] mt-1">ชุมนุมฟิสิกส์ดาราศาสตร์ & อวกาศ</h4>
                <p className="text-[11px] text-[#6E6E73]">ห้องดาราศาสตร์ ชั้น 5 • เตรียมสังเกตการณ์ดาวศุกร์</p>
              </div>
            </div>
          </div>

          {/* Box 3: Academic Office Announcements */}
          <div className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-black/[0.06]">
              <h3 className="text-sm font-bold text-[#1D1D1F]">แจ้งเตือนจากฝ่ายวิชาการ</h3>
              <Sparkles className="w-3.5 h-3.5 text-[#0071E3]" />
            </div>
            <div className="mt-3 space-y-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-black/[0.02]">
                <p className="font-bold text-[#1D1D1F]">ส่งข้อสอบกลางภาค 1/2567</p>
                <p className="text-[11px] text-[#6E6E73] mt-0.5">
                  กำหนดส่งไฟล์ข้อสอบพร้อมพิมพ์เขียวภายในวันศุกร์นี้ (16:30 น.)
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-black/[0.02]">
                <p className="font-bold text-[#1D1D1F]">การอบรมการใช้ iPad เพื่อการศึกษา</p>
                <p className="text-[11px] text-[#6E6E73] mt-0.5">
                  ห้องประชุมแก้วกัลยา วันพุธที่ 17 ก.ค. เวลา 14:00 - 16:00 น.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Modal 1: Quick Grade Assignment Modal */}
      {gradingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-lg border border-black/10 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#1D1D1F]">
                  ตรวจและให้คะแนนงานนักเรียน
                </h3>
                <p className="text-xs text-[#6E6E73]">
                  {gradingAssignment.subjectCode} · {gradingAssignment.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setGradingAssignment(null)}
                className="p-1 rounded-full text-[#86868B] hover:text-[#1D1D1F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Submission preview */}
            <div className="p-3.5 rounded-2xl bg-black/[0.02] border border-black/[0.05] space-y-2 text-xs">
              <div className="flex items-center justify-between font-semibold text-[#1D1D1F]">
                <span>คำตอบจากนักเรียน (นายวรเมธ วิริยพาณิชย์)</span>
                <span className="text-[11px] text-[#6E6E73]">ส่งเมื่อ 25 นาทีที่แล้ว</span>
              </div>
              <p className="text-[#333336] leading-relaxed">
                {gradingAssignment.studentSubmission?.textAnswer || 
                  'ได้ทำการทดลองตามขั้นตอนบันทึกคาบการแกว่ง T = 2.01 วินาที ค่าความเร่ง g เฉลี่ยคำนวณได้ 9.81 m/s² ค่าความคลาดเคลื่อน 0.5% แนบรูปกราฟความสัมพันธ์ T² กับ L'}
              </p>
            </div>

            <form onSubmit={handleSaveGrade} className="space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-[#1D1D1F]">
                    คะแนนที่ได้ (เต็ม {gradingAssignment.totalPoints} คะแนน):
                  </label>
                  <span className="text-sm font-bold text-[#0071E3] font-mono">
                    {gradeScoreInput} / {gradingAssignment.totalPoints}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={gradingAssignment.totalPoints}
                  value={gradeScoreInput}
                  onChange={(e) => setGradeScoreInput(Number(e.target.value))}
                  className="w-full accent-[#0071E3]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1.5">
                  คำติชมและข้อเสนอแนะจากคุณครู:
                </label>
                <textarea
                  rows={3}
                  value={gradeFeedbackInput}
                  onChange={(e) => setGradeFeedbackInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/[0.02] border border-black/10 focus:border-[#0071E3] outline-none text-xs"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>คะแนนและข้อเสนอแนะจะถูกส่งผ่าน LINE Notify ไปยังนักเรียนทันทีที่บันทึก</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-black/[0.06]">
                <button
                  type="button"
                  onClick={() => setGradingAssignment(null)}
                  className="px-4 py-2 rounded-xl text-xs text-[#6E6E73] hover:text-[#1D1D1F]"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0071E3] hover:bg-[#005bb5] text-white font-semibold shadow-xs flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4" />
                  <span>บันทึกคะแนน</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Attendance Modal */}
      {activeAttendanceClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-xl border border-black/10 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#1D1D1F]">
                  เช็คชื่อเข้าชั้นเรียน: {activeAttendanceClass.gradeLevel}
                </h3>
                <p className="text-xs text-[#6E6E73]">
                  {activeAttendanceClass.subjectCode} {activeAttendanceClass.subjectName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveAttendanceClass(null)}
                className="p-1 rounded-full text-[#86868B] hover:text-[#1D1D1F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Filter buttons */}
            <div className="flex items-center justify-between text-xs bg-black/[0.03] p-2.5 rounded-2xl">
              <span className="font-semibold text-[#1D1D1F]">
                มา: {attendanceList.filter(s => s.status === 'present').length} · 
                สาย: {attendanceList.filter(s => s.status === 'late').length} · 
                ลา: {attendanceList.filter(s => s.status === 'leave').length} · 
                ขาด: {attendanceList.filter(s => s.status === 'absent').length}
              </span>
              <button
                type="button"
                onClick={() => setAttendanceList(prev => prev.map(s => ({ ...s, status: 'present' })))}
                className="text-[#0071E3] font-bold hover:underline"
              >
                ทำเครื่องหมายมาครบทุกคน
              </button>
            </div>

            {/* Students list */}
            <div className="divide-y divide-black/[0.05] max-h-72 overflow-y-auto pr-1 text-xs">
              {attendanceList.map((st) => (
                <div key={st.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-[#1D1D1F] truncate">
                      เลขที่ {st.rollNo}. {st.name}
                    </p>
                    {st.note && (
                      <span className="text-[10px] text-amber-600 font-medium">
                        หมายเหตุ: {st.note}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleAttendance(st.id, 'present')}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                        st.status === 'present'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-black/[0.04] text-[#6E6E73] hover:bg-black/[0.08]'
                      }`}
                    >
                      มา
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleAttendance(st.id, 'late')}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                        st.status === 'late'
                          ? 'bg-amber-500 text-white'
                          : 'bg-black/[0.04] text-[#6E6E73] hover:bg-black/[0.08]'
                      }`}
                    >
                      สาย
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleAttendance(st.id, 'leave')}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                        st.status === 'leave'
                          ? 'bg-blue-600 text-white'
                          : 'bg-black/[0.04] text-[#6E6E73] hover:bg-black/[0.08]'
                      }`}
                    >
                      ลา
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleAttendance(st.id, 'absent')}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                        st.status === 'absent'
                          ? 'bg-red-600 text-white'
                          : 'bg-black/[0.04] text-[#6E6E73] hover:bg-black/[0.08]'
                      }`}
                    >
                      ขาด
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-black/[0.06]">
              <button
                type="button"
                onClick={() => setActiveAttendanceClass(null)}
                className="px-4 py-2 rounded-xl text-xs text-[#6E6E73] hover:text-[#1D1D1F]"
              >
                ปิด
              </button>
              <button
                type="button"
                onClick={handleSaveAttendance}
                className="px-5 py-2.5 rounded-xl bg-[#0071E3] hover:bg-[#005bb5] text-white font-semibold text-xs shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>บันทึกการเช็คชื่อ</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Create Assignment Modal */}
      {isCreateTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-lg border border-black/10 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#1D1D1F]">
                  สร้างการบ้าน / มอบหมายภาระงานใหม่
                </h3>
                <p className="text-xs text-[#6E6E73]">
                  กำหนดรายละเอียดงานและแจ้งเตือนนักเรียนผ่าน LINE อัตโนมัติ
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateTaskModalOpen(false)}
                className="p-1 rounded-full text-[#86868B] hover:text-[#1D1D1F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTaskSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">ชื่อภาระงาน / หัวข้องาน:</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ใบงานที่ 5: การคำนวณพลังงานความร้อน"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/[0.02] border border-black/10 focus:border-[#0071E3] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1D1D1F] mb-1">รหัสวิชา:</label>
                  <select
                    value={newTaskCode}
                    onChange={(e) => {
                      setNewTaskCode(e.target.value);
                      const found = teacherClassrooms.find(c => c.subjectCode === e.target.value);
                      if (found) setNewTaskName(found.subjectName);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] border border-black/10 focus:border-[#0071E3] outline-none"
                  >
                    {teacherClassrooms.map(c => (
                      <option key={c.id} value={c.subjectCode}>{c.subjectCode} - {c.gradeLevel}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#1D1D1F] mb-1">ประเภทงาน:</label>
                  <select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] border border-black/10 focus:border-[#0071E3] outline-none"
                  >
                    <option value="homework">การบ้าน (Homework)</option>
                    <option value="lab">รายงานการทดลอง (Lab)</option>
                    <option value="project">โครงงาน / ชิ้นงาน (Project)</option>
                    <option value="quiz">แบบทดสอบย่อย (Quiz)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1D1D1F] mb-1">คะแนนเต็ม:</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newTaskPoints}
                    onChange={(e) => setNewTaskPoints(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] border border-black/10 focus:border-[#0071E3] outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1D1D1F] mb-1">กำหนดส่ง (Due Date):</label>
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] border border-black/10 focus:border-[#0071E3] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1">คำอธิบายและแนวทางการส่งงาน:</label>
                <textarea
                  rows={3}
                  placeholder="ระบุข้อกำหนด เช่น ให้นักเรียนเขียนสรุปลงสมุดแล้วถ่ายภาพ หรือพิมพ์ส่ง..."
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/[0.02] border border-black/10 focus:border-[#0071E3] outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-black/[0.06]">
                <button
                  type="button"
                  onClick={() => setIsCreateTaskModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#6E6E73] hover:text-[#1D1D1F]"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0071E3] hover:bg-[#005bb5] text-white font-semibold shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>ประกาศงานทันที</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Broadcast Announcement Modal */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-lg border border-black/10 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#1D1D1F]">
                  ประกาศข่าวสารด่วนถึงห้องเรียน
                </h3>
                <p className="text-xs text-[#6E6E73]">
                  ส่งตรงถึงนักเรียนในห้องและแจ้งเตือนผ่าน LINE ทันที
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsBroadcastModalOpen(false)}
                className="p-1 rounded-full text-[#86868B] hover:text-[#1D1D1F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#1D1D1F] mb-1.5">
                  ข้อความประกาศ:
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="พิมพ์ข้อความที่ต้องการแจ้ง เช่น พรุ่งนี้ให้นักเรียนเตรียมชุดอุปกรณ์แล็บฟิสิกส์มาด้วย..."
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/[0.02] border border-black/10 focus:border-[#0071E3] outline-none text-xs"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-black/[0.06]">
                <button
                  type="button"
                  onClick={() => setIsBroadcastModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#6E6E73] hover:text-[#1D1D1F]"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0071E3] hover:bg-[#005bb5] text-white font-semibold shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>ส่งประกาศด่วน</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 5: Classroom Documents Modal */}
      {activeClassroomDocs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-lg border border-black/10 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#1D1D1F]">
                  เอกสารประกอบการสอน: {activeClassroomDocs.subjectCode}
                </h3>
                <p className="text-xs text-[#6E6E73]">
                  {activeClassroomDocs.subjectName} ({activeClassroomDocs.gradeLevel})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveClassroomDocs(null)}
                className="p-1 rounded-full text-[#86868B] hover:text-[#1D1D1F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-black/[0.02] border border-black/[0.05] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="font-bold text-[#1D1D1F]">เอกสารประกอบการสอน_บทที่_4.pdf</p>
                    <p className="text-[11px] text-[#6E6E73]">PDF Document · 4.8 MB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => alert('กำลังดาวน์โหลดไฟล์เอกสารการสอน')}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 text-[#0071E3] font-bold text-xs hover:bg-[#0071E3] hover:text-white transition-all"
                >
                  ดาวน์โหลด
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-black/[0.02] border border-black/[0.05] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-bold text-[#1D1D1F]">คู่มือการทดลองเพนดูลัมและฮาร์มอนิก.docx</p>
                    <p className="text-[11px] text-[#6E6E73]">Word Document · 1.2 MB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => alert('กำลังดาวน์โหลดไฟล์คู่มือการทดลอง')}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 text-[#0071E3] font-bold text-xs hover:bg-[#0071E3] hover:text-white transition-all"
                >
                  ดาวน์โหลด
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-black/[0.06]">
              <button
                type="button"
                onClick={() => alert('อัปโหลดไฟล์ประกอบการสอนเพิ่มเติม')}
                className="px-4 py-2 rounded-xl bg-black/[0.04] text-[#1D1D1F] font-semibold text-xs hover:bg-black/[0.08]"
              >
                + อัปโหลดไฟล์เพิ่ม
              </button>
              <button
                type="button"
                onClick={() => setActiveClassroomDocs(null)}
                className="px-4 py-2 rounded-xl bg-[#0071E3] text-white font-semibold text-xs"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
