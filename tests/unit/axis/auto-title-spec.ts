import { Canvas } from '@antv/g-canvas';
import LineAxis from '../../../src/axis/line';

describe('test title offset', () => {
  const labelsArray = ['不知名学科名字很长很长真的很长', '语文', '数学', '英语', '物理'];
  function getTicks(labels: string[]) {
    const items = [];
    const length = labels.length;
    labels.forEach((label, index) => {
      const value = index / (length - 1);
      items.push({ name: label, id: index.toString(), value });
    });
    return items;
  }

  const dom = document.createElement('div');
  document.body.appendChild(dom);
  dom.id = 'offset';
  const canvas = new Canvas({
    container: 'offset',
    width: 500,
    height: 500,
  });
  const position = {
    top: {
      start: { x: 200, y: 200 },
      end: { x: 300, y: 200 },
    },
    right: {
      start: { x: 200, y: 200 },
      end: { x: 200, y: 300 },
    },
    left: {
      start: { x: 200, y: 300 },
      end: { x: 200, y: 200 },
    },
  };
  const ticks = getTicks(labelsArray);
  const container = canvas.addGroup();
  const axis = new LineAxis({
    animate: false,
    id: 'l',
    container,
    updateAutoRender: true,
    ...position.top,
    ticks,
    title: {
      text: '标题也很长很长合成词错错',
    },
  });
  axis.init();
  axis.render();

  it('test render', () => {
    const bbox = axis.getBBox();
    expect(bbox).toEqual(axis.getLayoutBBox());
    const title = axis.getElementById('l-axis-title');
    expect(title.attr('matrix')).not.toBe(null);
    expect(axis.get('title').offset).not.toBeUndefined();
    expect(axis.get('title').text).toBe('标题也很长很长合成词错错');
  });

  // title offset 依赖 label rotate
  it('update', () => {
    axis.update({
      ...position.left,
      title: {
        text: '标题也很长很长',
      },
      label: {
        rotate: Math.PI / 3,
        style: {
          fill: 'red',
        },
      },
    });
    expect(axis.get('title').text).toBe('标题也很长很长');
    expect(axis.get('label').rotate).toBe(Math.PI / 3);
    expect(axis.get('label').style.fill).toBe('red');
    const bbox = axis.getBBox();
    const length = axis.get('title').offset - bbox.width;
    axis.update({
      ...position.left,
      title: {
        text: '标题也很长很长',
      },
      label: {
        rotate: Math.PI / 6,
        style: {
          fill: 'red',
        },
      },
    });
    const currentLength = axis.get('title').offset - axis.getBBox().width;
    expect(axis.get('label').rotate).toBe(Math.PI / 6);
    // label rotate 会影响 axis bbox
    expect(bbox.width).not.toBe(axis.getBBox().width);
    // floor 去除计算溢出问题
    expect(Math.floor(currentLength) - Math.floor(length)).toBe(0);

    axis.update({
      ...position.right,
      title: {
        text: '标题也很长很长',
      },
      label: {
        style: {
          fill: 'red',
        },
      },
    });
    // 直接返回 groupBbox.width
    expect(axis.get('title').offset).toBe(201);
    const offset = axis.get('title').offset;
    axis.update({
      ...position.right,
      title: {
        text: '标题也很长很长',
      },
      label: {
        rotate: Math.PI / 3,
        style: {
          fill: 'red',
        },
      },
    });
    expect(Math.round(offset - axis.get('title').offset)).toBe(90);
    axis.update({
      ...position.top,
      title: {
        text: '标题也很长很长',
      },
      label: {
        rotate: Math.PI / 6,
        style: {
          fill: 'red',
        },
      },
    });
    expect(Math.round(offset - axis.get('title').offset)).toBe(90);
  });
  afterAll(() => {
    axis.destroy();
    canvas.destroy();
  });
});
