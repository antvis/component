import Component from '../../../src/abstract/component';

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
}

describe('abastract component', () => {
  const a = new AComponent({
    id: 'a',
    animateCfg: null,
    a: {
      a1: '123',
    },
  });

  test('init', () => {
    expect(a.get('id')).toEqual('a');
    expect(a.get('b')).toEqual(null);
    expect(a.get('a')).toEqual({
      a1: '123',
      a2: 'a2',
    });
  });

  test('update', () => {
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
