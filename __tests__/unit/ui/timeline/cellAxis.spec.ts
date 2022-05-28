import { CellAxis } from '../../../../src/ui/timeline/cellAxis';
import { createCanvas } from '../../../utils/render';
import { TIME_DATA } from './data';

const canvas = createCanvas(750, undefined, true);
describe('Timeline CellAxis', () => {
  it('new CellAxis({...}) returns a cell-axis', () => {
    const axis = new CellAxis({
      style: {
        x: 30,
        data: TIME_DATA,
        spacing: 4,
        cellGap: 2,
        backgroundStyle: {
          fill: 'pink',
        },
        cellStyle: {
          fill: 'orange',
        },
        selectionStyle: {
          fill: 'red',
        },
      },
    });
    canvas.appendChild(axis);

    const background = axis.querySelector('.slider-background')! as any;
    expect(background.childNodes.length).toBe(1 + TIME_DATA.length + 1);
    expect(background.style.fill).toBe('pink');
    expect(background.querySelector('.cell')!.style.fill).toBe('orange');
    expect(background.querySelector('.selected-cell')!.style.fill).toBe('red');

    axis.update({ selection: [2, 3] });
    let box2 = background.querySelectorAll('.cell')[2];
    let box3 = background.querySelectorAll('.cell')[3];
    const [selectedBox1, selectedBox2] = background.querySelectorAll('.selected-cell');
    expect(box2.getBBox()).toEqual(selectedBox1.getBBox());
    expect(box3.getBBox()).toEqual(selectedBox2.getBBox());

    expect(box3.getLocalBounds().min[0] - box2.getLocalBounds().max[0]).toBeCloseTo(2);
    expect(box2.getLocalPosition()[1]).toBe(2);
    axis.update({ spacing: 6, cellGap: 6 });
    expect(background.querySelector('.cell')!.getLocalPosition()[1]).toBe(3);

    box2 = background.querySelectorAll('.cell')[2];
    box3 = background.querySelectorAll('.cell')[3];
    expect(box3.getLocalBounds().min[0] - box2.getLocalBounds().max[0]).toBeCloseTo(6);

    axis.destroy();
  });

  it('new CellAxis({...}) should create a vertical cell-axis', () => {
    const axis = new CellAxis({
      style: {
        x: 30,
        y: 60,
        orient: 'vertical',
        data: TIME_DATA,
        backgroundStyle: {
          fill: 'pink',
        },
        cellStyle: {
          fill: 'orange',
        },
        selectionStyle: {
          fill: 'red',
        },
        selection: [2, 2],
      },
    });
    canvas.appendChild(axis);

    const background = axis.querySelector('.slider-background')! as any;
    expect(background.childNodes.length).toBe(1 + TIME_DATA.length + 1);
    expect(background.style.fill).toBe('pink');
    expect(background.querySelector('.cell')!.style.fill).toBe('orange');
    expect(background.querySelector('.selected-cell')!.style.fill).toBe('red');

    axis.update({ selection: [2, 3] });
    const box2 = background.querySelectorAll('.cell')[2];
    const box3 = background.querySelectorAll('.cell')[3];
    const [selectedBox1, selectedBox2] = background.querySelectorAll('.selected-cell');
    expect(box2.getBBox()).toEqual(selectedBox1.getBBox());
    expect(box3.getBBox()).toEqual(selectedBox2.getBBox());

    axis.destroy();
  });
});
