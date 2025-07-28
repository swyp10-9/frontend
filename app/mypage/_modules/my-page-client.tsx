'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { UiTab, UiTabs } from './tabs';

interface MyPageClientProps {
  initialTab: string;
}

export default function MyPageClient({ initialTab }: MyPageClientProps) {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(initialTab);

  const handleTabChange = (value: string) => {
    setSelectedTab(value);

    // URL 쿼리 파라미터 업데이트
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('tab', value);
    router.replace(`/mypage?${urlParams.toString()}`);
  };

  return (
    <>
      <UiTabs value={selectedTab} onValueChange={handleTabChange}>
        <UiTab label='북마크' value='bookmark' />
        <UiTab label='다녀온 축제' value='visited' />
      </UiTabs>
    </>
  );
}
