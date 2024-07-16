import { type PropsWithChildren, type HTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';
import { css } from '#/css';

type BaseIconProps = {
  size?: string | string[];
  spin?: boolean;
} & Pick<HTMLAttributes<HTMLElement>, 'className' | 'style'>;

export type IconProps = BaseIconProps &
  Omit<React.SVGAttributes<SVGElement>, keyof BaseIconProps>;

export const Icon = forwardRef<SVGSVGElement, PropsWithChildren<IconProps>>(
  (
    { size = '1em', children, style, spin, viewBox = '0 0 1024 1024', ...attr },
    ref
  ) => {
    const [width, height] = getSize(size);
    return (
      <svg
        ref={ref}
        className={clsx(
          'inline-block',
          spin && css({ animation: 'spin 1s linear infinite' })
        )}
        style={style}
        width={width}
        height={height}
        fill="currentColor"
        viewBox={viewBox}
        {...attr}
      >
        {children}
      </svg>
    );
  }
);

const getSize = (size: IconProps['size']) => {
  if (Array.isArray(size) && size.length === 2) {
    return size as string[];
  }
  const width = (size as string) || '1em';
  const height = (size as string) || '1em';
  return [width, height];
};

interface CreateIconOptions {
  content: React.ReactNode;
  iconProps?: IconProps;
  viewBox?: string;
}

/**
 * 创建一个图标组件。
 *
 * 该函数接受一个配置对象，包括图标的内容、图标的属性和视图框大小，
 * 并返回一个向前引用的SVG图标组件。这个函数的主要作用是封装一个自定义SVG图标，
 * 允许传入图标的具体内容和一些额外的属性，以便在使用时更加灵活。
 *
 * @param {Object} config - 图标组件的配置对象。
 * @param {string | JSX.Element} config.content - 图标的主体内容，可以是字符串或JSX元素。
 * @param {Object} config.iconProps - 图标组件的额外属性，这些属性将会被应用到SVG元素上。
 * @param {string} config.viewBox - 图标的视图框，定义了图标在画布上的显示区域。
 * @returns {React.ForwardRefRenderFunction<SVGSVGElement, IconProps>} - 返回一个向前引用的渲染函数，
 *          该函数负责渲染SVG图标组件，并接受额外的props和一个引用(ref)。
 */
export function createIcon({
  content,
  iconProps = {},
  viewBox = '0 0 1024 1024',
}: CreateIconOptions) {
  // 使用向前引用(React.forwardRef)创建一个SVG图标组件
  return forwardRef<SVGSVGElement, IconProps>((props, ref) => {
    // 返回一个SVG元素，应用了传入的iconProps和props，并包含content作为图标内容
    return (
      <Icon ref={ref} viewBox={viewBox} {...iconProps} {...props}>
        {content}
      </Icon>
    );
  });
}

const loadedSet = new Set<string>();
/**
 * 根据Iconfont的脚本URL创建一个自定义组件。
 * 这个函数的目的是为了动态加载Iconfont的JavaScript文件，并提供一个组件，该组件可以根据传入的类型渲染相应的图标。
 *
 * @param scriptUrl Iconfont的脚本URL，这个URL决定了哪些图标可以被加载和使用。
 * @returns 返回一个自定义组件，这个组件可以被用来渲染具体的图标。
 */
export function createFromIconfont(scriptUrl: string) {
  // 检查scriptUrl是否为非空字符串且未被加载过，如果满足条件，则创建并加载脚本
  if (
    typeof scriptUrl === 'string' &&
    scriptUrl.length &&
    !loadedSet.has(scriptUrl)
  ) {
    const script = document.createElement('script');
    script.setAttribute('src', scriptUrl);
    script.setAttribute('data-namespace', scriptUrl);
    document.body.appendChild(script);

    loadedSet.add(scriptUrl);
  }
  // 创建一个forwardRef组件，用于渲染Iconfont图标
  const Iconfont = forwardRef<SVGSVGElement, IconProps>(
    ({ type, ...attr }, ref) => {
      // 根据传入的type渲染对应的图标，如果type不存在，则不渲染任何内容
      return (
        <Icon {...attr} ref={ref}>
          {type ? <use xlinkHref={`#${type}`} /> : null}
        </Icon>
      );
    }
  );

  return Iconfont;
}
