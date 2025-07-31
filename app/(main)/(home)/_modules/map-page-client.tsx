'use client';

import NaverMap from './naver-map';

export default function MapPageClient() {
  return (
    <div className='h-full w-full'>
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
      />
    </div>
  );
}
