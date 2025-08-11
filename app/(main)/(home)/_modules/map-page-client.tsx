'use client';

import { useCallback, useMemo, useRef } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { FilterChip, SelectedChip } from '@/components/filter-chip';
import { Drawer, DrawerTrigger } from '@/components/shadcn/drawer';
import { periodList } from '@/constants/periodList';
import { statusList } from '@/constants/statusList';
import themeList from '@/constants/themeList';
import { withWhomList } from '@/constants/withWhomList';
import type { Festival } from '@/types/map';

import MapBottomFilter from './map-bottom-filter';
import NaverMap from './naver-map';

// 상수 정의
const ZOOM_DEBOUNCE_DELAY = 700;
const CURRENT_LOCATION_ZOOM = 15;

// value를 label로 매핑하는 유틸리티 함수
const getLabelFromValue = (key: string, value: string): string => {
  const labelMaps = {
    theme: themeList,
    withWhom: withWhomList,
    period: periodList,
    status: statusList,
  };

  const list = labelMaps[key as keyof typeof labelMaps];
  if (!list) return value;

  const item = list.find(
    (item: { type: string; label: string }) => item.type === value,
  );

  return item?.label || value;
};

// URL 파라미터 업데이트 유틸리티
const updateURLParams = (
  searchParams: URLSearchParams,
  updates: Record<string, string | undefined>,
  router: ReturnType<typeof useRouter>,
) => {
  const params = new URLSearchParams(searchParams.toString());

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
  });

  router.replace(`?${params.toString()}`);
};

export default function MapPageClient({
  initialParams,
}: {
  initialParams: {
    status: string;
    period: string;
    withWhom: string;
    theme: string;
    isNearBy: string;
    mapX?: string;
    mapY?: string;
    focusId?: string;
    zoom?: string;
  };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  // debounce를 위한 ref
  const zoomDebounceRef = useRef<NodeJS.Timeout | null>(null);
  // 지도 인스턴스를 저장할 ref
  const mapInstanceRef = useRef<naver.maps.Map | null>(null);

  // searchParams에서 현재 필터 값들을 동적으로 가져오기
  const currentQueryParams = useMemo(
    () => ({
      status: params.get('status') || initialParams.status,
      period: params.get('period') || initialParams.period,
      withWhom: params.get('withWhom') || initialParams.withWhom,
      theme: params.get('theme') || initialParams.theme,
    }),
    [searchParams, initialParams],
  );

  // 현재 위치로 이동하는 함수
  const moveToCurrentLocation = useCallback(async () => {
    if (!mapInstanceRef.current) return;

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
          });
        },
      );

      const { latitude, longitude } = position.coords;
      const newCenter = new window.naver.maps.LatLng(latitude, longitude);

      mapInstanceRef.current.setCenter(newCenter);
      mapInstanceRef.current.setZoom(CURRENT_LOCATION_ZOOM);

      console.log('지도 중심을 현재 위치로 이동:', {
        lat: latitude,
        lng: longitude,
      });
    } catch (error) {
      console.error('현재 위치를 가져올 수 없습니다:', error);
    }
  }, []);

  // 줌 변경 핸들러
  const handleZoomChange = useCallback(
    (zoom: number) => {
      console.log('zoom changed:::', zoom);

      // 이전 타이머가 있다면 취소
      if (zoomDebounceRef.current) {
        clearTimeout(zoomDebounceRef.current);
      }

      // ZOOM_DEBOUNCE_DELAY 후에 URL 업데이트
      zoomDebounceRef.current = setTimeout(() => {
        updateURLParams(searchParams, { zoom: zoom.toString() }, router);
      }, ZOOM_DEBOUNCE_DELAY);
    },
    [searchParams, router],
  );

  // 마커 클릭 핸들러
  const handleMarkerClick = useCallback(
    (festival: Festival, isDetailed: boolean) => {
      if (isDetailed) {
        // 상세 마커 클릭 시 축제 상세 페이지로 이동
        router.push(`/festival/${festival.id}`);
      } else {
        // 작은 마커 클릭 시 상세 마커로 전환
        console.log('마커 클릭:', festival);
      }
    },
    [router],
  );

  // 지도 인스턴스 준비 핸들러
  const handleMapInstanceReady = useCallback((mapInstance: naver.maps.Map) => {
    mapInstanceRef.current = mapInstance;
  }, []);

  // 내 주변 필터 토글 핸들러
  const handleNearByToggle = useCallback(async () => {
    const isCurrentlyNearBy = initialParams?.isNearBy === 'true';

    if (isCurrentlyNearBy) {
      updateURLParams(searchParams, { isNearBy: undefined }, router);
    } else {
      updateURLParams(searchParams, { isNearBy: 'true' }, router);
      // 내 주변 필터 활성화 시 현재 위치로 이동
      await moveToCurrentLocation();
    }
  }, [initialParams?.isNearBy, searchParams, router, moveToCurrentLocation]);

  // 필터 제거 핸들러
  const handleFilterRemove = useCallback(
    (key: string) => {
      updateURLParams(searchParams, { [key]: undefined }, router);
    },
    [searchParams, router],
  );

  // 초기 좌표 계산
  const initCenter = useMemo(() => {
    const initLat = initialParams?.mapY
      ? parseFloat(initialParams.mapY)
      : undefined;
    const initLng = initialParams?.mapX
      ? parseFloat(initialParams.mapX)
      : undefined;

    return initLat && initLng ? { lat: initLat, lng: initLng } : undefined;
  }, [initialParams?.mapX, initialParams?.mapY]);

  // 선택된 필터들 렌더링
  const selectedFilters = useMemo(() => {
    return [
      { key: 'theme', value: currentQueryParams.theme },
      { key: 'withWhom', value: currentQueryParams.withWhom },
      { key: 'period', value: currentQueryParams.period },
      { key: 'status', value: currentQueryParams.status },
    ].filter(param => param.value && param.value !== 'ALL');
  }, [currentQueryParams]);

  return (
    <div className='relative h-full w-full'>
      <Drawer>
        <div className='absolute top-4 left-4 z-10 flex items-center gap-2'>
          <FilterChip
            label='내 주변'
            is_selected={initialParams?.isNearBy === 'true'}
            onClick={handleNearByToggle}
          />
          <DrawerTrigger asChild>
            <FilterChip label='필터' is_selected={false} downChevron />
          </DrawerTrigger>

          {selectedFilters.map(param => (
            <SelectedChip
              key={param.key}
              label={getLabelFromValue(param.key, param.value)}
              onClick={() => handleFilterRemove(param.key)}
            />
          ))}
        </div>

        <NaverMap
          // 상세 페이지에서 넘어온 좌표/줌/포커스 ID 반영
          initialCenter={initCenter}
          initialZoom={
            initialParams.zoom ? parseInt(initialParams.zoom) : undefined
          }
          focusFestivalId={
            initialParams.focusId ? parseInt(initialParams.focusId) : undefined
          }
          onZoomChange={handleZoomChange}
          onMarkerClick={handleMarkerClick}
          queryParams={currentQueryParams}
          onMapInstanceReady={handleMapInstanceReady}
        />
        <MapBottomFilter initialParams={currentQueryParams} />
      </Drawer>
    </div>
  );
}
