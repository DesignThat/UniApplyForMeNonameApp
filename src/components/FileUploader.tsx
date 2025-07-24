import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
}

export function FileUploader({ onFileUpload }: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    maxFiles: 1,
    validator: (file) => {
      const hasExtension = file.name.includes('.');
      const isHtml = file.name.toLowerCase().endsWith('.html');
      
      if (hasExtension && !isHtml) {
        return {
          code: 'wrong-file-type',
          message: 'Only extensionless files or .html files are accepted'
        };
      }
      return null;
    }
  });

  return (
    <div
      {...getRootProps()}
      className={`w-full p-4 sm:p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors
        ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center text-gray-600">
        <Upload className="w-8 h-8 sm:w-12 sm:h-12 mb-3 sm:mb-4 text-primary" />
        <p className="text-base sm:text-lg font-medium mb-1 sm:mb-2 text-center">
          {isDragActive ? 'Drop your file here' : 'Drag & drop your file here'}
        </p>
        <p className="text-xs sm:text-sm text-gray-500 text-center">
          Accepts extensionless files or .html files
        </p>
        {fileRejections.length > 0 && (
          <p className="text-red-500 text-xs sm:text-sm mt-2 text-center">
            Only extensionless files or .html files are accepted
          </p>
        )}
      </div>
    </div>
  );
}