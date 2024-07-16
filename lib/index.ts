import '@unocss/reset/normalize.css';
import 'virtual:uno.css';
import './index.css';

export { Watermark, Calendar, Icon, Space, Portal } from './components';
export type { WatermarkProps, CalendarProps, IconProps, SpaceProps, PortalProps } from './components';
export { ConfigContext, ConfigProvider } from './components';
export { createIcon, createFromIconfont } from './components';
