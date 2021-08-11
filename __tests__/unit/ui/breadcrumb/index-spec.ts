import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { head, last } from '@antv/util';
import { BreadCrumb } from '../../../../src';
import { createDiv } from '../../../utils';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

describe('breadcrumb', () => {
  test('basic', async () => {
    const div = createDiv();

    const canvas = new Canvas({
      container: div,
      width: 500,
      height: 300,
      renderer,
    });

    const breadcrumb = new BreadCrumb({
      style: {
        x: 50,
        y: 40,
        items: [
          { name: '测试1', id: '测试1' },
          { name: '测试2', id: '测试2' },
          { name: '测试3', id: '测试3' },
          { name: '测试4', id: '测试4' },
        ],
      },
    });

    const { x, y, textStyle } = breadcrumb.attributes;
    // @ts-ignore
    const padding = breadcrumb.getPadding();

    expect(x).toBe(50);
    expect(y).toBe(40);

    const { children } = breadcrumb;
    expect(children.length).toBe(8);

    const breadItemShapes = children.filter((item) => item.attr().tag === 'breadcrumb-item');
    const separatorShapes = children.filter((item) => item.attr().tag === 'breadcrumb-separator');
    const containerShapes = children.filter((item) => item.attr().tag === 'breadcrumb-container');

    expect(breadItemShapes.length).toBe(4);
    expect(separatorShapes.length).toBe(3);
    expect(containerShapes.length).toBe(1);

    breadItemShapes.forEach((item, idx) => expect(item.attr().text).toBe(`测试${idx + 1}`));
    separatorShapes.forEach((item) => expect(item.attr().text).toBe(`/`));

    const lastItemRect = last(breadItemShapes).getBoundingClientRect();
    const headItemRect = head(breadItemShapes).getBoundingClientRect();
    expect(containerShapes[0].attr().width).toBeCloseTo(
      lastItemRect.right - headItemRect.left + padding[1] + padding[3]
    );
    expect(containerShapes[0].attr().height).toBeCloseTo(textStyle.default!.lineHeight + padding[2] + padding[0]);

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

    const breadcrumb = new BreadCrumb({
      style: {
        x: 50,
        y: 40,
        items: [
          { name: '测试1', id: '测试1' },
          { name: '测试2', id: '测试2' },
          { name: '测试3', id: '测试3' },
          { name: '测试4', id: '测试4' },
        ],
        textStyle: {
          default: {
            fill: '#f00',
            fontSize: 16,
          },
          active: {
            fill: '#0f0',
          },
        },
        padding: [20, 20, 20, 20],
      },
    });

    const { textStyle, padding } = breadcrumb.attributes;

    // to be fix later
    // expect(textStyle).toEqual({
    //   default: {
    //     fontSize: 16,
    //     fill: '#f00',
    //     cursor: 'pointer',
    //     lineHeight: 14,
    //   },
    //   active: {
    //     fontSize: 14,
    //     fill: '#0f0',
    //     lineHeight: 14,
    //   },
    // });
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

    const breadcrumb = new BreadCrumb({
      style: {
        x: 50,
        y: 40,
        items: [
          { name: '测试1', id: '测试1' },
          { name: '测试2', id: '测试2' },
          { name: '测试3', id: '测试3' },
          { name: '测试4', id: '测试4' },
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

    const { separator } = breadcrumb.attributes;

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
    const separatorShapes = childrens.filter((item) => item.attr().tag === 'breadcrumb-separator');
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

    const breadcrumb = new BreadCrumb({
      style: {
        x: 0,
        y: 0,
        items: [
          { name: '测试1', id: '测试1' },
          { name: '测试2', id: '测试2' },
          { name: '测试3', id: '测试3' },
          { name: '测试4', id: '测试4' },
        ],
        width: 200,
      },
    });

    const { x, y, width } = breadcrumb.attributes;
    // @ts-ignore
    const padding = breadcrumb.getPadding();

    const childrens = breadcrumb.children;

    const breadItemShapes = childrens.filter((item) => item.attr().tag === 'breadcrumb-item');
    const separatorShapes = childrens.filter((item) => item.attr().tag === 'breadcrumb-separator');
    const containerShapes = childrens.filter((item) => item.attr().tag === 'breadcrumb-container');

    expect(containerShapes[0].attr().width).toBe(width);

    breadItemShapes.forEach((item) => {
      const rect = item.getBoundingClientRect();
      expect(rect.right).not.toBeGreaterThan(x + width - padding[1]);
      expect(rect.left).not.toBeLessThan(x + padding[3]);
    });

    separatorShapes.forEach((item) => {
      const rect = item.getBoundingClientRect();
      expect(rect.right).not.toBeGreaterThan(x + width - padding[1]);
      expect(rect.left).not.toBeLessThan(x + padding[3]);
    });

    canvas.appendChild(breadcrumb);
  });
});
