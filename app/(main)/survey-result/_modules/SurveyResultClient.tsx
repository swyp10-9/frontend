'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

import adventurerImage from '@/assets/images/festival-recommendation/adventurer.png';
import curatorImage from '@/assets/images/festival-recommendation/curator.png';
import energizerImage from '@/assets/images/festival-recommendation/energizer.png';
import healerImage from '@/assets/images/festival-recommendation/healer.png';
import socializerImage from '@/assets/images/festival-recommendation/socializer.png';

// 설문 질문 데이터 (점수 계산용)
const surveyQuestions = [
  {
    id: 1,
    options: [
      {
        id: '1-1',
        scores: {
          전통적: 3,
          조용한: 2,
          활동적: 0,
          사교적: 0,
          현대적: 0,
          계획적: 0,
        },
      },
      {
        id: '1-2',
        scores: {
          현대적: 2,
          사교적: 2,
          활동적: 0,
          전통적: 0,
          조용한: 0,
          계획적: 0,
        },
      },
      {
        id: '1-3',
        scores: {
          현대적: 3,
          활동적: 2,
          사교적: 0,
          전통적: 0,
          조용한: 0,
          계획적: 0,
        },
      },
      {
        id: '1-4',
        scores: {
          조용한: 3,
          계획적: 1,
          활동적: 0,
          사교적: 0,
          전통적: 0,
          현대적: 0,
        },
      },
    ],
  },
  {
    id: 2,
    options: [
      {
        id: '2-1',
        scores: {
          조용한: 3,
          활동적: 0,
          사교적: 0,
          전통적: 0,
          현대적: 0,
          계획적: 0,
        },
      },
      {
        id: '2-2',
        scores: {
          사교적: 2,
          계획적: 2,
          활동적: 0,
          전통적: 0,
          현대적: 0,
          조용한: 0,
        },
      },
      {
        id: '2-3',
        scores: {
          사교적: 1,
          현대적: 2,
          활동적: 0,
          전통적: 0,
          조용한: 0,
          계획적: 0,
        },
      },
      {
        id: '2-4',
        scores: {
          사교적: 3,
          활동적: 1,
          전통적: 0,
          현대적: 0,
          조용한: 0,
          계획적: 0,
        },
      },
    ],
  },
  {
    id: 3,
    options: [
      {
        id: '3-1',
        scores: {
          활동적: 3,
          사교적: 3,
          전통적: 0,
          현대적: 0,
          조용한: 0,
          계획적: 0,
        },
      },
      {
        id: '3-2',
        scores: {
          활동적: 2,
          사교적: 2,
          전통적: 0,
          현대적: 0,
          조용한: 0,
          계획적: 0,
        },
      },
      {
        id: '3-3',
        scores: {
          활동적: 1,
          사교적: 1,
          조용한: 2,
          전통적: 0,
          현대적: 0,
          계획적: 0,
        },
      },
      {
        id: '3-4',
        scores: {
          활동적: 2,
          사교적: 1,
          전통적: 0,
          현대적: 0,
          조용한: 0,
          계획적: 0,
        },
      },
    ],
  },
  {
    id: 4,
    options: [
      {
        id: '4-1',
        scores: {
          활동적: 3,
          사교적: 2,
          전통적: 0,
          현대적: 0,
          조용한: 0,
          계획적: 0,
        },
      },
      {
        id: '4-2',
        scores: {
          활동적: 2,
          계획적: 2,
          사교적: 0,
          전통적: 0,
          현대적: 0,
          조용한: 0,
        },
      },
      {
        id: '4-3',
        scores: {
          조용한: 3,
          활동적: 0,
          사교적: 0,
          전통적: 0,
          현대적: 0,
          계획적: 0,
        },
      },
      {
        id: '4-4',
        scores: {
          조용한: 2,
          계획적: 1,
          활동적: 0,
          사교적: 0,
          전통적: 0,
          현대적: 0,
        },
      },
    ],
  },
  {
    id: 5,
    options: [
      {
        id: '5-1',
        scores: {
          활동적: 1,
          사교적: 0,
          전통적: 0,
          현대적: 0,
          조용한: 0,
          계획적: 0,
        },
      },
      {
        id: '5-2',
        scores: {
          계획적: 2,
          활동적: 0,
          사교적: 0,
          전통적: 0,
          현대적: 0,
          조용한: 0,
        },
      },
      {
        id: '5-3',
        scores: {
          계획적: 3,
          조용한: 1,
          활동적: 0,
          사교적: 0,
          전통적: 0,
          현대적: 0,
        },
      },
      {
        id: '5-4',
        scores: {
          현대적: 1,
          활동적: 0,
          사교적: 0,
          전통적: 0,
          조용한: 0,
          계획적: 0,
        },
      },
    ],
  },
];

// 결과별 이미지 매핑
const resultImages = {
  energizer: energizerImage,
  curator: curatorImage,
  adventurer: adventurerImage,
  socializer: socializerImage,
  healer: healerImage,
};

// 결과 데이터 타입
interface SurveyResult {
  type: string;
  title: string;
  description: string;
  traits: string[];
  longDescription: string;
}

