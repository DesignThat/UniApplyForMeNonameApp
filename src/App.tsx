import { useState } from 'react';
import { FileUploader } from './components/FileUploader';
import { FileViewer } from './components/FileViewer';
import { FileWarning, ExternalLink, Play } from 'lucide-react';

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleFileUpload = async (uploadedFile: File) => {
    try {
      setError('');
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
              className="h-[50px] w-auto mx-auto"
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

        {!file && <FileUploader onFileUpload={handleFileUpload} />}

        {file && content && (
          <FileViewer
            file={file}
            content={content}
            onClose={handleClose}
          />
        )}

        {/* Help Resources Section */}
        <div className="mt-6 sm:mt-8 bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100">
          <h2 className="text-lg sm:text-xl font-semibold text-secondary mb-3 sm:mb-4">Need Help?</h2>
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            <a
              href="https://apply.org.za/guides/how-to-open-the-unisa-noname-file/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-3 sm:p-4 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors group"
            >
              <ExternalLink className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-secondary group-hover:text-primary text-sm sm:text-base">
                  Step-by-Step Guide
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Learn how to open UNISA noname files
                </p>
              </div>
            </a>
            <a
              href="https://www.youtube.com/watch?v=wv49Z7X6PzA"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-3 sm:p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors group"
            >
              <Play className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-secondary group-hover:text-red-600 text-sm sm:text-base">
                  Video Tutorial
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Watch how to use this tool
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Footer with additional info */}
      <footer className="mt-8 sm:mt-12 text-center text-xs sm:text-sm text-gray-500">
        <div className="max-w-4xl mx-auto px-4">
          <p className="mb-2">
            This tool helps you view and convert UNISA noname files (extensionless files) to PDF format for easy reading and sharing.
          </p>
          <p>
            For more university application assistance, visit{' '}
            <a href="https://apply.org.za" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-secondary">
              UniApplyForMe
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}