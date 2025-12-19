
export interface ParsedStudent {
  id: string;
  originalLine: string;
  ad: string;
  soyad: string;
  ataAdi: string;
  isNomresi: string;
  mekteb: string;
  sinif: string;
  dil: string;
  variant: string;
  bolme: string;
  sinfinAdi: string;
  cins: string;
  qrup: string;
  fullAnswerString: string;
  subjects: Record<string, string>;
  isValid: boolean;
  error?: string;
}

export interface SubjectConfig {
    id: string;
    name: string;
    length: number;
    points: number;
    color: string;
}

// Reusable definitions for subjects
const SUB_AZ = { id: 'azDili', name: 'Azərbaycan dili', color: 'bg-blue-100 text-blue-900' };
const SUB_MATH = { id: 'riyaziyyat', name: 'Riyaziyyat', color: 'bg-red-100 text-red-900' };
const SUB_LIFE = { id: 'heyatBilgisi', name: 'Həyat Bilgisi', color: 'bg-green-100 text-green-900' };
const SUB_LOGIC = { id: 'mentiq', name: 'Məntiq', color: 'bg-purple-100 text-purple-900' };
const SUB_ENG = { id: 'xariciDil', name: 'Xarici Dil', color: 'bg-orange-100 text-orange-900' };
const SUB_HIST = { id: 'tarix', name: 'Tarix', color: 'bg-yellow-100 text-yellow-900' };
const SUB_GEO = { id: 'cografiya', name: 'Coğrafiya', color: 'bg-cyan-100 text-cyan-900' };
const SUB_PHYS = { id: 'fizika', name: 'Fizika', color: 'bg-slate-200 text-slate-900' };
const SUB_CHEM = { id: 'kimya', name: 'Kimya', color: 'bg-pink-100 text-pink-900' };
const SUB_BIO = { id: 'bialogiya', name: 'Bialogiya', color: 'bg-lime-100 text-lime-900' };

export const CLASS_CONFIGS: Record<string, SubjectConfig[]> = {
    // 1ci sinif
    '01': [
        { ...SUB_AZ, length: 15, points: 12 },
        { ...SUB_MATH, length: 15, points: 12 },
        { ...SUB_LIFE, length: 10, points: 12 },
        { ...SUB_LOGIC, length: 10, points: 10 },
        { ...SUB_ENG, length: 10, points: 12 },
    ],
    // 2-4cu sinif (Same structure)
    '02': [
        { ...SUB_AZ, length: 20, points: 10 },
        { ...SUB_MATH, length: 20, points: 10 },
        { ...SUB_LIFE, length: 10, points: 10 },
        { ...SUB_LOGIC, length: 10, points: 10 },
        { ...SUB_ENG, length: 10, points: 10 },
    ],
    // 5ci sinif
    '05': [
        { ...SUB_AZ, length: 20, points: 10 },
        { ...SUB_MATH, length: 20, points: 10 },
        { ...SUB_LOGIC, length: 10, points: 10 },
        { ...SUB_HIST, length: 10, points: 10 },
        { ...SUB_ENG, length: 10, points: 10 },
    ],
    // 6ci sinif
    '06': [
        { ...SUB_AZ, length: 20, points: 9 },
        { ...SUB_MATH, length: 20, points: 9 },
        { ...SUB_LOGIC, length: 10, points: 7 },
        { ...SUB_HIST, length: 10, points: 9 },
        { ...SUB_GEO, length: 10, points: 9 },
        { ...SUB_ENG, length: 10, points: 9 },
    ],
    // 7-8ci sinif (Same structure)
    '07': [
        { ...SUB_AZ, length: 20, points: 7 },
        { ...SUB_MATH, length: 20, points: 7 },
        { ...SUB_PHYS, length: 10, points: 7 },
        { ...SUB_CHEM, length: 10, points: 7 },
        { ...SUB_BIO, length: 10, points: 7 },
        { ...SUB_HIST, length: 10, points: 7 },
        { ...SUB_GEO, length: 10, points: 7 },
        { ...SUB_ENG, length: 10, points: 7 },
    ],
};

// Copy references for '03', '04', '08' 
CLASS_CONFIGS['03'] = CLASS_CONFIGS['02']; // Same as 2
CLASS_CONFIGS['04'] = CLASS_CONFIGS['02']; // Same as 2 (also 4)
CLASS_CONFIGS['08'] = CLASS_CONFIGS['07']; // Same as 7

