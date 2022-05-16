import { DisplayObject, DisplayObjectConfig, Path, Text } from '@antv/g';
import { deepMix } from '@antv/util';
import { GUI } from '../../core/gui';
import { MixAttrs, ShapeAttrs } from '../../types';
import { select, TEXT_INHERITABLE_PROPS, measureTextWidth, defined } from '../../util';
import { PagerButton } from './pagerButton';

export type PageNavigatorCfg = {
  position?: string;
  marker?: {
    size?: number;
    spacing?: number;
    style?: MixAttrs<ShapeAttrs>;
  };
  text?: {
    style?: ShapeAttrs;
    formatter?: (current: string, total: string) => string;
  };
};

type PageNavigatorStyleProps = PageNavigatorCfg & {
  x?: number;
  y?: number;
  visibility?: 'visible' | 'hidden';
  /** 待分页的对象 */
  view: DisplayObject;
  orient: 'horizontal' | 'vertical';
  pageNum: number;
  pageWidth: number;
  pageHeight: number;
  initPageNum?: number;
  loop?: true;
  /** animation easing function */
  effect?: string;
  duration?: number;
};

const empty = (v: number) => v === Number.MAX_VALUE || !defined(v);
const ifH = (orient: string, a: any, b: any) => (orient === 'horizontal' ? a : b);

export class PageNavigator extends GUI<PageNavigatorStyleProps> {
  public static tag = 'page-navigator';

  private static defaultOptions = {
    style: {
      x: 0,
      y: 0,
      effect: 'easeQuadInOut',
      duration: 320,
      orient: 'horizontal', // 默认横向翻页
      initPageNum: 1,
      marker: {
        spacing: 5,
      },
    } as Partial<PageNavigatorStyleProps>,
  };

  protected clipView!: Path;
  // protected maskRect!: Rect;

  protected view!: DisplayObject;

  private prevButton!: PagerButton;

  private nextButton!: PagerButton;

  private finishedPromise!: Promise<any> | null;

  private resolveFinishedPromise!: Function;

