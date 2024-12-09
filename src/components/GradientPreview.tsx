import { useState } from 'react';
import { Copy, Check, Code, Share2 } from 'lucide-react';
import { GradientConfig } from '../types/gradient';

interface GradientPreviewProps {
  readonly gradient: GradientConfig;
  readonly css: string;
}

export function GradientPreview({ gradient, css }: Readonly<GradientPreviewProps>) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`background: ${css};`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Gradient Studio',
          text: `Check out this beautiful gradient!\nCSS: background: ${css};`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative group">
        <div
          className={`
            relative overflow-hidden
            w-full h-[25rem] aspect-square
            rounded-3xl shadow-lg
          `}
          style={{ background: css }}
        >
          {/* Interactive Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
            <button
              onClick={() => handleShare()}
              className="p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-all duration-300"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* CSS Code Section */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-slate-200/35 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Code className="w-5 h-5 text-purple-500" />
            CSS Code
          </h3>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className={`
          flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300
          ${copied
                  ? 'bg-green-500 text-white'
                  : 'bg-purple-500 text-white hover:bg-purple-600'
                }
                     shadow-lg shadow-purple-500/25`} >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="text-sm">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span className="text-sm">Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
          <div className="relative max-h-[200px] overflow-y-auto custom-scrollbar">
            <pre className="relative bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 font-mono text-sm">
              <code className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-all">
                background: {css};
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}