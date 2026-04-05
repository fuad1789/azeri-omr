"use client";

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { GradedStudent, SubjectScore } from "./grading";
import { SubjectConfig } from "./omr-parser";

// Register Roboto font from CDN
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf",
      fontWeight: 400,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf",
      fontWeight: 500,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf",
      fontWeight: 700,
    },
  ],
});

// Layout constants for A4 landscape (842pt x 595pt)
const PAGE_PADDING = 14;
const HEADER_HEIGHT = 50;
const FOOTER_HEIGHT = 30;
const TABLE_HEIGHT = 130; // Increased height for summary table to make it more prominent
const CONTENT_GAP = 10;

// Calculate available content height
// A4 landscape height: 595pt - padding (14*2) - header (50) - footer (30) - table (80) - gaps (10*2) = ~397pt
const AVAILABLE_CONTENT_HEIGHT =
  595 -
  PAGE_PADDING * 2 -
  HEADER_HEIGHT -
  FOOTER_HEIGHT -
  TABLE_HEIGHT -
  CONTENT_GAP * 2;

// Optimized styles with explicit fit-to-page strategy
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    padding: PAGE_PADDING,
    fontFamily: "Roboto",
  },
  container: {
    flex: 1,
    flexDirection: "column",
    height: "100%",
  },
  header: {
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
    marginBottom: 8,
  },
  headerInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 2, // Slight padding
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    borderRadius: 4,
    padding: 4,
  },
  headerTextLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#1E293B",
  },
  headerTextValue: {
    fontSize: 10,
    color: "#475569",
  },
  contentRow: {
    flexDirection: "row",
    flex: 1,
    minHeight: 0, // Allow flex shrinking
  },
  leftColumn: {
    width: "20%",
    flexDirection: "column",
    paddingRight: 10,
    minHeight: 0,
  },
  rightColumn: {
    width: "64%",
    flexDirection: "column",
    minHeight: 0,
    flex: 1,
    alignItems: "flex-end",
  },
  subjectsContainer: {
    flexDirection: "row",
    flex: 1,
    minHeight: 0,
    width: "90%",
    marginLeft: "auto",
  },
  subjectsColumn: {
    flex: 1,
    flexDirection: "column",
    paddingLeft: 60,
    minHeight: 0,
  },
  infoBox: {
    backgroundColor: "#F8FAFC",
    padding: 7,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 7,
  },
  infoLabel: {
    fontSize: 9,
    color: "#64748B",
    marginBottom: 2,
    fontWeight: "bold",
  },
  infoValue: {
    fontSize: 12,
    color: "#1E293B",
    fontWeight: "bold",
  },
  scoreBox: {
    backgroundColor: "#EEF2FF",
    padding: 10,
    borderRadius: 5,
    borderWidth: 4,
    borderColor: "#6366F1",
    alignItems: "center",
    marginRight: 7,
    flex: 1,
  },
  scoreLabel: {
    fontSize: 8,
    color: "#6366F1",
    marginBottom: 3,
    fontWeight: "bold",
  },
  scoreValue: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#4338CA",
  },
  rankBox: {
    backgroundColor: "#FEF3C7",
    padding: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#F59E0B",
    alignItems: "center",
    flex: 1,
  },
  rankLabel: {
    fontSize: 8,
    color: "#D97706",
    marginBottom: 3,
    fontWeight: "bold",
  },
  rankValue: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#B45309",
  },
  subjectSection: {
    marginBottom: 5,
    padding: 5,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 3,
  },
  subjectTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 3,
    paddingBottom: 2,
    borderBottomWidth: 2,
    borderBottomColor: "#E2E8F0",
  },
  answerRow: {
    flexDirection: "row",
    marginBottom: 2,
    alignItems: "center",
  },
  answerLabel: {
    fontSize: 9,
    color: "#64748B",
    width: 52,
    fontWeight: "bold",
  },
  answerString: {
    fontSize: 9,
    fontFamily: "Courier",
    color: "#1E293B",
    flex: 1,
    letterSpacing: 0.8,
  },
  comparisonString: {
    fontSize: 9,
    fontFamily: "Courier",
    color: "#1E293B",
    flex: 1,
    letterSpacing: 0.8,
  },
  correctChar: {
    color: "#10B981",
    fontWeight: "bold",
  },
  incorrectChar: {
    color: "#EF4444",
    fontWeight: "bold",
  },
  neutralChar: {
    color: "#94A3B8",
  },
  summaryTable: {
    height: TABLE_HEIGHT,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 4,
    marginTop: CONTENT_GAP,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 4,
    borderBottomColor: "#CBD5E1",
    alignItems: "center",
  },
  tableHeaderText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1E293B",
    textAlign: "center",
    flex: 1,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 7,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  tableCell: {
    fontSize: 13,
    color: "#1E293B",
    textAlign: "center",
    flex: 1,
  },
  tableCellBold: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1E293B",
    textAlign: "center",
    flex: 1,
  },
  footer: {
    height: FOOTER_HEIGHT,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    fontSize: 8,
    color: "#64748B",
    textAlign: "center",
    marginTop: CONTENT_GAP,
  },
  verticalDivider: {
    borderRightWidth: 1,
    borderRightColor: "#94A3B8",
    borderRightStyle: "dashed",
  },
});

