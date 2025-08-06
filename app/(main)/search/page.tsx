import { Suspense } from 'react';

import { SearchPageClient } from './_modules/SearchPageClient';

// 로딩 상태를 표시하는 컴포넌트
function SearchPageLoading() {
  return (
    <div className='relative min-h-screen w-full bg-[#ffffff]'>
      <div className='sticky top-0 z-10 bg-white pt-6 pb-2.5'>
        <div className='px-5'>
          <div className='h-10 animate-pulse rounded-lg bg-gray-200' />
        </div>
      </div>
      <div className='px-5 pb-20'>
        <div className='py-8 text-center'>
          <p className="font-['Pretendard'] text-[14px] text-[#868c98]">
            로딩 중...
          </p>
        </div>
      </div>
    </div>
  );
}

// 메인 페이지 컴포넌트
export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageLoading />}>
      <SearchPageClient />
    </Suspense>
  );
}
