import { Group, Rect, Text } from '@antv/g';
import { deepMix, isNil, last, omit } from '@antv/util';
import { DisplayObject } from 'types';
import { GUI } from '../core/gui';
import { BreadCrumbAttrs, BreadCrumbOptions, BreadCrumbItem } from './type';
import { ACTIVE_STYLE, INACTIVE_STYLE, HOVER_STYLE } from './constant';
import { transformPadding } from './util';

export { BreadCrumbAttrs, BreadCrumbOptions };

export class BreadCrumb extends GUI<BreadCrumbAttrs> {
  /**
   * 标签类型
   */
  public static tag = 'breadcrumb';

  /**
   * 默认参数
   */
  private static defaultOptions = {
    type: BreadCrumb.tag,
    attrs: {
      separator: {
        text: '/',
        style: omit(INACTIVE_STYLE, ['cursor']),
        spacing: 8,
      },
      textStyle: {
        default: INACTIVE_STYLE,
        active: ACTIVE_STYLE,
      },
      padding: [8, 8, 8, 8],
    },
  };

  /**
   * 面包屑容器
   */
  private containerShape: DisplayObject;

  /**
   * 面包屑子项容器
   */
  private breadcrumbItemShapes: DisplayObject[] = [];

  /**
   * 分隔符容器
   */
  private separatorShapes: DisplayObject[] = [];

  /**
   * 光标 X 位置
   */
  private cursorX: number = 0;

  /**
   * 光标 Y 位置
   */
  private cursorY: number = 0;

  /**
   * 行号
   */
  private lineNumber: number = 1;

  /**
   *
   * @param options
   */
  constructor(options: BreadCrumbOptions) {
    super(deepMix({}, BreadCrumb.defaultOptions, options));

    this.initCursor();
    this.init();
  }

  /**
   * 初始化 光标位置
   */
  private initCursor() {
    const { textStyle, padding } = this.attributes;
    const newPadding = transformPadding(padding);
    // 如果不存在 itemShape 一定是第一行
    if (!this.breadcrumbItemShapes.length) {
      this.lineNumber = 1;
    }
    // eslint-disable-next-line prefer-destructuring
    this.cursorX = newPadding[3];
    this.cursorY = textStyle.default.lineHeight * this.lineNumber + newPadding[0];
  }

  public init(): void {
    const { x, y, items } = this.attributes;

    items.forEach((item, idx) => {
      // 非首项位置后面，渲染分隔符
      if (idx !== 0) {
        this.createSeparator();
      }

      const style = this.getMixinStyle(item);
      const breadcrumbItemShape = new Text({
        attrs: {
          tag: `${BreadCrumb.tag}-item`,
          x: this.cursorX,
          y: this.cursorY,
          lineHeight: style.fontSize,
          ...style,
          text: item.name,
        },
      });

      if (idx !== items.length - 1) {
        // 非最后一项的 item 绑定事件
        this.bindEvents(breadcrumbItemShape, item);
      }

      // 计算并添加当前 shape 的宽度
      const textBbox = breadcrumbItemShape.getBounds();
      const textWidth = textBbox.getMax()[0] - textBbox.getMin()[0];
      this.isOverWidth(breadcrumbItemShape, this.cursorX + textWidth);
      this.cursorX += textWidth;

      // 存入 breadcrumbItemShapes
      this.breadcrumbItemShapes.push(breadcrumbItemShape);
    });

    // 创建 container 容器
    this.createBreadcrumbContainer();

    // 添加面包屑和分隔符的视图
    this.breadcrumbItemShapes.forEach((shape) => this.appendChild(shape));
    this.separatorShapes.forEach((shape) => this.appendChild(shape));

    // 设置位置
    this.translate(x, y);
  }

  private getMixinStyle(breadcrumbItem: BreadCrumbItem) {
    const { items, textStyle } = this.attributes;
    // 判断是否是激活态（最后一项）的面包屑
    const isActived = !!(last(items).name === breadcrumbItem.name);
    return isActived ? textStyle.active : textStyle.default;
  }

  /**
   * 创建分隔符shape，返回最新的宽度
   * @param y
   * @returns
   */
  private createSeparator() {
    const { separator } = this.attributes;
    const { spacing, text, style } = separator;

    let separatorShape;
    // 如果分隔符是字符串，创建 Text
    if (typeof text === 'string') {
      separatorShape = new Text({
        attrs: {
          tag: `${BreadCrumb.tag}-separator`,
          x: this.cursorX + spacing,
          y: this.cursorY,
          lineHeight: style.fontSize,
          ...style,
          text,
        },
      });
    } else {
      // 如果传入的是 Group 组件
      (text as Group).attr({ x: this.cursorX + spacing, y: 0 });
      separatorShape = text;
    }

    // 计算并添加当前 shape 的宽度
    const textBbox = separatorShape.getBounds();
    const textWidth = textBbox.getMax()[0] - textBbox.getMin()[0] + spacing * 2;

    this.isOverWidth(separatorShape, this.cursorX + textWidth);
    this.cursorX += textWidth;

    // 存入 separatorShapes
    this.separatorShapes.push(separatorShape);
  }

  /**
   * 创建面包屑组件容器
   */
  private createBreadcrumbContainer() {
    const { padding } = this.attributes;
    let { height, width } = this.attributes;
    const newPadding = transformPadding(padding);
    if (isNil(height)) {
      height = this.cursorY + newPadding[2];
    }
    if (isNil(width)) {
      width = this.cursorX + newPadding[1];
    }
    this.containerShape = new Rect({
      attrs: {
        tag: `${BreadCrumb.tag}-container`,
        x: 0,
        y: 0,
        width,
        height,
      },
    });
    this.appendChild(this.containerShape);
  }

  /**
   * 面包屑绑定事件
   * @param shape
   * @param item
   */
  private bindEvents(shape: DisplayObject, item: BreadCrumbItem) {
    const style = this.getMixinStyle(item);
    const { items, onclick } = this.attributes;

    shape.on('mouseenter', () => {
      /**
       * fixMe： hover 颜色未改变
       */
      shape.attr(HOVER_STYLE);
    });

    shape.on('mouseleave', () => {
      shape.attr(style);
    });

    if (onclick) {
      shape.on('click', () => {
        onclick.call(shape, item.name, item, items);
      });
    }
  }

  /**
   * 判断是否超出宽度
   * @param shape
   * @param newWidth
   */
  private isOverWidth(shape: DisplayObject, newWidth: number) {
    const { width, padding } = this.attributes;
    if (!isNil(width)) {
      const newPadding = transformPadding(padding);
      const contentWidth = width - newPadding[1];
      if (newWidth > contentWidth) {
        this.lineNumber += 1;
        this.initCursor();
        shape.attr({
          x: this.cursorX,
          y: this.cursorY,
        });
      }
    }
  }

  /**
   * 组件更新
   * @param cfg
   */
  public update(cfg: BreadCrumbAttrs): void {
    this.attr(deepMix({}, this.attributes, cfg));
  }

  /**
   * 组件清除
   */
  public clear(): void {
    this.destroy();
  }

  attributeChangedCallback(name: string, value: any): void {}
}
