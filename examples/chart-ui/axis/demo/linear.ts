import { Canvas, Rect } from '@antv/g';
import { deepMix } from '@antv/util';
import { Band as BandScale } from '@antv/scale';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Linear as LinearAxis, wrapper } from '@antv/gui';

const renderer = new CanvasRenderer();

const canvas = new Canvas({
  container: 'container',
  width: 1000,
  height: 600,
  renderer,
});

// 创建一个包围盒
const $rect = wrapper(Rect, { x: 20, y: 20, width: 460, height: 500 });
$rect.style('stroke', '#dfdfdf').style('lineWidth', 1);
const rect = $rect.node();
canvas.appendChild(rect);

function createAxis(startPos = [0, 0], endPos = [0, 0], options = {}) {
  const axis = new LinearAxis({
    style: deepMix(
      {
        // @ts-ignore
        startPos,
        // @ts-ignore
        endPos,
        label: {
          rotate: 0,
          autoHide: false,
          autoEllipsis: true,
          // 向下偏移
          offset: [0, 15],
        },
      },
      options
    ),
  });
  rect.appendChild(axis);

  return axis;
}

// 创建一个分类轴
const paddingOuter = 16;
const bandScale = new BandScale({
  domain: new Array(6),
  range: [0, 350 - paddingOuter * 2],
  paddingOuter: 0,
});
let value = paddingOuter;
const ticks = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
const data = ticks.map((d, idx) => {
  const v = {
    value: value / 350,
    text: d,
    state: 'default',
    id: String(idx),
  };
  value += bandScale.getStep();
  return v;
});

// 创建横坐标，从左到右
createAxis([50, 50], [400, 50], { ticks: data });
createAxis([50, 100], [400, 100], { ticks: data, title: { content: '日期', offset: [0, 36] } });

// 设置 label.alignTick
const bandScale2 = new BandScale({ domain: ticks, range: [0, 1], paddingOuter: 0 });
const data2 = bandScale2.getDomain().map((d, idx) => {
  const v = {
    value: bandScale2.map(d),
    text: d,
    state: 'default',
    id: String(idx),
  };
  return v;
});
createAxis([50, 180], [400, 180], {
  ticks: data2,
  tickLine: { appendTick: true },
  label: { alignTick: false },
  title: { content: '日期', offset: [0, 36] },
});
