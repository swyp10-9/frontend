'use client';

import { useState } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  FestivalCalendarRequestRegion,
  FestivalCalendarRequestTheme,
  FestivalCalendarRequestWithWhom,
  FestivalSummaryResponse,
} from '@/apis/SWYP10BackendAPI.schemas';
import FestivalListView from '@/components/festival-list-view';
import { FilterChip, SelectedChip } from '@/components/filter-chip';
import { DrawerTrigger } from '@/components/shadcn/drawer';
import { useInView } from '@/hooks/useInView';

interface ListProps {
  selected?: string;
  isNearBy: boolean;
  paramsList: {
    name: string;
    type?: string | undefined;
    label?: string | undefined;
  }[];
}
interface FestivalResponse {
  festivals: FestivalSummaryResponse[];
  nextCursor: number | null;
  total: number;
}

// API route를 통한 축제 데이터 가져오기
const fetchFestivals = async ({
  pageParam = 0,
  region,
  withWhom,
  theme,
  selected,
}: {
  pageParam?: number;
  region?: FestivalCalendarRequestRegion;
  withWhom?: FestivalCalendarRequestWithWhom;
  theme?: FestivalCalendarRequestTheme;
  selected?: string;
}): Promise<FestivalResponse> => {
  const pageSize = 10;

  // URL 파라미터 구성
  const params = new URLSearchParams({
    page: pageParam.toString(),
    size: pageSize.toString(),
    sort: 'createdAt,desc',
    region: region || FestivalCalendarRequestRegion.ALL,
    withWhom: withWhom || FestivalCalendarRequestWithWhom.ALL,
    theme: theme || FestivalCalendarRequestTheme.ALL,
    offset: (pageParam * 10).toString(),
  });

  // selected 값이 있으면 date 파라미터 추가
  if (selected) {
    params.set('date', selected);
  }

  const response = await fetch(`/api/festivals/calendar?${params.toString()}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('API response error:', {
      status: response.status,
      statusText: response.statusText,
      errorData,
    });
    throw new Error(
      `Failed to fetch festivals: ${response.status} ${response.statusText}`,
    );
  }

  const responseData = await response.json();
  console.log('Client - API response:', responseData);

  const { content: festivals, totalElements } = responseData;

  return {
    festivals,
    nextCursor: pageParam < 9 ? pageParam + 1 : null, // 10페이지까지만
    total: totalElements,
  };
};

export default function List({ selected, paramsList, isNearBy }: ListProps) {
  console.log('paramsList::::', paramsList);
  const router = useRouter();
  const searchParams = useSearchParams();
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
    queryFn: ({ pageParam }) =>
      fetchFestivals({
        pageParam,
        region: paramsList
          .find(item => item.name === 'region')
          ?.type?.toLocaleUpperCase() as FestivalCalendarRequestRegion,
        withWhom: paramsList
          .find(item => item.name === 'withWhom')
          ?.type?.toLocaleUpperCase() as FestivalCalendarRequestWithWhom,
        theme: paramsList
          .find(item => item.name === 'theme')
          ?.type?.toLocaleUpperCase() as FestivalCalendarRequestTheme,
        selected,
      }),
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
          {[...(paramsList || [])].map(param => {
            return (
              <SelectedChip
                key={param?.type}
                label={param?.label || ''}
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.delete(param?.name || '');
                  router.replace(`?${params.toString()}`);
                }}
              />
            );
          })}
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
        <FilterChip
          label='내 주변'
          is_selected={isNearBy}
          onClick={() => {
            const params = new URLSearchParams(searchParams);
            if (isNearBy) {
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
        {[...(paramsList || [])].map(param => {
          return (
            <SelectedChip
              key={param?.type}
              label={param?.label || ''}
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.delete(param?.name || '');
                router.replace(`?${params.toString()}`);
              }}
            />
          );
        })}
      </div>
      <div className='flex items-center gap-2'>
        <p className='ui-text-head-2'>{totalCount}개의 축제</p>
        <p className='ui-text-body'>{formatDate(displayDate)}</p>
      </div>
      <div className='flex w-full flex-col gap-10'>
        {[...(allFestivals || [])].map((festival, idx) => (
          <FestivalListView
            key={festival?.id || idx}
            image={festival?.thumbnail || ''}
            theme={festival?.theme || ''}
            title={festival?.title || ''}
            loc={festival?.address || ''}
            start_date={festival?.startDate || ''}
            end_date={festival?.endDate || ''}
            is_marked={festival?.bookmarked || false}
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
