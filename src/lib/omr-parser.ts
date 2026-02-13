
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
    type: 'closed' | 'open' | 'written';
    count: number;
    points: number; // For 'open', this is the weight multiplier
    lengthPerItem: number; // 1 for closed/written, 5 for open
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
const createBuraxilisConfig = (grade: '9' | '10' | '11'): SubjectConfig[] => {
    // Grade 9 (and 8)
    if (grade === '9') {
        return [
            { 
                ...SUB_AZ_BASE, 
                length: 30, // 26 + 4
                points: 100, 
                segments: [
                    { type: 'closed', count: 26, points: 2, lengthPerItem: 1 }, 
                    { type: 'written', count: 4, points: 12, lengthPerItem: 1 }, 
                ]
            },
            { 
                ...SUB_MATH_BASE, 
                length: 25, // 15 + 6 + 4
                points: 100,
                segments: [
                    { type: 'closed', count: 15, points: 2, lengthPerItem: 1 },
                    { type: 'open', count: 6, points: 5, lengthPerItem: 5 },
                    { type: 'written', count: 4, points: 10, lengthPerItem: 1 },
                ]
            },
            { 
                ...SUB_ENG_BASE, 
                length: 26, // 22 + 2 + 2
                points: 100,
                segments: [
                     { type: 'closed', count: 22, points: 2, lengthPerItem: 1 },
                     { type: 'open', count: 2, points: 5, lengthPerItem: 5 },
                     { type: 'written', count: 2, points: 13, lengthPerItem: 1 },
                ]
            }
        ];
    }

    // Grade 10
    if (grade === '10') {
        return [
            { 
                ...SUB_AZ_BASE, 
                length: 30, // 20 + 10
                points: 100, 
                segments: [
                    { type: 'closed', count: 20, points: 2, lengthPerItem: 1 }, 
                    { type: 'written', count: 10, points: 6, lengthPerItem: 1 }, 
                ]
            },
            { 
                ...SUB_MATH_BASE, 
                length: 25, // 13 + 5 + 7
                points: 100,
                segments: [
                    { type: 'closed', count: 13, points: 2, lengthPerItem: 1 },
                    { type: 'open', count: 5, points: 5, lengthPerItem: 5 },
                    { type: 'written', count: 7, points: 7, lengthPerItem: 1 },
                ]
            },
            { 
                ...SUB_ENG_BASE, 
                length: 26, // 22 + 2 + 2
                points: 100,
                segments: [
                     { type: 'closed', count: 22, points: 2, lengthPerItem: 1 },
                     { type: 'open', count: 2, points: 5, lengthPerItem: 5 },
                     { type: 'written', count: 2, points: 13, lengthPerItem: 1 },
                ]
            }
        ];
    }

    // Grade 11
    if (grade === '11') {
        return [
            { 
                ...SUB_AZ_BASE, 
                length: 30, // 20 + 10
                points: 100, 
                segments: [
                    { type: 'closed', count: 20, points: 2, lengthPerItem: 1 }, 
                    { type: 'written', count: 10, points: 6, lengthPerItem: 1 }, 
                ]
            },
            { 
                ...SUB_MATH_BASE, 
                length: 25, // 13 + 5 + 7
                points: 100,
                segments: [
                    { type: 'closed', count: 13, points: 2, lengthPerItem: 1 },
                    { type: 'open', count: 5, points: 5, lengthPerItem: 5 },
                    { type: 'written', count: 7, points: 7, lengthPerItem: 1 },
                ]
            },
            { 
                ...SUB_ENG_BASE, 
                length: 30, // 23 + 7
                points: 100,
                segments: [
                     { type: 'closed', count: 23, points: 2, lengthPerItem: 1 },
                     { type: 'written', count: 7, points: 7.7, lengthPerItem: 1 },
                ]
            }
        ];
    }
    
    return [];
};

