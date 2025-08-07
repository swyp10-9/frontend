'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

import adventurerImage from '@/assets/images/festival-recommendation/adventurer.png';
import curatorImage from '@/assets/images/festival-recommendation/curator.png';
import energizerImage from '@/assets/images/festival-recommendation/energizer.png';
import healerImage from '@/assets/images/festival-recommendation/healer.png';

// 결과별 이미지 매핑
const resultImages = {
  '1-1': energizerImage,
  '1-2': curatorImage,
  '1-3': adventurerImage,
  '1-4': energizerImage, // 소셜라이저는 에너자이저 이미지 사용
  '1-5': healerImage, // 힐러는 힐러 이미지 사용
};

// 결과 데이터 타입
interface SurveyResult {
  type: string;
  title: string;
  description: string;
  characteristics: string[];
}

// 결과 데이터
const surveyResults: Record<string, SurveyResult> = {
  '1-1': {
    type: 'energizer',
    title: '축제 에너자이저',
    description: '축제장이 당신을 기다려요!',
    characteristics: [
      '활기차고 사교적인 당신은 축제의 중심에서 빛나는 존재입니다',
      '큰 무대, 많은 사람들, 뜨거운 열기 속에서 진짜 행복을 느끼죠',
      '당신이 있는 곳이 바로 파티가 시작되는 곳!',
      '적극적이고 에너지 넘치는 축제를 선호해요',
    ],
  },
  '1-2': {
    type: 'curator',
    title: '축제 큐레이터',
    description: '완벽한 축제 경험을 설계하는 당신',
    characteristics: [
      '계획적이고 신중한 당신은 축제를 하나의 작품처럼 감상하고 기록합니다',
      '매 순간을 의미 있게 만들고, 특별한 추억으로 간직하는 예술가적 감성의 소유자예요',
      '창의적인 축제 경험을 추구해요',
      '완벽한 축제를 설계하는 능력을 가지고 있어요',
    ],
  },
  '1-3': {
    type: 'adventurer',
    title: '문화 탐험가',
    description: '깊이 있는 문화가 당신을 부릅니다',
    characteristics: [
      '우리의 소중한 전통과 문화를 사랑하는 당신은 축제를 통해 역사와 만나고, 조상들의 지혜를 느끼는 특별한 시간을 보내시는군요',
      '진정한 가치를 아는 멋진 분이에요!',
      '문화적이고 깊이 있는 학습을 추구해요',
      '역사적 의미가 있는 축제를 선호해요',
    ],
  },
  '1-4': {
    type: 'socializer',
    title: '축제 소셜라이저',
    description: '친구들과의 즐거운 시간이 최고!',
    characteristics: [
      '친구들과 함께할 때 가장 빛나는 당신!',
      '축제는 소중한 사람들과의 추억을 만드는 무대이고, 함께 웃고 떠들며 보내는 시간이 어떤 공연보다 소중하다고 생각하시는군요',
      '친구들과 즐기는 적극적인 축제를 선호해요',
      '사람들과의 소통을 중요하게 생각해요',
    ],
  },
  '1-5': {
    type: 'healer',
    title: '축제 힐러',
    description: '자연스럽고 여유로운 힐링이 필요해요',
    characteristics: [
      '바쁜 일상에서 벗어나 자연스럽고 평화로운 시간을 원하는 당신',
      '축제를 통해 마음의 휴식을 찾고, 소소한 행복과 여유를 만끽하는 진정한 힐링 마스터입니다',
      '자연스럽고 여유로운 분위기를 선호해요',
      '수용적이고 편안한 축제를 찾아요',
    ],
  },
};

// 메인 결과 페이지 컴포넌트
export function SurveyResultClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleStartExploring = () => {
    const data = searchParams.get('data');
    if (data) {
      router.push(`/customized?survey=${data}`);
    } else {
      router.push('/customized');
    }
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  // 설문 데이터를 기반으로 결과 결정
  const getResultFromSurvey = () => {
    try {
      const data = searchParams.get('data');
      if (data) {
        const surveyData = JSON.parse(decodeURIComponent(data));
        // 첫 번째 질문의 답변을 기반으로 결과 결정
        const firstAnswer = surveyData[1];

        return surveyResults[firstAnswer] || surveyResults['1-1'];
      }
    } catch (error) {
      console.error('설문 데이터 파싱 오류:', error);
    }
    return surveyResults['1-1']; // 기본값
  };

  const result = getResultFromSurvey();
  const resultKey =
    Object.keys(surveyResults).find(key => surveyResults[key] === result) ||
    '1-1';
  const resultImage =
    resultImages[resultKey as keyof typeof resultImages] || resultImages['1-1'];

  return (
    <div className='relative min-h-screen w-full bg-[#ffffff]'>
      {/* Status Bar */}
      <div className='h-[49.466px] w-full' />

      {/* Top Bar */}
      <div className='relative h-[92px] w-full bg-[#ffffff]'>
        <div className='absolute top-[52px] left-0 box-border flex w-full flex-row items-center justify-start px-3 py-0'>
          <button
            onClick={handleBackToHome}
            className='relative flex size-8 shrink-0 items-center justify-center'
          >
            <svg
              width='7'
              height='13'
              viewBox='0 0 7 13'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M6 1L1 6.5L6 12'
                stroke='#868C98'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className='flex flex-col items-center px-5 pb-20'>
        {/* Result Image */}
        <div className='mt-4 mb-8'>
          <div className='relative h-[300px] w-[214px] overflow-hidden rounded-2xl'>
            <Image
              src={resultImage}
              alt={result.title}
              fill
              className='object-cover'
              priority
            />
          </div>
        </div>

        {/* Result Title */}
        <div className='mb-4 text-center'>
          <h1 className='text-[24px] leading-[32px] font-bold tracking-[-0.24px] text-[#090a0c]'>
            {result.title}
          </h1>
        </div>

        {/* Result Description */}
        <div className='mb-8 text-center'>
          <p className='text-[16px] leading-[24px] tracking-[-0.16px] text-[#5e6573]'>
            {result.description}
          </p>
        </div>

        {/* Characteristics */}
        <div className='mb-8 w-full'>
          <h2 className='mb-4 text-[18px] leading-[26px] font-bold tracking-[-0.18px] text-[#090a0c]'>
            당신의 특징
          </h2>
          <div className='space-y-3'>
            {result.characteristics.map((characteristic, index) => (
              <div
                key={index}
                className='flex items-start gap-3 rounded-lg bg-[#f8f9fa] p-4'
              >
                <div className='mt-1 size-2 rounded-full bg-[#ff8757]' />
                <p className='text-[14px] leading-[20px] tracking-[-0.14px] text-[#26282e]'>
                  {characteristic}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex w-full flex-col gap-3'>
          <button
            onClick={handleStartExploring}
            className='w-full rounded-lg bg-[#26282e] py-4 text-center text-[16px] leading-[22px] font-bold tracking-[-0.16px] text-[#ffffff]'
          >
            맞춤 축제 탐험하기
          </button>
          <button
            onClick={handleBackToHome}
            className='w-full rounded-lg border border-[#d5d7db] bg-[#ffffff] py-4 text-center text-[16px] leading-[22px] font-bold tracking-[-0.16px] text-[#26282e]'
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
