'use client';

import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';

export default function BackArrowNav() {
  const router = useRouter();

  return (
    <div className='flex w-full items-center'>
      <Icon
        icon='ic:round-keyboard-arrow-left'
        fontSize={32}
        onClick={() => router.back()}
        className='cursor-pointer text-gray-300'
        style={{ marginLeft: '-10px' }}
      />
    </div>
  );
}
