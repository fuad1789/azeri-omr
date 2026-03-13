import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import ExamSession from '@/models/Exam';

// Increase body size limit to 10MB to support large exam results
export const maxDuration = 30;
export const dynamic = 'force-dynamic';

// POST /api/exams — save a new exam session
export async function POST(req: NextRequest) {
  try {
    const authSession = await getServerSession(authOptions);
    if (!authSession) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();
    const { examName, examDate, examType, students } = body;

    if (!examName || !examDate || !examType || !Array.isArray(students)) {
      return NextResponse.json(
        { success: false, error: 'Məlumatlar natamamdır.' },
        { status: 400 }
      );
    }

    const validStudents = students.filter((s: any) => s.isValid && s.scores);

    // Build student result records
    const studentResults = validStudents.map((s: any, idx: number) => ({
      ad:         s.ad || '',
      soyad:      s.soyad || '',
      ataAdi:     s.ataAdi || '',
      isNomresi:  s.isNomresi || '',
      mekteb:     s.mekteb || '',
      sinif:      s.sinif || '',
      sinfinAdi:  s.sinfinAdi || '',
      dil:        s.dil || '',
      variant:    s.variant || '',
      bolme:      s.bolme || '',
      cins:       s.cins || '',
      qrup:       s.qrup || '',
      fullAnswerString: s.fullAnswerString || '',
      totalNetScore: s.scores?.totalNetScore ?? 0,
      subjectScores: (() => {
        const result: Record<string, any> = {};
        if (s.scores) {
          Object.entries(s.scores).forEach(([key, val]) => {
            if (key !== 'totalNetScore' && typeof val === 'object') {
              result[key] = val;
            }
          });
        }
        return result;
      })(),
      rank:         s.rank,
      totalStudents: validStudents.length,
    }));

    const classes = Array.from(new Set(studentResults.map((s: any) => s.sinif).filter(Boolean)));
    const variants = Array.from(new Set(studentResults.map((s: any) => s.variant).filter(Boolean)));
    const groups = Array.from(new Set(studentResults.map((s: any) => s.bolme || s.qrup).filter(Boolean)));

    const savedRecord = await ExamSession.create({
      examName,
      examDate,
      examType,
      totalStudents: students.length,
      validStudents: validStudents.length,
      students: studentResults,
      classes,
      variants,
      groups,
      savedAt: new Date(),
    });

    return NextResponse.json(
      { success: true, id: savedRecord._id, count: studentResults.length },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('[API /exams POST]', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Server xətası' },
      { status: 500 }
    );
  }
}

// GET /api/exams — list saved sessions
export async function GET() {
  try {
    const authSession = await getServerSession(authOptions);
    if (!authSession) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const sessions = await ExamSession.find({}).sort({ savedAt: -1 }).limit(100);

    return NextResponse.json({ success: true, data: sessions });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// PUT /api/exams?id=xxx — update exam metadata
export async function PUT(req: NextRequest) {
  try {
    const authSession = await getServerSession(authOptions);
    if (!authSession) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID tələb olunur' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { examName, examDate, examType } = body;

    const updateData: Record<string, any> = {};
    if (examName) updateData.examName = examName;
    if (examDate) updateData.examDate = examDate;
    if (examType) updateData.examType = examType;

    const updated = await ExamSession.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'İmtahan tapılmadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    console.error('[API /exams PUT]', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Server xətası' },
      { status: 500 }
    );
  }
}

// DELETE /api/exams?id=xxx — delete exam session
export async function DELETE(req: NextRequest) {
  try {
    const authSession = await getServerSession(authOptions);
    if (!authSession) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID tələb olunur' },
        { status: 400 }
      );
    }

    const deleted = await ExamSession.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'İmtahan tapılmadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'İmtahan silindi' });
  } catch (err: any) {
    console.error('[API /exams DELETE]', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Server xətası' },
      { status: 500 }
    );
  }
}
