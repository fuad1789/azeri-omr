/**
 * results-parser.ts
 * Pre-graded TSV exports (already corrected by external system) → strict JSON.
 * NO grading is performed here. We only structure the data.
 *
 * Five known formats are auto-detected by column count + header signatures:
 *
 *   A) Standard       (155 cols, 13 header, 11 subjects × 12)   — asagi.txt + similar
 *   B) Qəbul          (155 cols, 10 header,  9 subjects × 15)   — qebul.txt   (+open-test)
 *   C) Buraxılış      ( 68 cols, 10 header,  3 subjects × 16)   — 08 09.txt / 10 11.txt
 *   D) 2025 sadə      ( 55 cols,  9 header,  3 subjects × 12)   — 2025.txt
 *   E) Standard-Lite  (155 cols, 13 header, 11 subjects × 12)   — same as A (kept as alias)
 */

export type ResultsFormat = 'standard' | 'qebul' | 'buraxilis' | 'simple2025' | 'blok';

export interface OpenTestEntry {
  studentRaw: string;          // e.g. "|D;CE;AB|246|156|145|"
  keyRaw: string;              // e.g. "|D;A;C|246|135|234|"
  status: string;              // e.g. "-+--"
  studentItems: string[];      // ["D;CE;AB", "246", "156", "145"]
  keyItems: string[];
}

export interface SubjectResult {
  name: string;
  // Closed-test
  cavabiniz: string;
  dogruCavablar: string;
  status: string;
  // Optional open-test (qebul / buraxilis)
  openTest?: OpenTestEntry;
  // Optional written-question level scores (buraxilis only) — e.g. "1111", "1100101222"
  yaziIsiBallari?: string;
  // Aggregates (taken AS-IS from source — we never recompute)
  sualSayi: number;
  dogruSayi: number;
  dogruFaizi: number;
  dogruQiymeti: number;
  sehvSayi: number;
  xalisSayi: number;
  xalisFaizi: number;
  xalisQiymeti: number;
  nisbiBal: number;
}

export interface TotalsBlock {
  sualSayi: number;
  dogruSayi: number;
  dogruFaizi: number;
  dogruQiymeti: number;
  sehvSayi: number;
  xalisSayi: number;
  xalisFaizi: number;
  xalisQiymeti: number;
  bal: number;
  sira: number;
}

export interface ParsedRow {
  id: string;
  ad: string;
  soyad: string;
  ataAdi: string;       // '' if not present in this format
  isNomresi: string;
  mekteb: string;
  sinif: string;
  dil: string;          // '' if not present
  variant: string;
  bolme: string;        // '' if not present
  sinfinAdi: string;    // '' if not present
  cins: string;         // '' if not present
  qrup: string;         // '' if not present
  subjects: Record<string, SubjectResult>;
  totals: TotalsBlock;
}

export interface ParsedFile {
  format: ResultsFormat;
  columnCount: number;
  subjectNames: string[];      // in declared order
  headers: string[];           // raw header row, length = columnCount
  rows: ParsedRow[];
}

// -------------------------------------------------------------------------
// Format-specific layouts. Header is positional (not name-based) for safety.
// -------------------------------------------------------------------------

interface FormatLayout {
  format: ResultsFormat;
  columnCount: number;
  // Identity columns (zero-based start index → field name) — strict order.
  headerFields: Array<{ idx: number; key: keyof ParsedRow }>;
  // Subject block size and starting column index
  subjectBlockSize: 12 | 15 | 16;
  subjectStartIdx: number;
  subjectNames: string[];
  // Layout of one subject block: ordered keys
  blockKeys: BlockKey[];
}

type BlockKey =
  | 'cavabiniz' | 'dogruCavablar' | 'status'
  | 'openStudent' | 'openKey' | 'openStatus' | 'yaziIsi'
  | 'sualSayi' | 'dogruSayi' | 'dogruFaizi' | 'dogruQiymeti'
  | 'sehvSayi' | 'xalisSayi' | 'xalisFaizi' | 'xalisQiymeti' | 'nisbiBal';

const BLOCK_12: BlockKey[] = [
  'cavabiniz', 'dogruCavablar', 'status',
  'sualSayi', 'dogruSayi', 'dogruFaizi', 'dogruQiymeti',
  'sehvSayi', 'xalisSayi', 'xalisFaizi', 'xalisQiymeti', 'nisbiBal',
];

const BLOCK_15: BlockKey[] = [
  'cavabiniz', 'dogruCavablar', 'status',
  'openStudent', 'openKey', 'openStatus',
  'sualSayi', 'dogruSayi', 'dogruFaizi', 'dogruQiymeti',
  'sehvSayi', 'xalisSayi', 'xalisFaizi', 'xalisQiymeti', 'nisbiBal',
];

