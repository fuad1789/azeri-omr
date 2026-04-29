'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  ArrowLeft, Upload, FileText, CheckCircle2, AlertCircle, Loader2, Calendar
} from 'lucide-react';

type Conductor = 'azeri' | 'reduco';
type MaxScore = 300 | 400 | 700;

const MAX_SCORE_OPTIONS: MaxScore[] = [300, 400, 700];

interface ImportResponse {
  success: boolean;
  id?: string;
  format?: string;
  examType?: string;
  maxScore?: number;
  count?: number;
  subjectNames?: string[];
  classes?: string[];
  variants?: string[];
  error?: string;
}

export default function ResultsImportPage() {
  const router = useRouter();
  const { status } = useSession();

  const [examName, setExamName] = useState('');
  const [examDate, setExamDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [conductor, setConductor] = useState<Conductor>('azeri');
  const [maxScore, setMaxScore] = useState<MaxScore>(300);
  const [fileName, setFileName] = useState<string>('');
  const [rawText, setRawText] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ImportResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  const handleFile = async (file: File) => {
    setError(null);
    setResult(null);
    setFileName(file.name);
    try {
      const text = await file.text();
      setRawText(text);
    } catch (e: any) {
      setError(`Fayl oxunmadı: ${e.message}`);
      setRawText('');
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) void handleFile(f);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) void handleFile(f);
  };

  const reset = () => {
    setExamName('');
    setFileName('');
    setRawText('');
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const submit = async () => {
    setError(null);
    setResult(null);

    if (!examName.trim()) {
      setError('İmtahan adını yazın.');
      return;
    }
    if (!rawText.trim()) {
      setError('Fayl seçin və ya məzmun yapışdırın.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/results-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examName: examName.trim(), examDate, conductor, maxScore, rawText }),
      });
      const data: ImportResponse = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || `Xəta: HTTP ${res.status}`);
      } else {
        setResult(data);
      }
    } catch (e: any) {
      setError(e.message || 'Şəbəkə xətası');
    } finally {
      setSubmitting(false);
    }
  };

  const previewLines = rawText ? rawText.split(/\r?\n/).filter(Boolean) : [];
  const colCount = previewLines[0]?.split('\t').length ?? 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-gray-500 hover:text-gray-900 inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Admin
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Hazır nəticə yüklə</h1>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <p className="text-gray-600 text-sm mb-1">
            Bu səhifə xarici sistemdə artıq yoxlanılmış imtahan nəticələrini (TSV faylı) qəbul edir.
          </p>
          <p className="text-gray-500 text-xs">
            Dəstəklənən formatlar: <b>Standard (155)</b>, <b>Qəbul (155)</b>, <b>Blok (196)</b>, <b>Buraxılış (68)</b>, <b>2025 sadə (55)</b>. Format avtomatik aşkarlanır.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <section className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Məlumatlar</h2>

            <label className="block mb-4">
              <span className="block text-sm font-medium text-gray-700 mb-1">İmtahan adı *</span>
              <input
                type="text"
                value={examName}
                onChange={e => setExamName(e.target.value)}
                placeholder="məs: Mart Buraxılış 2026"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </label>

            <label className="block mb-4">
              <span className="block text-sm font-medium text-gray-700 mb-1 inline-flex items-center gap-1">
                <Calendar className="w-4 h-4" /> Tarix
              </span>
              <input
                type="date"
                value={examDate}
                onChange={e => setExamDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </label>

            <label className="block mb-4">
              <span className="block text-sm font-medium text-gray-700 mb-1">Keçirən tərəf</span>
              <select
                value={conductor}
                onChange={e => setConductor(e.target.value as Conductor)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="azeri">Azeri</option>
                <option value="reduco">Reduco</option>
              </select>
            </label>

            <label className="block mb-1">
              <span className="block text-sm font-medium text-gray-700 mb-1">Ballıq sistemi</span>
              <div className="grid grid-cols-3 gap-2">
                {MAX_SCORE_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setMaxScore(opt)}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold border transition ${
                      maxScore === opt
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400'
                    }`}
                  >
                    {opt} ballıq
                  </button>
                ))}
              </div>
            </label>
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">TSV faylı</h2>

            <div
              onDragOver={e => e.preventDefault()}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition"
            >
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-700 font-medium">
                Faylı bura sürükləyin və ya klikləyin
              </p>
              <p className="text-xs text-gray-500 mt-1">
                .txt / .tsv (Tab ilə ayrılmış)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.tsv,text/plain,text/tab-separated-values"
                onChange={onFileChange}
                className="hidden"
              />
            </div>

            {fileName && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center gap-3 text-sm">
                <FileText className="w-4 h-4 text-gray-500" />
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{fileName}</div>
                  <div className="text-gray-500 text-xs">
                    {previewLines.length} sətir &middot; {colCount} sütun
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-800">{error}</div>
          </div>
        )}

        {result?.success && (
          <div className="mt-6 p-5 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold text-green-900">İmtahan saxlanıldı.</div>
                <div className="mt-2 text-sm text-green-800 space-y-1">
                  <div>Format: <b>{result.format}</b> &middot; Tip: <b>{result.examType}</b></div>
                  <div>Tələbə sayı: <b>{result.count}</b></div>
                  <div>Siniflər: <b>{result.classes?.join(', ') || '—'}</b></div>
                  <div>Variantlar: <b>{result.variants?.join(', ') || '—'}</b></div>
                  <div>Fənnlər: <b>{result.subjectNames?.join(', ')}</b></div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Link
                    href="/admin/exams"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                  >
                    İmtahanlar siyahısına bax
                  </Link>
                  <button
                    onClick={reset}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                  >
                    Yeni yüklə
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-3 justify-end">
          <button
            onClick={reset}
            disabled={submitting}
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Sıfırla
          </button>
          <button
            onClick={submit}
            disabled={submitting || !examName.trim() || !rawText.trim()}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 inline-flex items-center gap-2"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitting ? 'Saxlanılır...' : 'Əlavə et'}
          </button>
        </div>
      </main>
    </div>
  );
}
