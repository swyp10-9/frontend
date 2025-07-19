import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Calendar, { EventData } from './Calendar';

// 예시 이벤트 데이터
const sampleEvents: EventData[] = [
  {
    id: '1',
    title: '서울 봄꽃 축제',
    type: 'capital',
    color: '#4CAF50',
    date: '2025-07-08',
  },
  {
    id: '2',
    title: '강남 패션 축제',
    type: 'capital',
    color: '#4CAF50',
    date: '2025-07-08',
  },
  {
    id: '3',
    title: '부산 해운대 축제',
    type: 'local',
    color: '#FF9800',
    date: '2025-07-11',
  },
  {
    id: '4',
    title: '제주 한라산 축제',
    type: 'local',
    color: '#FF9800',
    date: '2025-07-11',
  },
  {
    id: '5',
    title: '대구 동성로 축제',
    type: 'local',
    color: '#FF9800',
    date: '2025-07-18',
  },
  {
    id: '6',
    title: '인천 송도 축제',
    type: 'capital',
    color: '#4CAF50',
    date: '2025-07-18',
  },
  {
    id: '7',
    title: '광주 무등산 축제',
    type: 'local',
    color: '#FF9800',
    date: '2025-07-18',
  },
  {
    id: '8',
    title: '대전 엑스포 축제',
    type: 'local',
    color: '#FF9800',
    date: '2025-07-21',
  },
  {
    id: '9',
    title: '울산 태화강 축제',
    type: 'local',
    color: '#FF9800',
    date: '2025-07-21',
  },
  {
    id: '10',
    title: '수원 화성 축제',
    type: 'capital',
    color: '#4CAF50',
    date: '2025-07-25',
  },
  {
    id: '11',
    title: '전주 한옥마을 축제',
    type: 'local',
    color: '#FF9800',
    date: '2025-07-17',
  },
];

const meta: Meta<typeof Calendar> = {
  title: 'Components/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    events: {
      description: '이벤트 데이터 배열',
      control: { type: 'object' },
    },
    initialDate: {
      description: '초기 표시 날짜',
      control: { type: 'date' },
    },
    onDateSelect: {
      description: '날짜 선택 시 호출되는 콜백 함수',
      action: 'dateSelected',
    },
    showNavigation: {
      description: '월 이동 네비게이션 표시 여부',
      control: { type: 'boolean' },
    },
    showHolidays: {
      description: '공휴일 표시 여부',
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리 (이벤트 없음)
export const Default: Story = {
  args: {},
};

// 이벤트가 있는 스토리
export const WithEvents: Story = {
  args: {
    events: sampleEvents,
  },
};

// 특정 날짜로 초기화된 스토리
export const WithInitialDate: Story = {
  args: {
    events: sampleEvents,
    initialDate: new Date('2025-07-01'),
  },
};

// 네비게이션 없는 스토리
export const WithoutNavigation: Story = {
  args: {
    events: sampleEvents,
    showNavigation: false,
  },
};

// 공휴일 표시 없는 스토리
export const WithoutHolidays: Story = {
  args: {
    events: sampleEvents,
    showHolidays: false,
  },
};

// 빈 캘린더 스토리
export const Empty: Story = {
  args: {
    events: [],
    showNavigation: true,
    showHolidays: true,
  },
};
