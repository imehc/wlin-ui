import { useCallback, useEffect, useRef } from 'react';

/**
 * 使用自定义钩子实现定时器功能。
 * 
 * 该钩子提供了设置和清除定时器的能力，并确保定时器回调函数在组件重渲染时保持最新。
 * 
 * @param fn 回调函数，当定时器到期时将被调用。
 * @param delay 定时器的延迟时间，以毫秒为单位。可选参数，默认情况下不设置延迟。
 * @returns 返回一个清除定时器的函数，调用该函数将取消定时器。
 */
export const useTimeout = (fn: () => void, delay?: number) => {
  // 使用 useRef 保存回调函数的引用，确保其在组件重渲染时不会丢失。
  const fnRef = useRef<Function>(fn);
  fnRef.current = fn;

  // 使用 useRef 保存定时器的 ID，以便于清除定时器。
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  // 使用 useCallback 创建一个清除定时器的函数，确保其在组件重渲染时保持不变。
  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  // 使用 useEffect 设置定时器，并在组件卸载时清除定时器。
  useEffect(() => {
    timerRef.current = setTimeout(() => fnRef.current(), delay);

    return () => {
      timerRef.current && clearTimeout(timerRef.current)
    }
  }, [delay]);

  return clear;
};