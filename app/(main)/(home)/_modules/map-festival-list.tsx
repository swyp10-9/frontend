'use client';

import { useEffect, useRef } from 'react';

import BottomSheet, { BottomSheetRef } from '@/components/bottom-sheet';
import FestivalListView from '@/components/festival-list-view';
import { Drawer, DrawerTrigger } from '@/components/shadcn/drawer';

export default function MapFestivalList() {
  const bottomListRef = useRef<BottomSheetRef>(null);
  const openRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (openRef?.current) {
      openRef.current.click();
    }
  }, [openRef]);

  return (
    <Drawer snapPoints={[0.5, 0.9, 1]} modal={false}>
      <BottomSheet
        zIndex={1}
        titleChildren={<></>}
        removeIndicator
        ref={bottomListRef}
      >
        <div className='z-[1] px-5 pb-[100px]'>
          <p className='ui-text-head-2'>23개의 축제</p>
          <div className='box-border flex h-full w-full flex-col items-center justify-center py-5'>
            {Array.from({ length: 5 }).map((_, index) => (
              <FestivalListView
                key={index}
                image={''}
                theme={''}
                title={''}
                loc={''}
                start_date={''}
                end_date={''}
                is_marked={false}
                id={0}
                map_x={''}
                map_y={''}
              />
            ))}
          </div>
        </div>
      </BottomSheet>
      <DrawerTrigger asChild>
        <div ref={openRef} className='hidden' />
      </DrawerTrigger>
    </Drawer>
  );
}
