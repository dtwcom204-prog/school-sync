/**
 * Artistic Avatars modeled after origami and minimalist pop-art illustrations
 * High-fidelity vector data URLs rendering circular badge avatars
 */

export interface ArtisticAvatar {
  id: string;
  name: string;
  category: 'origami' | 'food' | 'lifestyle';
  dataUrl: string;
}

const encodeSvg = (svgString: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
};

export const artisticAvatars: ArtisticAvatar[] = [
  // ROW 1: Origami Animals
  {
    id: 'origami-cat',
    name: 'แมวพับกระดาษ (Origami Cat)',
    category: 'origami',
    dataUrl: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="100" fill="#D2DCF2"/>
        <path d="M0,140 Q100,165 200,140 L200,200 L0,200 Z" fill="#69C8BE"/>
        <path d="M85,155 L95,75 L115,85 L125,155 Z" fill="#C9B89D"/>
        <path d="M95,75 L80,38 L100,52 Z" fill="#6C584C"/>
        <path d="M100,52 L120,38 L115,85 Z" fill="#8C7A6B"/>
        <polygon points="95,75 110,65 115,85 102,95" fill="#DDD0BC"/>
        <polygon points="98,90 106,82 108,98" fill="#584538"/>
        <path d="M120,155 L160,158 L145,150 Z" fill="#3D3A45"/>
        <polygon points="85,155 95,115 105,155" fill="#B3A286"/>
      </svg>
    `)
  },
  {
    id: 'origami-dog',
    name: 'สุนัขชิบะพับกระดาษ (Origami Shiba)',
    category: 'origami',
    dataUrl: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="100" fill="#FFF275"/>
        <path d="M0,150 L200,150 L200,200 L0,200 Z" fill="#E8DEC4"/>
        <polygon points="70,145 60,65 100,60 135,100 130,145" fill="#D36135"/>
        <polygon points="60,65 45,40 75,45" fill="#F4845F"/>
        <polygon points="75,45 100,35 100,60" fill="#E05725"/>
        <polygon points="50,75 40,85 65,85" fill="#F7EDE2"/>
        <polygon points="70,145 80,120 90,145" fill="#F7EDE2"/>
        <polygon points="120,145 125,125 135,145" fill="#B2451E"/>
        <polygon points="135,100 155,90 145,115" fill="#F4845F"/>
        <circle cx="68" cy="62" r="3" fill="#2E1C14"/>
      </svg>
    `)
  },
  {
    id: 'origami-dragon',
    name: 'มังกรเขียวพับกระดาษ (Origami Dragon)',
    category: 'origami',
    dataUrl: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="100" fill="#E8ECED"/>
        <ellipse cx="120" cy="155" rx="40" ry="12" fill="#CAD2D4"/>
        <polygon points="68,85 90,105 135,150 95,150 70,120" fill="#285943"/>
        <polygon points="68,85 60,82 55,95 72,98" fill="#3D7E5F"/>
        <polygon points="72,98 85,115 88,145 78,145" fill="#1C3F2F"/>
        <polygon points="90,105 130,85 115,120" fill="#4AA377"/>
        <polygon points="130,85 150,70 140,95" fill="#5FBE8E"/>
        <polygon points="100,125 135,120 140,150" fill="#234E3A"/>
      </svg>
    `)
  },
  {
    id: 'origami-elephant',
    name: 'ช้างน้ำเงินพับกระดาษ (Origami Elephant)',
    category: 'origami',
    dataUrl: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="100" fill="#F8A5C2"/>
        <path d="M0,150 L200,150 L200,200 L0,200 Z" fill="#E5829D"/>
        <polygon points="75,85 110,65 140,85 150,145 80,145" fill="#185ADB"/>
        <polygon points="75,85 55,95 62,115 78,105" fill="#0A369D"/>
        <polygon points="62,115 50,110 55,100" fill="#3877FF"/>
        <polygon points="90,145 95,120 105,145" fill="#051C60"/>
        <polygon points="130,145 135,115 145,145" fill="#0E3D9E"/>
        <polygon points="75,85 105,95 88,125" fill="#2869EB"/>
      </svg>
    `)
  },
  {
    id: 'origami-fox',
    name: 'จิ้งจอกพับกระดาษ (Origami Fox)',
    category: 'origami',
    dataUrl: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="100" fill="#FCD5CE"/>
        <ellipse cx="105" cy="155" rx="35" ry="10" fill="#DDBEA9"/>
        <polygon points="90,55 125,55 145,100 135,150 85,150" fill="#D9480F"/>
        <polygon points="90,55 75,35 100,45" fill="#F76707"/>
        <polygon points="125,55 145,35 120,45" fill="#E8590C"/>
        <polygon points="90,55 110,85 85,95" fill="#FD7E14"/>
        <polygon points="110,85 115,100 100,105" fill="#FFFFFF"/>
        <polygon points="85,95 100,105 78,120" fill="#FFA94D"/>
        <polygon points="135,150 155,120 140,110" fill="#F76707"/>
      </svg>
    `)
  },

  // ROW 2: More Origami
  {
    id: 'origami-panda',
    name: 'แพนด้าพับกระดาษ (Origami Panda)',
    category: 'origami',
    dataUrl: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="100" fill="#B388EB"/>
        <polygon points="75,55 60,40 70,68" fill="#212529"/>
        <polygon points="125,55 140,40 130,68" fill="#212529"/>
        <polygon points="70,68 100,50 130,68 125,110 100,125 75,110" fill="#F8F9FA"/>
        <polygon points="80,78 90,82 85,92" fill="#212529"/>
        <polygon points="120,78 110,82 115,92" fill="#212529"/>
        <polygon points="96,98 104,98 100,105" fill="#212529"/>
        <polygon points="70,115 65,155 85,155 90,130" fill="#343A40"/>
        <polygon points="130,115 135,155 115,155 110,130" fill="#343A40"/>
        <polygon points="90,130 100,125 110,130 100,155" fill="#E9ECEF"/>
      </svg>
    `)
  },
  {
    id: 'origami-penguin',
    name: 'เพนกวินพับกระดาษ (Origami Penguin)',
    category: 'origami',
    dataUrl: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="100" fill="#F7A072"/>
        <path d="M0,145 L200,145 L200,200 L0,200 Z" fill="#90E0EF"/>
        <polygon points="90,60 115,60 130,150 80,150" fill="#2B2D42"/>
        <polygon points="90,60 100,75 115,60" fill="#EDF2F4"/>
        <polygon points="100,75 108,75 104,82" fill="#FFB703"/>
        <polygon points="80,95 104,90 100,150 85,150" fill="#EDF2F4"/>
        <polygon points="130,95 104,90 100,150 115,150" fill="#FFFFFF"/>
        <polygon points="75,95 85,90 80,135" fill="#1C1E2E"/>
        <polygon points="135,95 125,90 130,135" fill="#1C1E2E"/>
        <ellipse cx="65" cy="120" rx="15" ry="30" fill="#1C1E2E" opacity="0.3" transform="rotate(-20 65 120)"/>
      </svg>
    `)
  },
  {
    id: 'origami-butterfly',
    name: 'ผีเสื้อพับกระดาษ (Origami Butterfly)',
    category: 'origami',
    dataUrl: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="100" fill="#2E7FF4"/>
        <polygon points="100,95 100,135 70,120" fill="#D90429"/>
        <polygon points="100,95 100,135 130,120" fill="#EF233C"/>
        <polygon points="100,95 50,60 70,115" fill="#FF4D6D"/>
        <polygon points="100,95 150,60 130,115" fill="#FF758F"/>
        <polygon points="100,95 65,75 85,100" fill="#C9184A"/>
        <polygon points="100,95 135,75 115,100" fill="#A4133C"/>
        <line x1="100" y1="90" x2="100" y2="135" stroke="#590D22" stroke-width="3"/>
      </svg>
    `)
  },
  {
    id: 'origami-rabbit',
    name: 'กระต่ายพับกระดาษชมพู (Origami Bunny)',
    category: 'origami',
    dataUrl: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="100" fill="#00C9A7"/>
        <polygon points="85,65 75,30 95,50" fill="#FF85A1"/>
        <polygon points="95,65 115,35 105,55" fill="#FF99C8"/>
        <polygon points="85,65 105,65 115,90 95,100 80,85" fill="#FFCCD5"/>
        <polygon points="95,100 125,120 115,150 80,150 70,125" fill="#FF758F"/>
        <polygon points="115,120 135,130 125,150" fill="#FF4D6D"/>
        <polygon points="80,150 75,135 65,150" fill="#FFB3C1"/>
        <circle cx="92" cy="78" r="2.5" fill="#590D22"/>
      </svg>
    `)
  },
  {
    id: 'origami-unicorn',
    name: 'ยูนิคอร์นบนสายรุ้ง (Origami Unicorn)',
    category: 'origami',
    dataUrl: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="100" fill="#F0F3F4"/>
        <path d="M40,110 A70,70 0 0,1 175,90" fill="none" stroke="#68D8D6" stroke-width="8"/>
        <path d="M45,103 A70,70 0 0,1 170,83" fill="none" stroke="#FFBC42" stroke-width="8"/>
        <path d="M50,96 A70,70 0 0,1 165,76" fill="none" stroke="#FF5A5F" stroke-width="8"/>
        <polygon points="65,95 80,80 95,105 85,120" fill="#EAEAEA"/>
        <polygon points="65,95 50,75 60,90" fill="#FFD166"/>
        <polygon points="85,120 135,115 145,145 95,145" fill="#D8D8D8"/>
        <polygon points="90,145 85,160 95,160" fill="#C0C0C0"/>
        <polygon points="135,145 145,160 135,160" fill="#B0B0B0"/>
      </svg>
    `)
  },

  // ROW 3: Objects, Food & Sports
  {
    id: 'art-bicycle',
    name: 'จักรยานสีน้ำเงิน (City Bicycle)',
    category: 'lifestyle',
    dataUrl: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="100" fill="#6C9AEC"/>
        <circle cx="58" cy="125" r="24" fill="none" stroke="#FFFFFF" stroke-width="6"/>
        <circle cx="58" cy="125" r="21" fill="none" stroke="#F97316" stroke-width="2"/>
        <circle cx="58" cy="125" r="8" fill="#1D2A44"/>
        <circle cx="142" cy="125" r="24" fill="none" stroke="#FFFFFF" stroke-width="6"/>
        <circle cx="142" cy="125" r="21" fill="none" stroke="#F97316" stroke-width="2"/>
        <circle cx="142" cy="125" r="8" fill="#1D2A44"/>
        <polyline points="58,125 90,125 115,95 78,95 58,125" fill="none" stroke="#FFFFFF" stroke-width="5"/>
        <line x1="90" y1="125" x2="80" y2="82" stroke="#FFFFFF" stroke-width="5"/>
        <rect x="70" y="80" width="22" height="6" rx="3" fill="#1D2A44"/>
        <line x1="142" y1="125" x2="128" y2="80" stroke="#FFFFFF" stroke-width="5"/>
        <rect x="120" y="75" width="18" height="12" rx="2" fill="#F97316"/>
        <line x1="122" y1="75" x2="138" y2="75" stroke="#FFFFFF" stroke-width="4"/>
      </svg>
    `)
  },
  {
    id: 'art-red-bird',
    name: 'นกโรบินแดง (Minimal Red Bird)',
    category: 'origami',
    dataUrl: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="100" fill="#D3D3E8"/>
        <line x1="98" y1="130" x2="98" y2="155" stroke="#FFFFFF" stroke-width="4"/>
        <line x1="90" y1="155" x2="106" y2="155" stroke="#FFFFFF" stroke-width="4"/>
        <ellipse cx="98" cy="110" rx="30" ry="22" fill="#E63946"/>
        <circle cx="78" cy="95" r="15" fill="#E63946"/>
        <polygon points="65,95 52,98 65,102" fill="#F4A261"/>
        <ellipse cx="115" cy="118" rx="20" ry="9" fill="#D90429" transform="rotate(25 115 118)"/>
        <polygon points="120,118 145,130 135,138" fill="#BA181B"/>
        <circle cx="75" cy="92" r="2.5" fill="#1D1D1F"/>
      </svg>
    `)
  },
  {
    id: 'art-cheese',
    name: 'สวิสชีสสีทอง (Swiss Cheese)',
    category: 'food',
    dataUrl: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="100" fill="#A370F7"/>
        <polygon points="60,135 155,120 135,70 60,110" fill="#FFCA3A"/>
        <polygon points="60,110 135,70 120,60 50,95" fill="#FFE082"/>
        <polygon points="50,95 60,110 60,135 50,120" fill="#FFB703"/>
        <circle cx="95" cy="115" r="7" fill="#F77F00"/>
        <circle cx="125" cy="105" r="5" fill="#F77F00"/>
        <circle cx="80" cy="125" r="4" fill="#F77F00"/>
        <circle cx="130" cy="85" r="6" fill="#F77F00"/>
      </svg>
    `)
  },
  {
    id: 'art-rugby',
    name: 'ลูกอเมริกันฟุตบอล (Football)',
    category: 'lifestyle',
    dataUrl: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="100" fill="#E5F0A4"/>
        <path d="M100,45 C145,70 145,130 100,155 C55,130 55,70 100,45 Z" fill="#D9381E"/>
        <path d="M100,45 C125,70 125,130 100,155" fill="#B72710"/>
        <line x1="100" y1="65" x2="100" y2="135" stroke="#FFFFFF" stroke-width="4"/>
        <line x1="90" y1="85" x2="110" y2="85" stroke="#FFFFFF" stroke-width="3"/>
        <line x1="88" y1="100" x2="112" y2="100" stroke="#FFFFFF" stroke-width="3"/>
        <line x1="90" y1="115" x2="110" y2="115" stroke="#FFFFFF" stroke-width="3"/>
      </svg>
    `)
  },
  {
    id: 'art-ramen',
    name: 'ราเมนญี่ปุ่น (Japanese Ramen)',
    category: 'food',
    dataUrl: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="100" fill="#20C997"/>
        <ellipse cx="100" cy="115" rx="55" ry="35" fill="#FFFFFF"/>
        <ellipse cx="100" cy="108" rx="50" ry="25" fill="#FFEAA7"/>
        <rect x="75" y="80" width="12" height="25" rx="2" fill="#1E272C"/>
        <rect x="90" y="75" width="12" height="25" rx="2" fill="#1E272C"/>
        <ellipse cx="120" cy="105" rx="14" ry="10" fill="#FFFFFF"/>
        <circle cx="120" cy="105" r="6" fill="#FFA502"/>
        <circle cx="85" cy="115" r="4" fill="#FF4757"/>
        <circle cx="105" cy="118" r="3" fill="#2ED573"/>
      </svg>
    `)
  },

  // ROW 4: Pop Culture & Japanese Items
  {
    id: 'art-sushi',
    name: 'เซตซูชิและมากิ (Sushi Set)',
    category: 'food',
    dataUrl: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="100" fill="#48CAE4"/>
        <circle cx="65" cy="110" r="22" fill="#1D2A44"/>
        <circle cx="65" cy="110" r="16" fill="#F8F9FA"/>
        <circle cx="65" cy="110" r="7" fill="#E63946"/>
        <circle cx="105" cy="95" r="20" fill="#1D2A44"/>
        <circle cx="105" cy="95" r="14" fill="#F8F9FA"/>
        <circle cx="105" cy="95" r="6" fill="#FFB703"/>
        <rect x="90" y="118" width="55" height="20" rx="10" fill="#F8F9FA"/>
        <path d="M85,122 C95,110 145,110 155,122 C145,130 95,130 85,122 Z" fill="#FF4D6D"/>
        <line x1="88" y1="120" x2="152" y2="120" stroke="#FFFFFF" stroke-width="2" opacity="0.6"/>
      </svg>
    `)
  },
  {
    id: 'art-tamagotchi',
    name: 'ทามาก็อตจิเรโทร (Tamagotchi)',
    category: 'lifestyle',
    dataUrl: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="100" fill="#FF6B6B"/>
        <ellipse cx="100" cy="112" rx="42" ry="48" fill="#FFD166"/>
        <rect x="75" y="85" width="50" height="42" rx="8" fill="#F8F9FA"/>
        <rect x="80" y="90" width="40" height="32" rx="4" fill="#C7F9CC"/>
        <rect x="94" y="100" width="12" height="12" fill="#2D6A4F"/>
        <circle cx="85" cy="138" r="4.5" fill="#EF476F"/>
        <circle cx="100" cy="142" r="4.5" fill="#EF476F"/>
        <circle cx="115" cy="138" r="4.5" fill="#EF476F"/>
        <path d="M100,55 L100,68" stroke="#FFE66D" stroke-width="5" stroke-linecap="round"/>
        <circle cx="100" cy="50" r="6" fill="none" stroke="#FFE66D" stroke-width="3"/>
      </svg>
    `)
  },
  {
    id: 'art-vinyl',
    name: 'แผ่นเสียงไวนิล (Retro Vinyl)',
    category: 'lifestyle',
    dataUrl: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="100" fill="#A8DADC"/>
        <circle cx="100" cy="100" r="62" fill="#111111"/>
        <circle cx="100" cy="100" r="52" fill="none" stroke="#222222" stroke-width="2"/>
        <circle cx="100" cy="100" r="42" fill="none" stroke="#2B2B2B" stroke-width="1.5"/>
        <circle cx="100" cy="100" r="32" fill="none" stroke="#222222" stroke-width="2"/>
        <circle cx="100" cy="100" r="22" fill="#FF4D6D"/>
        <circle cx="100" cy="100" r="12" fill="#FFB703"/>
        <circle cx="100" cy="100" r="4" fill="#FFFFFF"/>
      </svg>
    `)
  },
  {
    id: 'art-avocado',
    name: 'อะโวคาโดสด (Fresh Avocado)',
    category: 'food',
    dataUrl: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="100" fill="#9D4EDD"/>
        <path d="M100,55 C120,55 138,80 138,115 C138,145 120,160 100,160 C80,160 62,145 62,115 C62,80 80,55 100,55 Z" fill="#2D6A4F"/>
        <path d="M100,60 C116,60 130,82 130,113 C130,140 116,153 100,153 C84,153 70,140 70,113 C70,82 84,60 100,60 Z" fill="#D8F3DC"/>
        <ellipse cx="100" cy="120" rx="18" ry="20" fill="#6F4E37"/>
        <ellipse cx="96" cy="115" rx="5" ry="7" fill="#8B5E3C"/>
      </svg>
    `)
  },
  {
    id: 'art-smile',
    name: 'ไอคอนรอยยิ้มแฮปปี้ (Happy Smile)',
    category: 'lifestyle',
    dataUrl: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="100" fill="#FFFFFF"/>
        <circle cx="100" cy="100" r="68" fill="#FF5722"/>
        <path d="M68,95 Q100,145 132,95 Q100,115 68,95 Z" fill="#FFFFFF"/>
      </svg>
    `)
  },

  // ROW 5: Sweets & Snacks
  {
    id: 'art-sugar-ice',
    name: 'ก้อนน้ำแข็งไซบีเรียน (Ice Cubes)',
    category: 'lifestyle',
    dataUrl: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="100" fill="#38BDF8"/>
        <rect x="75" y="65" width="40" height="40" rx="8" fill="#FFFFFF" transform="rotate(15 95 85)"/>
        <rect x="95" y="100" width="38" height="38" rx="8" fill="#E0F2FE" transform="rotate(-10 114 119)"/>
      </svg>
    `)
  },
  {
    id: 'art-watermelon',
    name: 'แตงโมฉ่ำหวาน (Watermelon Slice)',
    category: 'food',
    dataUrl: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="100" fill="#0D9488"/>
        <circle cx="100" cy="100" r="65" fill="#0F766E"/>
        <circle cx="100" cy="100" r="60" fill="#FEE2E2"/>
        <circle cx="100" cy="100" r="52" fill="#EF4444"/>
        <circle cx="90" cy="80" r="2.5" fill="#1F2937"/>
        <circle cx="110" cy="85" r="2.5" fill="#1F2937"/>
        <circle cx="80" cy="105" r="2.5" fill="#1F2937"/>
        <circle cx="100" cy="105" r="2.5" fill="#1F2937"/>
        <circle cx="120" cy="105" r="2.5" fill="#1F2937"/>
        <circle cx="90" cy="125" r="2.5" fill="#1F2937"/>
        <circle cx="110" cy="125" r="2.5" fill="#1F2937"/>
      </svg>
    `)
  },
  {
    id: 'art-onigiri',
    name: 'ข้าวปั้นโอนิกิริ (Onigiri Rice)',
    category: 'food',
    dataUrl: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="100" fill="#FACC15"/>
        <path d="M100,55 C125,55 148,110 142,138 C138,150 115,152 100,152 C85,152 62,150 58,138 C52,110 75,55 100,55 Z" fill="#FFFFFF"/>
        <rect x="85" y="125" width="30" height="28" rx="4" fill="#064E3B"/>
      </svg>
    `)
  },
  {
    id: 'art-pizza',
    name: 'พิซซ่าชีสยืด (Cheesy Pizza)',
    category: 'food',
    dataUrl: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="100" fill="#C084FC"/>
        <line x1="85" y1="50" x2="85" y2="120" stroke="#FEF08A" stroke-width="8" stroke-linecap="round"/>
        <line x1="100" y1="45" x2="100" y2="135" stroke="#FEF08A" stroke-width="8" stroke-linecap="round"/>
        <line x1="115" y1="50" x2="115" y2="120" stroke="#FEF08A" stroke-width="8" stroke-linecap="round"/>
        <path d="M65,130 Q100,165 135,130 L100,75 Z" fill="#F59E0B"/>
        <circle cx="95" cy="120" r="4" fill="#DC2626"/>
        <circle cx="110" cy="130" r="4" fill="#DC2626"/>
        <circle cx="85" cy="135" r="3.5" fill="#DC2626"/>
      </svg>
    `)
  },
  {
    id: 'art-sandwich',
    name: 'แซนวิชผักชีส (Club Sandwich)',
    category: 'food',
    dataUrl: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="100" fill="#3B82F6"/>
        <polygon points="50,140 145,140 145,120 50,120" fill="#EAB308"/>
        <path d="M45,130 C55,138 75,125 90,135 C105,125 125,138 140,128" stroke="#22C55E" stroke-width="7" fill="none"/>
        <polygon points="45,120 140,120 135,110 50,110" fill="#EF4444"/>
        <rect x="65" y="70" width="70" height="70" rx="14" fill="#FEF3C7" transform="rotate(10 100 105)"/>
        <rect x="68" y="73" width="64" height="64" rx="12" fill="#FFFFFF" transform="rotate(10 100 105)"/>
      </svg>
    `)
  }
];
