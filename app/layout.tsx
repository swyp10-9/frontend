import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Toaster } from 'sonner';

import { DialogProvider } from '@/components/Dialog';
import { MSWClientSideProvider } from '@/configs/msw/MSWClientSideProvider';

import './globals.css';
import { ReactQueryClientProvider } from './react-query-provider';

// NOTE: Next lint 규칙이라 끌 수도 없음
const _ONLY_FOR_LOAD_Pretendard = localFont({
  src: '../assets/fonts/PretendardVariable.woff2',
  weight: '45 920',
  display: 'swap',
  variable: '--font-pretendard', // NOTE: CSS Variable로 노출
});

export const metadata: Metadata = {
  title: '축지법',
  description: '여행 축제를 소개합니다',
  icons: {
    icon: '/image/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MSWClientSideProvider>
      <ReactQueryClientProvider>
        <DialogProvider>
          <html lang='ko'>
            {/* <meta
              http-equiv='Content-Security-Policy'
              content='upgrade-insecure-requests'
            /> */}
            <body
              cz-shortcut-listen='true'
              className='flex items-center justify-center overscroll-none'
            >
              {children}
              <Toaster position='bottom-center' offset={100} />
            </body>
          </html>
        </DialogProvider>
        <ReactQueryDevtools />
      </ReactQueryClientProvider>
    </MSWClientSideProvider>
  );
}
