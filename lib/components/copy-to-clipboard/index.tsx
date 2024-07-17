import { Children, cloneElement, type FC, type ReactElement } from 'react';
import copy from 'copy-to-clipboard';

export interface CopyToClipboardProps {
  text: string;
  onCopy?: (text: string, result: boolean) => void;
  children: ReactElement;
  options?: {
    debug?: boolean;
    message?: string;
    format?: string;
  };
}

/**
 * CopyToClipboard 组件用于将指定的文本复制到剪贴板。
 *
 * 该组件接受以下 props:
 * @param children {React.ReactElement} - 用于触发复制操作的子元素。
 * @param text {string} - 需要被复制的文本。
 * @param options {CopyOptions} - 复制操作的可选配置项。
 * @param onCopy {(text: string, result: boolean) => void} - 复制操作完成后的回调函数。
 *
 * @returns {React.ReactElement} - 经过处理后的子元素，点击该元素将触发复制操作。
 */
export const CopyToClipboard: FC<CopyToClipboardProps> = ({
  children,
  text,
  options,
  onCopy,
}) => {
  // 获取传入的子元素，确保只有一个子元素。
  const elem = Children.only(children);

  /**
   * 点击事件处理函数。
   *
   * 当元素被点击时，该函数将尝试复制指定的文本到剪贴板，并根据复制是否成功调用 onCopy 回调函数。
   * 如果元素本身定义了 onClick 函数，它也会被调用。
   *
   * @param event {MouseEvent} - 点击事件对象。
   */
  const onClick = (event: MouseEvent) => {
    // 执行复制操作。
    const result = copy(text, options);
    // 如果定义了 onCopy 回调，则调用它并传入复制的文本和结果。
    if (onCopy) {
      onCopy(text, result);
    }
    // 如果元素定义了 onClick 函数，则调用它。
    if (typeof elem?.props?.onClick === 'function') {
      elem.props.onClick(event);
    }
  };

  // 返回一个经过处理的子元素，点击该元素将触发复制操作。
  return cloneElement(elem, { onClick });
};
