import Nav from '@/layouts/nav';
import TabBar from '@/layouts/tab-bar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='relative box-border flex min-h-screen w-full max-w-[600px] flex-col px-5 pb-[90px]'>
      <Nav />
      <div className='flex-1'>{children}</div>
      <TabBar />
    </div>
  );
}
