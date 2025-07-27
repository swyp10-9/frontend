'use client';

import { useState } from 'react';

import BottomSheet from '@/components/bottom-sheet';
import themeList from '@/constants/themeList';

export default function BottomFilter() {
  const [region, setRegion] = useState<string | null>(null);
  const [withWhom, setWithWhom] = useState<string | null>(null);
  const [theme, setTheme] = useState<string | null>(null);

  return (
    <BottomSheet
      title={'필터'}
      onReset={() => {
        console.log('초기화');
      }}
      onApply={() => {
        console.log('적용하기');
      }}
      resetText='초기화'
      applyText='적용하기'
    >
      <div className='flex flex-col items-center justify-center px-4'>
        <div className='my-4 flex w-full max-w-[600px] flex-col justify-center gap-5'>
          <FilterSection
            label={'지역'}
            list={locationList}
            value={region}
            setValue={setRegion}
          />
          <FilterSection
            label={'누구랑'}
            list={whoList}
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

function FilterSection({
  label,
  list,
  value,
  setValue,
}: {
  label: string;
  list: { type: string; label: string }[];
  value: string | null;
  setValue: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  function FilterItem({
    itemLabel,
    onclick,
    checked,
  }: {
    itemLabel: string;
    onclick: () => void;
    checked: boolean;
  }) {
    return (
      <div
        className={`flex h-[36px] w-[76px] items-center justify-center rounded-lg ${checked ? 'border border-gray-400 bg-gray-50' : 'border border-gray-100'} cursor-pointer`}
        onClick={onclick}
      >
        {itemLabel}
      </div>
    );
  }
  return (
    <div className='flex flex-col gap-2'>
      <p className='ui-text-sub-head'>{label}</p>
      <div className='flex flex-wrap gap-x-1 gap-y-2'>
        {list.map(item => {
          return (
            <FilterItem
              checked={value === item.type}
              itemLabel={item.label}
              key={item.type}
              onclick={() => {
                setValue(item.type);
              }}
            />
          );
        })}
        <FilterItem
          checked={value === null}
          itemLabel={'전체'}
          onclick={() => {
            setValue(null);
          }}
        />
      </div>
    </div>
  );
}

const locationList = [
  { type: 'seoul', label: '서울' },
  { type: 'gyeonggi', label: '경기' },
  { type: 'gangwon', label: '강원' },
  { type: 'chungcheong', label: '충청' },
  { type: 'jeolla', label: '전라' },
  { type: 'gyeongsang', label: '경상' },
  { type: 'jeju', label: '제주' },
];
const whoList = [
  { type: 'family', label: '가족' },
  { type: 'couple', label: '커플' },
  { type: 'parents', label: '부모님' },
  { type: 'pet', label: '반려견' },
  { type: 'friend', label: '친구' },
];
