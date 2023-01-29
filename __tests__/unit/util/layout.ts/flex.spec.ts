import { flex } from '../../../../src/util/layout/flex';
import { BBox } from '../../../../src/util';

describe('flex', () => {
  const children = [
    new BBox(0, 0, 10, 10),
    new BBox(0, 10, 10, 10),
    new BBox(0, 20, 10, 10),
    new BBox(0, 30, 10, 10),
    new BBox(0, 40, 10, 10),
  ];

  const container = new BBox(0, 0, 100, 100);

  it('flex-direction row', () => {
    const layout = flex(container, children, {
      display: 'flex',
      flexDirection: 'row',
    });
    expect(layout).toEqual([
      new BBox(0, 0, 10, 10),
      new BBox(10, 0, 10, 10),
      new BBox(20, 0, 10, 10),
      new BBox(30, 0, 10, 10),
      new BBox(40, 0, 10, 10),
    ]);
  });
  it('flex-direction column', () => {
    const layout = flex(container, children, {
      display: 'flex',
      flexDirection: 'column',
    });
    expect(layout).toEqual([
      new BBox(0, 0, 10, 10),
      new BBox(0, 10, 10, 10),
      new BBox(0, 20, 10, 10),
      new BBox(0, 30, 10, 10),
      new BBox(0, 40, 10, 10),
    ]);
  });

  it('justify-content flex-start', () => {
    const layout = flex(container, children, {
      display: 'flex',
      justifyContent: 'flex-start',
    });
    expect(layout).toEqual([
      new BBox(0, 0, 10, 10),
      new BBox(10, 0, 10, 10),
      new BBox(20, 0, 10, 10),
      new BBox(30, 0, 10, 10),
      new BBox(40, 0, 10, 10),
    ]);
  });
  it('justify-content flex-end', () => {
    const layout = flex(container, children, {
      display: 'flex',
      justifyContent: 'flex-end',
    });
    expect(layout).toEqual([
      new BBox(50, 0, 10, 10),
      new BBox(60, 0, 10, 10),
      new BBox(70, 0, 10, 10),
      new BBox(80, 0, 10, 10),
      new BBox(90, 0, 10, 10),
    ]);
  });
  it('justify-content center', () => {
    const layout = flex(container, children, {
      display: 'flex',
      justifyContent: 'center',
    });
    expect(layout).toEqual([
      new BBox(25, 0, 10, 10),
      new BBox(35, 0, 10, 10),
      new BBox(45, 0, 10, 10),
      new BBox(55, 0, 10, 10),
      new BBox(65, 0, 10, 10),
    ]);
  });

  it('align-items flex-start', () => {
    const layout = flex(container, children, {
      display: 'flex',
      alignItems: 'flex-start',
    });
    expect(layout).toEqual([
      new BBox(0, 0, 10, 10),
      new BBox(10, 0, 10, 10),
      new BBox(20, 0, 10, 10),
      new BBox(30, 0, 10, 10),
      new BBox(40, 0, 10, 10),
    ]);
  });
  it('align-items flex-end', () => {
    const layout = flex(container, children, {
      display: 'flex',
      alignItems: 'flex-end',
    });
    expect(layout).toEqual([
      new BBox(0, 90, 10, 10),
      new BBox(10, 90, 10, 10),
      new BBox(20, 90, 10, 10),
      new BBox(30, 90, 10, 10),
      new BBox(40, 90, 10, 10),
    ]);
  });
  it('align-items center', () => {
    const layout = flex(container, children, {
      display: 'flex',
      alignItems: 'center',
    });
    expect(layout).toEqual([
      new BBox(0, 45, 10, 10),
      new BBox(10, 45, 10, 10),
      new BBox(20, 45, 10, 10),
      new BBox(30, 45, 10, 10),
      new BBox(40, 45, 10, 10),
    ]);
  });
});
