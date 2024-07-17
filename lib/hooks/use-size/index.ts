import ResizeObserver from 'resize-observer-polyfill';
import { RefObject, useEffect, useState } from 'react';

type Size = { width: number; height: number };

/**
 * 使用ResizeObserver观察给定元素的尺寸变化。
 * 
 * @param targetRef 要观察尺寸变化的元素的Ref对象。
 * @returns 返回一个对象，包含元素的宽度和高度；如果元素不存在，则返回undefined。
 */
export function useSize(targetRef: RefObject<HTMLElement>): Size | undefined {
  // 初始化状态，如果元素存在，则获取其初始尺寸；否则，状态为undefined。
  const [state, setState] = useState<Size | undefined>(
    () => {
      const el = targetRef.current;
      return el ? { width: el.clientWidth, height: el.clientHeight } : undefined
    },
  );

  // 使用Effect设置 ResizeObserver 来监听元素的尺寸变化。
  useEffect(() => {
    const el = targetRef.current;

    // 如果元素不存在，直接返回，避免不必要的操作。
    if (!el) {
      return;
    }

    // 创建一个ResizeObserver实例，用于监听元素的尺寸变化。
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const { clientWidth, clientHeight } = entry.target;
        // 当元素尺寸变化时，更新状态。
        setState({ width: clientWidth, height: clientHeight });
      });
    });
    // 开始观察元素的尺寸变化。
    resizeObserver.observe(el);

    // 返回一个清理函数，取消对元素的观察，以避免内存泄漏。
    return () => {
      resizeObserver.disconnect();
    };
  }, [targetRef]);

  // 返回当前元素的尺寸状态。
  return state;
}