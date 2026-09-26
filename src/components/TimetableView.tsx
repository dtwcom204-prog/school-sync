import React, { useState } from 'react';
import { TimetablePeriod } from '../types';
import { weeklyTimetable } from '../data/mockData';
import { Calendar, Clock, MapPin, User, BookOpen, Sparkles } from 'lucide-react';

export const TimetableView: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<'จันทร์' | 'อังคาร' | 'พุธ' | 'พฤหัสบดี' | 'ศุกร์'>('พุธ');

  const days: Array<'จันทร์' | 'อังคาร' | 'พุธ' | 'พฤหัสบดี' | 'ศุกร์'> = [
    'จันทร์',
    'อังคาร',
    'พุธ',
    'พฤหัสบดี',
    'ศุกร์',
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#6E6E73] font-medium mb-1">
            <span>ตารางเรียนและแผนการใช้ห้องเรียน</span>
            <span>•</span>
            <span className="text-[#0071E3]">ภาคเรียนที่ 1/2567</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
            ตารางเรียนประจำสัปดาห์ (ม.5/1)
          </h1>
        </div>

        {/* Day selector */}
        <div className="flex items-center gap-1 p-1 bg-black/[0.04] rounded-xl overflow-x-auto self-start sm:self-auto">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                selectedDay === day
                  ? 'bg-white text-[#0071E3] shadow-xs font-semibold'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              วัน{day}
            </button>
          ))}
        </div>
      </div>

      {/* Timetable List Grid */}
      <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-black/[0.06] pb-3 text-xs text-[#6E6E73]">
          <span className="font-semibold text-[#1D1D1F]">
            ตารางเรียนวัน{selectedDay} (8 คาบเรียน)
          </span>
          <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            ขณะนี้กำลังเริ่ม คาบที่ 4 (10:30 – 11:20 น.)
          </span>
        </div>

        <div className="space-y-3">
          {weeklyTimetable.map((period) => {
            const isCurrent = period.period === 4;
            const isBreak = period.subjectCode === 'พักเบรก' || period.subjectCode === 'พักเที่ยง';

            if (isBreak) {
              return (
                <div
                  key={period.period}
                  className="py-2.5 px-4 rounded-xl bg-black/[0.02] border border-black/[0.04] flex items-center justify-between text-xs text-[#86868B]"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] font-semibold">คาบ {period.period}</span>
                    <span className="font-medium">{period.subjectName}</span>
                  </div>
                  <span className="font-mono text-[11px]">{period.time}</span>
                </div>
              );
            }

            return (
              <div
                key={period.period}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isCurrent
                    ? 'bg-blue-50/70 border-blue-200 ring-2 ring-[#0071E3]/20 shadow-xs'
                    : 'bg-white border-black/[0.06] hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                      isCurrent
                        ? 'bg-[#0071E3] text-white'
                        : 'bg-black/[0.04] text-[#1D1D1F]'
                    }`}
                  >
                    {period.period}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#0071E3]">
                        {period.subjectCode}
                      </span>
                      <span className="text-xs font-bold text-[#1D1D1F]">
                        {period.subjectName}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-semibold bg-[#0071E3] text-white px-2 py-0.5 rounded-full">
                          กำลังเรียน
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#6E6E73] mt-0.5">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {period.teacher}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#0071E3]" />
                        {period.room}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="font-mono text-[#86868B] font-medium">{period.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
