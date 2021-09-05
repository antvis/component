import { DisplayObject, Group, Text } from '@antv/g';
import { deepMix, isNil, pick } from '@antv/util';
import { GUI } from '../../core/gui';
import { normalPadding } from '../../util';
import { Tag } from '../tag';
import type { BreadcrumbCfg, BreadcrumbOptions, BreadcrumbItem } from './type';

export type { BreadcrumbCfg, BreadcrumbOptions };

export class Breadcrumb extends GUI<Required<BreadcrumbCfg>> {
  /**
   * 标签类型
   */
  public static tag = 'breadcrumb';

  /**
   * 默认参数
   */
  private static defaultOptions = {
    type: Breadcrumb.tag,
    style: {
      separator: {
        text: '/',
        style: {
          fontSize: 14,
          fill: 'rgba(0, 0, 0, 0.45)',
        },
        spacing: 8,
      },
      textStyle: {
        default: {
          fontSize: 14,
          fill: 'rgba(0, 0, 0, 0.45)',
        },
        active: {
          fill: '#5468ff',
          cursor: 'pointer',
        },
      },
      padding: [8, 8, 8, 8],
    },
  };

  /**
   * 面包屑容器
   */
  public container!: Group;

  /**
   * 光标 X 位置
   */
  private cursorX: number = 0;

  /**
   * 光标 Y 位置
   */
  private cursorY: number = 0;

  /**
   *
   * @param options
   */
  constructor(options: BreadcrumbOptions) {
    super(deepMix({}, Breadcrumb.defaultOptions, options));
    this.init();
  }

  public init(): void {
    this.cursorX = 0;
    this.cursorY = 0;
    const { x, y, items, textStyle, padding } = this.attributes;
    const [top, , left] = normalPadding(padding);

    // 创建 container 容器
    this.container = new Group({ name: `${Breadcrumb.tag}-container` });
    this.appendChild(this.container);
    this.container.translate(x + left, y + top);

    items.forEach((item, idx) => {
      const breadcrumbItemShape = new Tag({
        name: `${Breadcrumb.tag}-item`,
        id: item.id,
        style: {
          x: this.cursorX,
          y: this.cursorY,
          text: isNil(item.text) ? item.id : item.text,
          textStyle,
          ...pick(item, ['marker']),
          // 强制不需要背景
          padding: 0,
          backgroundStyle: null,
        },
      });

      // 计算并添加当前 shape 的宽度
      const textBbox = breadcrumbItemShape.getBounds()!;
      const textWidth = textBbox.getMax()[0] - textBbox.getMin()[0];
      const textHeight = textBbox.getMax()[1] - textBbox.getMin()[1];
      this.autoWrap(breadcrumbItemShape, textWidth, textHeight);

      this.container.appendChild(breadcrumbItemShape);
      // 绑定事件
      this.bindEvents(breadcrumbItemShape, item);

      // 最后一个分隔符，不需要渲染
      if (idx !== items.length - 1) {
        this.createSeparator(this.container, textHeight, idx);
      }
    });
  }

  /**
   * 组件更新
   * @param cfg
   */
  public update(cfg: Partial<BreadcrumbCfg>): void {
    this.attr(deepMix({}, this.attributes, cfg));
    this.clear();
    this.init();
  }

  /**
   * 组件清除
   */
  public clear(): void {
    this.container.destroy();
  }

  /**
   * 创建分隔符shape，返回最新的宽度
   * @param y
   * @returns
   */
  private createSeparator(container: Group, height: number, idx: number): void {
    const { separator } = this.attributes;
    const { spacing = 0, text = '/', style } = separator;

    const shape = new Text({
      name: `${Breadcrumb.tag}-separator`,
      id: `${Breadcrumb.tag}-separator-${idx}`,
      style: {
        x: this.cursorX + spacing!,
        y: this.cursorY,
        ...style,
        text,
        // 默认 bottom 对齐，然后再进行偏移 height
        textBaseline: 'bottom',
      },
    });

    // 计算并添加当前 shape 的宽度
    const textBbox = shape.getBounds()!;
    const textWidth = textBbox.getMax()[0] - textBbox.getMin()[0];
    const textHeight = textBbox.getMax()[1] - textBbox.getMin()[1];
    const overflow = this.autoWrap(shape, textWidth + spacing /** 分隔符左边间距 */, textHeight);
    if (!overflow) {
      this.cursorX += spacing /** 分隔符右边间距 */;
    }

    shape.translate(0, height);
    container.appendChild(shape);
  }

  /**
   * 面包屑绑定事件
   * @param shape
   * @param item
   */
  private bindEvents(shape: Tag, item: BreadcrumbItem) {
    const { items, onClick } = this.attributes;

    if (onClick) {
      shape.addEventListener('click', () => {
        onClick.call(shape, item.id, item, items);
      });
    }
  }

  /**
   * 判断是否超出宽度, 然后自动换行
   * @param shape
   */
  private autoWrap(shape: DisplayObject, textWidth: number, textHeight: number): boolean {
    const { width, padding } = this.attributes;
    // 更新光标
    this.cursorX += textWidth;

    if (!isNil(width)) {
      const [, right] = normalPadding(padding);
      const avaliableWidth = width - right;

      if (this.cursorX > avaliableWidth) {
        shape.attr({ x: 0, y: this.cursorY + textHeight });
        // 更新光标
        this.cursorX = textWidth;
        this.cursorY += textHeight;
        return true;
      }
    }

    return false;
  }
}
