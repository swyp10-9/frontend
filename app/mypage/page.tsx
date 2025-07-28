'use client';

import { useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/Button';

import BackArrowNav from './_modules/back-arrow-nav';
import BookmarkList from './_modules/bookmark-list';
import Profile from './_modules/profile';
import ReviewList from './_modules/review-list';
import { UiTab, UiTabs } from './_modules/tabs';

export default function MyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL 쿼리 파라미터에서 초기 탭 값 읽어오기
  const tabFromQuery = searchParams.get('tab');
  const initialTab =
    tabFromQuery && ['bookmark', 'visited'].includes(tabFromQuery)
      ? tabFromQuery
      : 'bookmark';

  const [selectedTab, setSelectedTab] = useState(initialTab);

  const handleTabChange = (value: string) => {
    setSelectedTab(value);

    // URL 쿼리 파라미터 업데이트
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', value);
    router.replace(`/mypage?${params.toString()}`);
  };

  return (
    <div className='flex min-h-screen w-full flex-col'>
      <div className='flex w-full flex-col gap-4'>
        <BackArrowNav />
        <Profile />
        <UiTabs value={selectedTab} onValueChange={handleTabChange}>
          <UiTab label='북마크' value='bookmark' />
          <UiTab label='다녀온 축제' value='visited' />
        </UiTabs>
      </div>

      <div className='flex-1 overflow-y-auto'>
        {selectedTab === 'bookmark' && <BookmarkList />}
        {selectedTab === 'visited' && <ReviewList />}
      </div>

      <div className='w-full border-t border-gray-200 bg-white px-5 py-4'>
        {/* <p className='ui-text-body-2 text-gray-300'>로그아웃</p> */}
        <Button
          variant='ghost'
          onClick={() => {
            router.push('/');
          }}
        >
          <p className='ui-text-body-2 text-gray-300'>로그아웃</p>
        </Button>
      </div>
    </div>
  );
}
