import React, { useState } from 'react';
import { UserRole } from '../types';
import { 
  GraduationCap, 
  User, 
  ShieldCheck, 
  Lock, 
  QrCode, 
  Fingerprint, 
  HelpCircle, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  Nfc,
  Sparkles,
  School,
  Key,
  AlertTriangle,
  Globe
} from 'lucide-react';

interface LoginViewProps {
  onLogin: (role: UserRole, identifier: string, isAdmin?: boolean) => void;
  onGoogleLogin: () => void;
  isGoogleLinked: boolean;
  linkedGoogleEmail: string;
}

export const LoginView: React.FC<LoginViewProps> = ({ 
  onLogin, 
  onGoogleLogin, 
  isGoogleLinked,
  linkedGoogleEmail 
}) => {
  const [role, setRole] = useState<UserRole>('student');
  const [identifier, setIdentifier] = useState('54892');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showGoogleUnlinkedModal, setShowGoogleUnlinkedModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const roleConfigs = {
    student: {
      title: 'สิทธิ์นักเรียน (Student Portal)',
      desc: 'ใช้รหัสนักเรียน 5 หลัก เข้าถึงตารางเรียน การบ้าน และเกรดเฉลี่ย',
      label: 'รหัสประจำตัวนักเรียน (Student ID)',
      placeholder: 'เช่น 54892',
      defaultId: '54892',
      icon: GraduationCap,
      showSmartCard: true,
    },
    teacher: {
      title: 'สิทธิ์ครูผู้สอน (Faculty Portal)',
      desc: 'บันทึกคะแนนเก็บ เช็คชื่อเข้าเรียน สั่งการบ้าน และตรวจงานนักเรียน',
      label: 'อีเมลสถาบันการศึกษา (@dontan.ac.th) หรือ รหัสประจำตัวครู',
      placeholder: 'teacher.somboon@dontan.ac.th',
      defaultId: 'teacher.somboon@dontan.ac.th',
      icon: User,
      showSmartCard: false,
    },
    admin: {
      title: 'สิทธิ์ผู้ดูแลระบบ (Admin Master Portal)',
      desc: 'จัดการระบบเว็บไซต์ กำหนดค่าสถานศึกษา และบริหารสิทธิ์การใช้งาน',
      label: 'ชื่อผู้ใช้แอดมิน (Username: pannawit)',
      placeholder: 'pannawit',
      defaultId: 'pannawit',
      icon: Key,
      showSmartCard: false,
    },
    staff: {
      title: 'สิทธิ์บุคลากรและงานทะเบียน (Staff & Registrar)',
      desc: 'จัดการข้อมูลทะเบียนนักเรียน การเงิน และงานธุรการกลาง',
      label: 'รหัสประจำตัวบุคลากร / เจ้าหน้าที่ (Staff ID)',
      placeholder: 'STF-2567-0041',
      defaultId: 'STF-2567-0041',
      icon: ShieldCheck,
      showSmartCard: false,
    },
  };

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setErrorMessage('');
    const targetId = roleConfigs[newRole as keyof typeof roleConfigs]?.defaultId || '';
    setIdentifier(targetId);
    if (newRole === 'admin') {
      setPassword('pp1234');
    } else {
      setPassword('password123');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!identifier) return;

    // Check Admin credentials specifically pannawit / pp1234
    if (role === 'admin' || identifier.trim() === 'pannawit') {
      if (identifier.trim() === 'pannawit' && password === 'pp1234') {
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          onLogin('admin', 'pannawit', true);
        }, 600);
        return;
      } else {
        setErrorMessage('ชื่อผู้ใช้หรือรหัสผ่านแอดมินไม่ถูกต้อง (ต้องเป็น pannawit / pp1234)');
        return;
      }
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(role, identifier);
    }, 600);
  };

  const handleGoogleSignInClick = () => {
    if (!isGoogleLinked) {
      setShowGoogleUnlinkedModal(true);
    } else {
      onGoogleLogin();
    }
  };

  const currentCfg = roleConfigs[role as keyof typeof roleConfigs] || roleConfigs.student;
  const CurrentIcon = currentCfg.icon;

  return (
    <div className="relative min-h-screen bg-[#F5F5F7] text-[#1D1D1F] flex flex-col justify-between overflow-x-hidden font-thonburi selection:bg-[#0071E3] selection:text-white">
      {/* Dynamic Ambient Campus Gradient Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-[#d8e2ff] to-[#e2dfff]/40 blur-3xl opacity-70"></div>
        <div className="absolute -bottom-[20%] -right-[15%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tl from-[#e2dfff]/50 via-[#adc6ff]/30 to-white blur-3xl opacity-80"></div>
        <div className="absolute top-[35%] right-[15%] w-[35vw] h-[35vw] rounded-full bg-[#53e16f]/15 blur-[100px] opacity-40"></div>
        <div className="absolute inset-0 bg-[#F5F5F7]/30 backdrop-blur-[30px]"></div>
      </div>

      {/* Top macOS Menu Bar */}
      <header className="relative z-20 w-full px-4 sm:px-6 py-2.5 flex items-center justify-between border-b border-black/[0.06] bg-white/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e] inline-block shadow-xs"></span>
            <span className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#d89e24] inline-block shadow-xs"></span>
            <span className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab29] inline-block shadow-xs"></span>
          </div>
          <div className="h-3.5 w-px bg-black/10 mx-1"></div>
          <div className="flex items-center gap-2">
            <School className="w-4 h-4 text-[#0071E3]" />
            <span className="text-xs font-semibold text-[#1D1D1F]">SchoolSync OS</span>
            <span className="hidden sm:inline text-[10px] font-medium bg-[#d8e2ff] text-[#004493] px-2 py-0.5 rounded-full">
              Thonburi Edition
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-black/[0.03] border border-black/[0.05] text-[#6E6E73]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>ระบบยืนยันตัวตนกลาง (LDAP/SSO ออนไลน์)</span>
          </div>
          <button
            onClick={() => setShowHelpModal('it_center')}
            className="p-1 rounded-lg text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-black/[0.04] transition-colors"
            title="ศูนย์ช่วยเหลือด้านเทคนิค"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Form Center */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8">
        <div className="w-full max-w-[500px]">
          {/* Institutional Branding */}
          <div className="text-center mb-5 sm:mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#0058bc] to-[#0071e3] text-white shadow-xl shadow-[#0058bc]/20 mb-3 border-2 border-white/80 p-3 relative group">
              <School className="w-8 h-8 sm:w-10 sm:h-10 transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border-2 border-white flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1D1D1F]">
              โรงเรียนดอนตาลวิทยา
            </h1>
            <p className="text-xs sm:text-sm text-[#6E6E73] mt-1">
              ระบบบันทึกงาน ส่งงาน สั่งงาน และจัดการข้อมูลการเรียนรู้ออนไลน์
            </p>
          </div>

          {/* Frosted Glass Card Container */}
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-5 sm:p-8 border border-white/80 shadow-2xl shadow-black/[0.04]">
            {/* Apple Segmented Role Selector */}
            <div className="p-1 rounded-2xl bg-black/[0.04] border border-black/[0.05] flex items-center gap-1 mb-4 overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => handleRoleChange('student')}
                className={`flex-1 min-w-[75px] py-2 px-2 sm:px-3 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1 ${
                  role === 'student'
                    ? 'bg-white text-[#0071E3] shadow-xs'
                    : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>นักเรียน</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('teacher')}
                className={`flex-1 min-w-[75px] py-2 px-2 sm:px-3 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1 ${
                  role === 'teacher'
                    ? 'bg-white text-[#0071E3] shadow-xs'
                    : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>ครูผู้สอน</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={`flex-1 min-w-[75px] py-2 px-2 sm:px-3 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1 ${
                  role === 'admin'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                }`}
              >
                <Key className="w-3.5 h-3.5" />
                <span>แอดมิน</span>
              </button>
            </div>

            {/* Dynamic Role Banner */}
            <div className={`mb-4 px-3.5 py-2.5 rounded-xl border flex items-center gap-3 ${
              role === 'admin' 
                ? 'bg-purple-50/80 border-purple-200 text-purple-900' 
                : 'bg-[#0071E3]/10 border-[#0071E3]/20 text-[#0058bc]'
            }`}>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white ${
                role === 'admin' ? 'bg-purple-600' : 'bg-[#0071E3]'
              }`}>
                <CurrentIcon className="w-4 h-4" />
              </div>
              <div className="text-left text-xs">
                <p className="font-semibold">{currentCfg.title}</p>
                <p className="text-[#6E6E73] text-[11px] leading-tight mt-0.5">{currentCfg.desc}</p>
              </div>
            </div>

            {/* Error message */}
            {errorMessage && (
              <div className="mb-3 p-3 rounded-xl bg-red-50 border border-red-200 text-[#DC2626] text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#1D1D1F]">
                  {currentCfg.label}
                </label>
                <div className="relative flex items-center">
                  <CurrentIcon className="absolute left-3.5 w-4 h-4 text-[#86868B] pointer-events-none" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={currentCfg.placeholder}
                    required
                    className="w-full pl-10 pr-20 py-2.5 rounded-xl bg-black/[0.03] focus:bg-white text-xs sm:text-sm text-[#1D1D1F] border border-black/10 focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all outline-none"
                  />
                  {currentCfg.showSmartCard && (
                    <button
                      type="button"
                      onClick={() => {
                        setIdentifier('54892');
                        setPassword('pass123');
                        alert('แตะบัตรนักเรียนดิจิทัลสำเร็จ: นายวรเมธ วิริยพาณิชย์ (รหัส 54892)');
                      }}
                      className="absolute right-2 px-2 py-1 rounded-lg bg-black/[0.05] hover:bg-black/[0.09] text-[#6E6E73] hover:text-[#0071E3] text-[11px] flex items-center gap-1 transition-colors"
                      title="แตะบัตรนักเรียนดิจิทัล"
                    >
                      <Nfc className="w-3.5 h-3.5" />
                      <span>แตะบัตร</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-[#1D1D1F]">
                    รหัสผ่าน (Password)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowHelpModal('forgot')}
                    className="text-[11px] text-[#0071E3] hover:underline font-medium"
                  >
                    ลืมรหัสผ่าน?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 w-4 h-4 text-[#86868B] pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="ป้อนรหัสผ่านของคุณ"
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-black/[0.03] focus:bg-white text-xs sm:text-sm text-[#1D1D1F] border border-black/10 focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-[#86868B] hover:text-[#1D1D1F] transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Passkey option */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded text-[#0071E3] focus:ring-[#0071E3]/30 border-black/20"
                  />
                  <span className="text-xs text-[#6E6E73] select-none">
                    จดจำอุปกรณ์นี้ (Trusted Device)
                  </span>
                </label>
                <div className="flex items-center gap-1 text-[#86868B] hover:text-[#0071E3] text-[11px] font-medium cursor-pointer">
                  <Fingerprint className="w-3.5 h-3.5" />
                  <span>Passkey</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-xl text-white font-semibold text-xs sm:text-sm shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${
                  role === 'admin' 
                    ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/25' 
                    : 'bg-[#0071E3] hover:bg-[#005bb5] shadow-[#0071E3]/25'
                }`}
              >
                {isLoading ? (
                  <span>กำลังยืนยันสิทธิ์ SchoolSync...</span>
                ) : (
                  <>
                    <span>เข้าสู่ระบบการศึกษา (Sign In)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Fill Buttons including Admin pannawit/pp1234 */}
            <div className="mt-4 pt-3 border-t border-black/[0.06] space-y-2">
              <span className="text-[11px] text-[#6E6E73] block">เข้าสู่ระบบด่วนด้วยบัญชีจำลอง:</span>
              <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    handleRoleChange('student');
                    onLogin('student', '54892');
                  }}
                  className="py-1 px-2 rounded-lg bg-black/[0.04] hover:bg-[#0071E3] hover:text-white text-[#1D1D1F] transition-colors truncate"
                  title="นักเรียน (วรเมธ รหัส 54892)"
                >
                  นักเรียน 54892
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleRoleChange('teacher');
                    onLogin('teacher', 'teacher.somboon@dontan.ac.th');
                  }}
                  className="py-1 px-2 rounded-lg bg-black/[0.04] hover:bg-[#0071E3] hover:text-white text-[#1D1D1F] transition-colors truncate"
                  title="คุณครู ดร. สมบูรณ์"
                >
                  ครูผู้สอน
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleRoleChange('admin');
                    onLogin('admin', 'pannawit', true);
                  }}
                  className="py-1 px-2 rounded-lg bg-purple-100 hover:bg-purple-600 hover:text-white text-purple-900 font-semibold transition-colors truncate"
                  title="แอดมิน pannawit / pp1234"
                >
                  แอดมิน pannawit
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="w-full border-t border-black/[0.06]"></div>
              <span className="absolute bg-white px-3 text-[11px] text-[#86868B] rounded-full border border-black/[0.06]">
                หรือดำเนินการด้วย
              </span>
            </div>

            {/* Google Login Button - only allowed when user has synced Google account */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleGoogleSignInClick}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 text-[#1D1D1F] border border-black/15 text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-2.5 active:scale-[0.98]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>เข้าสู่ระบบด้วย Google Workspace / Google Account</span>
              </button>

              <button
                type="button"
                onClick={() => setShowQrModal(true)}
                className="w-full py-2 px-3 rounded-xl bg-black/[0.03] hover:bg-black/[0.06] text-[#1D1D1F] border border-black/[0.06] text-xs font-medium transition-all flex items-center justify-center gap-2"
              >
                <QrCode className="w-4 h-4 text-[#0071E3]" />
                <span>สแกนคิวอาร์โค้ดบัตรประจำตัวดิจิทัล (Digital ID)</span>
              </button>
            </div>
          </div>

          {/* Quick Help Links */}
          <div className="mt-5 text-center flex items-center justify-center gap-3 text-xs text-[#6E6E73]">
            <button
              onClick={() => setShowHelpModal('teacher_advisor')}
              className="hover:text-[#0071E3] transition-colors"
            >
              ขอรหัสผ่านใหม่จากครูที่ปรึกษา
            </button>
            <span>·</span>
            <button
              onClick={() => setShowHelpModal('it_center')}
              className="hover:text-[#0071E3] transition-colors"
            >
              ศูนย์คอมพิวเตอร์ อาคาร 3
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 w-full px-6 py-3 border-t border-black/[0.06] bg-white/70 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#86868B]">
        <div className="flex items-center gap-2">
          <span>ภาคเรียนที่ 1 ปีการศึกษา 2567 · โรงเรียนดอนตาลวิทยา</span>
          <span>·</span>
          <span className="text-emerald-600 font-medium">ระบบเปิดให้บริการ 24 ชม.</span>
        </div>
        <div className="flex items-center gap-3">
          <span>ความปลอดภัยระดับ TLS 1.3 · AES-256</span>
          <span>·</span>
          <span>ฟอนต์มาตรฐาน: Thonburi</span>
        </div>
      </footer>

      {/* Google Unlinked Modal (Explains that user must link Google account first) */}
      {showGoogleUnlinkedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-black/10 text-left animate-in fade-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1D1D1F]">ยังไม่ได้ซิงค์บัญชี Google</h3>
                <p className="text-xs text-[#6E6E73]">เงื่อนไขความปลอดภัยตามระเบียบโรงเรียน</p>
              </div>
            </div>

            <p className="text-xs text-[#414753] leading-relaxed">
              ระบบอนุญาตให้เข้าสู่ระบบด้วย Google Account <strong>เฉพาะบัญชีที่ทำการผูกและซิงค์ข้อมูลกับ SchoolSync แล้วเท่านั้น</strong><br /><br />
              กรุณาเข้าสู่ระบบด้วย <strong>รหัสนักเรียน (54892)</strong> หรือ <strong>รหัสครู</strong> หรือ <strong>แอดมิน (pannawit)</strong> ก่อน จากนั้นไปที่เมนู <strong>"ตั้งค่าเว็บไซต์" &gt; "ซิงค์บัญชี Google"</strong> เพื่อทำการเชื่อมโยง
            </p>

            <div className="p-3 rounded-xl bg-slate-50 border border-black/5 text-[11px] text-[#6E6E73]">
              <span className="font-semibold text-[#1D1D1F]">บัญชีทดสอบที่ผูกไว้แล้ว:</span> {linkedGoogleEmail || 'pp.usuk.mail@gmail.com'}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowGoogleUnlinkedModal(false);
                  onGoogleLogin();
                }}
                className="px-4 py-2 rounded-xl bg-[#0071E3] text-white text-xs font-semibold hover:bg-[#005bb5]"
              >
                จำลองเชื่อมโยงและเข้าสู่ระบบทันที
              </button>
              <button
                type="button"
                onClick={() => setShowGoogleUnlinkedModal(false)}
                className="px-4 py-2 rounded-xl bg-black/[0.04] text-[#6E6E73] text-xs font-medium hover:bg-black/[0.08]"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-black/10 text-center animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-[#1D1D1F]">สแกนบัตรนักเรียนดิจิทัล</h3>
            <p className="text-xs text-[#6E6E73] mt-1">SchoolSync Digital ID Pass</p>
            <div className="my-5 p-6 bg-slate-50 rounded-2xl border border-black/5 flex flex-col items-center">
              <div className="w-36 h-36 bg-white p-2 rounded-xl shadow-xs border border-black/10 flex items-center justify-center">
                <QrCode className="w-28 h-28 text-[#0071E3]" />
              </div>
              <p className="font-mono text-[10px] text-[#86868B] mt-2">DTT-2567-STD-54892</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowQrModal(false);
                  onLogin('student', '54892');
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-[#0071E3] text-white text-xs font-semibold hover:bg-[#005bb5]"
              >
                จำลองสแกนสำเร็จ
              </button>
              <button
                onClick={() => setShowQrModal(false)}
                className="py-2 px-3 rounded-xl bg-black/[0.04] text-[#6E6E73] text-xs font-medium hover:bg-black/[0.08]"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-black/10 text-left animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-[#1D1D1F]">
              {showHelpModal === 'forgot' || showHelpModal === 'teacher_advisor'
                ? 'คำแนะนำการขอรหัสผ่านใหม่'
                : 'ศูนย์เทคโนโลยีและคอมพิวเตอร์ อาคาร 3'}
            </h3>
            <div className="mt-3 text-xs text-[#6E6E73] space-y-2">
              {showHelpModal === 'forgot' || showHelpModal === 'teacher_advisor' ? (
                <>
                  <p>1. สำหรับนักเรียน: ติดต่อคุณครูประจำชั้น ม.5/1 เพื่อออกรหัสผ่านชั่วคราว</p>
                  <p>2. สำหรับแอดมิน: ใช้บัญชี master username: <strong>pannawit</strong> / password: <strong>pp1234</strong></p>
                  <p>3. หรือติดต่อฝ่ายเทคโนโลยีสารสนเทศเพื่อรีเซ็ตรหัสผ่านผ่านอีเมลโรงเรียน</p>
                </>
              ) : (
                <>
                  <p><strong>สถานที่ตั้ง:</strong> ชั้น 2 อาคาร 3 ศูนย์ปฏิบัติการคอมพิวเตอร์ โรงเรียนดอนตาลวิทยา</p>
                  <p><strong>เวลาทำการ:</strong> จันทร์ - ศุกร์ 07:30 - 16:30 น.</p>
                  <p><strong>บริการ:</strong> ปลดล็อกรหัสผ่าน, เชื่อมต่อ Wi-Fi สถาบัน, ขอรับบัตรนักเรียน Smart Card ใหม่</p>
                </>
              )}
            </div>
            <div className="mt-5 pt-3 border-t border-black/[0.06] flex justify-end">
              <button
                onClick={() => setShowHelpModal(null)}
                className="py-1.5 px-4 rounded-xl bg-[#0071E3] text-white text-xs font-semibold hover:bg-[#005bb5]"
              >
                เข้าใจแล้ว
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
