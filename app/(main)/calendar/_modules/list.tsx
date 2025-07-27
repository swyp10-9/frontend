'use client';

import { useState } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';

import FestivalListView from '@/components/festival-list-view';
import { FilterChip } from '@/components/filter-chip';
import { DrawerTrigger } from '@/components/shadcn/drawer';
import { useInView } from '@/hooks/useInView';

interface ListProps {
  selected?: string;
}

// 가상 API 응답 타입
interface Festival {
  id: number;
  image: string;
  theme: string;
  title: string;
  loc: string;
  start_date: string;
  end_date: string;
  is_marked: boolean;
}

interface FestivalResponse {
  festivals: Festival[];
  nextCursor: number | null;
  total: number;
}

// 가상 API 함수
const fetchFestivals = async ({ pageParam = 0 }): Promise<FestivalResponse> => {
  // 실제 API 호출을 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 500));

  const pageSize = 10;
  const startIndex = pageParam * pageSize;

  // 가상 데이터 생성
  const festivals: Festival[] = Array.from(
    { length: pageSize },
    (_, index) => ({
      id: startIndex + index + 1,
      image: `https://picsum.photos/200/300?random=${startIndex + index + 1}`,
      theme: [
        'culture_art',
        'food_cuisine',
        'music_performance',
        'nature_experience',
        'tradition_history',
      ][Math.floor(Math.random() * 5)],
      title: `축제 제목 ${startIndex + index + 1}`,
      loc: ['서울', '경기', '강원', '충청', '전라', '경상', '제주'][
        Math.floor(Math.random() * 7)
      ],
      start_date: '2025-07-10',
      end_date: '2025-07-10',
      is_marked: Math.random() > 0.7,
    }),
  );

  return {
    festivals,
    nextCursor: pageParam < 9 ? pageParam + 1 : null, // 10페이지까지만
    total: 100,
  };
};

export default function List({ selected }: ListProps) {
  const [isBottomView, setIsBottomView] = useState(false);
  const [observeBottom] = useInView((isShow: boolean) => {
    console.log('%c bottom-view', 'color:blue;font-weight:bold;', isShow);
    setIsBottomView(() => {
      return isShow;
    });
  });

  // 무한 스크롤 쿼리
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['festivals', selected],
    queryFn: fetchFestivals,
    getNextPageParam: lastPage => lastPage.nextCursor,
    initialPageParam: 0,
  });

  // 선택된 날짜가 없으면 오늘 날짜 사용
  const displayDate = selected || new Date().toISOString().split('T')[0];

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  // 모든 축제 데이터를 평면화
  const allFestivals = data?.pages.flatMap(page => page.festivals) || [];
  const totalCount = data?.pages[0]?.total || 0;

  // 하단에 도달했을 때 다음 페이지 로드
  if (isBottomView && hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }

  if (isLoading) {
    return (
      <div className='flex flex-col gap-5'>
        <div className='flex items-center gap-1'>
          <FilterChip label='내 주변' is_selected={false} />
          <DrawerTrigger>
            <FilterChip label='필터' is_selected={false} downChevron />
          </DrawerTrigger>
        </div>
        <div className='flex items-center gap-2'>
          <p className='ui-text-head-2'>로딩 중...</p>
          <p className='ui-text-body'>{formatDate(displayDate)}</p>
        </div>
        <div className='flex w-full flex-col gap-10'>
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className='animate-pulse'>
              <div className='mb-2 h-[200px] rounded-lg bg-gray-200'></div>
              <div className='mb-2 h-4 w-3/4 rounded bg-gray-200'></div>
              <div className='h-3 w-1/2 rounded bg-gray-200'></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex flex-col gap-5'>
        <div className='flex items-center gap-1'>
          <FilterChip label='내 주변' is_selected={false} />
          <DrawerTrigger>
            <FilterChip label='필터' is_selected={false} downChevron />
          </DrawerTrigger>
        </div>
        <div className='flex items-center gap-2'>
          <p className='ui-text-head-2'>오류가 발생했습니다</p>
          <p className='ui-text-body'>{formatDate(displayDate)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex items-center gap-1'>
        <FilterChip label='내 주변' is_selected={false} />
        <DrawerTrigger>
          <FilterChip label='필터' is_selected={false} downChevron />
        </DrawerTrigger>
      </div>
      <div className='flex items-center gap-2'>
        <p className='ui-text-head-2'>{totalCount}개의 축제</p>
        <p className='ui-text-body'>{formatDate(displayDate)}</p>
      </div>
      <div className='flex w-full flex-col gap-10'>
        {allFestivals.map(festival => (
          <FestivalListView
            key={festival.id}
            image={festival.image}
            theme={festival.theme}
            title={festival.title}
            loc={festival.loc}
            start_date={festival.start_date}
            end_date={festival.end_date}
            is_marked={festival.is_marked}
          />
        ))}
        {/* 무한 스크롤 감지용 요소 */}
        <div
          ref={el => {
            if (el) {
              observeBottom(el);
            }
          }}
          className='h-4'
        />
        {isFetchingNextPage && (
          <div className='flex justify-center py-4'>
            <p className='ui-text-body text-gray-500'>
              더 많은 축제를 불러오는 중...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
