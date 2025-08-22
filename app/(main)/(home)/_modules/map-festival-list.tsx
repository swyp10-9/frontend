'use client';

import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/Button';
import FestivalListView from '@/components/festival-list-view';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from '@/components/shadcn/drawer';

export default function MapFestivalList() {
  const openRef = useRef<HTMLDivElement>(null);
  const [activeSnapPoint, setActiveSnapPoint] = useState<
    number | string | null
  >(0.5);

  useEffect(() => {
    if (openRef?.current) {
      openRef.current.click();
    }
  }, [openRef]);

  return (
    <Drawer
      snapPoints={[0.5, 1]}
      modal={false}
      activeSnapPoint={activeSnapPoint}
      setActiveSnapPoint={setActiveSnapPoint}
    >
      <div className='absolute right-4 bottom-4 flex items-center gap-2'>
        <DrawerTrigger asChild>
          <Button size={'sm'} variant='primary' rounded='full'>
            리스트로 보기
          </Button>
        </DrawerTrigger>
      </div>
      <DrawerContent className='z-[1] h-full'>
        <div className='flex h-full flex-col px-5 pb-[100px]'>
          <div className='flex-shrink-0 py-4'>
            <p className='ui-text-head-2'>23개의 축제</p>
          </div>
          <div className='flex-1 overflow-y-auto'>
            <div className='box-border flex w-full flex-col items-center justify-center py-1'>
              {Array.from({ length: 15 }).map((_, index) => (
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
        </div>
      </DrawerContent>
      <DrawerTrigger asChild>
        <div ref={openRef} className='hidden' />
      </DrawerTrigger>
    </Drawer>
  );
}
