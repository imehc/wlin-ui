import { cloneElement, RefObject, useEffect, useState } from 'react';

type Element =
  | ((state: boolean) => React.ReactElement)
  | React.ReactElement;

/**
 * 使用hover状态的钩子。
 *
 * 该钩子提供了一个简单的方法来跟踪一个元素的hover状态，并且允许你传入一个元素并自动为其添加hover事件监听器。
 * 返回一个React元素和一个布尔值，布尔值表示元素是否处于hover状态。
 *
 * @param element 要添加hover监听器的元素。可以是一个React元素或一个返回React元素的函数。
 * @returns 返回一个数组，第一个元素是传入的元素（可能已被克隆以包含hover事件监听器），第二个元素是hover状态的布尔值。
 */
export const useHover = (element: Element): [React.ReactElement, boolean] => {
  // 初始化hover状态
  const [state, setState] = useState(false);

  /**
   * 鼠标进入事件的处理函数。
   *
   * 该函数首先调用原始的onMouseEnter处理函数（如果存在），然后设置hover状态为true。
   */
  const onMouseEnter = (originalOnMouseEnter?: any) => (event: any) => {
    originalOnMouseEnter?.(event);
    setState(true);
  };

  /**
   * 鼠标离开事件的处理函数。
   *
   * 该函数首先调用原始的onMouseLeave处理函数（如果存在），然后设置hover状态为false。
   */
  const onMouseLeave = (originalOnMouseLeave?: any) => (event: any) => {
    originalOnMouseLeave?.(event);
    setState(false);
  };

  // 如果元素是一个函数组件，使用hover状态重新渲染该函数
  if (typeof element === 'function') {
    // eslint-disable-next-line no-param-reassign
    element = element(state);
  }

  // 克隆元素，并为其添加hover事件监听器
  const el = cloneElement(element, {
    onMouseEnter: onMouseEnter(element.props.onMouseEnter),
    onMouseLeave: onMouseLeave(element.props.onMouseLeave),
  });

  // 返回克隆的元素和hover状态
  return [el, state];
};

interface Options {
  onEnter?: () => void;
  onLeave?: () => void;
  onChange?: (isHovering: boolean) => void;
}

/**
 * 使用 useRef 进行悬停状态管理的钩子。
 * 
 * 该钩子旨在提供一种简单的方法来跟踪元素的悬停状态，并根据需要调用提供的回调函数。
 * 它通过监听 mouseenter 和 mouseleave 事件来更新状态，并在状态改变时调用相应的回调函数。
 * 
 * @param ref 一个 RefObject，指向要监听悬停事件的 HTML 元素。
 * @param options 可选参数对象，包含 onEnter、onLeave 和 onChange 回调函数。
 *        onEnter 鼠标进入元素时调用的回调函数。
 *        onLeave 鼠标离开元素时调用的回调函数。
 *        onChange 状态改变（进入或离开悬停状态）时调用的回调函数。
 * @returns 返回一个布尔值，表示当前元素是否处于悬停状态。
 */
export const useHoverWithRef = (
  ref: RefObject<HTMLElement>,
  options?: Options
): boolean => {
  // 解构可选参数中的回调函数，如果没有提供则默认为 undefined。
  const { onEnter, onLeave, onChange } = options || {};

  // 使用 useState 管理悬停状态。
  const [isEnter, setIsEnter] = useState<boolean>(false);

  // 使用 useEffect 监听元素的 mouseenter 和 mouseleave 事件。
  useEffect(() => {
    // 添加 mouseenter 事件监听器。
    ref.current?.addEventListener('mouseenter', () => {
      // 调用 onEnter 回调。
      onEnter?.();
      // 更新状态为悬停。
      setIsEnter(true);
      // 调用 onChange 回调，传递新的状态。
      onChange?.(true);
    });

    // 添加 mouseleave 事件监听器。
    ref.current?.addEventListener('mouseleave', () => {
      // 调用 onLeave 回调。
      onLeave?.();
      // 更新状态为非悬停。
      setIsEnter(false);
      // 调用 onChange 回调，传递新的状态。
      onChange?.(false);
    });
  }, [ref, onChange, onEnter, onLeave]);

  // 返回当前的悬停状态。
  return isEnter;
};