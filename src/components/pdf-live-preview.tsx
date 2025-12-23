"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { ExamResultPDF } from "@/lib/pdf-generator";
import { GradedStudent, SubjectScore } from "@/lib/grading";
import { SubjectConfig } from "@/lib/omr-parser";

// Dynamically import PDFViewer with ssr: false to avoid server-side issues
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <p className="text-center p-10">Loading PDF Viewer...</p>,
  }
);

export default function PdfLivePreview() {
  // Dummy Configuration mimicking 2nd Grade
  const dummyConfig: SubjectConfig[] = useMemo(
    () => [
      { id: "azDili", name: "Azərbaycan dili", length: 15, points: 10, color: "" },
      { id: "riyaziyyat", name: "Riyaziyyat", length: 15, points: 10, color: "" },
      { id: "heyatBilgisi", name: "Həyat Bilgisi", length: 10, points: 10, color: "" },
      { id: "mentiq", name: "Məntiq", length: 10, points: 10, color: "" },
      { id: "xariciDil", name: "Xarici Dil", length: 10, points: 10, color: "" },
    ],
    []
  );

  // Dummy Scores
  const dummyScores: Record<string, SubjectScore> = {
    azDili: {
      correct: 12,
      incorrect: 3,
      unanswered: 0,
      netScore: 120, // 12 * 10
      studentAnswerString: "ABCDEABCDEABCDE",
      correctAnswerString: "ABCDEabcdeABCDE", // Case mismatch implies error in simple model, but here just testing
    },
    riyaziyyat: {
      correct: 10,
      incorrect: 5,
      unanswered: 0,
      netScore: 100,
      studentAnswerString: "123451234512345",
      correctAnswerString: "123456789012345",
    },
    heyatBilgisi: {
      correct: 8,
      incorrect: 2,
      unanswered: 0,
      netScore: 80,
      studentAnswerString: "AAAAABBBBB",
      correctAnswerString: "AAAAABBBBB",
    },
    mentiq: {
      correct: 5,
      incorrect: 5,
      unanswered: 0,
      netScore: 50,
      studentAnswerString: "AAAAAXXXXX",
      correctAnswerString: "AAAAABBBBB",
    },
    xariciDil: {
      correct: 9,
      incorrect: 1,
      unanswered: 0,
      netScore: 90,
      studentAnswerString: "ABCDEFGHIJ",
      correctAnswerString: "ABCDEFGHIJ",
    },
  };

  // Dummy Student Data
  const dummyStudent: GradedStudent = useMemo(
    () => ({
      id: "dummy-123",
      originalLine: "",
      ad: "Tural",
      soyad: "Əliyev",
      ataAdi: "Vəli",
      isNomresi: "12345",
      mekteb: "Sumqayıt 1 nömrəli",
      sinif: "02",
      dil: "A",
      variant: "A",
      bolme: "R",
      sinfinAdi: "A",
      cins: "K",
      qrup: "",
      fullAnswerString: "",
      subjects: {},
      isValid: true,
      scores: {
        totalNetScore: 440,
        ...dummyScores,
      },
    }),
    []
  );

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100">
      <div className="bg-white p-4 border-b border-gray-200 shadow-sm flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">PDF Live Preview</h1>
        <p className="text-sm text-gray-500">
          Edit src/lib/pdf-generator.tsx to see changes.
        </p>
      </div>
      <div className="flex-1 p-8">
        <PDFViewer width="100%" height="100%" className="rounded-lg shadow-lg">
          <ExamResultPDF
            student={dummyStudent}
            config={dummyConfig}
            examDate={new Date().toISOString()}
            rank={1}
            totalStudents={100}
            examName="Sınaq İmtahanı"
          />
        </PDFViewer>
      </div>
    </div>
  );
}
