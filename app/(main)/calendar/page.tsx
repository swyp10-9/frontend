import Calendar from '@/components/Calendar/Calendar';

import List from './_modules/list';

export default function CalendarPage() {
  return (
    <div className='flex flex-col gap-5'>
      <Calendar />
      <List />
    </div>
  );
}
