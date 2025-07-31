import BackArrowNav from '@/components/nav/nav';
import { Drawer } from '@/components/shadcn/drawer';

import BookmarkList from './_modules/bookmark-list';
import MyPageClient from './_modules/my-page-client';
import MyPageFooter from './_modules/mypage-footer';
import Profile from './_modules/profile';
import ReviewDrawerMenu from './_modules/review-drawer-menu';
import ReviewList from './_modules/review-list';

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

      <Drawer>
        <div className='flex-1 overflow-y-auto'>
          {initialTab === 'bookmark' && <BookmarkList />}
          {initialTab === 'visited' && <ReviewList />}
        </div>

        <MyPageFooter />

        <ReviewDrawerMenu />
      </Drawer>
    </div>
  );
}
