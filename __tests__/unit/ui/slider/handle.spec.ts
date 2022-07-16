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
        handleType: 'start',
        iconCfg: {
          type: 'default',
          orient: 'vertical',
        },
        textCfg: {
          text: '',
        },
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
        handleType: 'start',
        iconCfg: {
          type: 'default',
          orient: 'horizontal',
        },
        textCfg: {
          text: 'Hello',
          textAlign: 'left',
          dx: 8,
        },
      },
    });
    canvas.appendChild(handle);
    handle.update({
      iconCfg: {
        type: 'default',
        orient: 'horizontal',
        stroke: 'red',
      },
    });
  });

  it('default', () => {
    const handle = new HandleComponent({
      type: 'handle',
      style: {
        x: 50,
        y: 80,
        zIndex: 2,
        handleType: 'start',
        iconCfg: {
          type: 'default',
          orient: 'horizontal',
        },
        textCfg: {
          text: '',
        },
      },
    });
    canvas.appendChild(handle);

    handle.update({
      iconCfg: {
        size: 8,
        type: 'symbol',
        orient: 'horizontal',
        symbol: 'https://gw.alipayobjects.com/mdn/rms_6ae20b/afts/img/A*N4ZMS7gHsUIAAAAAAAAAAABkARQnAQ',
      },
    });
  });
});
