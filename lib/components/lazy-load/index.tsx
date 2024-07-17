import {
  HTMLAttributes,
  type ReactNode,
  type FC,
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from 'react';

export interface LazyLoadProps
  extends Pick<
    HTMLAttributes<HTMLElement>,
    'style' | 'className' | 'children'
  > {
  placeholder?: ReactNode;
  offset?: string | number;
  onContentVisible?: () => void;
}

/**
 * LazyLoad组件用于实现延迟加载功能。
 * 它通过IntersectionObserver API来观察组件是否进入视口，一旦进入视口，就加载需要延迟加载的内容。
 *
 * @param offset 偏移量，用于控制组件距离视口多远时开始加载。默认值为0。
 * @param children 延迟加载的内容。
 * @param placeholder 加载前的占位符。
 * @param onContentVisible 内容可见时的回调函数。
 * @param props 其他传给div的属性。
 * @returns 返回一个div组件，根据内容是否可见，显示不同的内容。
 */
export const LazyLoad: FC<LazyLoadProps> = ({
  offset = 0,
  children,
  placeholder,
  onContentVisible,
  ...props
}) => {
  // 使用ref来获取组件的DOM元素，以便于后续的IntersectionObserver观察。
  const containerRef = useRef<HTMLDivElement>(null);
  // 控制内容是否可见的状态。
  const [visible, setVisible] = useState(false);

  // 创建一个回调函数，用于处理IntersectionObserver的回调。
  const handLazyLoad = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      const { isIntersecting } = entry;
      // 当元素进入视口时，设置内容可见，并触发onContentVisible回调。
      if (isIntersecting) {
        setVisible(true);
        onContentVisible?.();

        const node = containerRef.current;
        // 停止观察该元素。
        if (node && node instanceof HTMLElement) {
          elementObserver.current?.unobserve(node);
        }
      }
    },
    [onContentVisible]
  );

  // 使用useMemo来创建IntersectionObserver实例，以避免不必要的重新创建。
  const initObserver = useMemo(() => {
    const options = {
      rootMargin: typeof offset === 'number' ? `${offset}px` : offset || '0px',
      threshold: 0,
    };
    return new IntersectionObserver(handLazyLoad, options);
  }, [offset, handLazyLoad]);

  // 使用ref来存储IntersectionObserver实例。
  const elementObserver = useRef(initObserver);

  // 使用useEffect来开始观察元素是否进入视口。
  useEffect(() => {
    const node = containerRef.current;
    // 如果元素存在且是一个HTMLElement，则开始观察。
    if (node instanceof HTMLElement) {
      elementObserver.current.observe(node);
    }
    // 返回一个清理函数，用于在组件卸载时停止观察。
    return () => {
      if (node && node instanceof HTMLElement) {
        elementObserver.current?.unobserve(node);
      }
    };
  }, []);

  // 返回一个div，根据visible的状态，显示children或placeholder。
  return (
    <div ref={containerRef} {...props}>
      {visible ? children : placeholder}
    </div>
  );
};
