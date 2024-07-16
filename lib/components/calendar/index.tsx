import {
  type HTMLAttributes,
  useCallback,
  useMemo,
  useState,
  type FC,
} from 'react';
import { MonthCalendar } from './MonthCalendar';
import { Header } from './Header';
import LocaleContext from './LocaleContext';
import type { LocaleKeys } from './locale';
import { addMonths, subMonths } from 'date-fns';

export interface CalendarProps
  extends Pick<HTMLAttributes<HTMLDivElement>, 'style' | 'className'> {
  value: Date;
  /** 定制日期显示，会完全覆盖日期单元格 */
  dateRender?(currentDate: Date): React.ReactNode;
  /** 定制日期单元格，内容会被添加到单元格内，只在全屏日历模式下生效。 */
  dateInnerContent?(currentDate: Date): React.ReactNode;
  /** 国际化相关 */
  locale?: LocaleKeys;
  onChange?(date: Date): void;
}

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
