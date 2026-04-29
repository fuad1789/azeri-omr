import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import ExamSession from '@/models/Exam';
import { parseResultsTSV, ParsedRow, SubjectResult } from '@/lib/results-parser';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

interface ImportBody {
  examName: string;
  examDate?: string;
  conductor?: 'azeri' | 'reduco';
  maxScore?: number;
  rawText: string;
}

const ALLOWED_MAX_SCORES = new Set([300, 400, 700]);

// Map a single subject block into the IStudentResult.subjectScores schema
function mapSubject(s: SubjectResult) {
  const totalAnswered = s.dogruSayi + s.sehvSayi;
  const unanswered = Math.max(0, s.sualSayi - totalAnswered);
  return {
    correct: s.dogruSayi,
    incorrect: s.sehvSayi,
    unanswered,
    netScore: s.nisbiBal,           // pre-graded "Nisbi bal"
    studentAnswerString: s.cavabiniz,
    correctAnswerString: s.dogruCavablar,
  };
}

// Normalize categorical identity fields to upper-case so that "A"/"a", "k"/"K"
// etc. are treated as the same group. Names and answer strings are NOT touched.
const norm = (v: string) => (v ?? '').trim().toUpperCase();

function mapRow(row: ParsedRow) {
  const subjectScores: Record<string, ReturnType<typeof mapSubject>> = {};
  let fullStudent = '';
  for (const [name, subj] of Object.entries(row.subjects)) {
    if (!subj.cavabiniz && !subj.dogruCavablar) continue;
    subjectScores[name] = mapSubject(subj);
    fullStudent += subj.cavabiniz;
  }
  return {
    ad: row.ad,
    soyad: row.soyad,
    ataAdi: row.ataAdi,
    isNomresi: row.isNomresi.trim(),
    mekteb: row.mekteb.trim(),
    sinif: norm(row.sinif),
    sinfinAdi: norm(row.sinfinAdi),
    dil: norm(row.dil),
    variant: norm(row.variant),
    bolme: norm(row.bolme),
    cins: norm(row.cins),
    qrup: norm(row.qrup),
    fullAnswerString: fullStudent,
    totalNetScore: row.totals.bal,
    subjectScores,
    rank: row.totals.sira,
  };
}

// POST /api/results-import — parse pre-graded TSV and store an exam session
export async function POST(req: NextRequest) {
  try {
    const auth = await getServerSession(authOptions);
    if (!auth) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await req.json()) as Partial<ImportBody>;
    const examName = (body.examName ?? '').trim();
    const rawText = body.rawText ?? '';

    if (!examName) {
      return NextResponse.json({ success: false, error: 'İmtahan adı boş ola bilməz.' }, { status: 400 });
    }
    if (!rawText.trim()) {
      return NextResponse.json({ success: false, error: 'Fayl məzmunu boşdur.' }, { status: 400 });
    }

    let parsed;
    try {
      parsed = parseResultsTSV(rawText);
    } catch (e: any) {
      return NextResponse.json({ success: false, error: `Parse xətası: ${e.message}` }, { status: 400 });
    }

    if (parsed.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Heç bir tələbə tapılmadı.' }, { status: 400 });
    }

    await connectDB();

    // Map result-parser format → exam.examType
    // 'buraxilis' and 'blok' both use the buraxılış-style scoring (open + yazı işi)
    const examType: 'standard' | 'buraxilis' =
      parsed.format === 'buraxilis' || parsed.format === 'blok' ? 'buraxilis' : 'standard';

    const students = parsed.rows.map(mapRow);
    students.forEach(s => { (s as any).totalStudents = students.length; });

    const classes = Array.from(new Set(students.map(s => s.sinif).filter(Boolean)));
    const variants = Array.from(new Set(students.map(s => s.variant).filter(Boolean)));
    // Group aggregation: prefer `qrup` when present (qebul/blok blocks 1–5),
    // fall back to `bolme` for legacy/standard exports where qrup is empty.
    const groups = Array.from(new Set(
      students.map(s => s.qrup || s.bolme).filter(Boolean)
    ));

    const examDate = body.examDate || new Date().toISOString().slice(0, 10);
    const conductor = body.conductor || 'azeri';
    const maxScore = ALLOWED_MAX_SCORES.has(Number(body.maxScore))
      ? Number(body.maxScore)
      : (examType === 'buraxilis' && conductor === 'reduco' ? 700 : 300);

    const saved = await ExamSession.create({
      examName,
      examDate,
      examType,
      conductor,
      maxScore,
      totalStudents: students.length,
      validStudents: students.length,
      students,
      classes,
      variants,
      groups,
      savedAt: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        id: saved._id,
        format: parsed.format,
        examType,
        maxScore,
        count: students.length,
        subjectNames: parsed.subjectNames,
        classes,
        variants,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('[API /results-import]', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Server xətası' },
      { status: 500 }
    );
  }
}
