"use client";

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Svg,
  Path,
  Circle,
} from "@react-pdf/renderer";
import { GradedStudent, SubjectScore } from "./grading";
import { SubjectConfig } from "./omr-parser";

Font.register({
  family: "Roboto",
  fonts: [
    { src: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf", fontWeight: 400 },
    { src: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf", fontWeight: 700 },
  ],
});


const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 14,
    fontFamily: "Roboto",
    fontSize: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Roboto",
    marginBottom: 6,
    letterSpacing: 1,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#D0D0D0",
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  topBarText: { fontSize: 10, fontWeight: "bold" },
  body: { flexDirection: "row", flex: 1 },
  leftCol: { width: "22%", flexDirection: "column", paddingRight: 8 },
  rightCol: { flex: 1, flexDirection: "column" },
  infoBox: {
    borderWidth: 1.5, borderColor: "#999", borderRadius: 6,
    padding: 6, marginBottom: 6, backgroundColor: "#FFFFFF",
  },
  infoRow: { flexDirection: "row", marginBottom: 2 },
  infoLabel: { fontSize: 10, fontWeight: "bold", marginRight: 3 },
  infoValue: { fontSize: 10 },
  scoreBox: {
    borderWidth: 1.5, borderColor: "#999", borderRadius: 6,
    padding: 8, backgroundColor: "#FFFFFF", marginBottom: 6,
  },
  scoreRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 2 },
  scoreLabel: { fontSize: 14, fontWeight: "bold" },
  scoreValue: { fontSize: 16, fontWeight: "bold" },
  scoreDivider: { borderBottomWidth: 1, borderBottomColor: "#333", marginVertical: 4 },
  subjectTable: { flex: 1, borderWidth: 1, borderColor: "#999", marginBottom: 8 },
  subjectTableHeaderRow: { flexDirection: "row", backgroundColor: "#888" },
  subjectTableHeaderEmpty: { width: 75, borderRightWidth: 1, borderRightColor: "#FFF" },
  subjectTableHeaderCell: {
    flex: 1, padding: 4, textAlign: "center", fontSize: 9,
    fontWeight: "bold", color: "white", borderRightWidth: 1, borderRightColor: "#FFF",
  },
  subjectTableHeaderCellLast: {
    width: 70, padding: 4, textAlign: "center", fontSize: 9, fontWeight: "bold", color: "white",
  },
  subjectRow: { flexDirection: "row", borderTopWidth: 1, borderTopColor: "#CCC", minHeight: 55 },
  subjectLabelCol: {
    width: 75, justifyContent: "center", alignItems: "center", padding: 4,
    borderRightWidth: 1, borderRightColor: "#CCC", backgroundColor: "#E8E8E8",
  },
  subjectLabelText: { fontSize: 9, fontWeight: "bold", textAlign: "center" },
  closedCol: {
    flex: 1, padding: 4, justifyContent: "center",
    borderRightWidth: 1, borderRightColor: "#CCC", backgroundColor: "#F2F2F2",
  },
  openCol: {
    flex: 0.7, padding: 4, justifyContent: "center",
    borderRightWidth: 1, borderRightColor: "#CCC", backgroundColor: "#EBEBEB",
  },
  writtenCol: {
    width: 70, padding: 4, justifyContent: "center",
    alignItems: "flex-start", backgroundColor: "#E4E4E4",
  },
  answerLine: { flexDirection: "row", alignItems: "center", marginBottom: 1 },
  answerIconContainer: { width: 14, marginRight: 5, alignItems: "center", justifyContent: "center" },
  answerText: { fontSize: 8.5, fontFamily: "Courier", letterSpacing: 1 },
  summaryWrapper: { flexDirection: "row", justifyContent: "flex-end" },
  summaryTable: { width: "78%", borderWidth: 1, borderColor: "#999" },
  summaryRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#CCC" },
  summaryRowAlt: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#CCC", backgroundColor: "#F9F9F9" },
  summaryCellLabel: { width: 60, padding: 4, fontSize: 10, fontWeight: "bold", borderRightWidth: 1, borderRightColor: "#CCC" },
  summaryCell: { flex: 1, padding: 4, fontSize: 10, textAlign: "center", borderRightWidth: 1, borderRightColor: "#CCC" },
  summaryCellLast: { flex: 1, padding: 4, fontSize: 10, textAlign: "center", fontWeight: "bold" },
  footerStrip: { backgroundColor: "#A3A3A3", height: 8, marginTop: 8 },
});

