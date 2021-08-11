import { Canvas } from '@antv/g';
import { Statistic } from '@antv/gui';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

// @ts-ignore
const canvas = new Canvas({
  container: 'container',
  width: 300,
  height: 300,
  renderer,
});

// 精度
const precision = 2;
// 千位符
const groupSeparator = ',';

const groupSeparatorChange = (value, groupSeparator) => value.replace(/(\d)(?=(?:\d{3})+$)/g, `$&${groupSeparator}`);

// 适配text 的 千位符 精度
const getValueAdapter = (initValue) => {
  // 转化为 string 类型
  const value = typeof initValue === 'number' ? initValue.toString() : initValue;

  if (/^[0-9]*(\.[0-9]*)?$/.test(value)) {
    // 没有 除数字和.外的其他字符
    const valueList = value.split('.');

    // 小数点
    const valueFloat = valueList[1]
      ? Number(`.${valueList[1]}`.slice(0, precision + 1))
          .toFixed(precision)
          .replace('0', '')
      : precision
      ? `.${new Array(precision + 1).join('0')}`
      : '';

    // 整型 添加千位符
    const valueInt = groupSeparatorChange(valueList[0], groupSeparator);

    return `${valueInt}${valueFloat}`;
  }

  return value;
};

const statistic = new Statistic({
  style: {
    x: 0,
    y: 0,
    title: {
      text: 'formatter statistic',
    },
    value: {
      text: '10500505515.151',
      formatter: (v) => getValueAdapter(v),
    },
  },
});

canvas.appendChild(statistic);
