import { useCallback, useRef } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { MAP_CONFIG } from '@/constants/mapConfig';
import type { MapBounds } from '@/types/map';

export const useMapEvents = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const boundsChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const centerChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getCenterFromURL = useCallback(() => {
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (!lat || !lng) return null;

    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    if (isNaN(latNum) || isNaN(lngNum)) return null;

    return { lat: latNum, lng: lngNum };
  }, [searchParams]);

  const updateURLWithCenter = useCallback(
    (lat: number, lng: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('lat', lat.toFixed(6));
      params.set('lng', lng.toFixed(6));

      const newUrl = `${window.location.pathname}?${params.toString()}`;
      router.replace(newUrl, { scroll: false });
    },
    [searchParams, router],
  );

  const handleResize = useCallback(
    (
      entries: ResizeObserverEntry[],
      onSizeChange?: (size: { width: number; height: number }) => void,
      mapInstance?: naver.maps.Map | null,
    ) => {
      entries.forEach(entry => {
        onSizeChange?.(entry.contentRect);

        if (mapInstance) {
          console.log('지도 크기 변화 감지:', entry.contentRect);
          mapInstance.refresh();
        }
      });
    },
    [],
  );

  const handleIntersection = useCallback(
    (
      entries: IntersectionObserverEntry[],
      onVisibilityChange?: (isVisible: boolean) => void,
      mapInstance?: naver.maps.Map | null,
    ) => {
      entries.forEach(entry => {
        const isVisible = entry.isIntersecting;
        onVisibilityChange?.(isVisible);

        if (mapInstance) {
          if (isVisible) {
            console.log('지도가 화면에 나타남');
            setTimeout(() => {
              mapInstance?.refresh();
            }, MAP_CONFIG.refreshDelay);
          } else {
            console.log('지도가 화면에서 사라짐');
          }
        }
      });
    },
    [],
  );

  const handleBoundsChange = useCallback(
    (
      mapInstance: naver.maps.Map,
      onBoundsChange?: (bounds: MapBounds) => void,
      onLoadFestivals?: (bounds: MapBounds) => void,
    ) => {
      if (!mapInstance) return;

      const bounds = mapInstance.getBounds();
      if (!bounds) return;

      const boundsData = {
        sw: { lat: bounds.getMin().y, lng: bounds.getMin().x },
        ne: { lat: bounds.getMax().y, lng: bounds.getMax().x },
        nw: { lat: bounds.getMax().y, lng: bounds.getMin().x },
        se: { lat: bounds.getMin().y, lng: bounds.getMax().x },
      };

      console.log('지도 경계 변화:', boundsData);
      onBoundsChange?.(boundsData);

      if (boundsChangeTimeoutRef.current) {
        clearTimeout(boundsChangeTimeoutRef.current);
      }

      boundsChangeTimeoutRef.current = setTimeout(() => {
        onLoadFestivals?.(boundsData);
      }, MAP_CONFIG.boundsChangeDelay);
    },
    [],
  );

  const handleZoomChange = useCallback(
    (
      mapInstance: naver.maps.Map,
      onZoomChange?: (zoom: number) => void,
      onUpdateMarkers?: () => void,
    ) => {
      if (!mapInstance) return;

      const zoom = mapInstance.getZoom();
      console.log('줌 레벨 변화:', zoom);

      onZoomChange?.(zoom);
      onUpdateMarkers?.();
    },
    [],
  );

  const handleCenterChange = useCallback(
    (mapInstance: naver.maps.Map) => {
      if (!mapInstance) return;

      const center = mapInstance.getCenter();
      if (!center) return;

      if (centerChangeTimeoutRef.current) {
        clearTimeout(centerChangeTimeoutRef.current);
      }

      centerChangeTimeoutRef.current = setTimeout(() => {
        updateURLWithCenter(center.y, center.x);
      }, MAP_CONFIG.centerChangeDelay);
    },
    [updateURLWithCenter],
  );

  const cleanup = useCallback(() => {
    if (boundsChangeTimeoutRef.current) {
      clearTimeout(boundsChangeTimeoutRef.current);
    }
    if (centerChangeTimeoutRef.current) {
      clearTimeout(centerChangeTimeoutRef.current);
    }
  }, []);

  return {
    getCenterFromURL,
    updateURLWithCenter,
    handleResize,
    handleIntersection,
    handleBoundsChange,
    handleZoomChange,
    handleCenterChange,
    cleanup,
  };
};
