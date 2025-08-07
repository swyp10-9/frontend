'use client';

import { useEffect, useRef, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/Button';
import BottomSheet, { BottomSheetRef } from '@/components/bottom-sheet';
import FilterSection from '@/components/filter-section';
import themeList from '@/constants/themeList';
import { withWhomList } from '@/constants/withWhomList';

interface MapBottomFilterProps {
  initialParams: {
    period: string;
    status: string;
    withWhom: string;
    theme: string;
  };
}
export default function MapBottomFilter({
  initialParams,
}: MapBottomFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bottomSheetRef = useRef<BottomSheetRef>(null);

  const [period, setPeriod] = useState<string | null>(
    initialParams?.period || null,
  );
  const [status, setStatus] = useState<string | null>(
    initialParams?.status || null,
  );
  const [withWhom, setWithWhom] = useState<string | null>(
    initialParams?.withWhom || null,
  );
  const [theme, setTheme] = useState<string | null>(
    initialParams?.theme || null,
  );

  useEffect(() => {
    const currentPeriod = searchParams.get('period');
    const currentStatus = searchParams.get('status');
    const currentWithWhom = searchParams.get('withWhom');
    const currentTheme = searchParams.get('theme');

    setPeriod(currentPeriod);
    setStatus(currentStatus);
    setWithWhom(currentWithWhom);
    setTheme(currentTheme);
  }, [searchParams]);

  const handleReset = () => {
    // 상태 초기화
    setPeriod(null);
    setStatus(null);
    setWithWhom(null);
    setTheme(null);

    // 쿼리 파라미터에서 필터 관련 파라미터 제거
    const params = new URLSearchParams(searchParams);
    params.delete('period');
    params.delete('status');
    params.delete('withWhom');
    params.delete('theme');

    // 페이지를 새로고침하여 쿼리 파라미터 적용
    router.replace(`?${params.toString()}`);

    // drawer 닫기
    bottomSheetRef.current?.close();
  };

  const handleApply = () => {
    const params = new URLSearchParams(searchParams);

    // 필터 값들을 쿼리 파라미터로 업데이트
    if (period) {
      params.set('period', period);
    } else {
      params.delete('period');
    }
    if (status) {
      params.set('status', status);
    } else {
      params.delete('status');
    }

    if (withWhom) {
      params.set('withWhom', withWhom);
    } else {
      params.delete('withWhom');
    }

    if (theme) {
      params.set('theme', theme);
    } else {
      params.delete('theme');
    }

    // 페이지를 새로고침하여 쿼리 파라미터 적용
    router.replace(`?${params.toString()}`);

    // drawer 닫기
    bottomSheetRef.current?.close();
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      title={'필터'}
      footerChildren={
        <div className='flex items-center gap-2'>
          <Button onClick={handleReset} size='lg' variant='secondary'>
            초기화
          </Button>
          <Button onClick={handleApply} size='lg' variant='primary'>
            적용하기
          </Button>
        </div>
      }
    >
      <div className='flex flex-col items-center justify-center px-4'>
        <div className='my-4 flex w-full max-w-[600px] flex-col justify-center gap-5'>
          <FilterSection
            label={'축제 진행 여부'}
            list={[
              { type: 'ongoing', label: '진행 중' },
              { type: 'upcoming', label: '예정' },
            ]}
            value={status}
            setValue={setStatus}
          />
          <FilterSection
            label={'기간'}
            list={[
              { type: 'this_week', label: '이번 주' },
              { type: 'this_month', label: '이번 달' },
              { type: 'next_month', label: '다음 달' },
            ]}
            value={period}
            setValue={setPeriod}
          />
          <FilterSection
            label={'누구랑'}
            list={withWhomList}
            value={withWhom}
            setValue={setWithWhom}
          />
          <FilterSection
            label={'테마'}
            list={themeList}
            value={theme}
            setValue={setTheme}
          />
        </div>
      </div>
    </BottomSheet>
  );
}
