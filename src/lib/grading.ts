
import { ParsedStudent, SubjectConfig, DEFAULT_SUBJECT_CONFIG, SubjectSegment } from './omr-parser';

export interface SubjectScore {
  correct: number;
  incorrect: number;
  unanswered: number;
  netScore: number;
  studentAnswerString: string;
  correctAnswerString: string;
}

export interface GradedStudent extends ParsedStudent {
  scores?: {
    totalNetScore: number;
    [key: string]: SubjectScore | number;
  };
}

export const gradeStudent = (
  student: ParsedStudent,
  answerKey: string,
  config: SubjectConfig[] = DEFAULT_SUBJECT_CONFIG,
  openWeights?: Record<string, number[]>
): GradedStudent => {

  if (!answerKey) return { ...student };

  // Build per-subject key strings by slicing answerKey sequentially.
  // SubjectKeyInputs builds the key in the same config order, so indices align.
  let keyIndex = 0;
  const keyPerSubject: Record<string, string> = {};
  for (const subject of config) {
    const segments: SubjectSegment[] = subject.segments || [
      { type: 'closed', count: subject.length || 0, points: subject.points || 0, lengthPerItem: 1 }
    ];
    const subjectLen = segments.reduce((acc, seg) => acc + seg.count * seg.lengthPerItem, 0);
    keyPerSubject[subject.id] = answerKey.slice(keyIndex, keyIndex + subjectLen);
    keyIndex += subjectLen;
  }


  const scores: Record<string, SubjectScore> = {};
  let totalNetScore = 0;

  for (const subject of config) {
    const segments: SubjectSegment[] = subject.segments || [
      { type: 'closed', count: subject.length || 0, points: subject.points || 0, lengthPerItem: 1 }
    ];

    const subjectTotalPoints = Number(subject.points || 0);
    let usedPoints = 0;
    let totalOpenCount = 0;

    if (subjectTotalPoints > 0) {
      for (const seg of segments) {
        if (seg.type === 'closed' || seg.type === 'open') {
          usedPoints += seg.count * Number(seg.points || 0);
        } else if (seg.type === 'written') {
          totalOpenCount += seg.count;
        }
      }
    }

    let derivedOpenWeight = 0;
    if (subjectTotalPoints > 0 && totalOpenCount > 0) {
      const remaining = subjectTotalPoints - usedPoints;
      derivedOpenWeight = remaining / totalOpenCount;
      if (derivedOpenWeight < 0) derivedOpenWeight = 0;
    }

    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;
    let subjectNetScore = 0;
    let globalOpenIndex = 0;

    const subjectTotalLen = segments.reduce((acc, seg) => acc + seg.count * seg.lengthPerItem, 0);

    // USE student.subjects[subject.id] for student answers — these are correctly sliced
    // at parse time and do NOT drift when configMap is later updated.
    const studentSubjectStr = (student.subjects?.[subject.id] ?? '').padEnd(subjectTotalLen, ' ');
    const keySubjectStr = (keyPerSubject[subject.id] ?? '').padEnd(subjectTotalLen, ' ');

    let localIndex = 0;

    for (const segment of segments) {
      const { type, count, points, lengthPerItem } = segment;
      const pointValue = Number(points);

      for (let q = 0; q < count; q++) {
        const sChunk = studentSubjectStr.slice(localIndex, localIndex + lengthPerItem).trim();
        const kChunk = keySubjectStr.slice(localIndex, localIndex + lengthPerItem).trim();

        localIndex += lengthPerItem;

        if (type === 'closed') {
          if (!sChunk) {
            unanswered++;
          } else if (kChunk === '*') {
            correct++;
            subjectNetScore += pointValue;
          } else if (sChunk === kChunk) {
            correct++;
            subjectNetScore += pointValue;
          } else {
            incorrect++;
          }
        } else if (type === 'open') {
          const normalizedS = sChunk ? sChunk.replace(/\s/g, '') : '';
          const normalizedK = kChunk ? kChunk.replace(/\s/g, '') : '';

          if (!normalizedK) continue;

          if (!normalizedS) {
            unanswered++;
          } else if (normalizedS === normalizedK) {
            correct++;
            let weight = pointValue;
            if (openWeights?.[subject.id]?.[globalOpenIndex] !== undefined) {
              weight = openWeights[subject.id][globalOpenIndex];
            }
            subjectNetScore += weight;
          } else {
            incorrect++;
          }
          globalOpenIndex++;
        } else if (type === 'written') {
          const val = parseInt(sChunk, 10);
          if (isNaN(val)) {
            if (!sChunk) unanswered++;
            else incorrect++;
          } else {
            let weight = pointValue;
            if (openWeights?.[subject.id]?.[globalOpenIndex] !== undefined) {
              weight = openWeights[subject.id][globalOpenIndex];
            } else if (derivedOpenWeight > 0) {
              weight = derivedOpenWeight;
            }
            if ((!openWeights || !openWeights[subject.id]) && kChunk && kChunk.trim().length > 0) {
              const parsedWeight = parseFloat(kChunk);
              if (!isNaN(parsedWeight)) weight = parsedWeight;
            }
            const maxLevel = 2;
            subjectNetScore += (val / maxLevel) * weight;
            if (val > 0) correct++;
          }
          globalOpenIndex++;
        }
      }
    }

    scores[subject.id] = {
      correct,
      incorrect,
      unanswered,
      netScore: subjectNetScore,
      studentAnswerString: studentSubjectStr.trimEnd(),
      correctAnswerString: keySubjectStr.trimEnd(),
    };
    totalNetScore += subjectNetScore;
  }

  return {
    ...student,
    scores: { ...scores, totalNetScore },
  };
};