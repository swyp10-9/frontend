import { Icon } from '@iconify/react';

import type { SearchInputProps } from './types';

export function SearchInput({
  value,
  onChange,
  onClear,
  onSubmit,
}: SearchInputProps) {
  const handleClear = () => {
    onChange('');
    onClear?.();
  };

  return (
    <div className='px-5'>
      <form onSubmit={onSubmit}>
        <div className='box-border flex h-10 w-full flex-row content-stretch items-center justify-start gap-1 rounded-[100px] bg-[#f1f2f4] py-2 pr-3 pl-4'>
          <Icon icon='lucide:search' className='h-5 w-5 text-[#5e6573]' />
          <div className='box-border flex min-h-px min-w-px flex-1 flex-row content-stretch items-center justify-start gap-1 p-0'>
            <input
              type='text'
              value={value}
              onChange={e => onChange(e.target.value)}
              placeholder='축제 이름을 입력해주세요.'
              className="flex-1 bg-transparent font-['Pretendard'] text-[14px] leading-[20px] font-medium tracking-[-0.14px] text-[#090a0c] outline-none placeholder:text-[#5e6573]"
            />
            {value && (
              <button
                onClick={handleClear}
                className='relative flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center overflow-clip'
              >
                <Icon
                  icon='ep:circle-close-filled'
                  className='h-4 w-4 text-[#868c98]'
                />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
