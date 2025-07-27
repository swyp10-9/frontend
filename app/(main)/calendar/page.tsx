import Calendar from '@/components/Calendar/Calendar';
import { Drawer } from '@/components/shadcn/drawer';

import BottomFilter from './_modules/bottom-filter';
import List from './_modules/list';

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ selected: string }>;
}) {
  const { selected } = await searchParams;

  return (
    <div className='flex flex-col gap-5'>
      <Calendar initialDate={new Date(selected)} />
      <Drawer>
        <List selected={selected} />
        <BottomFilter />
      </Drawer>
    </div>
  );
}
