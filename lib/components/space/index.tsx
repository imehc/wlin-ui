import clsx from 'clsx';
import React from 'react';
import { useMemo } from 'react';
import { ConfigContext } from '..';

export type SizeType = 'small' | 'middle' | 'large' | number | undefined;

/**
 * 定义了Space组件的属性接口。
 * Space组件用于在元素之间添加间隔，支持水平或垂直方向布局，以及不同的对齐方式。
 *
 * @property size 间隔的大小，可以是'small'、'middle'、'large'之一，一个数字，或者一个包含两个大小值的数组（分别用于水平和垂直方向）。
 * @property direction 组件的布局方向，可以是'horizontal'（水平布局）或'vertical'（垂直布局），默认为'horizontal'。
 * @property align 元素在布局中的对齐方式，可以是'start'、'end'、'center'、'baseline'之一，默认为'start'。
 * @property split 间隔元素，可以是一个React节点，用于自定义间隔的样式。
 * @property wrap 是否允许元素换行，当元素过多或间隔过小时，可以设置为true使元素换行布局。
 * @extends React.HTMLAttributes<HTMLDivElement> 继承了HTMLDivElement的属性，除了'size'属性。
 */
export interface SpaceProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'size'> {
  size?: SizeType | [SizeType, SizeType];
  direction?: 'horizontal' | 'vertical';
  align?: 'start' | 'end' | 'center' | 'baseline';
  split?: React.ReactNode;
  wrap?: boolean;
}

export const Space: React.FC<SpaceProps> = ({
  children,
  direction,
  align,
  wrap,
  split,
  className,
  style,
  ...props
}) => {
  const { space } = React.useContext(ConfigContext);
  const { size = space?.size || 'small', ...attr } = props;
  const mergedAlign = useMemo(
    () =>
      direction === 'horizontal' && align === undefined ? 'center' : align,
    [direction, align]
  );
  const nodes = useMemo(() => {
    const childNodes = React.Children.toArray(children);
    return childNodes.map((child, i) => {
      const key =
        (child && (child as React.ReactPortal).key) || `space-item-${i}`;
      return (
        <React.Fragment key={key}>
          <div className="space-item">{child}</div>
          {i < childNodes.length && split && (
            <span className={`${className}-split`} style={style}>
              {split}
            </span>
          )}
        </React.Fragment>
      );
    });
  }, [children, split, className, style]);

  const otherStyles: React.CSSProperties = {};

  const [horizontalSize, verticalSize] = React.useMemo(
    () =>
      ((Array.isArray(size) ? size : [size, size]) as [SizeType, SizeType]).map(
        (item) => getNumberSize(item)
      ),
    [size]
  );

  otherStyles.columnGap = horizontalSize;
  otherStyles.rowGap = verticalSize;

  if (wrap) {
    otherStyles.flexWrap = 'wrap';
  }

  return (
    <div
      className={clsx(
        'inline-flex',
        { 'flex-col': direction === 'vertical' },
        { 'flex-row': direction === 'horizontal' },
        { 'items-baseline': mergedAlign === 'baseline' },
        { 'items-start': mergedAlign === 'start' },
        { 'items-end': mergedAlign === 'end' },
        { 'items-center': mergedAlign === 'center' },
        className
      )}
      style={{ ...otherStyles, ...style }}
      {...attr}
    >
      {nodes}
    </div>
  );
};

const spaceSize = {
  small: 8,
  middle: 16,
  large: 24,
};

function getNumberSize(size: SizeType) {
  return typeof size === 'string' ? spaceSize[size] : size || 0;
}
