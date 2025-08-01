'use client';

import Pin from '@/components/pin';

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

export default function MapPageClient() {
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
    <div className='h-full w-full'>
      <Pin type='culture_art' variant='detail' />
      <NaverMap
        onMapReady={map => {
          console.log('map:::', map);
        }}
        onSizeChange={size => {
          console.log('size:::', size);
        }}
        onVisibilityChange={isVisible => {
          console.log('isVisible:::', isVisible);
        }}
        onBoundsChange={bounds => {
          console.log('bounds:::', bounds);
        }}
        onMarkerClick={handleMarkerClick}
      />
    </div>
  );
}
