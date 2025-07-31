'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import config from '@/config';

declare global {
  interface Window {
    naver: typeof naver;
  }
}

interface NaverMapProps {
  onSizeChange?: (size: { width: number; height: number }) => void;
  onVisibilityChange?: (isVisible: boolean) => void;
  onMapReady?: (map: naver.maps.Map) => void;
  onBoundsChange?: (bounds: {
    sw: { lat: number; lng: number }; // 좌하단 (Southwest)
    ne: { lat: number; lng: number }; // 우상단 (Northeast)
    nw: { lat: number; lng: number }; // 좌상단 (Northwest)
    se: { lat: number; lng: number }; // 우하단 (Southeast)
  }) => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function NaverMap({
  onSizeChange,
  onVisibilityChange,
  onMapReady,
  onBoundsChange,
  className = '',
  style = {},
}: NaverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<naver.maps.Map | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  const clientId = config.naver.map_client_id;

  // 지도 상태 관리
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [mapSize, setMapSize] = useState({ width: 0, height: 0 });

  // 지도 크기 변화 감지
  const handleResize = useCallback(
    (entries: ResizeObserverEntry[]) => {
      entries.forEach(entry => {
        const { width, height } = entry.contentRect;
        setMapSize({ width, height });

        // 부모 컴포넌트에 크기 변화 알림
        onSizeChange?.(entry.contentRect);

        // 지도 인스턴스가 있고 크기가 변경되었을 때 지도 리사이즈
        if (mapInstanceRef.current) {
          console.log('지도 크기 변화 감지:', { width, height });
          mapInstanceRef.current.refresh();
        }
      });
    },
    [onSizeChange],
  );

  // 지도 가시성 변화 감지
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        console.log('entry:::', entry);
        const isVisible = entry.isIntersecting;
        setIsMapVisible(isVisible);

        // 부모 컴포넌트에 가시성 변화 알림
        onVisibilityChange?.(isVisible);

        if (mapInstanceRef.current) {
          if (isVisible) {
            console.log('지도가 화면에 나타남');
            // 지도가 다시 보일 때 리프레시
            setTimeout(() => {
              mapInstanceRef.current?.refresh();
            }, 100);
          } else {
            console.log('지도가 화면에서 사라짐');
          }
        }
      });
    },
    [onVisibilityChange],
  );

  // 지도 경계 변화 감지
  const handleBoundsChange = useCallback(() => {
    if (!mapInstanceRef.current) return;

    const bounds = mapInstanceRef.current.getBounds();
    if (!bounds) return;

    // 각 모서리 좌표 계산
    const sw = bounds.getMin(); // 좌하단
    const ne = bounds.getMax(); // 우상단
    const nw = new window.naver.maps.LatLng(ne.y, sw.x); // 좌상단
    const se = new window.naver.maps.LatLng(sw.y, ne.x); // 우하단

    const boundsData = {
      sw: { lat: sw.y, lng: sw.x },
      ne: { lat: ne.y, lng: ne.x },
      nw: { lat: nw.lat(), lng: nw.lng() },
      se: { lat: se.lat(), lng: se.lng() },
    };

    console.log('지도 경계 변화:', boundsData);
    onBoundsChange?.(boundsData);
  }, [onBoundsChange]);

  useEffect(() => {
    if (!mapRef.current) return;

    const basic_loc = [37.3595704, 127.105399];
    const loc: number[] = [];

    if (navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          console.log('position:::', position);
          loc.push(position.coords.latitude, position.coords.longitude);
        },
        () => {
          loc.push(basic_loc[0], basic_loc[1]);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        },
      );
    }

    console.log('loc:::', loc);

    // ResizeObserver 설정
    resizeObserverRef.current = new ResizeObserver(handleResize);
    resizeObserverRef.current.observe(mapRef.current);

    // IntersectionObserver 설정
    intersectionObserverRef.current = new IntersectionObserver(
      handleIntersection,
      {
        threshold: 0.1, // 10% 이상 보일 때 감지
      },
    );
    intersectionObserverRef.current.observe(mapRef.current);

    // 이미 스크립트가 로드되어 있는지 확인
    if (window.naver && window.naver.maps) {
      initializeMap();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}`;
    script.async = true;

    script.onload = () => {
      initializeMap();
    };

    document.head.appendChild(script);

    function initializeMap() {
      if (!mapRef.current) return;

      const mapOptions: naver.maps.MapOptions = {
        center: new window.naver.maps.LatLng(loc[0], loc[1]),
        zoom: 10,
        disableKineticPan: false,
        scaleControl: false,
        logoControl: false,
        mapDataControl: false,
        zoomControl: false,
        mapTypeControl: false,
      };

      const map = new window.naver.maps.Map(mapRef.current, mapOptions);
      mapInstanceRef.current = map;

      // 지도 경계 변화 이벤트 리스너 추가
      window.naver.maps.Event.addListener(map, 'bounds_changed', () => {
        handleBoundsChange();
      });

      // 초기 경계 정보 전달
      setTimeout(() => {
        handleBoundsChange();
      }, 100);

      // 초기 크기 설정
      const rect = mapRef.current.getBoundingClientRect();
      setMapSize({ width: rect.width, height: rect.height });

      // 부모 컴포넌트에 지도 준비 완료 알림
      onMapReady?.(map);
    }

    // 클린업 함수
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect();
      }
      if (mapInstanceRef.current) {
        window.naver.maps.Event.clearListeners(
          mapInstanceRef.current,
          'bounds_changed',
        );
      }
    };
  }, [
    clientId,
    handleResize,
    handleIntersection,
    handleBoundsChange,
    onMapReady,
  ]);

  return (
    <div
      ref={mapRef}
      className={`h-full w-full ${className}`}
      style={{ minHeight: '87vh', ...style }}
    />
  );
}
