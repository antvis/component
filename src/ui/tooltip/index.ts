import { Group } from '@antv/g';
import { deepMix, substitute, isString, isElement } from '@antv/util';
import { createDom } from '@antv/dom-util';
import { GUI } from '../../core/gui';
import { applyStyleSheet, parseHTML, throttle, ifShow } from '../../util';
import { CLASS_NAME, TOOLTIP_STYLE } from './constant';
import type { TooltipCfg, TooltipOptions, TooltipItem, TooltipPosition } from './types';

export type { TooltipCfg, TooltipOptions };

export class Tooltip extends GUI<Required<TooltipCfg>> {
  public static tag = 'tooltip';

  private static defaultOptions = {
    style: {
      x: 0,
      y: 0,
      visibility: 'visible',
      title: '',
      position: 'bottom-right',
      offset: [5, 5],
      follow: true,
      enterable: false,
      autoPosition: true,
      items: [],
      container: {
        x: 0,
        y: 0,
      },
      bounding: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
      template: {
        container: `<div class="${CLASS_NAME.CONTAINER}"></div>`,
        title: `<div class="${CLASS_NAME.TITLE}"></div>`,
        item: `<li class="${CLASS_NAME.LIST_ITEM}" data-index={index}>
        <span class="${CLASS_NAME.NAME}">
          <span class="${CLASS_NAME.MARKER}" style="background:{color}"></span>
          <span class="${CLASS_NAME.NAME_LABEL}" title="{name}">{name}</span>
        </span>
        <span class="${CLASS_NAME.VALUE}" title="{value}">{value}</span>
      </li>`,
      },
      style: TOOLTIP_STYLE,
    },
  };

  public get HTMLTooltipElement() {
    return this.element;
  }

  public getContainer() {
    return this.element;
  }

  public set position([x, y]: [number, number]) {
    this.attr({ x, y });
    this.updatePosition();
  }

  private get elementSize() {
    const width = this.element.offsetWidth;
    const height = this.element.offsetHeight;
    return { width, height };
  }

  private get items(): Required<TooltipItem[]> {
    const { items } = this.attributes;
    return items.map(({ name = '', value, color = 'black', index, ...rest }, idx) => {
      return { name, value, color, index: index ?? idx, ...rest };
    });
  }

  private get HTMLTooltipItemsElements() {
    const { template } = this.attributes;
    const itemsHTML: HTMLElement[] = [];
    this.items.forEach((item) => {
      itemsHTML.push(createDom(substitute(template.item!, item)) as HTMLElement);
    });
    return itemsHTML;
  }

  /**
   * 解析自定义内容
   */
  private get customContent() {
    const { customContent } = this.attributes;
    if (isString(customContent)) return parseHTML(customContent);
    if (isElement(customContent)) return customContent as HTMLElement;
    return undefined;
  }

  private element!: HTMLElement;

  private visibility: 'visible' | 'hidden' = 'visible';

  constructor(options: TooltipOptions) {
    super(deepMix({}, Tooltip.defaultOptions, options));
    this.initShape();
    this.render(this.attributes, this);
  }

  public render(attributes: TooltipCfg, container: Group) {
    this.renderHTMLTooltipElement();
    this.updatePosition();
  }

  public update(cfg: Partial<TooltipCfg>) {
    this.attr(deepMix({}, this.attributes, cfg));
    this.render(this.attributes, this);
  }

  public clear() {
    // 清空容器内容
    this.element.innerHTML = '';
  }

  public destroy() {
    this.element?.remove();
    this.customContent?.remove();
  }

  public show() {
    this.visibility = 'visible';
    this.element.style.visibility = 'visible';
  }

  public hide() {
    this.visibility = 'hidden';
    this.element.style.visibility = 'hidden';
  }

  /**
   * 初始化容器
   */
  private initShape() {
    const { template } = this.attributes;
    this.element = createDom(template.container!) as HTMLElement;
    if (this.id) this.element.setAttribute('id', this.id);
  }

