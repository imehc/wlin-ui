import { useCallback, useEffect, useRef } from 'react';

/**
 * 使用useMountedState钩子来获取当前组件是否挂载的状态。
 * 
 * 这个钩子返回一个函数，该函数用于检查当前组件是否已挂载。这在需要知道组件状态的情况下非常有用，
 * 例如在异步操作中判断是否应该更新组件或执行某些操作。
 * 
 * @returns 返回一个函数，该函数在调用时返回当前组件是否挂载的状态。
 */
export function useMountedState(): () => boolean {
  // 使用 useRef 来跟踪组件是否已挂载的状态。
  const mountedRef = useRef<boolean>(false);

  // 使用 useCallback 缓存函数，确保其引用不变，以避免不必要的重新渲染。
  const get = useCallback(() => mountedRef.current, []);

  // 使用 useEffect 在组件挂载时更新 mountedRef 的状态，并在组件卸载时重置。
  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  // 返回用于检查组件挂载状态的函数。
  return get;
}