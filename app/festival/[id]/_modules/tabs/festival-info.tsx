import { Icon } from '@iconify/react';

import ImageSlider from '../image-slider';

interface FestivalInfoProps {
  festivalImages: string[];
}

export default function FestivalInfo({ festivalImages }: FestivalInfoProps) {
  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-3'>
        <h3 className='ui-text-sub-head text-black'>축제 소개</h3>
        <ImageSlider images={festivalImages} />
        <div className='h-[336px] overflow-hidden'>
          <p className='ui-text-body-2-long ui-text-color-sub'>
            대구치맥페스티벌은 대구를 대표하는 여름 문화관광축제로, '치킨'과
            '맥주'를 결합한 국내 최대 규모의 식음 축제이다. 2013년 처음 개최된
            이후 누적 관람객 100만 명 이상을 유치하며, 지역 경제 활성화는 물론
            대구의 글로벌 브랜드 가치 제고에도 크게 기여해왔다. 단순한 식음
            축제를 넘어 공연, 전시, 체험, 기업 홍보, 글로벌 교류 등 다양한
            프로그램을 통해 관람객에게 풍성한 즐길 거리를 제공하고 있으며 2025년
            대구치맥페스티벌은 7월 2일부터 6일까지 닷새간 두류공원 일원에서
            개최된다. 메인 행사장인 2.28 자유광장은 물놀이와 일렉트로닉 음악이
            결합된 워터 콘서트 테마로 꾸며지며, 360도 중앙 무대도 새롭게
            도입된다. 그리고 '대프리카 워터피아', '블러드 호러 클럽' 등 다양한
            테마 공간이 조성되며, 유명 아티스트와 협업한 조형물 및 포토존을 통해
            축제 분위기를 한층 더할 예정이다.
          </p>
        </div>
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
            <Icon icon='fluent:call-20-filled' color='#7e848f' fontSize={20} />
            <span className='ui-text-body-2 ui-text-color-sub'>
              123-234-5678
            </span>
          </div>
          <div className='flex w-full items-start gap-2'>
            <Icon icon='tabler:coin-filled' color='#7e848f' fontSize={20} />
            <span className='ui-text-body-2 ui-text-color-sub'>
              무료, 일부 구간 유료(사전예약존 85,000원)
            </span>
          </div>
          <div className='flex h-10 w-full items-start gap-2'>
            <Icon icon='gravity-ui:link' color='#7e848f' fontSize={20} />
            <div className='w-[296px]'>
              <p className='ui-text-body-2 leading-[20px] ui-text-color-sub'>
                https://www.instagram.com/daegu_chimac_festival/
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
