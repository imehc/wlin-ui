import { useCallback, useMemo, useState, type FC } from 'react';
import type { CalendarProps } from './calendar';
import { MonthCalendar } from './MonthCalendar';
import { Header } from './Header';
import LocaleContext from './LocaleContext';
import type { LocaleKeys } from './locale';
import { addMonths, subMonths } from 'date-fns';
export type { CalendarProps } from './calendar';

export const Calendar: FC<CalendarProps> = (props) => {
  const [curValue, setCurValue] = useState(props.value);
  const [curMonth, setCurMonth] = useState(props.value);

  const changeDate = useCallback(
    (date?: Date) => {
      date = date instanceof Date ? (date as Date) : new Date();
      setCurValue(date);
      setCurMonth(date);
      props.onChange?.(date);
    },
    [props.onChange]
  );

  const local = useMemo(
    () => ({
      locale: props.locale || (navigator.language as LocaleKeys),
    }),
    [props.locale]
  );

  return (
    <LocaleContext.Provider value={local}>
      <div w="full" className={props.className} style={props.style}>
        <Header
          date={curMonth}
          onClickPrev={() => setCurMonth(subMonths(curMonth, 1))}
          onClickNext={() => setCurMonth(addMonths(curMonth, 1))}
          onClickToday={changeDate}
        />
        <MonthCalendar
          {...props}
          value={curValue}
          onSelect={changeDate}
          curMonth={curMonth}
        />
      </div>
    </LocaleContext.Provider>
  );
};
