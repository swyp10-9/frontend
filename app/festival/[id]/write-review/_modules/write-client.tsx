'use client';

import { useState } from 'react';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

import { createFestivalReview } from '@/apis/SWYP10BackendAPI';
import { Button } from '@/components/Button';
import BackArrowNav from '@/components/nav/nav';

export default function WriteClient() {
  const router = useRouter();
  const params = useParams();
  const festivalId = Number(params?.id) || 0;
  const [content, setContent] = useState('');

  const handleSave = async () => {
    try {
      await createFestivalReview(festivalId, { content }).then(() => {
        router.replace('/mypage');
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='flex w-full items-center justify-center'>
      <div className='flex w-full max-w-[600px] flex-col gap-6 px-5'>
        <BackArrowNav
          rightExpand={
            <Button size='sm' onClick={handleSave}>
              저장
            </Button>
          }
        />
        <p className='ui-text-head-2'>축제는 어떠셨나요?</p>
        <div className='flex items-center gap-4'>
          <Image
            width={48}
            height={48}
            src='https://picsum.photos/200/300'
            className='aspect-square rounded-xl object-cover'
            alt='festival'
          />
          <p className='ui-text-sub-head-2'>대구 치맥 페스티벌</p>
        </div>
        <div className='flex flex-col items-end gap-2'>
          <textarea
            style={{ resize: 'none' }}
            maxLength={500}
            rows={100}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder='축제에 다녀온 소중한 후기를 남겨주세요.'
            className='h-[284px] w-full rounded-xl border border-gray-100 px-4 py-3 text-black placeholder:text-gray-200 focus:border-gray-300 focus:outline-none'
          />

          <div className='text-sm text-gray-200'>
            <span
              className={`${(content?.length || 0) > 0 ? 'text-black' : 'text-gray-200'}`}
            >
              {content?.length || 0}
            </span>
            /500
          </div>
        </div>
      </div>
    </div>
  );
}
