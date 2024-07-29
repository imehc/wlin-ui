import React, { RefObject, useRef } from 'react';
import { MessageProvider, type MessageRef } from '.';
import type { SizeType } from './space';

interface ConfigContextType {
  space?: {
    size?: SizeType;
  };
  messageRef?: RefObject<MessageRef>;
}
export const ConfigContext = React.createContext<ConfigContextType>({});

type ConfigProviderProps = React.PropsWithChildren<ConfigContextType>;

/**
 * ConfigProvider 组件提供了一个配置上下文，用于在组件树中传递和共享配置信息，如间距设置。
 * 它通过 Context API 实现，允许子组件无需直接传入 props 即可访问到配置信息。
 *
 * @param {ConfigProviderProps} props - 组件的属性对象。
 * @param {ReactNode} children - ConfigProvider 的子组件，它们将继承配置上下文。
 * @returns 返回一个配置上下文提供者组件。
 */
export function ConfigProvider({ space, children }: ConfigProviderProps) {
  const messageRef = useRef<MessageRef>(null);
  // 提供配置上下文，其中包含 space 信息。
  return (
    <ConfigContext.Provider value={{ space, messageRef }}>
      <MessageProvider ref={messageRef} />
      {children}
    </ConfigContext.Provider>
  );
}
