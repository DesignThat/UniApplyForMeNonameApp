import { useState } from 'react';
import { X, Smartphone } from 'lucide-react';

const APP_URL = 'https://apply.org.za/app/?utm_source=noname-viewer&utm_medium=banner&utm_campaign=app-download&utm_content=top-banner';

export function AppBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-secondary text-white">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
        <Smartphone className="w-5 h-5 flex-shrink-0 opacity-90" />

        <p className="flex-1 text-sm leading-snug">
          <span className="font-semibold">Get the free UniApplyForMe app.</span>
          {' '}View files, calculate your APS score, match qualifications, and keep all your documents saved permanently.
          {' '}Available on{' '}
          <a
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 font-semibold hover:opacity-80 transition-opacity"
          >
            iOS, Android and Huawei
          </a>.
        </p>

        <a
          href={APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 hidden sm:inline-flex items-center px-3 py-1.5 rounded-lg bg-white text-secondary text-xs font-bold hover:bg-gray-100 transition-colors"
        >
          Download free
        </a>

        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss banner"
          className="flex-shrink-0 p-1 rounded hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4 opacity-70" />
        </button>
      </div>
    </div>
  );
}
