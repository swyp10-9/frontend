'use client';

import { useCallback, useRef } from 'react';

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

  // URL 쿼리에 zoom 상태 업데이트 (debounce 적용)
  const updateURLWithZoom = useCallback(
    (zoom?: number) => {
      const params = new URLSearchParams(searchParams);

      if (zoom !== undefined) {
        params.set('zoom', zoom.toString());
      }

      // 기존 파라미터들 유지
      if (initialParams.status) params.set('status', initialParams.status);
      if (initialParams.period) params.set('period', initialParams.period);
      if (initialParams.withWhom)
        params.set('withWhom', initialParams.withWhom);
      if (initialParams.theme) params.set('theme', initialParams.theme);
      if (initialParams.isNearBy)
        params.set('isNearBy', initialParams.isNearBy);

      router.replace(`?${params.toString()}`);
    },
    [searchParams, router, initialParams],
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
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              if (initialParams?.isNearBy === 'true') {
                params.delete('isNearBy');
              } else {
                params.set('isNearBy', 'true');
              }
              router.replace(`?${params.toString()}`);
            }}
          />
          <DrawerTrigger asChild>
            <FilterChip label='필터' is_selected={false} downChevron />
          </DrawerTrigger>
          {[
            { key: 'theme', value: initialParams.theme },
            { key: 'withWhom', value: initialParams.withWhom },
            { key: 'period', value: initialParams.period },
            { key: 'status', value: initialParams.status },
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
          queryParams={{
            status: initialParams.status,
            period: initialParams.period,
            withWhom: initialParams.withWhom,
            theme: initialParams.theme,
          }}
        />
        <MapBottomFilter initialParams={initialParams} />
      </Drawer>
    </div>
  );
}
