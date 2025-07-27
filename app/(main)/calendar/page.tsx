import Calendar from '@/components/Calendar/Calendar';

import List from './_modules/list';

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { selected } = await searchParams;

  return (
    <div className='flex flex-col gap-5'>
      <Calendar initialDate={new Date(selected as string)} />
      <List selected={selected as string} />
    </div>
  );
}
