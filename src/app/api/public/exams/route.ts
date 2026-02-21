import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ExamSession from '@/models/Exam';

// GET /api/public/exams
// Returns a list of all saved exams (ID and Name) for the public dropdown
export async function GET() {
  try {
    await connectDB();
    
    // Fetch only the necessary fields, sort by newest first
    const exams = await ExamSession.find({}, {
      _id: 1,
      examName: 1,
      examDate: 1,
      examType: 1,
      classes: 1,
      groups: 1
    }).sort({ savedAt: -1 }).lean();

    // Map to a simpler format for the frontend select dropdown
    const formattedExams = exams.map((exam: any) => ({
      id: exam._id.toString(),
      name: `${exam.examName} (${exam.examDate})`,
      type: exam.examType,
      classes: exam.classes || [],
      groups: exam.groups || []
    }));

    return NextResponse.json({ success: true, exams: formattedExams });
  } catch (err: any) {
    console.error('[API /public/exams GET]', err);
    return NextResponse.json(
      { success: false, error: 'İmtahan məlumatları yüklənmədi.' },
      { status: 500 }
    );
  }
}
