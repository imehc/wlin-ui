import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { WatermarkOptions } from '.';

/**
 * 测量文本尺寸
 * @param ctx Canvas渲染上下文对象
 * @param content 要测量的文本内容数组
 * @param rotate 文本的旋转角度（以弧度为单位）
 * @returns 返回一个对象，包含文本的原始宽度、原始高度、旋转后的宽度、旋转后的高度以及每行文本的尺寸
 */
const measureTextSize = (
  ctx: CanvasRenderingContext2D,
  content: string[],
  rotate: number
) => {
  // 初始化宽度和高度为0
  let width = 0;
  let height = 0;
  // 初始化一个数组用于存储每行文本的尺寸
  let lineSize: { width: number; height: number }[] = [];
  // 遍历文本内容数组
  for (const item in content) {
    // 检查对象自有属性以避免原型链污染
    if (Object.prototype.hasOwnProperty.call(content, item)) {
      // 使用Canvas上下文的measureText方法测量文本宽度和字体边界盒高度
      const {
        width: textW,
        fontBoundingBoxAscent,
        fontBoundingBoxDescent,
      } = ctx.measureText(item);
      // 计算文本高度
      const textH = fontBoundingBoxAscent + fontBoundingBoxDescent;
      // 更新最大宽度
      if (textW > width) {
        width = textW;
      }
      // 累加文本高度
      height += textH;
      // 将当前行的文本尺寸推入行尺寸数组
      lineSize.push({ height: textH, width: textW });
    }
  }
  // 将旋转角度转换为度数
  // 将结果转换为以度为单位的角度
  const angle = (rotate + Math.PI) / 180;
  // 计算旋转后的宽度和高度
  // 使用三角函数根据旋转角度和原始尺寸计算旋转后的宽度和高度
  return {
    originWidth: width, // 原始宽度
    originHeight: height, // 原始高度
    width: Math.ceil(
      Math.abs(Math.sin(angle) * height) + Math.abs(Math.cos(angle) * width)
    ), // 旋转后的宽度
    height: Math.ceil(
      Math.abs(Math.sin(angle) * width) + Math.abs(height * Math.cos(angle))
    ), // 旋转后的高度
    lineSize, // 每行文本的尺寸
  };
};


type CanvasData = { width: number; height: number; base64Url: string };

/**
 * 异步获取canvas数据的函数
 * @param {Required<WatermarkOptions>} 参数，包含必要的水印配置选项
 * @returns {Promise<CanvasData>} 返回一个包含canvas数据的Promise，如base64编码的图片数据和尺寸信息
 */
const getCanvasData = async ({
  rotate,
  image,
  content,
  fontStyle,
  gap,
  ...options
}: Required<WatermarkOptions>) => {
  // 创建一个新的canvas元素
  const canvas = document.createElement('canvas');
  // 获取canvas的2D上下文
  const ctx = canvas.getContext('2d');
  // 获取设备的像素比
  const ratio = window.devicePixelRatio;
  // 检查canvas上下文是否存在，若不存在则抛出错误
  if (!ctx) {
    throw new Error('Canvas is not supported');
  }

  /**
   * 配置canvas的大小和属性
   * @param {{ width: number; height: number }} size - 需要的canvas内容区域的大小
   */
  const configCanvas = (size: { width: number; height: number }) => {
    // 计算canvas的最终宽度和高度，包括边距
    const canvasW = gap[0] + size.width;
    const canvasH = gap[1] + size.height;
    // 设置canvas的宽度和高度，包括设备像素比
    canvas.setAttribute('width', `${canvasW * ratio}px`);
    canvas.setAttribute('height', `${canvasH * ratio}px`);
    // 设置canvas的样式宽度和高度
    canvas.style.width = `${canvasW}px`;
    canvas.style.height = `${canvasH}px`;
    // 将画布的参考点移动到中心，并应用设备像素比和旋转
    ctx.translate((canvasW * ratio) / 2, (canvasH * ratio) / 2);
    ctx.scale(ratio, ratio);
    // 根据rotate参数旋转画布
    const rotateAngle = (rotate * Math.PI) / 180;
    ctx.rotate(rotateAngle);
  };

  /**
   * 在canvas上绘制文本
   * @returns {Promise<CanvasData>} 返回一个包含绘制结果的Promise
   */
  const drawText = (): Promise<CanvasData> => {
    // 设置字体样式
    const { fontSize, color, fontWeight, fontFamily } = fontStyle;
    ctx.font = `${fontWeight} ${typeof fontSize === 'number' ? fontSize + 'px' : fontSize} ${fontFamily}`;
    // 测量文本尺寸
    const measureSize = measureTextSize(ctx, [content].flat(), rotate);
    // 计算canvas的宽度和高度
    const width = options.width || measureSize.width;
    const height = options.height || measureSize.height;
    // 配置canvas大小
    configCanvas({ width, height });
    // 设置文本填充颜色和字体样式
    ctx.fillStyle = color!;
    ctx.font = `${fontWeight} ${typeof fontSize === 'number' ? fontSize + 'px' : fontSize} ${fontFamily}`;
    // 设置文本基线
    ctx.textBaseline = 'top';
    // 分别绘制每一行文本
    [content].flat().forEach((item, index) => {
      const { height: lineHeight, width: lineWidth } =
        measureSize.lineSize[index];
      // 计算文本的起始绘制位置
      const xStartPoint = -lineWidth / 2;
      const yStartPoint =
        -(options.height || measureSize.originHeight) / 2 + lineHeight * index;
      // 绘制文本
      ctx.fillText(
        item,
        xStartPoint,
        yStartPoint,
        options.width || measureSize.originWidth
      );
    });
    // 返回canvas数据的Promise
    return Promise.resolve({ base64Url: canvas.toDataURL(), height, width });
  };

  /**
   * 在canvas上绘制图片
   * @returns {Promise<CanvasData>} 返回一个包含绘制结果的Promise
   */ const drawImage = () => {
    return new Promise<CanvasData>(() => {
      // 创建一个新的图片对象
      const img = new Image();
      // 设置跨域属性
      img.crossOrigin = 'anonymous';
      img.referrerPolicy = 'no-referrer';
      // 设置图片源
      img.src = image;
      // 图片加载成功后的处理逻辑（此处为空，可能需要根据实际需求添加）
      img.onload = () => { };
      // 图片加载失败时，尝试绘制文本水印
      img.onerror = () => {
        return drawText();
      };
    });
  };
  // 根据image参数的存在与否，决定是绘制图片还是文本
  return image ? drawImage() : drawText();
};


