import BackArrowNav from '@/components/nav/nav';
import { Drawer } from '@/components/shadcn/drawer';

import BookmarkList from './_modules/bookmark-list';
import MyPageClient from './_modules/my-page-client';
import MyPageFooter from './_modules/mypage-footer';
import Profile from './_modules/profile';
import ReviewList from './_modules/review-list';
import ReviewMenu from './_modules/review-menu';

interface SearchParamsType {
  tab?: string;
}

export default async function MyPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsType>;
}) {
  const params = await searchParams;
  const initialTab =
    params.tab && ['bookmark', 'visited'].includes(params.tab)
      ? params.tab
      : 'bookmark';

  return (
    <div className='relative flex h-screen w-full flex-col'>
      <div className='fixedArea sticky top-0 flex w-full flex-col gap-2'>
        <BackArrowNav />
        <Profile />
        <MyPageClient initialTab={initialTab} />
      </div>

      <div className='flex-1 overflow-y-auto'>
        {initialTab === 'bookmark' && <BookmarkList />}
        <Drawer>
          {initialTab === 'visited' && <ReviewList />}
          <ReviewMenu />
        </Drawer>
      </div>

      <MyPageFooter />
    </div>
  );
}