// 결과 데이터
const surveyResults: Record<string, SurveyResult> = {
  energizer: {
    type: 'energizer',
    title: '축제 에너자이저',
    description: '축제장이 당신을 기다려요!',
    traits: ['활기찬', '사교적인', '적극적인'],
    longDescription:
      '활기차고 사교적인 당신은 축제의 중심에서 빛나는 존재입니다. 큰 무대, 많은 사람들, 뜨거운 열기 속에서 진짜 행복을 느끼죠. 당신이 있는 곳이 바로 파티가 시작되는 곳!',
  },
  curator: {
    type: 'curator',
    title: '축제 큐레이터',
    description: '완벽한 축제 경험을 설계하는 당신',
    traits: ['계획적인', '꼼꼼한', '완벽주의'],
    longDescription:
      '꼼꼼하고 계획적인 당신은 완벽한 축제 경험을 설계하는 큐레이터입니다. 모든 세부사항을 놓치지 않고, 의미 있는 문화 경험을 추구하죠. 당신의 축제는 예술 작품처럼 완벽합니다!',
  },
  adventurer: {
    type: 'adventurer',
    title: '문화 탐험가',
    description: '깊이 있는 문화가 당신을 부릅니다',
    traits: ['탐험적인', '호기심 많은', '깊이 있는'],
    longDescription:
      '호기심 많고 탐험적인 당신은 문화의 깊이를 탐구하는 모험가입니다. 전통과 역사의 의미를 찾아 떠나는 여행에서 진정한 보물을 발견하죠. 당신의 축제는 문화의 진수를 담고 있습니다!',
  },
  socializer: {
    type: 'socializer',
    title: '축제 소셜라이저',
    description: '친구들과의 즐거운 시간이 최고!',
    traits: ['사교적인', '친근한', '협력적인'],
    longDescription:
      '사교적이고 친근한 당신은 사람들과의 연결을 중시하는 소셜라이저입니다. 친구들과 함께하는 즐거운 시간, 공유하는 순간들이 가장 소중하죠. 당신의 축제는 따뜻한 인연으로 가득합니다!',
  },
  healer: {
    type: 'healer',
    title: '축제 힐러',
    description: '자연스럽고 여유로운 힐링이 필요해요',
    traits: ['평화로운', '여유로운', '힐링하는'],
    longDescription:
      '평화롭고 여유로운 당신은 자연과 조화를 이루는 힐러입니다. 조용하고 아늑한 분위기에서 진정한 휴식을 찾고, 마음의 평화를 추구하죠. 당신의 축제는 마음을 치유하는 힐링 공간입니다!',
  },
};

// 메인 결과 페이지 컴포넌트
export function SurveyResultClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleBackToHome = () => {
    router.push('/');
  };

  // 설문 데이터를 기반으로 결과 결정
  const getResultFromSurvey = () => {
    try {
      const data = searchParams.get('data');
      if (data) {
        const surveyData = JSON.parse(decodeURIComponent(data));

        // 점수 계산
        const scores = calculateScores(surveyData);

        // 결과 결정 (우선순위 순)
        if (scores.활동적 >= 8 && scores.사교적 >= 6) {
          return surveyResults['energizer'];
        } else if (scores.전통적 >= 3 && scores.조용한 >= 4) {
          return surveyResults['adventurer'];
        } else if (scores.조용한 >= 8 && scores.계획적 >= 2) {
          return surveyResults['curator'];
        } else if (scores.사교적 >= 5) {
          return surveyResults['socializer'];
        } else {
          return surveyResults['healer']; // 기본값
        }
      }
    } catch (error) {
      console.error('설문 데이터 파싱 오류:', error);
    }
    return surveyResults['healer']; // 기본값
  };

  // 점수 계산 함수
  const calculateScores = (surveyData: Record<number, string>) => {
    const scores = {
      활동적: 0,
      사교적: 0,
      전통적: 0,
      현대적: 0,
      조용한: 0,
      계획적: 0,
    };

    // 각 질문의 선택된 답변에 따른 점수 누적
    Object.entries(surveyData).forEach(([questionId, answerId]) => {
      const question = surveyQuestions.find(q => q.id === parseInt(questionId));
      if (question) {
        const selectedOption = question.options.find(
          opt => opt.id === answerId,
        );
        if (selectedOption) {
          Object.entries(selectedOption.scores).forEach(([trait, score]) => {
            scores[trait as keyof typeof scores] += score as number;
          });
        }
      }
    });

    return scores;
  };

  const result = getResultFromSurvey();
  const resultKey = result.type;
  const resultImage =
    resultImages[resultKey as keyof typeof resultImages] || resultImages.healer;

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
      <div className='flex flex-col items-center gap-7 px-5 pb-20'>
        {/* Result Header */}
        <div className='flex flex-col items-center gap-3'>
          <div className='flex w-full flex-col items-center gap-1 text-center'>
            <p className='text-[16px] leading-[22px] font-medium tracking-[-0.16px] text-[#5e6573]'>
              나에게 맞는 축제는
            </p>
            <h1 className='text-[24px] leading-[34px] font-bold tracking-[-0.24px] text-[#090a0c]'>
              {result.title}
            </h1>
          </div>

          {/* Character Traits */}
          <div className='flex flex-row items-center justify-center gap-[5px]'>
            {result.traits.map((trait, index) => (
              <div
                key={index}
                className='flex flex-row items-center justify-center gap-0.5 rounded-[100px] bg-[#f1f2f4] px-2 py-1'
              >
                <span className='text-center text-[14px] leading-[20px] font-semibold tracking-[-0.14px] whitespace-pre text-[#26282e]'>
                  {trait}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Result Image */}
        <div className='h-[300px] w-[214px] bg-cover bg-center bg-no-repeat'>
          <Image
            src={resultImage}
            alt={result.title}
            width={214}
            height={300}
            className='h-full w-full object-cover'
            priority
          />
        </div>

        {/* Result Description */}
        <div className='flex w-full flex-col items-start gap-2 text-center'>
          <h2 className='w-full text-[16px] leading-[22px] font-bold tracking-[-0.16px] text-[#090a0c]'>
            {result.description}
          </h2>
          <p className='w-full text-[14px] leading-[20px] font-medium tracking-[-0.14px] text-[#26282e]'>
            {result.longDescription}
          </p>
        </div>
      </div>
    </div>
  );
}
