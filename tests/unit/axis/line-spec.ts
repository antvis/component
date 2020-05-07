import { Canvas } from '@antv/g-canvas';
import { isNumberEqual } from '@antv/util';
import LineAxis from '../../../src/axis/line';
import * as HideUtil from '../../../src/axis/overlap/auto-hide';
import * as RotateUtil from '../../../src/axis/overlap/auto-rotate';
import { getAngleByMatrix, getMatrixByAngle } from '../../../src/util/matrix';
import Theme from '../../../src/util/theme';

describe('test line axis', () => {
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  dom.id = 'cal';
  const canvas = new Canvas({
    container: 'cal',
    width: 500,
    height: 500,
  });
  const container = canvas.addGroup();
  const axis = new LineAxis({
    animate: false,
    id: 'a',
    container,
    updateAutoRender: true,
    start: { x: 50, y: 400 },
    end: { x: 50, y: 50 },
    ticks: [
      { name: '1', value: 0 },
      { name: '2', value: 0.5 },
      { name: '3', value: 1 },
    ],
    title: {
      text: '标题',
    },
  });

  it('init', () => {
    axis.init();
    expect(axis.get('name')).toBe('axis');
    expect(axis.get('type')).toBe('line');
    expect(axis.getLocation()).toEqual({
      start: { x: 50, y: 400 },
      end: { x: 50, y: 50 },
    });
  });

  it('render', () => {
    axis.render();
    const line = axis.getElementById('a-axis-line');
    expect(line.attr('path')).toEqual([
      ['M', 50, 400],
      ['L', 50, 50],
    ]);

    const tickLine1 = axis.getElementById('a-axis-tickline-1');
    expect(tickLine1.attr('x1')).toBe(50);
    expect(tickLine1.attr('x2')).toBe(45);
    expect(tickLine1.attr('y1')).toBe(400);

    const label1 = axis.getElementById('a-axis-label-1');
    expect(label1).not.toBe(undefined);
    expect(label1.attr('x')).toBe(40);
    expect(label1.attr('y')).toBe(400);
    expect(label1.attr('textAlign')).toBe('end');

    const title = axis.getElementById('a-axis-title');
    expect(title.attr('matrix')).not.toBe(null);
  });

  it('update label', () => {
    const label1 = axis.getElementById('a-axis-label-1');
    expect(label1.attr('textAlign')).toBe('end');
    expect(label1.attr('matrix')).toBe(null);
    const angle = Math.PI / 4;
    axis.update({
      label: {
        rotate: Math.PI / 4,
        style: {
          textAlign: 'center',
        },
      },
    });
    expect(label1.attr('textAlign')).toBe('center');
    expect(label1.attr('matrix')).toEqual(getMatrixByAngle({ x: 40, y: 400 }, angle));
  });

  it('update title', () => {
    const title = axis.getElementById('a-axis-title');
    axis.update({
      title: {
        autoRotate: false,
      },
    });
    expect(title.attr('matrix')).toBe(null);
    // 不再显示 title
    axis.update({
      title: null,
    });
    expect(title.destroyed).toBe(true);
    expect(axis.getElementById('a-axis-title')).toBe(undefined);
    axis.update({
      title: {
        text: 'aaa',
      },
    });
    const newTitle = axis.getElementById('a-axis-title');
    expect(newTitle.attr('text')).toBe('aaa');
    expect(newTitle.attr('matrix')).not.toBe(null);
  });

  it('update line', () => {
    axis.update({
      line: null,
    });
    expect(axis.getElementById('a-axis-line')).toBe(undefined);
    axis.update({
      line: {
        style: {
          lineDash: [2, 2],
        },
      },
    });
    expect(axis.getElementById('a-axis-line').attr('lineDash')).toEqual([2, 2]);
  });

  it('update tickline', () => {
    const tickLine1 = axis.getElementById('a-axis-tickline-1');
    axis.update({
      tickLine: null,
    });
    expect(tickLine1.destroyed).toBe(true);
    axis.update({
      tickLine: {
        length: 6,
      },
    });
    const newTickLine = axis.getElementById('a-axis-tickline-1');
    expect(newTickLine.attr('x2')).toBe(44);
  });

  it('update ticks', () => {
    const labelGroup = axis.getElementById('a-axis-label-group');
    expect(labelGroup.getChildren().length).toBe(3);
    axis.update({
      ticks: [],
    });
    expect(labelGroup.getChildren().length).toBe(0);
    axis.update({
      ticks: [
        { name: '1', value: 0 },
        { name: '2', value: 0.25 },
        { name: '3', value: 0.5 },
        { name: '4', value: 1 },
      ],
    });
    expect(labelGroup.getChildren().length).toBe(4);
  });

  it('verticalFactor', () => {
    axis.update({
      verticalFactor: -1,
      tickLine: {
        length: 5,
      },
    });
    const tickLine1 = axis.getElementById('a-axis-tickline-1');
    expect(tickLine1.attr('x1')).toBe(50);
    expect(tickLine1.attr('x2')).toBe(55);
    expect(tickLine1.attr('y1')).toBe(400);
  });

  it('clear', () => {
    axis.clear();
    expect(axis.getElementById('a-axis-label-group')).toBe(undefined);
    expect(axis.getElementById('a-axis-title')).toBe(undefined);
  });

  it('rerender', () => {
    axis.render();
    expect(axis.getElementById('a-axis-label-group')).not.toBe(undefined);
    expect(axis.getElementById('a-axis-title')).not.toBe(undefined);
  });

  it('update start end', () => {
    axis.update({
      start: {
        x: 50,
        y: 50,
      },
      end: {
        x: 400,
        y: 50,
      },
    });
    const title = axis.getElementById('a-axis-title');
    const matrix = title.attr('matrix');
    const m = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    m.forEach((v, index) => {
      expect(isNumberEqual(v, matrix[index])).toBe(true);
    });
  });
  it('udate subticks', () => {
    expect(axis.getElementById('a-axis-sub-tickline-1-0')).toBe(undefined);

    axis.update({
      line: {
        style: {},
      },
      subTickLine: {
        style: {
          lineWidth: 10,
        }
      },
    });
    expect(axis.getElementById('a-axis-sub-tickline-1-0')).not.toBe(undefined);
    expect(axis.getElementById('a-axis-sub-tickline-1-0').attr('lineWidth')).toBe(10);
  });
  it('set location', () => {
    axis.setLocation({
      start: { x: 50, y: 400 },
      end: { x: 50, y: 50 },
    });

    expect(axis.get('start')).toEqual({ x: 50, y: 400 });
    expect(axis.get('end')).toEqual({ x: 50, y: 50 });
  });
  it('destroy', () => {
    axis.destroy();
    expect(axis.destroyed).toEqual(true);
  });

  afterAll(() => {
    canvas.destroy();
    dom.parentNode.removeChild(dom);
  });
});

