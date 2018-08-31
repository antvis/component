const expect = require('chai').expect;
const Legend = require('../../../src/legend/catHtml');

const LIST_CLASS = 'g2-legend-list';
const MARKER_CLASS = 'g2-legend-marker';


const div = document.createElement('div');
div.id = 'legend';
div.style.margin = '20px';
document.body.appendChild(div);

// const canvas = new Canvas({
//   containerId: 'legend',
//   width: 500,
//   height: 500
// });

const symbols = [ 'circle', 'diamond', 'square', 'triangle', 'triangle-down' ];
const colors = [ '#ff6600', '#b01111', '#ac5724', '#572d8a', '#333333', '#7bab12', '#c25e5e', '#a6c96a', '#133960', '#2586e7' ];

function findNodeByClass(node, className) {
  return node.getElementsByClassName(className)[0];
}

describe('HTML 分类图例', function() {

  it('html 渲染图例，使用默认的模板', function() {

    const items = [];
    for (let i = 0; i < 5; i++) {
      items.push({
        value: 'test ' + i,
        color: colors[i % 10],
        marker: {
          symbol: symbols[i % 5],
          radius: 5,
          fill: colors[i % 10]
        },
        checked: !(i > 2)
      });
    }

    const cfg = {
      items,
      container: div,
      title: {
        text: '图例标题'
      },
      scroll: false
    };
    const legend = new Legend(cfg);
    legend.move(0, 0);

    const legendDom = div.getElementsByClassName('g2-legend')[0];
    expect(legendDom).not.to.be.undefined;
    expect(legendDom.style.position).to.equal('absolute');

    const legendItem = div.getElementsByClassName('g2-legend-list-item')[1];
    expect(legendItem.className).to.equal('g2-legend-list-item item-1 checked');

    // 模拟点击事件
    const event = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true
    });
    legendItem.dispatchEvent(event);
    expect(legendItem.className).to.equal('g2-legend-list-item item-1 unChecked');

    let count = 0;
    legend.on('itemhover', function() {
      count = 1;
    });

    // 模拟 hover 事件
    const hoverEvent = new MouseEvent('mousemove', {
      view: window,
      bubbles: true,
      cancelable: true
    });
    legendItem.dispatchEvent(hoverEvent);
    expect(count).to.equal(0);

    const hoveredLegendItem = div.getElementsByClassName('g2-legend-list-item')[2];
    hoveredLegendItem.dispatchEvent(hoverEvent);
    expect(count).to.equal(1);

    // leave event
    const leaveEvent = new MouseEvent('mouseout', {
      view: window,
      bubbles: true,
      cancelable: true
    });
    // // const titleDom = div.getElementsByClassName('g2-legend-text')[0];
    legendItem.dispatchEvent(leaveEvent);

    div.removeChild(legendDom);
  });

  it('html 渲染图例，传入 dom id', function() {

    const items = [];
    for (let i = 0; i < 5; i++) {
      items.push({
        value: 'test ' + i,
        color: colors[i % 10],
        marker: {
          symbol: symbols[i % 5],
          radius: 5,
          fill: colors[i % 10]
        },
        checked: !(i > 2)
      });
    }

    const cfg = {
      items,
      container: 'legend',
      title: {
        text: '图例标题'
      },
      scroll: false
    };
    const legend = new Legend(cfg);
    legend.move(0, 0);

    const legendDom = div.getElementsByClassName('g2-legend')[0];
    expect(legendDom).not.to.be.undefined;

    const legendItem = div.getElementsByClassName('g2-legend-list-item')[1];
    expect(legendItem.className).to.equal('g2-legend-list-item item-1 checked');
    div.removeChild(legendDom);
  });

  it('html 渲染图例，使用回调函数自定义模板', function() {
    const items = [];
    for (let i = 0; i < 20; i++) {
      items.push({
        value: 'test ' + i,
        color: colors[i % 10],
        marker: {
          symbol: symbols[i % 5],
          radius: 5,
          fill: colors[i % 10]
        },
        checked: (i === 10)
      });
    }

    const cfg = {
      items,
      container: div,
      itemTpl(value, color) {
        const tpl = '<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}" style="cursor:pointer;display: inline-block;width: 85px">' +
        '<i class="g2-legend-marker" style="width:16px;height:16px;border-radius:4px;display:inline-block;margin-right:10px;background-color: {color};"></i>' +
        '<span class="g2-legend-text" style="color:' + color + '">' + value + '</span></li>';
        return tpl;
      },
      width: 500,
      height: 80,
      scroll: false,
      selectedMode: 'single'
    };
    const legend = new Legend(cfg);
    legend.move(0, 0);

    const legendDom = div.getElementsByClassName('g2-legend')[0];
    expect(legendDom).not.to.be.undefined;
    expect(legendDom.style.position).to.equal('absolute');

    const legendItem10 = div.getElementsByClassName('g2-legend-list-item')[10];
    const legendItem11 = div.getElementsByClassName('g2-legend-list-item')[11];
    expect(legendItem10.className).to.equal('g2-legend-list-item item-10 checked');
    expect(legendItem11.className).to.equal('g2-legend-list-item item-11 unChecked');
    // 模拟点击事件
    const event = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true
    });
    legendItem10.dispatchEvent(event);
    expect(legendItem10.className).to.equal('g2-legend-list-item item-10 checked');
    expect(legendItem11.className).to.equal('g2-legend-list-item item-11 unChecked');


    legendItem11.dispatchEvent(event);
    expect(legendItem10.className).to.equal('g2-legend-list-item item-10 unChecked');
    expect(legendItem11.className).to.equal('g2-legend-list-item item-11 checked');
    div.removeChild(legendDom);
  });

  it('html 渲染图例，使用字符串自定义模板', function() {

    const items = [];
    for (let i = 0; i < 35; i++) {
      items.push({
        value: 'test ' + i,
        color: colors[i % 10],
        marker: {
          symbol: symbols[i % 5],
          radius: 5,
          fill: colors[i % 10]
        },
        checked: i === 1
      });
    }

    const cfg = {
      items,
      container: div,
      position: 'bottom',
      maxLength: 500,
      itemTpl: '<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}" style="cursor:pointer;width: 85px"><span class="g2-legend-text" style="color: {color};cursor: pointer;">{value}</span></li>'
    };
    const legend = new Legend(cfg);
    legend.move(0, 0);

    const legendDom = div.getElementsByClassName('g2-legend')[0];
    expect(legendDom).not.to.be.undefined;
    expect(legendDom.style.position).to.equal('absolute');
    expect(legendDom.style.maxWidth).to.equal('500px');

    const legendItem01 = div.getElementsByClassName('g2-legend-list-item')[1];
    expect(legendItem01.className).to.equal('g2-legend-list-item item-1 checked');

    // 模拟点击事件1
    const event1 = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true
    });
    legendItem01.dispatchEvent(event1);
    expect(legendItem01.className).to.equal('g2-legend-list-item item-1 checked');

    const legendItem00 = div.getElementsByClassName('g2-legend-list-item')[0];
    expect(legendItem00.className).to.equal('g2-legend-list-item item-0 unChecked');
    // 模拟点击事件2
    const event2 = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true
    });
    legendItem00.dispatchEvent(event2);
    expect(legendItem00.className).to.equal('g2-legend-list-item item-0 checked');
    div.removeChild(legendDom);
  });

  it('激活某个项，highlight = false, 为外部向本组件联动留出的接口', function() {
    const items = [];
    for (let i = 0; i < 5; i++) {
      items.push({
        value: 'test ' + i,
        color: colors[i % 10],
        marker: {
          symbol: symbols[i % 5],
          radius: 5,
          fill: colors[i % 10]
        },
        checked: !(i > 2)
      });
    }

    const cfg = {
      items,
      container: div,
      title: {
        text: '图例标题'
      },
      scroll: false,
      highlight: false
    };
    const legend = new Legend(cfg);
    legend.move(50, 0);

    const legendWrapper = legend.get('legendWrapper');
    const itemListDom = findNodeByClass(legendWrapper, LIST_CLASS);
    const childNodes = itemListDom.childNodes;

    legend.activate(items[0].value);
    let childMarkerDom = findNodeByClass(childNodes[0], MARKER_CLASS);
    expect(childMarkerDom.style.opacity).eql('1');
    childMarkerDom = findNodeByClass(childNodes[1], MARKER_CLASS);
    expect(childMarkerDom.style.opacity).eql('0.5');

    legend.unactivate();
    childMarkerDom = findNodeByClass(childNodes[0], MARKER_CLASS);
    expect(childMarkerDom.style.opacity).eql('1');
    childMarkerDom = findNodeByClass(childNodes[1], MARKER_CLASS);
    expect(childMarkerDom.style.opacity).eql('1');

    const legendDom = div.getElementsByClassName('g2-legend')[0];
    div.removeChild(legendDom);
  });

  it('激活某个项，highlight = true, 为外部向本组件联动留出的接口', function() {
    const items = [];
    for (let i = 0; i < 5; i++) {
      items.push({
        value: 'test ' + i,
        color: colors[i % 10],
        marker: {
          symbol: symbols[i % 5],
          radius: 5,
          fill: colors[i % 10]
        },
        checked: !(i > 2)
      });
    }

    const cfg = {
      items,
      container: div,
      title: {
        text: '图例标题'
      },
      scroll: false,
      highlight: true
    };
    const legend = new Legend(cfg);
    legend.move(50, 0);

    const legendWrapper = legend.get('legendWrapper');
    const itemListDom = findNodeByClass(legendWrapper, LIST_CLASS);
    const childNodes = itemListDom.childNodes;

    legend.activate(items[0].value);
    let childMarkerDom = findNodeByClass(childNodes[0], MARKER_CLASS);
    expect(childMarkerDom.style.border).eql('1px solid rgb(51, 51, 51)');
    childMarkerDom = findNodeByClass(childNodes[1], MARKER_CLASS);
    expect(childMarkerDom.style.border).eql('');

    legend.unactivate();
    childMarkerDom = findNodeByClass(childNodes[0], MARKER_CLASS);
    expect(childMarkerDom.style.border).eql('1px solid rgb(255, 255, 255)');
    childMarkerDom = findNodeByClass(childNodes[1], MARKER_CLASS);
    expect(childMarkerDom.style.border).eql('1px solid rgb(255, 255, 255)');

    const legendDom = div.getElementsByClassName('g2-legend')[0];
    div.removeChild(legendDom);
  });

  it('获取宽和高', function() {
    const items = [];
    for (let i = 0; i < 5; i++) {
      items.push({
        value: 'test ' + i,
        color: colors[i % 10],
        marker: {
          symbol: symbols[i % 5],
          radius: 5,
          fill: colors[i % 10]
        },
        checked: !(i > 2)
      });
    }

    const cfg = {
      items,
      container: div,
      title: {
        text: '图例标题'
      }
    };
    const legend = new Legend(cfg);
    const width = legend.getWidth();
    const height = legend.getHeight();
    expect(Math.floor(width)).eql(346);
    expect(Math.floor(height)).eql(75);
    legend.destroy();
  });

  it('缩略文本1', function() {
    const items = [];
    const values = [ '', 'a', 'aaa', 'aaaaa', 'aaaaaaa' ];
    for (let i = 0; i < 5; i++) {
      items.push({
        value: values[i],
        color: colors[i % 10],
        marker: {
          symbol: symbols[i % 5],
          radius: 5,
          fill: colors[i % 10]
        },
        checked: true
      });
    }

    const cfg = {
      items,
      container: div,
      title: {
        text: '图例标题'
      },
      'g2-legend-list-item': {
        width: '30px',
        marginRight: 0
      },
      abridgeText: true
    };
    const legend = new Legend(cfg);
    const legendWrapper = legend.get('legendWrapper');
    const itemListDom = findNodeByClass(legendWrapper, LIST_CLASS);
    const childNodes = itemListDom.childNodes;

    const overEvent = new Event('mouseover', {
      clientX: 0,
      clientY: 0
    }, true, true);
    childNodes[0].dispatchEvent(overEvent);

    const outEvent = new Event('mouseout', {
      clientX: 0,
      clientY: 0
    }, true, true);
    childNodes[0].dispatchEvent(outEvent);

    const legendDom = div.getElementsByClassName('g2-legend')[0];
    div.removeChild(legendDom);
    legend.destroy();
  });

  it('缩略文本 fontSize with pt', function() {
    const items = [];
    const values = [ '', 'a', 'aaa', 'aaaaa', 'aaaaaaa' ];
    for (let i = 0; i < 5; i++) {
      items.push({
        value: values[i],
        color: colors[i % 10],
        marker: {
          symbol: symbols[i % 5],
          radius: 5,
          fill: colors[i % 10]
        },
        checked: true
      });
    }
    const cfg = {
      items,
      container: div,
      title: {
        text: '图例标题'
      },
      'g2-legend-list-item': {
        width: '10px',
        marginRight: 0
      },
      textStyle: {
        fill: '#333',
        fontSize: '12pt',
        textAlign: 'middle',
        textBaseline: 'top',
        fontFamily: '"-apple-system", BlinkMacSystemFont, "Segoe UI", Roboto,"Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei",SimSun, "sans-serif"'
      },
      abridgeText: true
    };
    const legend = new Legend(cfg);
    const legendDom = div.getElementsByClassName('g2-legend')[0];
    div.removeChild(legendDom);
    legend.destroy();
  });

  it('缩略文本 fontSize with px', function() {
    const items = [];
    const values = [ '', 'a', 'aaa', 'aaaaa', 'aaaaaaaaaaaa' ];
    for (let i = 0; i < 5; i++) {
      items.push({
        value: values[i],
        color: colors[i % 10],
        marker: {
          symbol: symbols[i % 5],
          radius: 5,
          fill: colors[i % 10]
        },
        checked: true
      });
    }

    const cfg = {
      items,
      container: div,
      title: {
        text: '图例标题'
      },
      'g2-legend-list-item': {
        width: '20px',
        marginRight: 0
      },
      textStyle: {
        fill: '#333',
        fontSize: '10px',
        textAlign: 'middle',
        textBaseline: 'top',
        fontFamily: '"-apple-system", BlinkMacSystemFont, "Segoe UI", Roboto,"Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei",SimSun, "sans-serif"'
      },
      abridgeText: true
    };
    const legend = new Legend(cfg);
    const legendDom = div.getElementsByClassName('g2-legend')[0];
    div.removeChild(legendDom);
    legend.destroy();
  });
});
