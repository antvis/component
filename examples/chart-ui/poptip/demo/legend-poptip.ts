import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Category, Continuous, Poptip } from '@antv/gui';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

const canvas = new Canvas({
  container: 'container',
  width: 600,
  height: 500,
  renderer,
});

const items = [
  { id: '事例一', color: '#4982f8' },
  { id: '事例二', color: '#41d59c' },
  { id: '事例三', color: '#516587' },
  { id: '事例四', color: '#f9b41b' },
  { id: '事例五', color: '#624ef7' },
].map(({ id, color }) => {
  return { name: id, id, state: 'selected', color };
});

const category = new Category({
  style: {
    x: 10,
    y: 30,
    items,
    itemMarker: ({ color }) => {
      return {
        size: 10,
        marker: 'circle',
        style: {
          selected: {
            fill: color,
          },
        },
      };
    },
    spacing: [0, 0],
    maxItemWidth: 160,
  },
});

canvas.appendChild(category);

const poptip = new Poptip({
  style: {
    offset: [0, -5],
  },
});

poptip.bind(category, {
  // 内容改变
  html: (e) => {
    return e.target.attributes.text;
  },
  // 筛选需要的部分
  condition: (e) => {
    if (e.target.nodeName === 'text') {
      return e.target;
    }
    return false;
  },
  arrowPointAtCenter: true,
});

const continuous = new Continuous({
  style: {
    y: 100,
    rail: {
      width: 300,
      height: 30,
    },
    handle: false,
    min: 0,
    max: 100,
    indicator: false,
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

canvas.appendChild(continuous);

poptip.bind(continuous, {
  html: (e) => {
    return `${Math.round(continuous.getEventPosValue(e))}`;
  },
  condition: (e) => {
    if (e.target?.name === 'railPath') {
      return e.target;
    }
    return false;
  },
});
