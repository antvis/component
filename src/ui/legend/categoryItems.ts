import {
  BaseCustomElementStyleProps,
  CustomElement,
  ElementEvent,
  DisplayObjectConfig,
  Group,
  Path,
  Text,
} from '@antv/g';
import { deepMix, isNil, last } from '@antv/util';
import { ShapeAttrs } from '../../types';
import { normalPadding, select2update } from '../../util';
import { CategoryItem, CategoryItemStyleProps } from './categoryItem';
import { PageButton } from './pageButton';

type CategoryItemsStyleProps = BaseCustomElementStyleProps & {
  orient: 'horizontal' | 'vertical';
  items: CategoryItemStyleProps[];
  spacing?: number[];
  maxWidth?: number;
  maxHeight?: number;
  autoWrap?: boolean;
  maxRows?: number;
  // todo
  // pagePosition?: string;
  /** Spacing between page buttons and legend items. */
  pageSpacing?: number;
  pageButtonSize?: number;
  pageButtonStyle?: {
    default?: ShapeAttrs;
    disabled?: ShapeAttrs;
  };
  pageInfoWidth?: number;
  pageInfoHeight?: number;
  pageFormatter?: (current: number, total: number) => string;
  pageTextStyle?: ShapeAttrs;
  // todo:
  loop?: boolean;
  effect?: any;
  duration?: number;
};

export class CategoryItems extends CustomElement<CategoryItemsStyleProps> {
  private container!: Group;

  private items: CategoryItem[] = [];

  private prevButton!: PageButton;

  private nextButton!: PageButton;

  private pageInfo!: Text;

  private clipView!: Path;

  private maxPages?: number = undefined;

  private currPage?: number = undefined;

  private pageOffsets: number[] = [];

  public static defaultOptions = {
    style: {
      spacing: [4, 0],
      effect: 'easeQuadInOut',
      duration: 320,
      maxRows: 2,
      maxCols: 2,
      pageInfoWidth: 32,
      pageInfoHeight: 14,
      pageButtonSize: 10,
      pageFormatter: (current: number, total: number) => `${current} / ${total}`,
      pageButtonStyle: { default: { fill: 'black' }, disabled: { fill: 'rgb(131,131,131)' } },
      pageTextStyle: { fontSize: 12, textBaseline: 'middle', textAlign: 'center' },
    },
  };

  constructor(options: DisplayObjectConfig<CategoryItemsStyleProps>) {
    super(deepMix({}, CategoryItems.defaultOptions, options));
    this.container = this.appendChild(new Group());
    this.clipView = new Path({ style: { path: [] } });
  }

  connectedCallback() {
    this.initPageNavigator();
    this.drawItems();
    this.bindEvents();
  }

  attributeChangedCallback(name: keyof CategoryItemsStyleProps, oldValue: any, newValue: any) {
    if (name === 'items') {
      this.drawItems();
      this.adjustLayout();
    }
    if (name === 'pageButtonSize') {
      this.prevButton!.style.size = newValue;
      this.nextButton!.style.size = newValue;
      this.adjustLayout();
    }
    if (name === 'pageInfoWidth' || name === 'pageSpacing') this.adjustLayout();
    if (name === 'orient' || name === 'autoWrap' || name === 'maxWidth' || name === 'maxHeight') {
      this.updatePageButtonSymbol();
      this.adjustLayout();
    }
    if (name === 'maxRows' && this.style.autoWrap) {
      this.adjustLayout();
    }
    if (name === 'pageFormatter') this.updatePageInfo();
    if (name === 'pageTextStyle') this.applyPageInfoStyle();
    if (name === 'pageButtonStyle') this.applyPageButtonStyle();
  }

  private bindEvents() {
    this.container.addEventListener(ElementEvent.MOUNTED, () => this.adjustLayout(), { capture: true });

    this.prevButton.addEventListener('click', this.prev.bind(this));
    this.nextButton.addEventListener('click', this.next.bind(this));
  }

  private drawItems() {
    const { items = [] } = this.style;
    this.items = select2update(this.container, 'legend-item', CategoryItem, items) as CategoryItem[];
  }

  private ifHorizontal<T>(a: T, b: T) {
    if (this.style.orient === 'vertical') {
      return typeof b === 'function' ? b() : b;
    }
    return typeof a === 'function' ? a() : a;
  }

  private initPageNavigator() {
    const buttonCfg = { className: 'page-button', zIndex: 2 };
    this.prevButton = this.appendChild(new PageButton(buttonCfg));
    this.nextButton = this.appendChild(new PageButton(buttonCfg));
    this.pageInfo = this.appendChild(new Text({ className: 'page-info' }));

    this.updatePageButtonSymbol();
    this.applyPageButtonStyle();
    this.applyPageInfoStyle();
  }

