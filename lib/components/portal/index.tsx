import {
  forwardRef,
  PropsWithChildren,
  useEffect,
  useImperativeHandle,
  useMemo,
} from 'react';
import { createPortal } from 'react-dom';

/**
 * 定义PortalProps接口，用于描述Portal组件的属性。
 *
 * @property {HTMLElement | string} attach 可选属性，指定Portal组件渲染的目标DOM节点。
 *   可以是一个HTMLElement实例，也可以是一个CSS选择器字符串。
 *   如果未提供此属性，默认值为document.body。
 */
export interface PortalProps {
  attach?: HTMLElement | string;
}

/**
 * 定义了一个名为Portal的组件，使用了React的forwardRef来传递一个HTMLElement的引用。
 * 该组件用于将子组件渲染到指定的DOM节点中，实现了React Portal的功能。
 *
 * @param attach 指定要将组件附加到的DOM节点。可以是HTMLElement实例或选择器字符串。
 * @param children 组件的子元素，将被渲染到指定的DOM节点中。
 * @param ref 一个用于获取容器元素的引用的回调函数。
 * @returns 返回一个通过React Portal渲染到指定DOM节点的组件。
 */
export const Portal = forwardRef<HTMLElement, PropsWithChildren<PortalProps>>(
  ({ attach = document.body, children }, ref) => {
    /**
     * 使用useMemo钩子创建并返回一个div元素，用于作为子元素的容器。
     * 这样做可以避免在每次渲染时都重新创建一个DOM元素。
     */
    const container = useMemo(() => {
      const el = document.createElement('div');
      // el.className = 'portal-wrapper';
      return el;
    }, []);

    /**
     * 使用useMemo钩子根据attach参数确定要将组件附加到哪个DOM节点。
     * 如果attach是字符串，则尝试根据该字符串查询DOM节点；
     * 如果attach是HTMLElement实例，则直接使用它；
     * 否则，默认附加到document.body。
     */
    const attachToElement = useMemo(() => {
      if (typeof attach === 'string') {
        return document.querySelector(attach);
      }
      if (typeof attach === 'object' && attach instanceof window.HTMLElement) {
        return attach;
      }
      return document.body;
    }, [attach]);

    /**
     * 使用useEffect钩子来处理容器元素的挂载和卸载。
     * 当组件挂载时，将容器元素添加到attachToElement中；
     * 当组件卸载时，从attachToElement中移除容器元素。
     */
    useEffect(() => {
      attachToElement?.appendChild?.(container);

      return () => {
        attachToElement?.removeChild?.(container);
      };
    }, [container, attachToElement]);

    /**
     * 使用useImperativeHandle钩子来定制ref的处理方式。
     * 它使得通过ref获取到的值是container元素，而不是Portal组件本身。
     */
    useImperativeHandle(ref, () => container);

    /**
     * 使用React的createPortal函数将子元素渲染到container容器中。
     * 这就是实现React Portal的关键步骤。
     */
    return createPortal(children, container);
  }
);
