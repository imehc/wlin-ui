import { useEffect, useRef } from "react";

const defaultOptions: MutationObserverInit = {
  subtree: true,// 连带子节点的属性、children 变化也监听
  childList: true,// 监听 children 变化
  attributeFilter: ['style', 'class'],// 指定监听哪些属性的变化
}

/**
 * 使用MutationObserver来观察DOM节点的变化。
 * 
 * 该钩子函数用于高效地监听DOM节点的变化，仅在必要时重新订阅变化。
 * 它利用了React的useMemo和useEffect钩子来避免不必要的性能开销。
 * 
 * @param node 要观察的DOM节点或节点数组。
 * @param callback 当观察到变化时调用的回调函数。
 * @param options 观察者的选项，例如是否观察子节点或特定属性的变化。
 */
export function useMutateObserver(
  node: HTMLElement | HTMLElement[],
  callback: MutationCallback,
  options = defaultOptions,
) {
  const callbackRef = useRef(callback);

  // 使用useEffect钩子来开始和结束观察。
  useEffect(() => {
    if (!node) {
      return;
    }

    let instance: MutationObserver | undefined;

    if ('MutationObserver' in window) {
      instance = new MutationObserver(callbackRef.current);

      [node].flat().forEach(element => {
        instance?.observe(element, options);
      });
    }
    return () => {
      instance?.takeRecords();
      instance?.disconnect();
    };
  }, [options, node]);
}