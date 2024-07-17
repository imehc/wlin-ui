import { useEffect, useRef } from 'react';

type IProps = Record<string, any>;

/**
 * 使用useWhyDidYouUpdate钩子来监测组件属性的变化。
 * 当组件的某些属性发生改变时，此钩子将记录并打印出这些变化的属性及其前后值。
 * 主要用于开发阶段调试，以了解为什么组件会重新渲染。
 * 
 * @param componentName 组件名称，用于在日志中标识哪个组件发生了更新。
 * @param props 组件的属性对象，用于比较前后属性值的变化。
 */
export function useWhyDidYouUpdate(componentName: string, props: IProps) {
  // 使用 useRef 来存储上一次的属性值，以便于比较当前和之前的属性值是否有变化。
  const prevProps = useRef<IProps>({});

  // 使用 useEffect 来在每次组件更新后执行检查属性变化的逻辑。
  useEffect(() => {
    // 如果之前已经有属性值，则进行属性变化的检查。
    if (prevProps.current) {
      // 合并当前和之前的属性值，以便于一次性检查所有属性是否有变化。
      const allKeys = Object.keys({ ...prevProps.current, ...props });
      // 用于存储发生变化的属性及其前后值。
      const changedProps: IProps = {};

      // 遍历所有属性，检查是否有变化。
      allKeys.forEach((key) => {
        // 使用 Object.is 来比较属性值是否真正相等（考虑 NaN 和 -0 的情况）。
        if (!Object.is(prevProps.current[key], props[key])) {
          // 如果属性值有变化，则记录变化的属性及其前后值。
          changedProps[key] = {
            from: prevProps.current[key],
            to: props[key],
          };
        }
      });

      // 如果有属性发生变化，则打印相关日志。
      if (Object.keys(changedProps).length) {
        console.log('[why-did-you-update]', componentName, changedProps);
      }
    }

    // 更新 prevProps 为当前的属性值，以备下一次比较使用。
    prevProps.current = props;
  });
}

