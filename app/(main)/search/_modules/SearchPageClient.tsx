'use client';

import { useEffect, useRef, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';

import { searchFestivals } from '@/apis/SWYP10BackendAPI';
import FilterModal, {
  FilterConfig,
  FilterModalRef,
  FilterValues,
} from '@/components/filter-modal';
import { QUERY_OPTIONS } from '@/constants/queryOptions';

import { SearchInput } from './SearchInput';
import { SearchResults } from './SearchResults';
import { TrendingSearches } from './TrendingSearches';

// 필터 설정
const filterConfigs: FilterConfig[] = [
  {
    key: 'region',
    label: '지역',
    list: [
      { type: 'seoul', label: '서울' },
      { type: 'gyeonggi', label: '경기' },
      { type: 'gangwon', label: '강원' },
      { type: 'chungcheong', label: '충청' },
      { type: 'jeolla', label: '전라' },
      { type: 'gyeongsang', label: '경상' },
      { type: 'jeju', label: '제주' },
    ],
    showAllOption: true,
  },
  {
    key: 'companion',
    label: '누구랑',
    list: [
      { type: 'family', label: '가족' },
      { type: 'couple', label: '커플' },
      { type: 'parents', label: '부모님' },
      { type: 'pet', label: '반려견' },
      { type: 'friend', label: '친구' },
    ],
    showAllOption: true,
  },
  {
    key: 'theme',
    label: '테마',
    list: [
      { type: 'culture', label: '문화/예술' },
      { type: 'food', label: '음식/미식' },
      { type: 'music', label: '음악/공연' },
      { type: 'nature', label: '자연/체험' },
      { type: 'tradition', label: '전통/역사' },
    ],
    showAllOption: true,
  },
];

// 검색 기능을 담당하는 클라이언트 컴포넌트
export function SearchPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState<FilterValues>({});
  const [showFilters, setShowFilters] = useState(false);
  const filterModalRef = useRef<FilterModalRef>(null);

  const queryParam = searchParams.get('q');

  const searchRequest = {
    page: 0,
    size: 20,
    searchParam: queryParam,
    offset: 0,
    ...filterValues,
  };

  const {
    data: searchData,
    isLoading: isLoadingSearch,
    error: searchError,
  } = useQuery({
    queryKey: ['searchFestivals', searchRequest],
    queryFn: () => searchFestivals(searchRequest),
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
      // NOTE: push를 하면 매번 RSC를 거쳐서 반응성이 떨어짐
      router.replace(`/search?q=${encodeURIComponent(keyword.trim())}`);
    } else {
      router.replace('/search');
    }
  };

  const handleClear = () => {
    setSearchValue('');
    router.replace('/search');
  };

  const handleFilterApply = (values: FilterValues) => {
    setFilterValues(values);
    setShowFilters(false);
  };

  const handleFilterReset = () => {
    setFilterValues({});
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
          onSearch={handleSearch}
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
            onSearch={handleSearch}
            filterValues={filterValues}
            onFilterClick={() => setShowFilters(true)}
          />
        ) : (
          <TrendingSearches onSearch={handleSearch} />
        )}
      </div>

      <FilterModal
        ref={filterModalRef}
        title='필터'
        configs={filterConfigs}
        initialValues={filterValues}
        onApply={handleFilterApply}
        onReset={handleFilterReset}
        open={showFilters}
        onOpenChange={setShowFilters}
      />
    </div>
  );
}
