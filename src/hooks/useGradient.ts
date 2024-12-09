import { useState, useCallback } from 'react';
import { GradientConfig, GradientType, ColorStop } from '../types/gradient';

const generateId = () => Math.random().toString(36).substr(2, 9);

const initialGradient: GradientConfig = {
  type: 'linear',
  angle: 90,
  centerX: 50,
  centerY: 50,
  colorStops: [
    { color: '#FF0080', position: 0, id: generateId() },
    { color: '#7928CA', position: 100, id: generateId() },
  ],
};

export function useGradient() {
  const [gradient, setGradient] = useState<GradientConfig>(initialGradient);

  const updateType = useCallback((type: GradientType) => {
    setGradient(prev => ({ ...prev, type }));
  }, []);

  const updateAngle = useCallback((angle: number) => {
    setGradient(prev => ({ ...prev, angle }));
  }, []);

  const updateCenter = useCallback((x: number, y: number) => {
    setGradient(prev => ({ ...prev, centerX: x, centerY: y }));
  }, []);

  const addColorStop = useCallback((color: string) => {
    setGradient(prev => ({
      ...prev,
      colorStops: [...prev.colorStops, { color, position: 50, id: generateId() }],
    }));
  }, []);

  const updateColorStop = useCallback((id: string, updates: Partial<ColorStop>) => {
    setGradient(prev => ({
      ...prev,
      colorStops: prev.colorStops.map(stop => 
        stop.id === id ? { ...stop, ...updates } : stop
      ),
    }));
  }, []);

  const removeColorStop = useCallback((id: string) => {
    setGradient(prev => ({
      ...prev,
      colorStops: prev.colorStops.filter(stop => stop.id !== id),
    }));
  }, []);

  const generateCSS = useCallback(() => {
    const stops = gradient.colorStops
      .map(stop => `${stop.color} ${stop.position}%`)
      .join(', ');

    switch (gradient.type) {
      case 'linear':
        return `linear-gradient(${gradient.angle}deg, ${stops})`;
      case 'radial':
        return `radial-gradient(circle at ${gradient.centerX}% ${gradient.centerY}%, ${stops})`;
      case 'conic':
        return `conic-gradient(from ${gradient.angle}deg at ${gradient.centerX}% ${gradient.centerY}%, ${stops})`;
    }
  }, [gradient]);

  return {
    gradient,
    updateType,
    updateAngle,
    updateCenter,
    addColorStop,
    updateColorStop,
    removeColorStop,
    generateCSS,
  };
}