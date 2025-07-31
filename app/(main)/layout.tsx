import { Nav } from '@/components/nav';
import TabBar from '@/layouts/tab-bar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='relative box-border flex h-screen w-full max-w-[600px] flex-col px-5'>
      <div className='sticky top-0 flex w-full flex-col'>
        <Nav />
      </div>

      <div className='flex-1 overflow-y-auto'>{children}</div>

      <TabBar />
    </div>
  );
}
