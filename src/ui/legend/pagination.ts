import { DisplayObject, DisplayObjectConfig, Path } from '@antv/g';
import { deepMix } from '@antv/util';
import { GUI } from '../../core/gui';
import { ShapeAttrs } from '../../types/dependency';
import { select, TEXT_INHERITABLE_PROPS, Selection, measureTextWidth, defined } from '../../util';
import { ifH } from './utils';
import { PaginationButton } from './paginationButton';
import { PaginationInfo } from './paginationInfo';

type PaginationStyleProps = {
  x?: number;
  y?: number;
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
  button?: {
    size?: number;
    position?: string;
    spacing?: number;
    style?: ShapeAttrs;
  };
};
export { PaginationStyleProps };

const empty = (v: number) => v === Number.MAX_VALUE || !defined(v);

export class Pagination extends GUI<PaginationStyleProps> {
  public static tag = 'page-navigator';

  private static defaultOptions = {
    style: {
      x: 0,
      y: 0,
      effect: 'linear',
      duration: 200,
      orient: 'horizontal', // 默认横向翻页
      initPageNum: 1,
      button: {
        spacing: 5,
      },
    } as Partial<PaginationStyleProps>,
  };

  protected selection!: Selection;

  protected clipView!: Path;

  protected view!: DisplayObject;

  private prevButton!: PaginationButton;

  private nextButton!: PaginationButton;

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

  constructor(options: DisplayObjectConfig<PaginationStyleProps>) {
    super(deepMix({}, Pagination.defaultOptions, options));
    this.selection = select(this);
    this.init();
  }

  public init() {
    this.clipView = new Path({ className: 'clip-path', style: { x: 0, y: 0, path: [] } });
    this.update();
  }

  protected currPage: number = 0;

  public update(cfg?: Partial<PaginationStyleProps>) {
    this.attr(deepMix({}, Pagination.defaultOptions.style, this.attributes, cfg));
    const { view, pageWidth, pageHeight } = this.style;
    if (this.view) {
      this.view.style.clipPath = null;
    }
    if (view) {
      this.currPage = this.style.initPageNum || 1;
      this.view = view;
    }
    if (!empty(pageWidth) && !empty(pageHeight)) {
      this.view.style.clipPath = this.clipView;
    }
    // 更新的时候，先取消动画
    this.getAnimations().forEach((animation) => animation.cancel());
    this.updateView();
    this.drawInner();
    this.updateButtonState(this.currPage);
  }

  protected updateView() {
    const { pageWidth, pageHeight } = this.style;

    if (!empty(pageWidth) && !empty(pageHeight)) {
      const clipPath = `M0,0 L${pageWidth},0 L${pageWidth},${pageHeight} L0,${pageHeight} Z`;
      this.clipView.attr({ path: clipPath, x: 0, y: 0, stroke: 'red', lineWidth: 1 });
      this.clipView.setLocalPosition(0, 0);
    }
  }

  /** Infer by orient */
  private get btnPosition() {
    const { orient, button } = this.style;
    if (button?.position) return button.position;
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
    this.selection
      .selectAll('.pagination-item')
      .data(this.buttonStyles, (d) => d.id)
      .join(
        (enter) => enter.append(({ Ctor, name, ...style }) => new Ctor({ className: 'pagination-item', name, style })),
        (update) => update.each((shape, { Ctor, name, ...style }) => shape.update(style)),
        (exit) => exit.remove()
      );
    const [prev, next] = this.selection.selectAll('[name="pagination-button"]').nodes() as any[];
    prev.addEventListener('click', this.prev.bind(this));
    this.prevButton = prev;
    next.addEventListener('click', this.next.bind(this));
    this.nextButton = next;
  }

  protected get buttonStyles() {
    const { button: buttonCfg } = this.style;
    let { pageWidth, pageHeight } = this.style;
    let visibility = 'visible';
    if (empty(pageWidth) || empty(pageHeight)) {
      visibility = 'hidden';
      const assignNumber = (v: number) => (empty(v) ? 0 : v);
      pageWidth = assignNumber(pageWidth);
      pageHeight = assignNumber(pageHeight);
    }
    const [startMarker, endMarker] = this.defaultShape;
    const size = buttonCfg?.size || 16;

    const current = `${this.currPage}`;
    const separator = '/';
    const total = `${this.maxPages}`;
    const textAttrs = {
      ...TEXT_INHERITABLE_PROPS,
      fontSize: 12,
      textBaseline: 'middle' as any,
      spacing: 2,
      fill: 'black',
    };
    const spacing = 2;
    const infoWidth = measureTextWidth([current, separator, total].join(''), textAttrs) + spacing * 2;
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
      prevX = pageWidth! + (buttonCfg?.spacing || 0);
      infoX = prevX + size + (buttonCfg?.spacing || 0);
      nextX = infoX + Math.min(infoWidth, 40) + (buttonCfg?.spacing || 0);
    } else if (this.btnPosition === 'bottom') {
      // todo
      prevY = pageHeight + (buttonCfg?.spacing || 0);
      nextY = pageHeight + (buttonCfg?.spacing || 0);
      infoY = pageHeight + size / 2 + (buttonCfg?.spacing || 0);

      prevX = pageWidth / 2 - size - (buttonCfg?.spacing || 0);
      nextX = pageWidth / 2 + size + (buttonCfg?.spacing || 0);
      infoX = pageWidth / 2;
    }
    return [
      {
        Ctor: PaginationButton,
        name: 'pagination-button',
        id: 'prev-button',
        marker: startMarker,
        size,
        x: prevX,
        y: prevY,
        visibility,
      },
      {
        Ctor: PaginationButton,
        name: 'pagination-button',
        id: 'next-button',
        marker: endMarker,
        size,
        x: nextX,
        y: nextY,
        visibility,
      },
      {
        Ctor: PaginationInfo,
        name: 'pagination-info',
        id: 'page-info',
        x: infoX,
        y: infoY,
        current,
        separator,
        total,
        style: textAttrs,
        spacing,
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
    if (to === this.maxPages) {
      this.nextButton.update({ disabled: true });
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
