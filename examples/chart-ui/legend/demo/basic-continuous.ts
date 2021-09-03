import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Continuous } from '@antv/gui';
import * as dat from 'dat.gui';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

const canvas = new Canvas({
  container: 'container',
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
      width: 300,
      height: 30,
      ticks: [10, 20, 30, 40, 50, 60, 70, 80, 90],
    },
    handle: false,
    min: 0,
    max: 100,
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

const $wrapper = document.getElementById('container');
const cfg = new dat.GUI({ autoPlace: false });
$wrapper.appendChild(cfg.domElement);
const positionFolder = cfg.addFolder('位置');
positionFolder.open();
const positionCfg = {
  x: 0,
  y: 0,
};
positionFolder.add(positionCfg, 'x', 0, 300).onChange((x) => {
  continuous.attr({ x });
});
positionFolder.add(positionCfg, 'y', 0, 300).onChange((y) => {
  continuous.attr({ y });
});

const titleFolder = cfg.addFolder('标题');
const railFolder = cfg.addFolder('图例');
titleFolder.open();
railFolder.open();
const continuousCfg = {
  标题: '连续图例',
  标题颜色: '#808080',
  标签开关: 'open',
  方向: 'horizontal',
  标签位置: 'outside',
  标签到图例: 5,
  标签颜色: '#000',
  图例宽度: 300,
  图例高度: 30,
  指示器开关: 'open',
  轨道类型: 'color',
  分块图例: 'false',
  滑动手柄: 'close',
  是否可拖动: 'true',
  开始颜色: '#ace4ff',
  中间颜色: '#6a8bf6',
  结束颜色: '#0d2bfe',
  起始值: 0,
  结束值: 100,
  步长: 1,
};
const labelsCfg = {
  style: {
    fill: 'black',
    textAlign: 'center',
    textBaseline: 'middle',
  },
  spacing: 10,
  formatter: (value) => String(value),
  align: 'rail',
};
titleFolder.add(continuousCfg, '标题').onChange((title) => {
  continuous.update({ title: { content: title } });
});
titleFolder.addColor(continuousCfg, '标题颜色').onChange((color) => {
  continuous.update({ title: { style: { fill: color } } });
});
railFolder.add(continuousCfg, '方向', ['horizontal', 'vertical']).onChange((orient) => {
  const w = width.getValue();
  const h = height.getValue();
  width.setValue(h);
  height.setValue(w);
  continuous.update({ orient });
});
railFolder.add(continuousCfg, '轨道类型', ['color', 'size']).onChange((type) => {
  continuous.update({ rail: { type } });
});
const label = railFolder.add(continuousCfg, '标签开关', ['open', 'close']).onChange((label) => {
  continuous.update({
    label: label === 'close' ? false : labelsCfg,
  });
});
railFolder.add(continuousCfg, '标签位置', ['inside', 'outside', 'rail']).onChange((align) => {
  if (label.getValue() === 'close') label.setValue('open');
  continuous.update({ label: { align } });
});
railFolder.add(continuousCfg, '标签到图例', 0, 20).onChange((spacing) => {
  continuous.update({ label: { spacing } });
});
railFolder.addColor(continuousCfg, '标签颜色').onChange((color) => {
  continuous.update({ label: { style: { fill: color } } });
});
const width = railFolder.add(continuousCfg, '图例宽度', 30, 300).onChange((width) => {
  continuous.update({ rail: { width } });
});
const height = railFolder.add(continuousCfg, '图例高度', 30, 300).onChange((height) => {
  continuous.update({ rail: { height } });
});

const indicatorCfg = {
  size: 8,
  spacing: 10,
  padding: 5,
  backgroundStyle: {
    fill: '#262626',
    stroke: '#262626',
    radius: 5,
  },
  text: {
    style: {
      fill: 'white',
      fontSize: 12,
    },
    formatter: (value) => String(value),
  },
};
railFolder.add(continuousCfg, '指示器开关', ['open', 'close']).onChange((indicator) => {
  continuous.update({ indicator: indicator === 'close' ? false : indicatorCfg });
});

railFolder.add(continuousCfg, '分块图例', ['true', 'false']).onChange((chunked) => {
  continuous.update({ rail: { chunked: chunked === 'true' ? true : false } });
});

const handleCfg = {
  size: 25,
  spacing: 10,
  icon: {
    marker: 'default',
    style: {
      stroke: '#c5c5c5',
      fill: '#fff',
      lineWidth: 1,
    },
  },
  text: {
    align: 'outside',
    style: {
      fill: '#63656e',
      fontSize: 12,
      textAlign: 'center',
      textBaseline: 'middle',
    },
    formatter: (value) => value,
  },
};
railFolder.add(continuousCfg, '滑动手柄', ['open', 'close']).onChange((handle) => {
  continuous.update({
    handle: handle === 'close' ? false : handleCfg,
  });
});
railFolder.add(continuousCfg, '是否可拖动', ['true', 'false']).onChange((slidable) => {
  continuous.update({ slidable: slidable === 'true' ? true : false });
});

const stColor = railFolder.addColor(continuousCfg, '开始颜色').onChange((color) => {
  const currColors = continuous.attr('color').slice(0);
  currColors[0] = color;
  continuous.update({ color: currColors });
});
const mdColor = railFolder.addColor(continuousCfg, '中间颜色').onChange((color) => {
  const currColors = continuous.attr('color').slice(0);
  currColors[1] = color;
  continuous.update({ color: currColors });
});
const edColor = railFolder.addColor(continuousCfg, '结束颜色').onChange((color) => {
  const currColors = continuous.attr('color').slice(0);
  currColors[2] = color;
  continuous.update({ color: currColors });
});

const events = cfg.addFolder('事件');
events.open();
const step = events
  .add(continuousCfg, '步长', 0, 10)
  .step(1)
  .onChange((step) => {
    continuous.update({
      step,
    });
  });
const start = events
  .add(continuousCfg, '起始值', 0, 100)
  .step(step.getValue())
  .onChange((value) => {
    const endValue = end.getValue();
    const startValue = value > endValue ? endValue : value;
    continuous.setSelection(startValue, endValue);
  });
const end = events
  .add(continuousCfg, '结束值', 0, 100)
  .step(step.getValue())
  .onChange((value) => {
    const startValue = start.getValue();
    const endValue = value < startValue ? startValue : value;
    continuous.setSelection(startValue, endValue);
  });

continuous.addEventListener('rangeChanged', (e) => {
  const [stVal, endVal] = e.detail.value;
  start.setValue(stVal);
  end.setValue(endVal);
});
