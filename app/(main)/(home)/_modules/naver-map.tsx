'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { getFestivalsForMap } from '@/apis/SWYP10BackendAPI';
import type {
  FestivalMapRequestPeriod,
  FestivalMapRequestStatus,
  FestivalMapRequestTheme,
  FestivalMapRequestWithWhom,
} from '@/apis/SWYP10BackendAPI.schemas';
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
  map_x: number;
  map_y: number;
  isDetailed?: boolean;
}

interface FestivalResponse {
  festivals: Festival[];
  total: number;
}

const fetchFestivalsInBounds = async (
  bounds: {
    sw: { lat: number; lng: number };
    ne: { lat: number; lng: number };
    nw: { lat: number; lng: number };
    se: { lat: number; lng: number };
  },
  queryParams?: {
    status?: string;
    period?: string;
    withWhom?: string;
    theme?: string;
  },
): Promise<FestivalResponse> => {
  try {
    const response = await getFestivalsForMap({
      // TODO: request 속성 사용하지 않음
      page: 0,
      size: 100,
      sort: 'createdAt,desc',
      status: (queryParams?.status as FestivalMapRequestStatus) || 'ALL',
      period: (queryParams?.period as FestivalMapRequestPeriod) || 'ALL',
      withWhom: (queryParams?.withWhom as FestivalMapRequestWithWhom) || 'ALL',
      theme: (queryParams?.theme as FestivalMapRequestTheme) || 'ALL',
      latTopLeft: bounds.nw.lat,
      lngTopLeft: bounds.nw.lng,
      latBottomRight: bounds.se.lat,
      lngBottomRight: bounds.se.lng,
      // offset: 0,
    });

    //

    // API 응답을 Festival 인터페이스에 맞게 변환
    const content = response?.data.content || [];
    // @ts-expect-error 잘못된 타입 사용
    const festivals: Festival[] = [...(content || [])].map(festival => ({
      id: festival.id,
      title: festival.title,
      theme: festival.theme,
      image: festival.thumbnail,
      loc: festival.address,
      start_date: festival.startDate,
      end_date: festival.endDate,
      is_marked: festival.bookmarked,
      map_x: festival.map_x,
      map_y: festival.map_y,
    }));

    return {
      festivals,
      total: response?.data?.totalElements || 0,
    };
  } catch (error) {
    console.error('축제 데이터 로드 실패:', error);
    return {
      festivals: [],
      total: 0,
    };
  }
};

interface NaverMapProps {
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
  onSizeChange?: (size: { width: number; height: number }) => void;
  onVisibilityChange?: (isVisible: boolean) => void;
  onMapReady?: (map: naver.maps.Map) => void;
  onBoundsChange?: (bounds: {
    sw: { lat: number; lng: number };
    ne: { lat: number; lng: number };
    nw: { lat: number; lng: number };
    se: { lat: number; lng: number };
  }) => void;
  onZoomChange?: (zoom: number) => void;
  onMarkerClick?: (festival: Festival, isDetailed: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
  /** 특정 축제 포커싱용 ID (해당 마커를 상세 마커로 표시) */
  focusFestivalId?: number;
  queryParams?: {
    status?: string;
    period?: string;
    withWhom?: string;
    theme?: string;
  };
}

export default function NaverMap({
  initialCenter,
  initialZoom,
  onSizeChange,
  onVisibilityChange,
  onMapReady,
  onBoundsChange,
  onZoomChange,
  onMarkerClick,
  className = '',
  style = {},
  focusFestivalId,
  queryParams,
}: NaverMapProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<naver.maps.Map | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  const markersRef = useRef<naver.maps.Marker[]>([]);
  const clientId = config.naver.map_client_id;

  const [currentZoom, setCurrentZoom] = useState(10);
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [isLoadingFestivals, setIsLoadingFestivals] = useState(false);
  const boundsChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const centerChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // URL에서 중심 좌표를 읽어오는 함수
  const getCenterFromURL = useCallback(() => {
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (lat && lng) {
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);

      if (!isNaN(latNum) && !isNaN(lngNum)) {
        return { lat: latNum, lng: lngNum };
      }
    }

    return null;
  }, [searchParams]);

  // URL에 중심 좌표를 업데이트하는 함수
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

    // console.log('bounds:::', bounds);

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

    // 이전 타이머가 있다면 취소
    if (boundsChangeTimeoutRef.current) {
      clearTimeout(boundsChangeTimeoutRef.current);
    }

