import React, { type FC, useContext } from 'react';
import {
  addDays,
  format,
  getDay,
  getMonth,
  isEqual,
  startOfMonth,
  subDays,
} from 'date-fns';
import clsx from 'clsx';
import LocaleContext from './LocaleContext';
import allLocales from './locale';
import { CalendarProps } from '.';

const weekList = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

/**
 * 获取给定日期所在月份的所有日期信息。
 *
 * 此函数返回一个数组，其中包含从给定日期的月份的第一天开始的所有日期，以及每个日期是否为当前月份的标志。
 * 它首先计算出给定月份的总天数和该月第一天是星期几，然后填充一个包含所有日期信息的数组。
 * 数组的结构为每个元素包含一个日期对象和一个布尔值，表示该日期是否为当前月份。
 *
 * @param date 一个Date对象，表示要获取所有日期的月份。
 * @returns 返回一个数组，每个元素包含一个Date对象和一个布尔值，表示日期和是否当前月份。
 */
const getAllDays = (date: Date) => {
  // 获取给定月份的总天数
  // const totalDays = getDaysInMonth(date);
  // 获取给定日期所在月份的第一天
  const startDate = startOfMonth(date);
  // 获取月份第一天是星期几（0表示星期日）
  const dayOfWeek = getDay(startDate);

  // 定义日期信息类型
  type DayInfo = {
    date: Date;
    currentMonth: boolean;
  };

  // 初始化一个数组，用于存储所有日期信息，数组长度为42，即6周
  const daysInfo = new Array<DayInfo>(6 * 7);

  // 填充数组前面的非当前月份日期
  for (let i = 0; i < dayOfWeek; i++) {
    // 计算上个月的日期，通过从当月第一天减去天数差（dayOfWeek - i），确保得到的是正确的上个月日期
    const adjustedDate = subDays(startDate, dayOfWeek - i);
    // 将计算出的日期和当前月份标识存入数组中对应位置
    daysInfo[i] = {
      date: adjustedDate,
      // 标记此日期不属于当前月份
      currentMonth: false,
    };
  }

  // 填充数组中的当前月份日期
  for (let i = dayOfWeek; i < daysInfo.length; i++) {
    // 计算当前月份的日期，通过在当月第一天基础上加上天数差（i - dayOfWeek）
    const adjustedDate = addDays(startDate, i - dayOfWeek);
    // 将计算出的日期和当前月份标识存入数组中对应位置
    daysInfo[i] = {
      date: adjustedDate,
      // 检查计算出的日期是否属于当前月份，通过比较其月份与给定日期的月份是否相等
      currentMonth: getMonth(adjustedDate) === getMonth(date),
    };
  }
  // 返回所有日期信息数组
  return daysInfo;
};

export interface MonthCalendarProps extends CalendarProps {
  onSelect?(date: Date): void;
  curMonth: Date;
}

export const MonthCalendar: FC<MonthCalendarProps> = ({
  value,
  dateRender,
  dateInnerContent,
  onSelect,
  curMonth,
}) => {
  const allDays = getAllDays(curMonth);
  const localeContext = useContext(LocaleContext);
  const CalendarLocale = allLocales[localeContext.locale];

  const renderDays = (days: typeof allDays) => {
    const rows: React.ReactNode[] = [];
    for (let i = 0; i < 6; i++) {
      const row: React.ReactNode[] = [];
      for (let j = 0; j < 7; j++) {
        const item = days[i * 7 + j];
        row[j] = (
          <div
            key={j}
            className={clsx('flex-1 overflow-hidden border border-solid border-[#eee]', [
              item.currentMonth ? 'text-[#000]' : 'text-[#ccc]',
            ])}
            onClick={() => onSelect?.(item.date)}
          >
            {dateRender ? (
              dateRender(item.date)
            ) : (
              <div className="p-2">
                <div
                  className={clsx({
                    'bg-blue-500 w-7 h-7 leading-7 text-center text-white rounded-full cursor-pointer':
                      isEqual(
                        format(value, 'yyyy-MM-dd'),
                        format(item.date, 'yyyy-MM-dd')
                      ),
                  })}
                >
                  {item.date.getDate()}
                </div>
                <div>{dateInnerContent?.(item.date)}</div>
              </div>
            )}
          </div>
        );
      }
      rows.push(row);
    }

    return rows.map((row, i) => (
      <div key={i} className="flex h-25">
        {row}
      </div>
    ));
  };

  return (
    <div className="w-full">
      <header className="flex p-0 w-full box-border border border-solid border-[#ccc]">
        {weekList.map((week) => (
          <div key={week} className="py-5 px-4 flex-1 text-left text-[#7d7d7f]">
            {CalendarLocale.week[week]}
          </div>
        ))}
      </header>
      <main>{renderDays(allDays)}</main>
    </div>
  );
};

