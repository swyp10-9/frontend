import BookmarkItem from '@/components/festival-list-view';

export default function BookmarkList() {
  return (
    <div className='flex flex-col gap-5 overflow-y-auto py-5'>
      {Array.from({ length: 20 }).map((_, index) => (
        <BookmarkItem
          key={index}
          image={'https://picsum.photos/200/300'}
          theme='music_performance'
          title='북마크'
          loc='서울'
          end_date='2025.01.01'
          start_date='2025.01.01'
          is_marked={true}
        />
      ))}
    </div>
  );
}