export const BURAXILIS_CONFIGS: Record<string, SubjectConfig[]> = {
    '08': createBuraxilisConfig('9'), // 8th same as 9th
    '09': createBuraxilisConfig('9'),
    '10': createBuraxilisConfig('10'),
    '11': createBuraxilisConfig('11'),
    '8': createBuraxilisConfig('9'),
    '9': createBuraxilisConfig('9'), 
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
        const activeConfig = configMap[student.sinif || '09'] || configMap['09']; 
        const subAz = activeConfig[0];
        const subMath = activeConfig[1];
        const subEng = activeConfig[2];

        // Dynamic Calculation of Layer Lengths based on Config
        // Layer 1: Closed Questions
        let L1_Total = 0;
        let l1_Az = 0;
        let l1_Math = 0;
        let l1_Eng = 0;

        // Layer 2: Open Questions (was Numeric)
        let L2_Total = 0;
        let l2_Az = 0;
        let l2_Math = 0;
        let l2_Eng = 0;

        // Layer 3: Written Questions (was Open)
        let L3_Total = 0;
        let l3_Az = 0;
        let l3_Math = 0;
        let l3_Eng = 0;

        // Helper to extract counts
        const extractCounts = (subj: SubjectConfig) => {
            let closed = 0;
            let open = 0; // Length 5
            let written = 0; // Length 1

            if (subj.segments) {
                subj.segments.forEach(seg => {
                    if (seg.type === 'closed') closed += seg.count;
                    if (seg.type === 'open') open += seg.count;
                    if (seg.type === 'written') written += seg.count;
                });
            }
            return { closed, open, written };
        };

        const azCounts = extractCounts(subAz);
        l1_Az = azCounts.closed;
        l2_Az = azCounts.open * 5; // 5 chars per item
        l3_Az = azCounts.written;

        const mathCounts = extractCounts(subMath);
        l1_Math = mathCounts.closed;
        l2_Math = mathCounts.open * 5;
        l3_Math = mathCounts.written;

        const engCounts = extractCounts(subEng);
        l1_Eng = engCounts.closed;
        l2_Eng = engCounts.open * 5;
        l3_Eng = engCounts.written;

        L1_Total = l1_Az + l1_Math + l1_Eng;
        L2_Total = l2_Az + l2_Math + l2_Eng;
        L3_Total = l3_Az + l3_Math + l3_Eng;

        // Slicing
        const rawData = line.slice(DATA_START).padEnd(200, ' ');
        
        let ptr = 0;
        const layer1Str = rawData.slice(ptr, ptr + L1_Total); 
        ptr += L1_Total;
        
        const layer2Str = rawData.slice(ptr, ptr + L2_Total); 
        ptr += L2_Total;
        
        const layer3Str = rawData.slice(ptr, ptr + L3_Total);
        ptr += L3_Total;

        // L1 Distribution (Az -> Math -> Eng)
        const l1_Az_Str = layer1Str.slice(0, l1_Az);
        const l1_Math_Str = layer1Str.slice(l1_Az, l1_Az + l1_Math);
        const l1_Eng_Str = layer1Str.slice(l1_Az + l1_Math, l1_Az + l1_Math + l1_Eng);

        // L2 Distribution (Dynamic based on Config Order: Az -> Math -> Eng)

        
        const l2_Az_Str = layer2Str.slice(0, l2_Az);
        const l2_Math_Str = layer2Str.slice(l2_Az, l2_Az + l2_Math);
        const l2_Eng_Str = layer2Str.slice(l2_Az + l2_Math, l2_Az + l2_Math + l2_Eng);

        // L3 Distribution (Az -> Math -> Eng)
        const l3_Az_Str = layer3Str.slice(0, l3_Az);
        const l3_Math_Str = layer3Str.slice(l3_Az, l3_Az + l3_Math);
        const l3_Eng_Str = layer3Str.slice(l3_Az + l3_Math, l3_Az + l3_Math + l3_Eng);

        // Construct Subjects
        const subjects: Record<string, string> = {};

        // Az: Closed + Open + Written
        subjects[subAz.id] = l1_Az_Str + l2_Az_Str + l3_Az_Str;

        // Math: Closed + Open + Written
        subjects[subMath.id] = l1_Math_Str + l2_Math_Str + l3_Math_Str;

        // Eng: Closed + Open + Written
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
