'use client';

import BottomSheet from '@/components/bottom-sheet';

export default function ReviewMenu() {
  return (
    <BottomSheet
      title={'리뷰 수정'}
      onReset={() => {
        return true;
      }}
      onApply={() => {
        return true;
      }}
    >
      <div></div>
    </BottomSheet>
  );
}
