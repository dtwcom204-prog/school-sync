import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { studentMaleAvatar, teacherFemaleAvatar } from '../data/mockData';
import { playNotificationSound } from '../utils/sound';
import { 
  Users, 
  UserPlus, 
  Upload, 
  FileSpreadsheet, 
  Search, 
  Filter, 
  Key, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Download, 
  RotateCcw, 
  Sparkles, 
  X, 
  ShieldCheck, 
  GraduationCap, 
  User, 
  LogIn, 
  Check, 
  Copy,
  Layers,
  ArrowRight
} from 'lucide-react';

interface UserManagementViewProps {
  currentUser: UserProfile;
  users: UserProfile[];
  onCreateSingleUser: (newUser: UserProfile) => void;
  onCreateBulkUsers: (newUsers: UserProfile[]) => void;
  onDeleteUser: (userId: string) => void;
  onImpersonateUser: (user: UserProfile) => void;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  currentUser,
  users,
  onCreateSingleUser,
  onCreateBulkUsers,
  onDeleteUser,
  onImpersonateUser,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'teacher' | 'admin'>('all');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [visiblePasswords, setVisiblePasswords] = useState<{ [id: string]: boolean }>({});

  // Modals
  const [isSingleModalOpen, setIsSingleModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // Single creation form state
  const [singleRole, setSingleRole] = useState<'student' | 'teacher'>('student');
  const [singleId, setSingleId] = useState('54895');
  const [singleThaiName, setSingleThaiName] = useState('');
  const [singleEngName, setSingleEngName] = useState('');
  const [singleClassroom, setSingleClassroom] = useState('ม.5/1 (1/2567)');
  const [singleRollNumber, setSingleRollNumber] = useState<number>(17);
  const [singlePassword, setSinglePassword] = useState('password123');
  const [singleEmail, setSingleEmail] = useState('');
  const [singleGoogleLinked, setSingleGoogleLinked] = useState(false);
  const [singleErrorMessage, setSingleErrorMessage] = useState('');

  // Bulk creation form state
  const [bulkMode, setBulkMode] = useState<'range' | 'csv'>('range');
  const [bulkClassroom, setBulkClassroom] = useState('ม.5/2 (1/2567)');
  const [bulkStartId, setBulkStartId] = useState('54901');
  const [bulkCount, setBulkCount] = useState<number>(20);
  const [bulkDefaultPassword, setBulkDefaultPassword] = useState('pass1234');
  const [bulkCsvText, setBulkCsvText] = useState('');
  const [bulkPreviewList, setBulkPreviewList] = useState<UserProfile[]>([]);

  // Filtering
  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesClass = classFilter === 'all' || u.classroom.includes(classFilter);
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      u.thaiName.toLowerCase().includes(q) ||
      u.name.toLowerCase().includes(q) ||
      (u.studentId && u.studentId.includes(q)) ||
      (u.teacherId && u.teacherId.toLowerCase().includes(q)) ||
      (u.username && u.username.toLowerCase().includes(q));
    return matchesRole && matchesClass && matchesQuery;
  });

  const studentsCount = users.filter((u) => u.role === 'student').length;
  const teachersCount = users.filter((u) => u.role === 'teacher').length;
  const adminsCount = users.filter((u) => u.role === 'admin').length;

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Submit Single User
  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSingleErrorMessage('');

    const trimmedId = singleId.trim();
    if (!trimmedId || !singleThaiName.trim()) {
      setSingleErrorMessage('กรุณากรอกรหัสประจำตัวและชื่อ-สกุลให้ครบถ้วน');
      return;
    }

    // Check existing
    const exists = users.some(
      (u) =>
        (singleRole === 'student' && u.studentId === trimmedId) ||
        (singleRole === 'teacher' && u.teacherId === trimmedId)
    );
    if (exists) {
      setSingleErrorMessage(`รหัส ${trimmedId} มีอยู่ในระบบแล้ว กรุณาใช้รหัสอื่น`);
      return;
    }

    const newUser: UserProfile = {
      id: `${singleRole === 'student' ? 'std' : 'tch'}-${trimmedId}`,
      studentId: singleRole === 'student' ? trimmedId : undefined,
      teacherId: singleRole === 'teacher' ? trimmedId : undefined,
      password: singlePassword || 'password123',
      name: singleEngName.trim() || singleThaiName.trim(),
      thaiName: singleThaiName.trim(),
      role: singleRole,
      schoolName: 'โรงเรียนดอนตาลวิทยา',
      classroom: singleClassroom,
      studentNumber: singleRole === 'student' ? Number(singleRollNumber) : undefined,
      gpax: singleRole === 'student' ? 3.50 : undefined,
      avatarUrl: singleRole === 'student' ? studentMaleAvatar : teacherFemaleAvatar,
      lineConnected: false,
      googleLinked: singleGoogleLinked,
      googleEmail: singleEmail.trim() || undefined,
      createdAt: new Date().toLocaleDateString('th-TH'),
      status: 'active'
    };

    onCreateSingleUser(newUser);
    playNotificationSound('success');
    setIsSingleModalOpen(false);

    // Reset Form
    setSingleThaiName('');
    setSingleEngName('');
    setSingleEmail('');
    setSingleId((prev) => `${Number(prev) + 1 || 54896}`);
    setSingleRollNumber((prev) => prev + 1);
  };

  // Generate Range Preview
  const handleGenerateRangePreview = () => {
    const start = Number(bulkStartId) || 54901;
    const count = Number(bulkCount) || 10;
    const generated: UserProfile[] = [];

    const sampleThaiFirstNames = ['กานต์', 'ธนาคาร', 'ชลธิชา', 'ธีรภัทร', 'พรประเสริฐ', 'ศุภกิตติ์', 'วรันธร', 'พิมพ์พิชชา', 'อัครเดช', 'จิรภัทร'];
    const sampleThaiLastNames = ['บุญมา', 'ศิริโภคา', 'สุวรรณศรี', 'วัฒนพาณิชย์', 'ตั้งมั่น', 'เลิศปัญญา', 'ไพศาล', 'มงคลทรัพย์'];

    for (let i = 0; i < count; i++) {
      const currentId = `${start + i}`;
      const rollNum = i + 1;
      const firstName = sampleThaiFirstNames[i % sampleThaiFirstNames.length];
      const lastName = sampleThaiLastNames[i % sampleThaiLastNames.length];
      const prefix = i % 2 === 0 ? 'นาย' : 'นางสาว';
      const thaiName = `${prefix}${firstName} ${lastName}`;

      generated.push({
        id: `std-${currentId}`,
        studentId: currentId,
        password: bulkDefaultPassword || `pass${currentId}`,
        name: `Student ${currentId}`,
        thaiName,
        role: 'student',
        schoolName: 'โรงเรียนดอนตาลวิทยา',
        classroom: bulkClassroom,
        studentNumber: rollNum,
        gpax: 3.50,
        avatarUrl: i % 2 === 0 ? studentMaleAvatar : teacherFemaleAvatar,
        lineConnected: false,
        googleLinked: false,
        googleEmail: `std${currentId}@dontan.ac.th`,
        createdAt: new Date().toLocaleDateString('th-TH'),
        status: 'active'
      });
    }

    setBulkPreviewList(generated);
  };

  // Parse CSV Text
  const handleParseCsv = () => {
    if (!bulkCsvText.trim()) return;

    const lines = bulkCsvText.trim().split('\n');
    const parsed: UserProfile[] = [];

    lines.forEach((line, idx) => {
      // Remove quotes and split by comma or tab
      const parts = line.split(/[,;\t]+/).map((p) => p.trim().replace(/^["']|["']$/g, ''));
      if (parts.length >= 2) {
        const id = parts[0];
        const thaiName = parts[1];
        const classroom = parts[2] || 'ม.5/2 (1/2567)';
        const rollNumber = Number(parts[3]) || idx + 1;
        const password = parts[4] || `pass${id}`;
        const email = parts[5] || `${id}@dontan.ac.th`;

        const isTeacher = id.startsWith('T-') || id.startsWith('t-') || thaiName.includes('ครู') || thaiName.includes('อ.');

        parsed.push({
          id: `${isTeacher ? 'tch' : 'std'}-${id}`,
          studentId: !isTeacher ? id : undefined,
          teacherId: isTeacher ? id : undefined,
          password,
          name: `User ${id}`,
          thaiName,
          role: isTeacher ? 'teacher' : 'student',
          schoolName: 'โรงเรียนดอนตาลวิทยา',
          classroom,
          studentNumber: !isTeacher ? rollNumber : undefined,
          gpax: 3.50,
          avatarUrl: isTeacher ? teacherFemaleAvatar : studentMaleAvatar,
          lineConnected: false,
          googleLinked: false,
          googleEmail: email,
          createdAt: new Date().toLocaleDateString('th-TH'),
          status: 'active'
        });
      }
    });

    setBulkPreviewList(parsed);
  };

  // Load Sample CSV template
  const handleLoadSampleCsv = () => {
    const sample = `54901, นายพงศกร รัตนวงศ์, ม.5/2 (1/2567), 1, pass1234, 54901@dontan.ac.th
54902, นางสาวกัลยาณี เจริญยิ่ง, ม.5/2 (1/2567), 2, pass1234, 54902@dontan.ac.th
54903, นายธนวัฒน์ พูนทรัพย์, ม.5/2 (1/2567), 3, pass1234, 54903@dontan.ac.th
54904, นางสาวศิริพร บุญเสริม, ม.5/2 (1/2567), 4, pass1234, 54904@dontan.ac.th
T-2204, อ. สุรชัย มีโชค, กลุ่มสาระสังคมศึกษา, 0, teach2204, surachai.m@dontan.ac.th`;
    setBulkCsvText(sample);
  };

  // Confirm Bulk Create
  const handleConfirmBulk = () => {
    if (bulkPreviewList.length === 0) return;
    onCreateBulkUsers(bulkPreviewList);
    playNotificationSound('success');
    setIsBulkModalOpen(false);
    setBulkPreviewList([]);
    setBulkCsvText('');
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = 'รหัสประจำตัว,ชื่อ-นามสกุล,บทบาท,ห้องเรียน,เลขที่,รหัสผ่านเริ่มต้น,อีเมล\n';
    const rows = filteredUsers.map((u) => {
      const id = u.studentId || u.teacherId || u.username;
      return `${id},"${u.thaiName}",${u.role},"${u.classroom}",${u.studentNumber || '-'},${u.password || 'password123'},${u.googleEmail || '-'}`;
    }).join('\n');

    const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `schoolsync_accounts_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 font-sukhumvit">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#6E6E73] font-medium mb-1">
            <span>กลุ่มงานทะเบียน & บริหารสารสนเทศสถานศึกษา</span>
            <span>•</span>
            <span className="text-[#0071E3]">โรงเรียนดอนตาลวิทยา</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
            ระบบจัดการ & สร้างบัญชีผู้ใช้ (นักเรียน / ครู)
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl bg-white border border-black/10 hover:border-[#0071E3] text-[#1D1D1F] hover:text-[#0071E3] text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
            title="ส่งออกรายชื่อผู้ใช้และรหัสผ่านเป็นไฟล์ CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#0071E3]" />
            <span>ส่งออก CSV</span>
          </button>

          <button
            onClick={() => {
              handleGenerateRangePreview();
              setIsBulkModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
            title="สร้างบัญชีนักเรียนทั้งห้องเรียนทีละมากๆ หรือนำเข้าด้วยไฟล์ CSV"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>สร้างบัญชีทีละมากๆ (Bulk)</span>
          </button>

          <button
            onClick={() => setIsSingleModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#0071E3] hover:bg-[#005bb5] text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
            title="สร้างบัญชีนักเรียนหรือครูแบบรายคน"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ สร้างบัญชีเดี่ยว</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#6E6E73]">
            <span>บัญชีทั้งหมดในระบบ</span>
            <Users className="w-4 h-4 text-[#0071E3]" />
          </div>
          <p className="text-3xl font-extrabold text-[#1D1D1F] tabular-nums font-mono">
            {users.length}
          </p>
          <span className="text-[11px] text-[#86868B]">อัปเดตล่าสุดวันนี้</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#6E6E73]">
            <span>นักเรียน (Students)</span>
            <GraduationCap className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-700 tabular-nums font-mono">
            {studentsCount}
          </p>
          <span className="text-[11px] text-[#86868B]">เข้าเรียน ม.ปลาย</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#6E6E73]">
            <span>ครูผู้สอน (Teachers)</span>
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-3xl font-extrabold text-[#0071E3] tabular-nums font-mono">
            {teachersCount}
          </p>
          <span className="text-[11px] text-[#86868B]">ประจำกลุ่มสาระ</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#6E6E73]">
            <span>ผู้ดูแลระบบ (Admin)</span>
            <Key className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-3xl font-extrabold text-purple-700 tabular-nums font-mono">
            {adminsCount}
          </p>
          <span className="text-[11px] text-purple-700 font-semibold">pannawit (Master)</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-black/[0.06] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Role Segmented Filter */}
        <div className="flex items-center gap-1 p-1 bg-black/[0.04] rounded-xl w-full md:w-auto overflow-x-auto scrollbar-none">
          <button
            onClick={() => setRoleFilter('all')}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all whitespace-nowrap ${
              roleFilter === 'all'
                ? 'bg-white text-[#1D1D1F] shadow-xs font-semibold'
                : 'text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            ทั้งหมด ({users.length})
          </button>
          <button
            onClick={() => setRoleFilter('student')}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all whitespace-nowrap ${
              roleFilter === 'student'
                ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                : 'text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            นักเรียน ({studentsCount})
          </button>
          <button
            onClick={() => setRoleFilter('teacher')}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all whitespace-nowrap ${
              roleFilter === 'teacher'
                ? 'bg-white text-[#0071E3] shadow-xs font-semibold'
                : 'text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            ครูผู้สอน ({teachersCount})
          </button>
          <button
            onClick={() => setRoleFilter('admin')}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all whitespace-nowrap ${
              roleFilter === 'admin'
                ? 'bg-white text-purple-700 shadow-xs font-semibold'
                : 'text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            แอดมิน ({adminsCount})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#86868B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อ, รหัสนักเรียน, รหัสครู..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/[0.03] text-xs text-[#1D1D1F] outline-none focus:bg-white focus:ring-1 focus:ring-[#0071E3] border border-black/5"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-black/[0.06] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-black/[0.06] text-[#6E6E73] font-semibold">
                <th className="py-3 px-4">ผู้ใช้งาน / ชื่อ-สกุล</th>
                <th className="py-3 px-4">รหัสระบุตัวตน</th>
                <th className="py-3 px-4">บทบาท</th>
                <th className="py-3 px-4">ห้องเรียน / สาระ</th>
                <th className="py-3 px-4">รหัสผ่าน</th>
                <th className="py-3 px-4">การซิงค์บัญชี</th>
                <th className="py-3 px-4 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04]">
              {filteredUsers.map((u) => {
                const idDisplay = u.studentId || u.teacherId || u.username;
                const isPasswordShown = !!visiblePasswords[u.id];

                return (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* User Info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatarUrl}
                          alt={u.thaiName}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover border border-black/10 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-[#1D1D1F] text-xs">{u.thaiName}</p>
                          <p className="text-[10px] text-[#86868B]">{u.name}</p>
                        </div>
                      </div>
                    </td>

                    {/* ID */}
                    <td className="py-3 px-4 font-mono font-bold text-[#1D1D1F]">
                      {idDisplay}
                    </td>

                    {/* Role */}
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        u.role === 'admin'
                          ? 'bg-purple-50 text-purple-700'
                          : u.role === 'teacher'
                          ? 'bg-blue-50 text-[#0071E3]'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {u.role === 'admin' ? 'แอดมิน' : u.role === 'teacher' ? 'ครูผู้สอน' : 'นักเรียน'}
                      </span>
                    </td>

                    {/* Classroom */}
                    <td className="py-3 px-4 text-[#6E6E73]">
                      <span>{u.classroom}</span>
                      {u.studentNumber && (
                        <span className="text-[11px] text-[#86868B] ml-1">(เลขที่ {u.studentNumber})</span>
                      )}
                    </td>

                    {/* Password */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs text-[#1D1D1F]">
                          {isPasswordShown ? (u.password || 'password123') : '••••••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility(u.id)}
                          className="p-1 text-[#86868B] hover:text-[#1D1D1F] transition-colors"
                          title="แสดง/ซ่อนรหัสผ่าน"
                        >
                          {isPasswordShown ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>

                    {/* Sync Status */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            u.googleLinked ? 'bg-[#4285F4]' : 'bg-black/20'
                          }`}
                          title={u.googleLinked ? `Google ซิงค์แล้ว: ${u.googleEmail}` : 'ยังไม่ซิงค์ Google'}
                        ></span>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            u.lineConnected ? 'bg-[#06C755]' : 'bg-black/20'
                          }`}
                          title={u.lineConnected ? 'LINE เชื่อมต่อแล้ว' : 'ยังไม่เชื่อมต่อ LINE'}
                        ></span>
                        <span className="text-[10px] text-[#86868B]">
                          {u.googleLinked && u.lineConnected ? 'Google & LINE' : u.googleLinked ? 'Google' : u.lineConnected ? 'LINE' : 'ยังไม่เชื่อม'}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onImpersonateUser(u)}
                          className="px-2.5 py-1 rounded-lg bg-black/[0.04] hover:bg-[#0071E3] hover:text-white text-[11px] font-semibold text-[#1D1D1F] transition-colors flex items-center gap-1"
                          title="จำลองล็อกอินด้วยบัญชีนี้เพื่อทดสอบ"
                        >
                          <LogIn className="w-3 h-3" />
                          <span>ล็อกอิน</span>
                        </button>

                        {u.role !== 'admin' && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`คุณต้องการลบบัญชี ${u.thaiName} (${idDisplay}) ออกจากระบบหรือไม่?`)) {
                                onDeleteUser(u.id);
                              }
                            }}
                            className="p-1 rounded-lg text-[#86868B] hover:text-[#DC2626] hover:bg-red-50 transition-colors"
                            title="ลบบัญชีผู้ใช้"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Single Account Creation */}
      {isSingleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-lg border border-black/10 shadow-2xl p-6 sm:p-7 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#1D1D1F]">สร้างบัญชีผู้ใช้ใหม่ (รายบุคคล)</h3>
                <p className="text-xs text-[#6E6E73]">กำหนดสิทธิ์นักเรียน หรือครูผู้สอน โรงเรียนดอนตาลวิทยา</p>
              </div>
              <button onClick={() => setIsSingleModalOpen(false)} className="p-1 rounded-full text-[#86868B]">
                <X className="w-4 h-4" />
              </button>
            </div>

            {singleErrorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-[#DC2626] text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{singleErrorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSingleSubmit} className="space-y-3.5 text-xs">
              {/* Role selector */}
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">เลือกประเภทบัญชี:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSingleRole('student');
                      setSingleId('54895');
                    }}
                    className={`py-2 px-3 rounded-xl font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                      singleRole === 'student'
                        ? 'border-[#0071E3] bg-[#0071E3]/10 text-[#0071E3]'
                        : 'border-black/10 text-[#6E6E73]'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>บัญชีนักเรียน</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSingleRole('teacher');
                      setSingleId('T-2204');
                    }}
                    className={`py-2 px-3 rounded-xl font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                      singleRole === 'teacher'
                        ? 'border-[#0071E3] bg-[#0071E3]/10 text-[#0071E3]'
                        : 'border-black/10 text-[#6E6E73]'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>บัญชีครูผู้สอน</span>
                  </button>
                </div>
              </div>

              {/* ID & Classroom */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1D1D1F] mb-1">
                    {singleRole === 'student' ? 'รหัสนักเรียน (5 หลัก):' : 'รหัสครูผู้สอน:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={singleId}
                    onChange={(e) => setSingleId(e.target.value)}
                    placeholder={singleRole === 'student' ? 'เช่น 54895' : 'เช่น T-2204'}
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] border border-black/10 focus:border-[#0071E3] outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1D1D1F] mb-1">ห้องเรียน / กลุ่มสาระ:</label>
                  <input
                    type="text"
                    required
                    value={singleClassroom}
                    onChange={(e) => setSingleClassroom(e.target.value)}
                    placeholder="เช่น ม.5/1 หรือ กลุ่มสาระวิทยาศาสตร์"
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] border border-black/10 focus:border-[#0071E3] outline-none"
                  />
                </div>
              </div>

              {/* Names */}
              <div>
                <label className="block font-semibold text-[#1D1D1F] mb-1">ชื่อ-นามสกุล (ภาษาไทย):</label>
                <input
                  type="text"
                  required
                  value={singleThaiName}
                  onChange={(e) => setSingleThaiName(e.target.value)}
                  placeholder="เช่น นายกิตติศักดิ์ พรหมมินทร์ หรือ ดร. ภาวิณี เจริญสุข"
                  className="w-full px-3 py-2 rounded-xl bg-black/[0.02] border border-black/10 focus:border-[#0071E3] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1D1D1F] mb-1">ชื่อ-นามสกุล (English):</label>
                  <input
                    type="text"
                    value={singleEngName}
                    onChange={(e) => setSingleEngName(e.target.value)}
                    placeholder="e.g. Kittisak Prommin"
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] border border-black/10 focus:border-[#0071E3] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1D1D1F] mb-1">เลขที่ (กรณีนักเรียน):</label>
                  <input
                    type="number"
                    value={singleRollNumber}
                    onChange={(e) => setSingleRollNumber(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] border border-black/10 focus:border-[#0071E3] outline-none"
                  />
                </div>
              </div>

              {/* Password & Email */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1D1D1F] mb-1">รหัสผ่านเริ่มต้น:</label>
                  <input
                    type="text"
                    required
                    value={singlePassword}
                    onChange={(e) => setSinglePassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] border border-black/10 focus:border-[#0071E3] outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1D1D1F] mb-1">อีเมลผู้ใช้งาน:</label>
                  <input
                    type="email"
                    value={singleEmail}
                    onChange={(e) => setSingleEmail(e.target.value)}
                    placeholder="user@dontan.ac.th"
                    className="w-full px-3 py-2 rounded-xl bg-black/[0.02] border border-black/10 focus:border-[#0071E3] outline-none"
                  />
                </div>
              </div>

              {/* Google sync check */}
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={singleGoogleLinked}
                  onChange={(e) => setSingleGoogleLinked(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0071E3]"
                />
                <span className="text-[#6E6E73]">
                  เปิดสิทธิ์ให้บัญชีนี้สามารถล็อกอินด้วย Google Account ได้ทันที
                </span>
              </label>

              <div className="pt-3 border-t border-black/[0.06] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsSingleModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-[#6E6E73]"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0071E3] hover:bg-[#005bb5] text-white font-semibold shadow-xs flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>บันทึกและสร้างบัญชี</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Bulk / Batch Account Creation (ทีละมากๆ) */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-3xl border border-black/10 shadow-2xl p-6 sm:p-7 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#1D1D1F]">
                  สร้างบัญชีทีละมากๆ (Bulk & Batch Creation)
                </h3>
                <p className="text-xs text-[#6E6E73]">
                  สร้างบัญชีนักเรียนทั้งห้องเรียนตามช่วงรหัส หรือวางข้อมูล CSV/Excel ได้สะดวกรวดเร็ว
                </p>
              </div>
              <button onClick={() => setIsBulkModalOpen(false)} className="p-1 rounded-full text-[#86868B]">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Selector */}
            <div className="flex p-1 bg-black/[0.04] rounded-xl text-xs gap-1">
              <button
                type="button"
                onClick={() => setBulkMode('range')}
                className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                  bulkMode === 'range' ? 'bg-white text-[#0071E3] shadow-xs' : 'text-[#6E6E73]'
                }`}
              >
                1. สร้างอัตโนมัติตามช่วงรหัส (Auto-Range Generator)
              </button>
              <button
                type="button"
                onClick={() => setBulkMode('csv')}
                className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                  bulkMode === 'csv' ? 'bg-white text-[#0071E3] shadow-xs' : 'text-[#6E6E73]'
                }`}
              >
                2. วางข้อมูลตาราง CSV / Excel (Paste Spreadsheet)
              </button>
            </div>

            {/* Range Mode Controls */}
            {bulkMode === 'range' && (
              <div className="space-y-3 p-4 bg-slate-50/70 rounded-2xl border border-black/5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-semibold text-[#1D1D1F] mb-1">ห้องเรียน:</label>
                    <input
                      type="text"
                      value={bulkClassroom}
                      onChange={(e) => setBulkClassroom(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-black/10 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#1D1D1F] mb-1">รหัสนักเรียนเริ่มต้น:</label>
                    <input
                      type="text"
                      value={bulkStartId}
                      onChange={(e) => setBulkStartId(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-black/10 font-mono outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#1D1D1F] mb-1">จำนวนนักเรียน (คน):</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={bulkCount}
                      onChange={(e) => setBulkCount(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-black/10 font-mono outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#1D1D1F] mb-1">รหัสผ่านเริ่มต้น:</label>
                    <input
                      type="text"
                      value={bulkDefaultPassword}
                      onChange={(e) => setBulkDefaultPassword(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-black/10 font-mono outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleGenerateRangePreview}
                    className="px-4 py-1.5 rounded-xl bg-[#0071E3] text-white font-semibold flex items-center gap-1 shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>คำนวณและแสดงตัวอย่าง ({bulkCount} บัญชี)</span>
                  </button>
                </div>
              </div>
            )}

            {/* CSV Mode Controls */}
            {bulkMode === 'csv' && (
              <div className="space-y-3 p-4 bg-slate-50/70 rounded-2xl border border-black/5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#1D1D1F]">
                    วางข้อมูล CSV รูปแบบ: รหัส, ชื่อ-สกุล, ห้องเรียน, เลขที่, รหัสผ่าน
                  </span>
                  <button
                    type="button"
                    onClick={handleLoadSampleCsv}
                    className="text-[#0071E3] font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>+ วางข้อมูลตัวอย่าง (Sample CSV)</span>
                  </button>
                </div>

                <textarea
                  rows={4}
                  value={bulkCsvText}
                  onChange={(e) => setBulkCsvText(e.target.value)}
                  placeholder="เช่น:&#10;54901, นายกานต์ บุญมา, ม.5/2, 1, pass1234&#10;54902, นางสาวชลธิชา สมบูรณ์, ม.5/2, 2, pass1234&#10;T-2204, อ. สุรชัย มีโชค, สังคมศึกษา, 0, teach123"
                  className="w-full p-3 rounded-xl bg-white border border-black/10 font-mono text-xs outline-none resize-none"
                />

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleParseCsv}
                    className="px-4 py-1.5 rounded-xl bg-[#0071E3] text-white font-semibold flex items-center gap-1 shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>ประมวลผลข้อมูลที่วาง</span>
                  </button>
                </div>
              </div>
            )}

            {/* Preview Table */}
            {bulkPreviewList.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1D1D1F]">
                    ตัวอย่างบัญชีที่จะถูกสร้าง ({bulkPreviewList.length} บัญชี):
                  </span>
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    ตรวจสอบความถูกต้องเรียบร้อย
                  </span>
                </div>

                <div className="border border-black/10 rounded-2xl overflow-hidden max-h-56 overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-100 text-[#6E6E73] font-semibold sticky top-0">
                      <tr>
                        <th className="py-2 px-3">รหัส</th>
                        <th className="py-2 px-3">ชื่อ-สกุล</th>
                        <th className="py-2 px-3">บทบาท</th>
                        <th className="py-2 px-3">ห้อง</th>
                        <th className="py-2 px-3">เลขที่</th>
                        <th className="py-2 px-3">รหัสผ่าน</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 bg-white">
                      {bulkPreviewList.map((u, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="py-1.5 px-3 font-mono font-bold text-[#1D1D1F]">
                            {u.studentId || u.teacherId}
                          </td>
                          <td className="py-1.5 px-3 font-medium">{u.thaiName}</td>
                          <td className="py-1.5 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700">
                              {u.role === 'teacher' ? 'ครู' : 'นักเรียน'}
                            </span>
                          </td>
                          <td className="py-1.5 px-3 text-[#6E6E73]">{u.classroom}</td>
                          <td className="py-1.5 px-3">{u.studentNumber || '-'}</td>
                          <td className="py-1.5 px-3 font-mono text-[#0071E3]">{u.password}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-3 border-t border-black/[0.06] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsBulkModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-[#6E6E73]"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                disabled={bulkPreviewList.length === 0}
                onClick={handleConfirmBulk}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>ยืนยันการสร้าง {bulkPreviewList.length} บัญชีเข้าสู่ระบบ</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
