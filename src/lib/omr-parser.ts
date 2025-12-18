
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

export const DEFAULT_SUBJECT_CONFIG: SubjectConfig[] = [
    { id: 'azDili', name: 'Azərbaycan dili', length: 20, points: 5, color: 'bg-blue-100 text-blue-900' },
    { id: 'riyaziyyat', name: 'Riyaziyyat', length: 20, points: 5, color: 'bg-red-100 text-red-900' },
    { id: 'heyatBilgisi', name: 'Həyat Bilgisi', length: 10, points: 5, color: 'bg-green-100 text-green-900' },
    { id: 'mentiq', name: 'Məntiq', length: 10, points: 5, color: 'bg-purple-100 text-purple-900' },
    { id: 'xariciDil', name: 'Xarici Dil', length: 10, points: 5, color: 'bg-orange-100 text-orange-900' },
];

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

      // Answer string starts at 59
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
