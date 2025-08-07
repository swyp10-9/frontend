'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

// 설문 질문 데이터 타입
interface Question {
  id: number;
  title: string;
  subtitle: string;
  options: {
    id: string;
    title: string;
    subtitle: string;
  }[];
}

// 설문 질문 데이터
const surveyQuestions: Question[] = [
  {
    id: 1,
    title: '어떤 축제를 찾고 계신가요?',
    subtitle: '가장 관심 있는 축제 유형을 선택해주세요',
    options: [
      {
        id: '1-1',
        title: '활기차고 사교적인 축제',
        subtitle: '에너지 넘치는 분위기와 많은 사람들과 함께',
      },
      {
        id: '1-2',
        title: '계획적이고 신중한 축제',
        subtitle: '완벽한 경험을 설계하고 기록하는',
      },
      {
        id: '1-3',
        title: '문화적이고 깊이 있는 축제',
        subtitle: '전통과 역사를 배우고 감상하는',
      },
      {
        id: '1-4',
        title: '친구들과 즐기는 축제',
        subtitle: '소중한 사람들과 추억을 만드는',
      },
      {
        id: '1-5',
        title: '자연스럽고 여유로운 축제',
        subtitle: '힐링과 휴식을 찾는 평화로운',
      },
    ],
  },
  {
    id: 2,
    title: '주말에 가장 하고 싶은 활동은',
    subtitle: '무엇인가요?',
    options: [
      {
        id: '2-1',
        title: '조용하고 품격있는 문화 생활',
        subtitle: '박물관, 갤러리에서 예술을 감상해요',
      },
      {
        id: '2-2',
        title: '라이브 음악 공연 관람',
        subtitle: '생생한 음악과 함께하는 시간',
      },
      {
        id: '2-3',
        title: '친구들과 함께하는 파티',
        subtitle: '즐거운 분위기에서 시간을 보내요',
      },
      {
        id: '2-4',
        title: '가족과 함께하는 여행',
        subtitle: '소중한 사람들과 추억을 만들어요',
      },
    ],
  },
  {
    id: 3,
    title: '어떤 분위기의 축제를 선호하나요?',
    subtitle: '원하는 축제의 분위기를 선택해주세요',
    options: [
      {
        id: '3-1',
        title: '차분하고 고급스러운',
        subtitle: '품격있는 분위기에서 여유롭게',
      },
      {
        id: '3-2',
        title: '활기차고 즐거운',
        subtitle: '에너지 넘치는 분위기에서',
      },
      {
        id: '3-3',
        title: '자연스럽고 편안한',
        subtitle: '힐링되는 분위기에서',
      },
      {
        id: '3-4',
        title: '전통적이고 의미있는',
        subtitle: '문화적 가치를 느낄 수 있는',
      },
    ],
  },
  {
    id: 4,
    title: '어떤 계절의 축제를 선호하나요?',
    subtitle: '가장 좋아하는 계절을 선택해주세요',
    options: [
      {
        id: '4-1',
        title: '봄 축제',
        subtitle: '꽃이 피는 아름다운 봄날',
      },
      {
        id: '4-2',
        title: '여름 축제',
        subtitle: '시원한 바다와 함께하는 여름',
      },
      {
        id: '4-3',
        title: '가을 축제',
        subtitle: '단풍이 아름다운 가을',
      },
      {
        id: '4-4',
        title: '겨울 축제',
        subtitle: '눈이 내리는 마법 같은 겨울',
      },
    ],
  },
  {
    id: 5,
    title: '어떤 지역의 축제를 찾고 계신가요?',
    subtitle: '선호하는 지역을 선택해주세요',
    options: [
      {
        id: '5-1',
        title: '서울 지역',
        subtitle: '도시의 활기찬 분위기',
      },
      {
        id: '5-2',
        title: '부산 지역',
        subtitle: '바다가 있는 푸른 도시',
      },
      {
        id: '5-3',
        title: '제주 지역',
        subtitle: '자연이 아름다운 섬',
      },
      {
        id: '5-4',
        title: '전국 각지',
        subtitle: '다양한 지역의 축제를 경험',
      },
    ],
  },
];

