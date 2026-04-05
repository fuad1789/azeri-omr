
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

export interface HeaderField {
  id: keyof ParsedStudent | 'skip';
  name: string;
  length: number;
}

export const DEFAULT_LEGACY_HEADER: HeaderField[] = [
  { id: 'ad', name: 'Ad', length: 14 },
  { id: 'soyad', name: 'Soyad', length: 14 },
  { id: 'ataAdi', name: 'Ata Adı', length: 15 },
  { id: 'isNomresi', name: 'İş Nömrəsi', length: 5 },
  { id: 'mekteb', name: 'Məktəb', length: 3 },
  { id: 'sinif', name: 'Sinif', length: 2 },
  { id: 'dil', name: 'Bölmə (XBT)', length: 1 },
  { id: 'variant', name: 'Variant', length: 1 },
  { id: 'bolme', name: 'Bölmə', length: 1 },
  { id: 'sinfinAdi', name: 'Sinfin Adı', length: 1 },
  { id: 'cins', name: 'Cins', length: 1 },
  { id: 'qrup', name: 'Qrup', length: 1 },
];

export const DEFAULT_BURAXILIS_HEADER: HeaderField[] = [
  { id: 'ad', name: 'Ad', length: 10 },
  { id: 'soyad', name: 'Soyad', length: 10 },
  { id: 'isNomresi', name: 'İş Nömrəsi', length: 5 },
  { id: 'mekteb', name: 'Məktəb', length: 3 },
  { id: 'sinif', name: 'Sinif', length: 2 },
  { id: 'qrup', name: 'Qrup', length: 1 },
  { id: 'dil', name: 'Bölmə (XBT)', length: 1 },
  { id: 'variant', name: 'Variant', length: 1 },
  { id: 'bolme', name: 'Bölmə', length: 1 },
];


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
    // 7ci sinif (Legacy Fənn İmtahanı)
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
    // 8-9cu sinif (Buraxılış İmtahanı default)
    '08': [
        {
            ...SUB_AZ_BASE,
            // 18+2+8+2 = 30 chars, 30 sual, 100 bal
            // Qapalı: 26×3.07692307=80, Yazı: 4×5=20 → 100
            length: 30,
            points: 100,
            segments: [
                { type: 'closed', count: 18, points: 3.07692307, lengthPerItem: 1 },
                { type: 'written', count: 2, points: 5, lengthPerItem: 1 },
                { type: 'closed', count: 8, points: 3.07692307, lengthPerItem: 1 },
                { type: 'written', count: 2, points: 5, lengthPerItem: 1 },
            ],
        },
        {
            ...SUB_MATH_BASE,
            // 15+6×5+4 = 49 chars, 25 sual, 100 bal
            length: 49,
            points: 100,
            segments: [
                { type: 'closed', count: 15, points: 3.57142857, lengthPerItem: 1 },
                { type: 'open', count: 6, points: 3.57142857, lengthPerItem: 5 },
                { type: 'written', count: 4, points: 6.25, lengthPerItem: 1 },
            ],
        },
        {
            ...SUB_ENG_BASE,
            // 3+1+7+1×5+12+1×5+1 = 34 chars, 26 sual, 100 bal
            // Qapalı: 22×3.75=82.5, Açıq: 2×2.5=5, Yazı: 2×6.25=12.5 → 100
            length: 34,
            points: 100,
            segments: [
                { type: 'closed', count: 3, points: 3.75, lengthPerItem: 1 },
                { type: 'written', count: 1, points: 6.25, lengthPerItem: 1 },
                { type: 'closed', count: 7, points: 3.75, lengthPerItem: 1 },
                { type: 'open', count: 1, points: 2.5, lengthPerItem: 5 },
                { type: 'closed', count: 12, points: 3.75, lengthPerItem: 1 },
                { type: 'open', count: 1, points: 2.5, lengthPerItem: 5 },
                { type: 'written', count: 1, points: 6.25, lengthPerItem: 1 },
            ],
        },
    ],
};

