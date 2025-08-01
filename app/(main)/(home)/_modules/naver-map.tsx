'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import config from '@/config';
import themeList from '@/constants/themeList';

declare global {
  interface Window {
    naver: typeof naver;
  }
}

interface Festival {
  id: number;
  title: string;
  theme: string;
  image: string;
  loc: string;
  start_date: string;
  end_date: string;
  is_marked: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
  isDetailed?: boolean;
}

interface FestivalResponse {
  festivals: Festival[];
  total: number;
}

const fetchFestivalsInBounds = async (bounds: {
  sw: { lat: number; lng: number };
  ne: { lat: number; lng: number };
  nw: { lat: number; lng: number };
  se: { lat: number; lng: number };
}): Promise<FestivalResponse> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const festivals: Festival[] = Array.from({ length: 15 }, (_, index) => {
    const lat = bounds.sw.lat + Math.random() * (bounds.ne.lat - bounds.sw.lat);
    const lng = bounds.sw.lng + Math.random() * (bounds.ne.lng - bounds.sw.lng);

    return {
      id: index + 1,
      title: `축제 제목 ${index + 1}`,
      theme: [
        'culture_art',
        'food_cuisine',
        'music_performance',
        'nature_experience',
        'tradition_history',
      ][Math.floor(Math.random() * 5)],
      image: `https://picsum.photos/200/300?random=${index + 1}`,
      loc: ['서울', '경기', '강원', '충청', '전라', '경상', '제주'][
        Math.floor(Math.random() * 7)
      ],
      start_date: '2025-07-10',
      end_date: '2025-07-10',
      is_marked: Math.random() > 0.7,
      coordinates: { lat, lng },
    };
  });

  return {
    festivals,
    total: festivals.length,
  };
};

