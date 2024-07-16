import zhCN from './zh-CN';
import enUS from './en-US';

export interface CalendarType {
  formatYear: string;
  formatMonth: string;
  today: string;
  month: {
    January: string;
    February: string;
    March: string;
    April: string;
    May: string;
    June: string;
    July: string;
    August: string;
    September: string;
    October: string;
    November: string;
    December: string;
  } & Record<string, any>;
  week: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  } & Record<string, any>;
}


const allLocales = {
  'zh-CN': zhCN,
  'en-US': enUS,
} as const;

export type LocaleKeys = keyof typeof allLocales;

export default allLocales;
