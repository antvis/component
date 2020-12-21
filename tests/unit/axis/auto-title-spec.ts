import { Canvas, IGroup } from '@antv/g-canvas';
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
    expect(Math.round(offset - axis.get('title').offset)).toBe(80);
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
    expect(Math.round(offset - axis.get('title').offset)).toBe(80);
  });

  afterAll(() => {
    axis.destroy();
    canvas.destroy();
  });
});

describe('axis title auto offset', () => {
  const dom = document.createElement('div');
  document.body.append(dom);
  const canvas = new Canvas({
    container: dom,
    width: 500,
    height: 400,
  });
  const container = canvas.addGroup();

  const getTicks = (labels: string[]) => {
    return labels.map((item, idx) => ({
      name: item,
      value: (1 / (labels.length - 1)) * idx,
    }));
  };

  it('auto axis title offset', () => {
    const axis = new LineAxis({
      animate: false,
      id: 'it1',
      container,
      verticalFactor: -1,
      start: {
        x: 50,
        y: 50,
      },
      end: {
        x: 450,
        y: 50,
      },
      ticks: getTicks([
        '大于等于￥50000',
        '小于￥100',
        '￥100-￥2000',
        '￥10000-￥50000',
        '￥2000-￥5000',
        '￥5000-￥10000',
      ]),
      label: {
        autoRotate: false,
        autoHide: false,
      },
      title: {
        text: '标题',
      },
    });
    axis.init();
    axis.render();

    // default auto offset: label_offset + label_height + title_spacing + title_height / 2
    expect(axis.get('title').offset).toBe(10 + 12 + 5 + 6);

    axis.destroy();
  });

  it('auto axis title offset /w autoHide', () => {
    const axis = new LineAxis({
      animate: false,
      id: 'it1',
      container,
      verticalFactor: -1,
      start: {
        x: 50,
        y: 50,
      },
      end: {
        x: 450,
        y: 50,
      },
      ticks: getTicks([
        '大于等于￥50000',
        '小于￥100',
        '￥100-￥2000',
        '￥10000-￥50000',
        '￥2000-￥5000',
        '￥5000-￥10000',
      ]),
      label: {
        autoRotate: false,
        autoHide: true,
      },
      title: {
        text: '标题',
      },
    });
    axis.init();
    axis.render();

    // default auto offset: label_offset + label_height + title_spacing + title_height / 2
    expect(axis.get('title').offset).toBe(10 + 12 + 5 + 6);

    axis.destroy();
  });

  it('auto axis title offset /w autoRotate', () => {
    const axis = new LineAxis({
      animate: false,
      id: 'it1',
      container,
      verticalFactor: -1,
      start: {
        x: 50,
        y: 50,
      },
      end: {
        x: 450,
        y: 50,
      },
      ticks: getTicks([
        '大于等于￥50000',
        '小于￥100',
        '￥100-￥2000',
        '￥10000-￥50000',
        '￥2000-￥5000',
        '￥5000-￥10000',
      ]),
      label: {
        autoRotate: true,
        autoHide: false,
      },
      title: {
        text: '标题',
      },
    });
    axis.init();
    axis.render();

    const group: IGroup = axis.get('group');
    const labelGroup = group.findAllByName('axis-label-group')[0];
    const labelHeight = labelGroup.getCanvasBBox().height;
    // default auto offset: label_offset + label_height + title_spacing + title_height / 2
    expect(axis.get('title').offset).toBe(10 + labelHeight + 5 + 6);

    axis.destroy();
  });

  it('auto axis title offset /w rotate unfixedAngle', () => {
    const axis = new LineAxis({
      animate: false,
      id: 'it1',
      container,
      verticalFactor: -1,
      start: {
        x: 50,
        y: 50,
      },
      end: {
        x: 450,
        y: 50,
      },
      ticks: getTicks([
        '大于等于￥50000',
        '小于￥100',
        '￥100-￥2000',
        '￥10000-￥50000',
        '￥2000-￥5000',
        '￥5000-￥10000',
      ]),
      label: {
        autoRotate: 'unfixedAngle',
        autoHide: false,
      },
      title: {
        text: '标题',
      },
    });
    axis.init();
    axis.render();

    const group: IGroup = axis.get('group');
    const labelGroup = group.findAllByName('axis-label-group')[0];
    const labelHeight = labelGroup.getCanvasBBox().height;
    // default auto offset: label_offset + label_height + title_spacing + title_height / 2
    expect(axis.get('title').offset).toBe(10 + labelHeight + 5 + 6);

    axis.destroy();
  });

  it('vertical axis title offset', () => {
    const axis = new LineAxis({
      animate: false,
      id: 'it1',
      container,
      verticalFactor: -1,
      start: {
        x: 200,
        y: 50,
      },
      end: {
        x: 200,
        y: 450,
      },
      ticks: getTicks([
        '大于等于￥50000',
        '小于￥100',
        '￥100-￥2000',
        '￥10000-￥50000',
        '￥2000-￥5000',
        '￥5000-￥10000',
      ]),
      label: {
        autoRotate: false,
        autoHide: false,
      },
      title: {
        text: '标题',
      },
    });
    axis.init();
    axis.render();

    // default auto offset: label_offset + label_width + title_spacing + title_height / 2
    const group: IGroup = axis.get('group');
    const labelGroup = group.findAllByName('axis-label-group')[0];
    const labelWidth = labelGroup.getCanvasBBox().width;
    expect(axis.get('title').offset).toBe(10 + labelWidth + 5 + 6);

    axis.destroy();
  });

  it('vertical axis title offset /w autoRotate', () => {
    const axis = new LineAxis({
      animate: false,
      id: 'it1',
      container,
      verticalFactor: -1,
      verticalLimitLength: 100,
      start: {
        x: 200,
        y: 50,
      },
      end: {
        x: 200,
        y: 450,
      },
      ticks: getTicks([
        '大于等于￥50000',
        '小于￥100',
        '￥100-￥2000',
        '￥10000-￥50000',
        '￥2000-￥5000',
        '￥5000-￥10000',
      ]),
      label: {
        autoRotate: true,
        autoHide: false,
      },
      title: {
        text: '标题',
      },
    });
    axis.init();
    axis.render();

    // default auto offset: label_offset + label_width + title_spacing + title_height / 2
    const group: IGroup = axis.get('group');
    const labelGroup = group.findAllByName('axis-label-group')[0];
    const labelWidth = labelGroup.getCanvasBBox().width;
    expect(axis.get('title').offset).toBe(10 + labelWidth + 5 + 6);

    axis.destroy();
  });

  it('vertical axis title offset /w rotate', () => {
    const axis = new LineAxis({
      animate: false,
      id: 'it1',
      container,
      verticalFactor: -1,
      verticalLimitLength: 100,
      start: {
        x: 200,
        y: 50,
      },
      end: {
        x: 200,
        y: 450,
      },
      ticks: getTicks([
        '大于等于￥50000',
        '小于￥100',
        '￥100-￥2000',
        '￥10000-￥50000',
        '￥2000-￥5000',
        '￥5000-￥10000',
      ]),
      label: {
        rotate: Math.PI / 2,
        autoHide: false,
      },
      title: {
        text: '标题',
      },
    });
    axis.init();
    axis.render();

    // default auto offset: label_offset + label_width + title_spacing + title_height / 2
    expect(axis.get('title').offset).toBe(10 + 12 + 5 + 6);

    axis.destroy();
  });
});
