import { get } from '@antv/util';
import { Switch } from '../../../../src';
import { createCanvas } from '../../../utils/render';
import { SIZE_STYLE } from '../../../../src/ui/switch/constant';

const canvas = createCanvas(500, 'svg');
describe('switch', () => {
  const switchShape = new Switch({
    style: {
      x: 40,
      y: 50,
    },
  });

  canvas.appendChild(switchShape);

  test('basic switch', () => {
    const { x, y, spacing, checked } = switchShape.attributes;

    expect(x).toBe(40);
    expect(y).toBe(50);
    expect(spacing).toBe(2);
    expect(checked).toBe(true);
    expect(get(switchShape.querySelector('.switch-background'), 'attributes.fill')).toBe('#1890FF');
    expect(get(switchShape.querySelector('.switch-background-stroke'), 'attributes.stroke')).toBe('#1890FF');

    switchShape.update({
      checked: false,
    });

    expect(switchShape.attributes.checked).toBe(false);
    expect(get(switchShape.querySelector('.switch-background'), 'attributes.fill')).toBe('#00000040');
    expect(get(switchShape.querySelector('.switch-background-stroke'), 'attributes.stroke')).toBe('#00000040');
  });

  test('size switch', () => {
    expect(get(switchShape.querySelector('.switch-background'), 'attributes')).toMatchObject(
      SIZE_STYLE.default.sizeStyle
    );
    expect(get(switchShape.querySelector('.switch-handle'), 'attributes.radius')).toBe(9);

    switchShape.update({
      size: 'small',
    });

    expect(get(switchShape.querySelector('.switch-background'), 'attributes')).toMatchObject(
      SIZE_STYLE.small.sizeStyle
    );
    expect(get(switchShape.querySelector('.switch-handle'), 'attributes.radius')).toBe(6);

    switchShape.update({
      size: 'mini',
    });

    expect(get(switchShape.querySelector('.switch-background'), 'attributes')).toMatchObject(SIZE_STYLE.mini.sizeStyle);
    expect(get(switchShape.querySelector('.switch-handle'), 'attributes.radius')).toBe(5);
  });

  test('checkedChildren switch', () => {
    switchShape.update({
      checked: true,
      checkedChildren: {
        text: '开启',
      },
      unCheckedChildren: {
        text: '关闭',
      },
    });

    expect(get(switchShape.querySelector('.switch-tag'), 'attributes.text')).toBe('开启');

    switchShape.update({
      checked: false,
    });

    expect(get(switchShape.querySelector('.switch-tag'), 'attributes.text')).toBe('关闭');

    switchShape.update({
      checked: true,
      checkedChildren: {
        text: '开启 √',
        marker: {
          symbol: 'check',
          stroke: '#fff',
          size: 12,
          x: 6,
        },
      },
      unCheckedChildren: {
        text: '关闭 ×',
        marker: {
          symbol: 'stop',
          stroke: '#fff',
          size: 14,
          x: 7,
        },
      },
    });

    expect(get(switchShape.querySelector('.switch-tag'), 'attributes.marker')).toMatchObject({
      symbol: 'check',
      stroke: '#fff',
      size: 12,
      x: 6,
    });

    switchShape.update({
      checked: false,
    });

    expect(get(switchShape.querySelector('.switch-tag'), 'attributes.marker')).toMatchObject({
      symbol: 'stop',
      stroke: '#fff',
      size: 14,
      x: 7,
    });
  });
});
