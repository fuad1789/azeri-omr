

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

export const gradeStudent = (student: ParsedStudent, answerKey: string, config: SubjectConfig[] = DEFAULT_SUBJECT_CONFIG, openWeights?: Record<string, number[]>): GradedStudent => {
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
      // Determine segments. If legacy, create a single 'closed' segment.
      // Determine segments. If legacy, create a single 'closed' segment.
      const segments: SubjectSegment[] = subject.segments || [
          { type: 'closed', count: subject.length || 0, points: subject.points || 0, lengthPerItem: 1 }
      ];

      // Dynamic Weight Calculation Logic
      // The user wants Open Question weights to be calculated automatically to fill the remaining score
      // ensuring the Subject Total matches the config (e.g. 100).
      const subjectTotalPoints = Number(subject.points || 0);
      let usedPoints = 0;
      let totalOpenCount = 0;

      // First pass: Calculate fixed points (Closed/Numeric) and count Open questions
      if (subjectTotalPoints > 0) {
        for (const seg of segments) {
            if (seg.type === 'closed' || seg.type === 'numeric') {
                usedPoints += (seg.count * Number(seg.points || 0));
            } else if (seg.type === 'open') {
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
      
      const subjectStart = currentIndex;
      let subjectEnd = currentIndex; // Will be advanced per segment

      for (const segment of segments) {
          const { type, count, points, lengthPerItem } = segment;
          const pointValue = Number(points); // Force number to prevent string concat bugs
          
          for (let q = 0; q < count; q++) {
              // Extract Student Answer
              const sChunk = studentAns.slice(currentIndex, currentIndex + lengthPerItem).trim();
              
              // Extract Key Answer
              // Note: Key might be shorter if not padded correctly, handle ' '
              const kChunk = key.slice(currentIndex, currentIndex + lengthPerItem).trim();
              
              currentIndex += lengthPerItem;
              subjectEnd += lengthPerItem; // Track end for substring slicing later

              // Logic per type
              if (type === 'closed') {
                   // Single char comparison
                   const sChar = sChunk || ''; // single char usually
                   const kChar = kChunk || '';

                   if (!sChar || sChunk === '') {
                       unanswered++;
                   } else if (kChar === '*') {
                       correct++;
                       subjectNetScore += pointValue;
                   } else if (sChar === kChar) {
                       correct++;
                       subjectNetScore += pointValue;
                   } else {
                       incorrect++;
                       // No penalty implemented as per previous instruction
                   }
              } 
              else if (type === 'numeric') {
                  // Text comparison of string (e.g. "00123" vs "00123")
                  // Normalize by removing ALL spaces to handle "12  3" vs "123" case
                  const normalizedS = sChunk ? sChunk.replace(/\s/g, '') : '';
                  const normalizedK = kChunk ? kChunk.replace(/\s/g, '') : '';

                  if (!key || !normalizedK) {
                      // No answer key provided for this numeric Q
                      continue;
                  }
                  
                  if (!normalizedS) {
                      unanswered++;
                  } else if (normalizedS === normalizedK) {
                      correct++;
                      subjectNetScore += pointValue;
                  } else {
                      incorrect++;
                  }
              }
              else if (type === 'open') {
                  // Open question: 1, 2, 3
                  // Score = (Value / 3) * Points (Max Score)
                  // Student writes '1', '2', '3'.
                  const val = parseInt(sChunk, 10);
                  if (isNaN(val)) {
                      if (!sChunk) unanswered++;
                      else incorrect++; // Invalid char treated as 0 logic
                  } else {
                      // Determine Weight Logic:
                      // 1. Check for Explicit Weight (New "Daxil et" Modal)
                      // openWeights format: Record<subjectId, number[]>
                      let weight = pointValue; // Default to config
                      
                      // Try to find explicit weight
                      if (openWeights && openWeights[subject.id] && openWeights[subject.id][q] !== undefined) {
                          weight = openWeights[subject.id][q];
                      } 
                      // 2. Fallback to Dynamic Weight (if available and no explicit weight)
                      else if (derivedOpenWeight > 0) {
                          weight = derivedOpenWeight;
                      }

                      // 3. Fallback to Answer Key String Override (Legacy/Simple) - Only if no explicit weight found
                      // If User provided a value in Answer Key AND we didn't use explicit weight map
                      if ((!openWeights || !openWeights[subject.id]) && kChunk && kChunk.trim().length > 0) {
                          const parsedWeight = parseFloat(kChunk);
                          if (!isNaN(parsedWeight)) {
                              weight = parsedWeight;
                          }
                      }

                      // Max Level is 3 (Standard for Buraxilis Open Questions)
                      const maxLevel = 3;
                      const scoreCalc = (val / maxLevel) * weight;
                      
                      subjectNetScore += scoreCalc;
                      
                      // For stats
                      if (val > 0) correct++;
                  }
              }
          }
      }

      // Slice total subject strings for display
      const finalStudentStr = studentAns.slice(subjectStart, subjectEnd);
      const finalKeyStr = key.slice(subjectStart, subjectEnd);

      scores[subject.id] = { 
          correct, 
          incorrect, 
          unanswered, 
          netScore: subjectNetScore,
          studentAnswerString: finalStudentStr, // Contains all segments concatenated
          correctAnswerString: finalKeyStr
      };
      totalNetScore += subjectNetScore;
  }

  return {
    ...student,
    scores: {
        ...scores,
        totalNetScore
    }
  };
};
