import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Breadcrumb } from '../../../../src';
import { createDiv } from '../../../utils';

const renderer = new CanvasRenderer();

describe('breadcrumb', () => {
  test('basic', async () => {
    const div = createDiv();

    const canvas = new Canvas({
      container: div,
      width: 500,
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
      },
    });

    let { padding } = breadcrumb.attributes;
    if (!Array.isArray(padding)) {
      padding = [padding, padding, padding, padding];
    }

    const { children } = breadcrumb.container;
    expect(children.length).toBe(4 * 2 - 1);

    const breadItemShapes = children.filter((item) => item.name === 'breadcrumb-item');
    const separatorShapes = children.filter((item) => item.name === 'breadcrumb-separator');

    expect(breadItemShapes.length).toBe(4);
    expect(separatorShapes.length).toBe(3);

    // @ts-ignore
    breadItemShapes.forEach((item, idx) => expect(item.attr().text).toBe(`测试${idx + 1}`));
    // @ts-ignore
    separatorShapes.forEach((item) => expect(item.attr().text).toBe(`/`));

    canvas.appendChild(breadcrumb);
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

    const { padding } = breadcrumb.attributes;

    expect(padding).toEqual([20, 20, 20, 20]);

    canvas.appendChild(breadcrumb);
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

    const childrens = breadcrumb.children;
    const separatorShapes = childrens.filter((item) => item.name === 'breadcrumb-separator');
    // @ts-ignore
    separatorShapes.forEach((item) => expect(item.attr().text).toBe(`>`));

    canvas.appendChild(breadcrumb);
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

    const { x, width } = breadcrumb.attributes;
    let { padding } = breadcrumb.attributes;
    if (!Array.isArray(padding)) {
      padding = [padding, padding, padding, padding];
    }

    const childrens = breadcrumb.container.children;

    const breadItemShapes = childrens.filter((item) => item.name === 'breadcrumb-item');
    const separatorShapes = childrens.filter((item) => item.name === 'breadcrumb-separator');

    breadItemShapes.forEach((item) => {
      // @ts-ignore
      const rect = item.getBoundingClientRect();
      expect(rect.right).not.toBeGreaterThan(x + width - (padding as number[])[1]);
      // fixme later
      // expect(rect.left).not.toBeLessThan(x + (padding as number[])[3]);
    });

    separatorShapes.forEach((item) => {
      // @ts-ignore
      const rect = item.getBoundingClientRect();
      expect(rect.right).not.toBeGreaterThan(x + width - (padding as number[])[1]);
      // [todo]
      // expect(rect.left).not.toBeLessThan(x + (padding as number[])[3]);
    });

    canvas.appendChild(breadcrumb);
  });
});
