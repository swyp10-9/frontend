import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "축지법",
  description: "여행 축제를 소개합니다",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  );
}
