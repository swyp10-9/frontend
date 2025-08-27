import Image from 'next/image';

export default function HeaderImage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className='relative w-full'>
      <Image
        src={'https://picsum.photos/1000/1000'}
        alt='header-image'
        className='h-full w-full object-cover'
        style={{
          aspectRatio: '16/9',
        }}
        width={1000}
        height={200}
      />
      <div className='absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50'>
        <p
          className='text-center ui-text-head-2 whitespace-pre text-white'
          style={{
            lineHeight: '32px',
          }}
        >
          {title}
        </p>
        <p
          className='text-center ui-text-body-2 whitespace-pre text-white'
          style={{
            lineHeight: '22px',
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