function getComparisonString(studentAns: string, correctAns: string): string {
  let result = "";
  for (let i = 0; i < Math.max(studentAns.length, correctAns.length); i++) {
    const s = studentAns[i] || " ";
    const k = correctAns[i] || " ";
    if (k === "*") result += "+";
    else if (s === " " || s === "*") result += " ";
    else if (s === k) result += "+";
    else result += "-";
  }
  return result;
}

interface CombinedPDFProps {
  students: Array<{ student: GradedStudent; config: SubjectConfig[]; rank?: number }>;
  examName: string;
  examDate: string;
  totalStudents: number;
}

export const CombinedBuraxilisExamResultPDF: React.FC<CombinedPDFProps> = ({
  students, examName, examDate,
}) => {
  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString("az-AZ", { day: "2-digit", month: "2-digit", year: "numeric" });
    } catch { return d; }
  };

  const renderPage = (student: GradedStudent, config: SubjectConfig[], rank?: number) => {
    const activeConfigs = config.filter((c) => student.scores?.[c.id]).slice(0, 3);
    const totalScore = student.scores?.totalNetScore || 0;

    let totalQs = 0, totalCorrect = 0, totalIncorrect = 0, totalPoints = 0;
    activeConfigs.forEach((subj) => {
      const score = student.scores?.[subj.id] as SubjectScore | undefined;
      if (score) {
        const qCount = subj.segments ? subj.segments.reduce((a, s) => a + s.count, 0) : (subj.length || 0);
        totalQs += qCount;
        totalCorrect += score.correct;
        totalIncorrect += score.incorrect;
        totalPoints += score.netScore;
      }
    });

    return (
      <Page key={student.id} size="A4" orientation="portrait" style={styles.page} wrap={false}>
        <Text style={styles.title}>İMTAHAN NƏTİCƏ VƏRƏQİ</Text>
        <View style={styles.topBar}>
          <Text style={styles.topBarText}>İmtahan:  {examName || ""}</Text>
          <Text style={styles.topBarText}>Tarix: {formatDate(examDate)}</Text>
        </View>
        <View style={styles.body}>
          <View style={styles.leftCol}>
            <View style={styles.infoBox}>
              <View style={styles.infoRow}><Text style={styles.infoLabel}>Ad:</Text><Text style={styles.infoValue}>{student.ad}</Text></View>
              <View style={styles.infoRow}><Text style={styles.infoLabel}>Soyad:</Text><Text style={styles.infoValue}>{student.soyad}</Text></View>
            </View>
            <View style={styles.infoBox}>
              <View style={styles.infoRow}><Text style={styles.infoLabel}>İş nömrəsi:</Text><Text style={styles.infoValue}>{student.isNomresi}</Text></View>
              <Text style={[styles.infoLabel, { marginTop: 4 }]}>Məktəb: {student.mekteb || ""}</Text>
              <Text style={styles.infoLabel}>Sinif: {student.sinif}</Text>
              <Text style={styles.infoLabel}>Blok: {student.bolme}</Text>
              <Text style={styles.infoLabel}>Variant: {student.variant}</Text>
            </View>
            <View style={styles.scoreBox}>
              <View style={styles.scoreRow}>
                <Text style={styles.scoreLabel}>BAL</Text>
                <Text style={styles.scoreValue}>{Number(totalScore.toFixed(2))}</Text>
              </View>
              <View style={styles.scoreDivider} />
              <View style={styles.scoreRow}>
                <Text style={styles.scoreLabel}>YER</Text>
                <Text style={styles.scoreValue}>{rank || "-"}</Text>
              </View>
            </View>
          </View>

          <View style={styles.rightCol}>
            <View style={styles.subjectTable}>
              <View style={styles.subjectTableHeaderRow}>
                <View style={styles.subjectTableHeaderEmpty} />
                <Text style={styles.subjectTableHeaderCell}>Qapalı tipli testlər</Text>
                <Text style={styles.subjectTableHeaderCell}>Açıq tipli testlər</Text>
                <Text style={styles.subjectTableHeaderCellLast}>Yazı işi üzrə ballar</Text>
              </View>

              {activeConfigs.map((subj) => {
                const score = student.scores?.[subj.id] as SubjectScore | undefined;
                if (!score) return null;

                let closedCount = 0, openCount = 0, openLPI = 1;
                if (subj.segments) {
                  closedCount = subj.segments.find(s => s.type === "closed")?.count || 0;
                  const os = subj.segments.find(s => s.type === "open");
                  openCount = os?.count || 0;
                  openLPI = os?.lengthPerItem || 1;
                } else {
                  closedCount = subj.length || 0;
                }

                const closedKey = score.correctAnswerString.slice(0, closedCount);
                const closedStud = score.studentAnswerString.slice(0, closedCount);
                const closedComp = getComparisonString(closedStud, closedKey);

                const openStart = closedCount, openEnd = closedCount + openCount * openLPI;
                const openKey = score.correctAnswerString.slice(openStart, openEnd);
                const openStud = score.studentAnswerString.slice(openStart, openEnd);
                const openComp = getComparisonString(openStud, openKey);
                const writtenStud = score.studentAnswerString.slice(openEnd);

                let openKeyFmt = "", openStudFmt = "", openCompFmt = "";
                if (openCount > 0) {
                  const kp: string[] = [], sp: string[] = [], cp: string[] = [];
                  for (let i = 0; i < openCount; i++) {
                    const si = i * openLPI;
                    const kv = openKey.slice(si, si + openLPI).trim();
                    const sv = openStud.slice(si, si + openLPI).trim() || "";
                    const colW = Math.max(kv.length, sv.length, 1);
                    const c = kv === sv ? "+" : "-";
                    const leftPad = Math.floor((colW - 1) / 2);
                    const rightPad = colW - 1 - leftPad;
                    kp.push(kv.padStart(colW));
                    sp.push(sv.padStart(colW));
                    cp.push(" ".repeat(leftPad) + c + " ".repeat(rightPad));
                  }
                  openKeyFmt = kp.join(" ");
                  openStudFmt = sp.join(" ");
                  openCompFmt = cp.join(" ");
                }

                return (
                  <View key={subj.id} style={styles.subjectRow}>
                    <View style={styles.subjectLabelCol}>
                      <Text style={styles.subjectLabelText}>{subj.name}</Text>
                    </View>
                    <View style={styles.closedCol}>
                      <View style={styles.answerLine}>
                        <View style={styles.answerIconContainer}>
                          <Svg width="9" height="9" viewBox="0 0 24 24">
                            <Path d="M20 6L9 17l-5-5" stroke="#007700" strokeWidth="2.5" fill="none" />
                          </Svg>
                        </View>
                        <Text style={styles.answerText}>{closedKey}</Text>
                      </View>
                      <View style={styles.answerLine}>
                        <View style={styles.answerIconContainer}>
                          <Svg width="9" height="9" viewBox="0 0 24 24">
                            <Circle cx="12" cy="12" r="10" fill="none" stroke="#333" strokeWidth="2" />
                            <Circle cx="12" cy="12" r="4" fill="#333" />
                          </Svg>
                        </View>
                        <Text style={[styles.answerText, { color: "#CC0000" }]}>{closedStud}</Text>
                      </View>
                      <View style={styles.answerLine}>
                        <View style={styles.answerIconContainer}>
                          <Svg width="9" height="9" viewBox="0 0 24 24">
                            <Path d="M12 4v16M4 12h16" stroke="#333" strokeWidth="2.5" fill="none" />
                            <Path d="M4 20h16" stroke="#333" strokeWidth="2.5" fill="none" />
                          </Svg>
                        </View>
                        <Text style={styles.answerText}>{closedComp}</Text>
                      </View>
                    </View>
                    <View style={styles.openCol}>
                      {openCount > 0 && (() => {
                        const cells: React.ReactElement[] = [];
                        for (let i = 0; i < openCount; i++) {
                          const si = i * openLPI;
                          const kv = openKey.slice(si, si + openLPI).trim();
                          const sv = openStud.slice(si, si + openLPI).trim() || "";
                          const isCorrect = kv === sv;
                          cells.push(
                            <View key={i} style={{ minWidth: 30, alignItems: "center", paddingHorizontal: 2 }}>
                              <Text style={[styles.answerText, { color: "#007700", textAlign: "center" }]}>{kv}</Text>
                              <Text style={[styles.answerText, { color: "#CC0000", textAlign: "center" }]}>{sv || " "}</Text>
                              <Text style={[styles.answerText, { color: isCorrect ? "#007700" : "#CC0000", textAlign: "center", fontWeight: "bold" }]}>{isCorrect ? "+" : "-"}</Text>
                            </View>
                          );
                        }
                        return <View style={{ flexDirection: "row", flexWrap: "wrap" }}>{cells}</View>;
                      })()}
                    </View>
                    <View style={styles.writtenCol}>
                      <Text style={styles.answerText}>{writtenStud}</Text>
                    </View>
                  </View>
                );
              })}
            </View>

            <View style={styles.summaryWrapper}>
              <View style={styles.summaryTable}>
                <View style={[styles.summaryRow, { backgroundColor: "#EEE" }]}>
                  <Text style={styles.summaryCellLabel}></Text>
                  {activeConfigs.map(s => <Text key={s.id} style={styles.summaryCell}>{s.name}</Text>)}
                  <Text style={styles.summaryCellLast}>CƏMİ</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryCellLabel}>Sual sayı</Text>
                  {activeConfigs.map(s => {
                    const q = s.segments ? s.segments.reduce((a, seg) => a + seg.count, 0) : (s.length || 0);
                    return <Text key={s.id} style={styles.summaryCell}>{q}</Text>;
                  })}
                  <Text style={styles.summaryCellLast}>{totalQs}</Text>
                </View>
                <View style={styles.summaryRowAlt}>
                  <Text style={[styles.summaryCellLabel, { fontWeight: "bold" }]}>DOĞRU</Text>
                  {activeConfigs.map(s => {
                    const sc = student.scores?.[s.id] as SubjectScore | undefined;
                    return <Text key={s.id} style={styles.summaryCell}>{sc?.correct || 0}</Text>;
                  })}
                  <Text style={styles.summaryCellLast}>{totalCorrect}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryCellLabel, { fontWeight: "bold" }]}>SƏHV</Text>
                  {activeConfigs.map(s => {
                    const sc = student.scores?.[s.id] as SubjectScore | undefined;
                    return <Text key={s.id} style={styles.summaryCell}>{sc?.incorrect || 0}</Text>;
                  })}
                  <Text style={styles.summaryCellLast}>{totalIncorrect}</Text>
                </View>
                <View style={styles.summaryRowAlt}>
                  <Text style={[styles.summaryCellLabel, { fontWeight: "bold" }]}>BAL</Text>
                  {activeConfigs.map(s => {
                    const sc = student.scores?.[s.id] as SubjectScore | undefined;
                    return <Text key={s.id} style={styles.summaryCell}>{Number((sc?.netScore || 0).toFixed(2))}</Text>;
                  })}
                  <Text style={styles.summaryCellLast}>{Number(totalPoints.toFixed(2))}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.footerStrip} />
      </Page>
    );
  };

  return (
    <Document>
      {students.map(({ student, config, rank }) => renderPage(student, config, rank))}
    </Document>
  );
};
