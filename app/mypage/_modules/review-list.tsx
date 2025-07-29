import ReviewItem from './review-item';

export default function ReviewList() {
  return (
    <div className='flex flex-col gap-5 overflow-y-auto py-5'>
      {Array.from({ length: 20 }).map((_, index) => (
        <ReviewItem
          key={index}
          image='https://picsum.photos/200/300'
          title='홍길동'
          date='2025.01.01'
          content='홍길동은 홍길동입니다.'
        />
      ))}
    </div>
  );
}
