import React, { useState } from 'react';
import { LineAlertMessage, UserProfile } from '../types';
import { playNotificationSound } from '../utils/sound';
import { 
  MessageSquareShare, 
  Bell, 
  Send, 
  CheckCircle2, 
  Smartphone, 
  QrCode, 
  Sliders, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  Volume2, 
  ExternalLink,
  ChevronRight,
  Flame,
  Award,
  Radio,
  Music
} from 'lucide-react';

interface LineNotificationViewProps {
  currentUser: UserProfile;
  alerts: LineAlertMessage[];
  onSendTestNotification: (type: 'urgent' | 'assignment' | 'grade' | 'daily_morning') => void;
  onBroadcastToClass: (messageText: string) => void;
  onToggleAlertRead: (id: string) => void;
}

export const LineNotificationView: React.FC<LineNotificationViewProps> = ({
  currentUser,
  alerts,
  onSendTestNotification,
  onBroadcastToClass,
  onToggleAlertRead,
}) => {
  const [activePreviewType, setActivePreviewType] = useState<'urgent' | 'grade' | 'daily_morning'>('urgent');
  const [testSent, setTestSent] = useState(false);
  const [broadcastText, setBroadcastText] = useState('แจ้งนักเรียน ม.5/1 ทุกคน อย่าลืมส่งแล็บรีพอร์ตฟิสิกส์ 3 ภายใน 16:30 น. วันนี้ และเตรียมอุปกรณ์สำหรับแล็บเคมีวันพรุ่งนี้');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Preference switches
  const [prefNewAssignment, setPrefNewAssignment] = useState(true);
  const [prefDeadline, setPrefDeadline] = useState(true);
  const [prefGraded, setPrefGraded] = useState(true);
  const [prefMorningSummary, setPrefMorningSummary] = useState(true);
  const [prefEveningSummary, setPrefEveningSummary] = useState(true);

  const handleTriggerTest = (type: 'urgent' | 'assignment' | 'grade' | 'daily_morning') => {
    onSendTestNotification(type);
    setTestSent(true);
    setTimeout(() => setTestSent(false), 2000);
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;
    onBroadcastToClass(broadcastText.trim());
    setBroadcastSuccess(true);
    setTimeout(() => {
      setBroadcastSuccess(false);
      setBroadcastText('');
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#6E6E73] font-medium mb-1">
            <span>ระบบแจ้งเตือนอัตโนมัติผ่าน LINE Official & Notify</span>
            <span>•</span>
            <span className="text-[#06C755] font-semibold">LINE Connect v2.4</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
            ระบบแจ้งเตือนผ่านไลน์สำหรับนักเรียนและครู
          </h1>
        </div>

        {/* LINE status badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#06C755]/10 border border-[#06C755]/20 self-start sm:self-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-[#06C755] animate-pulse"></span>
          <span className="text-xs font-semibold text-[#059b43]">
            {currentUser.lineConnected ? 'เชื่อมต่อ LINE บัญชีนักเรียนแล้ว' : 'ยังไม่ได้เชื่อมต่อ'}
          </span>
        </div>
      </div>

      {/* Hero 2-Col Layout: Settings & Quick Trigger (Left) vs Real LINE Smartphone Simulator (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 Cols): Controls, Preferences, and Broadcast */}
        <div className="lg:col-span-7 space-y-6">
          {/* Quick Test Trigger Card */}
          <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#06C755]/10 text-[#06C755] flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1D1D1F]">
                    ทดสอบส่งการแจ้งเตือนเข้า LINE ตอนนี้
                  </h3>
                  <p className="text-[11px] text-[#6E6E73]">
                    เลือกประเภทข้อความเพื่อทดสอบส่ง Notification เสมือนจริง
                  </p>
                </div>
              </div>

              {testSent && (
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold flex items-center gap-1 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  ส่งเข้า LINE สำเร็จ!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  setActivePreviewType('urgent');
                  handleTriggerTest('urgent');
                }}
                className="p-3 rounded-2xl border border-red-200 hover:border-red-400 bg-red-50/50 hover:bg-red-50 text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#DC2626] flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" />
                    เตือนงานด่วน
                  </span>
                  <Radio className="w-3 h-3 text-[#DC2626] opacity-70 group-hover:opacity-100" />
                </div>
                <p className="text-[10px] text-[#86868B] leading-tight">
                  เตือนส่งแล็บฟิสิกส์ 3 (อีก 3 ชม.)
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActivePreviewType('daily_morning');
                  handleTriggerTest('daily_morning');
                }}
                className="p-3 rounded-2xl border border-blue-200 hover:border-blue-400 bg-blue-50/50 hover:bg-blue-50 text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#0071E3] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    สรุปงานรอบเช้า
                  </span>
                  <Radio className="w-3 h-3 text-[#0071E3] opacity-70 group-hover:opacity-100" />
                </div>
                <p className="text-[10px] text-[#86868B] leading-tight">
                  สรุปงานประจำวันรอบ 07:00 น.
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActivePreviewType('grade');
                  handleTriggerTest('grade');
                }}
                className="p-3 rounded-2xl border border-emerald-200 hover:border-emerald-400 bg-emerald-50/50 hover:bg-emerald-50 text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    แจ้งคะแนนตรวจ
                  </span>
                  <Radio className="w-3 h-3 text-emerald-700 opacity-70 group-hover:opacity-100" />
                </div>
                <p className="text-[10px] text-[#86868B] leading-tight">
                  แจ้งผลคะแนน 19/20 เคมี 3
                </p>
              </button>
            </div>

            {/* Notification Sound Test & Audio Feedback Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0071E3] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Volume2 className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
                    <span>เสียงแจ้งเตือนสั้นๆ (Notification Sound)</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-100 text-[#0071E3] font-semibold">Sukhumvit Sound</span>
                  </h4>
                  <p className="text-[11px] text-[#6E6E73]">
                    เล่นเสียงคริสตัลสองโทนอัตโนมัติเมื่อมีการสั่งงานใหม่หรือครูตรวจงานเสร็จ
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => playNotificationSound('new_assignment')}
                  className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-blue-200 text-[11px] font-semibold text-[#0071E3] flex items-center gap-1 shadow-xs transition-transform active:scale-95"
                  title="ทดสอบเสียงการบ้านใหม่"
                >
                  <Music className="w-3 h-3" />
                  <span>เสียงสั่งงานใหม่</span>
                </button>
                <button
                  type="button"
                  onClick={() => playNotificationSound('grade_update')}
                  className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-emerald-200 text-[11px] font-semibold text-emerald-700 flex items-center gap-1 shadow-xs transition-transform active:scale-95"
                  title="ทดสอบเสียงตรวจงานเสร็จ"
                >
                  <Award className="w-3 h-3" />
                  <span>เสียงตรวจงาน</span>
                </button>
              </div>
            </div>
          </div>

          {/* Teacher Broadcast tool (Visible to both, highly useful) */}
          <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1D1D1F]">
                    ส่งข้อความบรอดคาสต์เข้ากลุ่ม LINE ห้อง ม.5/1
                  </h3>
                  <p className="text-[11px] text-[#6E6E73]">
                    สำหรับครูผู้สอน หรือหัวหน้าห้องเพื่อแจ้งเตือนการบ้านทั้งห้อง
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-[#86868B]">ม.5/1 (42 คน)</span>
            </div>

            <form onSubmit={handleBroadcast} className="space-y-2.5">
              <textarea
                rows={2}
                value={broadcastText}
                onChange={(e) => setBroadcastText(e.target.value)}
                placeholder="พิมพ์ข้อความที่ต้องการส่งแจ้งเตือนนักเรียนและผู้ปกครองทุกคนในกลุ่ม LINE..."
                className="w-full p-3 rounded-2xl bg-black/[0.02] border border-black/10 focus:border-[#06C755] focus:bg-white text-xs text-[#1D1D1F] outline-none resize-none"
              />

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#86868B]">
                  * ส่งตรงผ่าน LINE Notify API ประจำโรงเรียนดอนตาลวิทยา
                </span>
                <button
                  type="submit"
                  disabled={!broadcastText.trim()}
                  className="px-4 py-2 rounded-xl bg-[#06C755] hover:bg-[#05b34c] disabled:opacity-50 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{broadcastSuccess ? 'บรอดคาสต์สำเร็จ!' : 'บรอดคาสต์เข้า LINE กลุ่ม'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Notification Preference Toggles */}
          <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-xs space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Sliders className="w-4 h-4 text-[#0071E3]" />
              <h3 className="text-sm font-bold text-[#1D1D1F]">
                การตั้งค่าประเภทการแจ้งเตือน (LINE Preferences)
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-xl hover:bg-black/[0.02]">
                <div>
                  <p className="font-semibold text-[#1D1D1F]">แจ้งเตือนเมื่อครูสั่งการบ้านใหม่</p>
                  <p className="text-[11px] text-[#86868B]">ส่งรายละเอียดภาระงานและเกณฑ์คะแนนทันทีที่ครูบันทึก</p>
                </div>
                <input
                  type="checkbox"
                  checked={prefNewAssignment}
                  onChange={(e) => setPrefNewAssignment(e.target.checked)}
                  className="w-4 h-4 rounded text-[#06C755] focus:ring-[#06C755]/30 border-black/20"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-xl hover:bg-black/[0.02]">
                <div>
                  <p className="font-semibold text-[#1D1D1F]">แจ้งเตือนก่อนหมดเวลาส่งงาน (24 ชม. และ 3 ชม.)</p>
                  <p className="text-[11px] text-[#86868B]">เตือนเฉพาะงานที่สถานะยัง "ค้างส่ง" เพื่อไม่ให้พลาดคะแนน</p>
                </div>
                <input
                  type="checkbox"
                  checked={prefDeadline}
                  onChange={(e) => setPrefDeadline(e.target.checked)}
                  className="w-4 h-4 rounded text-[#06C755] focus:ring-[#06C755]/30 border-black/20"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-xl hover:bg-black/[0.02]">
                <div>
                  <p className="font-semibold text-[#1D1D1F]">แจ้งเตือนเมื่อครูตรวจงานและให้คะแนน</p>
                  <p className="text-[11px] text-[#86868B]">รายงานคะแนนที่ได้และคำติชมแนะนำจากคุณครูทันที</p>
                </div>
                <input
                  type="checkbox"
                  checked={prefGraded}
                  onChange={(e) => setPrefGraded(e.target.checked)}
                  className="w-4 h-4 rounded text-[#06C755] focus:ring-[#06C755]/30 border-black/20"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-xl hover:bg-black/[0.02]">
                <div>
                  <p className="font-semibold text-[#1D1D1F]">สรุปภาระงานประจำวันรอบเช้า (07:00 น.)</p>
                  <p className="text-[11px] text-[#86868B]">สรุปคาบเรียนของวันและรายการงานที่ต้องส่งก่อนเริ่มเรียน</p>
                </div>
                <input
                  type="checkbox"
                  checked={prefMorningSummary}
                  onChange={(e) => setPrefMorningSummary(e.target.checked)}
                  className="w-4 h-4 rounded text-[#06C755] focus:ring-[#06C755]/30 border-black/20"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column (5 Cols): Realistic LINE Smartphone Emulator */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-[340px] bg-[#272727] rounded-[44px] p-3 shadow-2xl border-4 border-[#1e1e1e] relative">
            {/* Phone Speaker Notch */}
            <div className="w-28 h-4 bg-black rounded-b-xl mx-auto mb-2 flex items-center justify-center">
              <span className="w-8 h-1 bg-white/20 rounded-full"></span>
            </div>

            {/* Phone Screen Area */}
            <div className="bg-[#788899] rounded-[36px] overflow-hidden min-h-[560px] flex flex-col justify-between shadow-inner">
              {/* LINE Header bar */}
              <div className="bg-[#243342] text-white px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#06C755] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    S
                  </div>
                  <div>
                    <p className="text-xs font-bold leading-tight">SchoolSync ดอนตาลวิทยา</p>
                    <p className="text-[10px] text-white/70">Official Notification Bot</p>
                  </div>
                </div>
                <span className="text-[10px] text-white/60">09:41</span>
              </div>

              {/* Chat Message Bubble Content */}
              <div className="p-3.5 space-y-3 flex-1 overflow-y-auto">
                {/* Timestamp tag */}
                <div className="text-center">
                  <span className="text-[10px] bg-black/25 text-white px-2.5 py-0.5 rounded-full">
                    วันนี้ 07:00 น.
                  </span>
                </div>

                {/* LINE Flex Message Card (Urgent Deadline Card) */}
                {activePreviewType === 'urgent' && (
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-black/10 text-[#1D1D1F] animate-in fade-in zoom-in-95 duration-150">
                    <div className="bg-[#DC2626] text-white p-3 flex items-center justify-between">
                      <span className="text-xs font-bold">⏰ แจ้งเตือนด่วน: ใกล้หมดเวลาส่งงาน!</span>
                      <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">อีก 3 ชม.</span>
                    </div>
                    <div className="p-3.5 space-y-2 text-xs">
                      <div>
                        <p className="text-[11px] text-[#86868B]">วิชาฟิสิกส์ 3 (ว32201)</p>
                        <h4 className="font-bold text-[#1D1D1F] text-sm leading-snug">
                          แล็บรีพอร์ต: การแกว่งของเพนดูลัมอย่างง่าย
                        </h4>
                      </div>
                      <div className="p-2.5 bg-red-50 rounded-xl border border-red-100 space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-[#DC2626] font-semibold">กำหนดส่ง:</span>
                          <span className="font-mono font-bold text-[#DC2626]">วันนี้ 16:30 น.</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-[#6E6E73]">คะแนนเต็ม:</span>
                          <span className="font-semibold text-[#1D1D1F]">20 คะแนน</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#6E6E73]">
                        * สามารถใช้ฟีเจอร์ฮอตลิงก์รูปภาพแนบสมุดผลการทดลองใน SchoolSync ได้ทันที
                      </p>
                      <button
                        onClick={() => alert('จำลองเปิดหน้าส่งงานในแอปพลิเคชัน SchoolSync')}
                        className="w-full py-2 rounded-xl bg-[#06C755] hover:bg-[#05b34c] text-white text-xs font-bold shadow-xs text-center block mt-2"
                      >
                        กดส่งงานที่นี่ (Open in SchoolSync)
                      </button>
                    </div>
                  </div>
                )}

                {/* Daily Morning Summary Card */}
                {activePreviewType === 'daily_morning' && (
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-black/10 text-[#1D1D1F] animate-in fade-in zoom-in-95 duration-150">
                    <div className="bg-[#0071E3] text-white p-3 flex items-center justify-between">
                      <span className="text-xs font-bold">🌅 สรุปภาระงานประจำวันรอบเช้า</span>
                      <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">07:00 น.</span>
                    </div>
                    <div className="p-3.5 space-y-2 text-xs">
                      <p className="font-semibold text-[#1D1D1F]">
                        สวัสดี นายวรเมธ วิริยพาณิชย์ (ม.5/1)
                      </p>
                      <div className="space-y-1.5 text-[11px]">
                        <p className="text-emerald-700 font-medium">
                          • มีเรียนวันนี้ทั้งหมด 7 คาบ (คาบแรก 08:30 น.)
                        </p>
                        <p className="text-[#DC2626] font-medium">
                          • มี 1 งานด่วนต้องส่งก่อน 16:30 น. (ฟิสิกส์ 3)
                        </p>
                        <p className="text-amber-700 font-medium">
                          • มี 1 งานส่งพรุ่งนี้ (การบ้านเมทริกซ์ 4.2)
                        </p>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-xl border border-black/5 text-[10px] text-[#6E6E73]">
                        อันดับเกรดเฉลี่ยปัจจุบัน: 3.84 (อันดับ 3 ของห้อง)
                      </div>
                      <button
                        onClick={() => alert('เปิดแดชบอร์ดสรุปงานรายวัน')}
                        className="w-full py-2 rounded-xl bg-[#0071E3] hover:bg-[#005bb5] text-white text-xs font-bold shadow-xs text-center block"
                      >
                        ดูไทม์ไลน์งานรายวัน
                      </button>
                    </div>
                  </div>
                )}

                {/* Graded Card */}
                {activePreviewType === 'grade' && (
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-black/10 text-[#1D1D1F] animate-in fade-in zoom-in-95 duration-150">
                    <div className="bg-[#16A34A] text-white p-3 flex items-center justify-between">
                      <span className="text-xs font-bold">✅ แจ้งผลคะแนน: คุณครูตรวจงานแล้ว</span>
                      <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">เกรด 4</span>
                    </div>
                    <div className="p-3.5 space-y-2 text-xs">
                      <div>
                        <p className="text-[11px] text-[#86868B]">เคมีเพิ่มเติม 3 (ว32221) · อ. กัลยา</p>
                        <h4 className="font-bold text-[#1D1D1F] text-sm">
                          ใบงานการทดสอบสมดุลเคมี เลอชาเตอลิเย
                        </h4>
                      </div>
                      <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                        <span className="text-emerald-800 font-semibold">คะแนนที่ได้รับ:</span>
                        <span className="text-base font-extrabold text-emerald-700 font-mono">19 / 20</span>
                      </div>
                      <p className="text-[11px] text-[#414753] italic bg-slate-50 p-2 rounded-lg">
                        "เขียนอธิบายหลักการเลอชาเตอลิเยได้ชัดเจนมาก การจัดรูปสมดุลถูกต้อง"
                      </p>
                      <button
                        onClick={() => alert('เปิดหน้ารายละเอียดคะแนนใน SchoolSync')}
                        className="w-full py-2 rounded-xl bg-[#16A34A] hover:bg-[#13883d] text-white text-xs font-bold shadow-xs text-center block"
                      >
                        ดูประวัติคะแนนสะสม
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Emulator Bottom Bar */}
              <div className="bg-[#243342] text-white/50 text-[10px] px-4 py-2 text-center border-t border-white/5">
                SchoolSync Flex Message Webhook · Encrypted
              </div>
            </div>
          </div>
          <p className="text-xs text-[#86868B] mt-2">
            จำลองหน้าจอแชต LINE บนสมาร์ตโฟนของนักเรียน
          </p>
        </div>
      </div>

      {/* Alert History Feed */}
      <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#0071E3]" />
            <h3 className="text-sm font-bold text-[#1D1D1F]">
              ประวัติข้อความแจ้งเตือนที่ส่งผ่าน LINE (Notification Log)
            </h3>
          </div>
          <span className="text-xs text-[#86868B]">{alerts.length} รายการ</span>
        </div>

        <div className="space-y-2.5">
          {alerts.map((alertItem) => (
            <div
              key={alertItem.id}
              onClick={() => onToggleAlertRead(alertItem.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                alertItem.read
                  ? 'bg-slate-50/70 border-black/5'
                  : 'bg-blue-50/40 border-blue-200 shadow-xs'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-[#1D1D1F]">{alertItem.title}</h4>
                  {!alertItem.read && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0071E3]"></span>
                  )}
                </div>
                <p className="text-xs text-[#6E6E73] leading-relaxed">{alertItem.body}</p>
              </div>
              <span className="text-[11px] text-[#86868B] shrink-0 font-mono">
                {alertItem.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