  private applyPageButtonStyle() {
    const markerStyle = deepMix({}, CategoryItems.defaultOptions.style.pageButtonStyle, this.style.pageButtonStyle);
    this.prevButton.attr({ markerStyle });
    this.nextButton.attr({ markerStyle });
  }

  private applyPageInfoStyle() {
    const pageTextStyle = deepMix({}, CategoryItems.defaultOptions.style.pageTextStyle, this.style.pageTextStyle);
    this.pageInfo.attr(pageTextStyle);
  }

  private showPageNavigator() {
    this.prevButton.style.visibility = 'visible';
    this.nextButton.style.visibility = 'visible';
    this.pageInfo.style.visibility = 'visible';
  }

  private resetPageCfg() {
    this.prevButton.style.visibility = 'hidden';
    this.nextButton.style.visibility = 'hidden';
    this.pageInfo.style.visibility = 'hidden';
    this.container.style.clipPath = null;
    this.currPage = undefined;
    this.maxPages = undefined;
    this.pageOffsets = [];
  }

  private adjustLayout() {
    this.resetPageCfg();
    if (this.items.length <= 1) return;

    const items = this.items;
    const [offsetX, offsetY] = normalPadding(this.style.spacing);

    let totalSize = 0;
    let itemHeight = 0;
    let itemWidth = 0;
    const offset = this.ifHorizontal(offsetX, offsetY);

    items.reduce((d, item) => {
      const [hw, hh] = item.getLocalBounds().halfExtents;
      const position = this.ifHorizontal([d, 0], [0, d]);
      item.setLocalPosition(position[0], position[1]);

      itemHeight = Math.max(itemHeight, hh * 2);
      itemWidth = Math.max(itemWidth, hw * 2);
      totalSize = this.ifHorizontal(d + hw * 2, d + hh * 2);

      return totalSize + offset;
    }, 0);

    const limitSize = this.ifHorizontal(this.style.maxWidth, this.style.maxHeight)!;
    if (!(isNil(limitSize) || limitSize === Infinity) && limitSize < totalSize) {
      if (this.style.autoWrap && this.style.orient !== 'vertical') {
        this.adjustHorizontalWrap(itemWidth, itemHeight, limitSize);
      } else {
        this.adjustFlip(itemWidth, itemHeight, limitSize);
      }
    }
  }

  private adjustFlip(itemWidth: number, itemHeight: number, limitSize: number) {
    this.showPageNavigator();
    const pageSpacing = this.style.pageSpacing!;
    const pageButtonSize = this.prevButton.style.size || CategoryItems.defaultOptions.style.pageButtonSize;
    const pageInfoWidth = this.style.pageInfoWidth || CategoryItems.defaultOptions.style.pageInfoWidth;

    const [pageWidth, pageHeight] = this.ifHorizontal(
      [limitSize - (pageButtonSize * 2 + pageInfoWidth + pageSpacing), itemHeight],
      [itemWidth, limitSize - (pageButtonSize + pageSpacing)]
    );
    this.clipView.style.path = `M0,0 L${pageWidth},0 L${pageWidth},${pageHeight} L0,${pageHeight} Z`;
    this.container.style.clipPath = this.clipView;

    const x0 = this.ifHorizontal(pageWidth + pageSpacing, 0);
    const x1 = x0 + pageButtonSize / 2;
    const x2 = x0 + (pageButtonSize / 2) * 3 + pageInfoWidth;
    const y = this.ifHorizontal(itemHeight / 2, pageHeight + pageButtonSize / 2 + pageSpacing);
    this.prevButton?.setLocalPosition(x1, y);
    this.nextButton?.setLocalPosition(x2, y);
    this.pageInfo.setLocalPosition((x1 + x2) / 2, y);

    // Get page info.
    const direction = this.ifHorizontal('x', 'y');
    const pos = direction === 'x' ? 0 : 1;
    const pageOffsets: number[] = [0];
    let page = 1;
    for (let i = 0; i < this.items.length; i++) {
      const { min, max } = this.items[i].getLocalBounds();
      // Tolerate 4px diff.
      if (max[pos] - last(pageOffsets) > this.ifHorizontal(pageWidth, pageHeight) + 4) {
        min[pos] !== 0 && pageOffsets.push(min[pos]);
        page += 1;
      }
    }
    this.maxPages = page;
    this.currPage = 1;
    this.pageOffsets = pageOffsets;
    this.updatePageNavigatorState();
  }

