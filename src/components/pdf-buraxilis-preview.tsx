"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { BuraxilisExamResultPDF } from "@/lib/pdf-buraxilis";
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

export default function BuraxilisPdfPreview() {
  // Dummy Configuration mimicking 11th Grade Buraxilis
  const dummyConfig: SubjectConfig[] = useMemo(
    () => [
      { 
          id: "azDili", 
          name: "Azərbaycan dili", 
          length: 30, 
          points: 100, 
          color: "",
          segments: [
             { type: 'closed' as const, count: 20, weight: 1, points: 0, lengthPerItem: 1 },
             { type: 'open' as const, count: 0, weight: 1, lengthPerItem: 1, points: 0 },
             { type: 'written' as const, count: 10, weight: 1, points: 0, lengthPerItem: 1 }
          ]
      },
      { 
          id: "riyaziyyat", 
          name: "Riyaziyyat", 
          length: 25, 
          points: 100, 
          color: "",
          segments: [
             { type: 'closed' as const, count: 13, weight: 1, points: 0, lengthPerItem: 1 },
             { type: 'open' as const, count: 5, weight: 1, lengthPerItem: 4, points: 0 },
             { type: 'written' as const, count: 7, weight: 1, points: 0, lengthPerItem: 1 }
          ]
      },
      { 
          id: "xariciDil", 
          name: "Xarici Dil", 
          length: 30, 
          points: 100, 
          color: "",
          segments: [
             { type: 'closed' as const, count: 23, weight: 1, points: 0, lengthPerItem: 1 },
             { type: 'open' as const, count: 0, weight: 1, lengthPerItem: 1, points: 0 },
             { type: 'written' as const, count: 7, weight: 1, points: 0, lengthPerItem: 1 }
          ]
      },
    ],
    []
  );

  // Dummy Scores matching the image roughly
  const dummyScores: Record<string, SubjectScore> = {
    azDili: {
      correct: 17,
      incorrect: 11,
      unanswered: 2,
      netScore: 55,
      correctAnswerString: "DDABEABACCEBCEEDAACA1222022222",
      studentAnswerString: "A EDAEBEEEECEADBACA1120112222 ",
    },
    riyaziyyat: {
      correct: 4,
      incorrect: 14,
      unanswered: 7,
      netScore: 12.5,
      correctAnswerString: "BCBCBDCCDCBAB115295242725126382142122222",
      studentAnswerString: "ACEACDBEACDCB276 14  24  18  27  0000000",
    },
    xariciDil: {
      correct: 12,
      incorrect: 12,
      unanswered: 6,
      netScore: 35.13,
      correctAnswerString: "DEEEEECCDAACABDEBACAACE2222202",
      studentAnswerString: "DCACEECCDCABBBAAAAEAAEB0000002",
    },
  };

  // Dummy Student Data
  const dummyStudent: GradedStudent = useMemo(
    () => ({
      id: "dummy-43204",
      originalLine: "",
      ad: "ARZU",
      soyad: "HEYDeROVA",
      ataAdi: "",
      isNomresi: "43204",
      mekteb: "-",
      sinif: "11",
      dil: "A",
      variant: "A",
      bolme: "1",
      sinfinAdi: "A",
      cins: "K",
      qrup: "",
      fullAnswerString: "",
      subjects: {},
      isValid: true,
      scores: {
        totalNetScore: 102.63,
        ...dummyScores,
      },
    }),
    []
  );

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100">
      <div className="bg-white p-4 border-b border-gray-200 shadow-sm flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Buraxılış PDF Preview</h1>
        <p className="text-sm text-gray-500">
          Edit src/lib/pdf-buraxilis.tsx to see changes.
        </p>
      </div>
      <div className="flex-1 p-8">
        <PDFViewer width="100%" height="100%" className="rounded-lg shadow-lg">
          <BuraxilisExamResultPDF
            student={dummyStudent}
            config={dummyConfig}
            examDate={"2026-02-20"}
            totalStudents={100}
            examName="asasdl"
          />
        </PDFViewer>
      </div>
    </div>
  );
}
