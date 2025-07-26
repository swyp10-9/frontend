'use client';

import React, { useState } from 'react';

// 이벤트 데이터 타입
export interface EventData {
  id: string;
  title: string;
  type: 'capital' | 'local'; // 수도권/지방
  color: string; // ex) '#4CAF50', '#FF9800'
  date: string; // '2025-07-08'
  count?: number; // 이벤트 개수 (API에서 받아올 데이터)
}

// 날짜별 데이터 타입
interface DayData {
  date: string;
  day: number;
  events: EventData[];
  totalCount?: number; // 해당 날짜의 총 이벤트 개수
  isToday?: boolean;
  isSelected?: boolean;
  isHoliday?: boolean;
}

// Calendar 컴포넌트 props
export interface CalendarProps {
  events?: EventData[];
  initialDate?: Date;
  onDateSelect?: (date: string) => void;
  showNavigation?: boolean;
  showHolidays?: boolean;
}

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

const Calendar = ({
  events = [],
  initialDate = new Date(),
  onDateSelect,
  showNavigation = true,
  showHolidays = true,
}: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-based

  // 날짜별로 이벤트를 묶기
  const calendarList: Record<string, EventData[]> = events.reduce(
    (acc, event) => {
      if (!acc[event.date]) acc[event.date] = [];
      acc[event.date].push(event);
      return acc;
    },
    {} as Record<string, EventData[]>,
  );

  // 날짜를 YYYY-MM-DD 형식으로 변환
  const formatDate = (year: number, month: number, day: number): string => {
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');

    return `${year}-${monthStr}-${dayStr}`;
  };

  // 오늘 날짜인지 확인
  const isToday = (day: number): boolean => {
    const today = new Date();

    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  };

  // 특정 날짜의 이벤트 가져오기
  const getEventsForDate = (dateStr: string): EventData[] => {
    return calendarList[dateStr] || [];
  };

  // 달력에 표시할 날짜 데이터 생성
  const getCalendarDays = (): (DayData | null)[] => {
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const days: (DayData | null)[] = [];

    for (let i = 0; i < firstDay; i += 1) {
      days.push(null);
    }
    for (let i = 1; i <= lastDate; i += 1) {
      const dateStr = formatDate(year, month, i);
      const eventsForDate = getEventsForDate(dateStr);
      const dayData: DayData = {
        date: dateStr,
        day: i,
        events: eventsForDate,
        totalCount: eventsForDate.length > 0 ? eventsForDate.length : 99, // 임시로 99, API 연동 시 실제 개수로 교체
        isToday: isToday(i),
        isSelected: selectedDate === dateStr,
        isHoliday: showHolidays && new Date(year, month, i).getDay() === 0, // 일요일
      };
      days.push(dayData);
    }
    while (days.length % 7 !== 0) {
      days.push(null);
    }
    return days;
  };

  const moveMonth = (delta: number) => {
    const newDate = new Date(year, month + delta, 1);
    setCurrentDate(newDate);
    setSelectedDate(null);
  };

  const handleDateClick = (dayData: DayData) => {
    setSelectedDate(dayData.date);
    onDateSelect?.(dayData.date);
  };

  const days = getCalendarDays();

  return (
    <div className='mx-auto w-full max-w-4xl rounded-lg bg-gray-50 p-5 font-sans'>
      {showNavigation && (
        <div className='mb-4 flex items-center justify-center gap-20'>
          <button
            className='cursor-pointer rounded border-none bg-transparent p-2 text-lg text-gray-600 transition-colors hover:bg-black/10'
            onClick={() => moveMonth(-1)}
          >
            ◀
          </button>
          <h2 className='text-xl font-bold text-gray-800'>
            {year}년 {month + 1}월
          </h2>
          <button
            className='cursor-pointer rounded border-none bg-transparent p-2 text-lg text-gray-600 transition-colors hover:bg-black/10'
            onClick={() => moveMonth(1)}
          >
            ▶
          </button>
        </div>
      )}

      <div className='grid grid-cols-7 gap-0 bg-gray-50'>
        {DAYS.map(day => (
          <div
            key={day}
            className='border-b border-gray-200 bg-transparent py-3 text-center text-sm font-bold text-gray-800'
          >
            {day}
          </div>
        ))}
      </div>

      <div className='grid grid-cols-7 gap-0 bg-gray-50'>
        {days.map((dayData, idx) => (
          <div
            key={idx}
            className={`relative box-border flex h-auto min-h-[60px] cursor-pointer flex-col items-center justify-center rounded-none border-none bg-transparent p-2 text-center align-top text-sm font-medium transition-all duration-200 ${dayData === null ? 'cursor-default bg-transparent text-gray-300' : ''} ${dayData?.isToday ? 'today' : ''} ${dayData?.isSelected ? 'rounded-lg border-2 border-gray-600 bg-white/80 p-1.5' : ''} ${dayData?.isHoliday ? 'text-red-500' : ''} ${(dayData?.events || []).length > 0 ? 'has-events' : ''} ${(idx + 1) % 7 === 4 ? 'bg-white/30' : ''} hover:bg-white/50`}
            onClick={() => dayData && handleDateClick(dayData)}
          >
            {dayData ? (
              <div className='flex h-full flex-col items-center justify-center gap-1'>
                <div
                  className={`mb-0.5 text-sm font-semibold ${dayData.isToday ? 'flex h-6 w-6 items-center justify-center rounded-full bg-black font-bold text-white' : 'text-gray-800'} `}
                >
                  {dayData.day}
                </div>
                <div className='text-xs font-medium text-gray-600'>
                  {dayData.totalCount}개
                </div>
                {dayData.events && dayData.events.length > 0 && (
                  <div className='hidden'>
                    {dayData.events.map(event => (
                      <div
                        key={event.id}
                        className={`mb-0.5 inline-block overflow-hidden rounded px-1.5 py-0.5 text-xs leading-tight font-semibold text-ellipsis whitespace-nowrap ${event.type === 'capital' ? 'bg-green-600 text-white' : 'bg-orange-600 text-white'}`}
                        style={{
                          backgroundColor: event.color,
                          color: '#fff',
                          fontWeight: 600,
                        }}
                      >
                        <span className='text-xs font-semibold text-inherit'>
                          {event.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              ''
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
