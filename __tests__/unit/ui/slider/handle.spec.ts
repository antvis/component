import { Handle as HandleComponent } from '../../../../src/ui/slider/handle';
import { createCanvas } from '../../../utils/render';

const size = 500;
const canvas = createCanvas(size, undefined, true);

describe('Handle of slider', () => {
  it('default', () => {
    const handle = new HandleComponent({
      type: 'handle',
      style: {
        x: 50,
        y: 30,
        zIndex: 2,
        type: 'start',
        orient: 'vertical',
        labelText: '',
      },
    });
    canvas.appendChild(handle);
  });

  it('default', () => {
    const handle = new HandleComponent({
      type: 'handle',
      style: {
        x: 90,
        y: 30,
        zIndex: 2,
        type: 'start',
        orient: 'horizontal',
        labelText: 'Hello',
        labelTextAlign: 'left',
        labelDx: 8,
      },
    });
    canvas.appendChild(handle);
    handle.update({
      iconStroke: 'red',
    });
  });

  it('default', () => {
    const handle = new HandleComponent({
      type: 'handle',
      style: {
        x: 50,
        y: 80,
        zIndex: 2,
        type: 'start',
        orient: 'horizontal',
        labelText: '',
      },
    });
    canvas.appendChild(handle);

    handle.update({
      iconSize: 8,
    });
  });
});
