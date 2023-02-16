import { Canvas, Group, Rect } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Navigator } from '../../../../src';
import { getShapeSpace } from '../../../../src/util';
import { createDiv } from '../../../utils';

const renderer = new CanvasRenderer();

const div = createDiv();

const canvas = new Canvas({
  container: div,
  width: 600,
  height: 600,
  renderer,
});

function createPages(count: number, width: number, height: number) {
  return new Array(count).fill(0).map(() => {
    const g = new Group();
    g.appendChild(
      new Rect({
        style: {
          width,
          height,
          fill: 'pink',
        },
      })
    );
    return g;
  });
}

const pageCount = 5;
const pageWidth = 150;
const pageHeight = 200;

const pages = createPages(pageCount, pageWidth, pageHeight);

describe.skip('vertical page navigator', () => {
  test('create page', () => {
    const { width, height } = getShapeSpace(pages[0]);
    expect(width).toBe(pageWidth);
    expect(height).toBe(pageHeight);
  });

  test('vertical', async () => {
    const navigator = new Navigator({
      style: {
        x: 100,
        y: 100,
        pageViews: pages,
        pageWidth,
        pageHeight,
        initPage: 1,
        orientation: 'vertical',
        loop: true,
        buttonFill: '#000',
      },
    });

    canvas.appendChild(navigator);

    // 第1页
    expect(pages[0].getLocalPosition()[0]).toBeCloseTo(0);
    // 第二页
    // @ts-ignore
    await navigator.next();
    expect(pages[1].getLocalPosition()[1]).toBeCloseTo(0);
    // 第三页
    // @ts-ignore
    await navigator.goTo(3);
    expect(pages[2].getLocalPosition()[1]).toBeCloseTo(0);
    // 第四页
    // @ts-ignore
    await navigator.next();
    expect(pages[3].getLocalPosition()[1]).toBeCloseTo(0);
  });
});