/**
 * 使用自定义水印选项创建并应用水印。
 * @param props 水印选项，包括文本、字体、颜色等配置。
 * @returns 返回一个对象，包含更新水印选项的方法。
 */
export default function useWatermark(props: WatermarkOptions) {
  // 初始化水印选项状态，确保所有选项都是必填的
  const [options, setOptions] = useState(
    () => props as Required<WatermarkOptions>
  );
  // 用于存储水印元素的引用。
  const watermarkEl = useRef<HTMLDivElement>();
  // 用于观察容器变化的MutationObserver实例的引用。
  const mutationObserver = useRef<MutationObserver>();
  // 创建并绘制水印。
  const drawWatermark = useCallback(() => {
    // 获取容器元素
    const container = props.getContainer?.();
    // 如果没有容器，直接返回。
    if (!container) {
      return;
    }
    // 根据当前选项获取水印的canvas数据。
    getCanvasData(options).then(({ base64Url, width, height }) => {
      // 计算水印元素的样式。
      const offsetLeft = options.offset[0] + 'px';
      const offsetTop = options.offset[1] + 'px';
      const wmStyle = `
        width: calc(100% - ${offsetLeft});
        height: calc(100% - ${offsetTop});
        position: absolute;
        top: ${offsetTop};
        left: ${offsetLeft};
        bottom: 0;
        right: 0;
        pointer-events: none;
        z-index: ${options.zIndex};
        background-position: 0 0;
        background-size: ${options.gap[0] + width}px ${options.gap[1] + height}px;
        background-repeat: repeat;
        background-image: url(${base64Url});
    `;
      // 如果当前没有水印元素，创建并添加到容器中。
      if (!watermarkEl.current) {
        const div = document.createElement('div');
        watermarkEl.current = div;
        container.append(div);
        container.style.position = 'relative';
      }
      // 应用水印样式。
      watermarkEl.current?.setAttribute('style', wmStyle.trim());

      // 如果当前mutationObserver存在，断开连接。
      mutationObserver.current?.disconnect();
      // 创建新的mutationObserver来观察容器变化
      mutationObserver.current = new MutationObserver((mutations) => {
        // 检查是否有水印元素被移除或容器属性发生变化。
        const isChanged = mutations.some((mutation) => {
          let flag = false;
          // 检查是否有水印元素被移除。
          if (mutation.removedNodes.length) {
            flag = Array.from(mutation.removedNodes).some(
              (node) => node === watermarkEl.current
            );
          }
          // 检查水印元素属性是否发生变化。
          if (
            mutation.type === 'attributes' &&
            mutation.target === watermarkEl.current
          ) {
            flag = true;
          }
          return flag;
        });
        // 如果检测到变化，移除水印并重新绘制。
        if (isChanged) {
          watermarkEl.current?.parentNode?.removeChild(watermarkEl.current);
          watermarkEl.current = undefined;
          drawWatermark();
        }
      });
      mutationObserver.current.observe(container, {
        attributes: true,
        subtree: true,
        childList: true,
      });
    });
  }, [options, props.getContainer]);
  // 在组件挂载时调用drawWatermark
  useEffect(() => {
    drawWatermark();
  }, [drawWatermark]);
  // 返回一个对象，包含更新水印选项的方法。
  return useMemo(
    () => ({
      generateWatermark: (newOptions: Partial<WatermarkOptions>) => {
        setOptions(Object.assign({}, options, newOptions));
      },
    }),
    [options]
  );
}
