import { Rect, Group } from '@antv/g';
import { deepMix, max, get } from '@antv/util';
import { GUI } from '../../core/gui';
import { Marker } from '../marker';
import { Button } from '../button';
import { ButtonPosition, PageNavigatorCfg, PageNavigatorOptions } from './types';
import { getShapeSpace } from '../../util';
import { DEFAULT_BUTTON_STYLE } from './constant';
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
  public static tag = 'page-navigator';

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
          spacing: 0,
          ...DEFAULT_BUTTON_STYLE,
        },
        next: {
          spacing: 0,
          ...DEFAULT_BUTTON_STYLE,
        },
        style: {
          default: {},
          active: {},
          disabled: {},
        },
        spacing: 5,
      },
      pagination: {
        type: 'currTotal',
        style: {
          default: {},
          active: {},
        },
        separator: '/',
        spacing: 5,
      },
    },
  };

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
  private clipView!: Rect;

  private fullView: DisplayObject | undefined;

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
  private get maxPages(): number {
    const { pageWidth, pageHeight, orient, pageLimit, pageCallback } = this.attributes;
    if (pageCallback || pageLimit !== Infinity) return pageLimit!;
    let maxPages = 0;
    if (orient === 'horizontal') {
      maxPages = Math.ceil(this.width! / pageWidth);
    } else {
      maxPages = Math.ceil(this.height! / pageHeight);
    }
    return maxPages;
  }

  private get view() {
    return this.fullView!;
  }

  private set view(view: DisplayObject) {
    const { width, height } = this.attributes;
    view.setLocalPosition(0, 0);
    this.fullView = view;
    if (!width || !height) {
      const { width: w, height: h } = getShapeSpace(view);
      this.width = w;
      this.height = h;
    }
  }

  private get width() {
    const { width } = this.attributes;
    if (width) return width;
    return this.viewWidth;
  }

  private set width(width: number) {
    this.viewWidth = width;
  }

  private get height() {
    const { height } = this.attributes;
    if (height) return height;
    return this.viewHeight;
  }

  private set height(height: number) {
    this.viewHeight = height;
  }

  /** Infer by orient */
  private get btnPosition() {
    if (this.style.button?.position) return this.style.button.position;
    return this.style.orient === 'horizontal' ? 'right' : 'bottom';
  }

  /**
   * 获得按钮的默认箭头形状
   */
  private get defaultShape() {
    if (['left', 'right', 'left-right'].includes(this.btnPosition)) {
      return ['left', 'right'];
    }
    return ['up', 'down'];
  }

  private get buttonCfg() {
    const [startMarker, endMarker] = this.defaultShape;
    const {
      button: { prev, next },
    } = this.attributes as Required<Pick<PageNavigatorCfg, 'button'>>;
    return {
      prev: {
        marker: startMarker,
        ...prev,
      },
      next: {
        marker: endMarker,
        ...next,
      },
    };
  }

  private viewWidth!: number;

  private viewHeight!: number;

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
    this.updateView();
    // 更新按钮
    this.updateButton();
    this.updateButtonState();
    // 调整布局
    this.adjustLayout();
  }

  public update(cfg: Partial<PageNavigatorCfg>) {
    const { view } = cfg;
    if (view) {
      if (this.view) {
        this.view.style.clipPath = null;
        this.removeChild(this.view, false);
      }
      // 更新full view
      this.currPage = this.attributes.initPageNum!;
      this.view = view;
      this.view.style.clipPath = this.clipView;
      this.appendChild(this.view);
      this.view.toBack(); // 避免遮挡分页器按钮
    }
    this.attr(deepMix({}, this.attributes, cfg));
    // this.updateClipView();
    this.updateView();
    this.updateButton();
    this.updateButtonState();
    this.adjustLayout();
  }

  public clear() {
    if (this.view) {
      this.view.style.clipPath = null;
      this.removeChild(this.view, false);
    }
    this.fullView = undefined;
    this.removeChildren(true);
  }

  public destroy() {
    this.removeChildren(true);
    super.destroy();
  }

  /**
   * 从xx页翻到xx页
   */
  public goTo(to: number) {
    if (this.playState === 'idle') {
      const { effect, duration } = this.attributes;
      const { viewFromX, viewFromY, viewToX, viewToY, clipFromX, clipFromY, clipToX, clipToY } =
        this.calcRelativePagingOffset(to);
      this.playState = 'running';
      // 播放动画
      this.clipView.animate(
        [
          { transform: `translate(${clipFromX}px, ${clipFromY}px)` },
          { transform: `translate(${clipToX}px, ${clipToY}px)` },
        ],
        { duration, easing: effect, fill: 'both' }
      );
      const animation = this.view.animate(
        [
          { transform: `translate(${viewFromX}px, ${viewFromY}px)` },
          { transform: `translate(${viewToX}px, ${viewToY}px)` },
        ],
        { duration, easing: effect, fill: 'both' }
      );
      // 设置最终位置
      animation?.finished.then(() => {
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
    if (to < 1) to = loop ? this.maxPages : 1;
    return this.goTo(to);
  }

  /**
   * 向后翻页
   */
  public next() {
    const { loop } = this.attributes;
    const { maxPages } = this;
    const page = this.currPage;
    let to = page + 1;
    if (to > maxPages) to = loop ? 1 : maxPages;
    return this.goTo(to);
  }

  private initShape() {
    // 初始化 窗口
    this.clipView = new Rect({
      name: 'clipView',
      style: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
    });
    this.view.style.clipPath = this.clipView;
    // 将全景图挂载到翻页器
    this.appendChild(this.view);
    this.view.toBack(); // 避免遮挡分页器按钮

    const [startMarker, endMarker] = this.defaultShape;
    // 初始化按钮
    this.prevButton = new Button({
      name: 'prevButton',
      style: {
        ...PageNavigator.defaultOptions.style.button.prev,
        marker: startMarker,
        onClick: this.prev.bind(this),
      },
    });
    this.appendChild(this.prevButton);
    this.nextButton = new Button({
      name: 'nextButton',
      style: {
        ...PageNavigator.defaultOptions.style.button.next,
        marker: endMarker,
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

  /**
   * 更新裁切窗口和画布位置
   */
  private updateView() {
    const { width, height } = this.getClipViewSpace(this.currPage);
    this.clipView.attr({ width, height });
    this.view.setLocalPosition(0, 0);
    this.clipView.setLocalPosition(0, 0);
  }

  /**
   * 更新 button
   */
  private updateButton() {
    // const { button } = this.attributes;
    const { prev, next } = this.buttonCfg;
    prev && this.prevButton.update(prev);
    next && this.nextButton.update(next);
  }

  /**
   * 更新 button 状态
   */
  private updateButtonState() {
    const { loop } = this.attributes;
    if (!loop) {
      this.nextButton.setState(this.currPage === this.maxPages ? 'disabled' : 'enabled');
      this.prevButton.setState(this.currPage === 1 ? 'disabled' : 'enabled');
    } else {
      this.nextButton.setState('enabled');
      this.prevButton.setState('enabled');
    }
  }

  /**
   * 根据页码获得该页的绝对位置
   */
  private getClipViewSpace(num: number): Page {
    const { orient, pageWidth, pageHeight, pageCallback } = this.attributes;
    const pageSpace = { x: 0, y: 0, width: pageWidth, height: pageHeight };
    const { maxPages } = this;
    if (pageCallback) return { ...pageSpace, ...pageCallback(num) };
    if (num > maxPages! || num < 1) return pageSpace;
    if (orient === 'vertical') {
      pageSpace.y = (num - 1) * pageHeight;
    } else if (orient === 'horizontal') {
      pageSpace.x = (num - 1) * pageWidth;
    }
    return pageSpace;
  }

  /**
   * 将画布上所在页的绝对位置转换成动画所需的相对位置
   */
  private absolute2Relative(absX: number, absY: number) {
    // 当前页位置为起始位置
    const { currPage } = this;
    const { x, y } = this.getClipViewSpace(currPage);
    return [absX + x, absY + y];
  }

  /**
   * 计算切换到第num页时，fullView应当放置的位置
   */
  private getViewPosition(num: number): { x: number; y: number } {
    // 第1页的pageView位置 应当对应fullView 的位置
    const { x: p1X, y: p1Y } = this.getClipViewSpace(1);
    const { x: pnX, y: pnY } = this.getClipViewSpace(num);
    const [diffX, diffY] = [-pnX + p1X, -pnY + p1Y];
    return { x: diffX, y: diffY };
  }

  private getRelativeViewPosition(num: number): { x: number; y: number } {
    const { x, y } = this.getViewPosition(num);
    const [relX, relY] = this.absolute2Relative(x, y);
    return { x: relX, y: relY };
  }

  /**
   * 计算从 x 翻到 y 页时，view 和 clipView 的相对位移
   */
  private calcRelativePagingOffset(to: number) {
    const [viewFromX, viewFromY] = this.absolute2Relative(
      ...(this.view.getLocalPosition().slice(0, 2) as [number, number])
    );
    const { x: viewToX, y: viewToY } = this.getRelativeViewPosition(to);
    const [clipFromX, clipFromY] = [-viewFromX, -viewFromY];
    const [clipToX, clipToY] = [-viewToX, -viewToY];
    return { viewFromX, viewFromY, viewToX, viewToY, clipFromX, clipFromY, clipToX, clipToY };
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
    const position = this.btnPosition;
    const spacing = button?.spacing || 0;
    const { width: prevWidth, height: prevHeight } = getShapeSpace(this.prevButton);
    const { width: nextWidth, height: nextHeight } = getShapeSpace(this.nextButton);

    let prevX = 0;
    let prevY = 0;
    let nextX = 0;
    let nextY = 0;
    if (position === 'left-right') {
      /**
       *  ⬅ ||||||||| ➡️
       */
      prevX = -(spacing + prevWidth);
      prevY = (pageHeight - prevHeight) / 2;
      nextX = spacing + pageWidth;
      nextY = (pageHeight - nextHeight) / 2;
    } else if (position === 'top-bottom') {
      /**
       *     ⬆
       *  |||||||||
       *     ⬇
       */
      prevX = (pageWidth - prevWidth) / 2;
      prevY = -(spacing + prevHeight);
      nextX = (pageWidth - nextWidth) / 2;
      nextY = spacing + pageHeight;
    } else if (position === 'top') {
      /**
       *    ⬅ ➡️
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
       *    ⬅ ➡️
       */
      prevX = (pageWidth - spacing) / 2 - prevWidth;
      prevY = spacing + pageHeight;
      nextX = (pageWidth + spacing) / 2;
      nextY = prevY;
    } else if (position === 'left') {
      /**
       * ⬅ ➡️  |||||||||
       *
       * ->
       *
       *  ⬆
       *    ||||||||
       *  ⬇
       */
      const height = max([prevHeight, nextHeight]) as number;
      prevY = (pageHeight - height) / 2;
      nextX = -(spacing + nextWidth);
      prevX = nextX - (spacing + prevWidth);
      nextY = prevY;
    } else if (position === 'right') {
      /**
       *  ||||||||| ⬅ ➡️
       * ->
       *           ⬆
       *  ||||||||
       *           ⬇
       */
      const height = max([prevHeight, nextHeight]) as number;
      prevX = spacing + pageWidth;
      prevY = (pageHeight - height) / 2;
      nextX = prevX + prevWidth;
      nextY = prevY;
    }
    this.prevButton.setLocalPosition(prevX, prevY);
    this.nextButton.setLocalPosition(nextX, nextY);
  }
}

Marker.registerSymbol('left', (x: number, y: number, r: number) => {
  return [['M', x - r, y], ['L', x + r, y - r], ['L', x + r, y + r], ['Z']];
});
Marker.registerSymbol('right', (x: number, y: number, r: number) => {
  return [['M', x - r, y - r], ['L', x + r, y], ['L', x - r, y + r], ['Z']];
});
Marker.registerSymbol('up', (x: number, y: number, r: number) => {
  return [['M', x - r, y + r], ['L', x, y - r], ['L', x + r, y + r], ['Z']];
});
Marker.registerSymbol('down', (x: number, y: number, r: number) => {
  return [['M', x - r, y - r], ['L', x + r, y - r], ['L', x, y + r], ['Z']];
});
