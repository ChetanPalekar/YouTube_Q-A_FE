import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { chatApi } from '../lib/chatApi.js';

export default function UploadModal({ onClose, onUploadComplete }) {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | uploading | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef(null);

  const validateAndSetFile = (selected) => {
    if (!selected) return;
    const isValid = selected.name.endsWith('.srt') || selected.name.endsWith('.vtt');
    if (!isValid) {
      setErrorMsg('Only .srt or .vtt files are supported.');
      return;
    }
    setErrorMsg('');
    setFile(selected);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    validateAndSetFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus('uploading');
    setErrorMsg('');
    try {
      await chatApi.uploadVideo(file);
      setStatus('success');
      setTimeout(() => {
        onUploadComplete?.();
        onClose();
      }, 1200);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-xl dark:border dark:border-neutral-800 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Upload video transcript</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {status !== 'success' ? (
            <>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
                  dragActive
                    ? 'border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-800'
                    : 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                }`}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept=".srt,.vtt"
                  className="hidden"
                  onChange={(e) => validateAndSetFile(e.target.files[0])}
                />
                {file ? (
                  <>
                    <FileText size={28} className="text-neutral-700 dark:text-neutral-300" />
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 font-medium">{file.name}</p>
                  </>
                ) : (
                  <>
                    <UploadCloud size={28} className="text-neutral-400" />
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">
                      Drag & drop your .srt or .vtt file, or click to browse
                    </p>
                  </>
                )}
              </div>

              {errorMsg && <p className="text-sm text-red-500 mt-3">{errorMsg}</p>}

              <button
                onClick={handleUpload}
                disabled={!file || status === 'uploading'}
                className="w-full mt-4 py-2.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {status === 'uploading' ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Uploading...
                  </>
                ) : (
                  'Upload'
                )}
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 py-6">
              <CheckCircle2 size={32} className="text-green-500" />
              <p className="text-sm text-neutral-700 dark:text-neutral-300 font-medium">Upload complete</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}