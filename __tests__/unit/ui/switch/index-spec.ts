import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { get } from '@antv/util';
import { Switch } from '../../../../src';
import { createDiv } from '../../../utils';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

describe('switch', () => {
  const div = createDiv();

  const canvas = new Canvas({
    container: div,
    width: 300,
    height: 300,
    renderer,
  });

  const switchShape = new Switch({
    style: {
      x: 40,
      y: 50,
      defaultChecked: false,
    },
  });

  canvas.appendChild(switchShape);

  test('basic switch', () => {
    const { x, y, defaultChecked, spacing, textSpacing } = switchShape.attributes;

    expect(x).toBe(40);
    expect(y).toBe(50);
    expect(defaultChecked).toBe(false);
    expect(spacing).toBe(2);
    expect(textSpacing).toBe(8);
    expect(switchShape.getChecked()).toBe(false);
    expect(get(switchShape, 'backgroundShape.attributes.fill')).toBe('#00000040');
    expect(get(switchShape, 'rectStrokeShape.attributes.stroke')).toBe('#00000040');

    switchShape.update({
      checked: true,
    });
    expect(defaultChecked).toBe(false);
    expect(switchShape.getChecked()).toBe(true);
    expect(get(switchShape, 'backgroundShape.attributes.fill')).toBe('#1890FF');
    expect(get(switchShape, 'rectStrokeShape.attributes.stroke')).toBe('#1890FF');

    expect(get(switchShape, 'rectStrokeShape.attributes.lineWidth')).toBe(0);
  });

  test('size switch', () => {
    expect(get(switchShape, 'backgroundShape.attributes')).toMatchObject({
      width: 44,
      height: 22,
      radius: 11,
    });
    expect(get(switchShape, 'handleShape.attributes.width')).toBe(18);

    switchShape.update({
      defaultChecked: false,
      size: 16,
    });

    expect(get(switchShape, 'backgroundShape.attributes')).toMatchObject({
      width: 32,
      height: 16,
      radius: 8,
    });
    expect(get(switchShape, 'sizeStyle')).toEqual({
      width: 32,
      height: 16,
      radius: 8,
    });

    switchShape.update({
      defaultChecked: false,
      size: 0,
    });

    expect(get(switchShape, 'backgroundShape.attributes')).toMatchObject({
      width: 44,
      height: 22,
      radius: 11,
    });
    expect(get(switchShape, 'sizeStyle')).toEqual({
      width: 44,
      height: 22,
      radius: 11,
    });
  });

  test('blur focus switch', () => {
    switchShape.focus();

    expect(get(switchShape, 'nowFocus')).toBe(true);
    expect(get(switchShape, 'backgroundShape.attributes.lineWidth')).toBe(5);

    switchShape.blur();

    expect(get(switchShape, 'nowFocus')).toBe(false);
    expect(get(switchShape, 'backgroundShape.attributes.lineWidth')).toBe(0);
  });

  test('disabled switch', () => {
    switchShape.update({
      disabled: true,
    });

    expect(get(switchShape, 'backgroundShape.attributes')).toMatchObject({
      fillOpacity: 0.4,
      cursor: 'no-drop',
    });

    switchShape.update({
      disabled: false,
    });

    expect(get(switchShape, 'backgroundShape.attributes')).toMatchObject({
      fillOpacity: 1,
      cursor: 'pointer',
    });
  });

  test('selected switch', () => {
    switchShape.update({
      style: {
        default: {
          stroke: 'red',
          fill: 'red',
          width: 200,
          height: 80,
        },
        selected: {
          stroke: 'yellow',
          fill: 'yellow',
          width: 150,
          height: 60,
        },
      },
      checked: true,
    });

    expect(get(switchShape, 'backgroundShape.attributes')).toMatchObject({
      fill: 'yellow',
      stroke: 'yellow',
      width: 150,
      height: 60,
      radius: 30,
    });
    expect(get(switchShape, 'handleShape.attributes.width')).toBe(56);

    switchShape.update({
      checked: false,
    });

    expect(get(switchShape, 'backgroundShape.attributes')).toMatchObject({
      fill: 'red',
      stroke: 'red',
      width: 200,
      height: 80,
      radius: 40,
    });
    expect(get(switchShape, 'handleShape.attributes.width')).toBe(76);
  });

  test('children switch', () => {
    const childrenSwitchShape = new Switch({
      style: {
        x: 40,
        y: 50,
        defaultChecked: false,
      },
    });

    childrenSwitchShape.update({
      checked: true,
      checkedChildren: {
        text: '开启 √',
        marker: {
          symbol: 'check',
          x: 0,
          y: 0,
          stroke: '#fff',
          size: 10,
        },
      },
      unCheckedChildren: {
        text: '关闭 ×',
        marker: {
          symbol: 'stop',
          x: 0,
          y: 0,
          stroke: '#fff',
          size: 10,
        },
      },
    });

    expect(get(childrenSwitchShape, 'handleShape.attributes')).toMatchObject({
      x: 2,
      y: 2,
      width: 18,
      height: 18,
      radius: 9,
    });
    expect(get(childrenSwitchShape, ['childrenShape', '0', 'attributes', 'x'])).toBe(8);

    childrenSwitchShape.update({
      checked: true,
      spacing: 4,
      textSpacing: 20,
    });
    expect(get(childrenSwitchShape, 'handleShape.attributes')).toMatchObject({
      x: 4,
      y: 4,
      width: 14,
      height: 14,
      radius: 7,
    });
    expect(get(childrenSwitchShape, ['childrenShape', '0', 'attributes', 'x'])).toBe(20);

    expect(get(childrenSwitchShape, ['backgroundShape', 'children', '1', 'config', 'name'])).toBe('checkedChildren');

    childrenSwitchShape.update({
      checked: false,
    });

    expect(get(childrenSwitchShape, ['backgroundShape', 'children', '1', 'config', 'name'])).toBe('unCheckedChildren');
    canvas.appendChild(childrenSwitchShape);
    childrenSwitchShape.destroy();
  });

  test('destroy switch', () => {
    switchShape.destroy();
    expect(get(switchShape, ['children'])).toEqual([]);
    console.log(canvas.document.children);
    // TODO 单测错误，会导致循环输出
    // expect(get(canvas, ['document', 'children'])).toEqual([]);
  });
});
