import { type CalendarProps } from './calendar';

export interface MonthCalendarProps extends CalendarProps {
  onSelect?(date: Date): void;
  curMonth: Date;
}
