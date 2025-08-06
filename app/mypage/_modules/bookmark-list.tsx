'use client';

import { useState } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';
import Image from 'next/image';

import { getMyPageFestivals } from '@/apis/SWYP10BackendAPI';
import { FestivalSummaryResponse } from '@/apis/SWYP10BackendAPI.schemas';
import BookmarkItem from '@/components/festival-list-view';
import { useInView } from '@/hooks/useInView';

interface BookmarkResponse {
  bookmarks: FestivalSummaryResponse[];
  nextCursor: number | null;
  total: number;
}

const fetchBookmarks = async ({ pageParam = 0 }): Promise<BookmarkResponse> => {
  const response = await getMyPageFestivals({
    page: pageParam,
    size: 10,
    sort: 'createdAt,desc',
    bookmarked: true,
    offset: pageParam * 10,
  });

  const bookmarks = response.data.content;
  const total = response.data.totalElements;
  const totalPages = response.data.totalPages;
  const nextCursor = pageParam < totalPages - 1 ? pageParam + 1 : null;

  return {
    bookmarks,
    nextCursor,
    total,
  };
};

interface BookmarkListProps {
  initialBookmarkList: FestivalSummaryResponse[];
}

export default function BookmarkList({
  initialBookmarkList,
}: BookmarkListProps) {
  const [isBottomView, setIsBottomView] = useState(false);
  const [observeBottom] = useInView((isShow: boolean) => {
    console.log('%c bottom-view', 'color:blue;font-weight:bold;', isShow);
    setIsBottomView(() => {
      return isShow;
    });
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['bookmarks'],
    queryFn: fetchBookmarks,
    getNextPageParam: lastPage => lastPage.nextCursor,
    initialPageParam: 0,
    initialData: {
      pages: [
        {
          bookmarks: initialBookmarkList,
          nextCursor: initialBookmarkList.length >= 10 ? 1 : null,
          total: initialBookmarkList.length,
        },
      ],
      pageParams: [0],
    },
  });

  const allBookmarks = data?.pages.flatMap(page => page.bookmarks) || [];
  const totalCount = data?.pages[0]?.total || 0;

  if (isBottomView && hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }

  if (isLoading) {
    return (
      <div className='flex flex-col gap-5 overflow-y-auto py-5'>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className='animate-pulse'>
            <div className='mb-2 h-[200px] rounded-lg bg-gray-200'></div>
            <div className='mb-2 h-4 w-3/4 rounded bg-gray-200'></div>
            <div className='h-3 w-1/2 rounded bg-gray-200'></div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex flex-col gap-5 overflow-y-auto py-5'>
        <p className='ui-text-body text-gray-500'>
          북마크를 불러오는 중 오류가 발생했습니다.
        </p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-5 overflow-y-auto py-5'>
      {allBookmarks.length === 0 ? (
        <div className='flex min-h-[400px] flex-col items-center justify-center'>
          <Image
            src={'/image/no-list/no-bookmark-list.png'}
            alt='no-bookmark-list'
            width={68}
            height={68}
          />
          <p className='mt-5 ui-text-sub-head text-gray-700'>
            마음에 든 축제를 북마크해보세요!
          </p>
          <p className='mt-1 ui-text-body-2 text-gray-400'>
            가고 싶은 축제를 간편하게 모아볼 수 있어요.
          </p>
        </div>
      ) : (
        <>
          {allBookmarks.map(bookmark => (
            <BookmarkItem
              key={bookmark.id}
              image={bookmark.thumbnail || '/image/logo.png'}
              theme={bookmark.theme || ''}
              title={bookmark.title}
              loc={bookmark.address || ''}
              end_date={bookmark.endDate || ''}
              start_date={bookmark.startDate || ''}
              is_marked={bookmark.bookmarked}
            />
          ))}
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
                더 많은 북마크를 불러오는 중...
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
