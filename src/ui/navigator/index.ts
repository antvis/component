import { DisplayObject, Rect } from '@antv/g';
import { clamp, get, noop, set } from '@antv/util';
import type { Vector2 } from '../../types';
import { button } from '../marker/symbol';
import type { Selection } from '../../util';
import {
  applyStyle,
  createComponent,
  getStylesFromPrefixed,
  select,
  styleSeparator,
  TEXT_INHERITABLE_PROPS,
  classNames,
} from '../../util';
import type { NavigatorStyleProps } from './types';

export type { NavigatorOptions, NavigatorStyleProps } from './types';

const NAVIGATOR_DEFAULT_CFG: NavigatorStyleProps = {
  pageWidth: 0,
  pageHeight: 0,
  pageViews: [],
  effect: 'linear',
  duration: 200,
  orient: 'horizontal',
  initPage: 0,
  loop: false,
  buttonPath: button(0, 0, 6),
  buttonFill: 'black',
  buttonCursor: 'pointer',
  formatter: (curr, total) => `${curr}/${total}`,
  pageNumFontSize: 12,
  pageNumFill: 'black',
  pageNumTextAlign: 'start',
  pageNumTextBaseline: 'middle',
  controllerPadding: 5,
  controllerSpacing: 5,
};

type GetState = <T = any>(key: string) => T;

type SetState = (key: string, value: any) => void;

