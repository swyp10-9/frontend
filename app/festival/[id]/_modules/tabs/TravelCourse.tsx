'use client';

import 'swiper/css';

import PlaceSlider from '../PlaceSlider';

export default function TravelCourse() {
  const nearbyPlaces = [
    {
      name: '수원 화성 행궁',
      distance: '1.5km',
      image: 'https://picsum.photos/300/300?random=1',
    },
    {
      name: '수원 화성 행궁',
      distance: '1.5km',
      image: 'https://picsum.photos/300/300?random=2',
    },
    {
      name: '수원 화성 행궁',
      distance: '1.5km',
      image: 'https://picsum.photos/300/300?random=3',
    },
  ];

  const travelCourse = [
    { number: 1, name: '수원 화성 행궁', time: '10:00' },
    { number: 2, name: '수원 화성 행궁', time: '10:00' },
    { number: 3, name: '수원 화성 행궁', time: '10:00' },
  ];

  return (
    <div className='space-y-6'>
      {/* 근처 볼 거리 */}
      <div>
        <h3 className='mb-3 text-[16px] leading-[22px] font-bold tracking-[-0.16px] text-[#090a0c]'>
          근처 볼 거리
        </h3>
        <PlaceSlider places={nearbyPlaces} />
      </div>

      {/* 추천 여행 코스 */}
      <div>
        <h3 className='mb-3 text-[16px] leading-[22px] font-bold tracking-[-0.16px] text-[#090a0c]'>
          추천 여행 코스
        </h3>
        <div className='w-[162px]'>
          {travelCourse.map((course, index) => (
            <div key={index}>
              <div className='flex items-center gap-3'>
                <div className='flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-[15px] bg-[#f1f2f4] px-[11px]'>
                  <span className='text-[14px] leading-[20px] font-semibold tracking-[-0.14px] text-[#5e6573]'>
                    {course.number}
                  </span>
                </div>
                <div className='flex items-center gap-1'>
                  <span className='text-[16px] leading-[22px] font-bold tracking-[-0.16px] whitespace-nowrap text-[#090a0c]'>
                    {course.name}
                  </span>
                  <span className='text-[14px] leading-[20px] font-medium tracking-[-0.14px] whitespace-nowrap text-[#5e6573]'>
                    {course.time}
                  </span>
                </div>
              </div>
              {index < travelCourse.length - 1 && (
                <div className='relative my-0 ml-0 h-11 w-5'>
                  <svg
                    width='20'
                    height='44'
                    viewBox='0 0 20 44'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M10 0V44'
                      stroke='#E5E7EB'
                      strokeWidth='2'
                      strokeDasharray='4 4'
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
