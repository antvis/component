import { Canvas, Rect } from '@antv/g';
import { deepMix } from '@antv/util';
import { Band as BandScale } from '@antv/scale';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Linear as LinearAxis } from '@antv/gui';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

const canvas = new Canvas({
  container: 'container',
  width: 1000,
  height: 600,
  renderer,
});

// 创建一个包围盒
const rect = new Rect({ style: { x: 20, y: 20, width: 460, height: 500, stroke: '#dfdfdf', lineWidth: 1 } });
canvas.appendChild(rect);

function createAxis(startPos = [0, 0], endPos = [0, 0], options = {}) {
  return rect.appendChild(
    new LinearAxis({ style: deepMix({ startPos, endPos, label: { alignTick: false, autoHide: false } }, options) })
  );
}

// 创建一个分类轴
const domain = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
const bandScale = new BandScale({
  domain,
  paddingOuter: 0.1,
});
const [ticks] = domain.reduce(
  (r, d, idx) => {
    const v = bandScale.map(d);
    const tick = {
      value: bandScale.map(d),
      text: d,
      id: String(idx),
    };
    r[0].push(tick);
    if (idx === domain.length - 1) {
      r[0].push({ text: '', value: v + bandScale.getBandWidth(), id: `append` });
    }
    return [r[0], v];
  },
  [[], 0]
);

// 创建横坐标，从左到右
createAxis([50, 50], [400, 50], { ticks });
createAxis([50, 100], [400, 100], { ticks, title: { content: '日期' } });
createAxis([50, 220], [400, 220], { ticks, title: { content: '日期', titleAnchor: 'start' } });
