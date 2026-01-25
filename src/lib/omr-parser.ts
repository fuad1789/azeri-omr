
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


export interface SubjectSegment {
    type: 'closed' | 'numeric' | 'open';
    count: number;
    points: number; // For 'open', this is the weight multiplier
    lengthPerItem: number; // 1 for closed/open, 5 for numeric
}

export interface SubjectConfig {
    id: string;
    name: string;
    color: string;
    segments?: SubjectSegment[]; // New flexible structure
    length?: number; // Legacy support
    points?: number; // Legacy support
}

// Reusable definitions for subjects - Legacy helpers
const SUB_AZ_BASE = { id: 'azDili', name: 'Azərbaycan dili', color: 'bg-blue-100 text-blue-900' };
const SUB_MATH_BASE = { id: 'riyaziyyat', name: 'Riyaziyyat', color: 'bg-red-100 text-red-900' };
const SUB_LIFE_BASE = { id: 'heyatBilgisi', name: 'Həyat Bilgisi', color: 'bg-green-100 text-green-900' };
const SUB_LOGIC_BASE = { id: 'mentiq', name: 'Məntiq', color: 'bg-purple-100 text-purple-900' };
const SUB_ENG_BASE = { id: 'xariciDil', name: 'Xarici Dil', color: 'bg-orange-100 text-orange-900' };
const SUB_HIST_BASE = { id: 'tarix', name: 'Tarix', color: 'bg-yellow-100 text-yellow-900' };
const SUB_GEO_BASE = { id: 'cografiya', name: 'Coğrafiya', color: 'bg-cyan-100 text-cyan-900' };
const SUB_PHYS_BASE = { id: 'fizika', name: 'Fizika', color: 'bg-slate-200 text-slate-900' };
const SUB_CHEM_BASE = { id: 'kimya', name: 'Kimya', color: 'bg-pink-100 text-pink-900' };
const SUB_BIO_BASE = { id: 'bialogiya', name: 'Bialogiya', color: 'bg-lime-100 text-lime-900' };

// Helper to create legacy config easily
const createLegacyConfig = (base: any, length: number, points: number): SubjectConfig => ({
    ...base,
    length,
    points,
    segments: [{ type: 'closed', count: length, points, lengthPerItem: 1 }]
});

export const CLASS_CONFIGS: Record<string, SubjectConfig[]> = {
    // 1ci sinif
    '01': [
        createLegacyConfig(SUB_AZ_BASE, 15, 12),
        createLegacyConfig(SUB_MATH_BASE, 15, 12),
        createLegacyConfig(SUB_LIFE_BASE, 10, 12),
        createLegacyConfig(SUB_LOGIC_BASE, 10, 10),
        createLegacyConfig(SUB_ENG_BASE, 10, 12),
    ],
    // 2-4cu sinif
    '02': [
        createLegacyConfig(SUB_AZ_BASE, 20, 10),
        createLegacyConfig(SUB_MATH_BASE, 20, 10),
        createLegacyConfig(SUB_LIFE_BASE, 10, 10),
        createLegacyConfig(SUB_LOGIC_BASE, 10, 10),
        createLegacyConfig(SUB_ENG_BASE, 10, 10),
    ],
    // 5ci sinif
    '05': [
        createLegacyConfig(SUB_AZ_BASE, 20, 10),
        createLegacyConfig(SUB_MATH_BASE, 20, 10),
        createLegacyConfig(SUB_LOGIC_BASE, 10, 10),
        createLegacyConfig(SUB_HIST_BASE, 10, 10),
        createLegacyConfig(SUB_ENG_BASE, 10, 10),
    ],
    // 6ci sinif
    '06': [
        createLegacyConfig(SUB_AZ_BASE, 20, 9),
        createLegacyConfig(SUB_MATH_BASE, 20, 9),
        createLegacyConfig(SUB_LOGIC_BASE, 10, 7),
        createLegacyConfig(SUB_HIST_BASE, 10, 9),
        createLegacyConfig(SUB_GEO_BASE, 10, 9),
        createLegacyConfig(SUB_ENG_BASE, 10, 9),
    ],
    // 7-8ci sinif (Legacy Fənn İmtahanı)
    '07': [
        createLegacyConfig(SUB_AZ_BASE, 20, 7),
        createLegacyConfig(SUB_MATH_BASE, 20, 7),
        createLegacyConfig(SUB_PHYS_BASE, 10, 7),
        createLegacyConfig(SUB_CHEM_BASE, 10, 7),
        createLegacyConfig(SUB_BIO_BASE, 10, 7),
        createLegacyConfig(SUB_HIST_BASE, 10, 7),
        createLegacyConfig(SUB_GEO_BASE, 10, 7),
        createLegacyConfig(SUB_ENG_BASE, 10, 7),
    ],
};

// Copy references
CLASS_CONFIGS['03'] = CLASS_CONFIGS['02'];
CLASS_CONFIGS['04'] = CLASS_CONFIGS['02'];
CLASS_CONFIGS['08'] = CLASS_CONFIGS['07']; // Default 8 is same as 7 for Fənn

