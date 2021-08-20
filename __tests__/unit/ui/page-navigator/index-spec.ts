import { Canvas, Text, Group, Rect } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { PageNavigator } from '../../../../src';
import { createDiv } from '../../../utils';
import { getShapeSpace } from '../../../../src/util';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

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
        x: width * i,
        y: 0,
        width,
        height,
        fill: '#f3f3f3',
        stroke: 'gray',
        lineWidth: 0,
      },
    });
    const text = new Text({
      style: {
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

describe('page navigator', () => {
  test('create page', () => {
    const { width, height } = getShapeSpace(pages);
    expect(width).toBe(pageCount * pageWidth);
    expect(height).toBe(pageHeight);
  });

  test('page navigator', async () => {
    const pageNavigator = new PageNavigator({
      style: {
        x: 100,
        y: 100,
        view: pages,
        pageWidth,
        pageHeight,
        initPageNum: 1,
        loop: false,
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
    expect(width).toBe(pageWidth);
    expect(height).toBe(pageHeight);
    // 第1页
    expect(pages.attr('x')).toBe(0);
    // 第二页
    await pageNavigator.next().then((e) => {
      console.log('to page:', e);
    });
    expect(pages.attr('x')).toBe(-pageWidth);
    // 第三页
    await pageNavigator.goTo(3).then((e) => {
      console.log('to page:', e);
    });
    expect(pages.attr('x')).toBe(-pageWidth * 2);
    // 第四页
    await pageNavigator.next().then((e) => {
      console.log('to page:', e);
    });
    expect(pages.attr('x')).toBe(-pageWidth * 3);
  });
});
