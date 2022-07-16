import { SliderAxis } from '../../../../src/ui/timeline/sliderAxis';
import { createCanvas } from '../../../utils/render';
import { delay } from '../../../utils/delay';
import { TIME_DATA } from './data';

const canvas = createCanvas(750, undefined, true);

describe('Timeline SliderAxis', () => {
  it('new SliderAxis({...} returns a slider axis.', async () => {
    const sliderAxis = new SliderAxis({
      style: {
        x: 30,
        y: 30,
        data: TIME_DATA,
        length: 210,
        size: 4,
        handleStyle: {
          r: 4,
          stroke: 'orange',
          fill: 'red',
          lineWidth: 1,
        },
        backgroundStyle: {
          fill: 'pink',
          fillOpacity: 1,
        },
      },
    });
    canvas.appendChild(sliderAxis);

    const background = sliderAxis.querySelector('.slider-background') as any;
    expect(background.childNodes.length).toBe(4);
    expect(background.style.x1).toBe(0);
    expect(background.style.y1).toBe(0);
    expect(background.style.y2).toBe(0);
    expect(background.style.x2).toBe(210);
    expect(background.style.lineWidth).toBe(4);
    expect(background.style.stroke).toBe('pink');

    const startHandle = background.querySelector('.slider-start-handle') as any;
    const endHandle = background.querySelector('.slider-end-handle') as any;
    expect(startHandle.getBBox()).toEqual(endHandle.getBBox());
    expect(startHandle.style.fill).toBe('red');
    expect(startHandle.style.stroke).toBe('orange');

    expect(sliderAxis.querySelectorAll('.axis-label').length).toBeGreaterThan(0);
    sliderAxis.update({ label: null });
    expect(sliderAxis.querySelectorAll('.axis-label').every((d) => d.style.visibility === 'hidden')).toBe(true);

    sliderAxis.update({ label: { style: { fill: 'red' } } });
    expect(sliderAxis.querySelector('.axis-label')!.style.fill).toBe('red');
    // todo
    // expect(sliderAxis.querySelectorAll('.axis-label').length).not.toBe(TIME_DATA.length);

    sliderAxis.update({ selection: [2, 4] });
    expect(startHandle.getBBox()).not.toEqual(endHandle.getBBox());

    sliderAxis.update({ singleMode: true });
    expect(endHandle.style.visibility).toBe('hidden');
    expect(sliderAxis.getSelection()).toEqual([2, 2]);

    sliderAxis.next();
    expect(sliderAxis.getSelection()).toEqual([3, 3]);
    sliderAxis.prev();
    expect(sliderAxis.getSelection()).toEqual([2, 2]);

    sliderAxis.play();
    // @ts-ignore
    expect(sliderAxis.playTimer).not.toBeUndefined();
    await delay(1000);
    expect(sliderAxis.getSelection()).not.toEqual([2, 2]);
    sliderAxis.stop();
    // @ts-ignore
    expect(sliderAxis.playTimer).toBeUndefined();

    sliderAxis.destroy();
  });
});