  /**
   * 更新 HTML 上的内容
   */
  private renderHTMLTooltipElement() {
    const { title, enterable } = this.attributes;
    const container = this.element;
    const { customContent } = this;

    this.element.style.pointerEvents = enterable ? 'auto' : 'none';

    this.clear();
    if (customContent) container.appendChild(customContent);
    else {
      const { template } = this.attributes;
      if (title) {
        // 置入title
        container.innerHTML = template.title!;
        // 更新标题
        container.getElementsByClassName(CLASS_NAME.TITLE)[0].innerHTML = title;
      } else container.getElementsByClassName(CLASS_NAME.TITLE)?.[0]?.remove();

      const itemsHTML = this.HTMLTooltipItemsElements;
      const ul = document.createElement('ul');
      ul.className = CLASS_NAME.LIST;
      itemsHTML.forEach((item) => {
        ul.appendChild(item);
      });
      this.element.appendChild(ul);
    }

    // 应用样式表
    const { style } = this.attributes;
    applyStyleSheet(container, style);
    this.element.style.visibility = this.visibility;
  }

  /**
   * 根据 position 和指针位置，计算出 tooltip 相对于指针的偏移量
   * @param assignPosition {TooltipPosition} tooltip相对于指针的位置，不指定时使用默认参数
   */
  private getRelativeOffsetFromCursor(assignPosition?: TooltipPosition) {
    const { position, offset } = this.attributes;
    const positionName = (assignPosition || position).split('-') as ('top' | 'bottom' | 'left' | 'right')[];
    const positionScore = { left: [-1, 0], right: [1, 0], top: [0, -1], bottom: [0, 1] };

    const { width, height } = this.elementSize;
    let absolutelyOffset = [-width / 2, -height / 2];
    positionName.forEach((pos) => {
      const [abs1, abs2] = absolutelyOffset;
      const [pos1, pos2] = positionScore[pos];
      absolutelyOffset = [abs1 + (width / 2 + offset[0]) * pos1, abs2 + (height / 2 + offset[1]) * pos2];
    });
    return absolutelyOffset as [number, number];
  }

  /**
   * 将相对于指针的偏移量生效到dom元素上
   */
  private setOffsetPosition([offsetX, offsetY]: [number, number]) {
    const {
      x = 0,
      y = 0,
      container: { x: cx, y: cy },
    } = this.attributes;

    // // 设置属性
    this.element.style.left = `${x + cx + offsetX}px`;
    this.element.style.top = `${y + cy + offsetY}px`;
  }

  /**
   * 更新tooltip的位置
   */
  @throttle(100)
  private updatePosition() {
    // 尝试当前的位置使用默认position能否放下
    // 如果不能，则改变取溢出边的反向position
    /**
     * 默认位置
     *    ⬇️
     * 计算自动调整位置
     *    ⬇️
     * 实际摆放位置
     */
    this.setOffsetPosition(this.autoPosition(this.getRelativeOffsetFromCursor()));
  }

  /**
   * 计算自动调整位置后的相对位置
   * @param offsetX 根据position计算的横向偏移量
   * @param offsetY 根据position计算的纵向偏移量
   */
  private autoPosition([offsetX, offsetY]: [number, number]): [number, number] {
    const { x: cursorX, y: cursorY, autoPosition, bounding } = this.attributes;
    if (!autoPosition) return [offsetX, offsetY];
    // 更新前的位置和宽度
    const { offsetWidth, offsetHeight } = this.element;
    // 预期放置的位置
    const [expectLeft, expectTop] = [cursorX + offsetX, cursorY + offsetY];

    const { position } = this.attributes;
    // 反方向
    const inversion = {
      left: 'right',
      right: 'left',
      top: 'bottom',
      bottom: 'top',
    };
    // 各个边界是否超出容器边界
    const { x: boundingX, y: boundingY, width: boundingWidth, height: boundingHeight } = bounding;
    const edgeCompare = {
      left: expectLeft < boundingX,
      right: expectLeft + offsetWidth > boundingX + boundingWidth,
      top: expectTop < boundingY,
      bottom: expectTop + offsetHeight > boundingY + boundingHeight,
    };
    // 修正的位置
    const correctivePosition: string[] = [];
    // 判断是否超出边界
    (position.split('-') as ('top' | 'bottom' | 'left' | 'right')[]).forEach((pos) => {
      // 如果在当前方向超出边界，则设置其反方向
      if (edgeCompare[pos]) correctivePosition.push(inversion[pos]);
      else correctivePosition.push(pos);
    });

    const correctedPositionString = correctivePosition.join('-');
    return this.getRelativeOffsetFromCursor(correctedPositionString as TooltipPosition);
  }
}