const BLOCK_16: BlockKey[] = [
  'cavabiniz', 'dogruCavablar', 'status',
  'openStudent', 'openKey', 'openStatus',
  'yaziIsi',
  'sualSayi', 'dogruSayi', 'dogruFaizi', 'dogruQiymeti',
  'sehvSayi', 'xalisSayi', 'xalisFaizi', 'xalisQiymeti', 'nisbiBal',
];

const STANDARD_SUBJECTS = [
  'Azərbaycan dili', 'Riyaziyyat', 'Fizika', 'Kimya', 'Biologiya',
  'Coğrafiya', 'Tarix', 'Xarici dil', 'Həyat bilgisi', 'İnformatika', 'Məntiq',
];

const QEBUL_SUBJECTS = [
  'Azərbaycan dili', 'Riyaziyyat', 'Fizika', 'Kimya', 'Biologiya',
  'Coğrafiya', 'Tarix', 'Xarici dil', 'Ədəbiyyat',
];

const BURAXILIS_SUBJECTS = ['Ana dili', 'Riyaziyyat', 'Xarici dil'];
const SIMPLE2025_SUBJECTS = ['Azərbaycan dili', 'Riyaziyyat', 'Xarici dil'];

// "Blok" — qəbul-bloku: tələbə fərqli fənn cütlüklərini seçir, bütün fənnlər
// vərəq başlığında olur, lakin yalnız seçilənlər doludur.
const BLOK_SUBJECTS = [
  'Azərbaycan dili', 'Ana dili', 'Ədəbiyyat', 'Riyaziyyat', 'Fizika',
  'Tarix', 'Xarici dil', 'Coğrafiya', 'Biologiya', 'Kimya', 'İnformatika',
];

const LAYOUTS: FormatLayout[] = [
  // Standard (155, 13 header, 11×12)
  {
    format: 'standard',
    columnCount: 155,
    headerFields: [
      { idx: 0, key: 'id' },
      { idx: 1, key: 'ad' },
      { idx: 2, key: 'soyad' },
      { idx: 3, key: 'ataAdi' },
      { idx: 4, key: 'isNomresi' },
      { idx: 5, key: 'mekteb' },
      { idx: 6, key: 'sinif' },
      { idx: 7, key: 'dil' },
      { idx: 8, key: 'variant' },
      { idx: 9, key: 'bolme' },
      { idx: 10, key: 'sinfinAdi' },
      { idx: 11, key: 'cins' },
      { idx: 12, key: 'qrup' },
    ],
    subjectBlockSize: 12,
    subjectStartIdx: 13,
    subjectNames: STANDARD_SUBJECTS,
    blockKeys: BLOCK_12,
  },
  // Qəbul (155, 10 header, 9×15)
  {
    format: 'qebul',
    columnCount: 155,
    headerFields: [
      { idx: 0, key: 'id' },
      { idx: 1, key: 'ad' },
      { idx: 2, key: 'soyad' },
      { idx: 3, key: 'isNomresi' },
      { idx: 4, key: 'mekteb' },
      { idx: 5, key: 'sinif' },
      { idx: 6, key: 'qrup' },
      { idx: 7, key: 'dil' },
      { idx: 8, key: 'variant' },
      { idx: 9, key: 'bolme' },
    ],
    subjectBlockSize: 15,
    subjectStartIdx: 10,
    subjectNames: QEBUL_SUBJECTS,
    blockKeys: BLOCK_15,
  },
  // Buraxılış (68, 10 header, 3×16)
  {
    format: 'buraxilis',
    columnCount: 68,
    headerFields: [
      { idx: 0, key: 'id' },
      { idx: 1, key: 'ad' },
      { idx: 2, key: 'soyad' },
      { idx: 3, key: 'isNomresi' },
      { idx: 4, key: 'mekteb' },
      { idx: 5, key: 'sinif' },
      { idx: 6, key: 'qrup' },
      { idx: 7, key: 'dil' },
      { idx: 8, key: 'variant' },
      { idx: 9, key: 'bolme' },
    ],
    subjectBlockSize: 16,
    subjectStartIdx: 10,
    subjectNames: BURAXILIS_SUBJECTS,
    blockKeys: BLOCK_16,
  },
  // Blok (196, 10 header, 11×16 — buraxılış-style bloks)
  {
    format: 'blok',
    columnCount: 196,
    headerFields: [
      { idx: 0, key: 'id' },
      { idx: 1, key: 'ad' },
      { idx: 2, key: 'soyad' },
      { idx: 3, key: 'isNomresi' },
      { idx: 4, key: 'mekteb' },
      { idx: 5, key: 'sinif' },
      { idx: 6, key: 'qrup' },
      { idx: 7, key: 'dil' },
      { idx: 8, key: 'variant' },
      { idx: 9, key: 'bolme' },
    ],
    subjectBlockSize: 16,
    subjectStartIdx: 10,
    subjectNames: BLOK_SUBJECTS,
    blockKeys: BLOCK_16,
  },
  // 2025 simple (55, 9 header, 3×12)
  {
    format: 'simple2025',
    columnCount: 55,
    headerFields: [
      { idx: 0, key: 'id' },
      { idx: 1, key: 'ad' },
      { idx: 2, key: 'soyad' },
      { idx: 3, key: 'ataAdi' },
      { idx: 4, key: 'isNomresi' },
      { idx: 5, key: 'mekteb' },
      { idx: 6, key: 'sinif' },
      { idx: 7, key: 'sinfinAdi' },
      { idx: 8, key: 'variant' },
    ],
    subjectBlockSize: 12,
    subjectStartIdx: 9,
    subjectNames: SIMPLE2025_SUBJECTS,
    blockKeys: BLOCK_12,
  },
];

