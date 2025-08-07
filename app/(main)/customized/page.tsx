'use client';

import Image from 'next/image';

import introImage from '@/assets/images/festival-recommendation/intro.png';
import { Button } from '@/components/Button';

export default function CustomizedPage() {
  return (
    <div className='relative w-full bg-white'>
      <div className='flex flex-col items-center justify-center px-6 py-12'>
        <div className='flex w-full max-w-[272px] flex-col items-center gap-12'>
          <div className='flex w-full flex-col items-center gap-6'>
            <div className='flex flex-col items-center gap-2 text-center'>
              <h1 className='ui-text-head tracking-[-0.24px] text-black'>
                나한테 꼭 맞는 축제는?
              </h1>
              <p className='ui-text-body tracking-[-0.16px] text-gray-400'>
                간단한 테스트를 통해
                <br />
                나에게 맞는 축제를 찾아드려요
              </p>
            </div>

            <div className='flex items-center justify-center'>
              <Image
                src={introImage}
                alt='맞춤 축제 소개'
                className='h-full w-full rounded-lg object-cover'
                width={214}
                height={300}
              />
            </div>
          </div>

          <div className='w-full'>
            <Button
              variant='primary'
              size='md'
              rounded='full'
              className='w-full'
            >
              테스트 시작하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
