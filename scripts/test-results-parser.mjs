// Quick smoke-test: 5 known TSV exports → JSON round-trip
// Usage: node scripts/test-results-parser.mjs
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const SRC = 'src/lib/results-parser.ts';
const OUT_DIR = 'scripts/.tmp';
fs.mkdirSync(OUT_DIR, { recursive: true });

execSync(`npx tsc --target ES2022 --module ES2022 --moduleResolution node --skipLibCheck --outDir ${OUT_DIR} ${SRC}`, { stdio: 'inherit' });
const compiled = path.resolve(OUT_DIR, 'results-parser.js');
const { parseResultsTSV } = await import('file://' + compiled.replace(/\\/g, '/'));

const FILES = [
  'C:/Users/FUAD/Downloads/qebul.txt',
  'C:/Users/FUAD/Downloads/08 09 (1).txt',
  'C:/Users/FUAD/Downloads/asagi.txt',
  'C:/Users/FUAD/Downloads/10 11.txt',
  'C:/Users/FUAD/Downloads/2025.txt',
  'C:/Users/FUAD/Downloads/blok.txt',
];

for (const f of FILES) {
  const raw = fs.readFileSync(f, 'utf-8');
  const result = parseResultsTSV(raw);
  const r0 = result.rows[0];
  console.log(`\n=== ${path.basename(f)} ===`);
  console.log(`  format        : ${result.format}`);
  console.log(`  satir sayi    : ${result.rows.length}`);
  console.log(`  fenn sayi     : ${result.subjectNames.length} → ${result.subjectNames.join(', ')}`);
  console.log(`  ilk: ${r0.ad.trim()} ${r0.soyad.trim()} | sinif=${r0.sinif} variant=${r0.variant}`);
  console.log(`  totals.bal=${r0.totals.bal} sira=${r0.totals.sira} sualSayi=${r0.totals.sualSayi}`);
  // sample subject
  const firstSubj = result.subjectNames[0];
  const s = r0.subjects[firstSubj];
  console.log(`  ${firstSubj}: cav="${s.cavabiniz.slice(0, 25)}..." dogru=${s.dogruSayi} nisbi=${s.nisbiBal}${s.openTest ? ' [OPEN-TEST var]' : ''}${s.yaziIsiBallari ? ' [yazıİşi=' + s.yaziIsiBallari + ']' : ''}`);
}
