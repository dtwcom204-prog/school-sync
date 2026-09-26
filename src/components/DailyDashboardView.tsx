import React, { useState } from 'react';
import { Assignment, UserProfile } from '../types';
import { 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  TrendingUp, 
  ArrowUpRight, 
  ListTodo, 
  Check, 
  Plus, 
  Sparkles, 
  Layers,
  ChevronRight,
  BookOpen,
  PieChart
} from 'lucide-react';

interface DailyDashboardViewProps {
  currentUser: UserProfile;
  assignments: Assignment[];
  onNavigateToAssignments: () => void;
  onNavigateToLine: () => void;
}

export const DailyDashboardView: React.FC<DailyDashboardViewProps> = ({
  currentUser,
  assignments,
  onNavigateToAssignments,
  onNavigateToLine,
}) => {
  const [selectedDay, setSelectedDay] = useState<'today' | 'tomorrow' | 'week'>('today');
  const [customTodos, setCustomTodos] = useState([
    { id: 'todo-1', text: 'ตรวจเช็คกราฟ T² กับ L ในแล็บรีพอร์ตฟิสิกส์', done: true, time: '12:30 น.' },
    { id: 'todo-2', text: 'ส่งไฟล์แล็บรีพอร์ตพร้อมฮอตลิงก์รูปภาพใน SchoolSync', done: false, time: '16:00 น.' },
    { id: 'todo-3', text: 'ทำแบบฝึกหัดเมทริกซ์ข้อ 5-10 สำหรับส่งพรุ่งนี้', done: false, time: '19:30 น.' },
    { id: 'todo-4', text: 'ทบทวนโครงงานวิทยาศาสตร์เตรียมนำเสนอในสัปดาห์หน้า', done: false, time: '20:30 น.' },
  ]);
  const [newTodoText, setNewTodoText] = useState('');

  // Daily Stats calculation
  const pending = assignments.filter((a) => a.status === 'pending');
  const submitted = assignments.filter((a) => a.status === 'submitted');
  const graded = assignments.filter((a) => a.status === 'graded');

  const dueToday = pending.filter((a) => a.dueTime.includes('16:30') || a.dueDate === '2026-09-26');
  const dueTomorrow = pending.filter((a) => a.dueTime.includes('23:59') || a.dueDate === '2026-09-27');
  const totalCount = assignments.length;
  const completedCount = submitted.length + graded.length;
  const completionPercentage = Math.round((completedCount / (totalCount || 1)) * 100);

  const toggleTodo = (id: string) => {
    setCustomTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    setCustomTodos((prev) => [
      ...prev,
      {
        id: `todo-${Date.now()}`,
        text: newTodoText.trim(),
        done: false,
        time: '18:00 น.',
      },
    ]);
    setNewTodoText('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title & Quick Filter */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#6E6E73] font-medium mb-1">
            <span>แดชบอร์ดสรุปงานรายวัน (Daily Task Intelligence)</span>
            <span>•</span>
            <span className="text-[#0071E3]">ม.5/1 โรงเรียนดอนตาลวิทยา</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
            สรุปภาระงานประจำวัน & แผนการเรียนรู้
          </h1>
        </div>

        {/* Day Filter */}
        <div className="flex items-center gap-1 p-1 bg-black/[0.04] rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setSelectedDay('today')}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
              selectedDay === 'today'
                ? 'bg-white text-[#0071E3] shadow-xs font-semibold'
                : 'text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            วันนี้ (26 ก.ย.)
          </button>
          <button
            onClick={() => setSelectedDay('tomorrow')}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
              selectedDay === 'tomorrow'
                ? 'bg-white text-[#1D1D1F] shadow-xs font-semibold'
                : 'text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            พรุ่งนี้ (27 ก.ย.)
          </button>
          <button
            onClick={() => setSelectedDay('week')}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
              selectedDay === 'week'
                ? 'bg-white text-[#1D1D1F] shadow-xs font-semibold'
                : 'text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            สัปดาห์นี้
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Due Today */}
        <div className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#6E6E73] font-medium">ส่งภายในวันนี้</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#DC2626] font-mono tabular-nums">
              {dueToday.length || 1}
            </span>
            <span className="text-xs text-[#86868B]">รายการ</span>
          </div>
          <p className="text-[11px] text-[#DC2626] font-medium">
            ด่วนที่สุด: ฟิสิกส์ 3 ก่อน 16:30 น.
          </p>
        </div>

        {/* Due Tomorrow */}
        <div className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#6E6E73] font-medium">ส่งในวันพรุ่งนี้</span>
            <Calendar className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-amber-600 font-mono tabular-nums">
              {dueTomorrow.length || 1}
            </span>
            <span className="text-xs text-[#86868B]">รายการ</span>
          </div>
          <p className="text-[11px] text-[#6E6E73]">
            คณิตศาสตร์ขั้นสูง (23:59 น.)
          </p>
        </div>

        {/* Graded & Completed */}
        <div className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#6E6E73] font-medium">ส่งและตรวจแล้ว</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-mono tabular-nums">
              {graded.length}
            </span>
            <span className="text-xs text-[#86868B]">/ {totalCount} รายการ</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-medium">
            เคมี 3, ชีววิทยา 3 (เฉลี่ย 93%)
          </p>
        </div>

        {/* Completion Velocity */}
        <div className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#6E6E73] font-medium">อัตราความสำเร็จ</span>
            <TrendingUp className="w-4 h-4 text-[#0071E3]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#0071E3] font-mono tabular-nums">
              {completionPercentage}%
            </span>
            <span className="text-xs text-emerald-600 font-medium">เป้าหมาย &gt; 80%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-black/[0.06] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#0071E3]"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid: Daily Timeline + Personal Action Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 24h Daily Timeline & Learning Schedule */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-black/[0.06] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1D1D1F]">
                  ไทม์ไลน์ภาระงาน & คาบเรียนประจำวัน
                </h3>
                <p className="text-xs text-[#6E6E73]">
                  วันพุธที่ 18 กันยายน 2567 (ซิงค์อัตโนมัติกับตารางเรียนและ LINE)
                </p>
              </div>
            </div>

            <button
              onClick={onNavigateToLine}
              className="text-xs font-semibold text-[#0071E3] hover:underline flex items-center gap-1"
            >
              <span>ตั้งเวลาแจ้งเตือน LINE</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Timeline steps */}
          <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-black/[0.06]">
            {/* Step 1 */}
            <div className="relative">
              <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#0071E3] ring-4 ring-white"></span>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                <span className="font-mono text-[#0071E3] font-semibold">07:00 น.</span>
                <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full self-start">
                  ส่งข้อความแล้ว
                </span>
              </div>
              <p className="text-xs font-semibold text-[#1D1D1F] mt-0.5">
                LINE Daily Morning Briefing: แจ้งเตือนสรุปงานด่วน 1 งาน และตารางเรียน 7 คาบ
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-black/40 ring-4 ring-white"></span>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                <span className="font-mono text-[#1D1D1F] font-semibold">08:30 – 10:10 น.</span>
                <span className="text-[11px] text-[#6E6E73]">คาบ 1-2 · ห้อง 312</span>
              </div>
              <p className="text-xs font-semibold text-[#1D1D1F] mt-0.5">
                คณิตศาสตร์ขั้นสูง (ค32205) · อ. ศิริพร: การคูณเมทริกซ์และดีเทอร์มิแนนต์
              </p>
            </div>

            {/* Step 3 (Current / Upcoming) */}
            <div className="relative p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100">
              <span className="absolute -left-[30px] top-4 w-3.5 h-3.5 rounded-full bg-[#0071E3] ring-4 ring-white animate-pulse"></span>
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[#0071E3] font-bold">10:30 – 12:10 น. (คาบถัดไป)</span>
                <span className="text-[11px] font-semibold bg-[#0071E3] text-white px-2 py-0.5 rounded-full">
                  ห้องปฏิบัติการ 402
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#1D1D1F] mt-1">
                ฟิสิกส์ 3 (ว32201) · ดร. สมบูรณ์ พรประเสริฐ
              </h4>
              <p className="text-xs text-[#6E6E73] mt-0.5">
                ปฏิบัติการทดลองเพนดูลัมอย่างง่าย · ตรวจสอบผลการแกว่งและเตรียมส่งรายงาน
              </p>
            </div>

            {/* Step 4: Deadline Alert */}
            <div className="relative p-3.5 rounded-2xl bg-red-50/70 border border-red-200">
              <span className="absolute -left-[30px] top-4 w-3.5 h-3.5 rounded-full bg-[#DC2626] ring-4 ring-white"></span>
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[#DC2626] font-bold">16:30 น. (เส้นตายส่งงาน)</span>
                <span className="text-[11px] font-semibold bg-[#DC2626] text-white px-2 py-0.5 rounded-full">
                  ด่วนที่สุด
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#1D1D1F] mt-1">
                กำหนดส่ง: แล็บรีพอร์ต การแกว่งของเพนดูลัม (20 คะแนน)
              </h4>
              <p className="text-xs text-[#DC2626] mt-0.5">
                * ต้องแนบรูปภาพฮอตลิงก์หรือรูปถ่ายตารางผลการทดลองก่อนหมดเวลา
              </p>
            </div>

            {/* Step 5 */}
            <div className="relative">
              <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-black/40 ring-4 ring-white"></span>
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[#1D1D1F] font-semibold">17:00 – 19:00 น.</span>
                <span className="text-[11px] text-[#6E6E73]">การบ้านภาคค่ำ</span>
              </div>
              <p className="text-xs font-semibold text-[#1D1D1F] mt-0.5">
                ทำแบบฝึกหัดเมทริกซ์ 4.2 หน้า 84-86 (กำหนดส่งพรุ่งนี้ 23:59 น.)
              </p>
            </div>
          </div>
        </div>

        {/* Right Col: Personal Checklist & Daily Study Notes */}
        <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ListTodo className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1D1D1F]">
                    บันทึกสิ่งที่ต้องทำ (Daily Checklist)
                  </h3>
                  <p className="text-[11px] text-[#6E6E73]">
                    ทำเสร็จแล้ว {customTodos.filter((t) => t.done).length} / {customTodos.length} รายการ
                  </p>
                </div>
              </div>
            </div>

            {/* Todo List */}
            <div className="space-y-2 mt-4">
              {customTodos.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleTodo(item.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                    item.done
                      ? 'bg-slate-50 border-black/5 opacity-70'
                      : 'bg-white border-black/10 hover:border-[#0071E3] shadow-xs'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-md mt-0.5 flex items-center justify-center transition-colors shrink-0 ${
                      item.done ? 'bg-emerald-600 text-white' : 'border border-black/20'
                    }`}
                  >
                    {item.done && <Check className="w-3 h-3" />}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-xs ${
                        item.done ? 'line-through text-[#86868B]' : 'text-[#1D1D1F] font-medium'
                      }`}
                    >
                      {item.text}
                    </p>
                    <span className="text-[10px] text-[#86868B]">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Todo Input */}
            <form onSubmit={handleAddTodo} className="mt-3 flex items-center gap-1.5">
              <input
                type="text"
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                placeholder="+ เพิ่มโน้ตภาระงาน..."
                className="flex-1 px-3 py-1.5 rounded-xl bg-black/[0.03] border border-black/10 text-xs text-[#1D1D1F] outline-none focus:bg-white focus:border-[#0071E3]"
              />
              <button
                type="submit"
                className="p-1.5 rounded-xl bg-[#0071E3] hover:bg-[#005bb5] text-white shadow-xs"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Quick jump to submit */}
          <div className="pt-4 border-t border-black/[0.06] space-y-2">
            <button
              onClick={onNavigateToAssignments}
              className="w-full py-2.5 px-3 rounded-xl bg-[#0071E3] hover:bg-[#005bb5] text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>ไปยังหน้าส่งงาน & แนบฮอตลิงก์รูปภาพ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
