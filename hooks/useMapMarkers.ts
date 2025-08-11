import { useRef } from 'react';

import { createFestivalMarker } from '@/components/map/FestivalMarker';
import type { Festival } from '@/types/map';

export const useMapMarkers = () => {
  const markersRef = useRef<naver.maps.Marker[]>([]);

  const createMarkers = (
    festivals: Festival[],
    currentZoom: number,
    mapInstance: naver.maps.Map,
    onMarkerClick: (festival: Festival, isDetailed: boolean) => void,
  ) => {
    if (!mapInstance) return;

    console.log('createMarkers 호출✅✅✅✅:', festivals);

    // 기존 마커 제거
    markersRef.current.forEach(marker => {
      marker.setMap(null);
    });
    markersRef.current = [];

    // 새 마커 생성
    festivals.forEach(festival => {
      const marker = createFestivalMarker(festival, currentZoom, onMarkerClick);
      if (marker) {
        marker.setMap(mapInstance);
        markersRef.current.push(marker);
      }
    });
  };

  const clearMarkers = () => {
    markersRef.current.forEach(marker => {
      marker.setMap(null);
    });
    markersRef.current = [];
  };

  return {
    createMarkers,
    clearMarkers,
  };
};
