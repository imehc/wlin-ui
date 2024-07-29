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
  const fnRef = useRef<() => void>(fn);
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
      if (!timerRef.current) {
        return
      }
      clearTimeout(timerRef.current);
    };
  }, [delay]);

  return clear;
};

export interface UseTimerProps {
  id: number;
  duration?: number;
  remove: (id: number) => void;
}

/**
 * 使用计时器的钩子。
 *
 * 该钩子提供了一种在组件中使用计时器的方式，并且在组件卸载时自动清除计时器。
 * 它通过控制鼠标进入和离开组件的行为来决定是否启动计时器。
 *
 * @param {UseTimerProps} props - 函数的参数对象，包含以下属性：
 * @param {Function} props.remove - 当计时器结束时调用的函数，用于执行特定的清理操作。
 * @param {string} props.id - 计时器的唯一标识符，用于在移除计时器时进行标识。
 * @param {number} props.duration - 计时器的持续时间，默认为2000毫秒。
 * @returns 返回一个对象，包含用于启动和停止计时器的鼠标进入和离开组件时的处理函数。
 */
export function useTimer({ remove, id, duration = 2000 }: UseTimerProps) {
  // 使用 useRef 来保存计时器的 ID，确保在组件重渲染时不会重新创建计时器。
  const timer = useRef<number | null>(null);

  /**
   * 清除计时器。
   *
   * 该函数用于清除已设置的计时器，防止其在未来触发。
   */
  const removeTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  /**
   * 启动计时器。
   *
   * 该函数设置一个定时器，在指定的持续时间后调用 `remove` 函数，并清除计时器。
   */
  const startTimer = () => {
    timer.current = window.setTimeout(() => {
      remove(id);
      removeTimer();
    }, duration);
  };

  // 使用 useEffect 来在组件挂载时启动计时器，并在组件卸载时清除计时器。
  // 这里故意不将任何依赖项传递给 useEffect，以确保计时器只在组件首次挂载时启动一次。
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    startTimer();
    return () => removeTimer();
  }, []);

  // 当鼠标进入组件时，清除计时器，防止其触发。
  const onMouseEnter = () => {
    removeTimer();
  };

  // 当鼠标离开组件时，重新启动计时器。
  const onMouseLeave = () => {
    startTimer();
  };

  // 返回控制计时器行为的处理函数。
  return {
    onMouseEnter,
    onMouseLeave,
  };
}
