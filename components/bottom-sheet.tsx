'use client';

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
  onReset: () => void;
  onApply: () => void;
  resetText?: string;
  applyText?: string;
}) {
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
            <Button onClick={onReset} size='lg' variant='secondary'>
              {resetText}
            </Button>
            <Button onClick={onApply} size='lg' variant='primary'>
              {applyText}
            </Button>
          </div>
        </DrawerFooter>
      </div>
    </DrawerContent>
  );
}