interface CombinedPDFProps {
  students: Array<{
    student: GradedStudent;
    config: SubjectConfig[];
    rank?: number;
  }>;
  examName: string;
  examDate: string;
  totalStudents: number;
  conductor?: 'azeri' | 'reduco';
}

export const CombinedExamResultPDF: React.FC<CombinedPDFProps> = ({
  students,
  examName,
  examDate,
  totalStudents,
  conductor = 'azeri',
}) => {
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("az-AZ", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const getComparisonString = (
    studentAns: string,
    correctAns: string
  ): string => {
    let result = "";
    for (let i = 0; i < Math.max(studentAns.length, correctAns.length); i++) {
      const sChar = studentAns[i] || " ";
      const kChar = correctAns[i] || " ";

      if (kChar === "*") {
        result += "+";
      } else if (sChar === " " || sChar === "*") {
        result += " ";
      } else if (sChar === kChar) {
        result += "+";
      } else {
        result += "-";
      }
    }
    return result;
  };

  const getAnswerStringStyle = (char: string, correctChar: string) => {
    if (correctChar === "*") {
      return styles.correctChar;
    } else if (char === " " || char === "*") {
      return styles.neutralChar;
    } else if (char === correctChar) {
      return styles.correctChar;
    } else {
      return styles.incorrectChar;
    }
  };

  const renderStudentPage = (
    student: GradedStudent,
    config: SubjectConfig[],
    rank?: number
  ) => {
    const totalQuestions = config.reduce((sum, subj) => sum + (subj.length || 0), 0);
    const totalCorrect = config.reduce((sum, subj) => {
      const score = student.scores?.[subj.id] as SubjectScore | undefined;
      return sum + (score?.correct || 0);
    }, 0);
    const totalIncorrect = config.reduce((sum, subj) => {
      const score = student.scores?.[subj.id] as SubjectScore | undefined;
      return sum + (score?.incorrect || 0);
    }, 0);
    const totalScore = student.scores?.totalNetScore || 0;

    // Always use 2-column layout for subjects to control vertical height
    // This ensures content fits on one page with larger fonts
    const subjectsWithScores = config
      .map((subject) => {
        const score = student.scores?.[subject.id] as SubjectScore | undefined;
        return score ? { subject, score } : null;
      })
      .filter(
        (item): item is { subject: SubjectConfig; score: SubjectScore } =>
          item !== null
      );

    const midPoint = Math.ceil(subjectsWithScores.length / 2);
    const leftSubjects = subjectsWithScores.slice(0, midPoint);
    const rightSubjects = subjectsWithScores.slice(midPoint);

    const renderSubjectBlock = (
      subject: SubjectConfig,
      score: SubjectScore
    ) => {
      const comparisonStr = getComparisonString(
        score.studentAnswerString,
        score.correctAnswerString
      );

      return (
        <View key={subject.id} style={styles.subjectSection} wrap={false}>
          <Text style={styles.subjectTitle}>{subject.name}</Text>

          <View style={styles.answerRow}>
            <Text style={styles.answerLabel}>Doğru:</Text>
            <Text style={styles.answerString}>
              {score.correctAnswerString.split("").map((char, i) => (
                <Text
                  key={i}
                  style={getAnswerStringStyle(
                    char,
                    score.correctAnswerString[i] || " "
                  )}
                >
                  {char}
                </Text>
              ))}
            </Text>
          </View>

          <View style={styles.answerRow}>
            <Text style={styles.answerLabel}>Tələbə:</Text>
            <Text style={styles.answerString}>
              {score.studentAnswerString.split("").map((char, i) => (
                <Text
                  key={i}
                  style={getAnswerStringStyle(
                    char,
                    score.correctAnswerString[i] || " "
                  )}
                >
                  {char}
                </Text>
              ))}
            </Text>
          </View>

          <View style={styles.answerRow}>
            <Text style={styles.answerLabel}>Müqayisə:</Text>
            <Text style={styles.comparisonString}>{comparisonStr}</Text>
          </View>
        </View>
      );
    };

    return (
      <Page
        key={student.id}
        size="A4"
        orientation="landscape"
        style={styles.page}
        wrap={false}
      >
        <View style={styles.container} wrap={false}>
          {/* Header */}
          <View style={styles.header} wrap={false}>
            <Text style={styles.headerTitle}>İmtahan nəticə vərəqi</Text>
            <View style={styles.headerInfoRow}>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.headerTextLabel}>İmtahan: </Text>
                <Text style={styles.headerTextValue}>
                  {examName || "Sınaq İmtahanı"}
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.headerTextLabel}>Tarix: </Text>
                <Text style={styles.headerTextValue}>
                  {formatDate(examDate)}
                </Text>
              </View>
            </View>
          </View>

          {/* Main Content */}
          <View style={styles.contentRow} wrap={false}>
            {/* Left Column */}
            <View style={styles.leftColumn} wrap={false}>
              {/* Student Personal Info */}
              <View style={styles.infoBox} wrap={false}>
                <Text style={styles.infoLabel}>Ad:</Text>
                <Text style={styles.infoValue}>{student.ad}</Text>
                <Text style={styles.infoLabel}>Soyad:</Text>
                <Text style={styles.infoValue}>{student.soyad}</Text>
                <Text style={styles.infoLabel}>Ata adı:</Text>
                <Text style={styles.infoValue}>{student.ataAdi}</Text>
              </View>

              {/* Student Academic Info */}
              <View style={styles.infoBox} wrap={false}>
                <Text style={styles.infoLabel}>İş nömrəsi:</Text>
                <Text style={styles.infoValue}>{student.isNomresi}</Text>
                <Text style={styles.infoLabel}>Məktəb:</Text>
                <Text style={styles.infoValue}>{student.mekteb || "-"}</Text>
                <Text style={styles.infoLabel}>Sinif:</Text>
                <Text style={styles.infoValue}>{student.sinif}</Text>
                <Text style={styles.infoLabel}>Variant:</Text>
                <Text style={styles.infoValue}>{student.variant}</Text>
              </View>

              {/* Overall Results */}
              <View style={{ flexDirection: "row" }} wrap={false}>
                <View style={styles.scoreBox} wrap={false}>
                  <Text style={styles.scoreLabel}>BAL</Text>
                  <Text style={styles.scoreValue}>{Number(totalScore.toFixed(2))}</Text>
                </View>
                {/* Note: Rank is intentionally removed here as per user design in single PDF */}
              </View>
            </View>

            {/* Right Column - Subject Details (Always 2-column layout) */}
            <View style={styles.rightColumn} wrap={false}>
              <View style={styles.subjectsContainer} wrap={false}>
                <View style={styles.subjectsColumn} wrap={false}>
                  {leftSubjects.map(({ subject, score }) =>
                    renderSubjectBlock(subject, score)
                  )}
                </View>
                <View style={styles.subjectsColumn} wrap={false}>
                  {rightSubjects.map(({ subject, score }) =>
                    renderSubjectBlock(subject, score)
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* Summary Table */}
          <View style={styles.summaryTable} wrap={false}>
            <View style={styles.tableHeader} wrap={false}>
              <Text style={[styles.tableHeaderText, styles.verticalDivider]}>
                Kateqoriya
              </Text>
              {config.map((subj) => (
                <Text
                  key={subj.id}
                  style={[styles.tableHeaderText, styles.verticalDivider]}
                >
                  {subj.name.slice(0, 8)}
                </Text>
              ))}
              <Text style={styles.tableHeaderText}>CƏMİ</Text>
            </View>

            <View style={styles.tableRow} wrap={false}>
              <Text style={[styles.tableCellBold, styles.verticalDivider]}>
                Sual sayı
              </Text>
              {config.map((subj) => {
                const score = student.scores?.[subj.id] as SubjectScore | undefined;
                const qCount = score?.correctAnswerString?.length ?? 0;
                return (
                  <Text
                    key={subj.id}
                    style={[styles.tableCell, styles.verticalDivider]}
                  >
                    {qCount}
                  </Text>
                );
              })}
              <Text style={styles.tableCellBold}>
                {config.reduce((sum, subj) => {
                  const score = student.scores?.[subj.id] as SubjectScore | undefined;
                  return sum + (score?.correctAnswerString?.length ?? 0);
                }, 0)}
              </Text>
            </View>

            <View style={styles.tableRow} wrap={false}>
              <Text style={[styles.tableCellBold, styles.verticalDivider]}>
                DOĞRU
              </Text>
              {config.map((subj) => {
                const score = student.scores?.[subj.id] as
                  | SubjectScore
                  | undefined;
                return (
                  <Text
                    key={subj.id}
                    style={[styles.tableCell, styles.verticalDivider]}
                  >
                    {score?.correct || 0}
                  </Text>
                );
              })}
              <Text style={styles.tableCellBold}>{totalCorrect}</Text>
            </View>

            <View style={styles.tableRow} wrap={false}>
              <Text style={[styles.tableCellBold, styles.verticalDivider]}>
                SƏHV
              </Text>
              {config.map((subj) => {
                const score = student.scores?.[subj.id] as
                  | SubjectScore
                  | undefined;
                return (
                  <Text
                    key={subj.id}
                    style={[styles.tableCell, styles.verticalDivider]}
                  >
                    {score?.incorrect || 0}
                  </Text>
                );
              })}
              <Text style={styles.tableCellBold}>{totalIncorrect}</Text>
            </View>

            <View style={styles.tableRow} wrap={false}>
              <Text style={[styles.tableCellBold, styles.verticalDivider]}>
                QİYMƏT
              </Text>
              {config.map((subj) => {
                const score = student.scores?.[subj.id] as
                  | SubjectScore
                  | undefined;
                return (
                  <Text
                    key={subj.id}
                    style={[styles.tableCellBold, styles.verticalDivider]}
                  >
                    {score ? Number(score.netScore.toFixed(2)) : "0"}
                  </Text>
                );
              })}
              <Text style={styles.tableCellBold}>{Number(totalScore.toFixed(2))}</Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer} wrap={false}>
            {conductor === 'reduco' ? (
              <Text>Reduco TM</Text>
            ) : (
              <Text>
                ƏLAQƏ NÖMRƏLƏRİMİZ: (018) 656 50 42 MOB: (055) 444-06-62 WhatsApp
                / MAIL: azerikursu@gmail.com URL: www.azeri.edu.az
              </Text>
            )}
          </View>
        </View>
      </Page>
    );
  };

  return (
    <Document>
      {students.map(({ student, config, rank }) =>
        renderStudentPage(student, config, rank)
      )}
    </Document>
  );
};
