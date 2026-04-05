import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ExamSession from '@/models/Exam';

// POST /api/public/results
// Search for a student's result inside a specific exam session
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { examId, workNumber, studentClass, group, department } = body;

    if (!examId || !workNumber) {
      return NextResponse.json(
        { success: false, error: 'İmtahan və İş nömrəsi daxil edilməlidir.' },
        { status: 400 }
      );
    }

    // Find the specific exam by ID
    const exam = await ExamSession.findById(examId).lean();
    if (!exam) {
      return NextResponse.json(
        { success: false, error: 'Seçilmiş imtahan tapılmadı.' },
        { status: 404 }
      );
    }

    // We search the `students` array manually.
    // In a huge collection size, doing this in-memory for 500-1000 items is extremely fast.
    // However, we can also use aggregation if the array grows.
    
    // Clean inputs
    const cleanWorkNumber = workNumber.toString().trim();
    
    const studentResult = exam.students.find((s: any) => s.isNomresi === cleanWorkNumber);

    if (!studentResult) {
      return NextResponse.json(
        { success: false, error: 'Bu iş nömrəsinə aid nəticə tapılmadı.' },
        { status: 404 }
      );
    }

    // Optional Class/Group/Department mapping validations (if user provided them)
    // We won't block them if they differ slightly, but we could if strict enforcement is needed.

    // Calculate total possible score based on standard vs buraxilis (this is just for UI context)
    const maxScore = exam.examType === 'buraxilis' ? 700 : 300;

    // Return the specific student data
    return NextResponse.json({
      success: true,
      result: {
        examType: exam.examType,
        conductor: exam.conductor || 'azeri',
        examName: exam.examName,
        examDate: exam.examDate,
        ad: studentResult.ad,
        soyad: studentResult.soyad,
        ataAdi: studentResult.ataAdi,
        isNomresi: studentResult.isNomresi,
        sinif: studentResult.sinif,
        qrup: studentResult.qrup,
        variant: studentResult.variant,
        totalNetScore: studentResult.totalNetScore,
        maxScore: maxScore,
        subjectScores: studentResult.subjectScores,
        rank: studentResult.rank,
        totalStudents: studentResult.totalStudents || exam.validStudents,
        status: 'Uğurlu'
      }
    });

  } catch (err: any) {
    console.error('[API /public/results POST]', err);
    return NextResponse.json(
      { success: false, error: 'Axtarış zamanı xəta baş verdi.' },
      { status: 500 }
    );
  }
}
