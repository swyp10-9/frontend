'use client';

import { Icon } from '@iconify/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const router = useRouter();

  return (
    <div className='flex w-full items-center gap-4'>
      <Image
        src='/image/basic-profile.png'
        alt='profile'
        width={48}
        height={48}
        className='aspect-square rounded-full object-cover'
      />
      <div className='flex flex-col'>
        <div className='flex items-center gap-1'>
          <p className='ui-text-head-2'>홍길동 님</p>
          <Icon
            icon='ic:baseline-edit'
            fontSize={20}
            className='cursor-pointer text-gray-300'
            onClick={() => {
              router.push('/mypage/edit');
            }}
          />
        </div>
        <p className='ui-text-body-2'>chukjibeob@gmail.com</p>
      </div>
    </div>
  );
}
