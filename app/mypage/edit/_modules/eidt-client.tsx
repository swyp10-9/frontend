'use client';

import { useState } from 'react';

import { Icon } from '@iconify/react';

import BackArrowNav from '@/components/nav/nav';

import SaveButton from './save-button';

export default function EditClient() {
  const [nickname, setNickname] = useState('');

  const handleClear = () => {
    setNickname('');
  };

  const handleSave = () => {
    console.log('save');
  };

  return (
    <div>
      <BackArrowNav rightExpand={<SaveButton onClick={handleSave} />} />
      <div className='mt-5 flex flex-col gap-5'>
        <p className='ui-text-head-2'>사용자 이름 변경</p>
        <div className='flex flex-col items-end gap-2'>
          <div className='relative w-full'>
            <input
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              placeholder='닉네임을 입력해주세요.'
              className='h-12 w-full rounded-xl border border-gray-100 px-4 py-3 text-black placeholder:text-gray-200 focus:border-gray-300 focus:outline-none'
              maxLength={20}
            />
            {!!nickname && (
              <Icon
                icon='pajamas:clear'
                fontSize={24}
                className='absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 transform cursor-pointer rounded-full bg-white text-gray-200'
                onClick={handleClear}
              />
            )}
          </div>
          <div className='text-sm text-gray-200'>
            <span
              className={`${nickname.length > 0 ? 'text-black' : 'text-gray-200'}`}
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
