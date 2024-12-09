export type GradientType = 'linear' | 'radial' | 'conic';

export interface ColorStop {
  color: string;
  position: number;
  id: string;
}

export interface GradientConfig {
  type: GradientType;
  angle: number;
  centerX: number;
  centerY: number;
  colorStops: ColorStop[];
}