import { Rect, Group } from '@antv/g';
import { deepMix, isUndefined, max } from '@antv/util';
import { GUI } from '../../core/gui';
import { Button } from '../button';
import { ButtonPosition, PageNavigatorCfg, PageNavigatorOptions } from './types';
import { getShapeSpace } from '../../util';
import type { DisplayObject } from '../../types';

export { PageNavigatorCfg, PageNavigatorOptions } from './types';

interface Page {
  x: number;
  y: number;
  width: number;
  height: number;
}

type PlayState = 'idle' | 'running' | 'finished';

export class PageNavigator extends GUI<PageNavigatorCfg> {
  public static tag = 'pageNavigator';

  /**
   * 当前页面的索引
   */
  private currPage: number;

  /**
   * 向前翻页按钮
   */
  private prevButton!: Button;

  /**
   * 向后翻页按钮
   */
  private nextButton!: Button;

  /**
   * 页码，可以是 1/5 ，也可以是 1 2 3 4 5 这种
   */
  private paginationGroup!: Group;

  /**
   * 显示内容的窗口
   */
  private pageView!: Rect;

  private fullView!: DisplayObject;

  /**
   * 当前是否正在翻页
   */
  private playState: PlayState = 'idle';

  private finishedPromise!: Promise<any> | null;

  private resolveFinishedPromise!: Function;

  private get finished() {
    if (!this.finishedPromise) {
      this.finishedPromise = new Promise((resolve) => {
        this.resolveFinishedPromise = () => {
          this.finishedPromise = null;
          resolve(this.currPage);
        };
      });
    }
    if (this.playState === 'idle') {
      this.resolveFinishedPromise();
    }
    return this.finishedPromise;
  }

  /**
   * 一共有多少页
   */
  private get totalPages(): number {
    const { width, height, pageWidth, pageHeight, orient, pageLimit, pageCallback } = this.attributes;

    if (pageCallback || pageLimit !== Infinity) return pageLimit!;
    let totalPages = 0;
    if (orient === 'horizontal') {
      totalPages = Math.ceil(width! / pageWidth);
    } else {
      totalPages = Math.ceil(height! / pageHeight);
    }
    return totalPages;
  }

  private get view() {
    return this.fullView;
  }

  private set view(view: DisplayObject) {
    this.fullView = view;
    const { width, height } = this.attributes;
    if (!width || !height) {
      const { width: w, height: h } = getShapeSpace(view);
      this.attr({
        width: w,
        height: h,
      });
    }
  }

  private static defaultOptions = {
    type: PageNavigator.tag,
    style: {
      x: 0,
      y: 0,
      effect: 'linear',
      duration: 200,
      orient: 'horizontal', // 默认横向翻页
      initPageNum: 1,
      pageLimit: Infinity,
      loop: false,
      button: {
        prev: {
          text: '上一页',
          spacing: 0,
        },
        next: {
          text: '下一页',
          spacing: 0,
        },
        style: {
          default: {},
          active: {},
          disabled: {},
        },
        spacing: 5,
        position: 'bottom',
      },
      pagination: {
        type: 'currTotal',
        style: {
          default: {},
          active: {},
        },
        separator: '/',
        spacing: 5,
        position: 'bottom',
      },
    },
  };

  constructor(options: PageNavigatorOptions) {
    super(deepMix({}, PageNavigator.defaultOptions, options));
    const { view, initPageNum } = this.attributes;
    this.currPage = initPageNum!;
    // 指定宽高
    this.view = view;
    this.init();
  }

  public init() {
    this.initShape();
    // 更新窗口
    this.updatePageView();
    // 更新背景
    this.updateFullView();
    // 更新按钮
    this.updateButton();
    this.updateButtonState();
    // 调整布局
    this.adjustLayout();
    // 绑定事件
    this.bindEvents();
  }

