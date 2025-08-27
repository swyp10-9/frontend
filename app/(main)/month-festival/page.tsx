import FestivalCard from './_modules/festival-card';
import HeaderImage from './_modules/header-image';

export default function MonthFestivalPage() {
  return (
    <div className='flex h-full w-full flex-col items-center'>
      <HeaderImage
        title={`신선한 바람과 함께하는\n전국 9월 가을 축제`}
        description={`신선한 바람과 함께 즐길 수 있는 전국 9월 축제들이\n당신을 특별한 추억 속으로 초대합니다.`}
      />
      <p className='my-2'>마크업 작업 중...</p>
      <div className='mt-4 flex w-full flex-col px-5'>
        <div className='flex flex-col gap-1'>
          <p className='ui-text-body-2 text-gray-400'>가을 감성이 물씬!</p>
          <p className='ui-text-head-2'>9월 가을 축제 BEST 5</p>
        </div>
        <div className='box-border flex w-full flex-col gap-8 pb-5'>
          {Array.from({ length: 5 }).map((_, index) => (
            <FestivalCard
              key={index}
              index={index + 1}
              festival={{
                id: index + 1,
                is_marked: false,
                theme: 'MUSIC',
                title: 'DMZ OPEN 페스티벌',
                loc: '경기도 파주시 임진각',
                map_x: '127.0000',
                map_y: '37.0000',
                start_date: '2025-09-01',
                end_date: '2025-09-30',
                overview:
                  'DMZ OPEN 페스티벌은 2025년 9월 1일부터 9월 30일까지 경기도 파주시에서 열리는 축제입니다.',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
