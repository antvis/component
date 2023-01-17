import { flex } from '../../../../src/util/layout/flex';

describe('flex', () => {
  const children = [
    new DOMRect(0, 0, 10, 10),
    new DOMRect(0, 10, 10, 10),
    new DOMRect(0, 20, 10, 10),
    new DOMRect(0, 30, 10, 10),
    new DOMRect(0, 40, 10, 10),
  ];

  const container = new DOMRect(0, 0, 100, 100);

  it('flex-direction row', () => {
    const layout = flex(container, children, {
      display: 'flex',
      flexDirection: 'row',
    });
    expect(layout).toEqual([
      new DOMRect(0, 0, 10, 10),
      new DOMRect(10, 0, 10, 10),
      new DOMRect(20, 0, 10, 10),
      new DOMRect(30, 0, 10, 10),
      new DOMRect(40, 0, 10, 10),
    ]);
  });
  it('flex-direction column', () => {
    const layout = flex(container, children, {
      display: 'flex',
      flexDirection: 'column',
    });
    expect(layout).toEqual([
      new DOMRect(0, 0, 10, 10),
      new DOMRect(0, 10, 10, 10),
      new DOMRect(0, 20, 10, 10),
      new DOMRect(0, 30, 10, 10),
      new DOMRect(0, 40, 10, 10),
    ]);
  });

  it('justify-content flex-start', () => {
    const layout = flex(container, children, {
      display: 'flex',
      justifyContent: 'flex-start',
    });
    expect(layout).toEqual([
      new DOMRect(0, 0, 10, 10),
      new DOMRect(10, 0, 10, 10),
      new DOMRect(20, 0, 10, 10),
      new DOMRect(30, 0, 10, 10),
      new DOMRect(40, 0, 10, 10),
    ]);
  });
  it('justify-content flex-end', () => {
    const layout = flex(container, children, {
      display: 'flex',
      justifyContent: 'flex-end',
    });
    expect(layout).toEqual([
      new DOMRect(50, 0, 10, 10),
      new DOMRect(60, 0, 10, 10),
      new DOMRect(70, 0, 10, 10),
      new DOMRect(80, 0, 10, 10),
      new DOMRect(90, 0, 10, 10),
    ]);
  });
  it('justify-content center', () => {
    const layout = flex(container, children, {
      display: 'flex',
      justifyContent: 'center',
    });
    expect(layout).toEqual([
      new DOMRect(25, 0, 10, 10),
      new DOMRect(35, 0, 10, 10),
      new DOMRect(45, 0, 10, 10),
      new DOMRect(55, 0, 10, 10),
      new DOMRect(65, 0, 10, 10),
    ]);
  });

  it('align-items flex-start', () => {
    const layout = flex(container, children, {
      display: 'flex',
      alignItems: 'flex-start',
    });
    expect(layout).toEqual([
      new DOMRect(0, 0, 10, 10),
      new DOMRect(10, 0, 10, 10),
      new DOMRect(20, 0, 10, 10),
      new DOMRect(30, 0, 10, 10),
      new DOMRect(40, 0, 10, 10),
    ]);
  });
  it('align-items flex-end', () => {
    const layout = flex(container, children, {
      display: 'flex',
      alignItems: 'flex-end',
    });
    expect(layout).toEqual([
      new DOMRect(0, 90, 10, 10),
      new DOMRect(10, 90, 10, 10),
      new DOMRect(20, 90, 10, 10),
      new DOMRect(30, 90, 10, 10),
      new DOMRect(40, 90, 10, 10),
    ]);
  });
  it('align-items center', () => {
    const layout = flex(container, children, {
      display: 'flex',
      alignItems: 'center',
    });
    expect(layout).toEqual([
      new DOMRect(0, 45, 10, 10),
      new DOMRect(10, 45, 10, 10),
      new DOMRect(20, 45, 10, 10),
      new DOMRect(30, 45, 10, 10),
      new DOMRect(40, 45, 10, 10),
    ]);
  });
});
