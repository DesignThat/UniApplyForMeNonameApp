import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, AlertCircle, Sparkles } from 'lucide-react';

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
}

export function FileUploader({ onFileUpload }: FileUploaderProps) {
  const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) onFileUpload(acceptedFiles[0]);
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE_BYTES,
    validator: (file) => {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return { code: 'file-too-large', message: 'File is too large. Maximum size is 2MB.' };
      }
      const hasExtension = file.name.includes('.');
      const isHtml = file.name.toLowerCase().endsWith('.html');
      if (hasExtension && !isHtml) {
        return { code: 'wrong-file-type', message: 'Please choose a UNISA noname file.' };
      }
      return null;
    },
  });

  const hasError = fileRejections.length > 0;

  return (
    <div className="mb-8 space-y-3">
      <div
        {...getRootProps()}
        className={`relative rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200
          ${isDragActive
            ? 'border-primary bg-primary/10 scale-[1.01] shadow-xl'
            : hasError
            ? 'border-red-300 bg-red-50 hover:border-red-400'
            : 'border-gray-300 bg-white/80 hover:border-primary hover:bg-primary/5 hover:shadow-md'
          }`}
      >
        {/* Pulse ring when dragging */}
        {isDragActive && (
          <div className="drop-active-ring absolute inset-0 rounded-2xl border-4 border-primary pointer-events-none" />
        )}

        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center px-6 py-14 sm:py-20">
          <div className={`relative mb-5 flex h-20 w-20 items-center justify-center rounded-full transition-all duration-200
            ${isDragActive ? 'bg-primary/20 scale-110' : hasError ? 'bg-red-100' : 'bg-primary/10'}`}>
            {hasError
              ? <AlertCircle className="w-10 h-10 text-red-500" />
              : <Upload className={`w-10 h-10 transition-all duration-200 ${isDragActive ? 'text-primary -translate-y-1' : 'text-primary'}`} />
            }
          </div>

          <div className="flex items-center gap-2 mb-2">
            {isDragActive && <Sparkles className="w-5 h-5 text-primary" />}
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              {isDragActive ? 'Drop it here!' : 'Upload your UNISA noname file'}
            </h2>
          </div>

          <p className="text-sm text-gray-500 text-center mb-6 max-w-xs">
            Drag and drop, or tap the button below to browse your device
          </p>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/30 hover:bg-primary/90 active:scale-95 transition-all"
          >
            <Upload className="w-4 h-4" />
            Choose File
          </button>

          <p className="text-xs text-gray-400 mt-5">
            Accepts UNISA noname files · Max 2 MB
          </p>
        </div>
      </div>

      {hasError && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800 text-sm">Upload error</p>
            <p className="text-red-700 text-xs mt-0.5">
              {fileRejections[0]?.errors[0]?.message ?? 'The selected file is not valid.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
