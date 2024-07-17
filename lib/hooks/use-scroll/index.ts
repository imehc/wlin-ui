import { RefObject, useEffect, useState } from 'react';

/**
 * 使用自定义hook来检测一个HTMLElement是否正在滚动。
 * 
 * @param ref 一个RefObject，指向要检测滚动的HTMLElement。
 * @returns 返回一个布尔值，表示元素是否正在滚动。
 */
export const useScroll = (ref: RefObject<HTMLElement>): boolean => {
  /**
   * 状态变量，用于跟踪元素是否正在滚动。
   */
  const [scroll, setScroll] = useState<boolean>(false);

  /**
   * 副作用钩子，用于监听元素的滚动事件。
   * 
   * 设置一个延迟计时器，在滚动停止一段时间后，才标记滚动状态为false。
   * 这样可以避免频繁地更新状态，提高性能。
   */
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    let scollingTimer: ReturnType<typeof setTimeout>;

    /**
     * 滚动结束的处理函数，将滚动状态设置为false。
     */
    const handleScrollEnd = () => {
      setScroll(false);
    };

    /**
     * 滚动事件的处理函数，将滚动状态设置为true，并取消之前的延迟处理。
     * 然后设置一个新的延迟计时器，在滚动停止150毫秒后，调用handleScrollEnd。
     */
    const handleScroll = () => {
      setScroll(true);
      clearTimeout(scollingTimer);
      scollingTimer = setTimeout(() => handleScrollEnd(), 150);
    };

    // 给ref指向的元素添加滚动事件监听器。
    ref.current?.addEventListener('scroll', handleScroll);

    // 返回一个清理函数，用于在组件卸载时移除滚动事件监听器。
    return () => {
      ref.current?.removeEventListener('scroll', handleScroll);
    };
  }, [ref]);

  // 返回当前的滚动状态。
  return scroll;
};