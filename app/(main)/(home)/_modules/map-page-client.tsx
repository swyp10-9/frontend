'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { FilterChip, SelectedChip } from '@/components/filter-chip';
import { Drawer, DrawerTrigger } from '@/components/shadcn/drawer';
import { periodList } from '@/constants/periodList';
import { statusList } from '@/constants/statusList';
import themeList from '@/constants/themeList';
import { withWhomList } from '@/constants/withWhomList';

import MapBottomFilter from './map-bottom-filter';
import NaverMap from './naver-map';

// 축제 데이터 타입 (naver-map.tsx와 동일)
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
  };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleMarkerClick = (festival: Festival, isDetailed: boolean) => {
    console.log('부모 컴포넌트에서 마커 클릭 감지:', { festival, isDetailed });

    if (isDetailed) {
      // 상세 마커 클릭 시 축제 상세페이지로 이동
      console.log('축제 상세페이지로 이동:', festival.id);
      // 여기에 실제 라우터 이동 로직 추가
      // router.push(`/festival/${festival.id}`);
    } else {
      // 작은 마커 클릭 시 추가 로직 (필요시)
      console.log('작은 마커 클릭됨:', festival.title);
    }
  };

  return (
    <div className='relative h-full w-full'>
      <Drawer>
        <div
          className='absolute top-[15px] left-[15px] flex items-center gap-2'
          style={{ zIndex: 99999999 }}
        >
          <FilterChip
            label='내 주변'
            is_selected={initialParams?.isNearBy === 'true'}
            onClick={async () => {
              const params = new URLSearchParams(searchParams);
              if (initialParams?.isNearBy === 'true') {
                params.delete(`isNearBy`);
                router.replace(`?${params.toString()}`);
              } else {
                // const [nearLat, nearLng]: [number, number] =
                //   (await getCurrentLocation()) as [number, number];
                params.set('isNearBy', 'true');
                router.replace(`?${params.toString()}`);
              }
            }}
          />
          <DrawerTrigger>
            <FilterChip label='필터' is_selected={false} downChevron />
          </DrawerTrigger>
          {[
            { key: 'theme', value: initialParams.theme },
            { key: 'withWhom', value: initialParams.withWhom },
            { key: 'period', value: initialParams.period },
            { key: 'status', value: initialParams.status },
          ]
            .filter(param => param.value)
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
          // initialCenter와 initialZoom을 제거하여 항상 현재 위치로 초기화
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
