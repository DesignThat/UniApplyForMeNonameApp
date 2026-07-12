import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { FileUploader } from './components/FileUploader';
import { FileViewer } from './components/FileViewer';
import { ExternalLink, Play, Lock, Mail, Upload, FileCheck2, Sparkles } from 'lucide-react';

export default function App() {
  const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState<string>('');

  const handleFileUpload = async (uploadedFile: File) => {
    try {
      if (uploadedFile.size > MAX_FILE_SIZE_BYTES) {
        toast.error('File is too large. Please upload a file smaller than 2MB.');
        return;
      }

      const text = await uploadedFile.text();
      const normalizedSnippet = text.trim().toLowerCase().slice(0, 2000);

      if (!normalizedSnippet.includes('<!doctype') && !normalizedSnippet.includes('<')) {
        toast.error('The file does not appear to be valid.');
        return;
      }

      setFile(uploadedFile);
      setContent(text);
      toast.success(`Loaded ${uploadedFile.name}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to read the file. Please try again.');
    }
  };

  const handleClose = () => {
    setFile(null);
    setContent('');
  };

  const steps = [
    {
      icon: <Mail className="h-5 w-5 text-primary" />,
      label: 'Download',
      desc: 'Save the noname file from your UNISA email.',
    },
    {
      icon: <Upload className="h-5 w-5 text-primary" />,
      label: 'Upload',
      desc: 'Select or drag the file onto this page.',
    },
    {
      icon: <FileCheck2 className="h-5 w-5 text-primary" />,
      label: 'Read & Copy',
      desc: 'View the content and copy what you need.',
    },
  ];

  return (
    <div className="min-h-screen hero-gradient">
      {/* ── Header ── */}
      <header className="sticky top-0 z-30 border-b border-white/60 bg-white/70 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
          <a href="https://apply.org.za" target="_blank" rel="noopener noreferrer">
            <img
              src="https://assets.apply.org.za/20241113200019/UniApplyForMe-H.png"
              alt="UniApplyForMe"
              className="h-9 w-auto transition-transform hover:scale-105"
            />
          </a>
          <span className="text-xs font-medium text-gray-500 hidden sm:block">
            UNISA Noname File Viewer
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10 sm:py-14">
        {/* ── Hero ── */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary mb-5 border border-primary/20">
            <Sparkles className="w-3.5 h-3.5" />
            Free · Private · No sign-up
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-secondary leading-tight mb-4">
            Open Your UNISA<br className="hidden sm:block" /> Noname File
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto">
            Upload the mysterious attachment from your{' '}
            <a href="https://apply.org.za/university/unisa/" className="text-primary font-semibold hover:underline">
              UNISA
            </a>{' '}
            email and instantly read, copy, or download it as a PDF.
          </p>
        </div>

        {/* ── Steps ── */}
        {!file && (
          <div className="grid sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
            {steps.map((step, i) => (
              <div
                key={i}
                className="flex flex-col gap-3 rounded-2xl border border-white/80 bg-white/70 backdrop-blur p-5 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="step-badge inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm">
                    {i + 1}
                  </span>
                  <span className="font-semibold text-secondary text-sm">{step.label}</span>
                  {step.icon}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── File uploader / viewer ── */}
        {!file && <FileUploader onFileUpload={handleFileUpload} />}

        {file && content && (
          <FileViewer file={file} content={content} onClose={handleClose} />
        )}

        {/* ── Privacy notice ── */}
        <div className="mt-5 flex items-center gap-2.5 text-xs sm:text-sm text-gray-600 bg-white/60 backdrop-blur rounded-xl px-4 py-3 border border-white/70 shadow-sm">
          <Lock className="w-4 h-4 flex-shrink-0 text-gray-400" />
          <span>Your file is processed entirely on your device and never uploaded anywhere.</span>
        </div>

        {/* ── Help resources ── */}
        <div className="mt-6 sm:mt-8 rounded-2xl border border-white/80 bg-white/70 backdrop-blur shadow-sm overflow-hidden">
          <div className="px-5 pt-5 pb-3 border-b border-gray-100">
            <h2 className="font-bold text-secondary text-base">Need Help?</h2>
            <p className="text-xs text-gray-500 mt-0.5">Guides and video tutorials</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 p-4">
            <a
              href="https://apply.org.za/guides/how-to-open-the-unisa-noname-file/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-xl bg-primary/5 hover:bg-primary/10 border border-primary/10 p-4 transition-all hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <ExternalLink className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-secondary text-sm group-hover:text-primary transition-colors">
                  Step-by-Step Guide
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Learn how to open UNISA noname files</p>
              </div>
            </a>
            <a
              href="https://www.youtube.com/watch?v=wv49Z7X6PzA"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-xl bg-red-50 hover:bg-red-100 border border-red-100 p-4 transition-all hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 flex-shrink-0 group-hover:bg-red-200 transition-colors">
                <Play className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-secondary text-sm group-hover:text-red-600 transition-colors">
                  Video Tutorial
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Watch how to use this tool</p>
              </div>
            </a>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-200/60 bg-white/50 backdrop-blur mt-4">
        <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>Helping South African students open UNISA files since 2024.</p>
          <p>
            More help at{' '}
            <a href="https://apply.org.za" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">
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
