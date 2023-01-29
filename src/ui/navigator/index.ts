import { ElementEvent, Group, Rect, Text, type DisplayObjectConfig } from '@antv/g';
import { clamp, debounce } from '@antv/util';
import { GUI } from '../../core/gui';
import type { Vector2 } from '../../types';
import {
  classNames,
  deepAssign,
  scaleToPixel,
  select,
  styleSeparator,
  subObjects,
  TEXT_INHERITABLE_PROPS,
  transpose,
  type Selection,
} from '../../util';
import { button } from '../marker/symbol';
import type { NavigatorStyleProps } from './types';

export type { NavigatorOptions, NavigatorStyleProps } from './types';

const NAVIGATOR_DEFAULT_CFG: NavigatorStyleProps = {
  effect: 'linear',
  duration: 200,
  orient: 'horizontal',
  initPage: 0,
  loop: false,
  buttonPath: button(0, 0, 6),
  buttonFill: 'black',
  buttonSize: 12,
  buttonCursor: 'pointer',
  formatter: (curr, total) => `${curr}/${total}`,
  pageNumFontSize: 12,
  pageNumFill: 'black',
  pageNumTextAlign: 'start',
  pageNumTextBaseline: 'middle',
  controllerPadding: 5,
  controllerSpacing: 5,
};

const CLASS_NAMES = classNames(
  {
    prevBtnGroup: 'prev-btn-group',
    prevBtn: 'prev-btn',
    nextBtnGroup: 'next-btn-group',
    nextBtn: 'next-btn',
    pageInfoGroup: 'page-info-group',
    pageInfo: 'page-info',
    playWindow: 'play-window',
    contentGroup: 'content-group',
    controller: 'controller',
    clipPath: 'clip-path',
  },
  'navigator'
);

export class Navigator extends GUI<NavigatorStyleProps> {
  constructor(options: DisplayObjectConfig<NavigatorStyleProps>) {
    super(deepAssign({}, { style: NAVIGATOR_DEFAULT_CFG }, options));
  }

  private finishedPromise: Promise<number> | null = null;

  private resolveFinishedPromise: Function | null = null;

  private playState: 'idle' | 'running' = 'idle';

  private contentGroup = this.appendChild(new Group({ class: CLASS_NAMES.contentGroup.name }));

  private playWindow = this.contentGroup.appendChild(new Group({ class: CLASS_NAMES.playWindow.name }));

  private get defaultPage() {
    const { initPage = 0 } = this.attributes;
    return clamp(initPage, 0, Math.max(this.pageViews.length - 1, 0));
  }

  private innerCurrPage: number = this.defaultPage;

  private clipPath!: Selection<Rect>;

  private prevBtnGroup!: Group;

  private nextBtnGroup!: Group;

  private pageInfoGroup!: Group;

  private get pageViews() {
    return this.playWindow.children as Group[];
  }

  // todo fixme
  private get controllerShape() {
    return this.totalPages > 1 ? { width: 55, height: 0 } : { width: 0, height: 0 };
  }

  private get pageShape() {
    const { pageViews } = this;
    const [maxWidth, maxHeight] = transpose(
      pageViews.map((pageView) => {
        const { width, height } = pageView.getBBox();
        return [width, height];
      })
    ).map((arr) => Math.max(...arr));

    const { pageWidth = maxWidth, pageHeight = maxHeight } = this.attributes;

    return { pageWidth, pageHeight };
  }

  public getContainer() {
    return this.playWindow;
  }

  public get totalPages() {
    return this.pageViews.length;
  }

  public get currPage() {
    return this.innerCurrPage;
  }

  public get finished() {
    if (!this.finishedPromise) {
      this.finishedPromise = new Promise((resolve) => {
        this.resolveFinishedPromise = () => {
          this.finishedPromise = null;
          resolve(this.currPage);
        };
      });
    }
    if (this.playState === 'idle') this.resolveFinishedPromise?.();
    return this.finishedPromise;
  }

