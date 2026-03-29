import { createContext, useContext, useState, useCallback } from 'react';

const ScreeningContext = createContext(null);

export function ScreeningProvider({ children }) {
  const [testType, setTestType] = useState(null);   // 'quick' | 'story' | 'picture'
  const [recording, setRecording] = useState(null);  // { blob, duration }
  const [results, setResults] = useState(null);      // analysis results object
  const [step, setStep] = useState('consent');        // consent | select | record | processing | results

  const startTest = useCallback((type) => {
    setTestType(type);
    setRecording(null);
    setResults(null);
    setStep('record');
  }, []);

  const saveRecording = useCallback((blob, duration) => {
    setRecording({ blob, duration });
    setStep('processing');
  }, []);

  const saveResults = useCallback((data) => {
    setResults(data);
    setStep('results');
  }, []);

  const reset = useCallback(() => {
    setTestType(null);
    setRecording(null);
    setResults(null);
    setStep('consent');
  }, []);

  return (
    <ScreeningContext.Provider value={{ testType, recording, results, step, setStep, startTest, saveRecording, saveResults, reset }}>
      {children}
    </ScreeningContext.Provider>
  );
}

export function useScreening() {
  const ctx = useContext(ScreeningContext);
  if (!ctx) throw new Error('useScreening must be used within ScreeningProvider');
  return ctx;
}
