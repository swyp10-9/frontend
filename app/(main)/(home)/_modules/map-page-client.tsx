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

// value를 label로 매핑하는 유틸리티 함수
const getLabelFromValue = (key: string, value: string): string => {
  switch (key) {
    case 'theme': {
      const themeItem = themeList.find(
        (item: { type: string; label: string }) => item.type === value,
      );

      return themeItem?.label || value;
    }
    case 'withWhom': {
      const withWhomItem = withWhomList.find(
        (item: { type: string; label: string }) => item.type === value,
      );

      return withWhomItem?.label || value;
    }
    case 'period': {
      const periodItem = periodList.find(
        (item: { type: string; label: string }) => item.type === value,
      );

      return periodItem?.label || value;
    }
    case 'status': {
      const statusItem = statusList.find(
        (item: { type: string; label: string }) => item.type === value,
      );

      return statusItem?.label || value;
    }
    default:
      return value;
  }
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

  // debounce를 위한 ref
  const zoomDebounceRef = useRef<NodeJS.Timeout | null>(null);
  // 지도 인스턴스를 저장할 ref
  const mapInstanceRef = useRef<naver.maps.Map | null>(null);

  // searchParams에서 현재 필터 값들을 동적으로 가져오기
  const currentQueryParams = useMemo(
    () => ({
      status: searchParams.get('status') || initialParams.status,
      period: searchParams.get('period') || initialParams.period,
      withWhom: searchParams.get('withWhom') || initialParams.withWhom,
      theme: searchParams.get('theme') || initialParams.theme,
    }),
    [searchParams, initialParams],
  );

  // 지도 인스턴스가 준비되면 저장
  const handleMapInstanceReady = useCallback((mapInstance: naver.maps.Map) => {
    mapInstanceRef.current = mapInstance;
  }, []);

  // 현재 위치로 지도 중심 이동
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
      mapInstanceRef.current.setZoom(15); // 적절한 줌 레벨로 설정

      console.log('지도 중심을 현재 위치로 이동:', {
        lat: latitude,
        lng: longitude,
      });
    } catch (error) {
      console.error('현재 위치를 가져올 수 없습니다:', error);
    }
  }, []);

  // URL 쿼리에 zoom 상태 업데이트 (debounce 적용)
  const updateURLWithZoom = useCallback(
    (zoom?: number) => {
      const params = new URLSearchParams(searchParams);

      if (zoom !== undefined) {
        params.set('zoom', zoom.toString());
      }

      // 기존 파라미터들 유지
      if (currentQueryParams.status)
        params.set('status', currentQueryParams.status);
      if (currentQueryParams.period)
        params.set('period', currentQueryParams.period);
      if (currentQueryParams.withWhom)
        params.set('withWhom', currentQueryParams.withWhom);
      if (currentQueryParams.theme)
        params.set('theme', currentQueryParams.theme);
      if (initialParams.isNearBy)
        params.set('isNearBy', initialParams.isNearBy);

      router.replace(`?${params.toString()}`);
    },
    [searchParams, router, currentQueryParams, initialParams.isNearBy],
  );

  // zoom 변경 시 debounce 적용
  const handleZoomChange = useCallback(
    (zoom: number) => {
      console.log('zoom changed:::', zoom);

      // 이전 타이머가 있다면 취소
      if (zoomDebounceRef.current) {
        clearTimeout(zoomDebounceRef.current);
      }

      // 0.7초 후에 URL 업데이트
      zoomDebounceRef.current = setTimeout(() => {
        updateURLWithZoom(zoom);
      }, 700);
    },
    [updateURLWithZoom],
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

  const initLat = initialParams?.mapY
    ? parseFloat(initialParams.mapY)
    : undefined;
  const initLng = initialParams.mapX
    ? parseFloat(initialParams.mapX)
    : undefined;
  const initCenter =
    initLat && initLng ? { lat: initLat, lng: initLng } : undefined;

  return (
    <div className='relative h-full w-full'>
      <Drawer>
        <div className='absolute top-4 left-4 z-10 flex items-center gap-2'>
          <FilterChip
            label='내 주변'
            is_selected={initialParams?.isNearBy === 'true'}
            onClick={async () => {
              const params = new URLSearchParams(searchParams);
              if (initialParams?.isNearBy === 'true') {
                params.delete('isNearBy');
              } else {
                params.set('isNearBy', 'true');
                // 내 주변 필터 활성화 시 현재 위치로 이동
                await moveToCurrentLocation();
              }
              router.replace(`?${params.toString()}`);
            }}
          />
          <DrawerTrigger asChild>
            <FilterChip label='필터' is_selected={false} downChevron />
          </DrawerTrigger>
          {[
            { key: 'theme', value: currentQueryParams.theme },
            { key: 'withWhom', value: currentQueryParams.withWhom },
            { key: 'period', value: currentQueryParams.period },
            { key: 'status', value: currentQueryParams.status },
          ]
            .filter(param => param.value && param.value !== 'ALL')
            .map(param => (
              <SelectedChip
                key={param.key}
                label={getLabelFromValue(param.key, param.value)}
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.delete(param.key);
                  router.replace(`?${params.toString()}`);
                }}
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