/**
 * Detect layout strictly by column count + by header signature for the
 * 155-column case (which has two valid variants: standard vs. qəbul).
 */
export function detectFormat(headerCells: string[]): FormatLayout {
  const cols = headerCells.length;

  if (cols === 68) return findLayout('buraxilis');
  if (cols === 55) return findLayout('simple2025');
  if (cols === 196) return findLayout('blok');

  if (cols === 155) {
    // Disambiguate by presence of "Açıq test" sub-columns in the first subject block.
    // Qəbul: column 13 (0-based) = "Azərbaycan dili Açıq test Cavabınız"
    // Standard: column 13 (0-based) = "Riyaziyyat Cavabınız"
    const sample = (headerCells[13] || '').toLowerCase();
    if (sample.includes('açıq test') || sample.includes('aciq test')) {
      return findLayout('qebul');
    }
    return findLayout('standard');
  }

  throw new Error(`Bilinməyən format: ${cols} sütun`);
}

function findLayout(f: ResultsFormat): FormatLayout {
  const layout = LAYOUTS.find(l => l.format === f);
  if (!layout) throw new Error(`Layout tapılmadı: ${f}`);
  return layout;
}

// -------------------------------------------------------------------------
// Main parser
// -------------------------------------------------------------------------

export function parseResultsTSV(rawText: string): ParsedFile {
  const lines = rawText.replace(/\r\n/g, '\n').split('\n').filter(l => l.length > 0);
  if (lines.length < 2) throw new Error('Fayl boşdur və ya yalnız başlıq var.');

  const headerCells = lines[0].split('\t');
  const layout = detectFormat(headerCells);

  if (headerCells.length !== layout.columnCount) {
    throw new Error(`Sütun sayı uyğun deyil: gözlənilən ${layout.columnCount}, tapıldı ${headerCells.length}`);
  }

  const rows: ParsedRow[] = [];
  for (let li = 1; li < lines.length; li++) {
    const cells = padCells(lines[li].split('\t'), layout.columnCount);
    rows.push(parseRow(cells, layout));
  }

  return {
    format: layout.format,
    columnCount: layout.columnCount,
    subjectNames: layout.subjectNames,
    headers: headerCells,
    rows,
  };
}

function padCells(cells: string[], target: number): string[] {
  if (cells.length === target) return cells;
  if (cells.length < target) {
    return [...cells, ...Array(target - cells.length).fill('')];
  }
  // Some exporters emit trailing empty fields → trim if all extras are blank.
  const extra = cells.slice(target);
  if (extra.every(c => c.trim() === '')) return cells.slice(0, target);
  throw new Error(`Sətirdə artıq sütun var: ${cells.length} > ${target}`);
}

function parseRow(cells: string[], layout: FormatLayout): ParsedRow {
  const row: ParsedRow = {
    id: '', ad: '', soyad: '', ataAdi: '', isNomresi: '', mekteb: '',
    sinif: '', dil: '', variant: '', bolme: '', sinfinAdi: '', cins: '', qrup: '',
    subjects: {},
    totals: emptyTotals(),
  };

  // 1) Identity fields — keep raw, just trim whitespace
  for (const f of layout.headerFields) {
    (row as any)[f.key] = (cells[f.idx] ?? '').trim();
  }

  // 2) Subject blocks
  layout.subjectNames.forEach((subjectName, i) => {
    const start = layout.subjectStartIdx + i * layout.subjectBlockSize;
    const block = cells.slice(start, start + layout.subjectBlockSize);

    if (isBlockEmpty(block, layout.blockKeys)) {
      // Empty subject (e.g. 3rd-grade row in standard format with Fizika/Kimya empty)
      // Still emit a stub so downstream consumers know the slot existed.
      row.subjects[subjectName] = emptySubject(subjectName);
      return;
    }

    row.subjects[subjectName] = readSubjectBlock(subjectName, block, layout.blockKeys);
  });

  // 3) Totals: last 10 columns
  const totalsStart = layout.subjectStartIdx + layout.subjectNames.length * layout.subjectBlockSize;
  const t = cells.slice(totalsStart, totalsStart + 10);
  row.totals = {
    sualSayi: toInt(t[0]),
    dogruSayi: toFloat(t[1]),
    dogruFaizi: toFloat(t[2]),
    dogruQiymeti: toFloat(t[3]),
    sehvSayi: toFloat(t[4]),
    xalisSayi: toFloat(t[5]),
    xalisFaizi: toFloat(t[6]),
    xalisQiymeti: toFloat(t[7]),
    bal: toFloat(t[8]),
    sira: toInt(t[9]),
  };

  return row;
}

