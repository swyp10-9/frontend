import FestivalListView from '@/components/festival-list-view';
import { FilterChip } from '@/components/filter-chip';

export default function List() {
  return (
    <div className='flex flex-col gap-5'>
      <div className='flex items-center gap-1'>
        <FilterChip label='내 주변' is_selected={false} />
        <FilterChip label='필터' is_selected={false} downChevron />
      </div>
      <div className='flex items-center gap-2'>
        <p className='ui-text-head-2'>23개의 축제</p>
        <p className='ui-text-body'>7월 10일</p>
      </div>
      <div className='flex w-full flex-col gap-10'>
        <FestivalListView
          image='https://picsum.photos/200/300'
          theme='culture_art'
          title='축제 제목'
          loc='서울'
          start_date='2025-07-10'
          end_date='2025-07-10'
          is_marked={false}
        />
        <FestivalListView
          image='https://picsum.photos/200/300'
          theme='culture_art'
          title='축제 제목'
          loc='서울'
          start_date='2025-07-10'
          end_date='2025-07-10'
          is_marked={false}
        />
        <FestivalListView
          image='https://picsum.photos/200/300'
          theme='culture_art'
          title='축제 제목'
          loc='서울'
          start_date='2025-07-10'
          end_date='2025-07-10'
          is_marked={false}
        />
        <FestivalListView
          image='https://picsum.photos/200/300'
          theme='culture_art'
          title='축제 제목'
          loc='서울'
          start_date='2025-07-10'
          end_date='2025-07-10'
          is_marked={false}
        />
        <FestivalListView
          image='https://picsum.photos/200/300'
          theme='culture_art'
          title='축제 제목'
          loc='서울'
          start_date='2025-07-10'
          end_date='2025-07-10'
          is_marked={false}
        />
        <FestivalListView
          image='https://picsum.photos/200/300'
          theme='culture_art'
          title='축제 제목'
          loc='서울'
          start_date='2025-07-10'
          end_date='2025-07-10'
          is_marked={false}
        />
      </div>
    </div>
  );
}
