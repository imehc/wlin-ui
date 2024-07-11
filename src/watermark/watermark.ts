import type { PropsWithChildren, HTMLAttributes } from 'react';

export interface WatermarkProps
  extends PropsWithChildren<
    Pick<HTMLAttributes<HTMLDivElement>, 'style' | 'className'>
  > {
  /** 追加水印元素的 `z-index` @default 1 */
  zIndex?: string | number;
  /** 水印的宽度 @default 100 */
  width?: number;
  /** 水印的高度 */
  height?: number;
  /** 水印的旋转的角度 */
  rotate?: number;
  /** 图片源 */
  image?: string;
  /** 水印文字内容 */
  content?: string | string[];
  /** 文字样式 */
  fontStyle?: {
    /** @default rgba(0, 0, 0, 0.15)  */
    color?: string;
    /** @default sans-serif */
    fontFamily?: string;
    /** @default 16px */
    fontSize?: number | string;
    /** normal */
    fontWeight?: number | string;
  };
  /** 水印之间的间距 @default [100, 100] */
  gap?: [number, number];
  /** 水印距离容器左上角的偏移量，默认为 `gap/2`*/
  offset?: [number, number];
  /** @default document.body */
  getContainer?(): HTMLElement;
}

export type WatermarkOptions = Omit<
  WatermarkProps,
  'className' | 'style' | 'children'
>;
