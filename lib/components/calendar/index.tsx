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

/**
 * 日历组件。
 *
 * 该组件提供了一个基本的日历视图，允许用户选择日期，并通过props传递回调函数以处理日期选择事件。
 *
 * @param {CalendarProps props} - 组件属性，包括当前选中的日期、更改日期的回调函数、日历的语言设置等。
 * @returns 返回日历组件的React元素。
 */
export const Calendar: FC<CalendarProps> = (props) => {
  /**
   * 当前选中的日期状态。
   */
  const [curValue, setCurValue] = useState(props.value);
  /**
   * 当前显示的月份状态。
   */
  const [curMonth, setCurMonth] = useState(props.value);

  /**
   * 处理日期更改的函数。
   *
   * 如果传入了日期对象，则使用该对象更新当前选中和显示的日期；
   * 否则，创建一个新的日期对象代表当前时间。
   * 并通过props上的onChange回调函数通知父组件日期已被更改。
   *
   * @param date - 可选参数，代表要更改的日期。
   */
  const changeDate = useCallback(
    (date?: Date) => {
      date = date instanceof Date ? (date as Date) : new Date();
      setCurValue(date);
      setCurMonth(date);
      props.onChange?.(date);
    },
    [props.onChange]
  );

  /**
   * 计算并缓存当前的日语环境设置。
   *
   * 如果props中指定了语言环境，则使用该语言；
   * 否则，使用浏览器默认的语言环境。
   */
  const local = useMemo(
    () => ({
      locale: props.locale || (navigator.language as LocaleKeys),
    }),
    [props.locale]
  );

  /**
   * 返回日历组件的渲染结果。
   *
   * 在LocaleContext中提供当前的语言环境设置，以供子组件使用。
   * 显示日历的头部和主体部分，头部允许用户切换月份和选择今天；
   * 主体部分显示当前月份的日期，并允许用户选择日期。
   */
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