// Copy references
CLASS_CONFIGS['03'] = CLASS_CONFIGS['02'];
CLASS_CONFIGS['04'] = CLASS_CONFIGS['02'];
CLASS_CONFIGS['09'] = CLASS_CONFIGS['08']; // 9cu sinif = 8ci sinif

// Single digit support
CLASS_CONFIGS['1'] = CLASS_CONFIGS['01'];
CLASS_CONFIGS['2'] = CLASS_CONFIGS['02'];
CLASS_CONFIGS['3'] = CLASS_CONFIGS['03'];
CLASS_CONFIGS['4'] = CLASS_CONFIGS['04'];
CLASS_CONFIGS['5'] = CLASS_CONFIGS['05'];
CLASS_CONFIGS['6'] = CLASS_CONFIGS['06'];
CLASS_CONFIGS['7'] = CLASS_CONFIGS['07'];
CLASS_CONFIGS['8'] = CLASS_CONFIGS['08'];
CLASS_CONFIGS['9'] = CLASS_CONFIGS['09'];

// --- BURAXILIS IMTAHANI CONFIGURATIONS ---

// Buraxilis Layout Definition (Default / Grade 9-10)
export const BURAXILIS_LAYOUT = [
    { subject: 'az', type: 'closed', length: 20 },
    { subject: 'math', type: 'closed', length: 13 },
    { subject: 'eng', type: 'closed', length: 22 }, // Grade 10: 22 Closed
    { subject: 'math', type: 'open', count: 5, lengthPerItem: 5 },
    { subject: 'eng', type: 'open', count: 2, lengthPerItem: 5 }, // Grade 10: 2 Open
    { subject: 'az', type: 'written', length: 10 },
    { subject: 'math', type: 'written', length: 7 },
    { subject: 'eng', type: 'written', length: 2 } // Grade 10: 2 Written
];

// Grade 11 Specific Layout (Based on user file analysis)
export const BURAXILIS_LAYOUT_11 = [
    { subject: 'az', type: 'closed', length: 20 },
    { subject: 'math', type: 'closed', length: 13 },
    { subject: 'eng', type: 'closed', length: 23 }, 
    { subject: 'math', type: 'open', count: 5, lengthPerItem: 5 }, // 5 questions as per user request
    // { subject: 'skip', type: 'open', count: 2, lengthPerItem: 5 }, // REMOVED as per user instruction (data starts immediately)
    { subject: 'az', type: 'written', length: 10 },
    { subject: 'math', type: 'written', length: 7 },
    { subject: 'eng', type: 'written', length: 7 } // Updated to 7 per user request 
];

// Grade 8-9 Specific Layout
// Physical byte order on the OMR scanner output — DO NOT change unless the
// scanner hardware/format changes.  Segments in BURAXILIS_CONFIGS (below)
// define the *exam-paper* question ordering for display & grading.
export const BURAXILIS_LAYOUT_9 = [
    { subject: 'az', type: 'closed', length: 26 },
    { subject: 'math', type: 'closed', length: 15 },
    { subject: 'eng', type: 'closed', length: 22 },
    { subject: 'math', type: 'open', count: 6, lengthPerItem: 5 },
    { subject: 'eng', type: 'open', count: 2, lengthPerItem: 5 },
    { subject: 'az', type: 'written', length: 4 },
    { subject: 'math', type: 'written', length: 4 },
    { subject: 'eng', type: 'written', length: 2 }
];

export const getBuraxilisLayout = (grade: string) => {
    if (grade === '11') return BURAXILIS_LAYOUT_11;
    if (grade === '8' || grade === '9' || grade === '08' || grade === '09') return BURAXILIS_LAYOUT_9;
    return BURAXILIS_LAYOUT; // Grade 10 default
};

