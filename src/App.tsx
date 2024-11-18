import React, { useState } from 'react';
import { FileUploader } from './components/FileUploader';
import { FileViewer } from './components/FileViewer';
import { FileWarning } from 'lucide-react';

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileUpload = async (uploadedFile: File) => {
    try {
      setError('');
      setIsLoading(true);
      const text = await uploadedFile.text();

      if (!text.trim().toLowerCase().includes('<!doctype html') && 
          !text.trim().toLowerCase().includes('<html')) {
        throw new Error('The file does not appear to be a valid HTML file.');
      }

      setFile(uploadedFile);
      setContent(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to read the file. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setContent('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="centered-image">
          <a href="https://apply.org.za" target="_blank" rel="noopener noreferrer">
            <img 
              src="https://assets.apply.org.za/20241113200019/UniApplyForMe-H.png" 
              alt="UniApplyForMe" 
            />
          </a>
        </div>
        <div className="text-center mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-4xl font-bold text-secondary mb-2 sm:mb-4">UNISA noname File Viewer</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Upload your <a href='https://apply.org.za/university/unisa' className="text-primary hover:text-secondary">UNISA</a> noname file to preview its contents or convert it to PDF
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Powered by <a href="https://apply.org.za" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-secondary">UniApplyForMe</a>
          </p>
        </div>

        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700 text-sm sm:text-base">
            <FileWarning className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        {isLoading && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center text-blue-700 text-sm sm:text-base">
            <svg className="animate-spin h-5 w-5 mr-3 text-blue-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            Loading...
          </div>
        )}

        {!file && !isLoading && <FileUploader onFileUpload={handleFileUpload} />}

        {file && content && (
          <FileViewer
            file={file}
            content={content}
            onClose={handleClose}
          />
        )}
      </div>
    </div>
  );
}