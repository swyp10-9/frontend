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
    <div className='flex gap-4 w-[320px] min-h-[108px]'>
      <Image
        src={image}
        alt='festival'
        className='aspect-square object-cover'
        width={108}
        height={108}
      />
      <div className='flex flex-col w-full'>
        <div className='flex w-full justify-between items-center'>
          <ThemeTag type={theme} />
          <div className='flex gap-2'>
            {is_marked ? (
              <Icon
                icon='mdi:star'
                className='cursor-pointer'
                color='#fdbe00'
                fontSize={20}
              />
            ) : (
              <Icon
                icon='mdi:star-outline'
                className='cursor-pointer'
                color='#7e848f'
                fontSize={20}
              />
            )}
            <Icon
              icon='mdi:ios-share'
              className='cursor-pointer'
              color='#7e848f'
              fontSize={20}
            />
          </div>
        </div>
        <p className='text-sub-head mt-1 mb-3 line-clamp-3'>{title}</p>
        <div className='flex items-center mb-1'>
          <Icon
            icon='mdi:location'
            className='cursor-pointer'
            color='#7e848f'
            fontSize={20}
          />
          <p className='ml-0.5 mr-1 text-body-2'>{loc}</p>
          <p className='underline text-sub-head-3'>지도보기</p>
        </div>
        <div className='flex items-center gap-2'>
          <Icon
            icon='mdi:calendar-blank'
            className='cursor-pointer'
            color='#7e848f'
            fontSize={20}
          />
          <p className='ml-0.5 mr-1 text-body-2'>
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
