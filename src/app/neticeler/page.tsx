'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Search, Download, AlertTriangle, CheckCircle2, Trophy, BookOpen, BarChart3, XCircle } from 'lucide-react';
import type { GradedStudent } from '@/lib/grading';

interface SubjectScore {
  correct: number;
  incorrect: number;
  unanswered: number;
  netScore: number;
}

interface ExamResult {
  examName: string;
  examDate: string;
  ad: string;
  soyad: string;
  ataAdi: string;
  isNomresi: string;
  sinif: string;
  qrup: string;
  variant: string;
  totalNetScore: number;
  maxScore: number;
  subjectScores: Record<string, SubjectScore>;
  rank: number;
  totalStudents: number;
  status: string;
  examType: string;
}

const SUBJECT_NAMES: Record<string, string> = {
  azDili: 'Azərbaycan dili',
  riyaziyyat: 'Riyaziyyat',
  xariciDil: 'Xarici dil',
  mentiq: 'Məntiq',
  tarix: 'Tarix',
  cografiya: 'Coğrafiya',
  fizika: 'Fizika',
  kimya: 'Kimya',
  biologiya: 'Biologiya',
  edebiyyat: 'Ədəbiyyat',
  informatika: 'İnformatika',
};

function ResultsContent() {
  const searchParams = useSearchParams();
  const examId = searchParams.get('examId');
  const workNumber = searchParams.get('workNumber');

  const [result, setResult] = useState<ExamResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    if (!result) return;
    setIsDownloading(true);
    try {
      const { generateStudentPDF } = await import('@/lib/pdf-utils');
      const { CLASS_CONFIGS, BURAXILIS_CONFIGS, DEFAULT_SUBJECT_CONFIG } = await import('@/lib/omr-parser');

      let configToUse = DEFAULT_SUBJECT_CONFIG;
      if (result.examType === 'buraxilis') {
        configToUse = BURAXILIS_CONFIGS[result.sinif] || BURAXILIS_CONFIGS['11'] || DEFAULT_SUBJECT_CONFIG;
      } else {
        configToUse = CLASS_CONFIGS[result.sinif] || DEFAULT_SUBJECT_CONFIG;
      }

      const gradedStudent: GradedStudent = {
        id: "pdf-doc",
        originalLine: "",
        ad: result.ad,
        soyad: result.soyad,
        ataAdi: result.ataAdi || "",
        isNomresi: result.isNomresi,
        mekteb: "",
        sinif: result.sinif,
        dil: "",
        variant: result.variant,
        bolme: "",
        sinfinAdi: "",
        cins: "",
        qrup: result.qrup || "",
        fullAnswerString: "",
        subjects: {},
        isValid: true,
        scores: {
            totalNetScore: result.totalNetScore,
            ...result.subjectScores
        }
      };

      const blob = await generateStudentPDF(
        gradedStudent,
        configToUse,
        {
            examName: result.examName,
            examDate: result.examDate,
            examType: result.examType as 'buraxilis' | 'standard',
            includeRank: true
        },
        result.rank,
        result.totalStudents
      );

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${result.ad}_${result.soyad}_netice.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF yüklənərkən xəta:", err);
      alert("PDF yüklənərkən xəta baş verdi.");
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    if (!examId || !workNumber) {
      setError('Yanlış keçid. Zəhmət olmasa ana səhifədən axtarış edin.');
      setIsLoading(false);
      return;
    }
    async function fetchResult() {
      try {
        const res = await fetch('/api/public/results', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ examId, workNumber }),
        });
        const data = await res.json();
        if (data.success) {
          setResult(data.result);
        } else {
          setError(data.error || 'Nəticə tapılmadı.');
        }
      } catch {
        setError('Sistem xətası baş verdi.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchResult();
  }, [examId, workNumber]);

  const scorePercent = result ? Math.min((result.totalNetScore / result.maxScore) * 100, 100) : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto text-brand-red" size={40} />
          <p className="mt-3 text-gray-500">Nəticə yüklənir...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <XCircle size={28} className="text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Nəticə tapılmadı</h1>
          <p className="text-gray-500 text-sm mb-5">{error}</p>
          <Link
            href="/#exam-search"
            className="inline-flex items-center gap-2 bg-brand-red text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-brand-red-dark transition-colors"
          >
            <ArrowLeft size={16} />
            Yenidən axtarış
          </Link>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const subjectEntries = Object.entries(result.subjectScores);
  const totalCorrect = subjectEntries.reduce((sum, [, s]) => sum + s.correct, 0);
  const totalIncorrect = subjectEntries.reduce((sum, [, s]) => sum + s.incorrect, 0);
  const totalUnanswered = subjectEntries.reduce((sum, [, s]) => sum + s.unanswered, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky top bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/#exam-search"
            className="inline-flex items-center gap-1.5 text-gray-500 hover:text-brand-red transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Geri qayıt</span>
          </Link>
          <p className="text-xs text-gray-400 truncate max-w-[200px] sm:max-w-none">{result.examName}</p>
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="inline-flex items-center gap-1.5 bg-brand-red text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-brand-red-dark transition-colors disabled:opacity-50"
          >
            {isDownloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            <span className="hidden sm:inline">PDF Yüklə</span>
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-5 sm:py-8">

        {/* === HEADER CARD === */}
        <div className="bg-gradient-to-r from-brand-red to-brand-red-dark rounded-2xl p-5 sm:px-6 text-white relative overflow-hidden shadow-lg mb-4">
          <div className="absolute -top-8 -right-8 w-28 h-28 bg-white/5 rounded-full" />
          
          <div className="relative z-10 flex items-center gap-4 sm:gap-6">
            <div className="flex-1 min-w-0">
              <p className="text-white/40 text-[10px] uppercase tracking-widest mb-0.5 font-medium">İmtahan nəticəsi</p>
              <h1 className="text-lg sm:text-xl font-bold leading-snug">
                {result.ad} {result.soyad}
                {result.ataAdi && <span className="font-normal text-white/60 ml-1">{result.ataAdi}</span>}
              </h1>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="bg-white/15 px-2.5 py-0.5 rounded-full text-[11px] font-medium">İş №: {result.isNomresi}</span>
                <span className="bg-white/15 px-2.5 py-0.5 rounded-full text-[11px] font-medium">Sinif: {result.sinif}</span>
                {result.qrup && <span className="bg-white/15 px-2.5 py-0.5 rounded-full text-[11px] font-medium">Qrup: {result.qrup}</span>}
                <span className="bg-white/15 px-2.5 py-0.5 rounded-full text-[11px] font-medium">Variant: {result.variant}</span>
              </div>
            </div>

            {/* Score circle */}
            <div className="flex-shrink-0">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="7" />
                  <circle
                    cx="60" cy="60" r="52"
                    fill="none" stroke="white" strokeWidth="7" strokeLinecap="round"
                    strokeDasharray={`${scorePercent * 3.27} ${327 - scorePercent * 3.27}`}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="block text-lg sm:text-xl font-black leading-none">{result.totalNetScore.toFixed(1)}</span>
                    <span className="block text-white/40 text-[9px] sm:text-[10px] font-medium mt-0.5">/ {result.maxScore}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === STAT CARDS — 2x2 on mobile, 4 on desktop === */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-4">
          <div className="bg-white rounded-xl p-3.5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 size={18} className="text-green-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 leading-none">{totalCorrect}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Doğru</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3.5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                <XCircle size={18} className="text-red-500" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 leading-none">{totalIncorrect}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Səhv</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3.5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                <Trophy size={18} className="text-amber-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-brand-red leading-none">{result.rank}<span className="text-xs font-normal text-gray-400">/{result.totalStudents}</span></p>
                <p className="text-[11px] text-gray-400 mt-0.5">Sıra</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3.5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <BarChart3 size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 leading-none">{scorePercent.toFixed(0)}%</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Uğur</p>
              </div>
            </div>
          </div>
        </div>

        {/* === SUBJECTS — Card-based for mobile, Table for desktop === */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex items-center gap-2.5">
            <BookOpen size={18} className="text-brand-red" />
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Fənlər üzrə nəticələr</h2>
          </div>

          {/* Mobile: Card layout */}
          <div className="sm:hidden divide-y divide-gray-100">
            {subjectEntries.map(([key, score]) => {
              const name = SUBJECT_NAMES[key] || key;
              const total = score.correct + score.incorrect + score.unanswered;
              const pct = total > 0 ? (score.correct / total) * 100 : 0;
              return (
                <div key={key} className="px-4 py-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900 text-sm">{name}</span>
                    <span className="text-lg font-bold text-gray-900">{score.netScore.toFixed(1)}</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex gap-4 text-xs">
                    <span className="text-green-600 font-medium">{score.correct} doğru</span>
                    <span className="text-red-500 font-medium">{score.incorrect} səhv</span>
                    <span className="text-gray-400">{score.unanswered} boş</span>
                  </div>
                </div>
              );
            })}
            {/* Mobile total */}
            <div className="px-4 py-3.5 bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 text-sm">TOPLAM</span>
                <span className="text-xl font-bold text-brand-red">{result.totalNetScore.toFixed(1)}</span>
              </div>
              <div className="flex gap-4 text-xs mt-1">
                <span className="text-green-600 font-medium">{totalCorrect} doğru</span>
                <span className="text-red-500 font-medium">{totalIncorrect} səhv</span>
                <span className="text-gray-400">{totalUnanswered} boş</span>
              </div>
            </div>
          </div>

          {/* Desktop: Table layout */}
          <div className="hidden sm:block">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                  <th className="text-left px-6 py-3 font-semibold">Fənn</th>
                  <th className="text-center px-3 py-3 font-semibold text-green-600">Doğru</th>
                  <th className="text-center px-3 py-3 font-semibold text-red-500">Səhv</th>
                  <th className="text-center px-3 py-3 font-semibold text-gray-400">Boş</th>
                  <th className="text-right px-6 py-3 font-semibold text-brand-red">Xalis bal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {subjectEntries.map(([key, score]) => {
                  const name = SUBJECT_NAMES[key] || key;
                  const total = score.correct + score.incorrect + score.unanswered;
                  const pct = total > 0 ? (score.correct / total) * 100 : 0;
                  return (
                    <tr key={key} className="hover:bg-gray-50/60 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 text-sm">{name}</div>
                        <div className="mt-1.5 w-full max-w-[140px] h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </td>
                      <td className="text-center px-3 py-4">
                        <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-green-50 text-green-700 font-bold text-sm group-hover:bg-green-100 transition-colors">{score.correct}</span>
                      </td>
                      <td className="text-center px-3 py-4">
                        <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-red-50 text-red-600 font-bold text-sm group-hover:bg-red-100 transition-colors">{score.incorrect}</span>
                      </td>
                      <td className="text-center px-3 py-4">
                        <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gray-50 text-gray-400 font-bold text-sm group-hover:bg-gray-100 transition-colors">{score.unanswered}</span>
                      </td>
                      <td className="text-right px-6 py-4">
                        <span className="text-lg font-bold text-gray-900">{score.netScore.toFixed(1)}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 border-t-2 border-gray-200 font-bold">
                  <td className="px-6 py-4 text-gray-900 text-sm">TOPLAM</td>
                  <td className="text-center px-3 py-4 text-green-700">{totalCorrect}</td>
                  <td className="text-center px-3 py-4 text-red-600">{totalIncorrect}</td>
                  <td className="text-center px-3 py-4 text-gray-400">{totalUnanswered}</td>
                  <td className="text-right px-6 py-4 text-brand-red text-lg">{result.totalNetScore.toFixed(1)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center pb-4">
          <Link
            href="/#exam-search"
            className="inline-flex items-center gap-2 text-brand-red hover:text-brand-red-dark font-semibold transition-colors text-sm sm:text-base"
          >
            <Search size={16} />
            Başqa nəticə axtarışı et
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPageWrapper() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto text-brand-red" size={40} />
          <p className="mt-3 text-gray-500">Səhifə yüklənir...</p>
        </div>
      </div>
    }>
      <ResultsContent />
    </React.Suspense>
  );
}
