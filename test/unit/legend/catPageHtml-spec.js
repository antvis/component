const expect = require('chai').expect;
const G = require('@antv/g/src');
const Canvas = G.Canvas;
const Legend = require('../../../src/legend/catPageHtml');

const LIST_CLASS = 'g2-legend-list';
const SLIP_CLASS = 'g2-slip';


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

function findNodeByClass(node, className) {
  return node.getElementsByClassName(className)[0];
}

describe('HTML 分类图例 翻页', function() {

  it('翻页', function() {
    const items = [];
    for (let i = 0; i < 5; i++) {
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
      title: {
        text: '图例标题'
      },
      flip: true,
      legendStyle: {
        CONTAINER_CLASS: {
          height: '100px',
          width: '100px',
          position: 'absolute',
          overflow: 'auto',
          fontSize: '12px',
          fontFamily: this.fontFamily,
          lineHeight: '20px',
          color: '#8C8C8C'
        }
      },
      reversed: true
    });
    canvas.draw();

    const legendWrapper = legend.get('legendWrapper');
    const itemListDom = findNodeByClass(legendWrapper, LIST_CLASS);
    const childNodes = itemListDom.childNodes;

    const slipDom = document.getElementsByClassName(SLIP_CLASS)[0];
    const caretUpDom = findNodeByClass(slipDom, 'caret-up');
    const caretDownDom = findNodeByClass(slipDom, 'caret-down');

    const clickUp1 = new Event('click', {
      clientX: 0,
      clientY: 0
    }, true, true);
    caretUpDom.click(clickUp1);
    expect(childNodes[0].style.display).not.eql('none');

    const clickDown2 = new Event('click', {
      clientX: 0,
      clientY: 0
    }, true, true);
    caretDownDom.click(clickDown2);
    expect(childNodes[0].style.display).eql('none');

    const clickUp2 = new Event('click', {
      clientX: 0,
      clientY: 0
    }, true, true);
    caretUpDom.click(clickUp2);
    expect(childNodes[0].style.display).not.eql('none');

    caretDownDom.click(clickDown2);
    caretDownDom.click(clickDown2);
    caretDownDom.click(clickDown2);
    caretDownDom.click(clickDown2);

    // const legendDom = div.getElementsByClassName('g2-legend')[0];
    // div.removeChild(legendDom);
    // div.removeChild(slipDom);
    legend.remove();
  });

  it('获取宽和高', function() {
    const items = [];
    for (let i = 0; i < 5; i++) {
      items.push({
        value: 'test ' + i,
        attrValue: colors[i % 10],
        marker: {
          symbol: symbols[i % 5],
          radius: 5,
          fill: colors[i % 10]
        },
        checked: !(i > 2)
      });
    }

    const legend = canvas.addGroup(Legend, {
      items,
      title: {
        text: '图例标题'
      }
    });
    legend.move(0, 0);
    canvas.draw();
    const width = legend.getWidth();
    const height = legend.getHeight();
    expect(Math.floor(width)).eql(346);
    expect(Math.floor(height)).eql(75);
    // const legendDom = div.getElementsByClassName('g2-legend')[0];
    // div.removeChild(legendDom);
    legend.remove();
  });
});
