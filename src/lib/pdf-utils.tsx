'use client';

import React from 'react';
// import { pdf } from '@react-pdf/renderer'; // Removed for lazy loading
import { ExamResultPDF } from './pdf-generator';
import { GradedStudent } from './grading';
import { SubjectConfig } from './omr-parser';

export interface PDFGenerationOptions {
  examName: string;
  examDate: string;
  includeRank?: boolean;
  examType?: 'standard' | 'buraxilis';
}

/**
 * Generate a single PDF blob for a student
 */
export async function generateStudentPDF(
  student: GradedStudent,
  config: SubjectConfig[],
  options: PDFGenerationOptions,
  rank?: number,
  totalStudents?: number
): Promise<Blob> {
  // Determine which template to render
  let doc: React.ReactElement;

  if (options.examType === 'buraxilis') {
    const { BuraxilisExamResultPDF } = await import('./pdf-buraxilis');
    doc = (
      <BuraxilisExamResultPDF
        student={student}
        config={config}
        examName={options.examName}
        examDate={options.examDate}
        rank={options.includeRank ? rank : undefined}
        totalStudents={totalStudents}
      />
    );
  } else {
    doc = (
      <ExamResultPDF
        student={student}
        config={config}
        examName={options.examName}
        examDate={options.examDate}
        examType={options.examType}
        rank={options.includeRank ? rank : undefined}
        totalStudents={totalStudents}
      />
    );
  }

  const { pdf } = await import('@react-pdf/renderer');
  const asPdf = pdf(doc as any);
  const blob = await asPdf.toBlob();
  return blob;
}

/**
 * Generate a combined PDF with all students
 */
export async function generateCombinedPDF(
  students: GradedStudent[],
  configMap: Record<string, SubjectConfig[]>,
  options: PDFGenerationOptions
): Promise<Blob> {
  // Calculate ranks if needed
  const studentsWithScores = students
    .filter(s => s.isValid && s.scores)
    .map(s => ({
      student: s,
      score: s.scores!.totalNetScore,
    }))
    .sort((a, b) => b.score - a.score);

  const rankMap = new Map<string, number>();
  let currentRank = 1;
  let previousScore = Infinity;

  studentsWithScores.forEach(({ student, score }, index) => {
    if (score < previousScore) {
      currentRank = index + 1;
      previousScore = score;
    }
    rankMap.set(student.id, currentRank);
  });

  const totalStudents = studentsWithScores.length;

  // Prepare student data with configs and ranks
  const studentData = students
    .filter(s => s.isValid && s.scores)
    .map(student => ({
      student,
      config: configMap[student.sinif] || configMap['default'] || [],
      rank: options.includeRank ? rankMap.get(student.id) : undefined,
    }));

  // Generate combined PDF
  let doc: React.ReactElement;
  
  if (options.examType === 'buraxilis') {
    const { CombinedBuraxilisExamResultPDF } = await import('./pdf-buraxilis-combined');
    doc = (
      <CombinedBuraxilisExamResultPDF
        students={studentData}
        examName={options.examName}
        examDate={options.examDate}
        totalStudents={totalStudents}
      />
    );
  } else {
    const { CombinedExamResultPDF } = await import('./pdf-combined');
    doc = (
      <CombinedExamResultPDF
        students={studentData}
        examName={options.examName}
        examDate={options.examDate}
        totalStudents={totalStudents}
      />
    );
  }

  const { pdf } = await import('@react-pdf/renderer');
  const asPdf = pdf(doc as any);
  const blob = await asPdf.toBlob();
  return blob;
}

/**
 * Download a single PDF
 */
export function downloadPDF(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Download combined PDF with all students
 */
export async function downloadCombinedPDF(blob: Blob, examName: string) {
  const sanitizedName = examName
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_]/g, '')
    .slice(0, 50);
  
  const filename = `imtahan_nəticələri_${sanitizedName}_${new Date().toISOString().split('T')[0]}.pdf`;
  
  downloadPDF(blob, filename);
}

