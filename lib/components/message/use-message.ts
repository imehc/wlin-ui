import { useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { MessageProps, MessageRef, Position } from '.';
import { generateUniqueId } from '../../hooks';
import { ConfigContext } from '..';

// 获取消息在列表中的位置。
const getMessagePosition = (id: number, messageList: MessageList) => {
  for (const [position, list] of Object.entries(messageList)) {
    if (list.find((item) => item.id === id)) {
      return position as Position;
    }
  }
};

// 查找消息在列表中的位置和索引。
const findMessage = (id: number, messageList: MessageList) => {
  const position = getMessagePosition(id, messageList);

  const index = position
    ? messageList[position].findIndex((message) => message.id === id)
    : -1;

  return {
    position,
    index,
  };
};

type MessageList = {
  top: MessageProps[];
  bottom: MessageProps[];
};

/**
 * 使用自定义钩子创建并管理消息存储。
 * @param defaultPosition 默认消息位置。
 * @returns 返回一个对象，包含管理消息列表的方法和当前消息列表。
 */
export const useStore = (defaultPosition: Position) => {
  // 初始化消息列表，分为顶部和底部。
  const [messageList, setMessageList] = useState<MessageList>({
    top: [],
    bottom: [],
  });

  const messageListRef = useRef(messageList);

  // 使用回调函数生成唯一ID，用于消息标识。
  const getId = useCallback((messageProps: MessageProps) => {
    if (messageProps.id) {
      return messageProps.id;
    }
    return generateUniqueId();
  }, []);

  // 添加新消息到列表中。
  const add = useCallback(
    (messageProps: MessageProps) => {
      const id = getId(messageProps);
      setMessageList((state) => {
        if (messageProps.id) {
          const potision = getMessagePosition(
            messageProps.id,
            messageListRef.current
          );
          if (potision) return state;
        }
        const position = messageProps.position || defaultPosition;
        const messages =
          position === 'top'
            ? [{ ...messageProps, id }, ...(state[position] ?? [])]
            : [...(state[position] ?? []), { ...messageProps, id }];
        return {
          ...state,
          [position]: messages,
        };
      });
    },
    [getId, defaultPosition]
  );

  // 更新消息的属性。
  const update = useCallback(
    (id: number, messageProps: MessageProps) => {
      if (!id) return;
      setMessageList((state) => {
        const nextState = { ...state };
        const { position, index } = findMessage(id, messageList);
        if (position && index !== -1) {
          nextState[position][index] = {
            ...nextState[position][index],
            ...messageProps,
          };
        }
        return nextState;
      });
    },
    [messageList]
  );

  // 从列表中移除指定消息。
  const remove = useCallback(
    (id: number) => {
      setMessageList((state) => {
        const position = getMessagePosition(id, messageList);
        if (!position) return state;
        return {
          ...state,
          [position]: state[position].filter((item) => item.id !== id),
        };
      });
    },
    [messageList]
  );

  // 清空所有消息。
  const clearAll = useCallback(() => {
    setMessageList({ top: [], bottom: [] });
  }, []);

  // 返回消息管理对象。
  return useMemo(
    () => ({
      messageList,
      add,
      update,
      remove,
      clearAll,
    }),
    [add, update, remove, clearAll, messageList]
  );
};

/**
 * 使用MessageRef钩子来获取配置上下文中的消息引用。
 *
 * 这个钩子主要用于在应用程序中获取全局消息服务的引用。它通过Context API来传递消息服务的引用，
 * 确保在整个应用程序中可以方便地访问和使用这个服务。
 *
 * @returns 返回当前的消息引用对象。
 * @throws 如果上下文中没有提供消息引用，则抛出错误，提示需要在最外层添加ConfigProvider组件。
 */
export function useMessage(): MessageRef {
  // 从配置上下文中获取消息引用及相关数据
  const { messageRef } = useContext(ConfigContext);

  // 检查消息引用是否存在，如果不存在则抛出错误
  if (!messageRef) {
    throw new Error('Add the ConfigProvider component in the outermost layer');
  }

  // 返回当前的消息引用
  return messageRef.current!;
}
