import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Continuous } from '../../../../src';
import { createDiv } from '../../../utils';

// const webglRenderer = new WebGLRenderer();

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

const div = createDiv();

// @ts-ignore
const canvas = new Canvas({
  container: div,
  width: 600,
  height: 600,
  renderer,
});

const continuous = new Continuous({
  attrs: {
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
    // const continuous = new Continuous({
    // attrs: {
    //   // x: 50,
    //   // y: 50,
    //   title: {
    //     content: "I'm title",
    //     spacing: 20,
    //     align: 'left',
    //     style: {
    //       fill: 'gray',
    //       fontSize: 16,
    //       fontWeight: 'bold',
    //     },
    //   },
    //   padding: 10,
    //   // label: false,
    //   label: {
    //     // align: 'rail',
    //     // align: 'outside',
    //     align: 'outside',
    //     spacing: 10,
    //     // formatter: (val, idx) => {
    //     //   if (val === 100 || val === 200) {
    //     //     return String(val);
    //     //   }
    //     //   return '';
    //     // },
    //   },
    //   backgroundStyle: {
    //     default: {
    //       fill: '#f3f3f3',
    //     },
    //   },
    //   // handle: false,
    //   // handle: {
    //   //   text: {
    //   //     align: 'inside',
    //   //   },
    //   // },
    //   rail: {
    //     width: 280,
    //     height: 30,
    //     // type: 'size',
    //     chunked: true,
    //     ticks: [110, 120, 130, 140, 150, 160, 170, 180, 190],
    //     backgroundColor: '#eee8d5',
    //   },
    //   // slidable: false,
    //   min: 100,
    //   max: 200,
    //   // start: 110,
    //   // end: 190,
    //   step: 10,
    //   color: ['#d0e3fa', '#acc7f6', '#8daaf2', '#6d8eea', '#4d73cd', '#325bb1', '#5a3e75', '#8c3c79', '#e23455', '#e7655b'],
    //   value: [100, 200],
    // },

    // });

    // title
    expect(continuous.firstChild.attr('text')).toBe('连续图例');
    expect(continuous.getElementById('startHandle').attr('x')).toBe(0);
    expect(continuous.getElementById('endHandle').attr('x')).toBe(300);

    continuous.update({
      start: 10,
      end: 50,
    });

    expect(continuous.getElementById('startHandle').attr('x')).toBe(30);
    expect(continuous.getElementById('endHandle').attr('x')).toBe(150);

    console.log(continuous);
  });

  test('size', async () => {
    expect(continuous.getElementById('railPathGroup').children.length).toBe(1);
    expect(continuous.getElementById('railPathGroup').firstChild.attr('path')[0][2]).toBe(30);
    expect(continuous.getElementById('railPathGroup').firstChild.attr('path')[2][2]).toBe(0);
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
    expect(continuous.getElementById('railPathGroup').children.length).toBe(5);
    expect(continuous.getElementById('railPathGroup').children[0].attr('fill')).toBe('#d0e3fa');
    expect(continuous.getElementById('railPathGroup').children[1].attr('fill')).toBe('#acc7f6');
    expect(continuous.getElementById('railPathGroup').children[2].attr('fill')).toBe('#8daaf2');
    expect(continuous.getElementById('railPathGroup').children[3].attr('fill')).toBe('#6d8eea');
    expect(continuous.getElementById('railPathGroup').children[4].attr('fill')).toBe('#4d73cd');
    expect(continuous.getElementById('railPathGroup').firstChild.attr('path')[2][2]).toBe(30 - 30 * 0.2);
    expect(continuous.getElementById('railPathGroup').firstChild.attr('path')[3][2]).toBe(30);
  });

  test('color', async () => {
    continuous.update({
      rail: {
        type: 'color',
        chunked: false,
      },
    });
    expect(continuous.getElementById('railPathGroup').children.length).toBe(1);
    expect(continuous.getElementById('railPathGroup').children[0].attr('fill')).toBe('#d0e3fa');
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
    expect(continuous.getElementById('railPathGroup').children.length).toBe(5);
    expect(continuous.getElementById('railPathGroup').children[0].attr('fill')).toBe('#d0e3fa');
    expect(continuous.getElementById('railPathGroup').children[1].attr('fill')).toBe('#acc7f6');
    expect(continuous.getElementById('railPathGroup').children[2].attr('fill')).toBe('#8daaf2');
    expect(continuous.getElementById('railPathGroup').children[3].attr('fill')).toBe('#6d8eea');
    expect(continuous.getElementById('railPathGroup').children[4].attr('fill')).toBe('#4d73cd');
    expect(continuous.getElementById('railPathGroup').firstChild.attr('path')[2][2]).toBe(0);
  });

  // test('vertical', async () => {
  //   const div = createDiv();

  //   // @ts-ignore
  //   const canvas = new Canvas({
  //     container: div,
  //     width: 600,
  //     height: 600,
  //     renderer,
  //   });

  //   const continuous = new Continuous({
  //     attrs: {
  //       x: 50,
  //       y: 0,
  //       title: {
  //         content: "I'm title",
  //       },
  //       label: {
  //         align: 'rail',
  //         spacing: 0
  //       },
  //       orient: 'vertical',
  //       width: 100,
  //       height: 300,
  //       backgroundStyle: {
  //         default: {
  //           fill: 'gray',
  //         },
  //       },
  //       handle: false,
  //       rail: {
  //         width: 50,
  //         height: 200,
  //         // type: 'size',
  //         chunked: true,
  //         ticks: [120, 140, 160, 180],
  //       },
  //       min: 100,
  //       max: 200,
  //       color: ['#d0e3fa', '#acc7f6', '#8daaf2', '#6d8eea', '#4d73cd', '#325bb1'],
  //       value: [100, 200],
  //     },
  //   });
  //   canvas.appendChild(continuous);
  //   canvas.render();
  // });
});