// Single digit support
CLASS_CONFIGS['1'] = CLASS_CONFIGS['01'];
CLASS_CONFIGS['2'] = CLASS_CONFIGS['02'];
CLASS_CONFIGS['3'] = CLASS_CONFIGS['03'];
CLASS_CONFIGS['4'] = CLASS_CONFIGS['04'];
CLASS_CONFIGS['5'] = CLASS_CONFIGS['05'];
CLASS_CONFIGS['6'] = CLASS_CONFIGS['06'];
CLASS_CONFIGS['7'] = CLASS_CONFIGS['07'];
CLASS_CONFIGS['8'] = CLASS_CONFIGS['08'];

// --- BURAXILIS IMTAHANI CONFIGURATIONS ---

// Helper to create Buraxilis configs
const createBuraxilisConfig = (lang: 'az' | 'en' | 'ru'): SubjectConfig[] => [
    { 
        ...SUB_AZ_BASE, 
        // 25 Closed + 10 Open = 35 items
        // Length chars: 25 + 10 = 35 chars
        length: 35, 
        points: 100, // Placeholder
        segments: [
            { type: 'closed', count: 25, points: 2, lengthPerItem: 1 }, 
            { type: 'open', count: 10, points: 5, lengthPerItem: 1 }, 
        ]
    },
    { 
        ...SUB_MATH_BASE, 
        // 15 Closed + 4 Numeric (5 chars) + 5 Open = 24 items
        // Length chars: 15 + (4*5) + 5 = 40 chars
        length: 40,
        points: 100,
        segments: [
            { type: 'closed', count: 15, points: 2, lengthPerItem: 1 },
            { type: 'numeric', count: 4, points: 5, lengthPerItem: 5 },
            { type: 'open', count: 5, points: 10, lengthPerItem: 1 },
        ]
    },
    { 
        ...SUB_ENG_BASE, 
        name: lang === 'ru' ? 'Xarici Dil (Rus)' : 'Xarici Dil (İngilis)',
        // 15 Closed + 3 Numeric (5 chars) + 4 Open = 22 items
        // Length chars: 15 + (3*5) + 4 = 34 chars
        length: 34,
        points: 100,
        segments: [
             { type: 'closed', count: 15, points: 2, lengthPerItem: 1 },
             { type: 'numeric', count: 3, points: 5, lengthPerItem: 5 },
             { type: 'open', count: 4, points: 13.75, lengthPerItem: 1 },
        ]
    }
];

export const BURAXILIS_CONFIGS: Record<string, SubjectConfig[]> = {
    '09': createBuraxilisConfig('en'),
    '10': createBuraxilisConfig('en'),
    '11': createBuraxilisConfig('en'),
    '9': createBuraxilisConfig('en'), // Single digit support
};

export const DEFAULT_SUBJECT_CONFIG: SubjectConfig[] = CLASS_CONFIGS['02']; 

