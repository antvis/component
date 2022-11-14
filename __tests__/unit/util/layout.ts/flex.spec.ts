import { flex } from '../../../../src/util/layout/flex';

describe('flex', () => {
  const items = [
    { x: 0, y: 0, width: 10, height: 10 },
    { x: 10, y: 10, width: 10, height: 10 },
    { x: 20, y: 20, width: 10, height: 10 },
    { x: 30, y: 30, width: 10, height: 10 },
    { x: 40, y: 40, width: 10, height: 10 },
  ];
  const container = {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    children: items,
  };

  it('flex-direction row', () => {
    const layout = flex(container, items, {
      type: 'flex',
      containerConfig: {
        flexDirection: 'row',
      },
      itemsConfig: [],
    });
    expect(layout).toEqual([
      { x: 0, y: 0, width: 10, height: 10 },
      { x: 10, y: 0, width: 10, height: 10 },
      { x: 20, y: 0, width: 10, height: 10 },
      { x: 30, y: 0, width: 10, height: 10 },
      { x: 40, y: 0, width: 10, height: 10 },
    ]);
  });
  it('flex-direction column', () => {
    const layout = flex(container, items, {
      type: 'flex',
      containerConfig: {
        flexDirection: 'column',
      },
      itemsConfig: [],
    });
    expect(layout).toEqual([
      { x: 0, y: 0, width: 10, height: 10 },
      { x: 0, y: 10, width: 10, height: 10 },
      { x: 0, y: 20, width: 10, height: 10 },
      { x: 0, y: 30, width: 10, height: 10 },
      { x: 0, y: 40, width: 10, height: 10 },
    ]);
  });

  it('justify-content flex-start', () => {
    const layout = flex(container, items, {
      type: 'flex',
      containerConfig: {
        justifyContent: 'flex-start',
      },
      itemsConfig: [],
    });
    expect(layout).toEqual([
      { x: 0, y: 0, width: 10, height: 10 },
      { x: 10, y: 0, width: 10, height: 10 },
      { x: 20, y: 0, width: 10, height: 10 },
      { x: 30, y: 0, width: 10, height: 10 },
      { x: 40, y: 0, width: 10, height: 10 },
    ]);
  });
  it('justify-content flex-end', () => {
    const layout = flex(container, items, {
      type: 'flex',
      containerConfig: {
        justifyContent: 'flex-end',
      },
      itemsConfig: [],
    });
    expect(layout).toEqual([
      { x: 50, y: 0, width: 10, height: 10 },
      { x: 60, y: 0, width: 10, height: 10 },
      { x: 70, y: 0, width: 10, height: 10 },
      { x: 80, y: 0, width: 10, height: 10 },
      { x: 90, y: 0, width: 10, height: 10 },
    ]);
  });
  it('justify-content center', () => {
    const layout = flex(container, items, {
      type: 'flex',
      containerConfig: {
        justifyContent: 'center',
      },
      itemsConfig: [],
    });
    expect(layout).toEqual([
      { x: 25, y: 0, width: 10, height: 10 },
      { x: 35, y: 0, width: 10, height: 10 },
      { x: 45, y: 0, width: 10, height: 10 },
      { x: 55, y: 0, width: 10, height: 10 },
      { x: 65, y: 0, width: 10, height: 10 },
    ]);
  });

  it('align-items flex-start', () => {
    const layout = flex(container, items, {
      type: 'flex',
      containerConfig: {
        alignItems: 'flex-start',
      },
      itemsConfig: [],
    });
    expect(layout).toEqual([
      { x: 0, y: 0, width: 10, height: 10 },
      { x: 10, y: 0, width: 10, height: 10 },
      { x: 20, y: 0, width: 10, height: 10 },
      { x: 30, y: 0, width: 10, height: 10 },
      { x: 40, y: 0, width: 10, height: 10 },
    ]);
  });
  it('align-items flex-end', () => {
    const layout = flex(container, items, {
      type: 'flex',
      containerConfig: {
        alignItems: 'flex-end',
      },
      itemsConfig: [],
    });
    expect(layout).toEqual([
      { x: 0, y: 90, width: 10, height: 10 },
      { x: 10, y: 90, width: 10, height: 10 },
      { x: 20, y: 90, width: 10, height: 10 },
      { x: 30, y: 90, width: 10, height: 10 },
      { x: 40, y: 90, width: 10, height: 10 },
    ]);
  });
  it('align-items center', () => {
    const layout = flex(container, items, {
      type: 'flex',
      containerConfig: {
        alignItems: 'center',
      },
      itemsConfig: [],
    });
    expect(layout).toEqual([
      { x: 0, y: 45, width: 10, height: 10 },
      { x: 10, y: 45, width: 10, height: 10 },
      { x: 20, y: 45, width: 10, height: 10 },
      { x: 30, y: 45, width: 10, height: 10 },
      { x: 40, y: 45, width: 10, height: 10 },
    ]);
  });
});
