import { useState } from 'react';
import { ColorPicker } from './ColorPicker';
import { GradientConfig, GradientType } from '../types/gradient';
import { Sliders, Circle, Box, Trash2, Plus, Palette } from 'lucide-react';

interface GradientControlsProps {
  gradient: GradientConfig;
  onUpdateType: (type: GradientType) => void;
  onUpdateAngle: (angle: number) => void;
  onUpdateCenter: (x: number, y: number) => void;
  onAddColor: (color: string) => void;
  onUpdateColor: (id: string, color: string) => void;
  onUpdatePosition: (id: string, position: number) => void;
  onRemoveColor: (id: string) => void;
}

export function GradientControls({
  gradient,
  onUpdateType,
  onUpdateAngle,
  onUpdateCenter,
  onAddColor,
  onUpdateColor,
  onUpdatePosition,
  onRemoveColor,
}: GradientControlsProps) {
  const [activeColorPicker, setActiveColorPicker] = useState<string | null>(null);

  const handleColorPickerToggle = (id: string) => {
    setActiveColorPicker(activeColorPicker === id ? null : id);
  };

  const handleEyeDropper = async (id: string) => {
    if ('EyeDropper' in window) {
      try {
        const eyeDropper = new (window as Window & { EyeDropper: new () => { open: () => Promise<{ sRGBHex: string }> } }).EyeDropper();
        const result = await eyeDropper.open();
        onUpdateColor(id, result.sRGBHex);
      } catch (error) {
        console.error('EyeDropper error:', error);
      }
    } else {
      console.warn('EyeDropper API is not supported in this browser.');
    }
  };

  return (
    <div className="space-y-6 bg-white/90 dark:bg-gray-800/90">
      {/* Gradient Type Selection */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-200">
          <Box className="w-5 h-5 text-purple-500" />
          Gradient Type
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {(['linear', 'radial', 'conic'] as GradientType[]).map((type) => (
            <button
              key={type}
              onClick={() => onUpdateType(type)}
              className={`
                relative px-4 py-3 rounded-xl font-medium transition-all duration-300
                ${gradient.type === type
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25 scale-105 transform'
                  : 'bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }
              `}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
              {gradient.type === type && (
                <div className="absolute inset-0 rounded-xl bg-white/10 animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Angle Control for Linear and Conic Gradients */}
      {(gradient.type === 'linear' || gradient.type === 'conic') && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <Sliders className="w-5 h-5 text-purple-500" />
            Angle
          </h3>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="360"
              value={gradient.angle}
              onChange={(e) => onUpdateAngle(Number(e.target.value))}
              className="flex-1 accent-purple-500"
            />
            <div className="w-20 px-3 py-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg text-center font-mono text-sm">
              {gradient.angle}°
            </div>
          </div>
        </div>
      )}

      {/* Center Point Control for Radial and Conic Gradients */}
      {(gradient.type === 'radial' || gradient.type === 'conic') && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <Circle className="w-5 h-5 text-purple-500" />
            Center Point
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm text-gray-600 dark:text-gray-400">X Position</label>
                <span className="text-sm font-mono text-purple-500">{gradient.centerX}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={gradient.centerX}
                onChange={(e) => onUpdateCenter(Number(e.target.value), gradient.centerY)}
                className="w-full accent-purple-500"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm text-gray-600 dark:text-gray-400">Y Position</label>
                <span className="text-sm font-mono text-purple-500">{gradient.centerY}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={gradient.centerY}
                onChange={(e) => onUpdateCenter(gradient.centerX, Number(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Color Stops Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-200">
          <Palette className="w-5 h-5 text-purple-500 animate-pulse" />
          Color Stops
        </h3>

        {/* Mobile-friendly color stops list */}
        <div className="space-y-3 sm:space-y-4">
          {gradient.colorStops.map((stop, index) => (
            <div
              key={stop.id}
              className="group flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-4 bg-white/50 dark:bg-gray-700/30 rounded-xl transition-all hover:bg-white/80 dark:hover:bg-gray-700/50 backdrop-blur-sm border border-white/20 shadow-sm"
            >
              {/* Stop number and color picker - always in row */}
              <div className="flex items-center gap-3 mb-3 sm:mb-0">
                <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-semibold bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full ">
                  {index + 1}
                </span>
                <ColorPicker
                  id={stop.id}
                  color={stop.color}
                  onChange={(color) => onUpdateColor(stop.id, color)}
                  isActive={activeColorPicker === stop.id}
                  onToggle={() => handleColorPickerToggle(stop.id)}
                  onEyeDropper={() => handleEyeDropper(stop.id)}
                  totalPickers={gradient.colorStops.length}
                  index={index}
                />
              </div>

              {/* Position slider with value display */}
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-center px-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Position</span>
                  <span className="text-xs font-mono text-purple-500 ml-2">{stop.position}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={stop.position}
                  onChange={(e) => onUpdatePosition(stop.id, Number(e.target.value))}
                  className="w-full accent-purple-500 h-2 rounded-lg appearance-none bg-gray-200 dark:bg-gray-600"
                />
              </div>

              {/* Delete button */}
              <button
                onClick={() => onRemoveColor(stop.id)}
                disabled={gradient.colorStops.length <= 2}
                className={`
                  p-2 rounded-lg transition-all duration-300 self-center
                  ${gradient.colorStops.length <= 2
                    ? 'opacity-30 cursor-not-allowed'
                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 hover:scale-110'
                  }
                `}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Color Stop Button */}
        <button
          onClick={() => onAddColor('#000000')}
          className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/25"
        >
          <div className="relative">
            <Plus className="w-5 h-5" />
            <div className="absolute inset-0 opacity-75">
              <Plus className="w-5 h-5" />
            </div>
          </div>
          <span className="font-medium">Add Color Stop</span>
        </button>
      </div>
    </div>
  );
}