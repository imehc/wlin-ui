import '@unocss/reset/normalize.css';
import 'virtual:uno.css';
import './index.css';

export {
  Watermark,
  Calendar,
  Icon,
  Space,
  Portal,
  MutateObserver,
  CopyToClipboard
} from './components';
export type {
  WatermarkProps,
  CalendarProps,
  IconProps,
  SpaceProps,
  PortalProps,
  MutateObserverProps,
  CopyToClipboardProps
} from './components';
export { ConfigContext, ConfigProvider } from './components';
export { createIcon, createFromIconfont } from './components';