  public update(cfg: Partial<PageNavigatorCfg>) {
    this.attr(deepMix({}, this.attributes, cfg));
    this.updatePageView();
    if ('view' in cfg) {
      const { view } = cfg;
      this.view.style.clipPath = null;
      this.removeChild(this.view);
      // 更新full view
      this.view = view!;
      this.view.style.clipPath = this.pageView;
      this.appendChild(this.view);
    }
    this.updateButton();
    this.updateButtonState();
    this.adjustLayout();
  }

  public clear() {}

  /**
   * 从xx页翻到xx页
   * from 默认为当前页
   */
  public goTo(to: number, from?: number) {
    if (this.playState === 'idle') {
      const { effect, duration } = this.attributes;
      const { x: fromX, y: fromY } = this.getPageViewSpace(isUndefined(from) ? this.currPage : from);
      const { x: toX, y: toY } = this.getPageViewSpace(to);
      const currX = this.view.attr('x');
      const currY = this.view.attr('y');
      const [targetX, targetY] = [currX + fromX - toX, currY + fromY - toY];

      this.playState = 'running';
      // 播放动画
      this.pageView.animate(
        [{ transform: `translate(${fromX}px, ${fromY}px)` }, { transform: `translate(${toX}px, ${toY}px)` }],
        { duration, easing: effect }
      );

      const animation = this.view.animate(
        [{ transform: `translate(${currX}px, ${currY}px)` }, { transform: `translate(${targetX}px, ${targetY}px)` }],
        { duration, easing: effect }
      );
      // 设置最终位置
      animation?.finished.then(() => {
        this.pageView.attr({ x: toX, y: toY });
        this.view.attr({ x: targetX, y: targetY });
        this.currPage = to;
        this.updateButtonState();
        this.resolveFinishedPromise();
        this.playState = 'idle';
      });
    }

    return this.finished;
  }

  /**
   * 向前翻页
   */
  public prev() {
    const { loop } = this.attributes;
    const page = this.currPage;
    let to = page - 1;
    if (to <= 1) to = loop ? this.totalPages : 1;
    return this.goTo(to);
  }

  /**
   * 向后翻页
   */
  public next() {
    const { loop } = this.attributes;
    const { totalPages } = this;
    const page = this.currPage;
    let to = page + 1;
    if (to > totalPages!) to = loop ? 1 : totalPages;
    return this.goTo(to);
  }

  private initShape() {
    // 初始化 窗口
    this.pageView = new Rect({
      name: 'pageView',
      style: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
    });
    this.view.style.clipPath = this.pageView;
    // 将全景图挂载到翻页器
    this.appendChild(this.view);

    // 初始化按钮
    this.prevButton = new Button({
      name: 'prevButton',
      style: {
        ...PageNavigator.defaultOptions.style.button.prev,
        onClick: this.prev.bind(this),
      },
    });
    this.appendChild(this.prevButton);
    this.nextButton = new Button({
      name: 'nextButton',
      style: {
        ...PageNavigator.defaultOptions.style.button.next,
        onClick: this.next.bind(this),
      },
    });
    this.appendChild(this.nextButton);

    // 页码
    this.paginationGroup = new Group({
      name: 'paginationGroup',
    });
    this.appendChild(this.paginationGroup);
  }

  private updatePageView() {
    this.pageView.attr(this.getPageViewSpace(this.currPage));
  }

  private updateFullView() {
    this.view.attr(this.calcFullViewPosition(this.currPage));
  }

  private updateButton() {
    const { button } = this.attributes;
    const { prev, next } = button!;
    prev && this.prevButton.update(prev);
    next && this.nextButton.update(next);
  }

  /**
   * 更新 button 状态
   */
  private updateButtonState() {
    const { loop } = this.attributes;
    if (!loop) {
      if (this.currPage === this.totalPages) {
        this.nextButton.update({ disabled: true });
      } else {
        this.nextButton.update({ disabled: false });
      }
      if (this.currPage === 1) {
        this.prevButton.update({ disabled: true });
      } else {
        this.prevButton.update({ disabled: false });
      }
    }
  }

