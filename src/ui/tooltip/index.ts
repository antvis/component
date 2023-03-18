import { createDom } from '@antv/dom-util';
import { substitute } from '@antv/util';
import { GUI } from '../../core';
import { Group } from '../../shapes';
import { applyStyleSheet, throttle } from '../../util';
import { CLASS_NAME, TOOLTIP_STYLE } from './constant';
import type { TooltipOptions, TooltipPosition, TooltipStyleProps } from './types';

export type { TooltipStyleProps, TooltipOptions };

export class Tooltip extends GUI<TooltipStyleProps> {
  public static tag = 'tooltip';

  public get HTMLTooltipElement() {
    return this.element;
  }

  public getContainer() {
    return this.element;
  }

  public set position([x, y]: [number, number]) {
    this.attributes.x = x;
    this.attributes.y = y;
    this.updatePosition();
  }

  private get elementSize() {
    const width = this.element.offsetWidth;
    const height = this.element.offsetHeight;
    return { width, height };
  }

  private get HTMLTooltipItemsElements() {
    const { data, template } = this.attributes;
    return data.map(({ name = '', color = 'black', index, ...rest }, idx) => {
      const datum = { name, color, index: index ?? idx, ...rest };
      return createDom(substitute(template.item!, datum)) as HTMLElement;
    });
  }

  private element!: HTMLElement;

  constructor(options: TooltipOptions) {
    super(options, {
      data: [],
      x: 0,
      y: 0,
      visibility: 'visible',
      title: '',
      position: 'bottom-right',
      defaultPosition: 'bottom-right',
      offset: [5, 5],
      enterable: false,
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
    });
    this.initShape();
    this.render(this.attributes, this);
  }

  public render(attributes: TooltipStyleProps, container: Group) {
    this.renderHTMLTooltipElement();
    this.updatePosition();
  }

  public destroy() {
    this.element?.remove();
    super.destroy();
  }

  /**
   * 如果设置了坐标值，显示过程中会立即更新位置并关闭过渡动画
   */
  public show(x?: number, y?: number) {
    const disableTransition = x !== undefined && y !== undefined;
    if (disableTransition) {
      const transition = this.element.style.transition;
      this.element.style.transition = 'none';
      this.position = [x ?? +this.attributes.x, y ?? +this.attributes.y];
      setTimeout(() => {
        this.element.style.transition = transition;
      }, 10);
    }
    this.element.style.visibility = 'visible';
  }

  public hide() {
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

  private prevCustomContentKey = this.attributes.contentKey;

  private renderCustomContent() {
    if (this.prevCustomContentKey !== undefined && this.prevCustomContentKey === this.attributes.contentKey) return;
    this.prevCustomContentKey = this.attributes.contentKey;
    const { content } = this.attributes;
    if (!content) return;
    if (typeof content === 'string') this.element.innerHTML = content;
    else this.element.replaceChildren(content);
  }

  /**
   * 更新 HTML 上的内容
   */
  private renderHTMLTooltipElement() {
    const { template, title, enterable, style, content } = this.attributes;
    const container = this.element;
    this.element.style.pointerEvents = enterable ? 'auto' : 'none';
    if (content) this.renderCustomContent();
    else {
      if (title) {
        container.innerHTML = template.title!;
        container.getElementsByClassName(CLASS_NAME.TITLE)[0].innerHTML = title;
      } else container.getElementsByClassName(CLASS_NAME.TITLE)?.[0]?.remove();
      const itemsElements = this.HTMLTooltipItemsElements;
      const ul = document.createElement('ul');
      ul.className = CLASS_NAME.LIST;
      ul.replaceChildren(...itemsElements);
      const list = this.element.querySelector(`.${CLASS_NAME.LIST}`);
      if (list) list.replaceWith(ul);
      else container.appendChild(ul);
    }

    applyStyleSheet(container, style);
  }

  /**
   * 根据 position 和指针位置，计算出 tooltip 相对于指针的偏移量
   * @param assignPosition {TooltipPosition} tooltip相对于指针的位置，不指定时使用默认参数
   */
  private getRelativeOffsetFromCursor(assignPosition?: TooltipPosition) {
    const { position, offset } = this.attributes;
    const interPosition = assignPosition || position;
    const finalPosition = (interPosition === 'auto' ? 'bottom-right' : interPosition).split('-') as (
      | 'top'
      | 'bottom'
      | 'left'
      | 'right'
    )[];
    const positionScore = { left: [-1, 0], right: [1, 0], top: [0, -1], bottom: [0, 1] };
    const { width, height } = this.elementSize;
    let absolutelyOffset = [-width / 2, -height / 2];
    finalPosition.forEach((pos) => {
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
    this.element.style.left = `${+x + cx + offsetX}px`;
    this.element.style.top = `${+y + cy + offsetY}px`;
  }

  /**
   * 更新tooltip的位置
   */
  @throttle(100, true)
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
    const { x: cursorX, y: cursorY, bounding, position, defaultPosition } = this.attributes;
    if (position !== 'auto') return [offsetX, offsetY];
    // 更新前的位置和宽度
    const { offsetWidth, offsetHeight } = this.element;
    // 预期放置的位置
    const [expectLeft, expectTop] = [+cursorX + offsetX, +cursorY + offsetY];

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
    (defaultPosition.split('-') as ('top' | 'bottom' | 'left' | 'right')[]).forEach((pos) => {
      // 如果在当前方向超出边界，则设置其反方向
      if (edgeCompare[pos]) correctivePosition.push(inversion[pos]);
      else correctivePosition.push(pos);
    });

    const correctedPositionString = correctivePosition.join('-');
    return this.getRelativeOffsetFromCursor(correctedPositionString as TooltipPosition);
  }
}
