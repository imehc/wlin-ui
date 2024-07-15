import { createContext } from 'react';
import type { LocaleKeys } from './locale';

export interface LocaleContextType {
  locale: LocaleKeys;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: 'zh-CN',
});

export default LocaleContext;