// Helper to create Buraxilis configs
const createBuraxilisConfig = (grade: '9' | '10' | '11'): SubjectConfig[] => {
    const layout = getBuraxilisLayout(grade);

    // Calculate Segments based on Layout
    const getSegs = (subj: string) => {
        const segs: SubjectSegment[] = [];
        layout.filter(l => l.subject === subj).forEach(l => {
             let points = 2;
             if (l.subject === 'az') {
                 if (l.type === 'closed') points = (grade === '9') ? 3.07692307 : 2.5;
                 if (l.type === 'open') points = 5;
                 if (l.type === 'written') points = 5;
             } else if (l.subject === 'math') {
                 if (l.type === 'closed' || l.type === 'open') points = (grade === '9') ? 3.57142857 : 3.125;
                 if (l.type === 'written') points = 6.25;
             } else if (l.subject === 'eng') {
                 if (l.type === 'closed' || l.type === 'open') points = (grade === '9' || grade === '10') ? 3.75 : 2.70250969;
                 if (l.type === 'written') points = (grade === '9' || grade === '10') ? 5 : 5.40571428;
             }

             segs.push({
                 type: l.type as any,
                 count: (l.type === 'open' ? l.count : l.length)!,
                 points,
                 lengthPerItem: l.type === 'open' ? 5 : 1
             });
        });
        return segs;
    };

    const SEG_AZ = getSegs('az');
    const SEG_MATH = getSegs('math');
    const SEG_ENG = getSegs('eng');


    // All grades (9, 10, 11) currently share the same structure for Buraxilis
    // The points might differ, but the segment counts and types are consistent.
    // The points are defined in the SEG_ constants.
    // Compute lengths from segments
    const calcLen = (segs: SubjectSegment[]) => segs.reduce((acc, s) => acc + s.count * s.lengthPerItem, 0);
    return [
        { ...SUB_AZ_BASE, length: calcLen(SEG_AZ), points: 100, segments: SEG_AZ },
        { ...SUB_MATH_BASE, length: calcLen(SEG_MATH), points: 100, segments: SEG_MATH },
        { ...SUB_ENG_BASE, length: calcLen(SEG_ENG), points: 100, segments: SEG_ENG },
    ];
};

export const BURAXILIS_CONFIGS: Record<string, SubjectConfig[]> = {
    '09': createBuraxilisConfig('9'),
    '10': createBuraxilisConfig('10'),
    '11': createBuraxilisConfig('11'),
    '8': createBuraxilisConfig('9'),
    '9': createBuraxilisConfig('9'), 
};

export const DEFAULT_SUBJECT_CONFIG: SubjectConfig[] = CLASS_CONFIGS['02']; 

