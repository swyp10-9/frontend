'use client';

import { useEffect, useRef } from 'react';

import config from '@/config';

declare global {
  interface Window {
    naver: typeof naver;
  }
}

export default function NaverMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const clientId = config.naver.map_client_id;

  useEffect(() => {
    if (!mapRef.current) return;

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
        center: new window.naver.maps.LatLng(37.3595704, 127.105399),
        zoom: 10,
        disableKineticPan: false,
      };

      new window.naver.maps.Map(mapRef.current, mapOptions);
    }
  }, [clientId]);

  return (
    <div ref={mapRef} className='h-full w-full' style={{ minHeight: '87vh' }} />
  );
}
