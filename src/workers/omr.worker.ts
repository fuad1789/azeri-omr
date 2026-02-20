import { parseOMRData, ParsedStudent, SubjectConfig } from '../lib/omr-parser';
import { gradeStudent, GradedStudent } from '../lib/grading';

// Define message types
type WorkerMessage = 
  | { type: 'PARSE'; rawText: string; configMap: Record<string, SubjectConfig[]>; examType?: string }
  | { type: 'GRADE'; parsedData: ParsedStudent[]; answerKeys: Record<string, Record<string, string>>; configMap: Record<string, SubjectConfig[]>; openWeights?: Record<string, Record<string, number[]>> };

type WorkerResponse = 
  | { type: 'PARSE_COMPLETE'; data: ParsedStudent[] }
  | { type: 'GRADE_COMPLETE'; data: GradedStudent[] }
  | { type: 'ERROR'; error: string };

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const { type } = event.data;

  try {
    if (type === 'PARSE') {
      const { rawText, configMap } = event.data;
      // Map UI examType to Parser parseMode
      const examType = 'examType' in event.data ? event.data.examType : 'unknown';
      const parseMode = examType === 'buraxilis' ? 'buraxilis' : 'legacy';
      
      const results = parseOMRData(rawText, configMap, parseMode);
      self.postMessage({ type: 'PARSE_COMPLETE', data: results });
    } 
    else if (type === 'GRADE') {
      const { parsedData, answerKeys, configMap, openWeights } = event.data;
      
      const gradedResults = parsedData.map(student => {
        if (!student.isValid) return student;
        
        const classKeys = answerKeys[student.sinif];
        let key = '';
        if (classKeys) {
            const complexKey = `${student.variant}-${(student.dil || '').toUpperCase().trim()}`;
            if (classKeys[complexKey]) {
                key = classKeys[complexKey];
            } else if (classKeys[student.variant]) {
                key = classKeys[student.variant];
            }
        }
        const config = configMap[student.sinif] || configMap['default'];
        
        // Pass class-specific open weights if available
        const classWeights = openWeights ? openWeights[student.sinif] : undefined;
        
        return gradeStudent(student, key || '', config, classWeights);
      });

      self.postMessage({ type: 'GRADE_COMPLETE', data: gradedResults });
    }
  } catch (error) {
    self.postMessage({ type: 'ERROR', error: (error as Error).message });
  }
};