export const parseOMRData = (rawText: string, configMap: Record<string, SubjectConfig[]> = { 'default': DEFAULT_SUBJECT_CONFIG }, parseMode: 'legacy' | 'buraxilis' = 'legacy', dataStartIndex?: number, headerConfig?: HeaderField[]): ParsedStudent[] => {
  // 1. Clean the text: remove '`' noise
  const cleanText = rawText.replace(/`/g, '');
  
  // 2. Split into lines
  let lines = cleanText.split(/\r?\n/).map(l => l.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')).filter(l => l.length > 0);

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

  // Determine active header configurations
  const activeHeaderConfig = headerConfig || (parseMode === 'buraxilis' ? DEFAULT_BURAXILIS_HEADER : DEFAULT_LEGACY_HEADER);
  const calculatedDataStart = dataStartIndex !== undefined ? dataStartIndex : activeHeaderConfig.reduce((sum, field) => sum + field.length, 0);


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
        if (line.length < calculatedDataStart) {
             return createErrorRecord(line, "Line too short for Standard Exam header");
        }
        
        // Dynamically parse header fields
        let currentHeaderIndex = 0;
        student = { ad: '', soyad: '', ataAdi: '', isNomresi: '', mekteb: '', sinif: '', dil: '', variant: '', bolme: '', sinfinAdi: '', cins: '', qrup: '' };
        
        for (const field of activeHeaderConfig) {
            if (field.id !== 'skip') {
                (student as any)[field.id] = line.slice(currentHeaderIndex, currentHeaderIndex + field.length).trim();
            }
            currentHeaderIndex += field.length;
        }

        answerString = line.slice(calculatedDataStart);
        
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
            id: Date.now().toString(),
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
        if (line.length < calculatedDataStart) {
             return createErrorRecord(line, "Line too short for Buraxılış Exam header");
        }
        
        let currentHeaderIndex = 0;
        student = { ad: '', soyad: '', ataAdi: '', isNomresi: '', mekteb: '', sinif: '', dil: '', variant: '', bolme: '', sinfinAdi: '', cins: '', qrup: '' };
        
        for (const field of activeHeaderConfig) {
            if (field.id !== 'skip') {
                (student as any)[field.id] = line.slice(currentHeaderIndex, currentHeaderIndex + field.length).trim();
            }
            currentHeaderIndex += field.length;
        }
        
        // Data Layers
        const DATA_START = calculatedDataStart;
        
        // Use Global Layout Strategy directly for parsing
        // CRITICAL: Use the parsed sinif value, not student.sinif which is undefined at this point!
        const layout = getBuraxilisLayout(student.sinif || '09');
        let currentPtr = DATA_START;
        
        // Initialize subject strings
        const subjects: Record<string, string> = {
            'az': '',
            'math': '',
            'eng': ''
        };

        // Iterate Layout to Scatter Data
        for (const block of layout) {
            const len = block.length || (block.count! * block.lengthPerItem!);
            const chunk = line.slice(currentPtr, currentPtr + len).padEnd(len, ' '); // Pad if line ends early
            currentPtr += len;

            if (block.subject !== 'skip' && subjects[block.subject] !== undefined) {
                subjects[block.subject] += chunk;
            }
        }

        // Map back to Config IDs (legacy support for grading)
        // configMap keys are usually indices or 'default', but grading uses subject.id
        // We need to map 'az' -> 'azDili', 'math' -> 'riyaziyyat', 'eng' -> 'xariciDil'
        // based on the standard IDs defined at top of file.
        const mappedSubjects: Record<string, string> = {};
        mappedSubjects['azDili'] = subjects['az'];
        mappedSubjects['riyaziyyat'] = subjects['math'];
        mappedSubjects['xariciDil'] = subjects['eng'];

        if (!student.isNomresi) return createErrorRecord(line, "Missing Student ID");
        
        // IMPORTANT: Concatenate in Config Order for Grading
        const sequentialAnswerString = mappedSubjects['azDili'] + mappedSubjects['riyaziyyat'] + mappedSubjects['xariciDil'];

        return {
            id: Date.now().toString(),
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
            subjects: mappedSubjects,
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
    id: Date.now().toString(),
    originalLine: line,

    ad: '', soyad: '', ataAdi: '', isNomresi: '', mekteb: '', sinif: '', dil: '', variant: '', bolme: '', sinfinAdi: '', cins: '', qrup: '',
    fullAnswerString: '',
    subjects: {},
    isValid: false,
    error: errorMsg
  };
}

/**
 * Re-derives the per-subject answer strings from a raw line using the current
 * headerConfig and configMap. Call this before grading so changes to the config
 * are always reflected — instead of using the stale student.subjects map that
 * was built with the config that was active at parse time.
 */
export function extractSubjectsFromLine(
  originalLine: string,
  headerConfig: HeaderField[],
  config: SubjectConfig[]
): Record<string, string> {
  const dataStart = headerConfig.reduce((acc, f) => acc + f.length, 0);
  const answerString = originalLine.slice(dataStart);

  const subjects: Record<string, string> = {};
  let currentIndex = 0;
  for (const subject of config) {
    let len = 0;
    if (subject.segments) {
      len = subject.segments.reduce((acc, seg) => acc + seg.count * seg.lengthPerItem, 0);
    } else {
      len = subject.length || 0;
    }
    subjects[subject.id] = answerString.slice(currentIndex, currentIndex + len);
    currentIndex += len;
  }
  return subjects;
}
