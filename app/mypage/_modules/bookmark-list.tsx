'use client';

import { useState } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';

import BookmarkItem from '@/components/festival-list-view';
import { useInView } from '@/hooks/useInView';

interface Bookmark {
  id: number;
  image: string;
  theme: string;
  title: string;
  loc: string;
  start_date: string;
  end_date: string;
  is_marked: boolean;
}

interface BookmarkResponse {
  bookmarks: Bookmark[];
  nextCursor: number | null;
  total: number;
}

const fetchBookmarks = async ({ pageParam = 0 }): Promise<BookmarkResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const pageSize = 10;
  const total = 72;
  const startIndex = pageParam * pageSize;
  const maxPage = Math.ceil(total / pageSize) - 1;

  const bookmarks: Bookmark[] = Array.from(
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
      title: `북마크 제목 ${startIndex + index + 1}`,
      loc: ['서울', '경기', '강원', '충청', '전라', '경상', '제주'][
        Math.floor(Math.random() * 7)
      ],
      start_date: '2025.01.01',
      end_date: '2025.01.01',
      is_marked: true,
    }),
  );

  return {
    bookmarks,
    nextCursor: pageParam < maxPage ? pageParam + 1 : null,
    total,
  };
};

export default function BookmarkList() {
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
      {allBookmarks.map(bookmark => (
        <BookmarkItem
          key={bookmark.id}
          image={bookmark.image}
          theme={bookmark.theme}
          title={bookmark.title}
          loc={bookmark.loc}
          end_date={bookmark.end_date}
          start_date={bookmark.start_date}
          is_marked={bookmark.is_marked}
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
    </div>
  );
}
