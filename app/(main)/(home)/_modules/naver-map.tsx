'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { MAP_CONFIG } from '@/constants/mapConfig';
import { useFestivalData } from '@/hooks/useFestivalData';
import { useMapEvents } from '@/hooks/useMapEvents';
import { useMapMarkers } from '@/hooks/useMapMarkers';
import { useNaverMapScript } from '@/hooks/useNaverMapScript';
import type { Festival, NaverMapProps } from '@/types/map';
import { getCurrentLocation } from '@/utils/mapUtils';

declare global {
  interface Window {
    naver: typeof naver;
  }
}

export default function NaverMap({
  initialCenter,
  initialZoom,
  onSizeChange,
  onVisibilityChange,
  onMapReady,
  onZoomChange,
  onMarkerClick,
  className = '',
  style = {},
  focusFestivalId,
  queryParams,
  onMapInstanceReady,
}: NaverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<naver.maps.Map | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  const isInitializedRef = useRef(false);

  const [currentZoom, setCurrentZoom] = useState(MAP_CONFIG.defaultZoom);

  // 커스텀 훅들
  const { festivals, loadFestivalsInBounds, updateFestivalFocus } =
    useFestivalData(focusFestivalId);
  const {
    getCenterFromURL,
    handleResize,
    handleIntersection,
    handleBoundsChange,
    handleZoomChange,
    handleCenterChange,
    cleanup,
  } = useMapEvents();
  const { createMarkers, clearMarkers } = useMapMarkers();
  const { loadScript } = useNaverMapScript();

  // queryParams 변경 시 현재 bounds로 데이터 다시 로드
  useEffect(() => {
    if (mapInstanceRef.current && queryParams) {
      const bounds = mapInstanceRef.current.getBounds();
      if (bounds) {
        const boundsData = {
          sw: { lat: bounds.getMin().y, lng: bounds.getMin().x },
          ne: { lat: bounds.getMax().y, lng: bounds.getMax().x },
          nw: { lat: bounds.getMax().y, lng: bounds.getMin().x },
          se: { lat: bounds.getMin().y, lng: bounds.getMax().x },
        };
        loadFestivalsInBounds(boundsData, queryParams);
      }
    }
  }, [queryParams, loadFestivalsInBounds]);

  // 마커 클릭 핸들러
  const handleMarkerClick = useCallback(
    (festival: Festival, isDetailed: boolean) => {
      if (isDetailed) {
        console.log('상세 마커 클릭 - 축제 상세페이지로 이동:', festival);
      } else {
        console.log('작은 마커 클릭 - 상세 마커로 전환:', festival);
        updateFestivalFocus(festival.id);
      }

      onMarkerClick?.(festival, isDetailed);
    },
    [onMarkerClick, updateFestivalFocus],
  );

  // 마커 업데이트
  const updateMarkers = useCallback(() => {
    if (mapInstanceRef.current) {
      createMarkers(
        festivals,
        currentZoom,
        mapInstanceRef.current,
        handleMarkerClick,
      );
    }
  }, [festivals, currentZoom, createMarkers, handleMarkerClick]);

  // 지도 초기화
  const initializeMap = useCallback(async () => {
    if (!mapRef.current || isInitializedRef.current) return;

    isInitializedRef.current = true;

    // 초기 중심 좌표 결정
    let lat: number;
    let lng: number;

    const urlCenter = getCenterFromURL();
    if (urlCenter) {
      lat = urlCenter.lat;
      lng = urlCenter.lng;
    } else if (initialCenter) {
      lat = initialCenter.lat;
      lng = initialCenter.lng;
    } else {
      const current = await getCurrentLocation();
      lat = current[0];
      lng = current[1];
    }

    const mapOptions: naver.maps.MapOptions = {
      center: new window.naver.maps.LatLng(lat, lng),
      zoom: initialZoom || MAP_CONFIG.defaultZoom,
      minZoom: MAP_CONFIG.minZoom,
      maxZoom: MAP_CONFIG.maxZoom,
      disableKineticPan: false,
      scaleControl: false,
      logoControl: false,
      mapDataControl: false,
      zoomControl: false,
      mapTypeControl: false,
    };

    const map = new window.naver.maps.Map(mapRef.current, mapOptions);
    mapInstanceRef.current = map;

    // 지도 인스턴스가 준비되면 부모 컴포넌트에 전달
    onMapInstanceReady?.(map);

    // 이벤트 리스너 등록
    window.naver.maps.Event.addListener(map, 'bounds_changed', () => {
      handleBoundsChange(map, loadFestivalsInBounds);
    });

    window.naver.maps.Event.addListener(map, 'zoom_changed', () => {
      const zoom = map.getZoom();
      setCurrentZoom(zoom);
      handleZoomChange(map, onZoomChange, updateMarkers);
    });

    window.naver.maps.Event.addListener(map, 'center_changed', () => {
      handleCenterChange(map);
    });

    // 초기 축제 데이터 로드
    setTimeout(() => {
      const bounds = map.getBounds();
      if (bounds) {
        const boundsData = {
          sw: { lat: bounds.getMin().y, lng: bounds.getMin().x },
          ne: { lat: bounds.getMax().y, lng: bounds.getMax().x },
          nw: { lat: bounds.getMax().y, lng: bounds.getMin().x },
          se: { lat: bounds.getMin().y, lng: bounds.getMax().x },
        };
        loadFestivalsInBounds(boundsData, queryParams);
      }
    }, MAP_CONFIG.refreshDelay);

    onMapReady?.(map);
  }, [
    getCenterFromURL,
    initialCenter,
    initialZoom,
    onMapReady,
    onZoomChange,
    loadFestivalsInBounds,
    handleBoundsChange,
    handleZoomChange,
    handleCenterChange,
    updateMarkers,
    queryParams,
    onMapInstanceReady,
  ]);

  // 리사이즈 및 인터섹션 옵저버 설정
  useEffect(() => {
    if (!mapRef.current) return;

    resizeObserverRef.current = new ResizeObserver(entries => {
      handleResize(entries, onSizeChange, mapInstanceRef.current);
    });
    resizeObserverRef.current.observe(mapRef.current);

    intersectionObserverRef.current = new IntersectionObserver(
      entries => {
        handleIntersection(entries, onVisibilityChange, mapInstanceRef.current);
      },
      { threshold: 0.1 },
    );
    intersectionObserverRef.current.observe(mapRef.current);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect();
      }
    };
  }, [handleResize, handleIntersection, onSizeChange, onVisibilityChange]);

  // 스크립트 로딩 및 지도 초기화 (한 번만 실행)
  useEffect(() => {
    if (!isInitializedRef.current) {
      loadScript(initializeMap);
    }
  }, []); // 빈 의존성 배열로 한 번만 실행

  // 마커 업데이트
  useEffect(() => {
    if (mapInstanceRef.current && festivals.length > 0) {
      updateMarkers();
    }
  }, [festivals, updateMarkers]);

  // 정리
  useEffect(() => {
    return () => {
      cleanup();
      clearMarkers();
      isInitializedRef.current = false;
    };
  }, [cleanup, clearMarkers]);

  return (
    <div
      ref={mapRef}
      className={`h-full w-full ${className}`}
      style={{ minHeight: '87vh', ...style }}
    />
  );
}

// 기존 함수 export 유지 (하위 호환성)
export { getCurrentLocation } from '@/utils/mapUtils';
