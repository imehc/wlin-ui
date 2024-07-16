import { type HTMLAttributes } from 'react';
import type { LocaleKeys } from './locale';

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
