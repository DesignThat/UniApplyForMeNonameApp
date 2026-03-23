import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { FileUploader } from './components/FileUploader';
import { FileViewer } from './components/FileViewer';
import { ExternalLink, Play, Lock, Mail, Upload, FileCheck2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function App() {
  const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState<string>('');

  const handleFileUpload = async (uploadedFile: File) => {
    try {
      if (uploadedFile.size > MAX_FILE_SIZE_BYTES) {
        const errorMsg = 'File is too large. Please upload a file smaller than 2MB.';
        toast.error(errorMsg);
        return;
      }

      const text = await uploadedFile.text();
      const normalizedSnippet = text.trim().toLowerCase().slice(0, 2000);
      
      if (!normalizedSnippet.includes('<!doctype') &&
          !normalizedSnippet.includes('<')) {
        const errorMsg = 'The file does not appear to be valid.';
        toast.error(errorMsg);
        return;
      }
      
      setFile(uploadedFile);
      setContent(text);
      toast.success(`Successfully loaded ${uploadedFile.name}`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to read the file. Please try again.';
      toast.error(errorMsg);
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
        <div className="centered-image mb-8">
          <a href="https://apply.org.za" target="_blank" rel="noopener noreferrer">
            <img 
              src="https://assets.apply.org.za/20241113200019/UniApplyForMe-H.png" 
              alt="UniApplyForMe" 
              className="h-[50px] w-auto mx-auto transition-transform hover:scale-105"
            />
          </a>
        </div>
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-secondary mb-3 sm:mb-4">UNISA noname File Viewer</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-2">
            Upload your <a href='https://apply.org.za/university/unisa/' className="text-primary hover:text-secondary font-semibold transition-colors">UNISA</a> noname file to read it clearly and copy the important text
          </p>
          <p className="text-xs sm:text-sm text-gray-500">
            Powered by <a href="https://apply.org.za" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-secondary font-semibold">UniApplyForMe</a>
          </p>
        </div>

        <Card className="mb-6 sm:mb-8 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-secondary text-xl">How To Use This Tool</CardTitle>
            <CardDescription>Follow these 3 quick steps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="mb-3 flex items-center gap-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">1</span>
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm font-medium text-gray-900">Download the noname file from the UNISA email you received.</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="mb-3 flex items-center gap-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">2</span>
                  <Upload className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm font-medium text-gray-900">Select or upload the file on this page.</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="mb-3 flex items-center gap-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">3</span>
                  <FileCheck2 className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm font-medium text-gray-900">Your file is displayed and ready to read or copy.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {!file && <FileUploader onFileUpload={handleFileUpload} />}

        {file && content && (
          <FileViewer
            file={file}
            content={content}
            onClose={handleClose}
          />
        )}

        {/* Privacy Notice */}
        <div className="mt-4 sm:mt-6 flex items-center gap-2 text-xs sm:text-sm text-gray-600 bg-gray-50 rounded p-3 border border-gray-200">
          <Lock className="w-4 h-4 flex-shrink-0 text-gray-500" />
          <span>Your file stays on your device and is not shared anywhere.</span>
        </div>

        {/* Help Resources Section */}
        <Card className="mt-6 sm:mt-8">
          <CardHeader>
            <CardTitle className="text-secondary">Need Help?</CardTitle>
            <CardDescription>Get started with guides and video tutorials</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              <a
                href="https://apply.org.za/guides/how-to-open-the-unisa-noname-file/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-3 sm:p-4 bg-primary/5 hover:bg-primary/10 rounded-lg transition-all hover:shadow-md group"
              >
                <ExternalLink className="w-5 h-5 text-primary mr-3 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="font-medium text-secondary group-hover:text-primary text-sm sm:text-base transition-colors">
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
                className="flex items-center p-3 sm:p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-all hover:shadow-md group"
              >
                <Play className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="font-medium text-secondary group-hover:text-red-600 text-sm sm:text-base transition-colors">
                    Video Tutorial
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Watch how to use this tool
                  </p>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer with additional info */}
      <footer className="mt-8 sm:mt-12 text-center text-xs sm:text-sm text-gray-500">
        <div className="max-w-4xl mx-auto px-4">
          <p className="mb-2">
            This tool helps you open UNISA noname files, read them easily, and download a clean PDF copy.
          </p>
          <p>
            For more university application assistance, visit{' '}
            <a href="https://apply.org.za" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-secondary font-semibold">
              UniApplyForMe
            </a>
          </p>
        </div>
      </footer>

      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="app-toast"
        bodyClassName="app-toast-body"
        progressClassName="app-toast-progress"
      />
    </div>
  );
}