  /**
   * 根据页码获得该页的位置
   */
  private getPageViewSpace(num: number): Page {
    const { orient, pageWidth, pageHeight, pageCallback } = this.attributes;
    const pageSpace = { x: 0, y: 0, width: pageWidth, height: pageHeight };
    const { totalPages } = this;
    if (pageCallback) return { ...pageSpace, ...pageCallback(num) };
    if (num > totalPages! || num < 1) return pageSpace;
    if (orient === 'vertical') {
      pageSpace.y = (num - 1) * pageHeight;
    } else if (orient === 'horizontal') {
      pageSpace.x = (num - 1) * pageWidth;
    }
    return pageSpace;
  }

  /**
   * 计算切换到第num页时，fullView应当放置的位置
   */
  private calcFullViewPosition(num: number): { x: number; y: number } {
    // 第1页的pageView位置 应当对应fullView 的位置
    const { x: p1X, y: p1Y } = this.getPageViewSpace(1);
    const { x: pnX, y: pnY } = this.getPageViewSpace(num);
    const [diffX, diffY] = [-pnX + p1X, -pnY + p1Y];
    return { x: diffX, y: diffY };
  }

  private bindEvents() {
    // 按钮点击事件
    // this.prevButton.addEventListener('click', () => this.prev());
    // this.nextButton.addEventListener('click', () => this.next());
  }

  /**
   * 调整布局
   */
  private adjustLayout() {
    this.adjustButton();
  }

  /**
   * 调整button位置
   */
  private adjustButton() {
    const { button, pageWidth, pageHeight } = this.attributes;
    const { position, spacing } = button as { position: ButtonPosition; spacing: number };
    const { width: prevWidth, height: prevHeight } = getShapeSpace(this.prevButton);
    const { width: nextWidth, height: nextHeight } = getShapeSpace(this.nextButton);

    let prevX = 0;
    let prevY = 0;
    let nextX = 0;
    let nextY = 0;
    if (position === 'horizontal') {
      /**
       *  ⬅️ ||||||||| ➡️
       */
      prevX = -(spacing + prevWidth);
      prevY = (pageHeight - prevHeight) / 2;
      nextX = spacing + pageWidth;
      nextY = (pageHeight - nextHeight) / 2;
    } else if (position === 'vertical') {
      /**
       *     ⬆️
       *  |||||||||
       *     ⬇️
       */
      prevX = (pageWidth - prevWidth) / 2;
      prevY = -(spacing + prevHeight);
      nextX = (pageWidth - nextWidth) / 2;
      nextY = spacing + pageHeight;
    } else if (position === 'top') {
      /**
       *    ⬅️ ➡️
       *  |||||||||
       */
      const height = max([prevHeight, nextHeight]) as number;
      prevX = (pageWidth - spacing) / 2 - prevWidth;
      prevY = -(spacing + height);
      nextX = (pageWidth + spacing) / 2;
      nextY = -(spacing + height);
    } else if (position === 'bottom') {
      /**
       *  |||||||||
       *    ⬅️ ➡️
       */
      prevX = (pageWidth - spacing) / 2 - prevWidth;
      prevY = spacing + pageHeight;
      nextX = (pageWidth + spacing) / 2;
      nextY = prevY;
    } else if (position === 'left') {
      /**
       * ⬅️ ➡️  |||||||||
       */
      const height = max([prevHeight, nextHeight]) as number;
      prevY = (pageHeight - height) / 2;
      nextX = -(spacing + nextWidth);
      prevX = nextX - (spacing + prevWidth);
      nextY = prevY;
    } else if (position === 'right') {
      /**
       *  ||||||||| ⬅️ ➡️
       */
      const height = max([prevHeight, nextHeight]) as number;
      prevX = spacing + pageWidth;
      prevY = (pageHeight - height) / 2;
      nextX = prevX + prevWidth;
      nextY = prevY;
    }
    this.prevButton.attr({
      x: prevX,
      y: prevY,
    });
    this.nextButton.attr({
      x: nextX,
      y: nextY,
    });
  }
}
