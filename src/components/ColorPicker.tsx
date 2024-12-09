import React, { useState, useEffect } from 'react';
import { Pipette, Palette, Check, Copy, Plus, Trash2, RefreshCw } from 'lucide-react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  onEyeDropper?: () => void;
}

export function ColorPicker({ color, onChange, onEyeDropper }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [customColors, setCustomColors] = useState<string[]>(() => {
    const saved = localStorage.getItem('customColors');
    return saved ? JSON.parse(saved) : [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
      '#D4A5A5', '#9B59B6', '#3498DB', '#E74C3C', '#2ECC71'
    ];
  });

  useEffect(() => {
    localStorage.setItem('customColors', JSON.stringify(customColors));
  }, [customColors]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(color);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleAddColor = (newColor: string) => {
    if (!customColors.includes(newColor)) {
      setCustomColors(prev => [newColor, ...prev.slice(0, 19)]);
    }
  };

  const handleRemoveColor = (colorToRemove: string) => {
    setCustomColors(prev => prev.filter(c => c !== colorToRemove));
  };

  const generateRandomColor = () => {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    onChange(randomColor);
  };

  const isValidColor = (color: string) => {
    const s = new Option().style;
    s.color = color;
    return s.color !== '';
  };

  return (
    <div className="relative group">
      {/* Main Color Display and Input */}
      <div className="flex items-center gap-3 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 group-hover:border-purple-500/50 transition-all duration-300">
        {/* Color Preview Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-12 h-12 rounded-lg shadow-inner overflow-hidden group/color"
        >
          <div
            className="absolute inset-0 transition-transform duration-300 group-hover/color:scale-110"
            style={{ background: color }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-black/20" />
          <Palette className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-white opacity-0 group-hover/color:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
        </button>

        {/* Color Input Field */}
        <div className="relative">
          <input
            type="text"
            value={color}
            onChange={(e) => {
              const newColor = e.target.value;
              if (isValidColor(newColor)) {
                onChange(newColor);
              }
            }}
            className={`w-28 px-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg font-mono text-sm 
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

        {/* Action Buttons */}
        <div className="flex gap-1">
          <button
            onClick={generateRandomColor}
            className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-300 group/random"
            title="Generate Random Color"
          >
            <RefreshCw className="w-5 h-5 transition-transform duration-300 group-hover/random:rotate-180" />
          </button>
          
          {onEyeDropper && (
            <button
              onClick={onEyeDropper}
              className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-300 group/eyedropper"
              title="Pick Color from Screen"
            >
              <Pipette className="w-5 h-5 transition-transform duration-300 group-hover/eyedropper:scale-110" />
            </button>
          )}
        </div>
      </div>

      {/* Color Picker Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-top-2 min-w-[320px]">
          {/* Add New Color Section */}
          <div className="mb-6 space-y-3">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Add New Color
            </label>
            <div className="flex gap-2">
              <div className="relative group/picker">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-200 dark:border-gray-700 p-1 transition-transform group-hover/picker:scale-105"
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/5 to-black/20 pointer-events-none" />
              </div>
              <button
                onClick={() => handleAddColor(color)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all duration-300 group hover:shadow-lg hover:shadow-purple-500/25"
              >
                <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
                Add to Collection
              </button>
            </div>
          </div>

          {/* Color Collection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Color Collection
              </label>
              <span className="text-xs text-gray-400">
                {customColors.length}/20 colors
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {customColors.map((customColor) => (
                <div key={customColor} className="group/color relative">
                  <button
                    onClick={() => {
                      onChange(customColor);
                      setIsOpen(false);
                    }}
                    className="relative w-full pt-[100%] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div
                      className="absolute inset-0 transition-transform duration-300 group-hover/color:scale-110"
                      style={{ background: customColor }}
                    />
                    {color === customColor && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                  {/* Remove Color Button */}
                  <button
                    onClick={() => handleRemoveColor(customColor)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover/color:opacity-100 transition-all duration-300 hover:bg-red-600 hover:scale-110"
                    title="Remove Color"
                  >
                    <Trash2 className="w-3 h-3 m-1" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}