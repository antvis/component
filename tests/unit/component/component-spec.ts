import Component from '../../../src/abstract/component';
import { BBox } from '../../../src/types';
import { createBBox } from '../../../src/util/util';
class AComponent extends Component {
  public getDefaultCfg() {
    return {
      ...super.getDefaultCfg(),
      a: null,
      b: null,
      defaultCfg: {
        a: {
          a1: 'a1',
          a2: 'a2',
        },
        b: {
          b1: 'b1',
          b2: 'b2',
        },
      },
    };
  }

  public render() {}

  public show() {}
  public hide() {}

  public getBBox(): BBox {
    return createBBox(0, 0, 0, 0);
  }
}

describe('abastract component', () => {
  const a = new AComponent({
    id: 'a',
    animateOption: null,
    a: {
      a1: '123',
    },
  });

  it('init', () => {
    expect(a.get('id')).toEqual('a');
    expect(a.get('b')).toEqual(null);
    expect(a.get('a')).toEqual({
      a1: '123',
      a2: 'a2',
    });
  });
  it('location', () => {
    expect(a.getLocationType()).toBe('none');
    expect(a.getOffset()).toEqual({ offsetX: 0, offsetY: 0 });
    a.setOffset(10, 10);
    expect(a.getOffset()).toEqual({ offsetX: 10, offsetY: 10 });
  });

  it('update', () => {
    a.update({
      a: {
        a2: '234',
      },
      b: {
        b2: '222',
      },
    });
    expect(a.get('a')).toEqual({
      a1: 'a1',
      a2: '234',
    });
    expect(a.get('b')).toEqual({
      b1: 'b1',
      b2: '222',
    });
  });

  test('destroy', () => {
    a.destroy();
    expect(a.destroyed).toEqual(true);
    expect(a.get('a')).toEqual(undefined);
  });
});
