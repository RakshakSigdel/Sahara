import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * useAudioRecorder — Browser-based audio recording hook.
 *
 * Uses MediaRecorder + AudioContext/AnalyserNode for real-time waveform extraction.
 * No external dependencies required.
 *
 * @returns {object} Recording state and control functions
 */
export default function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [waveformData, setWaveformData] = useState(new Array(60).fill(0));
  const [frozenWaveform, setFrozenWaveform] = useState(null);
  const [error, setError] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(null);

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const animationRef = useRef(null);

  // Determine supported MIME type
  const getMimeType = useCallback(() => {
    if (typeof MediaRecorder === 'undefined') return null;
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/ogg;codecs=opus',
      'audio/ogg',
    ];
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) return type;
    }
    return null;
  }, []);

  // Extract waveform data at 60fps
  const updateWaveform = useCallback(() => {
    if (!analyserRef.current) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);

    // Downsample to 60 bars
    const barCount = 60;
    const samplesPerBar = Math.floor(bufferLength / barCount);
    const bars = new Array(barCount);

    for (let i = 0; i < barCount; i++) {
      let sum = 0;
      const offset = i * samplesPerBar;
      for (let j = 0; j < samplesPerBar; j++) {
        // Normalize from 0-255 (128 = silence) to 0-1 amplitude
        const v = Math.abs(dataArray[offset + j] - 128) / 128;
        sum += v;
      }
      // Average amplitude for this bar, boost for visibility
      bars[i] = Math.min(1, (sum / samplesPerBar) * 2.5 + 0.05);
    }

    setWaveformData(bars);
    animationRef.current = requestAnimationFrame(updateWaveform);
  }, []);

  // Request microphone & start recording
  const startRecording = useCallback(async () => {
    setError(null);
    setAudioBlob(null);
    setAudioURL(null);
    setFrozenWaveform(null);

    const mimeType = getMimeType();
    if (!mimeType) {
      setError('Your browser does not support audio recording.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;
      setPermissionGranted(true);

      // Set up AudioContext + AnalyserNode
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.75;
      source.connect(analyser);

      audioContextRef.current = audioContext;
      sourceRef.current = source;
      analyserRef.current = analyser;

      // Set up MediaRecorder
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream, { mimeType });

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioURL(url);
      };

      recorder.onerror = () => {
        setError('Recording error. Please try again.');
        setIsRecording(false);
        setIsPaused(false);
      };

      mediaRecorderRef.current = recorder;
      recorder.start(250); // Collect data every 250ms

      // Start timer
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);

      // Start waveform animation
      animationRef.current = requestAnimationFrame(updateWaveform);

      setIsRecording(true);
      setIsPaused(false);
    } catch (err) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionGranted(false);
        setError('Microphone permission denied. Please enable microphone access in your browser settings.');
      } else if (err.name === 'NotFoundError') {
        setError('No microphone found. Please connect a microphone and try again.');
      } else {
        setError('Failed to access microphone. Please try again.');
      }
    }
  }, [getMimeType, updateWaveform]);

  // Stop recording
  const stopRecording = useCallback(() => {
    // Freeze waveform snapshot
    setFrozenWaveform([...waveformData]);

    // Stop animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Stop MediaRecorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    // Stop all tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    // Close AudioContext
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    analyserRef.current = null;
    sourceRef.current = null;

    setIsRecording(false);
    setIsPaused(false);
  }, [waveformData]);

  // Pause recording
  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
    }

    // Pause timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Pause waveform
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    setIsPaused(true);
  }, []);

  // Resume recording
  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
    }

    // Resume timer
    timerRef.current = setInterval(() => {
      setRecordingTime((t) => t + 1);
    }, 1000);

    // Resume waveform
    animationRef.current = requestAnimationFrame(updateWaveform);

    setIsPaused(false);
  }, [updateWaveform]);

  // Discard recording
  const discardRecording = useCallback(() => {
    // Stop everything if still active
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    analyserRef.current = null;
    sourceRef.current = null;
    mediaRecorderRef.current = null;
    chunksRef.current = [];

    // Revoke old URL
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }

    setIsRecording(false);
    setIsPaused(false);
    setRecordingTime(0);
    setAudioBlob(null);
    setAudioURL(null);
    setWaveformData(new Array(60).fill(0));
    setFrozenWaveform(null);
    setError(null);
  }, [audioURL]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      if (audioURL) URL.revokeObjectURL(audioURL);
    };
  }, []);

  // Format time as MM:SS
  const formattedTime = `${Math.floor(recordingTime / 60)
    .toString()
    .padStart(2, '0')}:${(recordingTime % 60).toString().padStart(2, '0')}`;

  return {
    // State
    isRecording,
    isPaused,
    recordingTime,
    formattedTime,
    audioBlob,
    audioURL,
    waveformData: frozenWaveform || waveformData,
    error,
    permissionGranted,
    // Actions
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    discardRecording,
  };
}
