import zhCN from './zh-CN';
import enUS from './en-US';

const allLocales = {
  'zh-CN': zhCN,
  'en-US': enUS,
} as const;

export type LocaleKeys = keyof typeof allLocales;

export default allLocales;
