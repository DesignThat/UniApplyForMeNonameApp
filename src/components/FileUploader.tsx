import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
}

export function FileUploader({ onFileUpload }: FileUploaderProps) {
  const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE_BYTES,
    validator: (file) => {
      const hasExtension = file.name.includes('.');
      const isHtml = file.name.toLowerCase().endsWith('.html');
      
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return {
          code: 'file-too-large',
          message: 'File is too large. Maximum size is 2MB.'
        };
      }

      if (hasExtension && !isHtml) {
        return {
          code: 'wrong-file-type',
          message: 'Please choose a UNISA noname file.'
        };
      }
      return null;
    }
  });

  const hasError = fileRejections.length > 0;

  return (
    <div className="mb-8">
      <Card
        {...getRootProps()}
        className={`p-6 sm:p-12 border-2 border-dashed cursor-pointer transition-all duration-200 transform
          ${isDragActive 
            ? 'border-primary bg-primary/10 scale-[1.02] shadow-lg' 
            : hasError
            ? 'border-red-300 bg-red-50 hover:border-red-400'
            : 'border-gray-300 bg-white hover:border-primary hover:bg-primary/5'}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center">
          {hasError ? (
            <AlertCircle className="w-10 h-10 sm:w-14 sm:h-14 mb-3 sm:mb-4 text-red-500" />
          ) : (
            <Upload className={`w-10 h-10 sm:w-14 sm:h-14 mb-3 sm:mb-4 transition-all duration-200 ${
              isDragActive ? 'text-primary scale-110' : 'text-primary'
            }`} />
          )}
          
          <div className="text-base sm:text-xl font-semibold mb-2 sm:mb-3 text-center text-gray-900 flex items-center justify-center gap-2">
            {isDragActive && <Sparkles className="w-6 h-6 text-primary" />}
            <span>{isDragActive ? 'Drop your file here' : 'Upload your UNISA file'}</span>
          </div>
          
          <p className="text-xs sm:text-sm text-gray-600 text-center mb-4 sm:mb-6">
            You can drag and drop it here, or choose it from your device
          </p>
          
          <Button size="lg">
            Choose File
          </Button>
          
          <p className="text-xs sm:text-sm text-gray-500 text-center mt-4 sm:mt-6">
            Best results: UNISA noname files up to 2MB
          </p>
        </div>
      </Card>

      {hasError && (
        <Card className="mt-4 p-4 bg-red-50 border-red-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-800 text-sm sm:text-base">Upload Error</p>
              <p className="text-red-700 text-xs sm:text-sm mt-1">
                {fileRejections[0]?.errors[0]?.message ?? 'The selected file is not valid.'}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}