'use client';

import { useRef } from 'react';

import { Icon } from '@iconify/react';

import { Button } from '@/components/Button';
import BottomSheet, { BottomSheetRef } from '@/components/bottom-sheet';

export default function ReviewMenu() {
  const bottomSheetRef = useRef<BottomSheetRef>(null);

  const handleDelete = () => {
    // 삭제 로직
    console.log('리뷰 삭제');

    // drawer 닫기
    bottomSheetRef.current?.close();
  };

  return (
    <BottomSheet removeIndicator titleChildren={<></>} ref={bottomSheetRef}>
      <div className='px-5 pb-4'>
        <Button variant='ghost' onClick={handleDelete}>
          <div className='flex items-center gap-2'>
            <Icon icon='proicons:delete' className='text-red' fontSize={20} />
            <p className='ui-text-sub-head-2 text-red'>축제 리뷰 삭제</p>
          </div>
        </Button>
      </div>
    </BottomSheet>
  );
}