type Context = {
  container: Selection;
  getState: GetState;
  setState: SetState;
  attributes: NavigatorStyleProps;
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

function setVisiblePages(pages: number[], ctx: Context) {
  const pageViews = ctx.getState<DisplayObject[]>('pageViews');
  pageViews.forEach((page, index) => {
    if (pages.includes(index)) page.attr('visibility', 'visible');
    else page.attr('visibility', 'hidden');
  });
}

function adjustControllerLayout(ctx: Context) {
  const { attributes, container } = ctx;
  const prevBtn = container.select(CLASS_NAMES.prevBtnGroup.class).node();
  const nextBtn = container.select(CLASS_NAMES.nextBtnGroup.class).node();
  const pageNum = container.select(CLASS_NAMES.pageInfoGroup.class).node();
  const { orient, controllerPadding: padding } = attributes as Required<NavigatorStyleProps>;
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

function updatePageInfo(ctx: Context) {
  const {
    getState,
    container,
    attributes: { formatter, pageViews },
  } = ctx;
  if (pageViews.length < 2) return;
  container.select(CLASS_NAMES.pageInfo.class).style('text', formatter!(getState('currPage') + 1, pageViews.length));
  adjustControllerLayout(ctx);
}

function getFollowingPageDiff(pageNum: number, ctx: Context): [number, number] {
  const { getState, attributes } = ctx;
  const { orient, pageWidth, pageHeight } = attributes;
  const sign = pageNum < getState('currPage') ? -1 : 1;
  return orient === 'horizontal' ? [sign * pageWidth, 0] : [0, sign * pageHeight];
}

function prepareFollowingPage(pageNum: number, ctx: Context) {
  const { getState } = ctx;
  setVisiblePages([pageNum, getState('currPage')], ctx);
  const [dx, dy] = getFollowingPageDiff(pageNum, ctx);
  getState('pageViews')[pageNum].setLocalPosition(dx, dy);
}

function goTo(pageNum: number, ctx: Context) {
  const { getState, setState, container, attributes } = ctx;
  const { duration, effect, pageViews } = attributes;
  const currPage = getState<number>('currPage');
  const playState = getState<string>('playState');
  const finished = getState<Promise<any>>('finished');
  const playWindow = container.select(CLASS_NAMES.playWindow.class).node();

  if (pageNum === currPage || playState !== 'idle' || pageNum < 0 || pageNum >= pageViews.length) return { finished };
  getState('pageViews')[currPage].setLocalPosition(0, 0);
  prepareFollowingPage(pageNum, ctx);

  const animateCfg = { duration, easing: effect, fill: 'both' } as const;
  const [dx, dy] = getFollowingPageDiff(pageNum, ctx);
  setState('playState', 'running');
  Promise.all(
    [
      playWindow.animate([{ transform: `translate(0, 0)` }, { transform: `translate(${-dx}, ${-dy})` }], animateCfg),
    ].map((ani) => ani?.finished)
  ).then(() => {
    setState('currPage', pageNum);
    setState('playState', 'idle');
    setVisiblePages([pageNum], ctx);
    updatePageInfo(ctx);
    get(container, ['_elements', 0, 'resolveFinishedPromise'], noop)?.();
  });

  return { finished };
}

function prev(ctx: Context) {
  const { attributes, getState } = ctx;
  const { loop } = attributes;
  const pages = attributes.pageViews.length;
  const page = getState<number>('currPage');
  const following = loop ? (page - 1 + pages) % pages : clamp(page - 1, 0, pages);
  return goTo(following, ctx);
}

function next(ctx: Context) {
  const { attributes, getState } = ctx;
  const { loop } = attributes;
  const pages = attributes.pageViews.length;
  const page = getState<number>('currPage');
  const following = loop ? (page + 1) % pages : clamp(page + 1, 0, pages);
  return goTo(following, ctx);
}

function renderController(container: Selection, ctx: Context) {
  const { attributes } = ctx;
  const { pageHeight, pageWidth, controllerSpacing: spacing, pageViews } = attributes as Required<NavigatorStyleProps>;
  if (pageViews.length < 2) return;
  const [style, textStyle] = getStylesFromPrefixed(attributes, ['button', 'pageNum']);
  const [pathStyle, groupStyle] = styleSeparator(style);

  const prevBtnGroup = container.maybeAppendByClassName(CLASS_NAMES.prevBtnGroup, 'g').call(applyStyle, groupStyle);
  prevBtnGroup.maybeAppendByClassName(CLASS_NAMES.prevBtn, 'path').attr('className', 'btn');

  const nextBtnGroup = container.maybeAppendByClassName(CLASS_NAMES.nextBtnGroup, 'g').call(applyStyle, groupStyle);
  nextBtnGroup.maybeAppendByClassName(CLASS_NAMES.nextBtn, 'path').attr('className', 'btn');

  container.selectAll('.btn').call(applyStyle, pathStyle);

  const pageInfoGroup = container.maybeAppendByClassName(CLASS_NAMES.pageInfoGroup, 'g');
  pageInfoGroup
    .maybeAppendByClassName(CLASS_NAMES.pageInfo, 'text')
    .style('text', '')
    .call(applyStyle, { ...TEXT_INHERITABLE_PROPS, ...textStyle });

  updatePageInfo(ctx);

  // put it on the right side of the container
  container.node().setLocalPosition(pageWidth + spacing, pageHeight / 2);
  // add event
  prevBtnGroup.on('click', () => {
    prev(ctx);
  });
  nextBtnGroup.on('click', () => {
    next(ctx);
  });
}

export const Navigator = createComponent<NavigatorStyleProps>(
  {
    render(attributes, container) {
      const { pageWidth, pageHeight, pageViews, initPage } = attributes as Required<NavigatorStyleProps>;
      const _set = (key: string | string[], val: any) => {
        set(container, key, val);
      };
      const _get = (key: string | string[]) => get(container, key);
      const setState: SetState = (key, val) => {
        _set(['__state', key], val);
      };
      const getState: GetState = (key) => _get(['__state', key]);
      function assignStates(state: { [key: string]: any }) {
        Object.entries(state).forEach(([key, val]) => setState(key, val));
      }

      const ctx: Context = { getState, setState, container: select(container), attributes };

      Object.assign(container, {
        finishedPromise: null,
        resolveFinishedPromise: null,
        goTo: (pageNum: number) => goTo(pageNum, ctx),
        prev: () => prev(ctx),
        next: () => next(ctx),
      });

      assignStates({
        currPage: 0,
        pageViews,
        playState: 'idle',
        get finished() {
          const playState = getState('playState');
          let finishedPromise = _get('finishedPromise');
          if (!finishedPromise) {
            finishedPromise = new Promise((resolve) => {
              _set('resolveFinishedPromise', () => {
                _set('finishedPromise', null);
                resolve(_get('currPage'));
              });
            });

            _set('finishedPromise', finishedPromise);
          }
          if (playState === 'idle') _get('resolveFinishedPromise')?.();
          return finishedPromise as Promise<any>;
        },
      });

      /**
       * container
       *  |- contentGroup (with clip path)
       *    |- playWindow (with animation)
       *      |- pages
       *  |- clipPath
       */

      const clipPath = select(container).maybeAppendByClassName(
        CLASS_NAMES.clipPath,
        () =>
          new Rect({
            style: { x: 0, y: 0, width: pageWidth, height: pageHeight },
          })
      );

      const contentGroup = select(container)
        .maybeAppendByClassName(CLASS_NAMES.contentGroup, 'g')
        .style('x', 0)
        .style('y', 0)
        .style('clipPath', clipPath.node());

      const playWindow = contentGroup.maybeAppendByClassName(CLASS_NAMES.playWindow, 'g');

      playWindow.node().removeChildren();

      getState<DisplayObject[]>('pageViews').forEach((view) => playWindow.node().appendChild(view));

      setVisiblePages([initPage], ctx);

      const ptGroup = select(container).maybeAppendByClassName(CLASS_NAMES.controller, 'g');
      renderController(ptGroup, ctx);
      goTo(initPage, ctx);
    },
  },
  {
    ...NAVIGATOR_DEFAULT_CFG,
  }
);
