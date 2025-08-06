'use client';

import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { topKeyWords } from '@/apis/queries';

import {
  SearchInput,
  TrendingSearchItem,
  transformApiDataToTrendingItems,
} from './_modules';

// NOTE: 클라이언트 컴포넌트로 렌더링
export default function SearchPage() {
  const [searchValue, setSearchValue] = useState('');
  const { data, isLoading, error } = useQuery(topKeyWords(10));

  const handleSearch = (keyword: string) => {
    setSearchValue(keyword);
  };

  const handleClear = () => {
    setSearchValue('');
  };

  const trendingItems = data?.data?.content
    ? transformApiDataToTrendingItems(data.data.content)
    : [];

  return (
    <div className='relative min-h-screen w-full bg-[#ffffff]'>
      <div className='pt-6 pb-8'>
        <SearchInput
          value={searchValue}
          onChange={setSearchValue}
          onClear={handleClear}
        />
      </div>

      <div className='px-5'>
        <div className='mb-5'>
          <h2 className="font-['Pretendard'] text-[14px] leading-[20px] font-semibold tracking-[-0.14px] text-[#090a0c]">
            인기 검색어
          </h2>
        </div>

        <div className='flex flex-col gap-3'>
          {isLoading && (
            <div className='py-8 text-center'>
              <p className="font-['Pretendard'] text-[14px] text-[#868c98]">
                로딩 중...
              </p>
            </div>
          )}

          {error && (
            <div className='py-8 text-center'>
              <p className="font-['Pretendard'] text-[14px] text-[#868c98]">
                인기 검색어를 불러올 수 없습니다.
              </p>
            </div>
          )}

          {!isLoading && !error && trendingItems.length === 0 && (
            <div className='py-8 text-center'>
              <p className="font-['Pretendard'] text-[14px] text-[#868c98]">
                인기 검색어가 없습니다.
              </p>
            </div>
          )}

          {trendingItems.map(item => (
            <TrendingSearchItem
              key={item.id}
              item={item}
              onSearch={handleSearch}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
