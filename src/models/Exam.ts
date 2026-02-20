import mongoose, { Schema, Document, Model } from 'mongoose';

// --- SubjectScore (grading.ts-dən gəlir) ---
export interface ISubjectScore {
  correct: number;
  incorrect: number;
  unanswered: number;
  netScore: number;
  studentAnswerString: string;
  correctAnswerString: string;
}

// --- Tək şagird nəticəsi ---
export interface IStudentResult {
  // Şagird məlumatları
  ad: string;
  soyad: string;
  ataAdi: string;
  isNomresi: string;
  mekteb: string;
  sinif: string;
  sinfinAdi: string;
  dil: string;
  variant: string;
  bolme: string;
  cins: string;
  qrup: string;

  // Cavab stringi (tam)
  fullAnswerString: string;

  // Fənn üzrə nəticələr
  totalNetScore: number;
  subjectScores: Record<string, ISubjectScore>;

  // Sıra
  rank?: number;
  totalStudents?: number;
}

// --- İmtahan sənədi (bütün şagirdlər) ---
export interface IExamSession extends Document {
  examName: string;           // İmtahanın adı
  examDate: string;           // İmtahan tarixi (YYYY-MM-DD)
  examType: 'standard' | 'buraxilis'; // İmtahan tipi
  totalStudents: number;
  validStudents: number;
  students: IStudentResult[];
  savedAt: Date;
}

const SubjectScoreSchema = new Schema<ISubjectScore>(
  {
    correct:     { type: Number, default: 0 },
    incorrect:   { type: Number, default: 0 },
    unanswered:  { type: Number, default: 0 },
    netScore:    { type: Number, default: 0 },
    studentAnswerString: { type: String, default: '' },
    correctAnswerString: { type: String, default: '' },
  },
  { _id: false }
);

const StudentResultSchema = new Schema<IStudentResult>(
  {
    ad:         { type: String, default: '' },
    soyad:      { type: String, default: '' },
    ataAdi:     { type: String, default: '' },
    isNomresi:  { type: String, default: '' },
    mekteb:     { type: String, default: '' },
    sinif:      { type: String, default: '' },
    sinfinAdi:  { type: String, default: '' },
    dil:        { type: String, default: '' },
    variant:    { type: String, default: '' },
    bolme:      { type: String, default: '' },
    cins:       { type: String, default: '' },
    qrup:       { type: String, default: '' },

    fullAnswerString: { type: String, default: '' },

    totalNetScore:  { type: Number, default: 0 },
    subjectScores:  { type: Map, of: SubjectScoreSchema, default: {} },

    rank:           { type: Number },
    totalStudents:  { type: Number },
  },
  { _id: false }
);

const ExamSessionSchema = new Schema<IExamSession>(
  {
    examName:      { type: String, required: true },
    examDate:      { type: String, required: true },
    examType:      { type: String, enum: ['standard', 'buraxilis'], required: true },
    totalStudents: { type: Number, default: 0 },
    validStudents: { type: Number, default: 0 },
    students:      { type: [StudentResultSchema], default: [] },
    savedAt:       { type: Date, default: Date.now },
  },
  {
    collection: 'exams',
    timestamps: true,
  }
);

const ExamSession: Model<IExamSession> =
  mongoose.models.ExamSession ||
  mongoose.model<IExamSession>('ExamSession', ExamSessionSchema);

export default ExamSession;
