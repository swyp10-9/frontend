import { useEffect, useState } from 'react';

import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import type { FestivalSummaryResponse } from '@/apis/SWYP10BackendAPI.schemas';
import { FilterChip } from '@/components/filter-chip';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from '@/components/shadcn/drawer';

import { TrendingSearches } from './TrendingSearches';

interface SearchResultsProps {
  results: FestivalSummaryResponse[];
  isLoading: boolean;
  error: unknown;
  searchQuery: string;
  totalCount?: number;
  onSearch: (keyword: string) => void;
}

const themeConfig = {
  CULTURE_ART: { text: '문화/예술', color: '#6366f1', bg: '#eef2ff' },
  FOOD: { text: '음식/미식', color: '#e45100', bg: '#ffede4' },
  MUSIC: { text: '음악/공연', color: '#7c2d12', bg: '#fef7ed' },
  NATURE: { text: '자연/체험', color: '#078d00', bg: '#eafee9' },
  TRADITION: { text: '전통/역사', color: '#92400e', bg: '#fef3c7' },
  ALL: { text: '전체', color: '#6b7280', bg: '#f9fafb' },
};

export function SearchResults({
  results,
  isLoading,
  error,
  searchQuery,
  totalCount,
  onSearch,
}: SearchResultsProps) {
  const searchParams = useSearchParams();

  const [isNearbySelected, setIsNearbySelected] = useState(
    searchParams.get('nearby') === 'true',
  );
  const [isThisMonthSelected, setIsThisMonthSelected] = useState(
    searchParams.get('thisMonth') === 'true',
  );

  // 브라우저 히스토리만 업데이트 (RSC 요청 방지)
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (isNearbySelected) {
        params.set('nearby', 'true');
      } else {
        params.delete('nearby');
      }

      if (isThisMonthSelected) {
        params.set('thisMonth', 'true');
      } else {
        params.delete('thisMonth');
      }

      const newUrl = `/search?${params.toString()}`;
      const currentUrl = `${window.location.pathname}?${new URLSearchParams(window.location.search).toString()}`;

      if (newUrl !== currentUrl) {
        // RSC 요청을 피하기 위해 history API 직접 사용
        window.history.replaceState(null, '', newUrl);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [isNearbySelected, isThisMonthSelected, searchParams]);

  const toggleNearby = () => {
    setIsNearbySelected(prev => !prev);
  };

  const toggleThisMonth = () => {
    setIsThisMonthSelected(prev => !prev);
  };

  return (
    <Drawer>
      <div className='flex flex-col gap-5'>
        <div>
          <h2 className='mb-5 text-[20px] leading-[28px] font-bold tracking-[-0.2px] text-[#090a0c]'>
            {totalCount || results.length}개의 관련 축제
          </h2>

          <div className='flex flex-row items-start justify-start gap-1'>
            <FilterChip
              label='내 주변'
              is_selected={isNearbySelected}
              onClick={toggleNearby}
            />
            <FilterChip
              label='이번 달 축제'
              is_selected={isThisMonthSelected}
              onClick={toggleThisMonth}
            />
            <DrawerTrigger>
              <FilterChip label='필터' is_selected={false} downChevron />
            </DrawerTrigger>
          </div>
        </div>

        <div className='flex flex-col gap-5'>
          {isLoading ? (
            <div className='py-8 text-center'>
              <p className='text-[14px] text-[#868c98]'>검색 중...</p>
            </div>
          ) : error ? (
            <div className='py-8 text-center'>
              <p className='text-[14px] text-[#868c98]'>
                검색 결과를 불러올 수 없습니다.
              </p>
            </div>
          ) : !results || results.length === 0 ? (
            <>
              <div className='flex flex-col items-center pt-20 pb-10'>
                <div className='mb-4 flex h-16 w-16 items-center justify-center'>
                  <Icon
                    icon='lucide:search'
                    className='h-12 w-12 text-[#c1c7d0]'
                  />
                </div>
                <p className='mb-2 text-[18px] leading-[26px] font-bold tracking-[-0.18px] text-[#090a0c]'>
                  '{searchQuery}' 검색 결과가 없습니다.
                </p>
                <p className='text-[14px] leading-[20px] font-medium tracking-[-0.14px] text-[#868c98]'>
                  검색어를 변경해 다시 시도해 보세요.
                </p>
              </div>

              <div className='border-t border-[#f1f2f4] pt-8'>
                <TrendingSearches onSearch={onSearch} />
              </div>
            </>
          ) : (
            results.map((festival, index) => {
              const themeInfo = festival.theme
                ? themeConfig[festival.theme as keyof typeof themeConfig]
                : null;

              return (
                <div key={festival.id}>
                  <Link href={`/festival/${festival.id}`} className='block'>
                    <div className='flex flex-row items-center gap-4'>
                      <div
                        className='size-[108px] shrink-0 rounded bg-cover bg-center bg-no-repeat'
                        style={{
                          backgroundImage: festival.thumbnail
                            ? `url('${festival.thumbnail}')`
                            : 'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="%23f1f2f4" viewBox="0 0 24 24"><rect width="24" height="24" rx="4"/></svg>\')',
                        }}
                      />

                      <div className='flex flex-1 flex-col items-start gap-3 overflow-hidden'>
                        <div className='flex h-12 w-full flex-col items-start gap-1'>
                          <div className='flex w-full flex-row items-start justify-between'>
                            <div className='flex items-center'>
                              {themeInfo && (
                                <div
                                  className='rounded px-1 py-0.5'
                                  style={{ backgroundColor: themeInfo.bg }}
                                >
                                  <span
                                    className='text-[12px] leading-[18px] font-semibold tracking-[-0.12px]'
                                    style={{ color: themeInfo.color }}
                                  >
                                    {themeInfo.text}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className='flex flex-row items-center gap-2'>
                              <Icon
                                icon='lucide:bookmark'
                                className='h-5 w-5 text-[#868c98]'
                              />
                              <Icon
                                icon='lucide:share'
                                className='h-5 w-5 text-[#868c98]'
                              />
                            </div>
                          </div>

                          <h3 className='w-full text-[16px] leading-[22px] font-bold tracking-[-0.16px] text-[#090a0c]'>
                            {festival.title}
                          </h3>
                        </div>

                        <div className='flex w-full flex-col items-start gap-1'>
                          <div className='flex w-full flex-row items-start gap-0.5'>
                            <div className='flex items-center p-[2px]'>
                              <Icon
                                icon='lucide:map-pin'
                                className='h-4 w-4 text-[#868c98]'
                              />
                            </div>
                            <div className='flex flex-row items-center gap-1'>
                              <span className='text-[14px] leading-[20px] font-medium tracking-[-0.14px] text-[#5e6573]'>
                                {festival.address}
                              </span>
                              <span className='text-[12px] leading-[18px] font-semibold tracking-[-0.12px] text-[#26282e] underline'>
                                지도보기
                              </span>
                            </div>
                          </div>

                          <div className='flex w-full flex-row items-center gap-0.5'>
                            <div className='flex items-center p-[2px]'>
                              <Icon
                                icon='lucide:calendar'
                                className='h-4 w-4 text-[#868c98]'
                              />
                            </div>
                            <span className='text-[14px] leading-[20px] font-medium tracking-[-0.14px] text-[#5e6573]'>
                              {festival.startDate} ~ {festival.endDate}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {index < results.length - 1 && (
                    <div className='mt-5 h-px bg-[#f1f2f4]' />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <DrawerContent>
        <div className='p-4'>
          <p>필터 옵션이 여기에 표시됩니다.</p>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
