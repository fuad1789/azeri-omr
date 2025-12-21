import { parseOMRData, ParsedStudent, SubjectConfig } from '../lib/omr-parser';
import { gradeStudent, GradedStudent } from '../lib/grading';

// Define message types
type WorkerMessage = 
  | { type: 'PARSE'; rawText: string; configMap: Record<string, SubjectConfig[]> }
  | { type: 'GRADE'; parsedData: ParsedStudent[]; answerKeys: Record<string, Record<string, string>>; configMap: Record<string, SubjectConfig[]> };

type WorkerResponse = 
  | { type: 'PARSE_COMPLETE'; data: ParsedStudent[] }
  | { type: 'GRADE_COMPLETE'; data: GradedStudent[] }
  | { type: 'ERROR'; error: string };

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const { type } = event.data;

  try {
    if (type === 'PARSE') {
      const { rawText, configMap } = event.data;
      const results = parseOMRData(rawText, configMap);
      self.postMessage({ type: 'PARSE_COMPLETE', data: results });
    } 
    else if (type === 'GRADE') {
      const { parsedData, answerKeys, configMap } = event.data;
      
      const gradedResults = parsedData.map(student => {
        if (!student.isValid) return student;
        
        const classKeys = answerKeys[student.sinif];
        const key = classKeys ? classKeys[student.variant] : '';
        const config = configMap[student.sinif] || configMap['default'];
        
        return gradeStudent(student, key || '', config);
      });

      self.postMessage({ type: 'GRADE_COMPLETE', data: gradedResults });
    }
  } catch (error) {
    self.postMessage({ type: 'ERROR', error: (error as Error).message });
  }
};
