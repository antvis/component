import { DisplayObjectConfig, Group, Rect, Text } from '@antv/g';
import { clamp } from '@antv/util';
import { GUI } from '../../core/gui';
import type { Vector2 } from '../../types';
import type { Selection } from '../../util';
import {
  applyStyle,
  classNames,
  deepAssign,
  subObjects,
  select,
  styleSeparator,
  TEXT_INHERITABLE_PROPS,
  transpose,
  scaleToPixel,
} from '../../util';
import { button } from '../marker/symbol';
import type { NavigatorStyleProps } from './types';

export type { NavigatorOptions, NavigatorStyleProps } from './types';

const NAVIGATOR_DEFAULT_CFG: NavigatorStyleProps = {
  pageViews: [],
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

  private _currPage: number = 0;

  private finishedPromise: Promise<number> | null = null;

  private resolveFinishedPromise: Function | null = null;

  private playState: 'idle' | 'running' = 'idle';

  private playWindow!: Group;

  private clipPath!: Selection<Rect>;

  private prevBtnGroup!: Group;

  private nextBtnGroup!: Group;

  private pageInfoGroup!: Group;

  private get pageShape() {
    const { pageViews } = this.attributes;
    const [maxWidth, maxHeight] = transpose(
      pageViews.map((pageView) => {
        const { width, height } = pageView.getBBox();
        return [width, height];
      })
    ).map((arr) => Math.max(...arr));

    const { pageWidth = maxWidth, pageHeight = maxHeight } = this.attributes;
    return { pageWidth, pageHeight };
  }

  public get currPage() {
    return this._currPage;
  }

  public get finished() {
    if (!this.finishedPromise) {
      this.finishedPromise = new Promise((resolve, reject) => {
        this.resolveFinishedPromise = () => {
          this.finishedPromise = null;
          resolve(this.currPage);
        };
      });
    }
    if (this.playState === 'idle') this.resolveFinishedPromise?.();
    return this.finishedPromise;
  }

  private setVisiblePages(pages: number[]) {
    const { pageViews } = this.attributes;
    pageViews.forEach((page, index) => {
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
      attributes: { formatter, pageViews },
    } = this;
    if (pageViews.length < 2) return;
    (this.pageInfoGroup.querySelector(CLASS_NAMES.pageInfo.class) as Text)?.attr(
      'text',
      formatter!(currPage + 1, pageViews.length)
    );
    this.adjustControllerLayout();
  }

  private getFollowingPageDiff(pageNum: number) {
    const { orient } = this.attributes;
    const { pageWidth, pageHeight } = this.pageShape;
    const sign = pageNum < this.currPage ? -1 : 1;
    return orient === 'horizontal' ? [sign * pageWidth, 0] : [0, sign * pageHeight];
  }

  private prepareFollowingPage(pageNum: number) {
    const { pageViews } = this.attributes;
    this.setVisiblePages([pageNum, this.currPage]);
    const [dx, dy] = this.getFollowingPageDiff(pageNum);
    pageViews[pageNum].setLocalPosition(dx, dy);
  }

  private renderController(container: Selection) {
    const { controllerSpacing: spacing, pageViews } = this.attributes as Required<NavigatorStyleProps>;
    const { pageWidth, pageHeight } = this.pageShape;
    if (pageViews.length < 2) return;
    const [style, textStyle] = subObjects(this.attributes, ['button', 'pageNum']);
    const [{ size, ...pathStyle }, groupStyle] = styleSeparator(style);

    const prevBtnGroup = container.maybeAppendByClassName(CLASS_NAMES.prevBtnGroup, 'g').call(applyStyle, groupStyle);
    this.prevBtnGroup = prevBtnGroup.node();
    prevBtnGroup.maybeAppendByClassName(CLASS_NAMES.prevBtn, 'path').attr('className', 'btn');

    const nextBtnGroup = container.maybeAppendByClassName(CLASS_NAMES.nextBtnGroup, 'g').call(applyStyle, groupStyle);
    this.nextBtnGroup = nextBtnGroup.node();
    nextBtnGroup.maybeAppendByClassName(CLASS_NAMES.nextBtn, 'path').attr('className', 'btn');

    container
      .selectAll('.btn')
      .call(applyStyle, pathStyle)
      .each(function () {
        select(this).style('transformOrigin', 'center');
        scaleToPixel(select(this).node(), size, true);
      });

    const pageInfoGroup = container.maybeAppendByClassName(CLASS_NAMES.pageInfoGroup, 'g');
    this.pageInfoGroup = pageInfoGroup.node();
    pageInfoGroup
      .maybeAppendByClassName(CLASS_NAMES.pageInfo, 'text')
      .style('text', '')
      .call(applyStyle, { ...TEXT_INHERITABLE_PROPS, ...textStyle });

    this.updatePageInfo();

    // put it on the right side of the container
    container.node().setLocalPosition(pageWidth + spacing, pageHeight / 2);
    // add event
    prevBtnGroup.on('click', () => {
      this.prev();
    });
    nextBtnGroup.on('click', () => {
      this.next();
    });
  }

  public goTo(pageNum: number) {
    const { duration, effect, pageViews } = this.attributes;
    const { currPage, playState, finished, playWindow } = this;
    if (pageNum === currPage || playState !== 'idle' || pageNum < 0 || pageNum >= pageViews.length) return { finished };
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
      this._currPage = pageNum;
      this.playState = 'idle';
      this.setVisiblePages([pageNum]);
      this.updatePageInfo();
      this.resolveFinishedPromise?.();
    });

    return { finished };
  }

  public prev() {
    const { loop, pageViews } = this.attributes;
    const pages = pageViews.length;
    const page = this.currPage;
    const following = loop ? (page - 1 + pages) % pages : clamp(page - 1, 0, pages);
    return this.goTo(following);
  }

  public next() {
    const { loop, pageViews } = this.attributes;
    const pages = pageViews.length;
    const page = this.currPage;
    const following = loop ? (page + 1) % pages : clamp(page + 1, 0, pages);
    return this.goTo(following);
  }

  render(attributes: NavigatorStyleProps, container: Group) {
    const { pageViews, initPage } = attributes as Required<NavigatorStyleProps>;

    /**
     * container
     *  |- contentGroup (with clip path)
     *    |- playWindow (with animation)
     *      |- pages
     *  |- clipPath
     */

    this.clipPath = select(container).maybeAppendByClassName(
      CLASS_NAMES.clipPath,
      () =>
        new Rect({
          style: { x: 0, y: 0, width: 0, height: 0 },
        })
    );

    const contentGroup = select(container)
      .maybeAppendByClassName(CLASS_NAMES.contentGroup, 'g')
      .style('x', 0)
      .style('y', 0)
      .style('clipPath', this.clipPath.node());

    this.clipPath.style('width', this.pageShape.pageWidth).style('height', this.pageShape.pageHeight);

    this.playWindow = contentGroup.maybeAppendByClassName(CLASS_NAMES.playWindow, 'g').node();
    this.playWindow.removeChildren();

    pageViews.forEach((view) => this.playWindow.appendChild(view));

    this.setVisiblePages([initPage]);

    const ptGroup = select(container).maybeAppendByClassName(CLASS_NAMES.controller, 'g');
    this.renderController(ptGroup);

    this.goTo(initPage);
  }
}
