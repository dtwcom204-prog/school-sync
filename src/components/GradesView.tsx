import React, { useState } from 'react';
import { SubjectGrade, UserProfile } from '../types';
import { 
  BarChart3, 
  FileDown, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles, 
  Calendar, 
  BookOpen, 
  GraduationCap, 
  Printer, 
  X,
  Share2
} from 'lucide-react';

interface GradesViewProps {
  currentUser: UserProfile;
  grades: SubjectGrade[];
  onOpenAdvisorChat: () => void;
}

export const GradesView: React.FC<GradesViewProps> = ({
  currentUser,
  grades,
  onOpenAdvisorChat,
}) => {
  const [activeTab, setActiveTab] = useState<'my_score' | 'benchmark' | 'history'>('my_score');
  const [showAllSubjects, setShowAllSubjects] = useState(false);
  const [showReportCardModal, setShowReportCardModal] = useState(false);

  const displayedGrades = showAllSubjects ? grades : grades.slice(0, 3);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Cloud Sync Status bar (matching Image 2) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#6E6E73] bg-white rounded-2xl px-4 py-2 border border-black/[0.04]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>
            อัปเดตล่าสุดเมื่อ 14:20 น. (ว32203 ฟิสิกส์ 3: สอบกลางภาค อัปโหลดสำเร็จ)
          </span>
        </div>
        <div className="flex items-center gap-2 text-[#86868B]">
          <span>CloudKit ซิงค์สมบูรณ์</span>
          <span>·</span>
          <button
            onClick={() => alert('บันทึกประวัติผลการเรียนย้อนหลังซิงค์ไปยังฐานข้อมูลกลางเรียบร้อย')}
            className="text-[#0071E3] hover:underline font-medium"
          >
            ดูประวัติ
          </button>
        </div>
      </div>

      {/* Breadcrumb & Main Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs text-[#6E6E73] font-medium mb-1">
            ระบบผลการเรียน / มัธยมศึกษาปีที่ 5 ภาคเรียนที่ 1
          </p>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
              คะแนนเก็บ & วิเคราะห์พัฒนาการ
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-200/60">
              ● ผ่านเกณฑ์เกียรตินิยม
            </span>
          </div>
        </div>

        {/* Action Buttons (matching Image 2) */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="p-1 bg-black/[0.04] rounded-xl flex items-center gap-1">
            <button
              onClick={() => setActiveTab('my_score')}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                activeTab === 'my_score'
                  ? 'bg-white text-[#1D1D1F] shadow-xs font-semibold'
                  : 'text-[#6E6E73]'
              }`}
            >
              คะแนนของฉัน
            </button>
            <button
              onClick={() => setActiveTab('benchmark')}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                activeTab === 'benchmark'
                  ? 'bg-white text-[#1D1D1F] shadow-xs font-semibold'
                  : 'text-[#6E6E73]'
              }`}
            >
              เปรียบเทียบมาตรฐาน
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                activeTab === 'history'
                  ? 'bg-white text-[#1D1D1F] shadow-xs font-semibold'
                  : 'text-[#6E6E73]'
              }`}
            >
              ประวัติย้อนหลัง
            </button>
          </div>

          <button
            onClick={() => setShowReportCardModal(true)}
            className="px-3.5 py-2 rounded-xl bg-white border border-black/10 hover:border-[#0071E3] text-[#1D1D1F] hover:text-[#0071E3] text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
          >
            <FileDown className="w-3.5 h-3.5 text-[#0071E3]" />
            <span>เอกสาร ปพ.6 (PDF)</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Tiles (matching Image 2) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: GPAX */}
        <div className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#6E6E73] font-medium">GPAX สะสมปัจจุบัน</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[11px]">
              +0.12 จาก ม.4
            </span>
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#1D1D1F] font-mono tabular-nums">
              3.84
            </span>
            <span className="text-xs text-[#86868B]">/ 4.00</span>
          </div>
          <div className="pt-2 border-t border-black/[0.04] text-[11px] text-[#6E6E73] flex justify-between">
            <span>ผลการประเมิน:</span>
            <span className="font-semibold text-[#1D1D1F]">เกรด 4 รวม 6 วิชา</span>
          </div>
        </div>

        {/* Stat 2: คะแนนเก็บสะสมเฉลี่ย */}
        <div className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#6E6E73] font-medium">คะแนนเก็บสะสมเฉลี่ย</span>
            <span className="text-[11px] text-[#6E6E73]">เป้าหมาย 85%</span>
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#0071E3] font-mono tabular-nums">
              88.5%
            </span>
          </div>
          <div className="pt-2 border-t border-black/[0.04] text-[11px] text-[#6E6E73] flex justify-between">
            <span>การส่งงาน:</span>
            <span className="font-semibold text-emerald-700">ตรงเวลา 100%</span>
          </div>
        </div>

        {/* Stat 3: หน่วยกิตสะสมเทอมนี้ */}
        <div className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#6E6E73] font-medium">หน่วยกิตสะสมเทอมนี้</span>
            <span className="text-[11px] text-[#6E6E73]">แกนกลาง</span>
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#1D1D1F] font-mono tabular-nums">
              16.5
            </span>
            <span className="text-xs text-[#86868B]">/ 16.5 นก.</span>
          </div>
          <div className="pt-2 border-t border-black/[0.04] text-[11px] text-[#6E6E73] flex justify-between">
            <span>ชั่วโมงเรียน:</span>
            <span className="font-semibold text-[#1D1D1F]">ครบตามเกณฑ์ สพฐ.</span>
          </div>
        </div>

        {/* Stat 4: ลำดับเปอร์เซ็นไทล์ */}
        <div className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#6E6E73] font-medium">ลำดับเปอร์เซ็นไทล์</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0071E3] font-semibold text-[11px]">
              Top 5%
            </span>
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#1D1D1F] font-mono tabular-nums">
              95th
            </span>
          </div>
          <div className="pt-2 border-t border-black/[0.04] text-[11px] text-[#6E6E73] flex justify-between">
            <span>กลุ่มเปรียบเทียบ:</span>
            <span className="font-semibold text-[#1D1D1F]">ระดับชั้น ม.5 (450 คน)</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Assessment View (matching Image 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 Cols): ตารางคะแนนเก็บรายวิชา */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-black/[0.06] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#1D1D1F]">ตารางคะแนนเก็บรายวิชา</h3>
              <p className="text-xs text-[#6E6E73]">แสดงรายละเอียดการประเมินย่อยและงานปฏิบัติการ</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#6E6E73]">
              <span className="px-2 py-1 bg-black/[0.03] rounded-lg">ทุกหมวดวิชา</span>
            </div>
          </div>

          {/* Subject score cards */}
          <div className="space-y-4">
            {displayedGrades.map((subject) => (
              <div
                key={subject.code}
                className="p-5 rounded-2xl border border-black/[0.06] bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all"
              >
                {/* Subject Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#0071E3] flex items-center justify-center font-bold text-xs">
                      {subject.name.substring(0, 1)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#1D1D1F]">{subject.name}</h4>
                        <span className="text-xs text-[#86868B]">{subject.code}</span>
                        <span className="text-xs text-[#86868B]">· {subject.credits} หน่วยกิต</span>
                      </div>
                      <p className="text-[11px] text-[#6E6E73]">{subject.teacher}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-baseline justify-end gap-1">
                      <span className="text-xl font-extrabold text-[#1D1D1F] font-mono tabular-nums">
                        {subject.currentScore}
                      </span>
                      <span className="text-xs text-[#86868B]">/ {subject.maxScore}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 flex items-center justify-end gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      เกรด {subject.predictedGrade} {subject.isHonor ? '(คาดการณ์)' : ''}
                    </span>
                  </div>
                </div>

                {/* 4 Score Pills Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-black/[0.04]">
                  {/* Assessment 1 */}
                  <div className="p-2.5 rounded-xl bg-white border border-black/[0.04] text-center">
                    <p className="text-[10px] text-[#86868B] truncate">สอบย่อย 1</p>
                    <p className="font-mono font-bold text-xs text-[#1D1D1F] mt-0.5">
                      {subject.assessments.quiz1.score} / {subject.assessments.quiz1.max}
                    </p>
                    <span className="text-[10px] text-emerald-600 font-medium">100%</span>
                  </div>

                  {/* Assessment 2 */}
                  <div className="p-2.5 rounded-xl bg-white border border-black/[0.04] text-center">
                    <p className="text-[10px] text-[#86868B] truncate">ใบงาน / สมุดงาน</p>
                    <p className="font-mono font-bold text-xs text-[#1D1D1F] mt-0.5">
                      {subject.assessments.worksheet.score} / {subject.assessments.worksheet.max}
                    </p>
                    <span className="text-[10px] text-emerald-600 font-medium">90%</span>
                  </div>

                  {/* Assessment 3 */}
                  <div className="p-2.5 rounded-xl bg-white border border-black/[0.04] text-center">
                    <p className="text-[10px] text-[#86868B] truncate">สอบกลางภาค</p>
                    <p className="font-mono font-bold text-xs text-[#1D1D1F] mt-0.5">
                      {subject.assessments.midterm.score} / {subject.assessments.midterm.max}
                    </p>
                    <span className="text-[10px] text-emerald-600 font-medium">93.3%</span>
                  </div>

                  {/* Assessment 4 */}
                  <div className="p-2.5 rounded-xl bg-white border border-black/[0.04] text-center">
                    <p className="text-[10px] text-[#86868B] truncate">จิตพิสัย / ความประพฤติ</p>
                    <p className="font-mono font-bold text-xs text-[#1D1D1F] mt-0.5">
                      {subject.assessments.behavior.score} / {subject.assessments.behavior.max}
                    </p>
                    <span className="text-[10px] text-[#86868B]">รอประเมิน</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Toggle More Subjects */}
          <div className="pt-2 text-center">
            <button
              onClick={() => setShowAllSubjects(!showAllSubjects)}
              className="text-xs font-semibold text-[#0071E3] hover:underline"
            >
              {showAllSubjects
                ? 'ย่อรายการวิชา'
                : `ดูรายวิชาเพิ่มเติมอีก ${grades.length - 3} วิชา ∨`}
            </button>
          </div>
        </div>

        {/* Right Column (4 Cols): Radar Skill Analytics & Domain Breakdown */}
        <div className="lg:col-span-4 space-y-6">
          {/* Radar Chart Component (matching Image 2) */}
          <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#1D1D1F]">วิเคราะห์ทักษะรอบด้าน</h3>
                <p className="text-[11px] text-[#6E6E73]">สมรรถนะเทียบเกณฑ์มาตรฐานระดับประเทศ</p>
              </div>
              <Sparkles className="w-4 h-4 text-[#0071E3]" />
            </div>

            {/* SVG Radar Visualization */}
            <div className="relative py-2 flex items-center justify-center">
              <svg viewBox="0 0 240 220" className="w-full max-w-[220px]">
                {/* Concentric Polygons */}
                <polygon
                  points="120,20 215,85 180,185 60,185 25,85"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="1"
                />
                <polygon
                  points="120,50 185,95 160,165 80,165 55,95"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="1"
                />
                <polygon
                  points="120,80 155,105 140,145 100,145 85,105"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="1"
                />
                {/* Axes */}
                <line x1="120" y1="110" x2="120" y2="20" stroke="#CBD5E1" strokeWidth="1" />
                <line x1="120" y1="110" x2="215" y2="85" stroke="#CBD5E1" strokeWidth="1" />
                <line x1="120" y1="110" x2="180" y2="185" stroke="#CBD5E1" strokeWidth="1" />
                <line x1="120" y1="110" x2="60" y2="185" stroke="#CBD5E1" strokeWidth="1" />
                <line x1="120" y1="110" x2="25" y2="85" stroke="#CBD5E1" strokeWidth="1" />

                {/* Student Score Polygon */}
                <polygon
                  points="120,28 208,92 165,172 75,170 38,92"
                  fill="rgba(0, 113, 227, 0.22)"
                  stroke="#0071E3"
                  strokeWidth="2"
                />

                {/* Vertex Points */}
                <circle cx="120" cy="28" r="3.5" fill="#0071E3" />
                <circle cx="208" cy="92" r="3.5" fill="#0071E3" />
                <circle cx="165" cy="172" r="3.5" fill="#0071E3" />
                <circle cx="75" cy="170" r="3.5" fill="#0071E3" />
                <circle cx="38" cy="92" r="3.5" fill="#0071E3" />

                {/* Labels */}
                <text x="120" y="14" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1D1D1F">
                  STEM (94%)
                </text>
                <text x="215" y="80" textAnchor="start" fontSize="9" fontWeight="bold" fill="#1D1D1F">
                  ภาษา (92%)
                </text>
                <text x="180" y="198" textAnchor="middle" fontSize="9" fill="#6E6E73">
                  สังคม (82%)
                </text>
                <text x="60" y="198" textAnchor="middle" fontSize="9" fill="#6E6E73">
                  สุขศึกษา (84%)
                </text>
                <text x="20" y="80" textAnchor="end" fontSize="9" fill="#6E6E73">
                  ศิลปะ (88%)
                </text>
              </svg>
            </div>

            {/* Strengths & Growth Areas */}
            <div className="space-y-2 text-xs pt-2 border-t border-black/[0.04]">
              <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-emerald-800">จุดเด่น:</span>
                  <p className="text-emerald-700 text-[11px] leading-tight">
                    ทักษะฟิสิกส์เชิงคำนวณและ STEM สูงกว่าค่าเฉลี่ยระดับประเทศ
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[#0071E3] mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-[#0071E3]">โอกาสพัฒนา:</span>
                  <p className="text-[#414753] text-[11px] leading-tight">
                    การเขียนวิเคราะห์เชิงประวัติศาสตร์สามารถพัฒนาเพิ่มเติมได้
                  </p>
                </div>
              </div>
            </div>

            {/* Subject Group Bars */}
            <div className="space-y-2.5 pt-2 border-t border-black/[0.04] text-xs">
              <div className="flex items-center justify-between text-[#1D1D1F]">
                <span className="font-semibold">สัดส่วนคะแนนตามกลุ่มสาระ</span>
                <span className="text-[11px] text-[#86868B]">เป้าหมาย 80+</span>
              </div>

              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span>วิทยาศาสตร์และเทคโนโลยี</span>
                    <span className="font-mono font-bold text-[#0071E3]">89.2% (3.90)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-black/[0.06]">
                    <div className="h-full rounded-full bg-[#0071E3]" style={{ width: '89.2%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span>คณิตศาสตร์</span>
                    <span className="font-mono font-bold text-[#0071E3]">88.5% (3.85)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-black/[0.06]">
                    <div className="h-full rounded-full bg-purple-600" style={{ width: '88.5%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span>ภาษาต่างประเทศ</span>
                    <span className="font-mono font-bold text-emerald-600">94.0% (4.00)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-black/[0.06]">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: '94%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span>สังคมศึกษาและประวัติศาสตร์</span>
                    <span className="font-mono font-bold text-amber-600">82.0% (3.50)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-black/[0.06]">
                    <div className="h-full rounded-full bg-amber-500" style={{ width: '82%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Advisor Meeting action */}
            <div className="pt-2">
              <button
                onClick={onOpenAdvisorChat}
                className="w-full py-2.5 px-4 rounded-xl bg-black/[0.03] hover:bg-black/[0.06] text-[#1D1D1F] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <Calendar className="w-3.5 h-3.5 text-[#0071E3]" />
                <span>ขอนัดพบอาจารย์ที่ปรึกษา</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ปพ.6 PDF Report Card Modal */}
      {showReportCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-2xl border border-black/10 shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-4">
              <div>
                <span className="text-[11px] text-[#0071E3] font-semibold">
                  แบบรายงานผลการพัฒนาคุณภาพผู้เรียนรายบุคคล
                </span>
                <h3 className="text-base font-bold text-[#1D1D1F]">
                  เอกสาร ปพ.6: ภาคเรียนที่ 1 ปีการศึกษา 2567
                </h3>
              </div>
              <button
                onClick={() => setShowReportCardModal(false)}
                className="p-1 rounded-full text-[#86868B] hover:text-[#1D1D1F]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Official Report Card Body */}
            <div className="p-6 bg-slate-50/80 rounded-2xl border border-black/10 space-y-4 text-xs">
              <div className="text-center space-y-0.5 border-b border-black/10 pb-3">
                <p className="font-bold text-sm text-[#1D1D1F]">โรงเรียนดอนตาลวิทยา</p>
                <p className="text-[11px] text-[#6E6E73]">
                  สำนักงานเขตพื้นที่การศึกษามัธยมศึกษา มุกดาหาร
                </p>
                <p className="text-[11px] font-semibold text-[#1D1D1F]">
                  ชื่อ-สกุล: นายวรเมธ วิริยพาณิชย์ · เลขประจำตัว: 54892 · ชั้น ม.5/1 เลขที่ 14
                </p>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-black/10 text-[11px] text-[#6E6E73]">
                      <th className="py-1.5 font-semibold">รหัสวิชา</th>
                      <th className="py-1.5 font-semibold">ชื่อรายวิชา</th>
                      <th className="py-1.5 font-semibold text-center">นก.</th>
                      <th className="py-1.5 font-semibold text-center">คะแนน</th>
                      <th className="py-1.5 font-semibold text-center">ระดับผลการเรียน</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 text-xs">
                    {grades.map((g) => (
                      <tr key={g.code}>
                        <td className="py-2 font-mono text-[#86868B]">{g.code}</td>
                        <td className="py-2 font-medium text-[#1D1D1F]">{g.name}</td>
                        <td className="py-2 text-center tabular-nums">{g.credits}</td>
                        <td className="py-2 text-center tabular-nums font-bold text-[#0071E3]">
                          {g.currentScore}
                        </td>
                        <td className="py-2 text-center font-bold text-emerald-700">
                          {g.predictedGrade}.0
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Bottom */}
              <div className="pt-3 border-t border-black/10 flex items-center justify-between text-xs font-semibold">
                <span>จำนวนหน่วยกิตสะสม: 16.5 นก.</span>
                <span className="text-[#0071E3] font-bold text-sm">
                  ระดับผลการเรียนเฉลี่ย (GPAX): 3.84
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => alert('ส่งออกไฟล์ PDF ปพ.6 เอกสารทางการเรียบร้อย')}
                className="px-4 py-2 rounded-xl bg-black/[0.04] text-[#1D1D1F] text-xs font-semibold hover:bg-black/[0.08] flex items-center gap-1.5"
              >
                <FileDown className="w-4 h-4" />
                <span>บันทึกเป็น PDF</span>
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-[#0071E3] text-white text-xs font-semibold hover:bg-[#005bb5] flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>พิมพ์เอกสาร ปพ.6</span>
                </button>
                <button
                  onClick={() => setShowReportCardModal(false)}
                  className="px-4 py-2 rounded-xl bg-black/[0.04] text-[#6E6E73] text-xs font-medium"
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
