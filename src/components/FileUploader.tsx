import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, AlertCircle } from 'lucide-react';

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
}

export function FileUploader({ onFileUpload }: FileUploaderProps) {
  const MAX = 2 * 1024 * 1024;

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) onFileUpload(accepted[0]);
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: MAX,
    validator: (file) => {
      if (file.size > MAX) return { code: 'file-too-large', message: 'File exceeds the 2 MB limit.' };
      const hasExt = file.name.includes('.');
      const isHtml = file.name.toLowerCase().endsWith('.html');
      if (hasExt && !isHtml) return { code: 'wrong-type', message: 'Please choose a UNISA noname file (no extension or .html).' };
      return null;
    },
  });

  const error = fileRejections[0]?.errors[0]?.message;

  return (
    <div>
      <div
        {...getRootProps()}
        className={[
          'relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed cursor-pointer transition-colors duration-150 px-6 py-14 sm:py-20 text-center',
          isDragActive
            ? 'border-primary bg-primary/5'
            : error
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 bg-white hover:border-primary hover:bg-gray-50',
        ].join(' ')}
      >
        <input {...getInputProps()} />

        <div className={[
          'mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-colors',
          isDragActive ? 'bg-primary/15' : error ? 'bg-red-100' : 'bg-gray-100',
        ].join(' ')}>
          {error
            ? <AlertCircle className="w-7 h-7 text-red-500" />
            : <Upload className={`w-7 h-7 ${isDragActive ? 'text-primary' : 'text-gray-400'}`} />
          }
        </div>

        <p className="text-base font-semibold text-gray-800 mb-1">
          {isDragActive ? 'Drop the file here' : 'Upload your UNISA noname file'}
        </p>
        <p className="text-sm text-gray-400 mb-5">
          Drag and drop, or browse from your device
        </p>

        <button
          type="button"
          className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Choose File
        </button>

        <p className="mt-4 text-xs text-gray-400">Accepts noname or .html files · Max 2 MB</p>
      </div>

      {error && (
        <div className="mt-3 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
