import { monthlyTopFestival } from '@/apis/SWYP10BackendAPI';

import FestivalCard from './_modules/festival-card';
import HeaderImage from './_modules/header-image';

export default async function MonthFestivalPage() {
  const { data } = await monthlyTopFestival();

  const festivals = data?.content ?? [];

  console.log(festivals);

  return (
    <div className='flex h-full w-full flex-col items-center'>
      <HeaderImage
        title={`신선한 바람과 함께하는\n전국 9월 가을 축제`}
        description={`신선한 바람과 함께 즐길 수 있는 전국 9월 축제들이\n당신을 특별한 추억 속으로 초대합니다.`}
      />
      <div className='mt-4 flex w-full flex-col px-5'>
        <div className='flex flex-col gap-1'>
          <p className='ui-text-body-2 text-gray-400'>가을 감성이 물씬!</p>
          <p className='ui-text-head-2'>9월 가을 축제 BEST 5</p>
        </div>
        <div className='box-border flex w-full flex-col gap-8 pb-5'>
          {festivals.map((festival, index) => (
            <FestivalCard
              key={index}
              index={index + 1}
              festival={{
                ...festival,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
