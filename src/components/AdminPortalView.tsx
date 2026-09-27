import React, { useState } from 'react';
import { UserProfile, SiteSettings, Assignment } from '../types';
import { playNotificationSound } from '../utils/sound';
import { 
  ShieldCheck, 
  Users, 
  Layers, 
  Server, 
  Settings, 
  Activity, 
  Lock, 
  Unlock, 
  Download, 
  Upload, 
  RefreshCw, 
  FileSpreadsheet, 
  Calendar, 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  Sliders, 
  Database, 
  Cloud, 
  ShieldAlert, 
  Key, 
  Terminal, 
  Check, 
  Search, 
  ChevronRight, 
  FolderPlus, 
  Edit3, 
  UserPlus, 
  ExternalLink,
  BookOpen,
  X
} from 'lucide-react';

interface ClassroomRecord {
  id: string;
  roomName: string;
  leadAdvisor: string;
  studentCount: number;
  submissionRate: number;
  status: 'complete' | 'pending' | 'overdue';
  term: 'high_school' | 'junior_high';
}

interface AuditLogEntry {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  actor: string;
  ip: string;
  type: 'security' | 'grade' | 'sync' | 'backup';
}

interface AdminPortalViewProps {
  currentUser: UserProfile;
  systemUsers: UserProfile[];
  siteSettings: SiteSettings;
  assignments: Assignment[];
  onNavigateToUserManagement: () => void;
  onNavigateToSettings: () => void;
  onNavigateToAssignments: () => void;
  onSwitchToTeacherView: () => void;
  onSwitchToStudentView: () => void;
  onUpdateSiteSettings: (newSettings: SiteSettings) => void;
  onExportDatabase?: () => void;
  onImportDatabase?: (json: string) => void;
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({
  currentUser,
  systemUsers,
  siteSettings,
  assignments,
  onNavigateToUserManagement,
  onNavigateToSettings,
  onNavigateToAssignments,
  onSwitchToTeacherView,
  onSwitchToStudentView,
  onUpdateSiteSettings,
  onExportDatabase,
  onImportDatabase,
}) => {
  const [adminTab, setAdminTab] = useState<'overview' | 'classes' | 'security' | 'backup'>('overview');
  const [levelFilter, setLevelFilter] = useState<'all' | 'high_school' | 'junior_high'>('high_school');
  const [isSnapshotting, setIsSnapshotting] = useState(false);
  const [snapshotSuccessMsg, setSnapshotSuccessMsg] = useState<string | null>(null);
  const [searchClassQuery, setSearchClassQuery] = useState('');
  const [lockedGradesAll, setLockedGradesAll] = useState(false);

  // 68 Mock Classrooms across high school and junior high
  const [classrooms, setClassrooms] = useState<ClassroomRecord[]>([
    { id: 'c-601', roomName: 'ชั้น ม.6/1 (วิทย์-คณิต พิเศษ)', leadAdvisor: 'อ. สุภชัย กิตติวงศ์', studentCount: 36, submissionRate: 98, status: 'complete', term: 'high_school' },
    { id: 'c-501', roomName: 'ชั้น ม.5/1 (วิทย์-คอมพิวเตอร์)', leadAdvisor: 'อ. พรทิพย์ สุวรรณฉัตร', studentCount: 35, submissionRate: 86, status: 'pending', term: 'high_school' },
    { id: 'c-504', roomName: 'ชั้น ม.5/4 (ศิลป์-ภาษา)', leadAdvisor: 'อ. ธนกฤต ปัญญาดี', studentCount: 38, submissionRate: 62, status: 'overdue', term: 'high_school' },
    { id: 'c-402', roomName: 'ชั้น ม.4/2 (วิทย์-คณิต ทั่วไป)', leadAdvisor: 'อ. วรรณภา สดใส', studentCount: 40, submissionRate: 91, status: 'complete', term: 'high_school' },
    { id: 'c-401', roomName: 'ชั้น ม.4/1 (EP English Program)', leadAdvisor: 'Mr. Johnathan Miller', studentCount: 32, submissionRate: 95, status: 'complete', term: 'high_school' },
    { id: 'c-301', roomName: 'ชั้น ม.3/1 (วิทย์-คณิต Gifted)', leadAdvisor: 'อ. รุ่งนภา ศรีสวัสดิ์', studentCount: 38, submissionRate: 94, status: 'complete', term: 'junior_high' },
    { id: 'c-203', roomName: 'ชั้น ม.2/3 (ห้องเรียนปกติ)', leadAdvisor: 'อ. ณัฐวุฒิ ศิริพงษ์', studentCount: 42, submissionRate: 88, status: 'pending', term: 'junior_high' },
    { id: 'c-101', roomName: 'ชั้น ม.1/1 (หลักสูตรพิเศษ)', leadAdvisor: 'อ. ศิริพร หิรัญรัตน์', studentCount: 36, submissionRate: 92, status: 'complete', term: 'junior_high' },
  ]);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: 'log-1',
      title: 'อ.ณัฐวุฒิ อัปเดตคะแนนฟิสิกส์ 2',
      detail: 'แก้ไขเกรดห้อง ม.5/1 รายวิชา ว30202 (25 รายการ)',
      timestamp: 'เมื่อ 3 นาทีที่แล้ว',
      actor: 'อ.ณัฐวุฒิ ศิริพงษ์',
      ip: '192.168.1.104',
      type: 'grade'
    },
    {
      id: 'log-2',
      title: 'แอดมินอนุมัติสิทธิ์ครูใหม่ 2 ท่าน',
      detail: 'เพิ่มบทบาท Teacher_Full_Access ในกลุ่มสาระคณิตศาสตร์',
      timestamp: 'เมื่อ 24 นาทีที่แล้ว',
      actor: 'ผู้ดูแลระบบกลาง (pannawit)',
      ip: '10.0.4.15',
      type: 'security'
    },
    {
      id: 'log-3',
      title: 'ระบบซิงค์ข้อมูล Google Workspace สำเร็จ',
      detail: 'ซิงค์บัญชีอีเมลนักเรียนใหม่ @dontan.ac.th จำนวน 35 บัญชี',
      timestamp: 'เมื่อ 42 นาทีที่แล้ว',
      actor: 'Automated Cronjob',
      ip: '127.0.0.1',
      type: 'sync'
    },
    {
      id: 'log-4',
      title: 'ดาวน์โหลดสำเนา ปพ.5 ม.6/3',
      detail: 'ครูกมลชนก ส่งออกไฟล์เอกสารทางการพร้อมลายเซ็นดิจิทัล',
      timestamp: 'เมื่อ 1 ชม. ที่แล้ว',
      actor: 'ครูกมลชนก',
      ip: '192.168.1.88',
      type: 'security'
    }
  ]);

  const handleTakeSnapshot = () => {
    setIsSnapshotting(true);
    playNotificationSound('chime');
    setTimeout(() => {
      setIsSnapshotting(false);
      setSnapshotSuccessMsg(`Snapshot สำเร็จเมื่อ ${new Date().toLocaleTimeString('th-TH')} บันทึกลง AWS S3 Bangkok เรียบร้อย`);
      playNotificationSound('success');
      setTimeout(() => setSnapshotSuccessMsg(null), 4000);
    }, 1500);
  };

  const handleToggleLockAllGrades = () => {
    const updated = !lockedGradesAll;
    setLockedGradesAll(updated);
    playNotificationSound(updated ? 'alert' : 'chime');
    alert(updated 
      ? '🔒 ล็อกระบบการกรอกคะแนนและผลการเรียนทุกระดับชั้นเรียบร้อย (หมดช่วงส่งเกรด)' 
      : '🔓 ปลดล็อกระบบบันทึกคะแนน ให้ครูผู้สอนสามารถส่งและแก้ไขเกรดได้ตามปกติ'
    );
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Room,Advisor,Students,SubmissionRate,Status\n"
      + classrooms.map(c => `"${c.roomName}","${c.leadAdvisor}",${c.studentCount},"${c.submissionRate}%","${c.status}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SchoolSync_Classrooms_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    playNotificationSound('success');
  };

  const filteredClassrooms = classrooms.filter(c => {
    if (levelFilter !== 'all' && c.term !== levelFilter) return false;
    if (searchClassQuery.trim() && !c.roomName.toLowerCase().includes(searchClassQuery.toLowerCase()) && !c.leadAdvisor.toLowerCase().includes(searchClassQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Super Administrator Top Executive Bar */}
      <section className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-800 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0071E3]/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>SchoolSync OS Admin</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/30 text-purple-300 border border-purple-400/40">
                  ผู้ดูแลระบบกลาง (Super Administrator)
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl">
              คุณกำลังใช้งานในฐานะผู้ดูแลระบบหลัก ({currentUser.thaiName} · @{currentUser.username || 'pannawit'}) 
              เข้าถึงทุกส่วนของโรงเรียน ควบคุมสิทธิ์ครู นักเรียน ห้องเรียน และฐานข้อมูลแบบรวมศูนย์
            </p>
          </div>

          {/* Quick Role View Previews */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="text-right hidden sm:block mr-2">
              <p className="text-[11px] text-slate-400">สลับดูหน้าต่างจำลอง:</p>
              <p className="text-xs font-semibold text-slate-200">ทดสอบในมุมมองอื่น</p>
            </div>

            <button
              type="button"
              onClick={onSwitchToTeacherView}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all flex items-center gap-1.5"
              title="สลับไปยังหน้าต่างสำหรับครูผู้สอนที่จัดการห้องเรียน"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span>ดูมุมมองครูผู้สอน</span>
            </button>

            <button
              type="button"
              onClick={onSwitchToStudentView}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all flex items-center gap-1.5"
              title="สลับไปยังหน้าต่างสำหรับนักเรียน"
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>ดูมุมมองนักเรียน</span>
            </button>
          </div>
        </div>

        {/* Global Admin Tabs */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setAdminTab('overview')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              adminTab === 'overview'
                ? 'bg-[#0071E3] text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>ภาพรวมระบบ (Overview)</span>
          </button>

          <button
            type="button"
            onClick={onNavigateToUserManagement}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5" />
            <span>จัดการผู้ใช้งาน (Users & Roles)</span>
          </button>

          <button
            type="button"
            onClick={() => setAdminTab('classes')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              adminTab === 'classes'
                ? 'bg-[#0071E3] text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>จัดการหลักสูตร & 68 ห้องเรียน</span>
          </button>

          <button
            type="button"
            onClick={() => setAdminTab('security')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              adminTab === 'security'
                ? 'bg-[#0071E3] text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>กำหนดสิทธิ์ & ความปลอดภัย (Security)</span>
          </button>

          <button
            type="button"
            onClick={onNavigateToSettings}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-1.5"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>การตั้งค่าระบบ (System Settings)</span>
          </button>
        </div>
      </section>

      {/* Snapshot success notification banner */}
      {snapshotSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-in fade-in duration-200 shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{snapshotSuccessMsg}</span>
          </div>
          <button onClick={() => setSnapshotSuccessMsg(null)} className="text-emerald-600 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TOP 4 METRICS STAT TILES */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Users */}
        <div className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-xs flex flex-col justify-between hover:-translate-y-0.5 transition-transform duration-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-[#6E6E73] font-medium">ผู้ใช้งานทั้งหมดในระบบ</p>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F] mt-1">
                2,450 <span className="text-xs font-normal text-[#6E6E73]">บัญชี</span>
              </h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0071E3] flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-black/[0.06] flex items-center justify-between text-[11px] text-[#6E6E73]">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#0071E3]"></span> นร. 2,100</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span> ครู 185</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> แอดมิน 5</span>
          </div>
        </div>

        {/* Metric 2: Active Classrooms */}
        <div className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-xs flex flex-col justify-between hover:-translate-y-0.5 transition-transform duration-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-[#6E6E73] font-medium">ห้องเรียนที่เปิดใช้งาน</p>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F] mt-1">
                68 <span className="text-xs font-normal text-[#6E6E73]">ห้องเรียน</span>
              </h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-black/[0.06] flex items-center justify-between text-[11px]">
            <span className="text-[#6E6E73]">ครอบคลุม ม.1 - ม.6</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold text-[10px]">
              ครบทุกแผนการเรียน
            </span>
          </div>
        </div>

        {/* Metric 3: Active Today */}
        <div className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-xs flex flex-col justify-between hover:-translate-y-0.5 transition-transform duration-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-[#6E6E73] font-medium">อัตราการเข้าใช้งานวันนี้ (Active)</p>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F] mt-1">
                1,894 <span className="text-xs font-normal text-[#6E6E73]">คน</span>
              </h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-black/[0.06] flex items-center justify-between text-[11px]">
            <span className="text-[#6E6E73]">เข้าเช็คชื่อแล้ว 77.3%</span>
            <span className="text-[#0071E3] font-semibold">Peak 08:30 น.</span>
          </div>
        </div>

        {/* Metric 4: Cloud Storage */}
        <div className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-xs flex flex-col justify-between hover:-translate-y-0.5 transition-transform duration-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-[#6E6E73] font-medium">การจัดเก็บข้อมูล Cloud Storage</p>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F] mt-1">
                1.42 <span className="text-xs font-normal text-[#6E6E73]">TB</span>
              </h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Cloud className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <div className="w-full bg-black/[0.05] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#0071E3] h-full rounded-full" style={{ width: '28.4%' }}></div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#6E6E73]">
              <span>ใช้งาน 28.4%</span>
              <span>โควตา 5.0 TB</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2-COLUMN CENTRAL AREA */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column (8 Cols): System Hub & High-Density Classroom Management Table */}
        <section className="xl:col-span-8 space-y-6">
          {/* 1. System-Wide Control Hub */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-black/[0.06] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#0071E3] flex items-center justify-center">
                  <Sliders className="w-4 h-4" />
                </span>
                <h3 className="text-base font-bold text-[#1D1D1F]">
                  การควบคุมสิทธิ์และการเข้าถึงทั่วทั้งโรงเรียน (System-Wide Control Hub)
                </h3>
              </div>
              <span className="text-xs text-[#6E6E73] font-mono">Master Hub</span>
            </div>

            {/* Quick Action Tiles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Tile 1: Manage Teachers */}
              <div 
                onClick={onNavigateToUserManagement}
                className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.06] hover:border-[#0071E3]/40 hover:bg-blue-50/20 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0071E3] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                  <Users className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors">
                  จัดการบัญชีครู & แต่งตั้งวิชาสอน
                </h4>
                <p className="text-[11px] text-[#6E6E73] mt-1 line-clamp-2">
                  กำหนดภาระงานรายวิชา และสิทธิ์แก้ไขเกรดรายห้อง
                </p>
                <div className="mt-3 flex items-center text-[11px] font-semibold text-[#0071E3]">
                  <span>ตั้งค่าภาระงาน</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </div>
              </div>

              {/* Tile 2: Import Bulk Students */}
              <div 
                onClick={onNavigateToUserManagement}
                className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.06] hover:border-purple-400 hover:bg-purple-50/20 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                  <Upload className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-[#1D1D1F] group-hover:text-purple-600 transition-colors">
                  นำเข้าข้อมูลนักเรียนรายภาค
                </h4>
                <p className="text-[11px] text-[#6E6E73] mt-1 line-clamp-2">
                  ซิงค์อัตโนมัติด้วย CSV Template หรือ Google Workspace SSO
                </p>
                <div className="mt-3 flex items-center text-[11px] font-semibold text-purple-600">
                  <span>นำเข้าชุดข้อมูล</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </div>
              </div>

              {/* Tile 3: Lock / Unlock Exam Grading */}
              <div 
                onClick={handleToggleLockAllGrades}
                className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.06] hover:border-amber-400 hover:bg-amber-50/20 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                  {lockedGradesAll ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </div>
                <h4 className="text-xs font-bold text-[#1D1D1F] group-hover:text-amber-600 transition-colors">
                  {lockedGradesAll ? 'ระบบส่งเกรด: ถูกล็อกอยู่' : 'ควบคุมตารางสอบกลาง/ปลายภาค'}
                </h4>
                <p className="text-[11px] text-[#6E6E73] mt-1 line-clamp-2">
                  {lockedGradesAll ? 'คลิกเพื่อปลดล็อกให้ครูส่งเกรดได้' : 'ล็อกระบบบันทึกคะแนนและเปิดห้องสอบดิจิทัล'}
                </p>
                <div className="mt-3 flex items-center text-[11px] font-semibold text-amber-600">
                  <span>{lockedGradesAll ? 'ปลดล็อกระบบ' : 'ตั้งค่าช่วงสอบ / ล็อก'}</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </div>
              </div>

              {/* Tile 4: Emergency Broadcast */}
              <div 
                onClick={() => {
                  const msg = prompt('พิมพ์ข้อความประกาศด่วนทั่วทั้งโรงเรียน (Emergency Broadcast):', 'แจ้งหยุดการเรียนการสอนเป็นกรณีพิเศษเนื่องจากสภาพอากาศ');
                  if (msg) {
                    alert(`ส่งประกาศฉุกเฉิน "${msg}" ไปยัง LINE Notify และแอปนักเรียนทุกคนแล้ว`);
                    playNotificationSound('alert');
                  }
                }}
                className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.06] hover:border-red-400 hover:bg-red-50/20 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-red-50 text-[#DC2626] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                  <Bell className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-[#1D1D1F] group-hover:text-[#DC2626] transition-colors">
                  บอร์ดกระจายข่าวสารด่วน (School-wide Push)
                </h4>
                <p className="text-[11px] text-[#6E6E73] mt-1 line-clamp-2">
                  Push แจ้งเตือนไปยัง Line Notify ครู นักเรียน และผู้ปกครอง
                </p>
                <div className="mt-3 flex items-center text-[11px] font-semibold text-[#DC2626]">
                  <span>ส่งประกาศด่วน</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </div>
              </div>

              {/* Tile 5: Automated Backup Snapshot */}
              <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.06] sm:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1D1D1F]">
                      ระบบสำรองข้อมูลอัตโนมัติ (Automated Backup)
                    </h4>
                    <p className="text-[11px] text-[#6E6E73]">
                      บันทึก snapshot ระบบลง AWS S3 Bangkok Region ทุกๆ เที่ยงคืน
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isSnapshotting}
                  onClick={handleTakeSnapshot}
                  className="px-3.5 py-2 rounded-xl bg-[#0071E3] hover:bg-[#005bb5] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all self-start sm:self-auto shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSnapshotting ? 'animate-spin' : ''}`} />
                  <span>{isSnapshotting ? 'กำลัง Snapshot...' : 'Snapshot เดี๋ยวนี้'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 2. Class & Grade Overview: High-Density Table of All Rooms (ม.1 - ม.6) */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-black/[0.06] shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-[#1D1D1F] flex items-center gap-2">
                  <span>สถานะห้องเรียนและรายวิชาแยกตามระดับชั้น</span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-black/[0.05] text-[#6E6E73]">
                    ม.1 - ม.6
                  </span>
                </h3>
                <p className="text-xs text-[#6E6E73] mt-0.5">
                  การส่งคะแนนกลางภาค และการควบคุมการเปิด-ปิดระบบรายห้อง
                </p>
              </div>

              {/* Segmented control */}
              <div className="inline-flex p-1 rounded-xl bg-black/[0.04] self-start sm:self-auto text-xs">
                <button
                  onClick={() => setLevelFilter('high_school')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    levelFilter === 'high_school' ? 'bg-white text-[#1D1D1F] shadow-xs' : 'text-[#6E6E73]'
                  }`}
                >
                  มัธยมปลาย (ม.4-6)
                </button>
                <button
                  onClick={() => setLevelFilter('junior_high')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    levelFilter === 'junior_high' ? 'bg-white text-[#1D1D1F] shadow-xs' : 'text-[#6E6E73]'
                  }`}
                >
                  มัธยมต้น (ม.1-3)
                </button>
                <button
                  onClick={() => setLevelFilter('all')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    levelFilter === 'all' ? 'bg-white text-[#1D1D1F] shadow-xs' : 'text-[#6E6E73]'
                  }`}
                >
                  ทั้งหมด
                </button>
              </div>
            </div>

            {/* Search filter input */}
            <div className="mb-3 relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#86868B]" />
              <input
                type="text"
                placeholder="ค้นหาห้องเรียน หรือชื่อครูประจำชั้น..."
                value={searchClassQuery}
                onChange={(e) => setSearchClassQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-black/[0.02] border border-black/10 text-xs focus:border-[#0071E3] outline-none"
              />
            </div>

            {/* High Density Table */}
            <div className="overflow-x-auto rounded-2xl border border-black/[0.06]">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-black/[0.06] bg-black/[0.02] text-[#6E6E73] font-semibold">
                    <th className="py-2.5 px-3.5">ระดับชั้น / ห้อง</th>
                    <th className="py-2.5 px-3.5">ครูประจำชั้น (Lead Advisor)</th>
                    <th className="py-2.5 px-3.5">จำนวน นร.</th>
                    <th className="py-2.5 px-3.5">อัตราการส่งงาน</th>
                    <th className="py-2.5 px-3.5">สถานะคะแนน</th>
                    <th className="py-2.5 px-3.5 text-right">Admin Override</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.05]">
                  {filteredClassrooms.map((room) => (
                    <tr key={room.id} className="hover:bg-black/[0.015] transition-colors">
                      <td className="py-3 px-3.5 font-bold text-[#1D1D1F] whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            room.status === 'complete' ? 'bg-emerald-500' : room.status === 'pending' ? 'bg-[#0071E3]' : 'bg-[#DC2626]'
                          }`}></span>
                          <span>{room.roomName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3.5 text-[#333336] whitespace-nowrap">{room.leadAdvisor}</td>
                      <td className="py-3 px-3.5 text-[#6E6E73] font-mono">{room.studentCount} คน</td>
                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-black/[0.06] h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full" 
                              style={{ 
                                width: `${room.submissionRate}%`,
                                backgroundColor: room.submissionRate > 90 ? '#16A34A' : room.submissionRate > 70 ? '#0071E3' : '#DC2626'
                              }}
                            ></div>
                          </div>
                          <span className="font-bold text-[11px] font-mono">{room.submissionRate}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                          room.status === 'complete' 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : room.status === 'pending' 
                            ? 'bg-blue-50 text-[#0071E3]' 
                            : 'bg-red-50 text-[#DC2626]'
                        }`}>
                          <span>{room.status === 'complete' ? 'ครบถ้วน' : room.status === 'pending' ? 'รอตรวจ 2 วิชา' : 'เกินกำหนดส่ง'}</span>
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => alert(`Admin Override สิทธิ์สำหรับ ${room.roomName} เรียบร้อย`)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-black/[0.04] hover:bg-[#0071E3] hover:text-white transition-colors"
                        >
                          จัดการสิทธิ์
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="mt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#6E6E73]">
              <span>แสดง {filteredClassrooms.length} จากทั้งหมด 68 ห้องเรียน</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 rounded-xl bg-black/[0.04] hover:bg-black/[0.08] text-[#1D1D1F] font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Export XLS/CSV</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column (4 Cols): Service Health & Live Audit Logs */}
        <aside className="xl:col-span-4 space-y-6">
          {/* 1. Service Health Status */}
          <div className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <h4 className="text-sm font-bold text-[#1D1D1F]">
                  สถานะบริการระบบ (Service Health)
                </h4>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                All Operational
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-black/[0.02] border border-black/[0.04] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Key className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-bold text-[#1D1D1F]">LDAP & Google SSO Gateway</p>
                    <p className="text-[10px] text-[#6E6E73]">Latency: 14ms • Auth Service</p>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>

              <div className="p-3 rounded-2xl bg-black/[0.02] border border-black/[0.04] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Cloud className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-bold text-[#1D1D1F]">Cloud Document Vault</p>
                    <p className="text-[10px] text-[#6E6E73]">AWS S3 AP-Southeast-1 (BKK)</p>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>

              <div className="p-3 rounded-2xl bg-black/[0.02] border border-black/[0.04] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Bell className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-bold text-[#1D1D1F]">Notification Push Queue</p>
                    <p className="text-[10px] text-[#6E6E73]">LINE Notify & Apple APNs Bridge</p>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>

              <div className="p-3 rounded-2xl bg-black/[0.02] border border-black/[0.04] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Database className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-bold text-[#1D1D1F]">Grade Calculation Engine</p>
                    <p className="text-[10px] text-[#6E6E73]">Real-time GPAX Aggregator</p>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
            </div>
          </div>

          {/* 2. Security Audit Logs */}
          <div className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0071E3]" />
                <h4 className="text-sm font-bold text-[#1D1D1F]">
                  บันทึกความปลอดภัยและกิจกรรมล่าสุด
                </h4>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>

            <div className="space-y-3 relative pl-4 before:content-[''] before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-black/[0.06]">
              {auditLogs.map((log) => (
                <div key={log.id} className="relative text-xs">
                  <span className={`w-2 h-2 rounded-full absolute -left-[18px] top-1.5 ring-2 ring-white ${
                    log.type === 'grade' ? 'bg-[#0071E3]' : log.type === 'security' ? 'bg-purple-600' : 'bg-emerald-500'
                  }`}></span>
                  <p className="font-bold text-[#1D1D1F]">{log.title}</p>
                  <p className="text-[11px] text-[#6E6E73] mt-0.5">{log.detail}</p>
                  <span className="text-[10px] text-[#86868B] block mt-0.5">
                    {log.timestamp} • {log.actor} (IP: {log.ip})
                  </span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => alert('ดาวน์โหลด Audit Logs ละเอียดทั้งหมด (3,412 รายการ)')}
              className="mt-4 w-full py-2 rounded-xl bg-black/[0.03] hover:bg-black/[0.06] text-xs font-semibold text-[#1D1D1F] transition-colors flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>ดูบันทึก Audit Logs ทั้งหมด (3,412 รายการ)</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
