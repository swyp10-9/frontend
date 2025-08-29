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
        src={'/image/monthly.png'}
        alt='header-image'
        className='h-full w-full object-cover'
        style={{
          aspectRatio: '16/9',
        }}
        width={1000}
        height={200}
      />
      {/* <div className='absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/0'>
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
      </div> */}
      {/* <div
        className='absolute inset-0'
        style={{
          background:
            'linear-gradient(to bottom, #460F00 0%, rgba(70, 15, 0, 0.8) 30%, rgba(70, 15, 0, 0.4) 60%, rgba(70, 15, 0, 0) 100%)',
        }}
      /> */}
    </div>
  );
}