interface NaverMapProps {
  onSizeChange?: (size: { width: number; height: number }) => void;
  onVisibilityChange?: (isVisible: boolean) => void;
  onMapReady?: (map: naver.maps.Map) => void;
  onBoundsChange?: (bounds: {
    sw: { lat: number; lng: number };
    ne: { lat: number; lng: number };
    nw: { lat: number; lng: number };
    se: { lat: number; lng: number };
  }) => void;
  onMarkerClick?: (festival: Festival, isDetailed: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function NaverMap({
  onSizeChange,
  onVisibilityChange,
  onMapReady,
  onBoundsChange,
  onMarkerClick,
  className = '',
  style = {},
}: NaverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<naver.maps.Map | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  const markersRef = useRef<naver.maps.Marker[]>([]);
  const clientId = config.naver.map_client_id;

  const [currentZoom, setCurrentZoom] = useState(10);
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [isLoadingFestivals, setIsLoadingFestivals] = useState(false);

  const handleResize = useCallback(
    (entries: ResizeObserverEntry[]) => {
      entries.forEach(entry => {
        const { width, height } = entry.contentRect;

        onSizeChange?.(entry.contentRect);

        if (mapInstanceRef.current) {
          console.log('지도 크기 변화 감지:', { width, height });
          mapInstanceRef.current.refresh();
        }
      });
    },
    [onSizeChange],
  );

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        console.log('entry:::', entry);
        const isVisible = entry.isIntersecting;

        onVisibilityChange?.(isVisible);

        if (mapInstanceRef.current) {
          if (isVisible) {
            console.log('지도가 화면에 나타남');

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

  const handleBoundsChange = useCallback(() => {
    if (!mapInstanceRef.current) return;

    const bounds = mapInstanceRef.current.getBounds();
    if (!bounds) return;

    const sw = bounds.getMin();
    const ne = bounds.getMax();
    const nw = new window.naver.maps.LatLng(ne.y, sw.x);
    const se = new window.naver.maps.LatLng(sw.y, ne.x);

    const boundsData = {
      sw: { lat: sw.y, lng: sw.x },
      ne: { lat: ne.y, lng: ne.x },
      nw: { lat: nw.lat(), lng: nw.lng() },
      se: { lat: se.lat(), lng: se.lng() },
    };

    console.log('지도 경계 변화:', boundsData);
    onBoundsChange?.(boundsData);

    loadFestivalsInBounds(boundsData);
  }, [onBoundsChange]);

  const handleZoomChange = useCallback(() => {
    if (!mapInstanceRef.current) return;

    const zoom = mapInstanceRef.current.getZoom();
    setCurrentZoom(zoom);
    console.log('줌 레벨 변화:', zoom);

    updateMarkers();
  }, []);

  const handleMarkerClick = useCallback(
    (festival: Festival, isDetailed: boolean) => {
      if (isDetailed) {
        console.log('상세 마커 클릭 - 축제 상세페이지로 이동:', festival);
      } else {
        console.log('작은 마커 클릭 - 상세 마커로 전환:', festival);
        setFestivals(prevFestivals =>
          prevFestivals.map(f => ({
            ...f,
            isDetailed: f.id === festival.id,
          })),
        );
      }

      onMarkerClick?.(festival, isDetailed);
    },
    [onMarkerClick],
  );

  const createMarker = useCallback(
    (festival: Festival) => {
      if (!mapInstanceRef.current) return null;

      const theme = themeList.find(t => t.type === festival.theme);
      if (!theme) return null;

      const position = new window.naver.maps.LatLng(
        festival.coordinates.lat,
        festival.coordinates.lng,
      );

      const isDetailed = currentZoom >= 12 || festival.isDetailed;

      const markerElement = document.createElement('div');
      markerElement.className = 'festival-marker';
      markerElement.style.cssText = `
      position: relative;
      cursor: pointer;
      transition: all 0.3s ease;
    `;

      const unMarked = `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.08598 2.43691C9.51298 1.40991 10.966 1.40991 11.394 2.43691L13.137 6.62691L17.661 6.98991C18.769 7.07891 19.219 8.46191 18.374 9.18491L14.927 12.1379L15.98 16.5529C16.238 17.6339 15.062 18.4889 14.113 17.9099L10.24 15.5439L6.36698 17.9099C5.41698 18.4899 4.24098 17.6339 4.49898 16.5529L5.55198 12.1379L2.10498 9.18491C1.26098 8.46191 1.70998 7.07891 2.81898 6.98991L7.34298 6.62691L9.08598 2.43691ZM10.24 3.56791L8.66898 7.34491C8.58057 7.55697 8.43542 7.74056 8.24948 7.87552C8.06354 8.01047 7.844 8.09157 7.61498 8.10991L3.53798 8.43691L6.64398 11.0979C6.99998 11.4029 7.15498 11.8819 7.04698 12.3379L6.09698 16.3159L9.58798 14.1839C9.78417 14.0641 10.0096 14.0007 10.2395 14.0007C10.4694 14.0007 10.6948 14.0641 10.891 14.1839L14.381 16.3159L13.433 12.3379C13.3795 12.1141 13.3889 11.88 13.46 11.6612C13.5311 11.4424 13.6612 11.2475 13.836 11.0979L16.942 8.43791L12.865 8.10991C12.6358 8.09175 12.416 8.01073 12.2299 7.87577C12.0438 7.7408 11.8985 7.55711 11.81 7.34491L10.24 3.56791Z" fill="#868C98"/>
        </svg>
      `;

      const marked = `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.394 2.43675C10.966 1.40975 9.51301 1.40975 9.08601 2.43675L7.34301 6.62675L2.81901 6.98975C1.71001 7.07875 1.26101 8.46175 2.10501 9.18475L5.55201 12.1378L4.49901 16.5528C4.24101 17.6338 5.41701 18.4898 6.36701 17.9098L10.24 15.5438L14.113 17.9098C15.062 18.4888 16.238 17.6338 15.98 16.5528L14.927 12.1378L18.374 9.18475C19.219 8.46175 18.769 7.07875 17.661 6.98975L13.137 6.62675L11.394 2.43675Z" fill="#FDBE00"/>
        </svg>
      `;

      const rightChevron = `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.34998 12.0167L10.3167 8.33339L6.34998 4.65006" stroke="#868C98" stroke-width="1.13333" stroke-linecap="round"/>
        </svg>
      `;

      if (isDetailed) {
        markerElement.innerHTML = `
          <a href="/festival/${festival.id}">
            <div class="box-border flex h-[64px] w-[224px] items-center gap-2 rounded-lg bg-white py-2 pr-3 pl-2" style="box-shadow: 0 0 5px 0 rgba(0,0,0,0.18);">
            <img src="${festival?.image}" alt="${festival?.title || ''}" width="48" height="48" class="aspect-square rounded-sm object-cover" />
            <div class="flex w-full flex-col justify-center gap-1">
              <div class="flex w-full items-center justify-between">
                <div class="flex h-[22px] w-[54px] items-center justify-center rounded-sm" style="background-color: ${theme.bgColor}; color: ${theme.color};">
                  <p class="ui-text-sub-head-3">${theme?.label || ''}</p>
                </div>
                ${festival?.is_marked ? marked : unMarked}
              </div>
                <div class="flex items-center">
                  <p class="line-clamp-1 ui-text-sub-head max-w-[135px]">${festival?.title || ''}</p>
                  ${rightChevron}
                </div>
              </div>
            </div>
          </a>
          `;
      } else {
        markerElement.innerHTML = `
        <div style="
          width: 36px;
          height: 36px;
          border-radius: 50%;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        ">
          <img src="${theme.image}" alt="${theme.label}" style="
            width: 100%;
            height: 100%;
            object-fit: cover;
          " />
        </div>
      `;
      }

      const marker = new window.naver.maps.Marker({
        position,
        map: mapInstanceRef.current,
        icon: {
          content: markerElement,
          anchor: new window.naver.maps.Point(
            isDetailed ? 60 : 12,
            isDetailed ? 30 : 12,
          ),
        },
      });

      window.naver.maps.Event.addListener(marker, 'click', () => {
        handleMarkerClick(festival, isDetailed || false);
      });

      return marker;
    },
    [currentZoom, handleMarkerClick],
  );

  const updateMarkers = useCallback(() => {
    markersRef.current.forEach(marker => {
      marker.setMap(null);
    });
    markersRef.current = [];

    festivals.forEach(festival => {
      const marker = createMarker(festival);
      if (marker) {
        markersRef.current.push(marker);
      }
    });
  }, [festivals, createMarker]);

  const loadFestivalsInBounds = useCallback(
    async (bounds: {
      sw: { lat: number; lng: number };
      ne: { lat: number; lng: number };
      nw: { lat: number; lng: number };
      se: { lat: number; lng: number };
    }) => {
      if (isLoadingFestivals) return;

      setIsLoadingFestivals(true);
      try {
        const response = await fetchFestivalsInBounds(bounds);
        setFestivals(response.festivals);
        console.log('축제 데이터 로드:', response.festivals.length);
      } catch (error) {
        console.error('축제 데이터 로드 실패:', error);
      } finally {
        setIsLoadingFestivals(false);
      }
    },
    [isLoadingFestivals],
  );

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

    resizeObserverRef.current = new ResizeObserver(handleResize);
    resizeObserverRef.current.observe(mapRef.current);

    intersectionObserverRef.current = new IntersectionObserver(
      handleIntersection,
      {
        threshold: 0.1,
      },
    );
    intersectionObserverRef.current.observe(mapRef.current);

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
        minZoom: 9,
        maxZoom: 13,
        disableKineticPan: false,
        scaleControl: false,
        logoControl: false,
        mapDataControl: false,
        zoomControl: false,
        mapTypeControl: false,
      };

      const map = new window.naver.maps.Map(mapRef.current, mapOptions);
      mapInstanceRef.current = map;

      window.naver.maps.Event.addListener(map, 'bounds_changed', () => {
        handleBoundsChange();
      });

      window.naver.maps.Event.addListener(map, 'zoom_changed', () => {
        handleZoomChange();
      });

      setTimeout(() => {
        handleBoundsChange();
      }, 100);

      onMapReady?.(map);
    }

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
        window.naver.maps.Event.clearListeners(
          mapInstanceRef.current,
          'zoom_changed',
        );
      }

      markersRef.current.forEach(marker => {
        marker.setMap(null);
      });
    };
  }, [
    clientId,
    handleResize,
    handleIntersection,
    handleBoundsChange,
    handleZoomChange,
    onMapReady,
    onMarkerClick,
  ]);

  useEffect(() => {
    updateMarkers();
  }, [festivals, updateMarkers]);

  return (
    <div
      ref={mapRef}
      className={`h-full w-full ${className}`}
      style={{ minHeight: '87vh', ...style }}
    />
  );
}
