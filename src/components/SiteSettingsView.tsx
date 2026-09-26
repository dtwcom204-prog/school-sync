import React, { useState } from 'react';
import { SiteSettings, UserProfile } from '../types';
import { 
  Settings, 
  School, 
  Type, 
  Smartphone, 
  ShieldCheck, 
  MessageSquareShare, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Download, 
  Key, 
  Laptop, 
  Globe, 
  Lock, 
  UserCheck,
  Check,
  Sparkles
} from 'lucide-react';

interface SiteSettingsViewProps {
  currentUser: UserProfile;
  settings: SiteSettings;
  onUpdateSettings: (newSettings: SiteSettings) => void;
  onToggleGoogleSync: () => void;
}

export const SiteSettingsView: React.FC<SiteSettingsViewProps> = ({
  currentUser,
  settings,
  onUpdateSettings,
  onToggleGoogleSync,
}) => {
  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'general' | 'google' | 'font' | 'line' | 'admin'>('general');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleReset = () => {
    setFormData(settings);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#6E6E73] font-medium mb-1">
            <span>ระบบบริหารจัดการสารสนเทศ SchoolSync OS</span>
            <span>•</span>
            <span className="text-[#0071E3]">การตั้งค่าระบบ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
            การตั้งค่าระบบเว็บไซต์ (System Settings)
          </h1>
        </div>

        {/* Status badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-full bg-blue-50 text-[#0071E3] font-semibold text-xs border border-blue-200/60 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5" />
            <span>ฟอนต์: Thonburi Active</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-200/60 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>สิทธิ์: {currentUser.role === 'admin' ? 'ผู้ดูแลระบบ (pannawit)' : currentUser.role === 'teacher' ? 'ครูผู้สอน' : 'นักเรียน'}</span>
          </span>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="bg-white rounded-2xl p-1.5 border border-black/[0.06] shadow-xs flex items-center gap-1 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSubTab('general')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeSubTab === 'general'
              ? 'bg-[#0071E3] text-white shadow-xs'
              : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-black/[0.03]'
          }`}
        >
          <School className="w-3.5 h-3.5" />
          <span>ข้อมูลโรงเรียน</span>
        </button>

        <button
          onClick={() => setActiveSubTab('google')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeSubTab === 'google'
              ? 'bg-[#0071E3] text-white shadow-xs'
              : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-black/[0.03]'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>ซิงค์บัญชี Google</span>
        </button>

        <button
          onClick={() => setActiveSubTab('font')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeSubTab === 'font'
              ? 'bg-[#0071E3] text-white shadow-xs'
              : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-black/[0.03]'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>ฟอนต์ Thonburi & การแสดงผล</span>
        </button>

        <button
          onClick={() => setActiveSubTab('line')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeSubTab === 'line'
              ? 'bg-[#0071E3] text-white shadow-xs'
              : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-black/[0.03]'
          }`}
        >
          <MessageSquareShare className="w-3.5 h-3.5" />
          <span>การแจ้งเตือน LINE</span>
        </button>

        <button
          onClick={() => setActiveSubTab('admin')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeSubTab === 'admin'
              ? 'bg-[#0071E3] text-white shadow-xs'
              : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-black/[0.03]'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>บัญชีแอดมิน (pannawit)</span>
        </button>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Tab 1: General School Information */}
        {activeSubTab === 'general' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/[0.06] shadow-xs space-y-5">
            <div>
              <h3 className="text-base font-bold text-[#1D1D1F]">ข้อมูลพื้นฐานสถานศึกษา</h3>
              <p className="text-xs text-[#6E6E73]">
                ข้อมูลประจำตัวของโรงเรียนที่จะปรากฏบนหัวเอกสาร และหัวข้อเว็บ
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-[#1D1D1F]">ชื่อโรงเรียน (ภาษาไทย):</label>
                <input
                  type="text"
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.02] border border-black/10 focus:border-[#0071E3] focus:bg-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#1D1D1F]">หน่วยงานต้นสังกัด / เขตพื้นที่:</label>
                <input
                  type="text"
                  value={formData.schoolSubName}
                  onChange={(e) => setFormData({ ...formData, schoolSubName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.02] border border-black/10 focus:border-[#0071E3] focus:bg-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#1D1D1F]">ปีการศึกษาปัจจุบัน:</label>
                <input
                  type="text"
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.02] border border-black/10 focus:border-[#0071E3] focus:bg-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#1D1D1F]">ภาคเรียนที่:</label>
                <input
                  type="text"
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.02] border border-black/10 focus:border-[#0071E3] focus:bg-white outline-none"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="font-semibold text-[#1D1D1F]">อีเมลติดต่อศูนย์คอมพิวเตอร์ / ผู้ดูแลระบบ:</label>
                <input
                  type="email"
                  value={formData.adminContactEmail}
                  onChange={(e) => setFormData({ ...formData, adminContactEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.02] border border-black/10 focus:border-[#0071E3] focus:bg-white outline-none"
                />
              </div>
            </div>

            {/* Checkbox toggles */}
            <div className="pt-4 border-t border-black/[0.06] space-y-3 text-xs">
              <label className="flex items-center justify-between cursor-pointer p-3 rounded-2xl hover:bg-black/[0.02]">
                <div>
                  <p className="font-semibold text-[#1D1D1F]">อนุญาตให้นักเรียนใช้ฮอตลิงก์รูปภาพ HTML ในการส่งงาน</p>
                  <p className="text-[11px] text-[#6E6E73]">นักเรียนสามารถวางแท็ก &lt;img src="..." /&gt; เพื่อแนบรูปการบ้านได้</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.allowStudentImageHotlinks}
                  onChange={(e) => setFormData({ ...formData, allowStudentImageHotlinks: e.target.checked })}
                  className="w-4 h-4 rounded text-[#0071E3] focus:ring-[#0071E3]/20"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-3 rounded-2xl hover:bg-black/[0.02]">
                <div>
                  <p className="font-semibold text-[#1D1D1F]">เปิดใช้งานโหมดบำรุงรักษาเว็บไซต์ (Maintenance Mode)</p>
                  <p className="text-[11px] text-[#6E6E73]">จำกัดการเข้าถึงเฉพาะแอดมิน pannawit เท่านั้น</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.maintenanceMode}
                  onChange={(e) => setFormData({ ...formData, maintenanceMode: e.target.checked })}
                  className="w-4 h-4 rounded text-[#0071E3] focus:ring-[#0071E3]/20"
                />
              </label>
            </div>
          </div>
        )}

        {/* Tab 2: Google Account & OAuth Sync */}
        {activeSubTab === 'google' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/[0.06] shadow-xs space-y-5">
            <div>
              <h3 className="text-base font-bold text-[#1D1D1F]">การเชื่อมโยงบัญชี Google Account (Single Sign-On)</h3>
              <p className="text-xs text-[#6E6E73]">
                ตามนโยบายความปลอดภัย: <strong>ผู้ใช้จะสามารถล็อกอินด้วย Google Account ได้เมื่อทำการผูกและซิงค์บัญชีกับระบบแล้วเท่านั้น</strong>
              </p>
            </div>

            {/* Sync status card */}
            <div className="p-5 rounded-2xl border border-black/[0.08] bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white border border-black/10 flex items-center justify-center shadow-xs">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#1D1D1F]">
                      {currentUser.googleLinked ? 'เชื่อมโยงกับ Google สำเร็จแล้ว' : 'ยังไม่ได้เชื่อมโยง Google Account'}
                    </h4>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      currentUser.googleLinked ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {currentUser.googleLinked ? 'ซิงค์แล้ว' : 'รอการเชื่อม'}
                    </span>
                  </div>
                  <p className="text-xs text-[#6E6E73] mt-0.5">
                    {currentUser.googleLinked
                      ? `บัญชี: ${currentUser.googleEmail || 'pp.usuk.mail@gmail.com'}`
                      : 'กรุณากดปุ่มเพื่อผูกบัญชี Google ของท่าน'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onToggleGoogleSync}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs ${
                  currentUser.googleLinked
                    ? 'bg-red-50 text-[#DC2626] hover:bg-red-100 border border-red-200'
                    : 'bg-[#0071E3] text-white hover:bg-[#005bb5]'
                }`}
              >
                {currentUser.googleLinked ? 'ยกเลิกการซิงค์บัญชี' : 'เชื่อมต่อบัญชี Google ทันที'}
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-[#1D1D1F]">Google Client ID สำหรับการระบุตัวตนสถาบัน:</label>
                <input
                  type="text"
                  readOnly
                  value={formData.googleClientIdDisplay}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.04] text-[#6E6E73] font-mono text-[11px] outline-none"
                />
              </div>

              <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-100 text-[#00458f] space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0071E3]" />
                  <span>เงื่อนไขการล็อกอินด้วย Google:</span>
                </p>
                <p className="text-[11px] leading-relaxed">
                  1. ผู้ใช้ (นักเรียน, ครู, หรือแอดมิน) ต้องทำการล็อกอินด้วยรหัสนักเรียน/รหัสผ่านในครั้งแรก แล้วกด "เชื่อมต่อบัญชี Google"<br />
                  2. หลังจากเชื่อมต่อแล้ว ในครั้งถัดไปจะสามารถกดปุ่ม <strong>"Google Workspace for Education"</strong> ที่หน้าแรกเพื่อเข้าสู่ระบบได้ทันที
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Sukhumvit Set Font & Responsive UI Display */}
        {activeSubTab === 'font' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/[0.06] shadow-xs space-y-5">
            <div>
              <h3 className="text-base font-bold text-[#1D1D1F]">การตั้งค่าฟอนต์ Sukhumvit Set & การแสดงผลอุปกรณ์</h3>
              <p className="text-xs text-[#6E6E73]">
                ตามข้อกำหนดล่าสุด: ใช้ฟอนต์ <strong>Sukhumvit Set (fonts/sukhumvit-set)</strong> เป็นฟอนต์หลักของระบบ พร้อมฟอนต์สำรอง Thonburi บนอุปกรณ์ Apple
              </p>
            </div>

            {/* Font Showcase preview card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-black/[0.08] shadow-inner space-y-3 font-sukhumvit">
              <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
                <span className="text-xs font-bold text-[#0071E3]">ตัวอย่างการแสดงผลด้วย Sukhumvit Set Font</span>
                <span className="text-[10px] font-mono text-[#86868B]">Font-Family: 'Sukhumvit Set', 'Thonburi', sans-serif</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-[#1D1D1F]">
                โรงเรียนดอนตาลวิทยา มุ่งมั่นพัฒนาการศึกษาในยุคดิจิทัล
              </h4>
              <p className="text-xs sm:text-sm text-[#414753] leading-relaxed">
                กขคงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ • ๑๒๓๔๕๖๗๘๙๐ • 0123456789<br />
                The quick brown fox jumps over the lazy dog. SchoolSync OS Academic Suite v2.0.4.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
                <span className="px-2 py-0.5 bg-black/[0.04] rounded-md font-semibold text-[#1D1D1F]">สุขุมวิท เซต (Sukhumvit Set) มาตรฐานใหม่</span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md font-semibold">คมชัดบนจอ Retina & OLED</span>
                <span className="px-2 py-0.5 bg-blue-50 text-[#0071E3] rounded-md font-semibold">ปรับขนาดอัตโนมัติบนมือถือ</span>
              </div>
            </div>

            {/* Sound Setting Row */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-black/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <p className="font-bold text-[#1D1D1F]">เสียงแจ้งเตือนสั้นๆ (Notification Sound):</p>
                <p className="text-[11px] text-[#6E6E73]">
                  เล่นเสียงกระดิ่งคริสตัลเมื่อมีงานใหม่เข้ามา หรือเมื่อครูอัปเดตผลการตรวจงาน
                </p>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.enableSound}
                    onChange={(e) => setFormData({ ...formData, enableSound: e.target.checked })}
                    className="w-4 h-4 rounded text-[#0071E3] focus:ring-[#0071E3]/20"
                  />
                  <span className="font-semibold text-[#1D1D1F]">เปิดเสียงแจ้งเตือน</span>
                </label>
              </div>
            </div>

            {/* Responsive View Options */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-[#1D1D1F]">การปรับแต่ง UI สำหรับอุปกรณ์ต่างๆ (Mobile, Tablet, Desktop)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl border border-black/[0.06] bg-slate-50 space-y-1">
                  <Smartphone className="w-5 h-5 text-[#0071E3] mb-1" />
                  <p className="font-bold text-[#1D1D1F]">สมาร์ตโฟน (Mobile View)</p>
                  <p className="text-[11px] text-[#6E6E73]">
                    แถบเมนูเลื่อนแนวนอน, ปุ่มสัมผัสขนาด &ge; 44px, ฟอร์มส่งงานแบบ Single-column
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl border border-black/[0.06] bg-slate-50 space-y-1">
                  <Laptop className="w-5 h-5 text-[#0071E3] mb-1" />
                  <p className="font-bold text-[#1D1D1F]">แท็บเล็ต / iPad</p>
                  <p className="text-[11px] text-[#6E6E73]">
                    จัดเลย์เอาต์แบบ 2 คอลัมน์ แผนภูมิเรดาร์ขนาดเต็มจอ และดูตารางเรียนแบบกว้าง
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl border border-black/[0.06] bg-slate-50 space-y-1">
                  <Layers className="w-5 h-5 text-[#0071E3] mb-1" />
                  <p className="font-bold text-[#1D1D1F]">เดสก์ท็อป / หน้าจอใหญ่</p>
                  <p className="text-[11px] text-[#6E6E73]">
                    หน้าจอความละเอียดสูง 1440px สรุปแดชบอร์ด 4 การ์ด และตรวจงานพร้อมพรีวิวคู่
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: LINE Notification Settings */}
        {activeSubTab === 'line' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/[0.06] shadow-xs space-y-5">
            <div>
              <h3 className="text-base font-bold text-[#1D1D1F]">การตั้งค่าช่องทางแจ้งเตือน LINE Notify & LINE Bot</h3>
              <p className="text-xs text-[#6E6E73]">
                กำหนดค่าโทเค็นและช่องทางการส่งข้อความอัตโนมัติไปยังนักเรียนและคุณครู
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-[#1D1D1F]">Master LINE Notify Channel Token (ระดับโรงเรียน):</label>
                <input
                  type="password"
                  value={formData.lineNotifyChannelToken}
                  onChange={(e) => setFormData({ ...formData, lineNotifyChannelToken: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.02] border border-black/10 focus:border-[#06C755] focus:bg-white font-mono outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1">
                  <p className="font-bold text-emerald-800">รอบเวลาส่งสรุปอัตโนมัติ (Morning Brief):</p>
                  <p className="text-[11px] text-emerald-700">07:00 น. ทุกวันจันทร์ - ศุกร์ (สรุปงานด่วนและคาบเรียน)</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-red-50/50 border border-red-100 space-y-1">
                  <p className="font-bold text-[#DC2626]">รอบเวลาเตือนงานค้างส่ง (Evening Alert):</p>
                  <p className="text-[11px] text-red-700">16:30 น. ทุกวัน (เตือนงานที่ยังไม่ส่งก่อนหมดวัน)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Master Admin Account (pannawit) */}
        {activeSubTab === 'admin' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/[0.06] shadow-xs space-y-5">
            <div>
              <h3 className="text-base font-bold text-[#1D1D1F]">บัญชีผู้ดูแลระบบกลาง (Super Administrator)</h3>
              <p className="text-xs text-[#6E6E73]">
                ข้อมูลบัญชีแอดมินสำหรับจัดการระบบ สิทธิ์สูงสุดของโรงเรียนดอนตาลวิทยา
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-black/[0.08] bg-slate-50 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  P
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1D1D1F]">
                    นายปัณณวิชญ์ อุสุข (pannawit)
                  </h4>
                  <p className="text-xs text-[#6E6E73]">กลุ่มงานบริหารเทคโนโลยีสารสนเทศและการสื่อสาร (ICT)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-black/[0.06]">
                <div>
                  <span className="text-[#86868B]">ชื่อผู้ใช้ (Username):</span>
                  <p className="font-mono font-bold text-[#1D1D1F]">pannawit</p>
                </div>
                <div>
                  <span className="text-[#86868B]">รหัสผ่าน (Password):</span>
                  <p className="font-mono font-bold text-[#0071E3]">pp1234</p>
                </div>
                <div>
                  <span className="text-[#86868B]">อีเมลเชื่อมโยง Google:</span>
                  <p className="font-mono text-emerald-700">pp.usuk.mail@gmail.com (ซิงค์แล้ว)</p>
                </div>
                <div>
                  <span className="text-[#86868B]">ระดับสิทธิ์:</span>
                  <p className="font-semibold text-purple-700">Master SuperAdmin (เข้าถึงทุกฟังก์ชัน)</p>
                </div>
              </div>
            </div>

            {/* Admin utilities */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-[#1D1D1F]">เครื่องมือแอดมิน (Maintenance Utilities)</h4>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => alert('ล้างแคชฮอตลิงก์รูปภาพและรีเฟรชข้อมูลสำเร็จ')}
                  className="px-3 py-2 rounded-xl bg-black/[0.04] hover:bg-black/[0.08] text-xs font-semibold text-[#1D1D1F] flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#0071E3]" />
                  <span>ล้างแคชรูปภาพฮอตลิงก์</span>
                </button>
                <button
                  type="button"
                  onClick={() => alert('ดาวน์โหลดไฟล์สำรองข้อมูล JSON (Backup) โรงเรียนดอนตาลวิทยาเรียบร้อย')}
                  className="px-3 py-2 rounded-xl bg-black/[0.04] hover:bg-black/[0.08] text-xs font-semibold text-[#1D1D1F] flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  <span>สำรองข้อมูลระบบ (Export JSON)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action Bottom Bar */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            {savedSuccess && (
              <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>บันทึกการตั้งค่าเว็บไซต์สำเร็จเรียบร้อย!</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl bg-black/[0.04] hover:bg-black/[0.08] text-xs font-semibold text-[#6E6E73] hover:text-[#1D1D1F] transition-all"
            >
              รีเซ็ตค่าเดิม
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#0071E3] hover:bg-[#005bb5] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกการเปลี่ยนแปลง</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
