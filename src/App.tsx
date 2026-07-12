import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { FileUploader } from './components/FileUploader';
import { FileViewer } from './components/FileViewer';
import { ExternalLink, Play, ShieldCheck } from 'lucide-react';

export default function App() {
  const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState<string>('');

  const handleFileUpload = async (uploadedFile: File) => {
    try {
      if (uploadedFile.size > MAX_FILE_SIZE_BYTES) {
        toast.error('File too large. Maximum size is 2 MB.');
        return;
      }
      const text = await uploadedFile.text();
      const snippet = text.trim().toLowerCase().slice(0, 2000);
      if (!snippet.includes('<!doctype') && !snippet.includes('<')) {
        toast.error('This file does not look like a valid UNISA noname file.');
        return;
      }
      setFile(uploadedFile);
      setContent(text);
      toast.success(`Loaded ${uploadedFile.name}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not read the file. Please try again.');
    }
  };

  const handleClose = () => {
    setFile(null);
    setContent('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <a href="https://apply.org.za" target="_blank" rel="noopener noreferrer" aria-label="UniApplyForMe homepage">
            <img
              src="https://assets.apply.org.za/20241113200019/UniApplyForMe-H.png"
              alt="UniApplyForMe"
              className="h-8 w-auto"
            />
          </a>
          <a
            href="https://apply.org.za/university/unisa/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-primary transition-colors"
          >
            About UNISA
          </a>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10 sm:py-14">

        {/* ── Hero ── */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 leading-tight">
            Open Your UNISA Noname File
          </h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
            Upload the attachment from your UNISA email. Read it, copy the text, or save it as a PDF.
          </p>
        </div>

        {/* ── Upload / Viewer ── */}
        {!file
          ? <FileUploader onFileUpload={handleFileUpload} />
          : <FileViewer file={file} content={content} onClose={handleClose} />
        }

        {/* ── How it works (only before upload) ── */}
        {!file && (
          <ol className="mt-8 grid sm:grid-cols-3 gap-4" aria-label="How to use this tool">
            {[
              { n: '1', text: 'Download the noname file from your UNISA email.' },
              { n: '2', text: 'Upload or drag it onto the area above.' },
              { n: '3', text: 'Read the content, copy text, or download a PDF.' },
            ].map(({ n, text }) => (
              <li key={n} className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl p-4">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center mt-0.5">
                  {n}
                </span>
                <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
              </li>
            ))}
          </ol>
        )}

        {/* ── Privacy notice ── */}
        <p className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
          <ShieldCheck className="w-4 h-4 flex-shrink-0 text-gray-400" />
          Your file is processed entirely on your device and never uploaded to any server.
        </p>

        {/* ── Help resources ── */}
        {!file && (
          <div className="mt-10 border-t border-gray-200 pt-8">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Need help?</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <a
                href="https://apply.org.za/guides/how-to-open-the-unisa-noname-file/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-primary/40 hover:bg-primary/5 transition-all group"
              >
                <ExternalLink className="w-4 h-4 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-800 group-hover:text-primary transition-colors">Step-by-Step Guide</p>
                  <p className="text-xs text-gray-500">Written walkthrough</p>
                </div>
              </a>
              <a
                href="https://www.youtube.com/watch?v=wv49Z7X6PzA"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-red-300 hover:bg-red-50 transition-all group"
              >
                <Play className="w-4 h-4 text-red-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-800 group-hover:text-red-600 transition-colors">Video Tutorial</p>
                  <p className="text-xs text-gray-500">Watch on YouTube</p>
                </div>
              </a>
            </div>
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} UniApplyForMe. Helping South African students since 2024.</p>
          <a href="https://apply.org.za" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
            apply.org.za
          </a>
        </div>
      </footer>

      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
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