  public getBBox(): DOMRect {
    const { x, y } = super.getBBox();
    const controllerShape = this.controllerShape;
    const { pageWidth, pageHeight } = this.pageShape;
    return new DOMRect(x, y, pageWidth + controllerShape.width, pageHeight);
  }

  public goTo(pageNum: number) {
    const { duration, effect } = this.attributes;
    const { currPage, playState, finished, playWindow, pageViews } = this;
    if (playState !== 'idle' || pageNum < 0 || pageViews.length <= 0 || pageNum >= pageViews.length)
      return { finished: this.finished };
    pageViews[currPage].setLocalPosition(0, 0);
    this.prepareFollowingPage(pageNum);
    const animateCfg = { duration, easing: effect, fill: 'both' } as const;
    const [dx, dy] = this.getFollowingPageDiff(pageNum);
    this.playState = 'running';
    Promise.all(
      [
        playWindow.animate([{ transform: `translate(0, 0)` }, { transform: `translate(${-dx}, ${-dy})` }], animateCfg),
      ].map((ani) => ani?.finished)
    ).then(() => {
      this.innerCurrPage = pageNum;
      this.playState = 'idle';
      this.setVisiblePages([pageNum]);
      this.updatePageInfo();
      this.resolveFinishedPromise?.();
    });

    return { finished: this.finished };
  }

  public prev() {
    const { loop } = this.attributes;
    const pages = this.pageViews.length;
    const page = this.currPage;
    if (!loop && page <= 0) return { finished: this.finished };
    const following = loop ? (page - 1 + pages) % pages : clamp(page - 1, 0, pages);
    return this.goTo(following);
  }

  public next() {
    const { loop } = this.attributes;
    const pages = this.pageViews.length;
    const page = this.currPage;
    if (!loop && page >= pages - 1) return { finished: this.finished };
    const following = loop ? (page + 1) % pages : clamp(page + 1, 0, pages);
    return this.goTo(following);
  }

  private renderClipPath(container: Selection) {
    const { pageWidth, pageHeight } = this.pageShape;
    this.clipPath = container.maybeAppendByClassName(CLASS_NAMES.clipPath, 'rect').styles({
      width: pageWidth,
      height: pageHeight,
    });

    this.contentGroup.attr('clipPath', this.clipPath.node());
  }

  private setVisiblePages(pages: number[]) {
    (this.playWindow.children as Group[]).forEach((page, index) => {
      if (pages.includes(index)) page.attr('visibility', 'visible');
      else page.attr('visibility', 'hidden');
    });
  }

  private adjustControllerLayout() {
    const { prevBtnGroup: prevBtn, nextBtnGroup: nextBtn, pageInfoGroup: pageNum } = this;
    const { orient, controllerPadding: padding } = this.attributes as Required<NavigatorStyleProps>;
    const { width: pW, height: pH } = pageNum.getBBox();

    const [r1, r2] = orient === 'horizontal' ? [-180, 0] : [-90, 90];
    prevBtn.setLocalEulerAngles(r1);
    nextBtn.setLocalEulerAngles(r2);

    const { width: bpW, height: bpH } = prevBtn.getBBox();
    const { width: bnW, height: bnH } = nextBtn.getBBox();

    const maxWidth = Math.max(bpW, pW, bnW);

    const {
      offset: [[o1x, o1y], [o2x, o2y], [o3x, o3y]],
      textAlign,
    }: {
      offset: [Vector2, Vector2, Vector2];
      textAlign: string;
    } =
      orient === 'horizontal'
        ? {
            offset: [
              [0, 0],
              [bpW / 2 + padding, 0],
              [bpW + pW + padding * 2, 0],
            ],
            textAlign: 'start',
          }
        : {
            offset: [
              [maxWidth / 2, -bpH - padding],
              [maxWidth / 2, 0],
              [maxWidth / 2, bnH + padding],
            ],
            textAlign: 'center',
          };

    const pageNumText = pageNum.querySelector('text');
    pageNumText && (pageNumText.style.textAlign = textAlign);

    prevBtn.setLocalPosition(o1x, o1y);
    pageNum.setLocalPosition(o2x, o2y);
    nextBtn.setLocalPosition(o3x, o3y);
  }

