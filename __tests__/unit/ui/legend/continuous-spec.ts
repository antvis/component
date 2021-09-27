import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Continuous } from '../../../../src/ui/legend';
import { createDiv } from '../../../utils';

// const webglRenderer = new WebGLRenderer();

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

const continuous = new Continuous({
  style: {
    title: {
      content: '连续图例',
    },
    label: {
      align: 'outside',
    },
    rail: {
      type: 'size',
      width: 300,
      height: 30,
    },
    min: 0,
    max: 100,
    color: '#f1a545',
  },
});

canvas.appendChild(continuous);
canvas.render();

describe('continuous', () => {
  test('basic', async () => {
    const continuous = new Continuous({
      style: {
        title: {
          content: "I'm title",
          spacing: 20,
          align: 'left',
          style: {
            fill: 'gray',
            fontSize: 16,
            fontWeight: 'bold',
          },
        },
        padding: 10,
        label: {
          align: 'outside',
          spacing: 10,
        },
        backgroundStyle: {
          default: {
            fill: '#f3f3f3',
          },
        },
        handle: false,
        rail: {
          width: 280,
          height: 30,
          chunked: true,
          ticks: [110, 120, 130, 140, 150, 160, 170, 180, 190],
          backgroundColor: '#eee8d5',
        },
        min: 100,
        max: 200,
        step: 10,
        color: [
          '#d0e3fa',
          '#acc7f6',
          '#8daaf2',
          '#6d8eea',
          '#4d73cd',
          '#325bb1',
          '#5a3e75',
          '#8c3c79',
          '#e23455',
          '#e7655b',
        ],
      },
    });

    // title
    // @ts-ignore
    expect(continuous.titleShape!.attr('text')).toBe("I'm title");
    // @ts-ignore
    expect(continuous.startHandle!.attr('x')).toBe(0);
    // @ts-ignore
    expect(continuous.endHandle!.attr('x')).toBe(280);

    continuous.update({
      start: 100,
      end: 200,
    });

    // @ts-ignore
    expect(continuous.getElementById('startHandle')!.attr('x')).toBe(0);
    // @ts-ignore
    expect(continuous.getElementById('endHandle')!.attr('x')).toBe(280);
  });

  test('size', async () => {
    // @ts-ignore
    expect(continuous.railShape.getRail().children.length).toBe(1);
    // @ts-ignore
    expect(continuous.railShape.getRail().firstChild!.attr('path')[0][2]).toBe(30);
    // @ts-ignore
    expect(continuous.railShape.getRail().firstChild!.attr('path')[2][2]).toBe(0);
  });

  test('size chunked', async () => {
    continuous.update({
      rail: {
        chunked: true,
        ticks: [20, 30, 60, 80],
      },
      color: [
        '#d0e3fa',
        '#acc7f6',
        '#8daaf2',
        '#6d8eea',
        '#4d73cd',
        '#325bb1',
        '#5a3e75',
        '#8c3c79',
        '#e23455',
        '#e7655b',
      ],
    });
    // @ts-ignore
    expect(continuous.railShape.getRail().children.length).toBe(5);
    // @ts-ignore
    expect(continuous.railShape.getRail().children[0].attr('fill')).toBe('#d0e3fa');
    // @ts-ignore
    expect(continuous.railShape.getRail().children[1].attr('fill')).toBe('#acc7f6');
    // @ts-ignore
    expect(continuous.railShape.getRail().children[2].attr('fill')).toBe('#8daaf2');
    // @ts-ignore
    expect(continuous.railShape.getRail().children[3].attr('fill')).toBe('#6d8eea');
    // @ts-ignore
    expect(continuous.railShape.getRail().children[4].attr('fill')).toBe('#4d73cd');
    // @ts-ignore
    expect(continuous.railShape.getRail().firstChild!.attr('path')[2][2]).toBe(30 - 30 * 0.2);
    // @ts-ignore
    expect(continuous.railShape.getRail().firstChild!.attr('path')[3][2]).toBe(30);
  });

  test('color', async () => {
    continuous.update({
      rail: {
        type: 'color',
        chunked: false,
      },
    });
    // @ts-ignore
    expect(continuous.railShape.getRail().children.length).toBe(1);
    // @ts-ignore
    expect(continuous.railShape.getRail().children[0].attr('fill')).toBe(
      'l(0) 0:#d0e3fa 0.11:#acc7f6 0.22:#8daaf2 0.33:#6d8eea 0.44:#4d73cd 0.55:#325bb1 0.66:#5a3e75 0.77:#8c3c79 0.88:#e23455 1:#e7655b'
    );
  });

  test('color chunked', async () => {
    continuous.update({
      rail: {
        type: 'color',
        chunked: true,
      },
      color: [
        '#d0e3fa',
        '#acc7f6',
        '#8daaf2',
        '#6d8eea',
        '#4d73cd',
        '#325bb1',
        '#5a3e75',
        '#8c3c79',
        '#e23455',
        '#e7655b',
      ],
    });
    // @ts-ignore
    expect(continuous.railShape.getRail().children.length).toBe(5);
    // @ts-ignore
    expect(continuous.railShape.getRail().children[0].attr('fill')).toBe('#d0e3fa');
    // @ts-ignore
    expect(continuous.railShape.getRail().children[1].attr('fill')).toBe('#acc7f6');
    // @ts-ignore
    expect(continuous.railShape.getRail().children[2].attr('fill')).toBe('#8daaf2');
    // @ts-ignore
    expect(continuous.railShape.getRail().children[3].attr('fill')).toBe('#6d8eea');
    // @ts-ignore
    expect(continuous.railShape.getRail().children[4].attr('fill')).toBe('#4d73cd');
    // @ts-ignore
    expect(continuous.railShape.getRail().firstChild!.attr('path')[2][2]).toBe(0);
  });

  test('vertical', async () => {
    const div = createDiv();

    // @ts-ignore
    const canvas = new Canvas({
      container: div,
      width: 600,
      height: 600,
      renderer,
    });

    const continuous = new Continuous({
      style: {
        x: 50,
        y: 0,
        title: {
          content: "I'm title",
        },
        label: {
          align: 'rail',
          spacing: 0,
        },
        orient: 'vertical',
        backgroundStyle: {
          default: {
            fill: 'gray',
          },
        },
        handle: false,
        rail: {
          width: 50,
          height: 200,
          chunked: true,
          ticks: [120, 140, 160, 180],
        },
        min: 100,
        max: 200,
        color: ['#d0e3fa', '#acc7f6', '#8daaf2', '#6d8eea', '#4d73cd', '#325bb1'],
      },
    });
    canvas.appendChild(continuous);
    canvas.render();
  });
});
