'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/Button';

export default function MyPageFooter() {
  const router = useRouter();

  return (
    <div className='w-full border-t border-gray-200 bg-white px-5 py-4'>
      <Button
        variant='ghost'
        onClick={() => {
          router.push('/');
        }}
      >
        <p className='ui-text-body-2 text-gray-300'>로그아웃</p>
      </Button>
    </div>
  );
}
