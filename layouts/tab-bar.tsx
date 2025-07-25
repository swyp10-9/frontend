'use client';

import { Icon } from '@iconify/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TabBar() {
  const pathname = usePathname();
  const LinkClassName = 'flex flex-col items-center gap-px w-full';

  return (
    <div className='border-t-gray-400 border-t-1 py-3 box-border'>
      <div className='flex items-center justify-between w-full'>
        <Link
          href='/'
          className={`${LinkClassName} ${pathname === '/' ? '' : ''}`}
        >
          <Icon
            className='mb-0.5'
            icon={pathname === '/' ? 'heroicons:map-solid' : 'heroicons:map'}
            fontSize={24}
            color={pathname === '/' ? undefined : 'gray'}
          />
          <span
            className={`${pathname === '/' ? 'text-sub-head-3' : 'text-caption'}`}
          >
            지도 보기
          </span>
        </Link>
        <Link
          href='/calendar'
          className={`${LinkClassName} ${pathname === '/calendar' ? '' : ''}`}
        >
          <Icon
            className='mb-0.5'
            icon={
              pathname === '/calendar' ? 'uis:calendar' : 'proicons:calendar'
            }
            fontSize={24}
            color={pathname === '/calendar' ? undefined : 'gray'}
          />
          <span
            className={`${pathname === '/calendar' ? 'text-sub-head-3' : 'text-caption'}`}
          >
            달력 보기
          </span>
        </Link>
        <Link
          href='/month-festival'
          className={`${LinkClassName} ${pathname === '/month-festival' ? '' : ''}`}
        >
          <Icon
            className='mb-0.5'
            icon={
              pathname === '/month-festival'
                ? 'bxs:calendar-star'
                : 'bx:calendar-star'
            }
            fontSize={24}
            color={pathname === '/month-festival' ? undefined : 'gray'}
          />
          <span
            className={`${pathname === '/month-festival' ? 'text-sub-head-3' : 'text-caption'}`}
          >
            이달의 축제
          </span>
        </Link>
        <Link
          href='/customized'
          className={`${LinkClassName} ${pathname === '/customized' ? '' : ''}`}
        >
          <Icon
            className='mb-0.5'
            icon={
              pathname === '/customized'
                ? 'mingcute:target-fill'
                : 'mingcute:target-line'
            }
            fontSize={24}
            color={pathname === '/customized' ? undefined : 'gray'}
          />
          <span
            className={`${pathname === '/customized' ? 'text-sub-head-3' : 'text-caption'}`}
          >
            맞춤 축제
          </span>
        </Link>
      </div>
    </div>
  );
}
