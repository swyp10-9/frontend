'use client';

import { useCallback, useMemo } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { FilterChip, SelectedChip } from '@/components/filter-chip';
import { Drawer, DrawerTrigger } from '@/components/shadcn/drawer';
import { periodList } from '@/constants/periodList';
import { statusList } from '@/constants/statusList';
import themeList from '@/constants/themeList';
import { withWhomList } from '@/constants/withWhomList';
import { useFestivalData } from '@/hooks/useFestivalData';
import type { Festival, MapBounds, MapQueryParams } from '@/types/map';

import MapBottomFilter from './map-bottom-filter';
import MapFestivalList from './map-festival-list';
import NaverMap from './naver-map';

// 상수 정의
// const CURRENT_LOCATION_ZOOM = 15;

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
  const searchParams = useSearchParams();
  const router = useRouter();

  // 축제 데이터 훅을 상위에서 공유
  const {
    festivals = [],
    isLoadingFestivals,
    loadFestivalsInBounds: loadFestivals,
    // reloadWithCurrentQueryParams,
    reloadWithNewQueryParams,
  } = useFestivalData(
    initialParams.focusId ? parseInt(initialParams.focusId) : undefined,
  );

  // 현재 쿼리 파라미터
  const currentQueryParams = useMemo((): MapQueryParams => {
    return {
      status: (searchParams.get('status') || 'ALL') as string,
      period: (searchParams.get('period') || 'ALL') as string,
      withWhom: (searchParams.get('withWhom') || 'ALL') as string,
      theme: (searchParams.get('theme') || 'ALL') as string,
    };
  }, [searchParams]);

  // console.log('currentQueryParams::::::', currentQueryParams);

  // 내 주변 토글 핸들러
  const handleNearByToggle = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    const currentIsNearBy = params.get('isNearBy') === 'true';
    params.set('isNearBy', (!currentIsNearBy).toString());
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  // 필터 제거 핸들러
  const handleFilterRemove = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(key, 'ALL');
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router],
  );

  // 줌 변경 핸들러
  const handleZoomChange = useCallback(
    (zoom: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('zoom', zoom.toString());
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router],
  );

  // 마커 클릭 핸들러
  const handleMarkerClick = useCallback(
    (festival: Festival, isDetailed: boolean) => {
      if (isDetailed) {
        router.push(`/festival/${festival.id}`);
      }
    },
    [router],
  );

  // 지도 인스턴스 준비 완료 핸들러
  const handleMapInstanceReady = useCallback(() => {
    console.log('지도 인스턴스 준비 완료');
  }, []);

  // 경계 내 축제 로드 핸들러
  const handleLoadFestivalsInBounds = useCallback(
    async (bounds: MapBounds, queryParams?: MapQueryParams) => {
      if (queryParams) {
        await loadFestivals(bounds, queryParams);
      }
    },
    [loadFestivals],
  );

  // 초기 중심 좌표 계산
  const initCenter = useMemo(() => {
    if (initialParams.mapX && initialParams.mapY) {
      return {
        lat: parseFloat(initialParams.mapY),
        lng: parseFloat(initialParams.mapX),
      };
    }
    return undefined;
  }, [initialParams.mapX, initialParams.mapY]);

  // 선택된 필터들
  const selectedFilters = useMemo(() => {
    return Object.entries(currentQueryParams)
      .map(([key, value]) => ({ key, value }))
      .filter(param => param.value && param.value !== 'ALL');
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
          loadFestivalsInBounds={handleLoadFestivalsInBounds}
          festivals={festivals}
        />
        <MapBottomFilter initialParams={currentQueryParams} />
      </Drawer>
      <MapFestivalList
        festivals={festivals}
        isLoadingFestivals={isLoadingFestivals}
        onReloadWithNewQueryParams={reloadWithNewQueryParams}
      />
    </div>
  );
}
