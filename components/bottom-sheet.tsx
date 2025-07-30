'use client';

import { forwardRef, useRef } from 'react';

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

interface BottomSheetProps {
  title: string;
  children: React.ReactNode;
  footerChildren: React.ReactNode;
  titleChildren?: React.ReactNode;
}

const BottomSheet = forwardRef<HTMLButtonElement, BottomSheetProps>(
  ({ title, children, footerChildren, titleChildren }, ref) => {
    const closeRef = useRef<HTMLButtonElement>(null);

    // 외부 ref와 내부 ref를 연결
    if (ref && typeof ref === 'object') {
      ref.current = closeRef.current;
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
              {titleChildren ? (
                titleChildren
              ) : (
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
              )}
            </DrawerTitle>
          </DrawerHeader>
          {children}
          {!!footerChildren && <DrawerFooter>{footerChildren}</DrawerFooter>}
        </div>
        {/* 숨겨진 DrawerClose 버튼을 ref로 참조 */}
        <DrawerClose ref={closeRef} className='hidden' />
      </DrawerContent>
    );
  },
);

BottomSheet.displayName = 'BottomSheet';

export default BottomSheet;