  private adjustHorizontalWrap(itemWidth: number, itemHeight: number, limitSize: number) {
    this.showPageNavigator();
    const pageSpacing = this.style.pageSpacing!;
    const pageButtonSize = this.prevButton.style.size || CategoryItems.defaultOptions.style.pageButtonSize;
    const pageInfoWidth = this.style.pageInfoWidth || CategoryItems.defaultOptions.style.pageInfoWidth;
    const pageInfoHeight = this.style.pageInfoHeight || CategoryItems.defaultOptions.style.pageInfoHeight;

    const maxRows = this.style.maxRows || 1;
    const [pageWidth, pageHeight] = [limitSize - (pageInfoWidth + pageSpacing), itemHeight * maxRows];
    this.clipView.style.path = `M0,0 L${pageWidth},0 L${pageWidth},${pageHeight} L0,${pageHeight} Z`;
    this.container.style.clipPath = this.clipView;

    // Get page info.
    const pageSize = pageWidth;

    let row = 1;
    let offset = 0;
    const pageOffsets: number[] = [0];
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      const { min, max } = item.getLocalBounds();
      if (max[0] - offset > pageSize) {
        row += 1;
        offset = min[0];
        if (row % maxRows === 1) {
          pageOffsets.push((row - 1) * itemHeight);
        }
      }

      item.setLocalPosition(min[0] - offset, (row - 1) * itemHeight);
    }
    this.maxPages = pageOffsets.length;
    this.currPage = 1;
    this.pageOffsets = pageOffsets;

    const x = pageWidth + pageSpacing + pageButtonSize / 2;
    const y0 = pageHeight / 2;
    const buttonOffset = (pageInfoHeight + pageButtonSize) / 2;
    this.prevButton?.setLocalPosition(x, y0 - buttonOffset);
    this.nextButton?.setLocalPosition(x, y0 + buttonOffset);
    this.pageInfo?.setLocalPosition(x, y0);
    this.updatePageNavigatorState();
  }

  // ====== 分页器
  private finishedPromise!: Promise<any> | null;

  private resolveFinishedPromise!: Function;

  /** 当前是否正在翻页 */
  private playState = 'idle';

  private updatePageNavigatorState() {
    this.updatePageInfo();
    if (this.currPage === this.maxPages) {
      this.nextButton.style.disabled = true;
    } else {
      this.nextButton.style.disabled = false;
    }
    if (this.currPage === 1) {
      this.prevButton.style.disabled = true;
    } else {
      this.prevButton.style.disabled = false;
    }
  }

  private updatePageButtonSymbol() {
    const { autoWrap } = this.style;
    const sign = this.ifHorizontal(autoWrap ? 1 : 0, 1);
    this.prevButton.attr({ symbol: ['left', 'up'][sign] });
    this.nextButton.attr({ symbol: ['right', 'down'][sign] });
  }

  private updatePageInfo() {
    const pageFormatter = this.style.pageFormatter || CategoryItems.defaultOptions.style.pageFormatter;
    this.pageInfo.style.text = !(this.currPage && this.maxPages) ? '' : pageFormatter(this.currPage, this.maxPages);
  }

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

  private prev() {
    if (!this.maxPages || !this.currPage) return;

    const { loop } = this.style;
    const page = this.currPage;
    let to = page - 1;
    if (to < 1) to = loop ? this.maxPages : 1;
    this.goTo(to);
  }

  private next() {
    if (!this.maxPages || !this.currPage) return;

    const { loop } = this.style;
    const { maxPages } = this;
    const page = this.currPage;
    let to = page + 1;
    if (to > maxPages) to = loop ? 1 : maxPages;
    this.goTo(to);
  }

  public goTo(to: number) {
    if (to === this.currPage) return;
    if (this.playState === 'idle') {
      const { effect, duration, autoWrap } = this.style;
      const [offsetX, offsetY] = this.ifHorizontal(
        !autoWrap ? [-this.pageOffsets[to - 1], 0] : [0, -this.pageOffsets[to - 1]],
        [0, -this.pageOffsets[to - 1]]
      );

      this.playState = 'running';
      this.clipView.animate(
        [{ transform: this.clipView.style.transform }, { transform: `translate(${-offsetX}px,${-offsetY}px)` }],
        {
          duration,
          easing: effect,
          fill: 'both',
        }
      );

      this.container.animate(
        [{ transform: this.container.style.transform }, { transform: `translate(${offsetX}px,${offsetY}px)` }],
        {
          duration,
          easing: effect,
          fill: 'both',
        }
      );
      Promise.all(this.clipView.getAnimations().map((d) => d.finished)).then(() => {
        this.currPage = to;
        this.updatePageNavigatorState();
        this.resolveFinishedPromise();
        this.playState = 'idle';
      });

      this.finished();
    }
  }
}
