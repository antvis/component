import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Breadcrumb } from '../../../../src';
import { createDiv } from '../../../utils';
import { createCanvas } from '../../../utils/render';

const renderer = new CanvasRenderer();

describe('breadcrumb', () => {
  test('basic', async () => {
    const canvas = createCanvas();
    const breadcrumb = new Breadcrumb({
      style: {
        x: 50,
        y: 40,
        items: [
          { text: '测试1', id: '测试1' },
          { text: '测试2', id: '测试2' },
          { text: '测试3', id: '测试3' },
          { text: '测试4', id: '测试4' },
        ],
      },
    });
    canvas.appendChild(breadcrumb);

    await canvas.ready;

    let { padding } = breadcrumb.attributes;
    if (!Array.isArray(padding)) {
      padding = [padding, padding, padding, padding];
    }

    const container = breadcrumb.querySelector('.container') as any;
    expect(container.children.length).toBe(4 * 2 - 1);

    const breadItemShapes = container.querySelectorAll('.breadcrumb-item');
    const separatorShapes = container.querySelectorAll('.breadcrumb-separator');

    expect(breadItemShapes.length).toBe(4);
    expect(separatorShapes.length).toBe(3);

    // @ts-ignore
    breadItemShapes.forEach((item, idx) => expect(item.attr().text).toBe(`测试${idx + 1}`));
    // @ts-ignore
    separatorShapes.forEach((item) => expect(item.attr().text).toBe(`/`));
  });

  test('custom style', async () => {
    const div = createDiv();

    const canvas = new Canvas({
      container: div,
      width: 300,
      height: 300,
      renderer,
    });

    const breadcrumb = new Breadcrumb({
      style: {
        x: 50,
        y: 40,
        items: [
          { text: '测试1', id: '测试1' },
          { text: '测试2', id: '测试2' },
          { text: '测试3', id: '测试3' },
          { text: '测试4', id: '测试4' },
        ],
        textStyle: {
          fill: '#f00',
          fontSize: 16,
        },
        padding: [20, 20, 20, 20],
      },
    });
    canvas.appendChild(breadcrumb);
    await canvas.ready;

    const { padding } = breadcrumb.attributes;

    expect(padding).toEqual([20, 20, 20, 20]);
  });

  test('custom separator', async () => {
    const div = createDiv();

    const canvas = new Canvas({
      container: div,
      width: 300,
      height: 300,
      renderer,
    });

    const breadcrumb = new Breadcrumb({
      style: {
        x: 50,
        y: 40,
        items: [
          { text: '测试1', id: '测试1' },
          { text: '测试2', id: '测试2' },
          { text: '测试3', id: '测试3' },
          { text: '测试4', id: '测试4' },
        ],
        separator: {
          spacing: 10,
          text: '>',
          style: {
            fill: '#f00',
            fontSize: 12,
          },
        },
      },
    });
    canvas.appendChild(breadcrumb);

    // const { separator } = breadcrumb.attributes;
    // to be fix later
    // expect(separator).toEqual({
    //   spacing: 10,
    //   text: '>',
    //   style: {
    //     fill: '#f00',
    //     fontSize: 12,
    //     lineHeight: 14,
    //   },
    // });
    await canvas.ready;

    const childrens = breadcrumb.children;
    const separatorShapes = childrens.filter((item) => item.name === 'breadcrumb-separator');
    // @ts-ignore
    separatorShapes.forEach((item) => expect(item.attr().text).toBe(`>`));
  });

  test('custom width', async () => {
    const div = createDiv();
    const canvas = new Canvas({
      container: div,
      width: 300,
      height: 300,
      renderer,
    });
    const breadcrumb = new Breadcrumb({
      style: {
        x: 0,
        y: 0,
        items: [
          { text: '测试1', id: '测试1' },
          { text: '测试2', id: '测试2' },
          { text: '测试3', id: '测试3' },
          { text: '测试4', id: '测试4' },
        ],
        width: 200,
      },
    });
    canvas.appendChild(breadcrumb);

    const { x, width } = breadcrumb.attributes;
    let { padding } = breadcrumb.attributes;
    if (!Array.isArray(padding)) {
      padding = [padding, padding, padding, padding];
    }
    await canvas.ready;

    const children = (breadcrumb.querySelector('.container') as any).children;
    const breadItemShapes = children.filter((item) => item.name === 'breadcrumb-item');
    const separatorShapes = children.filter((item) => item.name === 'breadcrumb-separator');

    breadItemShapes.forEach((item) => {
      // @ts-ignore
      const rect = item.getBoundingClientRect();
      expect(rect.right).not.toBeGreaterThan(x + width - (padding as number[])[1]);
      separatorShapes.forEach((item) => {
        // @ts-ignore
        const rect = item.getBoundingClientRect();
        expect(rect.right).not.toBeGreaterThan(x + width - (padding as number[])[1]);
        // [todo]
        // expect(rect.left).not.toBeLessThan(x + (padding as number[])[3]);
      });

      // fixme later
      // expect(rect.left).not.toBeLessThan(x + (padding as number[])[3]);
    });
  });
});
