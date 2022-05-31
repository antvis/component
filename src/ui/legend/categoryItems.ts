import { BaseCustomElementStyleProps, CustomElement, DisplayObjectConfig, Group, Path, Text } from '@antv/g';
import { deepMix, isNil, last } from '@antv/util';
import { ShapeAttrs } from '../../types';
import { applyStyle, maybeAppend, normalPadding, select } from '../../util';
import { CategoryItem, CategoryItemStyleProps } from './categoryItem';
import { PageButton, ButtonStyleProps } from './pageButton';

export type PageNavigatorCfg = {
  // todo
  // pagePosition?: string;
  /** Spacing between page buttons and legend items. */
  pageSpacing?: number;
  pageButtonSize?: number;
  pageButtonStyle?: ButtonStyleProps;
  pageInfoSpacing?: number;
  pageFormatter?: (current: number, total: number) => string;
  pageTextStyle?: ShapeAttrs;
};

type CategoryItemsStyleProps = BaseCustomElementStyleProps &
  PageNavigatorCfg & {
    orient: 'horizontal' | 'vertical';
    items: CategoryItemStyleProps[];
    spacing?: number[];
    maxWidth?: number;
    maxHeight?: number;
    autoWrap?: boolean;
    maxRows?: number;

    // todo:
    loop?: boolean;
    effect?: any;
    duration?: number;
  };

export type { CategoryItemsStyleProps };

function initPosition(items: CategoryItem[], orient: 'horizontal' | 'vertical', offset: number = 0) {
  let totalSize = 0;
  let maxItemHeight = 0;
  let maxItemWidth = 0;
  items.reduce((d, item) => {
    const [hw, hh] = item.getLocalBounds().halfExtents;
    const position = orient === 'horizontal' ? [d, 0] : [0, d];
    item.setLocalPosition(position[0], position[1]);

    maxItemHeight = Math.max(maxItemHeight, hh * 2);
    maxItemWidth = Math.max(maxItemWidth, hw * 2);
    totalSize = orient === 'horizontal' ? d + hw * 2 : d + hh * 2;

    return totalSize + offset;
  }, 0);

  return { totalSize, maxItemWidth, maxItemHeight };
}

export class CategoryItems extends CustomElement<CategoryItemsStyleProps> {
  private container!: Group;

  private items: CategoryItem[] = [];

  private prevButton!: PageButton;

  private nextButton!: PageButton;

  private clipView!: Path;

  public static defaultOptions = {
    style: {
      spacing: [4, 0],
      effect: 'easeQuadInOut',
      duration: 320,
      maxRows: 2,
      maxCols: 2,
      pageButtonSize: 10,
      pageInfoSpacing: 2,
      pageFormatter: (current: number, total: number) => `${current}/${total}`,
      pageButtonStyle: {
        size: 10,
        // 不建议设置 margin 和 padding (需要根据方向调整，比较麻烦)
        margin: 0,
        padding: 0,
        markerStyle: {
          fill: 'black',
          cursor: 'pointer',
          disabled: { fill: '#d9d9d9', cursor: 'not-allowed' },
        },
        backgroundStyle: {
          cursor: 'pointer',
          fill: 'transparent',
          disabled: { cursor: 'not-allowed' },
        },
      },
      pageTextStyle: { fontSize: 12, textBaseline: 'middle', textAlign: 'center' },
    },
  };

  constructor(options: DisplayObjectConfig<CategoryItemsStyleProps>) {
    super(deepMix({}, CategoryItems.defaultOptions, options));
  }

  connectedCallback() {
    this.container = this.appendChild(new Group());
    this.clipView = new Path({ style: { path: [] } });
    this.render();
    this.bindEvents();
  }

  public update(cfg: Partial<CategoryItemsStyleProps> = {}) {
    this.attr(deepMix({}, this.attributes, cfg));
    this.render();
  }

  private get styles(): Required<CategoryItemsStyleProps> {
    return deepMix({}, CategoryItems.defaultOptions.style, this.attributes);
  }

  private render() {
    this.renderButtonGroup();

    const { items = [] } = this.style;
    this.items = select(this.container)
      .selectAll(`.legend-item`)
      .data(items || [], (d, idx) => d.id || idx)
      .join(
        (enter) => enter.append((datum) => new CategoryItem({ id: datum.id, className: 'legend-item', style: datum })),
        (update) =>
          update.each(function (datum) {
            this.update(datum);
          }),
        (exit) => exit.remove()
      )
      .nodes() as CategoryItem[];

    this.adjustLayout();
  }

  private bindEvents() {
    this.prevButton.addEventListener('pointerdown', this.prev.bind(this));
    this.nextButton.addEventListener('pointerdown', this.next.bind(this));
  }

