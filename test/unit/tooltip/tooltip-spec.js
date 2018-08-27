const expect = require('chai').expect;
const Tooltip = require('../../../src/tooltip/index');

const div = document.createElement('div');
div.id = 'tooltip-container';
div.style.margin = '20px';
document.body.appendChild(div);

const title = 'a tooltip title';
const items = [
    { color: 'red', name: 'name1', value: '1222333' },
    { color: 'blue', name: 'n2', value: '1233' },
    { color: 'yellow', name: 'name3', value: 'swww - afas' }
];
const plotRange = {
  tl: { x: 25, y: 50 },
  tr: { x: 425, y: 50 },
  bl: { x: 25, y: 440 },
  br: { x: 425, y: 440 },
  cc: { x: 225, y: 245 }
};

describe('Tooltip基类测试', () => {

  it('initialize', () => {
    const tooltip = new Tooltip({
      x: 10,
      y: 10,
      items,
      titleContent: title,
      plotRange
    });
    expect(tooltip).be.an.instanceof(Tooltip);
    expect(tooltip.get('x')).to.equal(10);
    expect(tooltip.get('y')).to.equal(10);
    expect(tooltip.get('plotRange').tl.x).to.equal(25);
  });

  it('set content', () => {
    const tooltip = new Tooltip({
      x: 10,
      y: 10,
      plotRange
    });
    tooltip.setContent(title, items);
    expect(tooltip.get('items')[0].name).to.equal('name1');
    expect(tooltip.get('titleContent')).to.equal('a tooltip title');
  });

  it('content change', () => {
    const tooltip = new Tooltip({
      x: 10,
      y: 10,
      items,
      titleContent: title,
      plotRange
    });
    const newItems = [
        { color: 'red', name: 'name1', value: '1222333' },
        { color: 'blue', name: 'name2', value: 'kamenashi - kazuya' },
        { color: 'yellow', name: 'name3', value: 'swww - afas' }
    ];
    const isChanged = tooltip.isContentChange(title, newItems);
    expect(isChanged).to.equal(true);
  });

  it('set position', () => {
    const tooltip = new Tooltip({
      x: 10,
      y: 10,
      items,
      titleContent: title,
      plotRange
    });
    tooltip.setPosition(20, 15);
    expect(tooltip.get('x')).to.equal(20);
    expect(tooltip.get('y')).to.equal(15);
  });

});
