import { Checkbox } from '../../../../src';
import { createCanvas } from '../../../utils/render';

const canvas = createCanvas(500, 'svg');

describe('tag', () => {
  const checkbox = new Checkbox({
    style: {
      x: 50,
      y: 50,
    },
  });

  canvas.appendChild(checkbox);

  it('label', () => {
    checkbox.update({
      label: {
        text: '单选框',
        fill: 'red',
        fontSize: 20,
      },
    });

    expect(checkbox.querySelector('.checkbox-label')?.attributes).toMatchObject({
      text: '单选框',
      fill: 'red',
      fontSize: 20,
    });
  });

  it('checkbox box', () => {
    checkbox.update({
      boxStyle: {
        width: 20,
        height: 20,
        cursor: 'no-drop',
      },
    });

    expect(checkbox.querySelector('.checkbox-box')?.attributes).toMatchObject({
      width: 20,
      height: 20,
      cursor: 'no-drop',
    });
  });

  it('checkbox box checked', () => {
    checkbox.update({
      checkedStyle: {
        lineWidth: 2,
        path: [['M', 4, 6], ['L', '5', '8.5'], ['L', '8.5', '4'], ['L', '10', '4'], ['Z']],
      } as any,
    });

    expect(checkbox.querySelector('.checkbox-box-checked')?.attributes).toMatchObject({
      lineWidth: 2,
      path: [['M', 4, 6], ['L', '5', '8.5'], ['L', '8.5', '4'], ['L', '10', '4'], ['Z']],
    });
  });

  it('checked', () => {
    expect(checkbox.querySelector('.checkbox-box')?.attributes).toMatchObject({
      fill: '#ffffff',
      stroke: '#dadada',
    });

    checkbox.update({
      checked: true,
    });

    expect(checkbox.querySelector('.checkbox-box')?.attributes).toMatchObject({
      stroke: '#3471F9',
      fill: '#3471F9',
    });
  });

  afterAll(() => {
    checkbox.destroy();
  });
});
