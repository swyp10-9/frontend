'use client';

import { useRef } from 'react';

import { Icon } from '@iconify/react';

import {
  DrawerClose,
  DrawerContent,
  // DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  // DrawerTrigger,
} from '@/components/shadcn/drawer';

import { Button } from './Button';

export default function BottomSheet({
  title,
  children,
  onReset,
  resetText,
  onApply,
  applyText,
}: {
  title: string;
  children: React.ReactNode;
  //onReset, onApply 함수에서 true 반환 시 drawer 닫힘
  onReset: () => boolean;
  onApply: () => boolean;
  resetText?: string;
  applyText?: string;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  function handleReset() {
    const isClosed = onReset();
    if (closeRef && isClosed) {
      closeRef.current?.click();
    }
  }

  function handleApply() {
    const isClosed = onApply();
    if (closeRef && isClosed) {
      closeRef.current?.click();
    }
  }

  return (
    // BottomSheet 컴포넌트 사용 시 외부에서 Drawer 영역 설정, trigger 세팅 필수
    // <Drawer>
    //   <DrawerTrigger>Open</DrawerTrigger>
    // </Drawer>
    <DrawerContent className='flex w-full flex-col items-center justify-center'>
      <div className='w-full max-w-[600px]'>
        <DrawerHeader>
          <DrawerTitle>
            <div className='flex items-center justify-between'>
              <DrawerClose asChild>
                <Icon
                  icon='ic:baseline-clear'
                  className='cursor-pointer text-gray-700'
                  fontSize={16}
                />
              </DrawerClose>
              <p className='ui-text-sub-head-2'>{title}</p>
              <div />
            </div>
          </DrawerTitle>
        </DrawerHeader>
        {children}
        <DrawerFooter>
          <div className='flex items-center gap-2'>
            <Button onClick={handleReset} size='lg' variant='secondary'>
              {resetText}
            </Button>
            <Button onClick={handleApply} size='lg' variant='primary'>
              {applyText}
            </Button>
          </div>
        </DrawerFooter>
      </div>
      {/* 숨겨진 DrawerClose 버튼을 ref로 참조 */}
      <DrawerClose ref={closeRef} className='hidden' />
    </DrawerContent>
  );
}
