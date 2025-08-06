import { Icon } from '@iconify/react';

import type { SearchInputProps } from './types';

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className='px-5'>
      <div className='box-border flex h-10 w-full flex-row content-stretch items-center justify-start gap-1 rounded-[100px] bg-[#f1f2f4] px-4 py-2'>
        <Icon icon='lucide:search' className='h-5 w-5 text-[#5e6573]' />
        <input
          type='text'
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder='축제 이름을 입력해주세요.'
          className="flex-1 bg-transparent font-['Pretendard'] text-[14px] leading-[20px] font-medium tracking-[-0.14px] text-[#5e6573] outline-none"
        />
      </div>
    </div>
  );
}
