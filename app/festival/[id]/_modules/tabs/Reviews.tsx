export default function Reviews() {
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='ui-text-sub-head text-black'>리뷰 (24)</h3>
        <div className='flex items-center gap-1'>
          <span className='text-yellow-500'>★</span>
          <span className='ui-text-body-2 text-black'>4.5</span>
        </div>
      </div>

      <div className='space-y-4'>
        {[1, 2, 3, 4, 5, 6, 7, 8].map(review => (
          <div key={review} className='border-b border-gray-100 pb-4'>
            <div className='mb-2 flex items-center gap-2'>
              <div className='h-8 w-8 rounded-full bg-gray-200'></div>
              <div>
                <p className='ui-text-caption font-medium text-black'>
                  사용자{review}
                </p>
                <div className='flex items-center gap-1'>
                  <span className='text-[12px] text-yellow-500'>★★★★★</span>
                </div>
              </div>
            </div>
            <p className='ui-text-body-2 ui-text-color-sub'>
              치킨과 맥주의 조합이 정말 환상적이었어요. 축제 분위기도 좋고
              다양한 체험 프로그램도 즐거웠습니다.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
