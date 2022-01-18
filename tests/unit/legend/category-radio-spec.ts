import { Canvas } from '@antv/g-canvas';
import CategoryLegend from '../../../src/legend/category';
import { LegendRadio } from '../../../src/types';

function createMountedDiv() {
  const div = document.createElement('div');
  document.body.appendChild(div);
  return div;
}

function renderLegend(options = {}) {
  const canvas = new Canvas({
    width: 500,
    height: 200,
    container: createMountedDiv(),
  });

  const container = canvas.addGroup();

  const legend = new CategoryLegend({
    id: 'c',
    container,
    x: 100,
    y: 100,
    updateAutoRender: true,
    itemBackground: null,
    ...options,
  });

  legend.init();
  legend.render();

  return legend;
}

describe('分类图例的正反选功能', () => {
  test('radio === falsy 的时候不会渲染 radio', () => {
    const legend = renderLegend({
      items: [
        { name: 'a', value: 123, marker: { symbol: 'square', style: { r: 4, fill: '#5B8FF9' } } },
        { name: 'b', value: 223, marker: { symbol: 'square', style: { r: 4, fill: '#5AD8A6' } } },
        { name: 'c', value: 323, marker: { symbol: 'square', style: { r: 4, fill: '#5D7092' } } },
      ],
    });

    expect(legend.getElementsByName('legend-item-radio').length).toBe(0);
  });

  test('radio === truthy 会按照默认配置渲染 radio 并且只展示 show 为 true 的 item', () => {
    const legend = renderLegend({
      items: [
        { name: 'a', value: 123, marker: { symbol: 'square', style: { r: 4, fill: '#5B8FF9' } } },
        { name: 'b', value: 223, marker: { symbol: 'square', style: { r: 4, fill: '#5AD8A6' } }, showRadio: true },
        { name: 'c', value: 323, marker: { symbol: 'square', style: { r: 4, fill: '#5D7092' } } },
      ],
      radio: {},
    });

    const radios = legend.getElementsByName('legend-item-radio');
    const [hideRadio, showRadio] = radios;
    expect(radios.length).toBe(3);
    expect(hideRadio.attr('stroke')).toBe('#000000');
    expect(hideRadio.attr('fill')).toBe('#ffffff');
    expect(hideRadio.attr('opacity')).toBe(0);
    expect(showRadio.attr('opacity')).toBe(0.45);
  });

  test('radio = {} 覆盖除了 opacity 之外的样式', () => {
    const radioCfg: LegendRadio = {
      style: {
        opacity: 1,
        fill: 'red',
        stroke: 'blue',
      }
    }
    const legend = renderLegend({
      itemHeight: 16,
      items: [
        { name: 'a', value: 123, marker: { symbol: 'square', style: { r: 4, fill: '#5B8FF9' } } },
        { name: 'b', value: 223, marker: { symbol: 'square', style: { r: 4, fill: '#5AD8A6' } }, showRadio: true },
        { name: 'c', value: 323, marker: { symbol: 'square', style: { r: 4, fill: '#5D7092' } } },
      ],
      radio: radioCfg,
    });

    const [radio] = legend.getElementsByName('legend-item-radio');
    expect(radio.attr('stroke')).toBe('blue');
    expect(radio.attr('fill')).toBe('red');
    expect(radio.attr('opacity')).toBe(0);
    expect(radio.attr('path')[1][1]).toBe(8);

    // 覆盖 itemHeight，设置 radio.r
    const legend1 = renderLegend({
      itemHeight: 16,
      items: [
        { name: 'a', value: 123, marker: { symbol: 'square', style: { r: 4, fill: '#5B8FF9' } } },
        { name: 'b', value: 223, marker: { symbol: 'square', style: { r: 4, fill: '#5AD8A6' } }, showRadio: true },
        { name: 'c', value: 323, marker: { symbol: 'square', style: { r: 4, fill: '#5D7092' } } },
      ],
      radio: {
        style: {
          r: 6,
        }
      },
    });
    const [radio1] = legend1.getElementsByName('legend-item-radio');
    expect(radio1.attr('path')[1][1]).toBe(6);
  });

  test('radio 和 itemValue 的默认间距是 6', () => {
    const legend = renderLegend({
      items: [
        { name: 'a', value: 123, marker: { symbol: 'square', style: { r: 4, fill: '#5B8FF9' } }, showRadio: true },
        { name: 'b', value: 223, marker: { symbol: 'square', style: { r: 4, fill: '#5AD8A6' } } },
        { name: 'c', value: 323, marker: { symbol: 'square', style: { r: 4, fill: '#5D7092' } } },
      ],
      radio: {},
      itemValue: {},
    });

    const [radio] = legend.getElementsByName('legend-item-radio');
    const [value] = legend.getElementsByName('legend-item-value');
    const maxValueX = value.getBBox().maxX;
    const minRadioX = radio.getBBox().x;
    expect(minRadioX - maxValueX).toBe(4.792893218813447);
  });

  test('可以通过 itemValue.spacing 去配置 radio 和 itemValue 的间距', () => {
    const legend = renderLegend({
      items: [
        { name: 'a', value: 123, marker: { symbol: 'square', style: { r: 4, fill: '#5B8FF9' } }, showRadio: true },
        { name: 'b', value: 223, marker: { symbol: 'square', style: { r: 4, fill: '#5AD8A6' } } },
        { name: 'c', value: 323, marker: { symbol: 'square', style: { r: 4, fill: '#5D7092' } } },
      ],
      radio: {},
      itemValue: {
        spacing: 10,
      },
    });

    const [radio] = legend.getElementsByName('legend-item-radio');
    const [value] = legend.getElementsByName('legend-item-value');
    const maxValueX = value.getBBox().maxX;
    const minRadioX = radio.getBBox().x;
    expect(minRadioX - maxValueX).toBe(8.792893218813447);
  });
});
