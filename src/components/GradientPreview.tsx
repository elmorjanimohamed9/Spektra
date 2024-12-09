import { useState, useRef } from 'react';
import { Copy, Check, Code, Share2, Download } from 'lucide-react';
import { GradientConfig } from '../types/gradient';
import html2canvas from 'html2canvas';

interface GradientPreviewProps {
  readonly gradient: GradientConfig;
  readonly css: string;
}

export function GradientPreview({ gradient, css }: Readonly<GradientPreviewProps>) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const gradientRef = useRef<HTMLDivElement>(null);

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

  const handleDownload = async () => {
    if (!gradientRef.current) return;
    
    try {
      setDownloading(true);
      const canvas = await html2canvas(gradientRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });
      
      const link = document.createElement('a');
      link.download = `spektra-gradient-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading gradient:', error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative group">
        <div
          ref={gradientRef}
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
              onClick={handleDownload}
              disabled={downloading}
              className="relative p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-all duration-300 group/download disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Download gradient as image"
            >
              <Download className={`w-5 h-5 ${downloading ? 'animate-bounce' : ''}`} />
              
              {/* Download Button Tooltip */}
              <span className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/download:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                Download PNG
              </span>
            </button>
            
            <button
              onClick={handleShare}
              className="relative p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-all duration-300 group/share"
              aria-label="Share gradient"
            >
              <Share2 className="w-5 h-5" />
              
              {/* Share Button Tooltip */}
              <span className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/share:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                Share Gradient
              </span>
            </button>
          </div>

          {/* Download Progress Overlay */}
          {downloading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm transition-all duration-300">
              <div className="bg-white/90 dark:bg-gray-800/90 p-4 rounded-2xl shadow-lg flex items-center gap-3 animate-fade-in">
                <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium">Preparing download...</span>
              </div>
            </div>
          )}
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
                ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-purple-500 text-white hover:bg-purple-600'
                }
                shadow-lg shadow-purple-500/25
              `}
              aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
            >
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