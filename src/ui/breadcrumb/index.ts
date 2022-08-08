import { Group, Text } from '@antv/g';
import { deepMix, isNil, pick } from '@antv/util';
import { GUI } from '../../core/gui';
import { maybeAppend, normalPadding, TEXT_INHERITABLE_PROPS } from '../../util';
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
          ...TEXT_INHERITABLE_PROPS,
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
  }

  public render(attributes: BreadcrumbCfg, container: Group) {
    const { x, y, items, textStyle, padding, width, separator } = attributes;
    const [top, right, left] = normalPadding(padding);

    const selection = maybeAppend(container, '.container', 'g')
      .attr('className', 'container')
      .style('x', x + left)
      .style('y', y + top);

    let cursorX = 0;
    let cursorY = 0;

    selection.node().removeChildren(true);
    for (let i = 0; i < items.length; i++) {
      const datum = items[i];
      const shape = new Tag({
        className: 'breadcrumb-item',
        style: {
          x: cursorX,
          y: cursorY,
          text: isNil(datum.text) ? datum.id : datum.text,
          textStyle,
          ...pick(datum, ['marker']),
          // 强制不需要背景
          padding: 0,
          backgroundStyle: null,
        },
      });
      selection.append(() => shape);

      const bounds = shape.getLocalBounds();
      const shapeW = bounds.halfExtents[0] * 2;
      const shapeH = bounds.halfExtents[1] * 2;
      cursorX += shapeW;
      // todo 换行策略还需要考虑 分隔符
      if (!isNil(width)) {
        const avaliableWidth = width! - right;
        if (cursorX > avaliableWidth) {
          shape.attr({ x: 0, y: cursorY + shapeH });
          // 更新光标
          cursorX = shapeW;
          cursorY += shapeH;
        }
      }

      // 绑定事件
      this.bindInnerEvents(shape, datum);

      const { spacing = 0, text = '/', style } = separator || {};
      // 最后一个分隔符，不需要渲染
      if (i !== items.length - 1) {
        const shape = new Text({
          name: `${Breadcrumb.tag}-separator`,
          id: `${Breadcrumb.tag}-separator-${i}`,
          style: {
            ...TEXT_INHERITABLE_PROPS,
            x: cursorX + spacing!,
            y: cursorY + shapeH / 2,
            ...style,
            text,
            textAlign: 'end',
            textBaseline: 'middle',
          },
        });
        selection.append(() => shape);
        const bounds = shape.getLocalBounds();
        cursorX += bounds.halfExtents[0] * 2 + spacing!;
      }
    }
  }

  /**
   * 组件更新
   * @param cfg
   */
  public update(cfg: Partial<BreadcrumbCfg>): void {
    this.attr(deepMix({}, this.attributes, cfg));
    this.render(this.attributes, this);
  }

  /**
   * 面包屑绑定事件
   * @param shape
   * @param item
   */
  private bindInnerEvents(shape: Tag, item: BreadcrumbItem) {
    const { items, onClick } = this.attributes;

    if (onClick) {
      shape.addEventListener('click', () => {
        onClick.call(shape, item.id, item, items);
      });
    }
  }
}