export const parseOMRData = (rawText: string, configMap: Record<string, SubjectConfig[]> = { 'default': DEFAULT_SUBJECT_CONFIG }, parseMode: 'legacy' | 'buraxilis' = 'legacy'): ParsedStudent[] => {
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
      if (line.length < 30) {
        return createErrorRecord(line, "Line too short");
      }

      // Explicit Mode Check
      const isBuraxilis = parseMode === 'buraxilis';

      let student: Partial<ParsedStudent> = {};
      let answerString = "";

      if (!isBuraxilis) {
         // --- LEGACY PARSER ---
        if (line.length < 59) {
             return createErrorRecord(line, "Line too short for Standard Exam header");
        }
        const ad = line.slice(0, 14).trim();
        const soyad = line.slice(14, 28).trim();
        const ataAdi = line.slice(28, 43).trim();
        const isNomresi = line.slice(43, 48).trim();
        const mekteb = line.slice(48, 51).trim();
        const sinif = line.slice(51, 53).trim();
        const dil = line.slice(53, 54).trim();
        const variant = line.slice(54, 55).trim();
        const bolme = line.slice(55, 56).trim();
        const sinfinAdi = line.slice(56, 57).trim();
        const cins = line.slice(57, 58).trim();
        const qrup = line.slice(58, 59).trim();
        answerString = line.slice(59);

        student = { ad, soyad, ataAdi, isNomresi, mekteb, sinif, dil, variant, bolme, sinfinAdi, cins, qrup };
        
        // Standard parsing: Sequential subject slicing
        const subjects: Record<string, string> = {};
        const activeConfig = configMap[student.sinif || ''] || configMap['default'] || DEFAULT_SUBJECT_CONFIG;
        let currentIndex = 0;
        
        for (const subject of activeConfig) {
             // Calculate total length for this subject
            let subjectTotalLength = 0;
            if (subject.segments) {
                subjectTotalLength = subject.segments.reduce((acc, seg) => acc + (seg.count * seg.lengthPerItem), 0);
            } else {
                subjectTotalLength = subject.length || 0;
            }

            subjects[subject.id] = answerString.slice(currentIndex, currentIndex + subjectTotalLength);
            currentIndex += subjectTotalLength;
        }
        
        if (!student.isNomresi) return createErrorRecord(line, "Missing Student ID");

        return {
            id: crypto.randomUUID(),
            originalLine: line,
            ad: student.ad!,
            soyad: student.soyad!,
            ataAdi: student.ataAdi!,
            isNomresi: student.isNomresi!,
            mekteb: student.mekteb!,
            sinif: student.sinif!,
            dil: student.dil!,
            variant: student.variant!,
            bolme: student.bolme!,
            sinfinAdi: student.sinfinAdi!,
            cins: student.cins!,
            qrup: student.qrup!,
            fullAnswerString: answerString,
            subjects,
            isValid: true
        };

      } else {
        // --- BURAXILIS (V2) PARSER ---
        // Header: 34 characters strict
        if (line.length < 34) {
             return createErrorRecord(line, "Line too short for Buraxılış Exam header");
        }
        
        const ad = line.slice(0, 10).trim();
        const soyad = line.slice(10, 20).trim();
        const isNomresi = line.slice(20, 25).trim();
        const mekteb = line.slice(25, 28).trim();
        const sinif = line.slice(28, 30).trim();
        const qrup = line.slice(30, 31).trim();
        const dil = line.slice(31, 32).trim();
        const variant = line.slice(32, 33).trim();
        const bolme = line.slice(33, 34).trim();
        
        // Data Layers
        // Start at 34
        const DATA_START = 34;
        
        // Define Layer Lengths (Verified)
        const LEN_L1_CLOSED = 55; // Az(25) + Math(15) + Eng(15)
        const LEN_L2_NUMERIC = 35; // Eng(15) + Math(20)
        const LEN_L3_OPEN = 19;    // Az(10) + Math(5) + Eng(4)

        const rawData = line.slice(DATA_START).padEnd(200, ' ');
        
        let ptr = 0;
        const layer1Str = rawData.slice(ptr, ptr + LEN_L1_CLOSED); 
        ptr += LEN_L1_CLOSED;
        
        const layer2Str = rawData.slice(ptr, ptr + LEN_L2_NUMERIC); 
        ptr += LEN_L2_NUMERIC;
        
        const layer3Str = rawData.slice(ptr, ptr + LEN_L3_OPEN);
        ptr += LEN_L3_OPEN;

        // Config Mapping
        const activeConfig = configMap[student.sinif || '09'] || configMap['09']; 
        const subAz = activeConfig[0];
        const subMath = activeConfig[1];
        const subEng = activeConfig[2];

        // L1 Distribution
        const l1_Az = 25;
        const l1_Math = 15;
        const l1_Eng = 15;
        
        const l1_Az_Str = layer1Str.slice(0, l1_Az);
        const l1_Math_Str = layer1Str.slice(l1_Az, l1_Az + l1_Math);
        const l1_Eng_Str = layer1Str.slice(l1_Az + l1_Math, l1_Az + l1_Math + l1_Eng);

        // L2 Distribution (Eng THEN Math)
        const l2_Eng = 15; // 3 * 5
        const l2_Math = 20; // 4 * 5
        
        const l2_Eng_Str = layer2Str.slice(0, l2_Eng);
        const l2_Math_Str = layer2Str.slice(l2_Eng, l2_Eng + l2_Math);

        // L3 Distribution
        const l3_Az = 10;
        const l3_Math = 5;
        const l3_Eng = 4;
        
        const l3_Az_Str = layer3Str.slice(0, l3_Az);
        const l3_Math_Str = layer3Str.slice(l3_Az, l3_Az + l3_Math);
        const l3_Eng_Str = layer3Str.slice(l3_Az + l3_Math, l3_Az + l3_Math + l3_Eng);

        // Construct Subjects
        const subjects: Record<string, string> = {};

        // Az: Closed + Open
        subjects[subAz.id] = l1_Az_Str + l3_Az_Str;

        // Math: Closed + Numeric + Open
        subjects[subMath.id] = l1_Math_Str + l2_Math_Str + l3_Math_Str;

        // Eng: Closed + Numeric + Open
        subjects[subEng.id] = l1_Eng_Str + l2_Eng_Str + l3_Eng_Str;

        student = { 
            ad, soyad, ataAdi: '', 
            isNomresi, mekteb, sinif, 
            dil, variant, bolme, qrup, 
            sinfinAdi: '', cins: '' 
        };

        if (!student.isNomresi) return createErrorRecord(line, "Missing Student ID");
        
        // IMPORTANT: Concatenate in Config Order for Grading
        const sequentialAnswerString = subjects[subAz.id] + subjects[subMath.id] + subjects[subEng.id];

        return {
            id: crypto.randomUUID(),
            originalLine: line,
            ad: student.ad!,
            soyad: student.soyad!,
            ataAdi: student.ataAdi!,
            isNomresi: student.isNomresi!,
            mekteb: student.mekteb!,
            sinif: student.sinif!,
            dil: student.dil!,
            variant: student.variant!,
            bolme: student.bolme!,
            sinfinAdi: student.sinfinAdi!,
            cins: student.cins!,
            qrup: student.qrup!,
            fullAnswerString: sequentialAnswerString, 
            subjects,
            isValid: true
        };
      }

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
