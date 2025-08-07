import { Icon } from '@iconify/react';
import Image from 'next/image';

import ThemeTag from './theme-tag';

interface FestivalListViewProps {
  image: string;
  theme: string;
  title: string;
  loc: string;
  start_date: string;
  end_date: string;
  is_marked: boolean;
}

export default function FestivalListView(props: FestivalListViewProps) {
  const { image, theme, title, loc, start_date, end_date, is_marked } = props;

  return (
    <div className='flex h-[108px] w-full gap-4'>
      <Image
        src={image || '/image/logo.png'}
        alt='festival'
        className='aspect-square rounded-sm object-cover'
        width={108}
        height={108}
      />
      <div className='flex w-full flex-col'>
        <div className='flex w-full items-center justify-between'>
          <ThemeTag type={theme} />
          <div className='flex gap-2'>
            {is_marked ? (
              <Icon
                icon='mynaui:star-solid'
                className='cursor-pointer text-yellow'
                fontSize={20}
              />
            ) : (
              <Icon
                icon='mynaui:star'
                className='cursor-pointer text-gray-300'
                fontSize={20}
              />
            )}
            <Icon
              icon='lucide:share'
              className='cursor-pointer text-gray-300'
              fontSize={20}
            />
          </div>
        </div>
        {/* NOTE: 디자인 상 줄바꿈이 고려되지 않아 시간 상 1줄로 지정 */}
        <p className='mt-1 mb-3 line-clamp-1 ui-text-sub-head'>{title}</p>
        <div className='mb-1 flex items-center'>
          <Icon
            icon='carbon:location-filled'
            className='cursor-pointer text-gray-300'
            fontSize={20}
          />
          <p className='mr-1 ml-0.5 ui-text-body-2'>{loc}</p>
          <p className='ui-text-body-2 underline'>지도보기</p>
        </div>
        <div className='flex items-center gap-2'>
          <Icon
            icon='uis:calendar'
            className='cursor-pointer text-gray-300'
            fontSize={20}
          />
          <p className='mr-1 ml-0.5 ui-text-body-2'>
            {displayDate(start_date)} ~ {displayDate(end_date)}
          </p>
        </div>
      </div>
    </div>
  );
}

function displayDate(time: string) {
  const year = new Date(time).getFullYear();
  const month = new Date(time).getMonth() + 1;
  const day = new Date(time).getDate();

  return `${year}.${month}.${day}`;
}
