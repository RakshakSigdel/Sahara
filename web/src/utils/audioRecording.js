/* ═══════════════════════════════════════════
   AudioRecorder — Web Audio API integration
   ═══════════════════════════════════════════ */

export class AudioRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.stream = null;
    this.audioContext = null;
    this.analyser = null;
    this.source = null;
    this.waveformData = new Uint8Array(64);
    this._onData = null;
  }

  /** Check if browser supports recording */
  static isSupported() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
  }

  /** Request microphone permission */
  async requestPermission() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 44100 } });
      return true;
    } catch (err) {
      console.error('Microphone permission denied:', err);
      return false;
    }
  }

  /** Start recording */
  async startRecording() {
    if (!this.stream) {
      const granted = await this.requestPermission();
      if (!granted) throw new Error('Microphone permission denied');
    }

    this.audioChunks = [];

    // Set up Web Audio API for waveform analysis
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 128;
    this.source = this.audioContext.createMediaStreamSource(this.stream);
    this.source.connect(this.analyser);
    this.waveformData = new Uint8Array(this.analyser.frequencyBinCount);

    // Start MediaRecorder
    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus'
      : MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm'
      : 'audio/mp4';

    this.mediaRecorder = new MediaRecorder(this.stream, { mimeType });

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.audioChunks.push(e.data);
    };

    this.mediaRecorder.start(100); // collect data every 100ms
  }

  /** Stop recording and return blob */
  stopRecording() {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        resolve(null);
        return;
      }
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.audioChunks, { type: this.mediaRecorder.mimeType });
        resolve(blob);
      };
      this.mediaRecorder.stop();

      // Clean up audio context
      if (this.source) { this.source.disconnect(); this.source = null; }
      if (this.audioContext) { this.audioContext.close(); this.audioContext = null; }
    });
  }

  /** Pause recording */
  pauseRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause();
    }
  }

  /** Resume recording */
  resumeRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
    }
  }

  /** Get current waveform data (0-255 per bin, 64 bins) */
  getWaveformData() {
    if (this.analyser) {
      this.analyser.getByteFrequencyData(this.waveformData);
    }
    return Array.from(this.waveformData);
  }

  /** Get time-domain data for amplitude visualization */
  getTimeDomainData() {
    if (!this.analyser) return new Array(64).fill(128);
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteTimeDomainData(data);
    return Array.from(data);
  }

  /** Get audio level (0-1) */
  getAudioLevel() {
    const data = this.getTimeDomainData();
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      const f = (data[i] - 128) / 128;
      sum += f * f;
    }
    return Math.sqrt(sum / data.length);
  }

  /** Clean up all resources */
  destroy() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    if (this.source) this.source.disconnect();
    if (this.audioContext) this.audioContext.close();
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
    }
    this.mediaRecorder = null;
    this.stream = null;
    this.audioContext = null;
    this.analyser = null;
    this.source = null;
  }
}

export default AudioRecorder;
