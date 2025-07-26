import type { Metadata } from 'next';
import localFont from 'next/font/local';

import { MSWClientSideProvider } from '@/configs/msw/MSWClientSideProvider';
import { initializeMSWOnServer } from '@/configs/msw/initializeMSWOnServer';

import './globals.css';
import { ReactQueryClientProvider } from './react-query-provider';

if (process.env.NODE_ENV === 'development') {
  initializeMSWOnServer();
}

const pretendard = localFont({
  src: '../assets/fonts/PretendardVariable.woff2',
  weight: '45 920',
  display: 'swap',
  variable: '--font-pretendard', // NOTE: CSS Variable로 노출
});

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
    <MSWClientSideProvider>
      <ReactQueryClientProvider>
        <html lang='ko'>
          <body
            cz-shortcut-listen='true'
            className={`${pretendard.className} flex items-center justify-center overscroll-none`}
          >
            {children}
          </body>
        </html>
      </ReactQueryClientProvider>
    </MSWClientSideProvider>
  );
}
