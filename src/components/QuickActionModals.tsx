import React, { useState } from 'react';
import { Assignment, HotlinkedImage, UserProfile } from '../types';
import { 
  X, 
  UploadCloud, 
  Image as ImageIcon, 
  CheckCircle2, 
  QrCode, 
  Calendar, 
  MessageSquare, 
  Send, 
  FileText, 
  ExternalLink,
  Clock,
  Sparkles
} from 'lucide-react';
import { ImageHotlinkModal } from './ImageHotlinkModal';

interface QuickSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignments: Assignment[];
  onSubmit: (assignmentId: string, textAnswer: string, images: HotlinkedImage[]) => void;
}

export const QuickSubmitModal: React.FC<QuickSubmitModalProps> = ({
  isOpen,
  onClose,
  assignments,
  onSubmit,
}) => {
  const pendingAssignments = assignments.filter((a) => a.status === 'pending');
  const [selectedId, setSelectedId] = useState(pendingAssignments[0]?.id || '');
  const [textAnswer, setTextAnswer] = useState('');
  const [attachedImages, setAttachedImages] = useState<HotlinkedImage[]>([]);
  const [isHotlinkOpen, setIsHotlinkOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const currentAssignment = assignments.find((a) => a.id === selectedId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) return;

    onSubmit(selectedId, textAnswer, attachedImages);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
      setTextAnswer('');
      setAttachedImages([]);
    }, 1200);
  };

  const handleAddHotlinkImage = (img: HotlinkedImage) => {
    setAttachedImages((prev) => [...prev, img]);
  };

  const handleRemoveImage = (id: string) => {
    setAttachedImages((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
        <div className="bg-white rounded-3xl w-full max-w-lg border border-black/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="px-6 py-4 border-b border-black/[0.06] flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center">
                <UploadCloud className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1D1D1F]">ส่งงานด่วน (Quick Submit)</h3>
                <p className="text-[11px] text-[#6E6E73]">อัปโหลดไฟล์ หรือ แนบฮอตลิงก์รูปภาพสมุดงาน</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-black/[0.05] text-[#86868B] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
            {isSubmitted ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-[#1D1D1F]">ส่งงานเรียบร้อยแล้ว!</h4>
                <p className="text-xs text-[#6E6E73]">
                  ระบบได้บันทึกการส่งงานและส่งแจ้งเตือนไปยังครูผู้สอนเรียบร้อย
                </p>
              </div>
            ) : (
              <>
                {/* Select Assignment */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#1D1D1F]">
                    เลือกภาระงานที่ต้องการส่ง:
                  </label>
                  <select
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/[0.02] border border-black/10 focus:border-[#0071E3] focus:bg-white text-xs text-[#1D1D1F] outline-none"
                  >
                    {pendingAssignments.map((a) => (
                      <option key={a.id} value={a.id}>
                        [{a.subjectCode}] {a.title} ({a.dueTime})
                      </option>
                    ))}
                    {pendingAssignments.length === 0 && (
                      <option value="">ไม่มีงานค้างส่งในขณะนี้</option>
                    )}
                  </select>
                </div>

                {/* Details pill */}
                {currentAssignment && (
                  <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-[#1D1D1F] space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-[#0071E3] font-medium">
                      <span>{currentAssignment.subjectName} · {currentAssignment.teacherName}</span>
                      <span>กำหนดส่ง: {currentAssignment.dueTime}</span>
                    </div>
                    <p className="text-[11px] text-[#6E6E73] line-clamp-2">
                      {currentAssignment.description}
                    </p>
                  </div>
                )}

                {/* Text answer */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#1D1D1F]">
                    คำตอบ / สรุปผลการทำงาน:
                  </label>
                  <textarea
                    rows={3}
                    value={textAnswer}
                    onChange={(e) => setTextAnswer(e.target.value)}
                    placeholder="เขียนสรุปคำตอบ หรือระบุข้อมูลเพิ่มเติมสำหรับการตรวจ..."
                    className="w-full p-3 rounded-xl bg-black/[0.02] border border-black/10 focus:border-[#0071E3] focus:bg-white text-xs text-[#1D1D1F] outline-none resize-none"
                  />
                </div>

                {/* Attached Hotlink Images */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#1D1D1F]">
                      รูปภาพแนบประกอบงาน (ฮอตลิงก์รูปภาพ):
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsHotlinkOpen(true)}
                      className="flex items-center gap-1 text-[11px] text-[#0071E3] font-medium hover:underline"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>+ ฮอตลิงก์รูปภาพจาก HTML / URL</span>
                    </button>
                  </div>

                  {attachedImages.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {attachedImages.map((img) => (
                        <div
                          key={img.id}
                          className="relative rounded-xl border border-black/10 bg-slate-50 p-1.5 group overflow-hidden"
                        >
                          <img
                            src={img.url}
                            alt={img.caption || 'แนบงาน'}
                            referrerPolicy="no-referrer"
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <p className="text-[10px] text-[#6E6E73] truncate mt-1 px-1">
                            {img.caption || 'รูปภาพฮอตลิงก์'}
                          </p>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(img.id)}
                            className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      onClick={() => setIsHotlinkOpen(true)}
                      className="p-4 rounded-xl border-2 border-dashed border-black/10 hover:border-[#0071E3] bg-black/[0.01] hover:bg-blue-50/30 text-center cursor-pointer transition-all"
                    >
                      <ImageIcon className="w-6 h-6 text-[#86868B] mx-auto mb-1" />
                      <p className="text-xs font-medium text-[#1D1D1F]">
                        คลิกเพื่อวางโค้ด &lt;img src="..." /&gt; หรือ URL
                      </p>
                      <p className="text-[11px] text-[#86868B] mt-0.5">
                        ระบบจะดึงรูปภาพฮอตลิงก์มาแสดงให้ครูตรวจได้ทันที ไม่ต้องเปลืองพื้นที่ไฟล์
                      </p>
                    </div>
                  )}
                </div>

                {/* Submit action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={!selectedId}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#0071E3] hover:bg-[#005bb5] disabled:opacity-50 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>ยืนยันการส่งงานเข้าระบบ</span>
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>

      <ImageHotlinkModal
        isOpen={isHotlinkOpen}
        onClose={() => setIsHotlinkOpen(false)}
        onInsertImage={handleAddHotlinkImage}
      />
    </>
  );
};

interface QRCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
}

export const QRCheckInModal: React.FC<QRCheckInModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const [checkedIn, setCheckedIn] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-sm border border-black/10 shadow-2xl p-6 text-center">
        <div className="flex items-center justify-between mb-4">
          <div className="text-left">
            <h3 className="text-base font-bold text-[#1D1D1F]">เช็คอินเข้าเรียน (QR Check-in)</h3>
            <p className="text-xs text-[#6E6E73]">คาบที่ 4: ฟิสิกส์ 3 (ว32201) · อาคาร 4 ห้อง 421</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-black/5 text-[#86868B]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {checkedIn ? (
          <div className="py-6 space-y-2">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-sm font-bold text-[#1D1D1F]">เช็คชื่อเข้าเรียนสำเร็จ!</h4>
            <p className="text-xs text-[#6E6E73]">
              เวลา 10:31 น. (ตรงเวลา) · บันทึกลงสมุดประจำชั้นของ ดร. สมบูรณ์ พรประเสริฐ
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-1.5 rounded-xl bg-[#0071E3] text-white text-xs font-semibold"
            >
              ตกลง
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-black/5 flex flex-col items-center">
              <div className="w-40 h-40 bg-white p-3 rounded-xl border border-black/10 shadow-inner flex items-center justify-center">
                <QrCode className="w-32 h-32 text-[#0071E3] animate-pulse" />
              </div>
              <p className="text-[11px] font-mono text-[#86868B] mt-2">
                ATTEND-PHY3-ROOM421-20260926
              </p>
            </div>
            <p className="text-xs text-[#6E6E73]">
              นำอุปกรณ์หรือบัตรนักเรียนแตะกับเครื่องสแกนหน้าห้องเรียน หรือกดปุ่มด้านล่างเพื่อจำลองการเช็คอิน
            </p>
            <button
              onClick={() => setCheckedIn(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-[#0071E3] hover:bg-[#005bb5] text-white text-xs font-semibold shadow-xs"
            >
              สแกนเช็คชื่อคาบนี้ทันที
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface LeaveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
}

export const LeaveRequestModal: React.FC<LeaveRequestModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const [leaveType, setLeaveType] = useState('sick');
  const [startDate, setStartDate] = useState('2026-09-27');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-md border border-black/10 shadow-2xl p-6">
        <div className="flex items-center justify-between mb-4 border-b border-black/[0.06] pb-3">
          <div>
            <h3 className="text-base font-bold text-[#1D1D1F]">ยื่นใบลาอิเล็กทรอนิกส์ (E-Leave)</h3>
            <p className="text-xs text-[#6E6E73]">ส่งตรงถึงครูประจำชั้น ม.5/1</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-black/5 text-[#86868B]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-bold text-[#1D1D1F]">ยื่นใบลาสำเร็จ!</h4>
            <p className="text-xs text-[#6E6E73]">ใบลาส่งถึงครูประจำชั้นและบันทึกลงระบบงานทะเบียนแล้ว</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">ประเภทการลา:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLeaveType('sick')}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                    leaveType === 'sick'
                      ? 'border-[#0071E3] bg-[#0071E3]/10 text-[#0071E3] font-semibold'
                      : 'border-black/10 text-[#6E6E73]'
                  }`}
                >
                  ลาป่วย (Sick Leave)
                </button>
                <button
                  type="button"
                  onClick={() => setLeaveType('personal')}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                    leaveType === 'personal'
                      ? 'border-[#0071E3] bg-[#0071E3]/10 text-[#0071E3] font-semibold'
                      : 'border-black/10 text-[#6E6E73]'
                  }`}
                >
                  ลากิจ (Personal Leave)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">วันที่ลา:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/[0.02] border border-black/10 text-xs text-[#1D1D1F] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">เหตุผลการลา:</label>
              <textarea
                rows={2}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="เช่น มีไข้สูง ปวดศีรษะ พบแพทย์ที่ รพ.ดอนตาล..."
                className="w-full p-2.5 rounded-xl bg-black/[0.02] border border-black/10 text-xs text-[#1D1D1F] outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#0071E3] hover:bg-[#005bb5] text-white text-xs font-semibold shadow-xs"
            >
              ส่งใบลาให้คุณครูอนุมัติ
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

interface AdvisorChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
}

export const AdvisorChatModal: React.FC<AdvisorChatModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const [messages, setMessages] = useState([
    {
      sender: 'ครูศศิธร (ที่ปรึกษา ม.5/1)',
      text: 'สวัสดีค่ะวรเมธ วันนี้อย่าลืมส่งแล็บรีพอร์ตฟิสิกส์ 3 ของ ดร. สมบูรณ์ ก่อน 16:30 น. นะคะ มีข้อสงสัยเรื่องบทเรียนสอบถามครูได้เลยค่ะ',
      time: '08:45 น.',
      isMe: false,
    },
  ]);
  const [inputVal, setInputVal] = useState('');

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg = {
      sender: currentUser.thaiName,
      text: inputVal,
      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.',
      isMe: true,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ครูศศิธร (ที่ปรึกษา ม.5/1)',
          text: 'รับทราบค่ะ ครูได้รับข้อความแล้ว จะตรวจดูข้อมูลในระบบ SchoolSync ให้นะคะ',
          time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.',
          isMe: false,
        },
      ]);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-md border border-black/10 shadow-2xl flex flex-col h-[520px] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-black/[0.06] bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#0071E3] text-white flex items-center justify-center font-bold text-xs">
              ศ
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1D1D1F]">แชตครูประจำชั้น (ครูศศิธร สุขสมบัติ)</h4>
              <span className="text-[10px] text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                ออนไลน์ในระบบ
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-black/5 text-[#86868B]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F5F5F7]/40">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.isMe ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                  m.isMe
                    ? 'bg-[#0071E3] text-white rounded-br-xs'
                    : 'bg-white text-[#1D1D1F] border border-black/5 shadow-xs rounded-bl-xs'
                }`}
              >
                {!m.isMe && (
                  <p className="text-[10px] font-semibold text-[#0071E3] mb-0.5">{m.sender}</p>
                )}
                <p>{m.text}</p>
              </div>
              <span className="text-[10px] text-[#86868B] mt-1 px-1">{m.time}</span>
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-3 border-t border-black/[0.06] bg-white flex items-center gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="พิมพ์ข้อความถึงคุณครู..."
            className="flex-1 px-3 py-2 rounded-xl bg-black/[0.03] border border-black/10 focus:border-[#0071E3] focus:bg-white text-xs text-[#1D1D1F] outline-none"
          />
          <button
            type="submit"
            className="p-2 rounded-xl bg-[#0071E3] hover:bg-[#005bb5] text-white shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
