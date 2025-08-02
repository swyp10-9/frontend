'use client';

import { use, useEffect, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import FestivalHeader from './_modules/FestivalHeader';
import FestivalTabs from './_modules/FestivalTabs';
import MainImage from './_modules/MainImage';
import FestivalInfo from './_modules/tabs/FestivalInfo';
import RestaurantList from './_modules/tabs/RestaurantList';
import Reviews from './_modules/tabs/Reviews';
import TravelCourse from './_modules/tabs/TravelCourse';

interface FestivalDetailProps {
  params: Promise<{
    id: string;
  }>;
}

const VALID_TABS = [
  'festival-info',
  'travel-course',
  'restaurants',
  'reviews',
] as const;

export type TabType = (typeof VALID_TABS)[number];

const DEFAULT_TAB: TabType = 'festival-info';

const isValidTab = (tab: string | null): tab is TabType => {
  return tab !== null && VALID_TABS.includes(tab as TabType);
};

export default function FestivalDetail({ params }: FestivalDetailProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();

  const getInitialTab = (): TabType => {
    const tabFromUrl = searchParams.get('tab');

    return isValidTab(tabFromUrl) ? tabFromUrl : DEFAULT_TAB;
  };

  const [selectedTab, setSelectedTab] = useState(getInitialTab);

  // URL의 searchParams 변경 감지
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    const validTab = isValidTab(tabFromUrl) ? tabFromUrl : DEFAULT_TAB;
    setSelectedTab(validTab);
  }, [searchParams]);

  // 탭 변경 시 URL 업데이트
  const handleTabChange = (tab: TabType) => {
    setSelectedTab(tab);
    const urlParams = new URLSearchParams(searchParams);
    urlParams.set('tab', tab);
    router.replace(`/festival/${resolvedParams.id}?${urlParams.toString()}`);
  };

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

        <FestivalTabs selectedTab={selectedTab} onTabChange={handleTabChange} />

        {/* Tab Content */}
        <div className='px-4 py-6'>
          {selectedTab === 'festival-info' && (
            <FestivalInfo festivalImages={festivalImages} />
          )}
          {selectedTab === 'travel-course' && <TravelCourse />}
          {selectedTab === 'restaurants' && <RestaurantList />}
          {selectedTab === 'reviews' && <Reviews id={resolvedParams.id} />}
        </div>
      </div>
    </div>
  );
}
