'use client';

import { useState } from 'react';

import { Icon } from '@iconify/react';

import { dialogClear, dialogOpen } from '@/components/Dialog';
import BackArrowNav from '@/components/nav/nav';

import SaveButton from './save-button';

export default function EditClient() {
  const [nickname, setNickname] = useState('');

  const handleSave = () => {
    try {
      if (!nickname?.trim()) {
        // 닉네임이 비어있으면 저장하지 않음
        console.warn('Nickname is empty');
        return;
      }

      dialogOpen({
        title: '닉네임 변경',
        type: 'alert',
        onClose: () => {
          console.log('취소됨');
        },
        onApply: () => {
          try {
            console.log('저장 완료:', nickname);
            // 여기에 실제 저장 로직 추가
            // alert('닉네임이 성공적으로 변경되었습니다.');
            dialogOpen({
              title: '확인',
              onApply: () => {
                dialogClear();
              },
            });
          } catch (error) {
            console.error('Failed to save nickname:', error);
            alert('저장 중 오류가 발생했습니다.');
          }
        },
      });
    } catch (error) {
      console.error('Failed to open save dialog:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e?.target?.value;
    if (value !== undefined) {
      setNickname(value);
    }
  };

  return (
    <div>
      <BackArrowNav rightExpand={<SaveButton onClick={handleSave} />} />
      <div className='mt-5 flex flex-col gap-5'>
        <p className='ui-text-head-2'>사용자 이름 변경</p>
        <div className='flex flex-col items-end gap-2'>
          <div className='relative w-full'>
            <input
              value={nickname || ''}
              onChange={handleInputChange}
              placeholder='닉네임을 입력해주세요.'
              className='h-12 w-full rounded-xl border border-gray-100 px-4 py-3 text-black placeholder:text-gray-200 focus:border-gray-300 focus:outline-none'
              maxLength={20}
            />
            {!!nickname && (
              <Icon
                icon='pajamas:clear'
                fontSize={24}
                className='absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 transform cursor-pointer rounded-full bg-white text-gray-200'
                onClick={() => setNickname('')}
              />
            )}
          </div>
          <div className='text-sm text-gray-200'>
            <span
              className={`${(nickname?.length || 0) > 0 ? 'text-black' : 'text-gray-200'}`}
            >
              {nickname?.length || 0}
            </span>
            /20
          </div>
        </div>
      </div>
    </div>
  );
}
