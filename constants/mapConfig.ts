import type { MapConfig } from '@/types/map';

export const MAP_CONFIG: MapConfig = {
  minZoom: 6,
  maxZoom: 17,
  defaultZoom: 10,
  boundsChangeDelay: 700,
  centerChangeDelay: 500,
  refreshDelay: 100,
};

export const DEFAULT_LOCATION: [number, number] = [37.3595704, 127.105399];

export const MARKER_SIZES = {
  detailed: {
    width: 224,
    height: 64,
    anchorX: 60,
    anchorY: 30,
  },
  simple: {
    width: 36,
    height: 36,
    anchorX: 12,
    anchorY: 12,
  },
} as const;

export const ZOOM_THRESHOLD = 12;
