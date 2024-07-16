import { FC, useCallback, useEffect, useMemo, useRef } from 'react';
import { WatermarkProps } from './watermark';
import useWatermark from './use-watermark';
export type { WatermarkProps } from './watermark';

/**
 * 水印组件，用于在页面或组件中添加水印效果.
 *
 * @param children 组件的子元素.
 * @param className 组件的类名.
 * @param style 组件的样式.
 * @param rotate 水印文字的旋转角度，默认为-20度.
 * @param zIndex 水印的Z-index值，默认为1.
 * @param width 水印文字的宽度，默认为100px.
 * @param gap 水印文字之间的间隔，默认为[100, 100]px，分别代表水平和垂直间隔.
 * @param fontStyle 水印文字的样式对象，默认为{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.15)', fontFamily: 'sans-serif', fontWeight: 'normal' }.
 * @param offset 水印文字的偏移量，默认为[0, 0]px，分别代表水平和垂直偏移.
 * @param attrs 其他属性，包括getContainer、height、content、image等，用于定制水印的容器、高度、内容和图片等.
 * @returns 返回水印组件，如果无子元素，则不渲染任何内容.
 */
export const Watermark: FC<WatermarkProps> = ({
  children,
  className,
  style,
  rotate = -20,
  zIndex = 1,
  width = 100,
  gap = [100, 100],
  fontStyle = {
    fontSize: '16px',
    color: 'rgba(0, 0, 0, 0.15)',
    fontFamily: 'sans-serif',
    fontWeight: 'normal',
  },
  offset = [0, 0],
  ...attrs
}) => {
  // 使用 useRef 来存储水印容器的引用
  const containerRef = useRef<HTMLDivElement>(null);
  // 使用 useCallback 缓存 getContainer 函数，以避免不必要的重渲染
  const getContainer = useCallback(() => {
    if (attrs.getContainer) {
      return attrs.getContainer();
    }
    return containerRef.current!;
  }, [attrs.getContainer]);

  // 使用 useMemo 来计算水印的配置选项，以减少不必要的计算
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const options = useMemo(
    () => ({
      rotate,
      zIndex,
      width,
      height: attrs.height,
      gap,
      fontStyle,
      offset,
      content: attrs.content,
      image: attrs.image,
      getContainer,
    }),
    [
      rotate,
      zIndex,
      width,
      JSON.stringify(gap),
      JSON.stringify(fontStyle),
      JSON.stringify(offset),
      attrs.content,
      attrs.height,
      attrs.image,
      getContainer,
    ]
  );
  // 使用 useWatermark 钩子来生成水印
  const { generateWatermark } = useWatermark(options);
  // 使用 useEffect 来在组件挂载和选项更新时生成水印
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    generateWatermark(options);
  }, [options]);
  // 如果没有子元素，则不渲染任何内容
  if (!children) {
    return null;
  }
  // 返回水印容器，其中包含子元素
  return (
    <div ref={containerRef} className={className} style={style}>
      {children}
    </div>
  );
};
