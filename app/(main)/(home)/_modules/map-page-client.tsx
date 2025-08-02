'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { FilterChip } from '@/components/filter-chip';
import { Drawer, DrawerTrigger } from '@/components/shadcn/drawer';

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
  coordinates: {
    lat: number;
    lng: number;
  };
  isDetailed?: boolean;
}

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
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              if (initialParams?.isNearBy === 'true') {
                params.delete(`isNearBy`);
                router.replace(`?${params.toString()}`);
              } else {
                params.set('isNearBy', 'true');
                router.replace(`?${params.toString()}`);
              }
            }}
          />
          <DrawerTrigger>
            <FilterChip label='필터' is_selected={false} downChevron />
          </DrawerTrigger>
        </div>
        <NaverMap
          onMapReady={map => {
            // console.log('map:::', map);
          }}
          onSizeChange={size => {
            // console.log('size:::', size);
          }}
          onVisibilityChange={isVisible => {
            // console.log('isVisible:::', isVisible);
          }}
          onBoundsChange={bounds => {
            // console.log('bounds:::', bounds);
          }}
          onMarkerClick={handleMarkerClick}
        />
        <MapBottomFilter initialParams={initialParams} />
      </Drawer>
    </div>
  );
}
