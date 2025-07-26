'use client';

import React, { useState } from 'react';

import './Calendar.scoped.scss';

// 이벤트 데이터 타입
export interface EventData {
  id: string;
  title: string;
  type: 'capital' | 'local'; // 수도권/지방
  color: string; // ex) '#4CAF50', '#FF9800'
  date: string; // '2025-07-08'
}

// 날짜별 데이터 타입
interface DayData {
  date: string;
  day: number;
  events: EventData[];
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
      const dayData: DayData = {
        date: dateStr,
        day: i,
        events: getEventsForDate(dateStr),
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
    <div className='calendar-container'>
      {showNavigation && (
        <div className='calendar-header'>
          <button className='nav-button' onClick={() => moveMonth(-1)}>
            ◀
          </button>
          <h2 className='month-title'>
            {year}년 {month + 1}월
          </h2>
          <button className='nav-button' onClick={() => moveMonth(1)}>
            ▶
          </button>
        </div>
      )}

      <div className='calendar-grid header'>
        {DAYS.map(day => (
          <div key={day} className='day-header'>
            {day}
          </div>
        ))}
      </div>

      <div className='calendar-grid body'>
        {days.map((dayData, idx) => (
          <div
            key={idx}
            className={`day-cell ${dayData === null ? 'empty' : ''} ${dayData?.isToday ? 'today' : ''} ${dayData?.isSelected ? 'selected' : ''} ${dayData?.isHoliday ? 'holiday' : ''} ${(dayData?.events || []).length > 0 ? 'has-events' : ''}`}
            onClick={() => dayData && handleDateClick(dayData)}
          >
            {dayData ? (
              <div className='day-content'>
                <div className='day-number'>{dayData.day}</div>
                {dayData.events && dayData.events.length > 0 && (
                  <div className='events-container'>
                    {dayData.events.map(event => (
                      <div
                        key={event.id}
                        className={`event-item-inline ${event.type}`}
                        style={{
                          backgroundColor: event.color,
                          color: '#fff',
                          fontWeight: 600,
                        }}
                      >
                        <span className='event-title-inline'>
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
