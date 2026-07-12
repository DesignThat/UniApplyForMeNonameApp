import { useMemo, useRef, useState } from 'react';
import { FileText, Download, Copy, Check, Eye, Type, X, Lightbulb } from 'lucide-react';
import { toast } from 'react-toastify';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FileViewerProps {
  file: File;
  content: string;
  onClose: () => void;
}

export function FileViewer({ file, content, onClose }: FileViewerProps) {
  const [viewMode, setViewMode] = useState<'rendered' | 'text'>('rendered');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const plainText = useMemo(() => {
    try {
      return new DOMParser().parseFromString(content, 'text/html').body.textContent ?? '';
    } catch {
      return content;
    }
  }, [content]);

  // Replace the external UNISA logo with the locally-served copy so it
  // renders correctly in both the sandboxed iframe and html2canvas.
  const withLocalLogo = (html: string) =>
    html.replace(/https?:\/\/[^"'\s]*UnisaRGB_hires\.jpg/gi, '/UnisaRGB_hires.jpg');

  const previewDocument = useMemo(() => {
    const processed = withLocalLogo(content);
    if (/<html[\s>]/i.test(processed)) return processed;
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font-family:system-ui,sans-serif;line-height:1.6;padding:16px;color:#111}</style></head><body>${processed}</body></html>`;
  }, [content]);

  const downloadTxt = () => {
    const blob = new Blob([plainText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name || 'document'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Text file downloaded.');
  };

  const convertToPDF = async () => {
    setIsGenerating(true);
    let tempDiv: HTMLDivElement | null = null;
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pw = pdf.internal.pageSize.getWidth();
      const ph = pdf.internal.pageSize.getHeight();
      const m = 10;
      const cw = pw - m * 2;
      const ch = ph - m * 2 - 10;

      pdf.setProperties({
        title: `${file.name} - UNISA Noname Viewer`,
        author: 'UniApplyForMe',
        creator: 'UniApplyForMe',
      });

      tempDiv = document.createElement('div');
      tempDiv.innerHTML = withLocalLogo(content);
      tempDiv.style.cssText = 'width:800px;padding:20px;font-family:system-ui,sans-serif;';
      document.body.appendChild(tempDiv);

      const canvas = await html2canvas(tempDiv, { scale: 2, useCORS: true, logging: false, backgroundColor: '#fff' });
      const iw = cw;
      const ih = (canvas.height * iw) / canvas.width;
      const img = canvas.toDataURL('image/png');

      let left = ih;
      pdf.addImage(img, 'PNG', m, m, iw, ih);
      left -= ch;
      while (left > 0) {
        pdf.addPage();
        pdf.addImage(img, 'PNG', m, m - (ih - left), iw, ih);
        left -= ch;
      }

      const total = pdf.getNumberOfPages();
      pdf.setFontSize(9);
      for (let p = 1; p <= total; p++) {
        pdf.setPage(p);
        pdf.setTextColor(22, 166, 55);
        pdf.text('UniApplyForMe', m, ph - 6);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Page ${p} of ${total}`, pw / 2, ph - 6, { align: 'center' });
        pdf.text('apply.org.za', pw - m, ph - 6, { align: 'right' });
      }

      pdf.save(`${file.name || 'document'}.pdf`);
      toast.success('PDF downloaded.');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to generate PDF.');
    } finally {
      if (tempDiv?.parentNode) document.body.removeChild(tempDiv);
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (viewMode === 'text') {
      downloadTxt();
    } else {
      convertToPDF();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(plainText);
      setCopied(true);
      toast.success('Copied to clipboard.');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Copy failed. Please select and copy manually.');
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'rendered' | 'text')}>

        {/* Toolbar */}
        <div className="border-b border-gray-200 px-4 py-3">
          {/* Row 1: file info + close */}
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <FileText className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-sm font-semibold text-gray-800 truncate">{file.name}</span>
              <span className="text-xs text-gray-400 flex-shrink-0">{(file.size / 1024).toFixed(0)} KB</span>
            </div>
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors flex-shrink-0"
              aria-label="Upload a different file"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Upload another</span>
            </button>
          </div>

          {/* Row 2: tabs + download */}
          <div className="flex items-center gap-2 flex-wrap">
            <TabsList className="bg-gray-100 rounded-lg p-0.5 h-auto gap-0.5">
              <TabsTrigger
                value="rendered"
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors text-gray-500 hover:text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
              >
                <Eye className="w-3.5 h-3.5" />
                Document
              </TabsTrigger>
              <TabsTrigger
                value="text"
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors text-gray-500 hover:text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
              >
                <Type className="w-3.5 h-3.5" />
                Plain text
              </TabsTrigger>
            </TabsList>

            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="ml-auto flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
            >
              <Download className="w-3.5 h-3.5" />
              {isGenerating ? 'Preparing...' : viewMode === 'text' ? 'Download TXT' : 'Download PDF'}
            </button>
          </div>
        </div>

        {/* Content */}
        <TabsContent value="rendered" className="m-0">
          <div ref={contentRef}>
            <iframe
              title="Document preview"
              className="w-full min-h-[60vh] sm:min-h-[65vh] border-0 block"
              sandbox="allow-same-origin allow-popups"
              referrerPolicy="no-referrer"
              srcDoc={previewDocument}
            />
          </div>
        </TabsContent>

        <TabsContent value="text" className="m-0">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-400">Plain-text extraction. Select all or use the copy button.</p>
              <button
                onClick={handleCopy}
                className={[
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all',
                  copied
                    ? 'border-primary/30 bg-primary/5 text-primary'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50',
                ].join(' ')}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 max-h-[60vh] overflow-auto">
              <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 break-words leading-relaxed">
                {plainText}
              </pre>
            </div>
          </div>
        </TabsContent>

        {/* Hint */}
        <div className="border-t border-gray-100 px-4 py-2.5 flex items-center gap-2 text-xs text-gray-400 bg-gray-50">
          <Lightbulb className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
          Switch to Plain text to copy or download as TXT, or stay on Document to save as PDF.
        </div>
      </Tabs>
    </div>
  );
}