  private updatePageInfo() {
    const {
      currPage,
      pageViews,
      attributes: { formatter },
    } = this;
    if (pageViews.length < 2) return;
    (this.pageInfoGroup.querySelector(CLASS_NAMES.pageInfo.class) as Text)?.attr(
      'text',
      formatter!(currPage + 1, pageViews.length)
    );
    this.adjustControllerLayout();
  }

  private getFollowingPageDiff(pageNum: number) {
    const { currPage } = this;
    if (currPage === pageNum) return [0, 0];
    const { orient } = this.attributes;
    const { pageWidth, pageHeight } = this.pageShape;
    const sign = pageNum < currPage ? -1 : 1;
    return orient === 'horizontal' ? [sign * pageWidth, 0] : [0, sign * pageHeight];
  }

  private prepareFollowingPage(pageNum: number) {
    const { currPage, pageViews } = this;
    this.setVisiblePages([pageNum, currPage]);
    if (pageNum !== currPage) {
      const [dx, dy] = this.getFollowingPageDiff(pageNum);
      pageViews[pageNum].setLocalPosition(dx, dy);
    }
  }

  private renderController(container: Selection) {
    const { controllerSpacing: spacing } = this.attributes as Required<NavigatorStyleProps>;
    const { pageWidth, pageHeight } = this.pageShape;
    const visible = this.pageViews.length >= 2;

    const group = container
      .maybeAppendByClassName(CLASS_NAMES.controller, 'g')
      .style('visibility', visible ? 'visible' : 'hidden');

    if (!visible) return;

    const [style, textStyle] = subObjects(this.attributes, ['button', 'pageNum']);
    const [{ size, ...pathStyle }, groupStyle] = styleSeparator(style);

    const prevBtnGroup = group.maybeAppendByClassName(CLASS_NAMES.prevBtnGroup, 'g').styles(groupStyle);
    this.prevBtnGroup = prevBtnGroup.node();
    const prevBtn = prevBtnGroup.maybeAppendByClassName(CLASS_NAMES.prevBtn, 'path');

    const nextBtnGroup = group.maybeAppendByClassName(CLASS_NAMES.nextBtnGroup, 'g').styles(groupStyle);
    this.nextBtnGroup = nextBtnGroup.node();
    const nextBtn = nextBtnGroup.maybeAppendByClassName(CLASS_NAMES.nextBtn, 'path');

    [prevBtn, nextBtn].forEach((btn) => {
      btn.styles({ ...pathStyle, transformOrigin: 'center' });
      scaleToPixel(btn.node(), size, true);
    });

    const pageInfoGroup = group.maybeAppendByClassName(CLASS_NAMES.pageInfoGroup, 'g');
    this.pageInfoGroup = pageInfoGroup.node();
    pageInfoGroup
      .maybeAppendByClassName(CLASS_NAMES.pageInfo, 'text')
      .styles({ ...TEXT_INHERITABLE_PROPS, ...textStyle });

    this.updatePageInfo();

    // put it on the right side of the container
    group.node().setLocalPosition(pageWidth + spacing, pageHeight / 2);
    // add event
    prevBtnGroup.on('click', () => {
      this.prev();
    });
    nextBtnGroup.on('click', () => {
      this.next();
    });
  }

  render(attributes: NavigatorStyleProps, container: Group) {
    /**
     * container
     *  |- contentGroup (with clip path)
     *    |- playWindow (with animation)
     *      |- pages
     *  |- clipPath
     */
    const containerSelection = select(container);
    this.renderClipPath(containerSelection);
    this.renderController(containerSelection);
    this.setVisiblePages([this.defaultPage]);
    this.goTo(this.defaultPage);
  }

  public bindEvents() {
    const render = debounce(() => this.render(this.attributes, this), 50);
    this.playWindow.addEventListener(ElementEvent.INSERTED, render);
    this.playWindow.addEventListener(ElementEvent.REMOVED, render);
  }
}
