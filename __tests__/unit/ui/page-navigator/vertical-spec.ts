import { Canvas, Text, Group, Rect } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { PageNavigator } from '../../../../src';
import { createDiv } from '../../../utils';
import { getShapeSpace, TEXT_INHERITABLE_PROPS } from '../../../../src/util';

const renderer = new CanvasRenderer();

const div = createDiv();

const canvas = new Canvas({
  container: div,
  width: 600,
  height: 600,
  renderer,
});

const pages = new Group({ name: 'group' });

function createPages(count: number, width: number, height: number) {
  const pages = [];
  for (let i = 0; i < count; i += 1) {
    const rect = new Rect({
      style: {
        x: 0,
        y: height * i,
        width,
        height,
        fill: '#fff',
        stroke: 'gray',
        lineWidth: 0,
      },
    });
    const text = new Text({
      style: {
        ...TEXT_INHERITABLE_PROPS,
        x: width / 2,
        y: height / 2,
        text: `第${i}页`,
        fill: 'black',
        fontSize: 20,
        textAlign: 'center',
        textBaseline: 'middle',
      },
    });
    rect.appendChild(text);
    pages.push(rect);
  }
  return pages;
}

const pageCount = 5;
const pageWidth = 150;
const pageHeight = 200;

createPages(pageCount, pageWidth, pageHeight).forEach((shape) => pages.appendChild(shape));

describe.skip('vertical page navigator', () => {
  test('create page', () => {
    const { width, height } = getShapeSpace(pages);
    expect(width).toBe(pageWidth);
    expect(height).toBe(pageCount * pageHeight);
  });

  test('vertical', async () => {
    const pageNavigator = new PageNavigator({
      style: {
        x: 100,
        y: 100,
        view: pages,
        width: pageWidth,
        height: pageCount * pageHeight,
        pageWidth,
        pageHeight,
        initPageNum: 1,
        orient: 'vertical',
        loop: true,
        button: {
          prev: {
            text: '⇦ 前一页',
            type: 'primary',
            buttonStyle: {
              default: {
                fill: '#fff',
                stroke: '#000',
              },
              active: {
                stroke: '#c0365a',
                fill: '#fff',
              },
            },
            textStyle: {
              default: {
                fontSize: 10,
                fill: 'gray',
              },
              active: {
                fontSize: 10,
                fill: '#c0365a',
              },
            },
          },
          next: {
            text: '后一页 ⇨',
            type: 'primary',
            buttonStyle: {
              default: {
                fill: '#fff',
                stroke: '#000',
              },
              active: {
                stroke: '#c0365a',
                fill: '#fff',
              },
            },
            textStyle: {
              default: {
                fontSize: 10,
                fill: 'gray',
              },
              active: {
                fontSize: 10,
                fill: '#c0365a',
              },
            },
          },
          position: 'bottom',
        },
      },
    });

    canvas.appendChild(pageNavigator);

    const { width, height } = getShapeSpace(pages);
    // 被裁切后
    expect(width).toBeCloseTo(pageWidth);
    expect(height).toBeCloseTo(pageHeight);

    // 第1页
    expect(pages.getLocalPosition()[1]).toBeCloseTo(0);
    // 第二页
    await pageNavigator.next().then((e) => {
      //
    });
    expect(pages.getLocalPosition()[1]).toBeCloseTo(-pageHeight);
    // 第三页
    await pageNavigator.goTo(3).then((e) => {
      //
    });
    expect(pages.getLocalPosition()[1]).toBeCloseTo(-pageHeight * 2);
    // 第四页
    await pageNavigator.next().then((e) => {
      //
    });
    expect(pages.getLocalPosition()[1]).toBeCloseTo(-pageHeight * 3);
  });
});
