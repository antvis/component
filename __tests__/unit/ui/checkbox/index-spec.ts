import { Checkbox } from '../../../../src/ui/checkbox';
import { Text } from '../../../../src/ui/text';
import { createCanvas } from '../../../utils/render';

const canvas = createCanvas(400, 'svg');

describe('checkbox', () => {
  test('basic', async () => {
    const checkbox = new Checkbox({
      style: {
        x: 20,
        y: 10,
        label: { text: 'label text' },
        checked: true,
      },
    });
    canvas.appendChild(checkbox);
    const {
      x,
      y,
      label: { text, spacing },
      checked,
    } = checkbox.attributes;
    expect(checkbox.getPosition()[0]).toBe(20);
    expect(checkbox.getPosition()[1]).toBe(10);
    expect(x).toBe(20);
    expect(y).toBe(10);
    expect(text).toBe('label text');
    expect(spacing).toBe(4);
    expect(checked).toBe(true);
    const { label } = checkbox;
    const labelX = (label as Text).getAttribute('x');
    expect(labelX).toBe(16);
  });

  test('check', async () => {
    const checkbox = new Checkbox({
      style: {
        x: 20,
        y: 30,
        label: { text: 'label text' },
        style: {
          default: {
            fill: '#ffefff',
            stroke: '#eeeeee',
            radius: 3,
          },
          selected: {
            fill: '#00dd00',
            stroke: '#dddddd',
          },
        },
      },
    });

    canvas.appendChild(checkbox);
    const { style } = checkbox.attributes;
    expect(style!.default!.fill).toBe('#ffefff');
    expect(style!.default!.stroke).toBe('#eeeeee');
    expect(style!.default!.radius).toBe(3);
    let { checked } = checkbox.attributes;
    expect(checked).toBe(false);
    checkbox.update({ checked: true });
    checked = checkbox.attributes.checked;
    expect(checked).toBe(true);
  });
  // [todo] later
  test.skip('vertical center', () => {
    const checkbox = new Checkbox({
      style: {
        x: 20,
        y: 50,
        label: { text: 'label text', textStyle: { textBaseline: 'middle' } },
      },
    });
    canvas.appendChild(checkbox);
    const {
      center: [, checkboxY],
      halfExtents: [, checkboxHeight],
    } = checkbox.checkboxBounds;
    const {
      center: [, labelY],
      halfExtents: [, labelHeight],
    } = checkbox!.labelBounds;
    console.log('checkboxY', checkbox, labelY);

    expect((checkboxY - labelY) * 2).toBeCloseTo(checkboxHeight - labelHeight, 4);
  });
  test('disabled', () => {
    const checkbox = new Checkbox({
      style: {
        x: 20,
        y: 70,
        label: { text: 'label text' },
        disabled: true,
      },
    });
    canvas.appendChild(checkbox);
    const {
      style: { fill, stroke },
    } = checkbox.checkbox;
    const { fontColor } = checkbox!.label!.style;
    expect(checkbox.getAttribute('disabled')).toBe(true);
    expect(fill).toBe('#f5f5f5');
    expect(stroke).toBe('#d9d9d9');
    expect(fontColor).toBe('rgba(0,0,0,0.25)');
  });
  // github actions ci 会ts报错，但是这段测试代码本地ok，可以用来测试label：null的情况
  // test('label:null', () => {
  //   const checkbox = new Checkbox({
  //     style: {
  //       x: 20,
  //       y: 90,
  //       label: { text: 'label text' },
  //       disabled: true,
  //     },
  //   });
  //   checkbox.update({ label: null });
  //   canvas.appendChild(checkbox);
  //   expect(checkbox.label).toBe(undefined);
  // });
});
