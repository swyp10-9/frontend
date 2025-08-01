'use client';

import { useState } from 'react';

import FestivalHeader from './_modules/FestivalHeader';
import FestivalTabs from './_modules/FestivalTabs';
import MainImage from './_modules/MainImage';
import FestivalInfo from './_modules/tabs/FestivalInfo';
import Restaurants from './_modules/tabs/Restaurants';
import Reviews from './_modules/tabs/Reviews';
import TravelCourse from './_modules/tabs/TravelCourse';

interface FestivalDetailProps {
  params: {
    id: string;
  };
}

export default function FestivalDetail({
  params: _params,
}: FestivalDetailProps) {
  const [selectedTab, setSelectedTab] = useState('festival-info');

  const festivalImages = [
    'https://picsum.photos/300/300?random=1',
    'https://picsum.photos/300/300?random=2',
    'https://picsum.photos/300/300?random=3',
    'https://picsum.photos/300/300?random=4',
  ];

  return (
    // FIXME: 화면 크기 설정은 layout 수준에서 설정 필요, 모바일 뷰 재현을 위해 360px 사용
    <div className='relative min-h-screen w-screen max-w-[360px] bg-white'>
      {/* Main Content */}
      <div>
        <MainImage
          src='https://picsum.photos/800/400?random=5'
          alt='대구치맥페스티벌'
        />

        <FestivalHeader
          theme='문화/예술'
          title='대구치맥페스티벌'
          subtitle='2025 대구치맥페스티벌, 치맥 센세이션'
          startDate='2025.07.10'
          endDate='2025.07.15'
          location='대구광역시 달서구 공원순환로 36 (두류동) 두류공원'
        />

        <FestivalTabs selectedTab={selectedTab} onTabChange={setSelectedTab} />

        {/* Tab Content */}
        <div className='px-4 py-6'>
          {selectedTab === 'festival-info' && (
            <FestivalInfo festivalImages={festivalImages} />
          )}
          {selectedTab === 'travel-course' && <TravelCourse />}
          {selectedTab === 'restaurants' && <Restaurants />}
          {selectedTab === 'reviews' && <Reviews />}
        </div>
      </div>
    </div>
  );
}