    // 500ms 후에 축제 데이터 로드
    boundsChangeTimeoutRef.current = setTimeout(() => {
      loadFestivalsInBounds(boundsData, queryParams);
    }, 700);
  }, [onBoundsChange, queryParams]);

  const loadFestivalsInBounds = useCallback(
    async (
      bounds: {
        sw: { lat: number; lng: number };
        ne: { lat: number; lng: number };
        nw: { lat: number; lng: number };
        se: { lat: number; lng: number };
      },
      queryParams?: {
        status?: string;
        period?: string;
        withWhom?: string;
        theme?: string;
      },
    ) => {
      if (isLoadingFestivals) return;

      setIsLoadingFestivals(true);
      try {
        const response = await fetchFestivalsInBounds(bounds, queryParams);
        // 포커스 ID가 있으면 해당 축제를 상세 마커로 표시
        const festivalsWithFocus =
          typeof focusFestivalId === 'number'
            ? response.festivals.map(f => ({
                ...f,
                isDetailed: f.id === focusFestivalId,
              }))
            : response.festivals;
        setFestivals(festivalsWithFocus);
        console.log('축제 데이터 로드:', response.festivals.length);
      } catch (error) {
        console.error('축제 데이터 로드 실패:', error);
      } finally {
        setIsLoadingFestivals(false);
      }
    },
    [isLoadingFestivals, queryParams, focusFestivalId],
  );

  const handleZoomChange = useCallback(() => {
    if (!mapInstanceRef.current) return;

    const zoom = mapInstanceRef.current.getZoom();
    setCurrentZoom(zoom);
    console.log('줌 레벨 변화:', zoom);

    onZoomChange?.(zoom);
    updateMarkers();
  }, [onZoomChange]);

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
        festival.map_y,
        festival.map_x,
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
            <img src="${festival?.image || '/image/logo.png'}" onError="this.src='/image/logo.png'" alt="${festival?.title || ''}" width="48" height="48" class="aspect-square rounded-sm object-cover" />
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

  const handleCenterChange = useCallback(() => {
    if (!mapInstanceRef.current) return;

    const center = mapInstanceRef.current.getCenter();
    if (!center) return;

    // 이전 타이머가 있다면 취소
    if (centerChangeTimeoutRef.current) {
      clearTimeout(centerChangeTimeoutRef.current);
    }

    // 500ms 후에 URL 업데이트 (지도 이동이 끝난 후)
    centerChangeTimeoutRef.current = setTimeout(() => {
      updateURLWithCenter(center.y, center.x);
    }, 500);
  }, [updateURLWithCenter]);

  useEffect(() => {
    if (!mapRef.current) return;

    resizeObserverRef.current = new ResizeObserver(handleResize);
    resizeObserverRef.current.observe(mapRef.current);

    intersectionObserverRef.current = new IntersectionObserver(
      handleIntersection,
      {
        threshold: 0.1,
      },
    );
    intersectionObserverRef.current.observe(mapRef.current);

    // 위치 정보를 가져오는 함수

    // 지도 초기화 함수
    const initializeMap = async () => {
      if (!mapRef.current) return;

      // 초기 중심: URL > props.initialCenter > 현재 위치 순서로 우선순위 결정
      let lat: number;
      let lng: number;

      const urlCenter = getCenterFromURL();
      if (urlCenter) {
        lat = urlCenter.lat;
        lng = urlCenter.lng;
      } else if (
        initialCenter &&
        typeof initialCenter.lat === 'number' &&
        typeof initialCenter.lng === 'number'
      ) {
        lat = initialCenter.lat;
        lng = initialCenter.lng;
      } else {
        const current = await getCurrentLocation();
        lat = current[0];
        lng = current[1];
      }

      const mapOptions: naver.maps.MapOptions = {
        center: new window.naver.maps.LatLng(lat, lng),
        zoom: initialZoom || 10,
        minZoom: 6,
        maxZoom: 17,
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

      // 지도 중심 변화 감지
      window.naver.maps.Event.addListener(map, 'center_changed', () => {
        handleCenterChange();
      });

      setTimeout(() => {
        handleBoundsChange();
      }, 100);

      onMapReady?.(map);
    };

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
        window.naver.maps.Event.clearListeners(
          mapInstanceRef.current,
          'center_changed',
        );
      }

      // 타이머 정리
      if (boundsChangeTimeoutRef.current) {
        clearTimeout(boundsChangeTimeoutRef.current);
      }
      if (centerChangeTimeoutRef.current) {
        clearTimeout(centerChangeTimeoutRef.current);
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
    handleCenterChange,
    onMapReady,
    onMarkerClick,
    initialZoom,
    initialCenter,
    getCenterFromURL,
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

export const getCurrentLocation = (): Promise<[number, number]> => {
  const basic_loc = [37.3595704, 127.105399];

  return new Promise(resolve => {
    if (navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          console.log('position:::', position);
          resolve([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          console.log('위치 정보 가져오기 실패, 기본 위치 사용');
          resolve([basic_loc[0], basic_loc[1]]);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        },
      );
    } else {
      console.log('Geolocation 지원하지 않음, 기본 위치 사용');
      resolve([basic_loc[0], basic_loc[1]]);
    }
  });
};
