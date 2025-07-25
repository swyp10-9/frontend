import { Icon } from '@iconify/react';

interface FilterChipProps {
  label: string;
  is_selected: boolean;
  onClick?: () => void;
  downChevron?: boolean;
}

export function FilterChip(props: FilterChipProps) {
  const { label, is_selected, onClick, downChevron = false } = props;
  const selectedClassName = 'bg-gray-50 border border-gray-400';
  const unselectedClassName = 'border border-gray-100 text-gray-700';

  return (
    <div
      className={`cursor-pointer flex items-center justify-center px-2 py-1 rounded-full ${is_selected ? selectedClassName : unselectedClassName} w-[60px] h-[25px]`}
      onClick={onClick}
    >
      {downChevron && (
        <Icon
          icon='jam:chevron-down'
          className={`text-gray-${is_selected ? '700' : '400'}`}
          fontSize={16}
        />
      )}
      <p className='text-sub-head-3 whitespace-nowrap'>{label}</p>
    </div>
  );
}

interface SelectedChipProps {
  label: string;
  onClick?: () => void;
}

export function SelectedChip(props: SelectedChipProps) {
  const { label, onClick } = props;

  return (
    <div
      className={`cursor-pointer flex items-center justify-center px-2 py-1 rounded-full bg-gray-50 w-[60px] h-[25px]`}
      onClick={onClick}
    >
      <p className='text-sub-head-3 whitespace-nowrap'>{label}</p>
      <Icon icon='ic:baseline-clear' className='text-gray-700' fontSize={16} />
    </div>
  );
}
