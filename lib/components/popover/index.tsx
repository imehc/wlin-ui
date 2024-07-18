import { useMemo, useRef, useState } from 'react';
import {
  arrow,
  flip,
  FloatingArrow,
  offset,
  useClick,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
} from '@floating-ui/react';
import { createPortal } from 'react-dom';

// 定义对齐方式类型
type Alignment = 'start' | 'end';
// 定义浮层位置类型
type Side = 'top' | 'right' | 'bottom' | 'left';
// 定义精确对齐位置类型
type AlignedPlacement = `${Side}-${Alignment}`;

// 定义Popover组件的props接口
export interface PopoverProps
  extends Pick<
    React.HTMLAttributes<HTMLElement>,
    'style' | 'className' | 'children'
  > {
  content: React.ReactNode;
  trigger?: 'hover' | 'click';
  placement?: Side | AlignedPlacement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// Popover组件，实现一个浮动弹出层
export const Popover: React.FC<PopoverProps> = ({
  open,
  onOpenChange,
  content,
  children,
  trigger = 'hover',
  placement = 'bottom',
  className,
  style,
}) => {
  // 使用 useRef 存储箭头元素的引用
  const arrowRef = useRef(null);
  // 使用 useState 管理弹出层的打开状态
  const [isOpen, setIsOpen] = useState(open);

  // 使用 useFloating 钩子来管理浮动元素的定位和交互
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: (open) => {
      setIsOpen(open);
      onOpenChange?.(open);
    },
    placement,
    middleware: [offset(10), arrow({ element: arrowRef }), flip()],
  });

  // 根据触发方式选择使用 hover 或 click 交互
  // const hover = useHover(context, { enabled: trigger === 'hover' });
  // const click = useHover(context, { enabled: trigger === 'click' });
  const interaction =
    trigger === 'hover' ? useHover(context) : useClick(context);

  // 使用 useDismiss 钩子来处理弹出层的关闭交互
  const dismiss = useDismiss(context);

  // 使用 useInteractions 钩子来组合所有的交互
  const { getReferenceProps, getFloatingProps } = useInteractions([
    // hover,
    // click,
    interaction,
    dismiss,
  ]);

  // 使用 useMemo 创建一个用于挂载浮动元素的 DOM 元素
  const el = useMemo(() => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    return el;
  }, []);

  // 根据 isOpen 来渲染浮动层
  const floating = isOpen ? (
    <div
      className="py-1 px-2 rounded"
      border="1 solid #000"
      ref={refs.setFloating}
      style={floatingStyles}
      {...getFloatingProps()}
    >
      {content}
      <FloatingArrow
        ref={arrowRef}
        context={context}
        fill="#fff"
        stroke="#000"
        strokeWidth={1}
      />
    </div>
  ) : null;

  // 返回参考元素和浮动元素
  return (
    <>
      <span
        ref={refs.setReference}
        {...getReferenceProps()}
        className={className}
        style={style}
      >
        {children}
      </span>
      {createPortal(floating, el)}
    </>
  );
};
