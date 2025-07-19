import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: '축지법',
  description: '여행 축제를 소개합니다',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      <body
        cz-shortcut-listen='true'
        className='flex items-center justify-center'
      >
        {children}
      </body>
    </html>
  );
}