function readSubjectBlock(name: string, block: string[], keys: BlockKey[]): SubjectResult {
  const out: SubjectResult = emptySubject(name);
  let openStudent: string | undefined;
  let openKey: string | undefined;
  let openStatus: string | undefined;

  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    const v = block[i] ?? '';
    switch (k) {
      case 'cavabiniz':      out.cavabiniz = v; break;          // preserve spaces (= unanswered)
      case 'dogruCavablar':  out.dogruCavablar = v; break;
      case 'status':         out.status = v; break;
      case 'openStudent':    openStudent = v; break;
      case 'openKey':        openKey = v; break;
      case 'openStatus':     openStatus = v; break;
      case 'yaziIsi':        out.yaziIsiBallari = v.trim(); break;
      case 'sualSayi':       out.sualSayi = toInt(v); break;
      case 'dogruSayi':      out.dogruSayi = toFloat(v); break;
      case 'dogruFaizi':     out.dogruFaizi = toFloat(v); break;
      case 'dogruQiymeti':   out.dogruQiymeti = toFloat(v); break;
      case 'sehvSayi':       out.sehvSayi = toFloat(v); break;
      case 'xalisSayi':      out.xalisSayi = toFloat(v); break;
      case 'xalisFaizi':     out.xalisFaizi = toFloat(v); break;
      case 'xalisQiymeti':   out.xalisQiymeti = toFloat(v); break;
      case 'nisbiBal':       out.nisbiBal = toFloat(v); break;
    }
  }

  if (openStudent !== undefined || openKey !== undefined || openStatus !== undefined) {
    out.openTest = parseOpenTest(openStudent ?? '', openKey ?? '', openStatus ?? '');
  }

  return out;
}

/** "|D;CE;AB|246|156|145|" → ["D;CE;AB", "246", "156", "145"] */
function parseOpenTest(studentRaw: string, keyRaw: string, status: string): OpenTestEntry {
  return {
    studentRaw,
    keyRaw,
    status,
    studentItems: splitPipe(studentRaw),
    keyItems: splitPipe(keyRaw),
  };
}

function splitPipe(raw: string): string[] {
  if (!raw) return [];
  // Some rows have leading/trailing pipes, some don't. Normalize.
  const inner = raw.replace(/^\||\|$/g, '');
  if (inner === '') return [];
  return inner.split('|');
}

function isBlockEmpty(block: string[], keys: BlockKey[]): boolean {
  // Treat a subject block as "absent" when all of cavabiniz/dogruCavablar/status are blank.
  const idxAns = keys.indexOf('cavabiniz');
  const idxKey = keys.indexOf('dogruCavablar');
  const idxStatus = keys.indexOf('status');
  const a = (block[idxAns] ?? '').trim();
  const k = (block[idxKey] ?? '').trim();
  const s = (block[idxStatus] ?? '').trim();
  return a === '' && k === '' && s === '';
}

function emptySubject(name: string): SubjectResult {
  return {
    name,
    cavabiniz: '', dogruCavablar: '', status: '',
    sualSayi: 0, dogruSayi: 0, dogruFaizi: 0, dogruQiymeti: 0,
    sehvSayi: 0, xalisSayi: 0, xalisFaizi: 0, xalisQiymeti: 0, nisbiBal: 0,
  };
}

function emptyTotals(): TotalsBlock {
  return {
    sualSayi: 0, dogruSayi: 0, dogruFaizi: 0, dogruQiymeti: 0,
    sehvSayi: 0, xalisSayi: 0, xalisFaizi: 0, xalisQiymeti: 0,
    bal: 0, sira: 0,
  };
}

function toInt(v: string): number {
  const n = parseInt((v ?? '').trim(), 10);
  return Number.isFinite(n) ? n : 0;
}

function toFloat(v: string): number {
  if (v === undefined || v === null) return 0;
  const s = String(v).trim().replace(',', '.');
  if (s === '') return 0;
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}
