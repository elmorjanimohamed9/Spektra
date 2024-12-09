import { useState } from 'react';
import { Pipette, Check, Copy, RefreshCw } from 'lucide-react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  onEyeDropper?: () => void;
  isActive: boolean;
  onToggle: () => void;
  id: string;
  totalPickers: number;
  index: number;
}


export function ColorPicker({
  color,
  onChange,
  onEyeDropper,
}: ColorPickerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(color);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const generateRandomColor = () => {
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    onChange(randomColor);
  };

  const isValidColor = (color: string) => {
    const s = new Option().style;
    s.color = color;
    return s.color !== '';
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-white w-[20rem] dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="relative group/picker">
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-16 h-16 sm:w-12 sm:h-12 cursor-pointer"
        />
      </div>

      <div className="flex flex-1 items-center gap-3">
        <div className="relative flex-1 max-w-[200px]">
          <input
            type="text"
            value={color}
            onChange={(e) => {
              const newColor = e.target.value;
              if (isValidColor(newColor)) {
                onChange(newColor);
              }
            }}
            className={`w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg font-mono text-sm 
              border-2 transition-all ${isValidColor(color)
                ? 'border-transparent focus:border-purple-500'
                : 'border-red-500'
              } focus:outline-none`}
            spellCheck="false"
          />
          <button
            onClick={handleCopy}
            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={generateRandomColor}
            className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-300 group/random hover:shadow-md"
            title="Generate Random Color"
          >
            <RefreshCw className="w-5 h-5 transition-transform duration-300 group-hover/random:rotate-180" />
          </button>

          {onEyeDropper && (
            <button
              onClick={onEyeDropper}
              className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-300 group/eyedropper hover:shadow-md"
              title="Pick Color from Screen"
            >
              <Pipette className="w-5 h-5 transition-transform duration-300 group-hover/eyedropper:scale-110" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}