describe('test line axis overlap', () => {
  const labels1 = ['123', '12', '2344', '13455222', '2345', '2333', '222', '2222', '11', '33'];
  const labels2 = ['我爱中国', '爱情ab你', 'abc我是谁', '亲爱的你ok', 'are u ok', 'a'];
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
  dom.id = 'calo';
  const canvas = new Canvas({
    container: 'calo',
    width: 500,
    height: 500,
  });
  const ticks = getTicks(labels1);
  const container = canvas.addGroup();
  const axis = new LineAxis({
    animate: false,
    id: 'a',
    container,
    updateAutoRender: true,
    start: { x: 100, y: 100 },
    end: { x: 200, y: 100 },
    ticks,
    title: {
      text: '标题',
    },
  });

  it('init', () => {
    axis.init();
    expect(axis.get('label').autoHide).toBe(false);
    expect(axis.get('label').autoRotate).toBe(true);
  });
  it('render', () => {
    axis.render();
    const tickLineGroup = axis.getElementById('a-axis-tickline-group');
    expect(tickLineGroup.getChildren().length).toBe(ticks.length);
    const labelGroup = axis.getElementById('a-axis-label-group');
    expect(labelGroup.getChildren().length).toBe(ticks.length);
    const first = labelGroup.getChildren()[0];
    expect(first.attr('matrix')).not.toBe(null);
    expect(getAngleByMatrix(first.attr('matrix'))).not.toBe(0);
  });

  it('update autoHide', () => {
    axis.update({
      label: {
        autoHide: true,
      },
    });
    const tickLineGroup = axis.getElementById('a-axis-tickline-group');
    expect(tickLineGroup.getChildren().length).not.toBe(ticks.length);
    const labelGroup = axis.getElementById('a-axis-label-group');
    expect(labelGroup.getChildren().length).not.toBe(ticks.length);
    expect(tickLineGroup.getChildren().length).toBe(labelGroup.getChildren().length);
    axis.update({
      tickLine: {
        displayWithLabel: false,
      },
    });
    expect(tickLineGroup.getChildren().length).not.toBe(labelGroup.getChildren().length);
    axis.update({
      tickLine: {
        displayWithLabel: true,
      },
    });
    expect(tickLineGroup.getChildren().length).toBe(labelGroup.getChildren().length);
  });

  it('update autoRotate', () => {
    axis.update({
      label: {
        autoRotate: false,
        autoHide: false,
      },
    });

    const labelGroup = axis.getElementById('a-axis-label-group');
    const first = labelGroup.getChildren()[0];
    expect(first.attr('matrix')).toBe(null);
    expect(labelGroup.getChildren().length).toBe(ticks.length);

    axis.update({
      label: {
        autoRotate: true,
        autoHide: false,
      },
    });
    expect(first.attr('matrix')).not.toBe(null);
    expect(labelGroup.getChildren().length).toBe(ticks.length);
  });

  it('vertical axis', () => {
    axis.update({
      start: { x: 100, y: 100 },
      end: { x: 100, y: 200 },
      verticalLimitLength: null,
      label: {
        autoRotate: true,
        autoHide: false,
      },
    });
    const labelGroup = axis.getElementById('a-axis-label-group');
    const first = labelGroup.getChildren()[0];
    expect(first.attr('matrix')).toBe(null);
    axis.update({
      verticalLimitLength: 40,
    });
    expect(first.attr('matrix')).not.toBe(null);

    axis.update({
      verticalLimitLength: null,
      label: {
        autoRotate: false,
        autoHide: true,
      },
    });
    expect(labelGroup.getChildren().length).toBe(Math.ceil(ticks.length / 2));

    axis.update({
      end: { x: 100, y: 100 },
      start: { x: 100, y: 200 },
    });

    expect(labelGroup.getChildren().length).toBe(Math.ceil(ticks.length / 2));

    axis.update({
      end: { x: 100, y: 100 },
      start: { x: 100, y: 300 },
    });
    expect(labelGroup.getChildren().length).toBe(ticks.length);

    axis.update({
      end: { x: 100, y: 100 },
      start: { x: 100, y: 300 },
      ticks: getTicks(labels2),
      verticalLimitLength: 80,
      label: {
        autoRotate: false,
        autoHide: true,
        autoEllipsis: true,
      },
    });
    const children = labelGroup.getChildren();
    expect(children.length).toBe(axis.get('ticks').length);
  });

  it('horizontal axis', () => {
    axis.update({
      start: { x: 100, y: 200 },
      end: { x: 200, y: 200 },
      verticalLimitLength: null,
      verticalFactor: -1,
      ticks,
      label: {
        autoRotate: true,
        autoHide: false,
      },
    });
    const labelGroup = axis.getElementById('a-axis-label-group');
    const first = labelGroup.getChildren()[0];
    expect(first.attr('matrix')).not.toBe(null);
    expect(getAngleByMatrix(first.attr('matrix'))).toBe(Math.PI / 4);
    axis.update({
      verticalLimitLength: 30,
      label: {
        autoRotate: true,
        autoHide: true,
      },
    });
    expect(labelGroup.getChildren().length).toBe(Math.ceil(ticks.length / 2));
    axis.update({
      verticalLimitLength: 30,
      title: null,
      label: {
        autoRotate: 'unfixedAngle',
        autoHide: true,
      },
    });
    expect(getAngleByMatrix(first.attr('matrix'))).not.toBe(Math.PI / 4);
    axis.update({
      verticalLimitLength: 30,
      label: {
        autoRotate: true,
        autoHide: 'reserveBoth',
      },
    });
    const count = labelGroup.getChildren().length;
    expect(labelGroup.getChildren()[0].attr('text')).toBe(labels1[0]);
    expect(labelGroup.getChildren()[count - 1].attr('text')).toBe(labels1[labels1.length - 1]);

    axis.update({
      verticalLimitLength: 40,
      label: {
        autoRotate: true,
        autoHide: 'reserveBoth',
      },
    });
    expect(labelGroup.getChildren().length).toBe(Math.ceil(ticks.length / 2));
    axis.update({
      label: {
        autoRotate: false,
        autoHide: HideUtil.reserveLast,
      },
    });
    expect(labelGroup.getChildren()[0].attr('text')).not.toBe(labels1[0]);
    expect(labelGroup.getLast().attr('text')).toBe(labels1[labels1.length - 1]);
    axis.update({
      label: {
        autoRotate: RotateUtil.unfixedAngle,
        autoHide: HideUtil.reserveLast,
      },
    });
    expect(labelGroup.getLast().attr('text')).toBe(labels1[labels1.length - 1]);
  });
  afterAll(() => {
    canvas.destroy();
    dom.parentNode.removeChild(dom);
  });
});

