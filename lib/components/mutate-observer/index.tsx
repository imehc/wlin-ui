import {
  cloneElement,
  type FC,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useMutateObserver } from './use-mutate-observer';

export interface MutateObserverProps {
  options?: MutationObserverInit;
  onMutate?: (mutations: MutationRecord[], observer: MutationObserver) => void;
  children: React.ReactElement;
}

/**
 * 使用MutationObserver观察元素变化的组件。
 *
 * 该组件提供了一个用于封装MutationObserver的高阶组件（HOC）。
 * 它通过使用ref将子元素与MutationObserver关联起来，以便在子元素发生变化时触发指定的回调函数。
 *
 * @param MutateObserverProps - 包含子元素、变化回调函数和MutationObserver选项的组件属性。
 * @returns 返回一个包装了子元素的组件，该组件用于监听和响应子元素的变化。
 */
export const MutateObserver: FC<MutateObserverProps> = ({
  children,
  onMutate = () => {},
  options,
}) => {
  // 使用ref来获取并存储元素的引用，以便后续使用MutationObserver观察它。
  const elementRef = useRef<HTMLElement>(null);
  // 状态变量用于存储当前正在观察的元素。
  const [target, setTarget] = useState<HTMLElement>();

  // 在组件挂载后，立即设置目标元素为当前ref所指的元素。
  useLayoutEffect(() => {
    setTarget(elementRef.current!);
  }, []);

  // 使用自定义hook来初始化MutationObserver并配置相应的回调和选项。
  useMutateObserver(target!, onMutate, options);

  // 如果没有提供子元素，则不渲染任何内容。
  if (!children) {
    return null;
  }

  // 返回一个克隆的子元素，将其ref设置为elementRef，以便MutationObserver可以观察它。
  return cloneElement(children, { ref: elementRef });
};
