import { Icon } from '@iconify/react';

import FestivalImageSlider from '../FestivalImageSlider';

interface FestivalInfoProps {
  festivalImages: string[];
  overview: string | null | undefined;
  phone: string | null | undefined;
  fee: string | null | undefined;
  homepage: string | null | undefined;
}

export default function FestivalInfo({
  festivalImages,
  overview,
  phone,
  fee,
  homepage,
}: FestivalInfoProps) {
  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-3'>
        <h3 className='ui-text-sub-head text-black'>축제 소개</h3>
        <FestivalImageSlider images={festivalImages} />
        <p className='ui-text-body-2-long ui-text-color-sub'>
          {overview ?? '소개 정보가 없습니다.'}
        </p>
      </div>

      <div className='flex flex-col gap-3'>
        <h3 className='ui-text-sub-head text-black'>행사내용</h3>
        <div className='h-72 overflow-hidden'>
          <div className='space-y-4 ui-text-body-2-long ui-text-color-sub'>
            <p>
              1. 관람행사
              <br />- 치맥K-POP 콘서트, 치맥EDM Party, 치맥버스킹, 초청공연
            </p>

            <p>
              2. 참여행사
              <br />- 치맥아이스펍, 치맥시민참여이벤트, 치킨신메뉴 경연대회,
              수제맥주 경연대회
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
              className='text-gray-300'
              fontSize={20}
            />
            <span className='ui-text-body-2 ui-text-color-sub'>
              {phone ?? '연락처 정보 없음'}
            </span>
          </div>
          <div className='flex w-full items-start gap-2'>
            <Icon
              icon='tabler:coin-filled'
              className='text-gray-300'
              fontSize={20}
            />
            <span className='ui-text-body-2 ui-text-color-sub'>
              {fee ?? '요금 정보 없음'}
            </span>
          </div>
          <div className='flex w-full items-start gap-2'>
            <Icon
              icon='gravity-ui:link'
              className='text-gray-300'
              fontSize={20}
            />
            <div className='w-[296px]'>
              <p className='ui-text-body-2 leading-[20px] break-all ui-text-color-sub'>
                {homepage ?? '홈페이지 정보 없음'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
