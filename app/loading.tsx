import Image from 'next/image';

export default function Loading() {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <Image
        src='/image/loading_gray.gif'
        alt='loading'
        width={60}
        height={60}
      />
      <p className='ui-text-head-2'>정보를 불러오고 있어요.</p>
      <p className='ui-text-body text-gray-400'>잠시만 기다려 주세요.</p>
    </div>
  );
}