describe('test axis states', () => {
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  dom.id = 'cals';
  const canvas = new Canvas({
    container: 'cals',
    width: 500,
    height: 500,
  });
  const container = canvas.addGroup();
  const ticks = [
    { name: '1', value: 0, active: true },
    { name: '2', inactive: true, value: 0.5 },
    { name: '3', value: 1 },
  ];
  const axis = new LineAxis({
    animate: false,
    id: 'a',
    container,
    updateAutoRender: true,
    start: { x: 50, y: 400 },
    end: { x: 50, y: 50 },
    ticks,
    title: {
      text: '标题',
    },
  });
  axis.init();

  it('render', () => {
    axis.render();
    const labelGroup = axis.getElementById('a-axis-label-group');
    const labelShapes = labelGroup.getChildren();
    expect(labelShapes[0].attr('fontWeight')).toBe(500); // active
    expect(labelShapes[1].attr('fill')).toBe(Theme.uncheckedColor);
  });
  it('getItems', () => {
    expect(axis.getItems()).toBe(axis.get('ticks'));
  });

  it('getItems by state', () => {
    expect(axis.getItemsByState('active').length).toBe(1);
    expect(axis.getItemsByState('inactive').length).toBe(1);
    expect(axis.getItemsByState('disabled').length).toBe(0);
  });

  it('setItems', () => {
    const items = [
      { name: '1', value: 0.1 },
      { name: '22222222', value: 0.2, disabled: true },
      { name: '3', value: 0.6 },
    ];
    axis.setItems(items);
    expect(axis.getItemsByState('active').length).toBe(0);
    expect(axis.getItemsByState('disabled').length).toBe(1);
    axis.setItems(ticks);
    expect(axis.getItemsByState('disabled').length).toBe(0);
    expect(axis.getItemsByState('active').length).toBe(1);
  });

  it('updateItem', () => {
    const tick = ticks[0];
    axis.updateItem(tick, { name: '333' });
    expect(axis.getItemsByState('active').length).toBe(1);
    const labelGroup = axis.getElementById('a-axis-label-group');
    const labelShapes = labelGroup.getChildren();
    expect(labelShapes[0].attr('fontWeight')).toBe(500); // active
  });

  it('set state', () => {
    const tick = ticks[0];
    axis.setItemState(tick, 'active', false);
    expect(axis.getItemsByState('active').length).toBe(0);
    const labelGroup = axis.getElementById('a-axis-label-group');
    const labelShapes = labelGroup.getChildren();
    expect(labelShapes[0].attr('fontWeight')).toBe('normal'); // clear active

    axis.setItemState(tick, 'active', true);
    expect(labelShapes[0].attr('fontWeight')).toBe(500); // clear active
  });

  it('clear state', () => {
    expect(axis.getItemsByState('active').length).toBe(1);
    axis.clearItemsState('active');
    expect(axis.getItemsByState('active').length).toBe(0);
  });

  it('update tick', () => {
    const newTicks = [
      { name: '来自sss', value: 0 },
      { id: '2', name: '2sss', inactive: true, value: 0.5 },
      { name: '3eeee', value: 1 },
    ];
    axis.update({
      ticks: newTicks,
    });
    const labelGroup = axis.getElementById('a-axis-label-group');
    const labelShapes = labelGroup.getChildren();
    expect(labelShapes[1].attr('fill')).toBe(Theme.uncheckedColor);
    expect(axis.getItemsByState('inactive').length).toBe(1);
  });
  afterAll(() => {
    axis.destroy();
    canvas.destroy();
  });
});