  private ifHorizontal<T>(a: T, b: T) {
    if (this.style.orient === 'vertical') {
      return typeof b === 'function' ? b() : b;
    }
    return typeof a === 'function' ? a() : a;
  }

  private renderButtonGroup() {
    const { pageButtonStyle: buttonStyle = {}, pageTextStyle } = this.styles;

    const group = maybeAppend(this, '.page-button-group', () => new Group({ className: 'page-button-group' })).node();
    const prevBtnId = 'page-prev-button';
    const nextBtnId = 'page-next-button';
    this.prevButton = maybeAppend(group, `#${prevBtnId}`, () => new PageButton({}))
      .attr('id', prevBtnId)
      .attr('className', 'page-button')
      .attr('zIndex', 2)
      .call((selection) => {
        (selection.node() as PageButton).update(buttonStyle);
      })
      .node() as PageButton;
    maybeAppend(group, '.page-info', 'text').attr('className', 'page-info').call(applyStyle, pageTextStyle);
    this.nextButton = maybeAppend(group, `#${nextBtnId}`, () => new PageButton({}))
      .attr('id', nextBtnId)
      .attr('className', 'page-button')
      .attr('zIndex', 2)
      .call((selection) => {
        (selection.node() as PageButton).update(buttonStyle);
      })
      .node() as PageButton;
    this.updatePageButtonSymbol();
  }

  private get pageInfoBounds() {
    const pageInfo = this.querySelector('.page-info') as Text;
    if (!pageInfo) {
      return { width: 0, height: 0 };
    }
    const { pageFormatter, pageInfoSpacing: spacing } = this.styles;
    const visibility = pageInfo.style.visibility;

    pageInfo.style.visibility = 'hidden';
    pageInfo.style.text = pageFormatter(1, this.styles.items.length);
    const [hw, hh] = pageInfo.getLocalBounds().halfExtents;
    pageInfo.style.visibility = visibility;

    return { width: (hw + spacing) * 2, height: (hh + spacing) * 2 };
  }

  private layoutButton(orient: 'horizontal' | 'vertical') {
    const { pageInfoSpacing = 0 } = this.style;
    const pageInfoHeight = this.pageInfoBounds.height;
    const pageInfoWidth = this.pageInfoBounds.width + pageInfoSpacing * 2;
    const buttonGroup = this.querySelector('.page-button-group') as Group;
    const [prevBtn, pageInfo, nextBtn] = buttonGroup.childNodes as [PageButton, Text, PageButton];

    if (orient === 'horizontal') {
      const prevBtnWidth = prevBtn.getLocalBounds().halfExtents[0] * 2;
      const nextBtnWidth = nextBtn.getLocalBounds().halfExtents[0] * 2;
      prevBtn.style.x = prevBtnWidth / 2;
      nextBtn.style.x = prevBtnWidth + pageInfoWidth + nextBtnWidth / 2;
      pageInfo.style.x = (Number(prevBtn.style.x) + Number(nextBtn.style.x)) / 2;

      prevBtn.style.y = 0;
      nextBtn.style.y = 0;
      pageInfo.style.y = 0;
    } else {
      const prevBtnHeight = prevBtn.getLocalBounds().halfExtents[1] * 2;
      const nextBtnHeight = nextBtn.getLocalBounds().halfExtents[1] * 2;
      prevBtn.style.y = -(pageInfoHeight + prevBtnHeight) / 2;
      nextBtn.style.y = (pageInfoHeight + nextBtnHeight) / 2;
      pageInfo.style.y = 0;

      const centerX = this.pageInfoBounds.width / 2;
      prevBtn.style.x = centerX;
      nextBtn.style.x = centerX;
      pageInfo.style.x = centerX;
    }
  }

  private showButtonGroup() {
    (this.querySelector('.page-button-group') as any).style.visibility = 'visible';
  }

  // ==== 设置分页布局  ====
  private maxPages?: number = undefined;

  private currPage?: number = undefined;

  private pageOffsets: number[] = [];

  private resetPageCfg() {
    (this.querySelector('.page-button-group') as any).style.visibility = 'hidden';
    this.container.style.clipPath = null;
    this.currPage = undefined;
    this.maxPages = undefined;
    this.pageOffsets = [];
    this.container.style.transform = 'translate(0,0)';
    this.clipView && (this.clipView.style.transform = 'translate(0,0)');
  }

