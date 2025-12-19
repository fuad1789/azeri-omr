
import { ParsedStudent, SubjectConfig, DEFAULT_SUBJECT_CONFIG } from './omr-parser';

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

export const gradeStudent = (student: ParsedStudent, answerKey: string, config: SubjectConfig[] = DEFAULT_SUBJECT_CONFIG): GradedStudent => {
  // If no answer key, return without scores
  if (!answerKey) {
    return { ...student };
  }

  const studentAns = student.fullAnswerString.padEnd(70, ' ');
  const key = answerKey.padEnd(70, ' ');

  const scores: Record<string, SubjectScore> = {};
  let totalNetScore = 0;
  let currentIndex = 0;

  for (const subject of config) {
      const start = currentIndex;
      const length = subject.length;
      
      let correct = 0;
      let incorrect = 0;
      let unanswered = 0;

      // Slice the comparison strings for this subject
      const subStudentAns = studentAns.slice(start, start + length);
      const subKeyAns = key.slice(start, start + length);

      for (let i = start; i < start + length; i++) {
          const sChar = studentAns[i] || ' ';
          const kChar = key[i] || ' ';

          if (kChar === '*') {
              correct++;
          } else if (sChar === ' ' || sChar === '*') { 
               unanswered++;
          } else if (sChar === kChar) {
              correct++;
          } else {
              incorrect++;
          }
      }

      // Standard raw net: Correct ONLY (User requested removal of penalty)
      // Score = Correct Count * Points Per Question
      const pointsPerQuestion = subject.points !== undefined ? subject.points : 0;
      const weightedNetScore = correct * pointsPerQuestion;
      
      // We store the WEIGHTED score as the netScore
      scores[subject.id] = { 
          correct, 
          incorrect, 
          unanswered, 
          netScore: weightedNetScore,
          studentAnswerString: subStudentAns,
          correctAnswerString: subKeyAns
      };
      totalNetScore += weightedNetScore;
      
      currentIndex += length;
  }

  return {
    ...student,
    scores: {
        ...scores,
        totalNetScore
    }
  };
};