// Also support single digit '1' for robustness if needed, 
// though the parser produces '01'.
CLASS_CONFIGS['1'] = CLASS_CONFIGS['01'];
CLASS_CONFIGS['2'] = CLASS_CONFIGS['02'];
CLASS_CONFIGS['3'] = CLASS_CONFIGS['03'];
CLASS_CONFIGS['4'] = CLASS_CONFIGS['04'];
CLASS_CONFIGS['5'] = CLASS_CONFIGS['05'];
CLASS_CONFIGS['6'] = CLASS_CONFIGS['06'];
CLASS_CONFIGS['7'] = CLASS_CONFIGS['07'];
CLASS_CONFIGS['8'] = CLASS_CONFIGS['08'];

export const DEFAULT_SUBJECT_CONFIG: SubjectConfig[] = CLASS_CONFIGS['02']; // Default to Grade 2 config as a fallback

export const parseOMRData = (rawText: string, configMap: Record<string, SubjectConfig[]> = { 'default': DEFAULT_SUBJECT_CONFIG }): ParsedStudent[] => {
  // 1. Clean the text: remove '`' noise
  const cleanText = rawText.replace(/`/g, '');
  
  // 2. Split into lines
  let lines = cleanText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

  // 3. Merge broken lines (Heuristic)
  const mergedLines: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    let currentLine = lines[i];
    if (currentLine.length < 80 && i + 1 < lines.length) {
      currentLine += lines[i+1];
      i++;
    }
    mergedLines.push(currentLine);
  }

  // 4. Parse each line
  return mergedLines.map((line, index) => {
    try {
      if (line.length < 60) {
        return createErrorRecord(line, "Line too short to contain valid headers");
      }

      // 0-based slices based on the provided image schema
      // 1. Ad: 1-14 (0-14)
      const ad = line.slice(0, 14).trim();
      // 2. Soyad: 15-28 (14-28)
      const soyad = line.slice(14, 28).trim();
      // 3. Ata adı: 29-43 (28-43)
      const ataAdi = line.slice(28, 43).trim();
      // 4. İş nömrəsi: 44-48 (43-48)
      const isNomresi = line.slice(43, 48).trim();
      // 5. Məktəb: 49-51 (48-51)
      const mekteb = line.slice(48, 51).trim();
      // 6. Sinif: 52-53 (51-53)
      const sinif = line.slice(51, 53).trim();
      // 7. Dil: 54-54 (53-54)
      const dil = line.slice(53, 54).trim();
      // 8. Variant: 55-55 (54-55)
      const variant = line.slice(54, 55).trim();
      // 9. Bölmə: 56-56 (55-56)
      const bolme = line.slice(55, 56).trim();
      // 10. Sinfin adı: 57-57 (56-57)
      const sinfinAdi = line.slice(56, 57).trim();
      // 11. Cins: 58-58 (57-58)
      const cins = line.slice(57, 58).trim();
      // 12. Qrup: 59-59 (58-59)
      const qrup = line.slice(58, 59).trim();

      // Answer string starts at 59 (Index verification confirmed)
      let answerString = line.slice(59);
      
      if (answerString.length < 70) {
        answerString = answerString.padEnd(70, ' ');
      }

      // Dynamic Slicing based on Class Config
      const subjects: Record<string, string> = {};
      // Fallback to 'default' if specific class config doesn't exist. 
      // Also try to match numeric part of class if possible, but exact match is safer for now.
      const activeConfig = configMap[sinif] || configMap['default'] || DEFAULT_SUBJECT_CONFIG;
      
      let currentIndex = 0;
      
      for (const subject of activeConfig) {
          subjects[subject.id] = answerString.slice(currentIndex, currentIndex + subject.length);
          currentIndex += subject.length;
      }

      if (!isNomresi) {
         return createErrorRecord(line, "Missing Student ID (İş nömrəsi)");
      }

      return {
        id: crypto.randomUUID(),
        originalLine: line,
        ad,
        soyad,
        ataAdi,
        isNomresi,
        mekteb,
        sinif,
        dil,
        variant,
        bolme,
        sinfinAdi,
        cins,
        qrup,
        fullAnswerString: answerString,
        subjects,
        isValid: true
      };

    } catch (e) {
      return createErrorRecord(line, "Parsing failed due to unexpected error");
    }
  });
};

function createErrorRecord(line: string, errorMsg: string): ParsedStudent {
  return {
    id: crypto.randomUUID(),
    originalLine: line,
    ad: '', soyad: '', ataAdi: '', isNomresi: '', mekteb: '', sinif: '', dil: '', variant: '', bolme: '', sinfinAdi: '', cins: '', qrup: '',
    fullAnswerString: '',
    subjects: {},
    isValid: false,
    error: errorMsg
  };
}
