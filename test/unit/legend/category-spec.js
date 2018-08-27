const expect = require('chai').expect;
const Util = require('../../../src/util');
const G = require('@antv/g/src');
const Canvas = G.Canvas;
const Event = Util.Event;
const Legend = require('../../../src/legend/category');


function findShapeByName(group, name) {
  return group.findBy(node => {
    return node.name === name;
  });
}

const div = document.createElement('div');
div.id = 'legend';
div.style.margin = '20px';
document.body.appendChild(div);

const canvas = new Canvas({
  containerId: 'legend',
  width: 500,
  height: 500
});

const symbols = [ 'circle', 'diamond', 'square', 'triangle', 'triangle-down' ];
const colors = [ '#ff6600', '#b01111', '#ac5724', '#572d8a', '#333333', '#7bab12', '#c25e5e', '#a6c96a', '#133960', '#2586e7' ];

describe('分类图例', function() {
  it('默认', function() {
    const items = [];
    for (let i = 0; i < 5; i++) {
      items.push({
        value: 'test ' + i,
        attrValue: colors[i],
        marker: i !== 2 ? {
          symbol: symbols[i],
          radius: 5,
          fill: colors[i],
          stroke: '#ccc'
        } : null,
        checked: i === 2// 选中状态
      });
    }

    const legend = canvas.addGroup(Legend, {
      items,
      itemGap: 10,
      title: {
        fill: '#f80',
        fontSize: 12,
        textAlign: 'start',
        textBaseline: 'top',
        text: '水平图例'
      }
    });

    canvas.draw();
    const itemsGroup = legend.get('itemsGroup');
    // expect(legend.get('children')[0].get('type')).to.equal('rect');
    expect(legend.getCount()).to.equal(2);
    expect(itemsGroup.getCount()).to.equal(5);
    expect(legend._wrap__onClick).to.be.an.instanceof(Function);
    // expect(legend._wrap__onMousemove).to.be.an.instanceof(Function);

    // 点击事件测试1：不允许全部取消选中并且当前只有一个图例项被选中
    const targetItem = itemsGroup.get('children')[2];
    const event1 = new Event('click', {
      clientX: 100,
      clientY: 316
    }, true, true);
    event1.currentTarget = targetItem.get('children')[0];
    expect(targetItem.get('checked')).to.be.true;
    legend.trigger('click', [ event1 ]);
    expect(itemsGroup.get('children')[0].get('checked')).to.be.false;
    expect(itemsGroup.get('children')[1].get('checked')).to.be.false;
    expect(itemsGroup.get('children')[2].get('checked')).to.be.true;
    expect(itemsGroup.get('children')[3].get('checked')).to.be.false;
    expect(itemsGroup.get('children')[4].get('checked')).to.be.false;

    // 点击事件测试2：不允许全部取消选中并且当前只有一个图例项被选中
    const event2 = new Event('click', {
      clientX: 100,
      clientY: 316
    }, true, true);
    event2.currentTarget = itemsGroup.get('children')[0].get('children')[2];
    expect(targetItem.get('checked')).to.be.true;
    legend.trigger('click', [ event2 ]);
    expect(itemsGroup.get('children')[0].get('checked')).to.be.true;
    expect(itemsGroup.get('children')[1].get('checked')).to.be.false;
    expect(itemsGroup.get('children')[2].get('checked')).to.be.true;
    expect(itemsGroup.get('children')[3].get('checked')).to.be.false;
    expect(itemsGroup.get('children')[4].get('checked')).to.be.false;
  });

  it('默认，不可点击', function() {
    canvas.clear();
    const items = [];
    for (let i = 0; i < 5; i++) {
      items.push({
        value: 'test ' + i,
        attrValue: colors[i],
        marker: {
          symbol: symbols[i],
          radius: 5,
          fill: colors[i]
        },
        checked: true
      });
    }

    const legend = canvas.addGroup(Legend, {
      items,
      allowAllCanceled: true,
      itemGap: 10,
      title: null,
      clickable: false,
      itemFormatter: val => {
        return '(' + val + ')';
      }
    });
    legend.move(0, 50);
    legend.id = '2';

    canvas.draw();
    expect(legend._wrap__onClick).to.be.undefined;
    expect(legend._wrap__onMousemove).to.be.an.instanceof(Function);
  });

  it('默认，只可单次点击。', function() {
    const items = [];
    for (let i = 0; i < 5; i++) {
      items.push({
        value: 'test ' + i,
        attrValue: colors[i],
        marker: {
          symbol: symbols[i],
          radius: 5,
          fill: colors[i],
          stroke: '#ccc'
        },
        checked: i === 2
      });
    }

    const legend = canvas.addGroup(Legend, {
      items,
      allowAllCanceled: true,
      itemGap: 10,
      title: {
        fill: '#f80',
        fontSize: 12,
        textAlign: 'start',
        textBaseline: 'top',
        text: '水平图例'
      },
      selectedMode: 'single'
    });
    legend.id = '3';

    legend.move(0, 100);

    canvas.draw();
    const itemGroups = legend.get('itemsGroup').get('children');
    expect(itemGroups[0].get('checked')).to.be.false;
    expect(itemGroups[1].get('checked')).to.be.false;
    expect(itemGroups[2].get('checked')).to.be.true;
    expect(itemGroups[3].get('checked')).to.be.false;
    expect(itemGroups[4].get('checked')).to.be.false;

    // 无效点击事件
    const unusedEvent = new Event('click', {
      clientX: 100,
      clientY: 316
    }, true, true);
    unusedEvent.currentTarget = legend.get('children')[0];
    legend.trigger('click', [ unusedEvent ]);
    expect(itemGroups[0].get('checked')).to.be.false;
    expect(itemGroups[1].get('checked')).to.be.false;
    expect(itemGroups[2].get('checked')).to.be.true;
    expect(itemGroups[3].get('checked')).to.be.false;
    expect(itemGroups[4].get('checked')).to.be.false;

    // 有效点击事件测试
    const event = new Event('click', {
      clientX: 100,
      clientY: 316
    }, true, true);
    event.currentTarget = itemGroups[1].get('children')[0];
    legend.trigger('click', [ event ]);
    expect(itemGroups[0].get('checked')).to.be.false;
    expect(itemGroups[1].get('checked')).to.be.true;
    expect(itemGroups[2].get('checked')).to.be.false;
    expect(itemGroups[3].get('checked')).to.be.false;
    expect(itemGroups[4].get('checked')).to.be.false;
  });

  it('垂直布局图例', function() {
    const items = [];
    for (let i = 0; i < 5; i++) {
      items.push({
        value: 'test ' + i,
        attrValue: colors[i],
        marker: {
          symbol: symbols[i],
          radius: 5,
          fill: colors[i]
        },
        checked: !(i === 3)
      });
    }

    const legend = canvas.addGroup(Legend, {
      items,
      allowAllCanceled: true,
      itemGap: 15,
      layout: 'vertical',
      title: {
        fill: '#f80',
        fontSize: 14,
        textAlign: 'start',
        textBaseline: 'middle',
        text: '垂直图例'
      },
      unCheckStyle: {
        fill: '#ccc',
        fontWeight: 'bold'
      },
      background: {
        fill: '#ccc',
        fillOpacity: 0.2
      },
      textStyle: {
        fill: '#000'
      }
    });
    legend.move(0, 150);
    canvas.draw();
    expect(legend.getCount()).to.equal(2);
    const itemsGroup = legend.get('itemsGroup');
    // expect(Util.snapEqual(itemsGroup.getBBox().width, 50.34765625)).to.be.true;
    expect(itemsGroup.getCount()).to.equal(5);
    const children = itemsGroup.get('children');
    expect(children[0].get('children')[0].attr('fill')).to.equal('#ff6600');
    expect(children[0].get('children')[1].attr('fill')).to.equal('#000');
    expect(children[3].get('children')[0].attr('fill')).to.equal('#ccc');
    expect(children[3].get('children')[1].attr('fill')).to.equal('#ccc');

    // 有效点击事件测试
    const event = new Event('click', {
      clientX: 100,
      clientY: 316
    }, true, true);
    event.currentTarget = children[0].get('children')[0];
    legend.trigger('click', [ event ]);
    expect(children[0].get('children')[0].attr('fill')).to.equal('#ccc');
    expect(children[0].get('checked')).to.be.false;
  });

  // it('水平布局，但是总长度超出了容器宽度，自动换行', function() {
  //   canvas.clear();
  //   const items = [];
  //   for (let i = 0; i < 25; i++) {
  //     items.push({
  //       value: 'test ' + i,
  //       attrValue: colors[i % 10],
  //       marker: {
  //         symbol: symbols[i % 5],
  //         radius: 5,
  //         fill: colors[i % 10]
  //       },
  //       checked: !(i >= 20)
  //     });
  //   }

  //   const legend = canvas.addGroup(Legend, {
  //     items,
  //     allowAllCanceled: true,
  //     itemGap: 20,
  //     itemMarginBottom: 20,
  //     title: {
  //       fill: '#f80',
  //       fontSize: 16,
  //       textAlign: 'start',
  //       textBaseline: 'top',
  //       text: 'Legend-title'
  //     },
  //     maxLength: 500
  //   });
  //   canvas.draw();
  //   const legendBBox = legend.getBBox();
  //   const legendItems = legend.get('itemsGroup');
  //   expect(legendBBox.width).to.be.below(500);
  //   expect(legendItems.getCount()).to.equal(25);
  // });

  it('水平布局，但是总长度超出了容器宽度，自动换行，且每行列对齐', function() {
    canvas.clear();

    const items = [];
    for (let i = 0; i < 25; i++) {
      items.push({
        value: 'test ' + i,
        attrValue: colors[i % 10],
        marker: {
          symbol: symbols[i % 5],
          radius: 5,
          fill: colors[i % 10]
        },
        checked: true
      });
    }

    const legend = canvas.addGroup(Legend, {
      items,
      allowAllCanceled: true,
      itemGap: 10,
      title: {
        fill: '#f80',
        fontSize: 16,
        textAlign: 'start',
        textBaseline: 'middle',
        text: 'Legend-title'
      },
      maxLength: 500,
      background: {
        fill: '#ccc',
        fillOpacity: 0.1,
        lineWidth: 1
      },
      itemMarginBottom: 5,
      itemWidth: 60
    });
    canvas.draw();
    // const legendBBox = legend.getBBox();
    const legendItems = legend.get('itemsGroup');
    // expect(legendBBox.width).to.be.equal(482);
    expect(legendItems.getCount()).to.equal(25);
  });

  it('垂直布局图例，超出容器高度，自动生列，reversed', function() {
    canvas.clear();

    const items = [];
    for (let i = 0; i < 25; i++) {
      items.push({
        value: 'test ' + i,
        attrValue: colors[i % 10],
        marker: {
          symbol: symbols[i % 5],
          radius: 5,
          fill: colors[i % 10]
        },
        checked: true
      });
    }

    const legend = canvas.addGroup(Legend, {
      items,
      allowAllCanceled: true,
      itemGap: 10, // 水平距离
      itemMarginBottom: 20, // 垂直距离
      layout: 'vertical',
      titleGap: 20,
      reversed: true,
      title: {
        fill: '#f80',
        fontSize: 12,
        textAlign: 'start',
        textBaseline: 'top',
        text: '垂直图例1'
      },
      maxLength: 200
    });

    legend.move(50, 0);
    canvas.draw();
    const legendBBox = legend.getBBox();
    expect(legendBBox.height).to.be.equal(196.5);
  });

  it('垂直布局图例，设置了 itemWidth, 超出容器高度，自动生列', function() {
    canvas.clear();

    const items = [];
    for (let i = 0; i < 15; i++) {
      items.push({
        value: i + '',
        attrValue: colors[ i % 10 ],
        marker: {
          symbol: symbols[ i % 5 ],
          radius: 5,
          fill: colors[ i % 10 ]
        },
        checked: true
      });
    }

    const legend = canvas.addGroup(Legend, {
      items,
      allowAllCanceled: true,
      itemGap: 10, // 水平距离
      itemMarginBottom: 20, // 垂直距离
      layout: 'vertical',
      titleGap: 20,
      itemWidth: 30,
      maxLength: 100,
      background: {
        lineWidth: 1,
        stroke: '#ccc'
      }
    });

    // legend.move(50, 0);
    canvas.draw();
    const legendBBox = legend.getBBox();
    expect(legendBBox.height).to.be.equal(82);
    // expect(legendBBox.width).to.equal(192.34765625);
  });

  it('激活某个项，为外部向本组件联动留出的接口', function() {
    canvas.clear();

    const items = [];
    for (let i = 0; i < 15; i++) {
      items.push({
        value: i + '',
        attrValue: colors[ i % 10 ],
        marker: {
          symbol: symbols[ i % 5 ],
          radius: 5,
          fill: colors[ i % 10 ]
        },
        checked: true
      });
    }

    const legend = canvas.addGroup(Legend, {
      items
    });
    legend.move(50, 0);
    canvas.draw();
    const itemGroups = legend.get('itemsGroup').get('children');

    legend.activateItem(items[0].value);
    let markerItem = findShapeByName(itemGroups[0], 'legend-marker');
    expect(markerItem._attrs.fillOpacity).eql(1);
    markerItem = findShapeByName(itemGroups[1], 'legend-marker');
    expect(markerItem._attrs.fillOpacity).eql(0.5);

    legend.unActivateItem();
    markerItem = findShapeByName(itemGroups[0], 'legend-marker');
    expect(markerItem._attrs.fillOpacity).eql(1);
    markerItem = findShapeByName(itemGroups[1], 'legend-marker');
    expect(markerItem._attrs.fillOpacity).eql(1);
  });

  it('鼠标移动和鼠标移开某个项的高亮效果', function() {
    canvas.clear();
    const items = [];
    for (let i = 0; i < 5; i++) {
      items.push({
        value: 'test ' + i,
        attrValue: colors[i],
        marker: {
          symbol: symbols[i],
          radius: 5,
          fill: colors[i]
        },
        checked: i <= 2
      });
    }

    const legend = canvas.addGroup(Legend, {
      items,
      allowAllCanceled: true,
      itemGap: 10,
      title: {
        fill: '#f80',
        fontSize: 12,
        textAlign: 'start',
        textBaseline: 'top',
        text: '水平图例'
      },
      selectedMode: 'single'
    });
    legend.id = '3';

    legend.move(0, 100);

    canvas.draw();
    const itemGroups = legend.get('itemsGroup').get('children');

    const event = new Event('mousemove', {
      clientX: 100,
      clientY: 316
    }, true, true);
    event.currentTarget = itemGroups[0].get('children')[0];
    legend.trigger('mousemove', [ event ]);
    let markerItem = findShapeByName(itemGroups[0], 'legend-marker');
    expect(markerItem._attrs.fillOpacity).eql(1);
    markerItem = findShapeByName(itemGroups[1], 'legend-marker');
    expect(markerItem._attrs.fillOpacity).eql(0.5);

    legend.trigger('mouseleave', [ event ]);
    markerItem = findShapeByName(itemGroups[0], 'legend-marker');
    expect(markerItem._attrs.fillOpacity).eql(1);
    markerItem = findShapeByName(itemGroups[1], 'legend-marker');
    expect(markerItem._attrs.fillOpacity).eql(1);

    // 移动到 checked = false 的项上
    const event2 = new Event('mousemove', {
      clientX: 100,
      clientY: 316
    }, true, true);
    event2.currentTarget = itemGroups[3].get('children')[0];
    legend.trigger('mousemove', [ event2 ]);
    markerItem = findShapeByName(itemGroups[0], 'legend-marker');
    expect(markerItem._attrs.fillOpacity).eql(1);
    markerItem = findShapeByName(itemGroups[3], 'legend-marker');
    expect(markerItem._attrs.fillOpacity).eql(1);
  });

  it('获取宽和高', function() {
    canvas.clear();

    const items = [];
    for (let i = 0; i < 15; i++) {
      items.push({
        value: i + '',
        attrValue: colors[ i % 10 ],
        marker: {
          symbol: symbols[ i % 5 ],
          radius: 5,
          fill: colors[ i % 10 ]
        },
        checked: true
      });
    }

    const legend = canvas.addGroup(Legend, {
      items
    });
    canvas.draw();
    const width = legend.getWidth();
    const height = legend.getHeight();
    expect(Math.floor(width)).eql(521);
    expect(Math.floor(height)).eql(14);
    canvas.clear();
  });
});
