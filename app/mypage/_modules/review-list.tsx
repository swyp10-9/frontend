'use client';

import { useState } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';
import Image from 'next/image';

import { getMyReviews } from '@/apis/SWYP10BackendAPI';
import { MyReviewResponse } from '@/apis/SWYP10BackendAPI.schemas';
import { useInView } from '@/hooks/useInView';

import ReviewItem from './review-item';

interface ReviewResponse {
  reviews: MyReviewResponse[];
  nextCursor: number | null;
  total: number;
}

const fetchReviews = async ({ pageParam = 0 }): Promise<ReviewResponse> => {
  const response = await getMyReviews({
    page: pageParam,
    size: 10,
    offset: pageParam * 10,
  });

  const reviews = response.data.content;
  const total = response.data.totalElements;
  const totalPages = response.data.totalPages;
  const nextCursor = pageParam < totalPages - 1 ? pageParam + 1 : null;

  return {
    reviews,
    nextCursor,
    total,
  };
};

interface ReviewListProps {
  initialReviewList: MyReviewResponse[];
}

export default function ReviewList({ initialReviewList }: ReviewListProps) {
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
    initialData: {
      pages: [
        {
          reviews: initialReviewList,
          nextCursor: initialReviewList.length >= 10 ? 1 : null,
          total: initialReviewList.length,
        },
      ],
      pageParams: [0],
    },
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
      {allReviews.length === 0 ? (
        <div className='flex min-h-[400px] flex-col items-center justify-center'>
          <Image
            src={'/image/no-list/no-review-list.png'}
            alt='no-review-list'
            width={68}
            height={68}
          />
          <p className='mt-5 ui-text-sub-head text-gray-700'>
            리뷰를 남겨 축제의 순간을 기록해보세요.
          </p>
          <p className='mt-1 ui-text-body-2 text-gray-400'>
            내가 느낀 감정이 다른 이에게 좋은 힌트가 될지도 몰라요.
          </p>
        </div>
      ) : (
        <>
          {allReviews.map(review => (
            <ReviewItem
              key={review.id}
              image={review.festivalThumbnail || '/image/logo.png'}
              title={review.festivalTitle}
              date={review.createdAt}
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
        </>
      )}
    </div>
  );
}
