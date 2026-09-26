import React, { useState, useEffect } from 'react';
import { HotlinkedImage } from '../types';
import { 
  Image as ImageIcon, 
  Code, 
  ExternalLink, 
  Check, 
  Copy, 
  Sparkles, 
  AlertCircle, 
  X,
  FileCheck
} from 'lucide-react';

interface ImageHotlinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertImage: (image: HotlinkedImage) => void;
  title?: string;
  description?: string;
}

export const ImageHotlinkModal: React.FC<ImageHotlinkModalProps> = ({
  isOpen,
  onClose,
  onInsertImage,
  title = 'เครื่องมือฮอตลิงก์รูปภาพจาก HTML / URL',
  description = 'วางโค้ด <img src="..."> หรือ URL ของรูปภาพ เพื่อพรีวิวและแนบเข้ากับงานได้อย่างรวดเร็ว'
}) => {
  const [rawInput, setRawInput] = useState('');
  const [extractedUrl, setExtractedUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [sourceType, setSourceType] = useState<'raw_url' | 'html_tag'>('raw_url');
  const [imageLoaded, setImageLoaded] = useState<boolean | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Preset educational hotlinks for instant 1-click testing
  const presets = [
    {
      label: 'แล็บเพนดูลัม (ฟิสิกส์)',
      html: '<img src="https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=800&q=80" alt="การทดลองเพนดูลัม" />',
      caption: 'ภาพชุดการทดลองลูกตุ้มเพนดูลัมในห้องแล็บ'
    },
    {
      label: 'สมุดการบ้านเมทริกซ์',
      html: '<img src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80" alt="แบบฝึกหัดเมทริกซ์ 4.2" />',
      caption: 'หน้าสมุดแสดงวิธีทำดีเทอร์มิแนนต์และอินเวิร์สเมทริกซ์'
    },
    {
      label: 'สมดุลเคมี เลอชาเตอลิเย',
      html: '<img src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80" alt="หลอดทดลองสมดุลเคมี" />',
      caption: 'ภาพการเปลี่ยนสีสารละลายเมื่อรบกวนสมดุล'
    },
    {
      label: 'ไดอะแกรมเซลล์ชีววิทยา',
      html: '<img src="https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80" alt="ท่อลำเลียงไซเลมและโฟลเอ็ม" />',
      caption: 'ภาพตัดขวางโครงสร้างลำต้นพืชภายใต้กล้องจุลทรรศน์'
    }
  ];

  // Parse HTML input or raw URL
  useEffect(() => {
    if (!rawInput.trim()) {
      setExtractedUrl('');
      setImageLoaded(null);
      return;
    }

    const trimmed = rawInput.trim();
    // Check if it contains <img ... src="..." ...>
    const imgTagMatch = trimmed.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
    const altMatch = trimmed.match(/alt=["']([^"']+)["']/i);

    if (imgTagMatch && imgTagMatch[1]) {
      setExtractedUrl(imgTagMatch[1]);
      setSourceType('html_tag');
      if (altMatch && altMatch[1] && !caption) {
        setCaption(altMatch[1]);
      }
    } else if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      setExtractedUrl(trimmed);
      setSourceType('raw_url');
    } else {
      // Maybe markdown ![alt](url)
      const mdMatch = trimmed.match(/!\[(.*?)\]\((.*?)\)/);
      if (mdMatch && mdMatch[2]) {
        setExtractedUrl(mdMatch[2]);
        setSourceType('html_tag');
        if (mdMatch[1] && !caption) setCaption(mdMatch[1]);
      } else {
        setExtractedUrl(trimmed);
        setSourceType('raw_url');
      }
    }
    setImageLoaded(null);
  }, [rawInput]);

  const handleApplyPreset = (preset: typeof presets[0]) => {
    setRawInput(preset.html);
    setCaption(preset.caption);
  };

  const handleInsert = () => {
    if (!extractedUrl) return;
    const hotlink: HotlinkedImage = {
      id: `hl-${Date.now()}`,
      url: extractedUrl,
      caption: caption || 'รูปภาพฮอตลิงก์ประกอบงาน',
      sourceType,
      originalHtml: rawInput,
      timestamp: new Date().toLocaleString('th-TH')
    };
    onInsertImage(hotlink);
    onClose();
    // Reset
    setRawInput('');
    setCaption('');
  };

  const copyEmbedCode = () => {
    if (!extractedUrl) return;
    const code = `<img src="${extractedUrl}" alt="${caption || 'งานส่งนักเรียน'}" class="rounded-xl shadow-xs max-w-full" />`;
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-2xl border border-black/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-black/[0.06] flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1D1D1F]">{title}</h3>
              <p className="text-[11px] text-[#6E6E73]">{description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/[0.05] text-[#86868B] hover:text-[#1D1D1F] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Quick Presets */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-[#1D1D1F] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#0071E3]" />
                เลือกรูปภาพทดสอบแบบรวดเร็ว (Sample Hotlinks):
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="px-2.5 py-1 rounded-lg text-[11px] bg-black/[0.04] hover:bg-[#0071E3] hover:text-white text-[#1D1D1F] transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#1D1D1F] flex items-center justify-between">
              <span>โค้ด HTML รูปภาพ (&lt;img src="..." /&gt;) หรือ URL รูปภาพ:</span>
              <span className="text-[11px] font-normal text-[#86868B]">
                {sourceType === 'html_tag' ? 'ตรวจพบ: HTML <img> tag' : 'ตรวจพบ: Raw URL'}
              </span>
            </label>
            <textarea
              rows={3}
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder='เช่น <img src="https://example.com/homework-photo.jpg" alt="การบ้านวิชาฟิสิกส์" /> หรือ https://images.unsplash.com/...'
              className="w-full p-3 rounded-xl bg-black/[0.02] border border-black/10 focus:border-[#0071E3] focus:bg-white text-xs font-mono text-[#1D1D1F] focus:ring-2 focus:ring-[#0071E3]/20 outline-none transition-all resize-none"
            />
          </div>

          {/* Caption */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#1D1D1F]">
              คำอธิบายภาพ / หมายเหตุ (Caption):
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="เช่น ภาพถ่ายสมุดการบ้านหน้า 85 ข้อ 3 หรือ กราฟแสดงผลการทดลอง"
              className="w-full px-3 py-2 rounded-xl bg-black/[0.02] border border-black/10 focus:border-[#0071E3] focus:bg-white text-xs text-[#1D1D1F] focus:ring-2 focus:ring-[#0071E3]/20 outline-none transition-all"
            />
          </div>

          {/* Extracted URL & Live Preview */}
          {extractedUrl && (
            <div className="space-y-2 pt-2 border-t border-black/[0.06]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#1D1D1F]">ตัวอย่างพรีวิวภาพฮอตลิงก์จริง (Live Preview):</span>
                <button
                  type="button"
                  onClick={copyEmbedCode}
                  className="flex items-center gap-1 text-[11px] text-[#0071E3] hover:underline"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'คัดลอกโค้ด HTML แล้ว' : 'คัดลอกโค้ด HTML Embed'}</span>
                </button>
              </div>

              <div className="relative rounded-2xl border border-black/10 bg-slate-50 overflow-hidden min-h-[160px] flex flex-col items-center justify-center p-3 text-center">
                <img
                  src={extractedUrl}
                  alt={caption || 'Preview'}
                  referrerPolicy="no-referrer"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageLoaded(false)}
                  className="max-h-60 max-w-full rounded-xl object-contain shadow-xs transition-opacity duration-200"
                />

                {imageLoaded === false && (
                  <div className="p-4 flex flex-col items-center text-[#DC2626] text-xs">
                    <AlertCircle className="w-6 h-6 mb-1" />
                    <span>ไม่สามารถโหลดรูปภาพจาก URL นี้ได้ กรุณาตรวจสอบลิงก์หรือสิทธิ์การเข้าถึง</span>
                  </div>
                )}

                {caption && (
                  <p className="text-[11px] text-[#6E6E73] mt-2 italic">
                    "{caption}"
                  </p>
                )}
              </div>

              {/* Technical inspect details */}
              <div className="p-2.5 rounded-xl bg-black/[0.03] text-[11px] text-[#6E6E73] font-mono break-all flex items-start gap-2">
                <Code className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#0071E3]" />
                <div className="flex-1">
                  <span>URL: {extractedUrl}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-black/[0.06] bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-black/[0.04]"
          >
            ยกเลิก
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!extractedUrl}
              onClick={handleInsert}
              className="px-5 py-2 rounded-xl bg-[#0071E3] hover:bg-[#005bb5] disabled:opacity-50 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
            >
              <FileCheck className="w-4 h-4" />
              <span>แทรกรูปภาพนี้ลงในงาน</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
