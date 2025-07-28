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
      className={`flex cursor-pointer items-center justify-center rounded-full px-2 py-1 ${is_selected ? selectedClassName : unselectedClassName} h-[25px] w-[60px]`}
      onClick={onClick}
    >
      {downChevron && (
        <Icon
          icon='jam:chevron-down'
          className={`text-gray-${is_selected ? '700' : '400'}`}
          fontSize={16}
        />
      )}
      <p className='ui-text-sub-head-3 whitespace-nowrap'>{label}</p>
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
      className={`flex h-[25px] min-w-[60px] cursor-pointer items-center justify-center rounded-full bg-gray-50 px-2 py-1`}
      onClick={onClick}
    >
      <p className='ui-text-sub-head-3 whitespace-nowrap'>{label}</p>
      <Icon icon='ic:baseline-clear' className='text-gray-700' fontSize={16} />
    </div>
  );
}
