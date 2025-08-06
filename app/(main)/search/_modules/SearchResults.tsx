import { Icon } from '@iconify/react';
import Link from 'next/link';

import type { FestivalSummaryResponse } from '@/apis/SWYP10BackendAPI.schemas';

interface SearchResultsProps {
  results: FestivalSummaryResponse[];
  isLoading: boolean;
  error: unknown;
  searchQuery: string;
  totalCount?: number;
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
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className='py-8 text-center'>
        <p className="font-['Pretendard'] text-[14px] text-[#868c98]">
          검색 중...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='py-8 text-center'>
        <p className="font-['Pretendard'] text-[14px] text-[#868c98]">
          검색 결과를 불러올 수 없습니다.
        </p>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className='py-8 text-center'>
        <p className="font-['Pretendard'] text-[14px] text-[#868c98]">
          '{searchQuery}'에 대한 검색 결과가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-5'>
      <div>
        <h2 className="mb-5 font-['Pretendard'] text-[20px] leading-[28px] font-bold tracking-[-0.2px] text-[#090a0c]">
          {totalCount || results.length}개의 관련 축제
        </h2>

        <div className='flex flex-row items-start justify-start gap-1'>
          <div className='rounded-[100px] border border-[#d5d7db] bg-white px-2 py-1'>
            <span className="font-['Pretendard'] text-[12px] leading-[18px] font-semibold tracking-[-0.12px] text-[#26282e]">
              내 주변
            </span>
          </div>
          <div className='rounded-[100px] border border-[#d5d7db] bg-white px-2 py-1'>
            <span className="font-['Pretendard'] text-[12px] leading-[18px] font-semibold tracking-[-0.12px] text-[#26282e]">
              이번 달 축제
            </span>
          </div>
          <div className='flex items-center gap-1 rounded-[100px] border border-[#d5d7db] bg-white py-1 pr-2 pl-1'>
            <Icon
              icon='lucide:chevron-down'
              className='h-4 w-4 text-[#5e6573]'
            />
            <span className="font-['Pretendard'] text-[12px] leading-[18px] font-semibold tracking-[-0.12px] text-[#26282e]">
              필터
            </span>
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-5'>
        {results.map((festival, index) => {
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

                  <div className='flex w-[196px] flex-col items-start gap-3 overflow-hidden'>
                    <div className='flex h-12 w-full flex-col items-start gap-1'>
                      <div className='flex w-full flex-row items-start justify-between'>
                        <div className='flex items-center'>
                          {themeInfo && (
                            <div
                              className='rounded px-1 py-0.5'
                              style={{ backgroundColor: themeInfo.bg }}
                            >
                              <span
                                className="font-['Pretendard'] text-[12px] leading-[18px] font-semibold tracking-[-0.12px]"
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

                      <h3 className="w-full font-['Pretendard'] text-[16px] leading-[22px] font-bold tracking-[-0.16px] text-[#090a0c]">
                        {festival.title}
                      </h3>
                    </div>

                    <div className='flex w-44 flex-col items-start gap-1'>
                      <div className='flex w-full flex-row items-start gap-0.5'>
                        <div className='flex items-center p-[2px]'>
                          <Icon
                            icon='lucide:map-pin'
                            className='h-4 w-4 text-[#868c98]'
                          />
                        </div>
                        <div className='flex w-[152px] flex-row items-center gap-1'>
                          <span className="font-['Pretendard'] text-[14px] leading-[20px] font-medium tracking-[-0.14px] text-[#5e6573]">
                            {festival.address}
                          </span>
                          <span className="font-['Pretendard'] text-[12px] leading-[18px] font-semibold tracking-[-0.12px] text-[#26282e] underline">
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
                        <span className="font-['Pretendard'] text-[14px] leading-[20px] font-medium tracking-[-0.14px] text-[#5e6573]">
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
        })}
      </div>
    </div>
  );
}
