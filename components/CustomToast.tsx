'use client';

import { Icon } from '@iconify/react';
import { toast } from 'sonner';

/**
 * 사용 예시
 * showCustomToast({ message: '북마크에 추가되었습니다.', type: 'success' });
 */

interface CustomToastProps {
  message: string;
  type: 'success' | 'error';
}

export const showCustomToast = ({ message, type }: CustomToastProps) => {
  toast.custom(t => {
    return (
      <div className='flex w-[320px] items-center justify-between rounded-sm bg-gray-600 px-4 py-3 text-white'>
        <div className='flex items-center gap-2'>
          {type === 'success' ? (
            <Icon icon='lets-icons:check-round-fill' fontSize={20} />
          ) : (
            <Icon icon='icon-park-solid:close-one' fontSize={20} />
          )}
          <p className='ui-text-sub-head-2'>{message}</p>
        </div>
        <Icon
          icon='material-symbols:close-rounded'
          fontSize={20}
          onClick={() => toast.dismiss(t)}
        />
      </div>
    );
  });
};
