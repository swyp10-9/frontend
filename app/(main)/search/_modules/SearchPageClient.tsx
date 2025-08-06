'use client';

import { useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';

import { searchFestivals } from '@/apis/SWYP10BackendAPI';
import type { FestivalSearchRequest } from '@/apis/SWYP10BackendAPI.schemas';
import { QUERY_OPTIONS } from '@/constants/queryOptions';

import { SearchInput } from './SearchInput';
import { SearchResults } from './SearchResults';
import { TrendingSearches } from './TrendingSearches';

// 검색 기능을 담당하는 클라이언트 컴포넌트
export function SearchPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState('');

  const queryParam = searchParams.get('q');

  // 검색 요청 객체 생성
  const searchRequest: FestivalSearchRequest = {
    page: 0,
    size: 20,
    sort: null,
    startDate: null,
    endDate: null,
    mapX: null,
    mapY: null,
    radius: null,
    regionCode: null,
    theme: null,
    searchParam: queryParam || null,
    offset: 0,
  };

  const {
    data: searchData,
    isLoading: isLoadingSearch,
    error: searchError,
  } = useQuery({
    queryKey: ['searchFestivals', searchRequest],
    queryFn: () => searchFestivals({ request: searchRequest }),
    enabled: Boolean(queryParam?.trim()),
    staleTime: QUERY_OPTIONS.STALE_TIME,
    gcTime: QUERY_OPTIONS.GC_TIME,
  });

  useEffect(() => {
    if (queryParam) {
      setSearchValue(queryParam);
    } else {
      setSearchValue('');
    }
  }, [queryParam]);

  const handleSearch = (keyword: string) => {
    setSearchValue(keyword);
    if (keyword.trim()) {
      router.push(`/search?q=${encodeURIComponent(keyword.trim())}`);
    } else {
      router.push('/search');
    }
  };

  const handleClear = () => {
    setSearchValue('');
    router.push('/search');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const isSearching = Boolean(queryParam?.trim());
  const hasSearchResults =
    searchData?.data?.content && searchData.data.content.length > 0;

  // 디버깅용 로그
  console.log('Search Debug:', {
    queryParam,
    searchValue,
    isSearching,
    searchData,
    hasSearchResults,
  });

  return (
    <div className='relative min-h-screen w-full bg-[#ffffff]'>
      <div className='sticky top-0 z-10 bg-white pt-6 pb-2.5'>
        <SearchInput
          value={searchValue}
          onChange={setSearchValue}
          onClear={handleClear}
          onSubmit={handleSubmit}
        />
      </div>

      <div className='px-5 pb-20'>
        {isSearching ? (
          <SearchResults
            results={searchData?.data?.content || []}
            isLoading={isLoadingSearch}
            error={searchError}
            searchQuery={queryParam || ''}
            totalCount={searchData?.data?.totalElements}
          />
        ) : (
          <TrendingSearches onSearch={handleSearch} />
        )}
      </div>
    </div>
  );
}
