import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileAudio, X, AlertCircle } from 'lucide-react';
import { cn } from '../../../utils/cn';

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const ACCEPTED_TYPES = ['.mp3', '.wav', '.m4a', '.webm'];
const ACCEPTED_MIME = ['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/mp4', 'audio/x-m4a', 'audio/webm'];

/**
 * AudioUploader — Drag & drop / file picker for audio files.
 *
 * @param {object} props
 * @param {function} props.onFileSelected - (file: File, blob: Blob, url: string) => void
 * @param {function} [props.onError] - (message: string) => void
 * @param {string} [props.className]
 */
export default function AudioUploader({ onFileSelected, onError, className }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const inputRef = useRef(null);

  const validateAndProcess = useCallback((file) => {
    setUploadError(null);

    // Check file type
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!ACCEPTED_TYPES.includes(ext) && !ACCEPTED_MIME.includes(file.type)) {
      const msg = 'Unsupported file type. Please use MP3, WAV, M4A, or WebM.';
      setUploadError(msg);
      onError?.(msg);
      return;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      const msg = 'File exceeds 25MB limit. Please use a smaller file.';
      setUploadError(msg);
      onError?.(msg);
      return;
    }

    // Create blob + URL
    const blob = new Blob([file], { type: file.type });
    const url = URL.createObjectURL(blob);
    onFileSelected(file, blob, url);
  }, [onFileSelected, onError]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) validateAndProcess(file);
    // Reset input so same file can be reselected
    e.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndProcess(file);
  };

  return (
    <div className={cn('w-full', className)}>
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        animate={{
          borderColor: isDragging ? '#0A7C7C' : 'rgba(226, 232, 229, 0.6)',
          backgroundColor: isDragging ? 'rgba(10, 124, 124, 0.04)' : 'transparent',
        }}
        className={cn(
          'relative flex flex-col items-center justify-center gap-3',
          'px-6 py-8 rounded-xl cursor-pointer',
          'border-2 border-dashed transition-colors duration-200',
          'hover:border-deep-teal/40 hover:bg-deep-teal/[0.02]',
          'group'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          onChange={handleFileChange}
          className="sr-only"
          aria-label="Upload audio file"
        />

        <div className={cn(
          'w-14 h-14 rounded-2xl flex items-center justify-center',
          'bg-deep-teal/8 text-deep-teal',
          'group-hover:bg-deep-teal/12 transition-colors'
        )}>
          {isDragging ? <FileAudio size={24} /> : <Upload size={24} />}
        </div>

        <div className="text-center">
          <p className="text-sm font-medium text-text-primary">
            {isDragging ? 'Drop audio file here' : 'Drag & drop or click to upload'}
          </p>
          <p className="text-xs text-text-muted mt-1">
            MP3, WAV, M4A, WebM • Max 25MB
          </p>
        </div>
      </motion.div>

      <AnimatePresence>
        {uploadError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 mt-3 px-3 py-2 rounded-lg bg-error/5 border border-error/15"
          >
            <AlertCircle size={14} className="text-error shrink-0" />
            <span className="text-xs text-error">{uploadError}</span>
            <button onClick={() => setUploadError(null)} className="ml-auto text-error/50 hover:text-error cursor-pointer">
              <X size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

AudioUploader.displayName = 'AudioUploader';
