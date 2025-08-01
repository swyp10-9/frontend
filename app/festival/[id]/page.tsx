'use client';

import { useState } from 'react';

import { Icon } from '@iconify/react';
import Image from 'next/image';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';

import BackIcon from '@/assets/icons/back.svg';
import { Tab, Tabs } from '@/components/Tabs';

function ImageSlider({ images }: { images: string[] }) {
  return (
    <div className='relative w-full'>
      <Swiper spaceBetween={0} slidesPerView='auto' className='w-full'>
        {images.map((image, index) => (
          <SwiperSlide key={index} className='!w-[164px] pr-2'>
            <Image
              src={image}
              alt={`축제 이미지 ${index + 1}`}
              className='h-[156px] w-[156px] rounded object-cover'
              width={156}
              height={156}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

interface FestivalDetailProps {
  params: {
    id: string;
  };
}

export default function FestivalDetail({
  params: _params,
}: FestivalDetailProps) {
  const [selectedTab, setSelectedTab] = useState('festival-info');

  const festivalImages = [
    'https://picsum.photos/300/300?random=1',
    'https://picsum.photos/300/300?random=2',
    'https://picsum.photos/300/300?random=3',
    'https://picsum.photos/300/300?random=4',
  ];

  return (
    // FIXME: 화면 크기 설정은 layout 수준에서 설정 필요, 모바일 뷰 재현을 위해 360px 사용
    <div className='relative min-h-screen w-screen max-w-[360px] bg-white'>
      {/* Main Content */}
      <div>
        {/* Main Image */}
        <div className='relative aspect-[2/1] w-full overflow-hidden'>
          <Image
            src='https://picsum.photos/800/400?random=5'
            alt='대구치맥페스티벌'
            className='h-full w-full object-cover'
            fill
          />
          {/* Shadow overlay */}
          <div className='absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent'></div>
          {/* 뒤로가기 버튼 */}
          <div className='absolute top-2 left-3 z-10'>
            <button className='flex h-8 w-8 items-center justify-center rounded-full bg-black/20'>
              <BackIcon className='h-[13px] w-[7px]' />
            </button>
          </div>
        </div>

        {/* Festival Info */}
        <div className='px-4 py-6'>
          <div className='flex w-full items-start justify-between'>
            <div className='flex w-[214px] flex-col items-start gap-2'>
              <div className='flex items-center justify-center rounded bg-[#f8e8ff] px-1 py-0.5'>
                <span className='ui-text-sub-head-3 text-violet-500'>
                  문화/예술
                </span>
              </div>
              <div className='flex w-full flex-col items-start gap-0.5'>
                <h2 className='ui-text-head-2 text-black'>대구치맥페스티벌</h2>
                <p className='ui-text-body-2 ui-text-color-sub'>
                  2025 대구치맥페스티벌, 치맥 센세이션
                </p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Icon
                icon='mynaui:star'
                className='cursor-pointer'
                color='#7e848f'
                fontSize={24}
              />
              <Icon
                icon='lucide:share'
                className='cursor-pointer'
                color='#7e848f'
                fontSize={24}
              />
            </div>
          </div>

          <div className='mt-6 flex flex-col gap-2'>
            <div className='flex items-center gap-1'>
              <Icon icon='uis:calendar' color='#7e848f' fontSize={16} />
              <span className='ui-text-body-2 ui-text-color-info'>
                2025.07.10 ~ 2025.07.15
              </span>
            </div>
            <div className='flex w-full items-start gap-1'>
              <Icon
                icon='carbon:location-filled'
                color='#7e848f'
                fontSize={16}
              />
              <div className='flex w-[283px] flex-col gap-0.5'>
                <p className='ui-text-body-2 ui-text-color-info'>
                  대구광역시 달서구 공원순환로 36 (두류동) 두류공원
                </p>
                <p className='ui-text-sub-head-3 ui-text-color-sub underline'>
                  지도보기
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className='sticky top-0 z-20 bg-white px-4 py-2'>
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            variant='underline'
          >
            <Tab label='축제 정보' value='festival-info' />
            <Tab label='여행 코스' value='travel-course' />
            <Tab label='주변 맛집' value='restaurants' />
            <Tab label='리뷰' value='reviews' />
          </Tabs>
        </div>

        {/* Tab Content */}
        <div className='px-4 py-6'>
          {selectedTab === 'festival-info' && (
            <div className='space-y-6'>
              <div className='flex flex-col gap-3'>
                <h3 className='ui-text-sub-head text-black'>축제 소개</h3>
                <ImageSlider images={festivalImages} />
                <div className='h-[336px] overflow-hidden'>
                  <p className='ui-text-body-2-long ui-text-color-sub'>
                    대구치맥페스티벌은 대구를 대표하는 여름 문화관광축제로,
                    '치킨'과 '맥주'를 결합한 국내 최대 규모의 식음 축제이다.
                    2013년 처음 개최된 이후 누적 관람객 100만 명 이상을
                    유치하며, 지역 경제 활성화는 물론 대구의 글로벌 브랜드 가치
                    제고에도 크게 기여해왔다. 단순한 식음 축제를 넘어 공연,
                    전시, 체험, 기업 홍보, 글로벌 교류 등 다양한 프로그램을 통해
                    관람객에게 풍성한 즐길 거리를 제공하고 있으며 2025년
                    대구치맥페스티벌은 7월 2일부터 6일까지 닷새간 두류공원
                    일원에서 개최된다. 메인 행사장인 2.28 자유광장은 물놀이와
                    일렉트로닉 음악이 결합된 워터 콘서트 테마로 꾸며지며, 360도
                    중앙 무대도 새롭게 도입된다. 그리고 '대프리카 워터피아',
                    '블러드 호러 클럽' 등 다양한 테마 공간이 조성되며, 유명
                    아티스트와 협업한 조형물 및 포토존을 통해 축제 분위기를 한층
                    더할 예정이다.
                  </p>
                </div>
              </div>

              <div className='flex flex-col gap-3'>
                <h3 className='ui-text-sub-head text-black'>행사내용</h3>
                <div className='h-72 overflow-hidden'>
                  <div className='space-y-4 ui-text-body-2-long ui-text-color-sub'>
                    <p>
                      1. 관람행사
                      <br />- 치맥K-POP 콘서트, 치맥EDM Party, 치맥버스킹,
                      초청공연
                    </p>

                    <p>
                      2. 참여행사
                      <br />- 치맥아이스펍, 치맥시민참여이벤트, 치킨신메뉴
                      경연대회, 수제맥주 경연대회
                    </p>

                    <p>
                      3. 체험행사
                      <br />- 사전예약 식음존, 비즈니스라운지, 대프리카워터피아,
                      치맥더클럽, 놀러와요EGG섬, 치맥여행자의거리, 치맥포토존,
                      치맥아이스펍, 치맥게임존
                    </p>
                  </div>
                </div>
              </div>

              <div className='flex flex-col gap-3'>
                <h3 className='ui-text-sub-head text-black'>상세 정보</h3>
                <div className='flex w-80 flex-col gap-3'>
                  <div className='flex items-start gap-2'>
                    <Icon
                      icon='fluent:call-20-filled'
                      color='#7e848f'
                      fontSize={20}
                    />
                    <span className='ui-text-body-2 ui-text-color-sub'>
                      123-234-5678
                    </span>
                  </div>
                  <div className='flex w-full items-start gap-2'>
                    <Icon
                      icon='tabler:coin-filled'
                      color='#7e848f'
                      fontSize={20}
                    />
                    <span className='ui-text-body-2 ui-text-color-sub'>
                      무료, 일부 구간 유료(사전예약존 85,000원)
                    </span>
                  </div>
                  <div className='flex h-10 w-full items-start gap-2'>
                    <Icon
                      icon='gravity-ui:link'
                      color='#7e848f'
                      fontSize={20}
                    />
                    <div className='w-[296px]'>
                      <p className='ui-text-body-2 leading-[20px] ui-text-color-sub'>
                        https://www.instagram.com/daegu_chimac_festival/
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'travel-course' && (
            <div className='space-y-6'>
              <div>
                <h3 className='mb-3 ui-text-sub-head text-black'>여행 코스</h3>
                <div className='space-y-4'>
                  <div className='rounded-lg bg-gray-50 p-4'>
                    <h4 className='mb-2 ui-text-sub-head-2 text-black'>
                      1시간 코스
                    </h4>
                    <p className='ui-text-body-2 ui-text-color-info'>
                      메인 무대 → 치킨 마켓 → 맥주 존 → 포토존
                    </p>
                  </div>
                  <div className='rounded-lg bg-gray-50 p-4'>
                    <h4 className='mb-2 ui-text-sub-head-2 text-black'>
                      2시간 코스
                    </h4>
                    <p className='ui-text-body-2 ui-text-color-info'>
                      공연 관람 → 체험 프로그램 → 치킨 마켓 → 기념품샵
                    </p>
                  </div>
                  <div className='rounded-lg bg-gray-50 p-4'>
                    <h4 className='mb-2 ui-text-sub-head-2 text-black'>
                      가족 코스
                    </h4>
                    <p className='ui-text-body-2 ui-text-color-info'>
                      키즈 존 → 체험 부스 → 치킨 마켓 → 야간 공연
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'restaurants' && (
            <div className='space-y-6'>
              <div>
                <h3 className='mb-3 ui-text-sub-head text-black'>주변 맛집</h3>
                <div className='space-y-4'>
                  <div className='rounded-lg border border-gray-200 p-3'>
                    <h4 className='mb-1 ui-text-sub-head-2 text-black'>
                      대구 명물 치킨집
                    </h4>
                    <p className='mb-2 ui-text-body-2 ui-text-color-info'>
                      도보 5분 • 치킨전문
                    </p>
                    <p className='ui-text-caption ui-text-color-info'>
                      대구 달서구 두류동 123-45
                    </p>
                  </div>
                  <div className='rounded-lg border border-gray-200 p-3'>
                    <h4 className='mb-1 ui-text-sub-head-2 text-black'>
                      맥주 하우스
                    </h4>
                    <p className='mb-2 ui-text-body-2 ui-text-color-info'>
                      도보 3분 • 수제맥주
                    </p>
                    <p className='ui-text-caption ui-text-color-info'>
                      대구 달서구 두류동 234-56
                    </p>
                  </div>
                  <div className='rounded-lg border border-gray-200 p-3'>
                    <h4 className='mb-1 ui-text-sub-head-2 text-black'>
                      전통 한식당
                    </h4>
                    <p className='mb-2 ui-text-body-2 ui-text-color-info'>
                      도보 7분 • 한정식
                    </p>
                    <p className='ui-text-caption ui-text-color-info'>
                      대구 달서구 두류동 345-67
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'reviews' && (
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <h3 className='ui-text-sub-head text-black'>리뷰 (24)</h3>
                <div className='flex items-center gap-1'>
                  <span className='text-yellow-500'>★</span>
                  <span className='ui-text-body-2 text-black'>4.5</span>
                </div>
              </div>

              <div className='space-y-4'>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(review => (
                  <div key={review} className='border-b border-gray-100 pb-4'>
                    <div className='mb-2 flex items-center gap-2'>
                      <div className='h-8 w-8 rounded-full bg-gray-200'></div>
                      <div>
                        <p className='ui-text-caption font-medium text-black'>
                          사용자{review}
                        </p>
                        <div className='flex items-center gap-1'>
                          <span className='text-[12px] text-yellow-500'>
                            ★★★★★
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className='ui-text-body-2 ui-text-color-sub'>
                      치킨과 맥주의 조합이 정말 환상적이었어요. 축제 분위기도
                      좋고 다양한 체험 프로그램도 즐거웠습니다.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
