'use client';

import { useState } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';

import { useInView } from '@/hooks/useInView';

import ReviewItem from './review-item';

interface Review {
  id: number;
  image: string;
  title: string;
  date: string;
  content: string;
}

interface ReviewResponse {
  reviews: Review[];
  nextCursor: number | null;
  total: number;
}

const fetchReviews = async ({ pageParam = 0 }): Promise<ReviewResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const pageSize = 10;
  const total = 128;
  const startIndex = pageParam * pageSize;
  const maxPage = Math.ceil(total / pageSize) - 1;

  const reviews: Review[] = Array.from({ length: pageSize }, (_, index) => ({
    id: startIndex + index + 1,
    image: `https://picsum.photos/200/300?random=${startIndex + index + 1}`,
    title: `리뷰 작성자 ${startIndex + index + 1}`,
    date: '2025.01.01',
    content: `리뷰 내용 ${startIndex + index + 1}입니다. `,
  }));

  return {
    reviews,
    nextCursor: pageParam < maxPage ? pageParam + 1 : null,
    total,
  };
};

export default function ReviewList() {
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
    queryKey: ['reviews'],
    queryFn: fetchReviews,
    getNextPageParam: lastPage => lastPage.nextCursor,
    initialPageParam: 0,
  });

  const allReviews = data?.pages.flatMap(page => page.reviews) || [];
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
          리뷰를 불러오는 중 오류가 발생했습니다.
        </p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-5 overflow-y-auto py-5'>
      {allReviews.map(review => (
        <ReviewItem
          key={review.id}
          image={review.image}
          title={review.title}
          date={review.date}
          content={review.content}
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
            더 많은 리뷰를 불러오는 중...
          </p>
        </div>
      )}
    </div>
  );
}
