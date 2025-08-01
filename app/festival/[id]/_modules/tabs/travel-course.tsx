export default function TravelCourse() {
  return (
    <div className='space-y-6'>
      <div>
        <h3 className='mb-3 ui-text-sub-head text-black'>여행 코스</h3>
        <div className='space-y-4'>
          <div className='rounded-lg bg-gray-50 p-4'>
            <h4 className='mb-2 ui-text-sub-head-2 text-black'>1시간 코스</h4>
            <p className='ui-text-body-2 ui-text-color-info'>
              메인 무대 → 치킨 마켓 → 맥주 존 → 포토존
            </p>
          </div>
          <div className='rounded-lg bg-gray-50 p-4'>
            <h4 className='mb-2 ui-text-sub-head-2 text-black'>2시간 코스</h4>
            <p className='ui-text-body-2 ui-text-color-info'>
              공연 관람 → 체험 프로그램 → 치킨 마켓 → 기념품샵
            </p>
          </div>
          <div className='rounded-lg bg-gray-50 p-4'>
            <h4 className='mb-2 ui-text-sub-head-2 text-black'>가족 코스</h4>
            <p className='ui-text-body-2 ui-text-color-info'>
              키즈 존 → 체험 부스 → 치킨 마켓 → 야간 공연
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
