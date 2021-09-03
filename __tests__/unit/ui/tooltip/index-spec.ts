import { Canvas, Rect } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Tooltip } from '../../../../src';
import { createDiv } from '../../../utils';

Array.from(document.getElementsByClassName('tooltip')).forEach((tooltip) => {
  tooltip.remove();
});

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});
const div = createDiv();
const canvas = new Canvas({
  container: div,
  width: 800,
  height: 800,
  renderer,
});

const background = new Rect({
  style: {
    x: 0,
    y: 0,
    height: 800,
    width: 800,
    lineWidth: 1,
    fill: '#ddd',
    stroke: 'black',
  },
});

const tooltipArea = new Rect({
  style: {
    x: 50,
    y: 50,
    width: 500,
    height: 500,
    fill: '#a6ec9a',
  },
});

canvas.appendChild(background);
background.appendChild(tooltipArea);

describe('tooltip', () => {
  test('basic', async () => {
    const tooltip = new Tooltip({
      style: {
        title: '标题',
        x: 100,
        y: 100,
        offset: [20, 20],
        position: 'bottom-right',
        // autoPosition: true,
        container: {
          x: 0,
          y: 0,
        },
        items: [
          {
            value: 0,
            name: '第一项',
            index: 0,
            color: 'red',
          },
          {
            value: 1.2312323,
            name: '第二项',
            index: 1,
            color: 'green',
          },
        ],
        bounding: {
          x: 50,
          y: 50,
          width: 500,
          height: 500,
        },
      },
    });

    document.getElementsByTagName('body')[0].appendChild(tooltip.HTMLTooltipElement);
    tooltipArea.addEventListener('mousemove', (e: any) => {
      tooltip.position = [e.offsetX, e.offsetY];
    });
    tooltipArea.addEventListener('mouseenter', () => {
      tooltip.show();
    });
    tooltipArea.addEventListener('mouseleave', () => {
      tooltip.hide();
    });

    expect(tooltip.HTMLTooltipElement.getElementsByClassName('tooltip-title')[0]!.innerHTML).toBe('标题');
    let [tooltipList] = tooltip.HTMLTooltipElement.getElementsByClassName('tooltip-list');
    expect(tooltipList.children.length).toBe(2);
    expect(tooltipList.querySelector('.tooltip-list-item-name')!.innerHTML).toBe('第一项');

    tooltip.update({
      title: '更新了标题',
      items: [
        {
          value: 1231230,
          name: '第三项',
          index: 0,
          color: 'red',
        },
        {
          value: 1.2312323,
          name: '第四项',
          index: 1,
          color: 'green',
        },
        {
          value: 1.2312323,
          name: '第五项',
          index: 1,
          color: 'blue',
        },
      ],
    });

    expect(tooltip.HTMLTooltipElement.getElementsByClassName('tooltip-title')[0]!.innerHTML).toBe('更新了标题');
    [tooltipList] = tooltip.HTMLTooltipElement.getElementsByClassName('tooltip-list');
    expect(tooltipList.children.length).toBe(3);
    expect(tooltipList.querySelector('.tooltip-list-item-name')!.innerHTML).toBe('第三项');
  });
});
