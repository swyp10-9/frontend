export default function Restaurants() {
  return (
    <div className='space-y-6'>
      <div>
        <h3 className='mb-3 ui-text-sub-head text-black'>주변 맛집</h3>
        <div className='space-y-4'>
          <div className='rounded-lg border border-gray-200 p-3'>
            <h4 className='mb-1 ui-text-sub-head-2 text-black'>
              대구 명물 치킨집
            </h4>
            <p className='mb-2 ui-text-body-2 ui-text-color-info'>
              도보 5분 • 치킨전문
            </p>
            <p className='ui-text-caption ui-text-color-info'>
              대구 달서구 두류동 123-45
            </p>
          </div>
          <div className='rounded-lg border border-gray-200 p-3'>
            <h4 className='mb-1 ui-text-sub-head-2 text-black'>맥주 하우스</h4>
            <p className='mb-2 ui-text-body-2 ui-text-color-info'>
              도보 3분 • 수제맥주
            </p>
            <p className='ui-text-caption ui-text-color-info'>
              대구 달서구 두류동 234-56
            </p>
          </div>
          <div className='rounded-lg border border-gray-200 p-3'>
            <h4 className='mb-1 ui-text-sub-head-2 text-black'>전통 한식당</h4>
            <p className='mb-2 ui-text-body-2 ui-text-color-info'>
              도보 7분 • 한정식
            </p>
            <p className='ui-text-caption ui-text-color-info'>
              대구 달서구 두류동 345-67
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
