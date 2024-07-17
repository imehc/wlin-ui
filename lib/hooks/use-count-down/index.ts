import { differenceInMilliseconds } from 'date-fns';
import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * 定义计时器选项接口
 */
interface Options {
  leftTime?: number;
  targetDate?: Date;
  interval?: number;
  onEnd?: () => void;
}

/**
 * 定义格式化结果接口
 */
interface FormattedRes {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

/**
 * 计算与目标时间的剩余时间
 * @param target 目标时间点，可以是Date对象或以毫秒为单位的时间戳
 * @returns 剩余时间，如果目标时间不明确则返回0
 */
const calcLeft = (target?: Date | number) => {
  if (!target) {
    return 0;
  }

  const left = differenceInMilliseconds(target, Date.now());
  return left < 0 ? 0 : left;
};

/**
 * 将毫秒数格式化为天、小时、分钟、秒和毫秒
 * @param milliseconds 毫秒数
 * @returns 格式化后的结果
 */
const parseMs = (milliseconds: number): FormattedRes => {
  return {
    days: Math.floor(milliseconds / 86400000),
    hours: Math.floor(milliseconds / 3600000) % 24,
    minutes: Math.floor(milliseconds / 60000) % 60,
    seconds: Math.floor(milliseconds / 1000) % 60,
    milliseconds: Math.floor(milliseconds) % 1000,
  };
};

/**
 * 使用 Hooks 实现的计时器钩子
 * @param options 计时器的配置选项
 * @returns 剩余时间和格式化后的剩余时间
 */
export const useCountdown = (options: Options = {}) => {
  const { leftTime, targetDate, interval = 1000, onEnd } = options || {};

  /**
   * 使用 useMemo 钩子来计算并缓存 leftTime 如果 leftTime 指定且大于 0
   */
  const memoLeftTime = useMemo(() => {
    return leftTime && leftTime > 0 ? Date.now() + leftTime : undefined;
  }, [leftTime]);

  /**
   * 确定计时器的目标时间
   */
  const target = 'leftTime' in options ? memoLeftTime : targetDate;

  /**
   * 使用 useState 管理当前的剩余时间
   */
  const [timeLeft, setTimeLeft] = useState(() => calcLeft(target));

  /**
   * 使用 useRef 创建一个 ref 来存储 onEnd 回调函数，以确保在组件重新渲染时不会丢失
   */
  const onEndRef = useRef(onEnd);
  onEndRef.current = onEnd;

  /**
   * 使用 useEffect 来启动计时器并更新剩余时间
   */
  useEffect(() => {
    if (!target) {
      setTimeLeft(0);
      return;
    }

    setTimeLeft(calcLeft(target));

    const timer = setInterval(() => {
      const targetLeft = calcLeft(target);
      setTimeLeft(targetLeft);
      if (targetLeft === 0) {
        clearInterval(timer);
        onEndRef.current?.();
      }
    }, interval);

    return () => clearInterval(timer);
  }, [target, interval]);

  /**
   * 使用 useMemo 钩子来缓存时间的格式化结果
   */
  const formattedRes = useMemo(() => parseMs(timeLeft), [timeLeft]);

  return [timeLeft, formattedRes] as const;
};