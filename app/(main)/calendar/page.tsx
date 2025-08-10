'use client';

import { useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import Calendar from '@/components/Calendar/Calendar';
import { Drawer } from '@/components/shadcn/drawer';
import { regionList } from '@/constants/regionList';
import themeList from '@/constants/themeList';
import { withWhomList } from '@/constants/withWhomList';

import FloatingCalendarButton from './_modules/FloatingCalendarButton';
import BottomFilter from './_modules/bottom-filter';
import List from './_modules/list';

export default function CalendarPage() {
  const searchParams = useSearchParams();
  const [isCalendarVisible, setIsCalendarVisible] = useState(true);

  // searchParams에서 값들을 가져오기
  const selected = searchParams.get('selected') || '';
  const region = searchParams.get('region') || '';
  const withWhom = searchParams.get('withWhom') || '';
  const theme = searchParams.get('theme') || '';
  const isNearBy = searchParams.get('isNearBy') || '';
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';

  const list = [];
  if (region) {
    const regionItem = regionList.find(item => item.type === region);
    list.push({ ...regionItem, name: 'region' });
  }
  if (withWhom) {
    const withWhomItem = withWhomList.find(item => item.type === withWhom);
    list.push({ ...withWhomItem, name: 'withWhom' });
  }
  if (theme) {
    const themeItem = themeList.find(item => item.type === theme);
    list.push({
      type: themeItem?.type || '',
      label: themeItem?.label || '',
      name: 'theme',
    });
  }

  // 스크롤 이벤트를 감지하여 달력이 화면에서 사라지는지 확인
  useEffect(() => {
    const handleScroll = () => {
      const calendarElement = document.querySelector('[data-calendar]');
      if (calendarElement) {
        const rect = calendarElement.getBoundingClientRect();
        // 달력이 화면에서 완전히 사라졌는지 확인 (bottom이 0보다 작음)
        setIsCalendarVisible(rect.bottom > 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 초기 상태 확인

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className='flex flex-col gap-5'>
      <div data-calendar>
        <Calendar initialDate={selected ? new Date(selected) : new Date()} />
      </div>
      <Drawer>
        <List
          calendarStartDate={startDate}
          calendarEndDate={endDate}
          selected={selected}
          paramsList={list}
          isNearBy={isNearBy === 'true'}
        />
        <BottomFilter initialParams={{ region, withWhom, theme }} />
      </Drawer>

      <FloatingCalendarButton isVisible={!isCalendarVisible} />
    </div>
  );
}