// 진행바 컴포넌트
function ProgressBar({ currentStep }: { currentStep: number }) {
  const progress = (currentStep / 5) * 100;

  return (
    <div className='absolute top-24 left-1/2 h-1 w-80 -translate-x-1/2 overflow-clip rounded-[100px] bg-[#f1f2f4]'>
      <div
        className='h-1 rounded-[100px] bg-[#ff8757] transition-all duration-300 ease-in-out'
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// 선택지 컴포넌트
function ChoiceOption({
  option,
  isSelected,
  onSelect,
}: {
  option: { id: string; title: string; subtitle: string };
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      className={`relative cursor-pointer rounded-lg transition-all duration-200 ${
        isSelected
          ? 'border-[#5e6573] bg-[#f1f2f4]'
          : 'border-[#d5d7db] bg-[#ffffff]'
      } border`}
      onClick={onSelect}
    >
      <div className='flex flex-col items-center justify-center gap-1 px-[105px] py-4 text-center'>
        <div
          className={`relative shrink-0 text-[16px] tracking-[-0.16px] ${
            isSelected
              ? 'font-bold text-[#090a0c]'
              : 'font-medium text-[#26282e]'
          }`}
        >
          <p className='leading-[22px]'>{option.title}</p>
        </div>
        <div
          className={`relative shrink-0 text-[14px] tracking-[-0.14px] ${
            isSelected ? 'text-[#868c98]' : 'text-[#5e6573]'
          }`}
        >
          <p className='leading-[20px]'>{option.subtitle}</p>
        </div>
      </div>
    </div>
  );
}

// 메인 설문 조사 컴포넌트
export function SurveyPageClient() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<number, string>
  >({});

  const currentQuestion = surveyQuestions.find(q => q.id === currentStep);
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === 5;
  const hasSelection = selectedOptions[currentStep];

  const handleOptionSelect = (optionId: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [currentStep]: optionId,
    }));
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (hasSelection) {
      if (isLastStep) {
        // 설문 완료 후 결과 페이지로 이동
        console.log('설문 완료:', selectedOptions);
        const resultData = encodeURIComponent(JSON.stringify(selectedOptions));
        router.push(`/survey-result?data=${resultData}`);
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (!currentQuestion) return null;

  return (
    <div className='relative min-h-screen w-full bg-[#ffffff]'>
      {/* Status Bar */}
      <div className='h-[49.466px] w-full' />

      {/* Top Bar */}
      <div className='relative h-[92px] w-full bg-[#ffffff]'>
        <div className='absolute top-[52px] left-0 box-border flex w-full flex-row items-center justify-start px-3 py-0'>
          <button
            onClick={handleBack}
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

      {/* Progress Bar */}
      <ProgressBar currentStep={currentStep} />

      {/* Question Content */}
      <div className='absolute top-[124px] left-1/2 box-border flex w-80 -translate-x-1/2 flex-col items-start justify-start gap-9 p-0'>
        {/* Progress Text */}
        <div className='relative box-border flex w-80 shrink-0 flex-col items-start justify-start gap-2 p-0'>
          <div className='relative box-border flex w-80 shrink-0 flex-row items-start justify-start p-0 text-left text-[14px] leading-[0] tracking-[-0.14px] not-italic'>
            <div className='relative shrink-0 font-bold text-nowrap text-[#ff8757]'>
              <p className='leading-[1.4]'>{currentStep}</p>
            </div>
            <div className='relative h-5 w-80 shrink-0 font-medium text-[#5e6573]'>
              <p className='leading-[1.4]'>/5</p>
            </div>
          </div>

          {/* Question Title */}
          <div className='relative box-border flex w-full shrink-0 flex-col items-start justify-start gap-1 p-0 text-left leading-[0] not-italic'>
            <div className='relative w-full shrink-0 text-[20px] leading-[28px] font-bold tracking-[-0.2px] text-[#090a0c]'>
              <p className='mb-0 block'>{currentQuestion.title}</p>
            </div>
            <div className='relative w-full shrink-0 text-[14px] font-medium tracking-[-0.14px] text-[#5e6573]'>
              <p className='block leading-[20px]'>{currentQuestion.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className='relative box-border flex w-80 shrink-0 flex-col items-center justify-start gap-3 p-0'>
          {currentQuestion.options.map(option => (
            <ChoiceOption
              key={option.id}
              option={option}
              isSelected={selectedOptions[currentStep] === option.id}
              onSelect={() => handleOptionSelect(option.id)}
            />
          ))}
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className='absolute bottom-0 box-border flex w-full flex-col items-start justify-start gap-2.5 bg-[#ffffff] px-5 pt-4 pb-10'>
        <div className='relative box-border flex w-full shrink-0 flex-row items-start justify-start gap-2 p-0'>
          {/* Previous Button */}
          <button
            onClick={handlePrevious}
            disabled={isFirstStep}
            className={`relative min-h-px min-w-px shrink-0 grow basis-0 rounded-lg ${
              isFirstStep
                ? 'bg-[#f1f2f4] text-[#868c98]'
                : 'border border-[#d5d7db] bg-[#ffffff] text-[#26282e]'
            }`}
          >
            <div className='relative box-border flex w-full flex-row items-center justify-center gap-2.5 overflow-clip px-[105px] py-[17px]'>
              <div className='relative shrink-0 text-center text-[16px] leading-[0] font-bold tracking-[-0.16px] text-nowrap not-italic'>
                <p className='leading-[22px]'>이전 질문</p>
              </div>
            </div>
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={!hasSelection}
            className={`relative box-border flex min-h-px min-w-px shrink-0 grow basis-0 flex-row items-center justify-center gap-2.5 overflow-clip rounded-lg px-[105px] py-[17px] ${
              hasSelection
                ? 'bg-[#26282e] text-[#ffffff]'
                : 'bg-[#f1f2f4] text-[#868c98]'
            }`}
          >
            <div className='relative shrink-0 text-center text-[16px] leading-[0] font-bold tracking-[-0.16px] text-nowrap not-italic'>
              <p className='leading-[22px]'>다음 질문</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
