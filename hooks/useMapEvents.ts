import { useRef } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { MAP_CONFIG } from '@/constants/mapConfig';
import type { MapBounds, MapQueryParams } from '@/types/map';

export const useMapEvents = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const boundsChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const centerChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getCenterFromURL = () => {
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (!lat || !lng) return null;

    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    if (isNaN(latNum) || isNaN(lngNum)) return null;

    return { lat: latNum, lng: lngNum };
  };

  const updateURLWithCenter = (
    lat: number,
    lng: number,
    queryParams: MapQueryParams,
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('lat', lat.toFixed(6));
    params.set('lng', lng.toFixed(6));
    if (queryParams.status) {
      params.set('status', queryParams.status);
    }
    if (queryParams.period) {
      params.set('period', queryParams.period);
    }
    if (queryParams.withWhom) {
      params.set('withWhom', queryParams.withWhom);
    }
    if (queryParams.theme) {
      params.set('theme', queryParams.theme);
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.replace(newUrl, { scroll: false });
  };

  const handleResize = (
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
  };

  const handleIntersection = (
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
  };

  const handleBoundsChange = (
    mapInstance: naver.maps.Map,
    queryParams: MapQueryParams,
    onLoadFestivals?: (bounds: MapBounds, queryParams: MapQueryParams) => void,
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

    if (boundsChangeTimeoutRef.current) {
      clearTimeout(boundsChangeTimeoutRef.current);
    }

    boundsChangeTimeoutRef.current = setTimeout(() => {
      console.log('지도 경계 변화:', boundsData);
      onLoadFestivals?.(boundsData, queryParams);
    }, MAP_CONFIG.boundsChangeDelay);
  };

  const handleZoomChange = (
    mapInstance: naver.maps.Map,
    onZoomChange?: (zoom: number) => void,
    onUpdateMarkers?: () => void,
  ) => {
    if (!mapInstance) return;

    const zoom = mapInstance.getZoom();
    console.log('줌 레벨 변화:', zoom);

    onZoomChange?.(zoom);
    onUpdateMarkers?.();
  };

  const handleCenterChange = (
    mapInstance: naver.maps.Map,
    queryParams: MapQueryParams,
  ) => {
    if (!mapInstance) return;

    const center = mapInstance.getCenter();
    if (!center) return;

    if (centerChangeTimeoutRef.current) {
      clearTimeout(centerChangeTimeoutRef.current);
    }

    centerChangeTimeoutRef.current = setTimeout(() => {
      updateURLWithCenter(center.y, center.x, queryParams);
    }, MAP_CONFIG.centerChangeDelay);
  };

  const cleanup = () => {
    if (boundsChangeTimeoutRef.current) {
      clearTimeout(boundsChangeTimeoutRef.current);
    }
    if (centerChangeTimeoutRef.current) {
      clearTimeout(centerChangeTimeoutRef.current);
    }
  };

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