  private finished() {
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

  constructor(options: DisplayObjectConfig<PageNavigatorStyleProps>) {
    super(deepMix({}, PageNavigator.defaultOptions, options));
    this.init();
  }

  public init() {
    this.clipView = new Path({ className: 'clip-path', style: { x: 0, y: 0, path: [] } });
    this.update();
  }

  protected currPage: number = 0;

  public update(cfg?: Partial<PageNavigatorStyleProps>) {
    this.attr(deepMix({}, PageNavigator.defaultOptions.style, this.attributes, cfg));
    const { view, visibility, orient, pageWidth, pageHeight } = this.style;

    if (view) {
      this.currPage = this.style.initPageNum || 1;
      this.view = view;
    }
    if (visibility === 'visible') {
      this.view.style.clipPath = this.clipView;
      // this.maskRect.style.visibility = 'visible';

      // const [x, y] = this.view.getLocalPosition();
      // this.maskRect.style.x = ifH(orient, x + pageWidth - 4, x);
      // this.maskRect.style.y = ifH(orient, y, y + pageHeight - 4);
      // this.maskRect.style.height = ifH(orient, pageHeight, 4);
      // this.maskRect.style.width = ifH(orient, 4, pageWidth);
      // this.maskRect.style.filter = ifH(orient, 'drop-shadow(-8px 0px 4px rgba(0,0,0,0.18))', 'drop-shadow(0px -8px 4px rgba(0,0,0,0.18))');
    } else {
      this.view.style.clipPath = null;
      // this.maskRect.style.visibility = 'hidden';
    }
    // 更新的时候，先取消动画
    this.getAnimations().forEach((animation) => animation.cancel());
    this.updateView();
    this.drawInner();
    this.updateButtonState(this.currPage);
  }

  protected updateView() {
    const { pageWidth, pageHeight, visibility } = this.style;

    if (visibility === 'visible') {
      const clipPath = `M0,0 L${pageWidth},0 L${pageWidth},${pageHeight} L0,${pageHeight} Z`;
      this.clipView.attr({ path: clipPath, x: 0, y: 0 });
      this.clipView.setLocalPosition(0, 0);
    }
  }

  /** Infer by orient */
  private get btnPosition() {
    const { orient, position } = this.style;
    if (position) return position;
    return orient === 'horizontal' ? 'right' : 'bottom';
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

  protected drawInner() {
    select(this)
      .selectAll('.pager-item')
      .data(this.buttonStyles, (d) => d.id)
      .join(
        (enter) => enter.append(({ Ctor, name, ...style }) => new Ctor({ className: 'pager-item', name, style })),
        (update) =>
          update.each((shape, { Ctor, name, ...style }) => (shape.update ? shape.update(style) : shape.attr(style))),
        (exit) => exit.remove()
      );
    const [prev, next] = select(this).selectAll('[name="pager-button"]').nodes() as any[];
    prev.addEventListener('click', this.prev.bind(this));
    this.prevButton = prev;
    next.addEventListener('click', this.next.bind(this));
    this.nextButton = next;
  }

  protected get buttonStyles() {
    const { marker: buttonCfg, text: textCfg, visibility } = this.style;
    let { pageWidth, pageHeight } = this.style;
    if (empty(pageWidth) || empty(pageHeight)) {
      const assignNumber = (v: number) => (empty(v) ? 0 : v);
      pageWidth = assignNumber(pageWidth);
      pageHeight = assignNumber(pageHeight);
    }
    const [startMarker, endMarker] = this.defaultShape;
    const size = buttonCfg?.size || 16;

    const current = `${this.currPage}`;
    const total = `${this.maxPages}`;
    const textStyle = deepMix(
      {},
      {
        ...TEXT_INHERITABLE_PROPS,
        fontSize: 12,
        textAlign: 'center',
        textBaseline: 'middle' as any,
        fill: 'black',
      },
      textCfg?.style
    );
    const spacing = buttonCfg?.spacing || 0;
    const text = textCfg?.formatter ? textCfg.formatter(current, total) : `${current} / ${total}`;
    const infoWidth = measureTextWidth(text, textStyle);

    // 计算坐标位置
    let prevX = 0;
    let prevY = 0;
    let nextX = 0;
    let nextY = 0;
    let infoX = 0;
    let infoY = 0;
    if (this.btnPosition === 'right') {
      // 目前等价于 right-middle
      // [todo] 让元素去容器居中，无需外部计算
      const y = (pageHeight! - size) / 2;
      prevY = y;
      nextY = y;
      infoY = pageHeight! / 2;
      prevX = pageWidth! + spacing;
      infoX = prevX + size + infoWidth / 2 + spacing;
      nextX = prevX + size + infoWidth + spacing * 2;
    } else if (this.btnPosition === 'bottom') {
      prevY = pageHeight;
      nextY = pageHeight;
      infoY = pageHeight + size / 2;

      infoX = pageWidth / 2;
      prevX = infoX - size - infoWidth / 2 - spacing;
      nextX = infoX + infoWidth / 2 + spacing;
    }
    const btnStyle = buttonCfg?.style || {};
    return [
      {
        Ctor: PagerButton,
        name: 'pager-button',
        id: 'prev-button',
        symbol: startMarker,
        size,
        style: btnStyle,
        x: prevX,
        y: prevY,
        visibility,
      },
      {
        Ctor: PagerButton,
        name: 'pager-button',
        id: 'next-button',
        symbol: endMarker,
        size,
        style: btnStyle,
        x: nextX,
        y: nextY,
        visibility,
      },
      {
        Ctor: Text,
        name: 'pager-info',
        id: 'page-info',
        x: infoX,
        y: infoY,
        text,
        ...textStyle,
        visibility,
      },
    ];
  }

  private get maxPages(): number {
    const { pageNum } = this.style;
    return pageNum;
  }

  protected prev() {
    const { loop } = this.style;
    const page = this.currPage;
    let to = page - 1;
    if (to < 1) to = loop ? this.maxPages : 1;
    return this.goTo(to);
  }

  protected next() {
    const { loop } = this.style;
    const { maxPages } = this;
    const page = this.currPage;
    let to = page + 1;
    if (to > maxPages) to = loop ? 1 : maxPages;
    return this.goTo(to);
  }

  /** 当前是否正在翻页 */
  private playState = 'idle';

  protected updateButtonState(to: number) {
    this.prevButton.update({ disabled: false });
    this.nextButton.update({ disabled: false });
    // this.maskRect.style.visibility = 'visible';
    if (to === this.maxPages) {
      this.nextButton.update({ disabled: true });
      // this.maskRect.style.visibility = 'hidden';
    } else if (to === 1) {
      this.prevButton.update({ disabled: true });
    }
  }

  public goTo(to: number) {
    this.updateButtonState(to);
    if (to === this.currPage) return;
    if (this.playState === 'idle') {
      const { effect, duration, pageWidth, pageHeight, orient = 'horizontal' } = this.style;
      const sign = this.currPage < to ? -1 : 1;
      const [offsetX, offsetY] = ifH(orient, [sign * pageWidth!, 0], [0, sign * pageHeight!]);

      this.playState = 'running';
      this.clipView.animate(
        [{ transform: `translate(0px, 0px)` }, { transform: `translate(${-offsetX}px,${-offsetY}px)` }],
        {
          duration,
          easing: effect,
          fill: 'both',
        }
      );
      this.view.animate([{ transform: `translate(0px, 0px)` }, { transform: `translate(${offsetX}px,${offsetY}px)` }], {
        duration,
        easing: effect,
        fill: 'both',
      });
      Promise.all(this.clipView.getAnimations().map((d) => d.finished)).then(() => {
        this.currPage = to;
        this.resolveFinishedPromise();
        this.playState = 'idle';
        this.drawInner();
      });

      this.finished();
    }
  }
}
