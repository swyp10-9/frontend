import { Icon } from '@iconify/react';

interface Restaurant {
  id: number;
  name: string;
  address: string;
  imageUrl: string;
}

const mockRestaurants: Restaurant[] = [
  {
    id: 1,
    name: '수원왕갈비',
    address: '대구광역시 달서구 공원순환로 36 (두류동) 두류공원',
    imageUrl: 'https://picsum.photos/118/118?random=1',
  },
  {
    id: 2,
    name: '두류파크 맛집',
    address: '대구광역시 달서구 두류동 123-45',
    imageUrl: 'https://picsum.photos/118/118?random=2',
  },
  {
    id: 3,
    name: '달서구 전통맛집',
    address: '대구광역시 달서구 성서동 456-78',
    imageUrl: 'https://picsum.photos/118/118?random=3',
  },
  {
    id: 4,
    name: '대구명물 치킨',
    address: '대구광역시 달서구 이곡동 789-12',
    imageUrl: 'https://picsum.photos/118/118?random=4',
  },
  {
    id: 5,
    name: '할매순대국',
    address: '대구광역시 달서구 월성동 234-56',
    imageUrl: 'https://picsum.photos/118/118?random=5',
  },
  {
    id: 6,
    name: '청춘떡볶이',
    address: '대구광역시 달서구 감삼동 345-67',
    imageUrl: 'https://picsum.photos/118/118?random=6',
  },
  {
    id: 7,
    name: '옛날국밥',
    address: '대구광역시 달서구 상인동 456-78',
    imageUrl: 'https://picsum.photos/118/118?random=7',
  },
  {
    id: 8,
    name: '진미곱창',
    address: '대구광역시 달서구 용산동 567-89',
    imageUrl: 'https://picsum.photos/118/118?random=8',
  },
  {
    id: 9,
    name: '바다횟집',
    address: '대구광역시 달서구 본리동 678-90',
    imageUrl: 'https://picsum.photos/118/118?random=9',
  },
  {
    id: 10,
    name: '맛있는 피자',
    address: '대구광역시 달서구 송현동 789-01',
    imageUrl: 'https://picsum.photos/118/118?random=10',
  },
];

function RestaurantItem({ restaurant }: { restaurant: Restaurant }) {
  return (
    <div className='flex flex-row items-center justify-start gap-3 bg-white'>
      <div className='flex flex-1 flex-col items-start justify-start gap-2 px-2 py-0'>
        <div className='flex flex-row items-center justify-start gap-1'>
          <h4 className='text-[16px] leading-[22px] font-bold tracking-[-0.16px] text-black'>
            {restaurant.name}
          </h4>
        </div>

        <div className='flex w-full flex-col items-end justify-start gap-1'>
          <div className='flex h-9 w-full flex-row items-start justify-start gap-2'>
            <div className='flex flex-row items-center justify-start gap-2.5 p-[2px]'>
              <div className='flex h-4 w-4 items-center justify-center'>
                <Icon
                  icon='mdi:location'
                  fontSize={20}
                  className='text-gray-200'
                />
              </div>
            </div>
            <div className='flex-1 text-[12px] leading-[18px] font-semibold tracking-[-0.12px] text-[#5e6573]'>
              {restaurant.address}
            </div>
          </div>
        </div>
      </div>

      <div
        className='h-[118px] w-[118px] shrink-0 rounded bg-gray-300 bg-cover bg-center'
        style={{ backgroundImage: `url('${restaurant.imageUrl}')` }}
      />
    </div>
  );
}

export default function Restaurants() {
  return (
    <div className='flex flex-col items-start justify-start gap-5'>
      {mockRestaurants.map((restaurant, index) => (
        <div key={restaurant.id}>
          <RestaurantItem restaurant={restaurant} />
          {index < mockRestaurants.length - 1 && (
            <div className='relative mt-5 h-0 w-full'>
              <div className='absolute top-0 right-0 left-0 h-[1px] bg-[#f1f2f4]' />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
