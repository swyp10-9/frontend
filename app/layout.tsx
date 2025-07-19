import type { Metadata } from 'next';

import './globals.css';
import { ReactQueryClientProvider } from './react-query-provider';

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
    <ReactQueryClientProvider>
      <html lang='ko'>
        <body
          cz-shortcut-listen='true'
          className='flex items-center justify-center'
        >
          {children}
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