describe('test layout bbox', () => {
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  dom.id = 'cals2';
  const canvas = new Canvas({
    container: 'cals2',
    width: 500,
    height: 500,
  });
  const container = canvas.addGroup();
  const ticks = [
    { name: '1', value: 0, active: true },
    { name: '2', inactive: true, value: 0.5 },
    { name: '3', value: 1 },
  ];
  const axis = new LineAxis({
    animate: false,
    id: 'a',
    container,
    updateAutoRender: true,
    start: { x: 50, y: 400 },
    end: { x: 50, y: 50 },
    ticks,
    title: {
      text: '标题',
    },
  });
  axis.init();

  it('test bbox', () => {
    axis.render();
    const bbox = axis.getBBox();
    expect(bbox).toEqual(axis.getLayoutBBox());
  });

  it('line null', () => {
    axis.update({
      line: null,
      tickLine: null,
    });
    const bbox = axis.getBBox();
    expect(bbox).not.toEqual(axis.getLayoutBBox());
    axis.update({
      line: {},
      tickLine: {},
    });
  });

  it('update', () => {
    const originBox = axis.getBBox();
    axis.update({
      start: {
        x: 50,
        y: 100,
      },
      end: {
        x: 50,
        y: 50,
      },
    });
    const bbox = axis.getBBox();
    expect(originBox.height - bbox.height).toBe(300);
  });

  it('update direction', () => {
    axis.update({
      start: {
        x: 50,
        y: 50,
      },
      end: {
        x: 400,
        y: 50,
      },
    });
    const bbox = axis.getBBox();
    axis.update({
      start: {
        x: 50,
        y: 50,
      },
      end: {
        x: 100,
        y: 50,
      },
    });
    expect(bbox.width - axis.getBBox().width).toBe(300);
  });

  it('animate bbox', () => {
    axis.update({
      start: {
        x: 50,
        y: 50,
      },
      end: {
        x: 400,
        y: 50,
      },
    });
    const bbox = axis.getBBox();
    axis.set('animate', true);
    axis.update({
      start: {
        x: 50,
        y: 50,
      },
      end: {
        x: 100,
        y: 50,
      },
    });
    expect(bbox).toEqual(axis.getBBox());
    expect(bbox.width - axis.getLayoutBBox().width).toBe(300);
  });
});