  // [todo] refactor later.
  private adjustLayout() {
    this.resetPageCfg();
    if (this.items.length <= 1) return;

    const [offsetX, offsetY] = normalPadding(this.style.spacing);
    const offset = this.ifHorizontal(offsetX, offsetY);

    const { totalSize, maxItemWidth, maxItemHeight } = initPosition(
      this.items,
      this.style.orient || 'horizontal',
      offset
    );
    const limitSize = this.ifHorizontal(this.style.maxWidth, this.style.maxHeight)!;

    if (!(isNil(limitSize) || limitSize === Infinity) && limitSize < totalSize) {
      if (this.style.autoWrap && this.style.orient !== 'vertical') {
        this.layoutButton('vertical');
        this.adjustHorizontalWrap(maxItemWidth, maxItemHeight, limitSize);
      } else {
        this.layoutButton('horizontal');
        this.adjustFlip(maxItemWidth, maxItemHeight, limitSize);
      }
    }
  }

  private adjustFlip(maxItemWidth: number, maxItemHeight: number, limitSize: number) {
    this.showButtonGroup();
    const buttonGroup = this.querySelector('.page-button-group') as Group;

    const pageSpacing = this.style.pageSpacing!;
    const pageButtonSize = this.prevButton.style.size || CategoryItems.defaultOptions.style.pageButtonSize;

    const buttonGroupBounds = buttonGroup.getLocalBounds();
    const buttonGroupWidth = buttonGroupBounds.halfExtents[0] * 2;
    const buttonGroupHeight = buttonGroupBounds.halfExtents[1] * 2;
    const [pageWidth, pageHeight] = this.ifHorizontal(
      [limitSize - (buttonGroupWidth + pageSpacing), maxItemHeight],
      [maxItemWidth, limitSize - (buttonGroupHeight + pageSpacing)]
    );
    this.clipView.style.path = `M0,0 L${pageWidth},0 L${pageWidth},${pageHeight} L0,${pageHeight} Z`;
    this.container.style.clipPath = this.clipView;
    // 更新 ButtonGroup 位置.
    buttonGroup.style.x = this.ifHorizontal(limitSize - buttonGroupWidth, 0);
    // todo 存在像素误差
    buttonGroup.style.y = this.ifHorizontal(pageHeight / 2 - 1, pageHeight + pageButtonSize + pageSpacing);

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
    this.showButtonGroup();
    const buttonGroup = this.querySelector('.page-button-group') as Group;

    const { pageSpacing = 0 } = this.style;
    const pageInfoWidth = this.pageInfoBounds.width;

    const maxRows = this.style.maxRows || 2;
    const buttonGroupBounds = buttonGroup.getLocalBounds();
    const buttonGroupWidth = Math.max(buttonGroupBounds.halfExtents[0] * 2, pageInfoWidth);

    const [pageWidth, pageHeight] = [limitSize - (buttonGroupWidth + pageSpacing), itemHeight * maxRows];
    this.clipView.style.path = `M0,0 L${pageWidth},0 L${pageWidth},${pageHeight} L0,${pageHeight} Z`;
    this.container.style.clipPath = this.clipView;

    // Get page info.
    function doLayout(pageSize: number, items: CategoryItem[]) {
      let row = 1;
      let offset = 0;
      const pageOffsets: number[] = [0];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
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
      return pageOffsets;
    }
    const pageOffsets = doLayout(pageWidth, this.items);

    // 不展示分页器.
    if (pageOffsets.length === 1) {
      const [offsetX, offsetY] = normalPadding(this.style.spacing);
      const offset = this.ifHorizontal(offsetX, offsetY);
      initPosition(this.items, this.style.orient || 'horizontal', offset);
      doLayout(limitSize, this.items);
      this.resetPageCfg();
      return;
    }
    this.maxPages = pageOffsets.length;
    this.currPage = 1;
    this.pageOffsets = pageOffsets;

    // 更新 ButtonGroup 位置. (todo 可以优化下，靠近 items 而不是贴边)
    buttonGroup.style.x = limitSize - buttonGroupWidth;
    // todo 后续修复 存在几像素误差
    buttonGroup.style.y = pageHeight / 2 - 2;
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
      this.nextButton.setState('disabled');
    } else {
      this.nextButton.setState('default');
    }
    if (this.currPage === 1) {
      this.prevButton.setState('disabled');
    } else {
      this.prevButton.setState('default');
    }
  }

  private updatePageButtonSymbol() {
    const { autoWrap } = this.style;
    const sign = this.ifHorizontal(autoWrap ? 1 : 0, 1);
    this.prevButton.update({ symbol: ['left', 'up'][sign] });
    this.nextButton.update({ symbol: ['right', 'down'][sign] });
  }

  private updatePageInfo() {
    const pageFormatter = this.styles.pageFormatter;
    select(this)
      .select('.page-info')
      .style('text', !(this.currPage && this.maxPages) ? '' : pageFormatter(this.currPage, this.maxPages));
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

  private goTo(to: number) {
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
